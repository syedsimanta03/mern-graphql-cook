import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { SIGNIN_USER } from '../../queries';
import Error from './../Error';
import { withRouter } from 'react-router-dom';

const initState = {
  username: '',
  password: ''
};

class Signin extends Component {
  state = { ...initState };

  //  Clear all state/fields values
  clearState = () => {
    this.setState({ ...initState });
  };
  //  Get the typed values
  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  //  After signin create localstorage token, clean state, refetch current user info
  handleSubmit = (event, signinUser) => {
    event.preventDefault();
    signinUser().then(async ({data}) => {
      // console.log(data);
      localStorage.setItem('token', data.signinUser.token);
      await this.props.refetch();
      this.clearState();
      this.props.history.push('/');
    });
  };

  //  Form validation
  validateForm = () => {
    const { username, password } = this.state;
    const isInvalid = !username || !password;
    return isInvalid;
  };

  render() {
    const { username, password } = this.state;
    return (
      <div className='App'>
        <h2 className='App'>Signin</h2>
        <Mutation mutation={SIGNIN_USER} variables={{ username, password }}>
          {(signinUser, { data, loading, error }) => {
            return (
              <form
                className='form'
                onSubmit={event => this.handleSubmit(event, signinUser)}
              >
                <input
                  type='text'
                  name='username'
                  placeholder='Username'
                  value={username}
                  onChange={this.handleChange}
                />

                <input
                  type='password'
                  name='password'
                  placeholder='Password'
                  value={password}
                  onChange={this.handleChange}
                />

                <button
                  type='submit'
                  disabled={loading || this.validateForm()}
                  className='button-primary'
                >
                  Submit
                </button>
                {error && <Error error={error} />}
              </form>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default withRouter(Signin);
