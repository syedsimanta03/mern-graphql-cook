import React from 'react'
import UserInfo from './UserInfo'
import UserRecipes from './UserRecipes'

import withAuth from '../withAuth';


// session is coming from index.js props
const Profile = ({ session }) => {
  return (
    <div className='App'>
      <UserInfo session={session} />
      <UserRecipes username={session.getCurrentUser.username} />
    </div>
  );
}

export default withAuth(session => session && session.getCurrentUser)(Profile); 

