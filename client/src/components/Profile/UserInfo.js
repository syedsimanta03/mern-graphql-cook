import React from 'react'
import { Link } from 'react-router-dom';


// Date format manually
const formatDate = date => {
  const newDate = new Date(date).toLocaleDateString('en-US');
  const newTime = new Date(date).toLocaleTimeString('en-US');
  return `${newDate} at ${newTime}`;
}

// session is coming from Profile component props
const UserInfo = ({ session }) => {
  const { username, email, joinDate, favorites } = session.getCurrentUser;
  return (
    <div className='App'>
      <h3>User Info</h3>
      <p>Username: {username}</p>
      <p>Email: {email}</p>
      <p>Join Date: {formatDate(joinDate)}</p>
      <ul>
        <h3>{username}'s Favorites</h3>
        {favorites.map(favorite => (
          <li key={favorite._id}>
            <Link to={`/recipes/${favorite._id}`}>
              <p>{favorite.name}</p>
            </Link>
          </li>
        ))}
        {!favorites.length && (
          <strong>You have no favorites currently. Go add some!</strong>
        )}
      </ul>
    </div>
  );
}

export default UserInfo
