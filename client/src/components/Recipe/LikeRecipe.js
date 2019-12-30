import React, { Component } from 'react';

import withSession from '../withSession';
import { Mutation } from 'react-apollo';
import { LIKE_RECIPE, UNLIKE_RECIPE, GET_RECIPE } from '../../queries';

class LikeRecipe extends Component {
  state = {
    liked: false,
    username: ''
  };

  componentDidMount() {
    // Get loggedin user & set to state
    if (this.props.session.getCurrentUser) {
      const { username, favorites } = this.props.session.getCurrentUser;
      // Check previously liked recipe
      const { _id } = this.props;
      const prevLiked =
        favorites.findIndex(favorite => favorite._id === _id) > -1;
      this.setState({
        username: username,
        liked: prevLiked
      });
    }
  }

  // Handle recipe like/unlike
  handleClick = (likeRecipe, unlikeRecipe) => {
    this.setState(
      prevState => ({
        // Toggle like
        liked: !prevState.liked
      }),
      () => this.handleLike(likeRecipe, unlikeRecipe)
    );
  };
  //  Add like/unlike frontend + backend
  handleLike = (likeRecipe, unlikeRecipe) => {
    if (this.state.liked) {
      likeRecipe().then(async ({ data }) => {
        // console.log(data);
        await this.props.refetch();
      });
    } else {
      //  unlike mutation
      unlikeRecipe().then(async ({ data }) => {
        // console.log(data);
        await this.props.refetch();
      });
    }
  };

  //  Update like after like
  updateLike = (cache, { data: { likeRecipe } }) => {
    const { _id } = this.props;
    const { getRecipe } = cache.readQuery({
      query: GET_RECIPE,
      variables: { _id }
    });
    //  Got old data & now write to the new query +1
    cache.writeQuery({
      query: GET_RECIPE,
      variables: { _id },
      data: {
        getRecipe: { ...getRecipe, likes: likeRecipe.likes + 1 }
      }
    });
  };
  //  Update unlike after unlike
  updateUnlike = (cache, { data: { unlikeRecipe } }) => {
    const { _id } = this.props;
    const { getRecipe } = cache.readQuery({
      query: GET_RECIPE,
      variables: { _id }
    });
    //  Got old data & now write to the new query -1
    cache.writeQuery({
      query: GET_RECIPE,
      variables: { _id },
      data: {
        getRecipe: { ...getRecipe, likes: unlikeRecipe.likes - 1 }
      }
    });
  };

  // Conditionally show the button if there is a user loggedin
  render() {
    const { liked, username } = this.state;
    const { _id } = this.props;

    return (
      <Mutation 
      mutation={UNLIKE_RECIPE}
      variables={{ _id, username }}
      update={this.updateUnlike}
       >
        {unlikeRecipe => (
          <Mutation
            mutation={LIKE_RECIPE}
            variables={{ _id, username }}
            update={this.updateLike}
          >
            {likeRecipe => {
              return (
                username && (
                  <button
                    onClick={() => this.handleClick(likeRecipe, unlikeRecipe)}
                  >
                    {liked ? 'Unlike' : 'Like'}
                  </button>
                )
              );
            }}
          </Mutation>
        )}
      </Mutation>
    );
  }
}

export default withSession(LikeRecipe);
