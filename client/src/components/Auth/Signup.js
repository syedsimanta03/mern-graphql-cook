import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { SIGNUP_USER } from '../../queries';
import Error from './../Error';
import { withRouter } from 'react-router-dom';

const initState = {
  username: '',
  email: '',
  password: '',
  passwordConfirmation: ''
};

class Signup extends Component {
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

  //  Save user to DB on submit, set localstorage token, clean state, refetch current user info
  handleSubmit = (event, signupUser) => {
    event.preventDefault();
    signupUser().then(async ({data}) => {
      // console.log(data);
      localStorage.setItem('token', data.signupUser.token);
      await this.props.refetch();
      this.clearState();
      this.props.history.push('/');
    });
  };

  //  Form validation
  validateForm = () => {
    const { username, email, password, passwordConfirmation } = this.state;
    const isInvalid =
      !username || !email || !password || password !== passwordConfirmation;
    return isInvalid;
  };

  render() {
    const { username, email, password, passwordConfirmation } = this.state;
    return (
      <div className='App'>
        <h2 className='App'>Signup</h2>
        <Mutation
          mutation={SIGNUP_USER}
          variables={{ username, email, password }}
        >
          {(signupUser, { data, loading, error }) => {
            return (
              <form
                className='form'
                onSubmit={event => this.handleSubmit(event, signupUser)}
              >
                <input
                  type='text'
                  name='username'
                  placeholder='Username'
                  value={username}
                  onChange={this.handleChange}
                />
                <input
                  type='email'
                  name='email'
                  placeholder='Email Address'
                  value={email}
                  onChange={this.handleChange}
                />
                <input
                  type='password'
                  name='password'
                  placeholder='Password'
                  value={password}
                  onChange={this.handleChange}
                />
                <input
                  type='password'
                  name='passwordConfirmation'
                  placeholder='Confirm Password'
                  value={passwordConfirmation}
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

export default withRouter(Signup);
