import React from 'react';
import Card from "./Card.js";
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import Header from './Header.js';

function Main(props) {

    const curentUser = React.useContext(CurrentUserContext);
    
    return (
        <>
        <Header link={'sign-in'} text={'Выход'} onClick={props.onLogout} />
        <main className="main">
              <section className="profile">
                  <div className="profile__card">
                      <div className="profile__avatar" style={{ backgroundImage: `url(${curentUser.avatar})` }}>
                          <button className="profile__avatar profile__avatar-edit-button" type="button" onClick={props.onEditAvatar}></button>
                      </div>
                      <div className="profile__info">
                          <h1 className="profile__name">{curentUser.name}</h1>
                          <button type="button" className="profile__button-edit" onClick={props.onEditProfile}></button>
                          <p className="profile__comment">{curentUser.about}</p>
                      </div>
                  </div>
                  <button type="button" className="profile__button-add" onClick={props.onAddPlace}></button>
              </section>
              <section>
                  <ul className="cards">
                    {props.cards.map((card) => (
                        <Card card={card} key={card._id} onCardClick={props.onCardClick} onDeleteCard={props.onDeleteCard} onCardLike={props.onCardLike} />
                    ))}
                  </ul>
              </section>
          </main>
          </>
    );
  }
  
export default Main;