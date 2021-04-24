import React from 'react';
import { Link } from 'react-router-dom';

function Register(props) {

    const [email, setEmail] = React.useState('');
    
    function handleSetEmail(e) {
        setEmail(e.target.value);
    }

    const [password, setPassword] = React.useState('');

    function handleSetPassword(e) {
        setPassword(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        props.onInfoTool({
            email,
            password
        })
    }
    
    return (
        <div className="login">
            <h1 className="login__title">Регистрация</h1>
            <form className="login__form" onSubmit={handleSubmit} name="sign-up" method="GET" noValidate>
                <input className="login__input" id="email" name="email" type="text" placeholder="Email" 
                       minLength="2" maxLength="40" onChange={handleSetEmail} value={email} required />
                <input className="login__input" id="password" name="password" type="text" placeholder="Пароль" 
                       minLength="2" maxLength="200" onChange={handleSetPassword} value={password} required />
                <button className="login__submit" type="submit">Зарегистрироваться</button>
            </form>
            <Link className="login__link" to="sign-in">Уже зарегистрированы? Войти</Link>
        </div>
    )
}

export default Register;