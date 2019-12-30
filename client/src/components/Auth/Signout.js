import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { withRouter } from 'react-router-dom';


const handleSignout = (client, history) => {
  // clear local storage token
  localStorage.setItem('token', '');
  // Apollo client store reset->signout successfully
  client.resetStore();
  // Redirect to Home after Signout
  history.push('/');
};

const Signout = ({history}) => (
  <ApolloConsumer>
    {client => {
    // console.log(client);    
      return (
        <button onClick={() => handleSignout(client, history)}>Signout</button>
      );
    }}
  </ApolloConsumer>
);

export default withRouter(Signout);
