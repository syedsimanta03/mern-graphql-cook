import React, { Component } from 'react';
import Error from './../Error';
import CKEditor from 'react-ckeditor-component';

import { Mutation } from 'react-apollo';
import { ADD_RECIPE, GET_ALL_RECIPES, GET_USER_RECIPES } from '../../queries';
import { withRouter } from 'react-router-dom';
import withAuth from '../withAuth';

const initState = {
  name: '',
  imageUrl: '',
  instructions: '',
  category: 'Breakfast',
  description: '',
  username: ''
};

class AddRecipe extends Component {
  state = { ...initState };

  //  Clear all state/fields values
  clearState = () => {
    this.setState({ ...initState });
  };

  // Get user name following session detail
  componentDidMount() {
    this.setState({
      username: this.props.session.getCurrentUser.username
    });
  }

  // Form input change track to set state value
  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  // CKEditor
  handleEditorChange = event => {
    const newContent = event.editor.getData();
    this.setState({ instructions: newContent });
  }

  // When form on submit
  handleSubmit = (event, addRecipe) => {
    event.preventDefault();
    addRecipe().then(({ data }) => {
      // console.log(data);
      this.clearState();
      this.props.history.push('/');
    });
  };

  // Validate form
  validateForm = () => {
    const { name, imageUrl, category, description, instructions } = this.state;
    const isInvalid =
      !name || !imageUrl || !category || !description || !instructions;
    return isInvalid;
  };

  // Update the query items number & add it to the root query
  updateCache = (cache, { data: { addRecipe } }) => {
    // Read the old cache data items count ex: maybe 5 items
    const { getAllRecipes } = cache.readQuery({
      query: GET_ALL_RECIPES
    });
    // Read GET_ALL_RECIPES query items count ex: maybe 5 items & add to data ex: maybe 6 items now by adding addRecipe's newly created item
    cache.writeQuery({
      query: GET_ALL_RECIPES,
      data: {
        getAllRecipes: [addRecipe, ...getAllRecipes]
      }
    });
  };

  render() {
    const {
      name,
      imageUrl,
      category,
      description,
      instructions,
      username
    } = this.state;

    return (
      <Mutation
        mutation={ADD_RECIPE}
        variables={{
          name,
          imageUrl,
          category,
          description,
          instructions,
          username
        }}
        update={this.updateCache}
        refetchQueries={() => [
          { query: GET_USER_RECIPES, variables: { username } }
        ]}
      >
        {(addRecipe, { data, loading, error }) => {
          return (
            <div className='App'>
              <h2 className='App'>Add Recipe</h2>
              <form
                className='form'
                onSubmit={event => this.handleSubmit(event, addRecipe)}
              >
                <div className='row'>
                  <input
                    className='six columns'
                    type='text'
                    name='name'
                    placeholder='Recipe Name'
                    value={name}
                    onChange={this.handleChange}
                  />
                  <input
                    className='six columns'
                    type='text'
                    name='imageUrl'
                    placeholder='Recipe Image'
                    value={imageUrl}
                    onChange={this.handleChange}
                  />
                </div>
                <select
                  name='category'
                  onChange={this.handleChange}
                  value={category}
                >
                  <option value='Breakfast'>Breakfast</option>
                  <option value='Lunch'>Lunch</option>
                  <option value='Dinner'>Dinner</option>
                  <option value='Snack'>Snack</option>
                </select>
                <input
                  className='six columns'
                  type='text'
                  name='description'
                  placeholder='Add description'
                  value={description}
                  onChange={this.handleChange}
                />
                <label htmlFor='instructions'>Add Instructions</label>
                <CKEditor
                  name='instructions'
                  content={instructions}
                  events={{ change: this.handleEditorChange }}
                />
                {/*  <textarea
                  type='text'
                  name='instructions'
                  placeholder='Add instructions'
                  value={instructions}
                  onChange={this.handleChange}
                /> */}
                <button
                  type='submit'
                  className='button-primary'
                  disabled={loading || this.validateForm()}
                >
                  Submit
                </button>
                {error && <Error error={error} />}
              </form>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default withAuth(session => session && session.getCurrentUser)(
  withRouter(AddRecipe)
);
