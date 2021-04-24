import PopupWithForm from "./PopupWithForm.js";
import React from "react";

function DelCardPopup(props) {

    function handleSubmit(e) {
        e.preventDefault();
        props.setLoadingStatus(true);
        props.onDeleteCard();
    }

    return(
        <PopupWithForm onSubmit={handleSubmit} isOpen={props.isOpen} onClose={props.onClose} buttonText={props.isLoading ? 'Удаление...' : 'Да'} 
                       popupId="del-popup" title="Вы уверены?" formId="del-popup">
        </PopupWithForm>
    )
}

export default DelCardPopup