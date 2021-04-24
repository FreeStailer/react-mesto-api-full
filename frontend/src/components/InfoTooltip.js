import React from 'react';
import nice from '../images/nice.svg';
import error from '../images/error.svg';

function InfoTooltip(props) {

    return (
        <div id={props.popupId} className={`modal modal_profile ${props.isOpen ? "modal_open" : ""}`}>
            <div className="modal__content">
                <button type="button" className="modal__button-close" onClick={props.onClose}></button>
                
                <div>
                    <div className="modal__image-content">
                        <img className="modal__image" alt={props.isSuccess ? 'Всё хорошо' : 'Ошибка'} src={props.isSuccess ? nice : error} />
                        <h2 className="modal__image-title">{props.isSuccess ? 'Вы успешно зарегистрировались' : 'Что-то поло не так Попробуйте ещё раз.'}</h2>
                    </div>
                </div>


            </div>
        </div>
    )
    
}

export default InfoTooltip;