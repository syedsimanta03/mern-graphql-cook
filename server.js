const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

// Import models
const Recipe = require('./models/Recipe');
const User = require('./models/User');
//  GraphQL-Express Middlewre
const { graphiqlExpress, graphqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// Init express
const app = express();

// Cors setup
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

app.use(cors(corsOptions));

// Set up JWT authentication middleware for backend 
app.use(async (req, res, next) => {
  const token = req.headers['authorization'];
  // Backend token validation
  if (token !== 'null') {
    try {
      // Try to verify the JWT token stored in backend
      const currentUser = await jwt.verify(token, process.env.SECRET);
      req.currentUser = currentUser;
      
    } catch (err) {
      console.error(err);
      
    }
  }
  next();
})

// Set up mongoose connection
var dev_db_url = 'mongodb://localhost:27017/cook';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('open', () => console.info('Database connected!✨'));
db.on('error', console.error.bind(console, 'MongoDB connection error:😢'));

// GraphQL use Graphical UI
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
// Connect schema to GraphQL
app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(({ currentUser }) => ({
    schema,
    context: {
      Recipe,
      User,
      currentUser
    }
  }))
);

const port = process.env.PORT || 4444;

app.listen(port, () => `Server running on port ${port} 🔥`);
