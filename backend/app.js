require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { PORT = 3000 } = process.env;
const app = express();
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('./src/controllers/users.js');
const { requestLogger, errorLogger } = require('./src/middlewares/logger.js');

app.use(bodyParser.json());

const router = require('./src/routes/index.js');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);

app.use(cors()); ////////////CORS/////////

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
}); 

app.use('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^https?:\/\/(www\.)?([a-zA-Z0-9-])+\.([a-zA-Z])+\/?([a-zA-Z0-9\-_~:/#[\]@!&â€™,;=]+)/),
  }),
}), createUser);

app.use(router);

app.use(errorLogger); // после роутов, но до ошибок

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? `На сервере произошла ошибка${err}` : message,
    });
});

app.listen(PORT, () => {
  console.log(`Slushaem radio na volne ${PORT}`);
});
