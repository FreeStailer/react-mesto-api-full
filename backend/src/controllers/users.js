const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { handleUserError } = require('../utils/errors');
const NotFoundError = require('../utils/notfound-error.js');
const ConflictError = require('../utils/conflict-error.js');
const BadRequestError = require('../utils/badrequest-error.js');

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
        throw new BadRequestError('Данные не прошли валидацию');
      }
      if (err.name === 'MongoError' || err.code === '11000') {
        throw new ConflictError('Такой email уже зарегистрирован');
      }
    })
    .catch(next);
};

const getUserInfo = (req, res) => {
  User.findById(req.user._id).orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => handleUserError(err, res));
};

const getUser = (req, res) => {
  User.findById(req.params.id).orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => handleUserError(err, res));
};

const getUsers = (req, res) => {
  User.find({}).orFail()
    .then((users) => res.status(200).send(users))
    .catch((err) => handleUserError(err, res));
};

const updateUserInfo = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    about: req.body.about,
  }, { new: true, runValidators: true }).orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => handleUserError(err, res));
};

const updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => handleUserError(err, res));
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
      res.status(401).send({ message: 'Авторизация не пройдена' });
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
