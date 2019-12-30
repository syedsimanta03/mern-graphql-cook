import React from 'react'
import { Query, Mutation } from 'react-apollo'
import {
  GET_USER_RECIPES,
  DELETE_USER_RECIPE,
  GET_ALL_RECIPES,
  GET_CURRENT_USER
} from '../../queries';
import { Link } from 'react-router-dom'



const handleDelete = deleteUserRecipe => {
  const confirmDelete = window.confirm('Are you sure to delete it?')

  if (confirmDelete) {
    deleteUserRecipe().then(({data}) => {
     // console.log(data);
      
    })
  }
  
}

// This username is coming from react queries/index.js -> schema
const UserRecipes = ({ username }) => {
  return (
    <Query query={GET_USER_RECIPES} variables={{ username }}>
      {({ data, loading, error }) => {

        if(loading) return <div>Loading...</div>
        if(error) return <div>Error</div>

        return (
          <ul>
            <h3>Your Recipes</h3>

              {!data.getUserRecipes.length && (
                <p><strong>You have not added any favorite recipe yet</strong></p>
              )}

            {data.getUserRecipes.map(recipe => (
              <li key={recipe._id}>
                <Link to={`/recipes/${recipe._id}`}>
                  <p>{recipe.name}</p>
                </Link>
                <p>Likes: {recipe.likes}</p>
                {/* Delete the user's specific recipe */}
                <Mutation
                  mutation={DELETE_USER_RECIPE}
                  variables={{ _id: recipe._id }}
                  refetchQueries={() => [
                    { query: GET_ALL_RECIPES },
                    { query: GET_CURRENT_USER }
                  ]}
                  update={(cache, { data: { deleteUserRecipe } }) => {
                    // Read old cache data query
                    const { getUserRecipes } = cache.readQuery({
                      query: GET_USER_RECIPES,
                      variables: { username }
                    });
                    // Update/write data query after CRUD according to the below filter
                    cache.writeQuery({
                      query: GET_USER_RECIPES,
                      variables: { username },
                      data: {
                        getUserRecipes: getUserRecipes.filter(
                          recipe => recipe._id !== deleteUserRecipe._id
                        )
                      }
                    });
                  }}
                >
                  {(deleteUserRecipe, attrs = {}) => (
                    <p
                      className='delete-button'
                      onClick={() => handleDelete(deleteUserRecipe)}
                    >
                      {attrs.loading ? 'deleting...' : 'X'}
                    </p>
                  )}
                </Mutation>
              </li>
            ))}
          </ul>
        );
      }}
    </Query>
  )
}

export default UserRecipes;
