export class Api {
    constructor(options) {
        this._baseUrl = options.baseUrl;
    }

    getInitialCards() {
        return fetch(`${this._baseUrl}/cards`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => {
            if(res.ok) {
                return res.json();
            }
            return Promise.reject(`Ошибочка при получении карточек: ${res.status}`);
        });
    }

    getUserData() {
        return fetch(`${this._baseUrl}/users/me`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => {
            if(res.ok) {
                return res.json();
            }
            return Promise.reject(`Ошибочка при получении персоданных: ${res.status}`);
        });
    }

    addUserCard(values) {
        return fetch(`${this._baseUrl}/cards`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ name: values.place, link: values.link })
        })
        .then(res => {
            if(res.ok) {
                return res.json();
            }
            return Promise.reject(`Ошибочка при добавлении карточки: ${res.status}`);
        });
    }

    takeCardLike(cardId) {
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if(res.ok) {
                return res.json();
            }
            return Promise.reject(`Ошибочка вышла: ${res.status}`);
        });
    }

    //удалить лайк
    removeCardLike(cardId) {
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if(res.ok) {
                return res.json();
            }
            return Promise.reject(`Ошибочка при дизлайке: ${res.status}`);
        });
    }

    changeLikeCardStatus(cardId, isLiked) {
        if(isLiked) {
            return this.takeCardLike(cardId)
        } else {
            return this.removeCardLike(cardId)
        }
    }

    //удалить карточку
    delCard(cardId) {
        return fetch(`${this._baseUrl}/cards/${cardId}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if(res.ok) {
                return res.json();
            }
            return Promise.reject(`Ошибочка при удалении карточки: ${res.status}`);
        });
    }

    //изменить имя и професию на серваке
    patchUserData(values) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ name: values.name, about: values.about })
        })
        .then(res => {
            if(res.ok) {
                return res.json();
            }
            return Promise.reject(`Ошибочка при замене персональных данных: ${res.status}`);
        });
    }

    // изменить аватарку на серваке
    patchUserAvatar(values) {
        return fetch(`${this._baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ avatar: values.avatar })
        })
        .then(res => {
            if(res.ok) {
                return res.json();
            }
            return Promise.reject(`Ошибочка при замене аватарки: ${res.status}`);
        });
    }


}

//база для поключения к WebAPI и использование класса
const api = new Api({
    baseUrl: "https://api.freestailer.nomoredomains.club"
})

export default api