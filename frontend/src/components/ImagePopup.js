import React from 'react';

function ImagePopup(props) {

    const {isOpen, onClose} = props;
    React.useEffect(() => {
      if (!isOpen) return;
      const handleEscapeClose = (event) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
      const handleOverlayClose = (event) => {
        if (event.target.classList.contains('modal') || event.target.classList.contains('modal__button-close')) {
            onClose();
            }
      }
      document.addEventListener("keydown", handleEscapeClose);
      document.addEventListener("mousedown", handleOverlayClose);
      return () => {
        document.removeEventListener("keydown", handleEscapeClose);
        document.removeEventListener("mousedown", handleOverlayClose);
      };
    }, [isOpen, onClose]);

    return (
        <div className={`modal modal_viewer ${props.isOpen ? "modal_open" : ""}`}>
            <div className="modal__content modal__content_viewer">
                <button type="button" className="modal__button-close" onClick={props.onClose}></button>
                <img src={props.card != null ? props.card.link : ''} className="modal__photo" alt={props.card.name} />
                <h2 className="modal__title">{props.card != null ? props.card.name : ''}</h2>
            </div>
        </div>
        );
    }
    
  export default ImagePopup;