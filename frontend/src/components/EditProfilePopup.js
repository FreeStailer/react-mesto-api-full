import PopupWithForm from './PopupWithForm.js';
import React from "react";
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function EditProfilePopup(props) {
    
    const curentUser = React.useContext(CurrentUserContext);
    React.useEffect(() => {
        setName(curentUser.name);
        setDescription(curentUser.about);
    }, [curentUser]);

    const [name, setName] = React.useState(`${curentUser.name}`);
    const [description, setDescription] = React.useState(`${curentUser.about}`);

    function handleSetName(e) {
        setName(e.target.value)
    }

    function handleSetDescription(e) {
        setDescription(e.target.value)
    }

    function handleSubmit(e) {
        e.preventDefault();
        props.setLoadingStatus(true);
        props.onUpdateUser({
            name,
            about: description,
        });
    }

    return (
        <PopupWithForm isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit} buttonText ={props.isLoading ? 'Сохранение...' : 'Изменить'} popupId="edit" title="Редактировать профиль" formId="edit-profile">
                <label htmlFor="name" className="form__label">
                    <input onChange={handleSetName} value={name || ''} placeholder="Имя" type="text" name="name" id="name" className="form__item" required minLength="2" maxLength="40" />
                    <span className="form__input-error" id="name-error" />
                </label>
                <label htmlFor="about" className="form__label">
                    <input onChange={handleSetDescription} value={description || ''} placeholder="комментарии" type="text" id="about" name="about" className="form__item" required minLength="2" maxLength="200" />        
                    <span className="form__input-error" id="about-error" />
                </label>
        </PopupWithForm>
    );

}

export default EditProfilePopup;