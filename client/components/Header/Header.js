import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Link from 'react-router-dom/Link';
import logo from '../../assets/figaro-mobile.svg';
import './header.css';

const Header = () => (
  <header className="header">
    <Switch>
      <Route
        path="/"
        exact
        component={() => (
          <img className="header__left" src="https://icongr.am/clarity/bars.svg?color=FFFFFF" alt="" />
        )}
      />
      <Route
        path="*"
        exact
        component={() => (
          <Link to="/" name="Home"><img className="header__left" src="https://icongr.am/clarity/close.svg?color=FFFFFF" alt="" /></Link>
        )}
      />
    </Switch>
    <div>
      <img className="header__logo" src={logo} alt="" />
      <span className="header__slogan">Depuis 1826</span>
    </div>
    <img className="header__right" src="https://icongr.am/clarity/user.svg?color=FFFFFF" alt="" />
  </header>
);

export default Header;
