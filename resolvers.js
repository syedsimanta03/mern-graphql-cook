const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

exports.resolvers = {
  /**
  |--------------------------------------------------
  | QUERIES
  |--------------------------------------------------
  */

  Query: {
    /* GET ALL RECIPES */
    getAllRecipes: async (root, args, { Recipe }) => {
      const allRecipes = await Recipe.find().sort({ createdDate: 'desc' });
      return allRecipes;
    },
    /* GET A RECIPE */
    getRecipe: async (root, { _id }, { Recipe }) => {
      const recipe = await Recipe.findOne({ _id });
      return recipe;
    },

    /* SEARCH RECIPE */
    searchRecipes: async (root, { searchTerm }, { Recipe }) => {
      // If searchTerm matches recipe(s) return it/them
      if (searchTerm) {
        const searchResults = await Recipe.find(
          {
            $text: { $search: searchTerm }
          },
          {
            score: { $meta: 'textScore' }
          }
        ).sort({
          score: { $meta: 'textScore' }
        });
        return searchResults;
        // When searchTerm doesn't match show all recipes
      } else {
        const recipes = await Recipe.find().sort({
          likes: 'desc',
          createdDate: 'desc'
        });
        return recipes;
      }
    },
    /* GET USER SPECIFIC(FAV) RECIPES */
    getUserRecipes: async (root, { username }, { Recipe }) => {
      const userRecipes = await Recipe.find({ username }).sort({
        createdDate: 'desc'
      });
      return userRecipes;
    },

    /*  GET CURRENT USER with Ref field*/
    getCurrentUser: async (root, args, { currentUser, User }) => {
      // If no currentuser return null
      if (!currentUser) {
        return null;
      }
      // Otherwise,  find currentUser
      const user = await User.findOne({
        username: currentUser.username
      }).populate({
        path: 'favorites',
        model: 'Recipe'
      });

      return user;
    }
  },

  /**
  |--------------------------------------------------
  | MUTATIONS
  |--------------------------------------------------
  */

  Mutation: {
    /* Add a recipe */
    addRecipe: async (
      root,
      { name, description, category, instructions, username },
      { Recipe }
    ) => {
      const newRecipe = await new Recipe({
        name,
        description,
        category,
        instructions,
        username
      }).save();

      return newRecipe;
    },

    /* SignIN User */
    signinUser: async (root, { username, password }, { User }) => {
      // 1)check if user exists
      const user = await User.findOne({
        username
      });
      // 2)if no user found thow error
      if (!user) {
        throw new Error('User not found');
      }
      // 3)Otherwise, compare user DB saved password with user just typed password
      const isValidPassword = await bcrypt.compare(password, user.password);

      // 4) if invalid user thow error
      if (!isValidPassword) {
        throw new Error('Invalid Password');
      }
      // 5) Otherwise, give this user a token and authorization
      return {
        token: createToken(user, process.env.SECRET, '1hr')
      };
    },

    /*  SignUP User */
    signupUser: async (root, { username, email, password }, { User }) => {
      // 1)check if user already exists
      const user = await User.findOne({
        username
      });
      // 2)if already exists thow error
      if (user) {
        throw new Error('User already exists');
      }
      // 3)Otherwise, If not create a fresh unique user
      const newUser = await new User({
        username,
        email,
        password
      }).save();
      // 4) finally, give this user a token and authorization
      return {
        token: createToken(newUser, process.env.SECRET, '1hr')
      };
    },

    /* DELETE SPPECIFIC USER'S RECIPE */
    deleteUserRecipe: async (root, {_id}, { Recipe }) => {
      const recipe = await Recipe.findOneAndRemove({ _id });
      return recipe;
    },

    /* LOGGEDIN USER CAN LIKE ANY RECIPE */
    likeRecipe: async(root, {_id, username}, { Recipe, User }) => {
      // Increase recipe's like number
      const recipe = await Recipe.findOneAndUpdate({ _id }, { $inc: { likes: 1 }});

      // User
      const user = await User.findOneAndUpdate({ username }, {$addToSet: { favorites: _id } })

      return recipe;

    },
    /* LOGGEDIN USER CAN UNLIKE ANY RECIPE */
    unlikeRecipe: async(root, {_id, username}, { Recipe, User }) => {
      // Increase recipe's like number
      const recipe = await Recipe.findOneAndUpdate({ _id }, { $inc: { likes: -1 }});

      // User
      const user = await User.findOneAndUpdate({ username }, {$pull: { favorites: _id } })

      return recipe;

    }
  }
};
