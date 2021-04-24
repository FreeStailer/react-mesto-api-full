const mongoose = require('mongoose');
const user = require('./user.js');

const cardSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        // eslint-disable-next-line no-useless-escape
        const regex = /^https?:\/\/(www\.)?([a-zA-Z0-9\-])+\.([a-zA-Z])+\/?([a-zA-Z0-9\-\._~:\/\?#\[\]@!\$&’\(\)\*\+,;=]+)/gi;
        return regex.test(v);
      },
      message: 'Переданы некорректные данные',
    },
  },
  owner: {
    type: mongoose.ObjectId,
    required: true,
    ref: user,
  },
  likes: [
    {
      type: mongoose.ObjectId,
      ref: user,
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
