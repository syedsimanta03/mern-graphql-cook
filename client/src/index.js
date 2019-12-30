import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import './index.css';

// Apollo Setup
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import withSession from './components/withSession';
// Components
import App from './components/App';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import Navbar from './components/Navbar';
import Search from './components/Recipe/Search';
import AddRecipe from './components/Recipe/AddRecipe';
import Profile from './components/Profile/Profile';
import RecipePage from './components/Recipe/RecipePage';

const client = new ApolloClient({
  // Pull data from the below uri
  uri: 'https://mern-cook.herokuapp.com/graphql',
  // Send localstorage token to DB
  fetchOptions: {
    credentials: 'include'
  },
  // Get header for authorization that contains user token
  request: operation => {
    const token = localStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: token
      }
    });
  },

  // Error handeling
  onError: ({ networkError }) => {
    if (networkError) {
    }
  }
});

// Route setup
const Root = ({ refetch, session }) => (
  <Router>
    <Fragment>
      <Navbar session={session} />
      <Switch>
        <Route path='/' exact component={App} />
        <Route path='/search' component={Search} />
        <Route path='/signin' render={() => <Signin refetch={refetch} />} />
        <Route path='/signup' render={() => <Signup refetch={refetch} />} />
        <Route
          path='/recipe/add'
          render={() => <AddRecipe session={session} />}
        />
        <Route path='/recipes/:_id' component={RecipePage} />
        <Route path='/profile' render={() => <Profile session={session} />} />
        <Redirect to='/' />
      </Switch>
    </Fragment>
  </Router>
);

// Passing current user info to all component by HOC
const RootWithSession = withSession(Root);

ReactDOM.render(
  <ApolloProvider client={client}>
    <RootWithSession />
  </ApolloProvider>,
  document.getElementById('root')
);
