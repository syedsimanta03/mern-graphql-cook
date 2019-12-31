import React from 'react';
import { NavLink } from 'react-router-dom';
import { Fragment } from 'react';
import Signout from './../components/Auth/Signout';

import Notiflix from 'notiflix-react';

// Init the module you want to use. e.g. Notify Module
Notiflix.Notify.Init({});

const Navbar = ({ session }) => (
  <nav>
    {session && session.getCurrentUser ? <NavbarAuth session={session} /> : <NavbarUnAuth />}
  </nav>
);

const NavbarAuth = ({ session }) => (
  <Fragment>
    <ul>
      <li>
        <NavLink to='/' exact>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to='/search'>Search</NavLink>
      </li>
      <li>
        <NavLink to='/recipe/add'>Add Recipe</NavLink>
      </li>
      <li>
        <NavLink to='/profile'>Profile</NavLink>
      </li>
      <li>
        <Signout />
      </li>
      <li>
        Welcome, <strong>{session.getCurrentUser.username}</strong>
      </li>
    </ul>
    <h4>{Notiflix.Notify.Success('Successfully logged in')}</h4>
  </Fragment>
);

const NavbarUnAuth = () => (
  <ul>
    <li>
      <NavLink to='/' exact>
        Home
      </NavLink>
    </li>
    <li>
      <NavLink to='/search'>Search</NavLink>
    </li>
    <li>
      <NavLink to='/signin'>Signin</NavLink>
    </li>
    <li>
      <NavLink to='/signup'>Signup</NavLink>
    </li>
  </ul>
);

export default Navbar;
