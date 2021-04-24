import PopupWithForm from "./PopupWithForm.js";
import React from "react";

function EditAvatarPopup(props) {

    const avatarRef = React.useRef();

    function handleSubmit(e) {
        e.preventDefault();
        props.setLoadingStatus(true);
        props.onUpdateAvatar({avatar: avatarRef.current.value,});
    }

    return(
        <PopupWithForm onSubmit={handleSubmit} isOpen={props.isOpen} onClose={props.onClose} 
                       buttonText={props.isLoading ? 'Сохранение...' : 'Сохранить'} popupId="avatar-add" title="Обновить аватар" formId="load-avatar">
            <label htmlFor="avatar" className="form__label">
                <input ref={avatarRef} type="url" id="avatar" name="avatar" className="form__item" placeholder="Ссылка на аватар" required />&nbsp;         
                <span className="form__input-error" id="avatar-error"></span>
            </label>
        </PopupWithForm>
    )
}

export default EditAvatarPopup