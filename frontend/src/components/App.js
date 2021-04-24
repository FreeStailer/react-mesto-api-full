import React from 'react';
import { Redirect, Switch, Route, useHistory } from 'react-router-dom';
import Main from './Main.js';
import ImagePopup from './ImagePopup.js';
import api from '../utils/api.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import DelCardPopup from './DelCardPopup.js';
import ProtectedRoute from './ProtectedRoute.js';
import Login from './Login.js';
import Register from './Register.js';
import InfoTooltip from './InfoTooltip.js';
import Header from './Header.js';
import * as auth from '../utils/auth.js';
import Footer from './Footer.js';

function App() {

const [currentUser, setUserData] = React.useState({ _id: '', name: '', about: '', avatar: '', email: ''});
const [loggedIn, setLoggedIn] = React.useState(false);
const [cards, setCards] = React.useState([]);
const history = useHistory();


React.useEffect(() => {
    if (loggedIn) {
        api.getUserData()
        .then((res) => {
            setUserData(res);
        })
        .catch((err) => {
            console.log("Ошибка в эффекте получения данных пользователя",err)
        })
    }
}, [loggedIn]);

React.useEffect(() => {
    if (loggedIn) {
        api.getInitialCards()
        .then((res) => {
            setCards(res.reverse());
        })
        .catch((err) => {
            console.log("Ошибка в эффекте получения карточек", err)
        })
    }
}, [loggedIn]);

//validnost' tokena
React.useEffect(() => {
    const token = localStorage.getItem('token');
    if(token) {
        auth.tokenValid(token)
        .then((res) => {
            setLoggedIn(true);
            setUserData(res.email);
        }).catch((err) => {
            console.log('Ошибка в эфекте "валидации" токена',err);
        })
    }
}, [history]);

const handleLogin = (email, password) => {
    auth.login(email, password)
    .then(() => {
        setUserData( email );
        setLoggedIn(true);
    }).catch((err) =>{
        console.log('handlelogin eror', err);
        setIsRegisterSuccess(false);
        setIsInfoToolOpen(true);
    });
}

function handleLogout() {
    localStorage.removeItem('token');
    setLoggedIn(false);
    setUserData({name: '', about: '', avatar: '', email: ''});
}

function handleCardLike(card) {
    const isLiked = card.likes.some(i => i === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
        const newCards = cards.map((c) => c._id === card._id ? newCard : c);
        setCards(newCards);
    }).catch((err) => {
        console.log(err);
    });
}

const [delCard, setDelCard] = React.useState(null);

function handleCardDelete() {
    api.delCard(delCard._id).then(() => {
        const newCards = cards.filter((c) => c._id !== delCard._id);
        setCards(newCards);
        closeAllPopups()
    }).catch((err) => {
        console.log('Ошибка в функции удалении карточки', err);
    })
}

function handleUpdateUser(userData) {
    api.patchUserData(userData)
    .then((res) => {
        setUserData(res.data);
        closeAllPopups()
    }).catch((err) => {
        console.log('Ошибка в функции изменения юзера', err)
    })
}

function handleUpdateAvatar(userData) {
    api.patchUserAvatar(userData)
    .then((res) => {
        setUserData(res.data);
        closeAllPopups();
    }).catch((err) => {
        console.log('Ошибка в функции изменения аватарки', err)
    })
}

function handleAddPlaceSubmit(userCardData) {
    api.addUserCard(userCardData)
    .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups()
    }).catch((err) => {
        console.log('Ошибка в функции добавлении карточки', err)
    })
}

const [popupLoading, setPopupLoading] = React.useState(false);

//из предыдущего спринта:
const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
}

const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
}

const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
}

const [isDelPopupOpen, setIsDelPopupOpen] = React.useState(false);
function handleDelClick(card) {
    setIsDelPopupOpen(true)
    setDelCard(card)
}


const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
const [selectedCard, setSelectedCard] = React.useState({});
function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
}

function closeAllPopups() {
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setIsImagePopupOpen(false)
    setIsDelPopupOpen(false)
    setPopupLoading(false);
    setIsInfoToolOpen(false);
}

const [isInfoToolOpen, setIsInfoToolOpen] = React.useState(false);

const [isRegisterSuccess, setIsRegisterSuccess] = React.useState(true);
function handleRegister(registerData) {
    auth.register(registerData)
    .then((res) => { 
        if (res !== null) {
            setIsRegisterSuccess(true);
            setIsInfoToolOpen(true);
            history.push('/sign-in');
        }})
    .catch((err) => {
        console.log('Ошибка в функции регистрации пользователя', err);
        setIsRegisterSuccess(false);
        setIsInfoToolOpen(true);
    })
}

  return (
    <CurrentUserContext.Provider value={currentUser}>
        <div className="page__content">
            <Switch>
                <Route path={'/sign-up'}>
                    {loggedIn ? <Redirect to="./" /> : <>
                                                        <Header link={'sign-in'} text={'Войти'} />
                                                        <Register onInfoTool={handleRegister}/>
                                                       </>}
                </Route>

                <Route path={'/sign-in'}>
                    {loggedIn ? <Redirect to="./" /> : <>
                                                        <Header link={'sign-up'} text={'Регистрация'} />
                                                        <Login onInfoTool={handleLogin}/>
                                                       </>}
                </Route>

                <ProtectedRoute component={Main} path={'/'} cards={cards} onCardLike={handleCardLike} onDeleteCard={handleDelClick}
                                onEditProfile={handleEditProfileClick} onAddPlace={handleAddPlaceClick} 
                                onEditAvatar={handleEditAvatarClick} onCardClick={handleCardClick}
                                onLogout={handleLogout} isLoggedIn={loggedIn}>
                

                    <EditProfilePopup onUpdateUser={handleUpdateUser} isOpen={isEditProfilePopupOpen} 
                                    onClose={closeAllPopups} 
                                    isLoading={popupLoading} setLoadingStatus={setPopupLoading} />
                    
                    <EditAvatarPopup onUpdateAvatar={handleUpdateAvatar} isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups}
                                    isLoading={popupLoading} setLoadingStatus={setPopupLoading} />
                    
                    <AddPlacePopup onAddCard={handleAddPlaceSubmit} isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} 
                                isLoading={popupLoading} setLoadingStatus={setPopupLoading}/>
                    
                    <DelCardPopup onDeleteCard={handleCardDelete} isOpen={isDelPopupOpen} onClose={closeAllPopups} 
                                isLoading={popupLoading} setLoadingStatus={setPopupLoading}/>
                    
                    <ImagePopup isOpen={isImagePopupOpen} card={selectedCard} onClose={closeAllPopups}/>
                </ProtectedRoute>
            </Switch>
            <InfoTooltip isSuccess={isRegisterSuccess} isOpen={isInfoToolOpen} onClose={closeAllPopups} />
            <Footer />
        </div>
    </CurrentUserContext.Provider>
  );
}

export default App;