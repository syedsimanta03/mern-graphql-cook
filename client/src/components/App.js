import React from 'react';
import './App.css';

// Apollo Query
import { Query } from 'react-apollo';
import { GET_ALL_RECIPES } from '../queries';
import RecipeItem from './Recipe/RecipeItem';
import Spinner from './Spinner';

const App = () => (
  <div className='App'>
    <h1 className="main-title">Find Recipes That You <strong>Love</strong></h1>

    <Query query={GET_ALL_RECIPES}>
      {({ data, loading, error }) => {
        if (loading) return <Spinner/>;
        if (error) return <div>Error</div>;
        return (
          <ul className="cards">
            {data.getAllRecipes.map(recipe => (
              <RecipeItem key={recipe._id} {...recipe} />
            ))}
          </ul>
        );
      }}
    </Query>
  </div>
);

export default App;
