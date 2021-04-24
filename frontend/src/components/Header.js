import React from 'react';
import { Link } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import logo from '../images/header__logo_big.svg';

function Header(props) {

  const curentUser = React.useContext(CurrentUserContext);

    return (
        <header className="header">
        <img className="header__logo" src={logo} alt="Картинка логотипа Место" />
        <div className="header__data">
          <p className="header__email">{curentUser.email}</p>
          <Link className="header__link" to={props.link} onClick={props.onClick}>{props.text}</Link>
        </div>
        </header>
    );
  }
  
export default Header; 