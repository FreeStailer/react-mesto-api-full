const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../utils/notfound-error.js');
const ConflictError = require('../utils/conflict-error.js');
const BadRequestError = require('../utils/badrequest-error.js');
const UnauthorizedError = require('../utils/unauthorized-error.js');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }).then((user) => {
      const userData = {
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      };
      res.send(userData);
    }))
    .then((user) => res.status(200).send({ mail: user.email }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Некорректные данные');
      }
      if (err.name === 'MongoError' || err.code === '11000') {
        throw new ConflictError('Конфликтная ошибка');
      }
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id).orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Некорректные данные');
      }
      if (err.name === 'MongoError' || err.code === '11000') {
        throw new ConflictError('Конфликтная ошибка');
      }
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.id).orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Некорректные данные');
      }
      if (err.name === 'MongoError' || err.code === '11000') {
        throw new ConflictError('Конфликтная ошибка');
      }
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({}).orFail(new NotFoundError('Пользователь не найден'))
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Некорректные данные');
      }
      if (err.name === 'MongoError' || err.code === '11000') {
        throw new ConflictError('Конфликтная ошибка');
      }
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    about: req.body.about,
  }, { new: true, runValidators: true }).orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Некорректные данные');
      }
      if (err.name === 'MongoError' || err.code === '11000') {
        throw new ConflictError('Конфликтная ошибка');
      }
    })
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Некорректные данные');
      }
      if (err.name === 'MongoError' || err.code === '11000') {
        throw new ConflictError('Конфликтная ошибка');
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret',
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch(() => {
      throw new UnauthorizedError('Авторизация не пройдена');
    })
    .catch(next);
};

module.exports = {
  login,
  createUser,
  getUser,
  getUsers,
  getUserInfo,
  updateUserInfo,
  updateUserAvatar,
};
