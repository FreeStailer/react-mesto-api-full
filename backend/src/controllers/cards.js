const Card = require('../models/card');
const NotFoundError = require('../utils/notfound-error.js');
const ConflictError = require('../utils/conflict-error.js');
const BadRequestError = require('../utils/badrequest-error.js');
const ForbiddenError = require('../utils/forbidden-error.js');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
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

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
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

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId).orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => {
      if (card.owner.toString() === req.user._id.toString()) {
        Card.findByIdAndDelete(card._id)
          .then(() => res.status(200).send({ message: 'Карточка удалена' }))
          .catch((err) => {
            if (err.name === 'ValidationError' || err.name === 'CastError') {
              throw new BadRequestError('Некорректные данные');
            }
            if (err.name === 'MongoError' || err.code === '11000') {
              throw new ConflictError('Конфликтная ошибка');
            }
          });
      } else {
        throw new ForbiddenError('Недостаточно прав');
      }
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

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => res.status(200).send(card))
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

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => {
      res.status(200).send(card);
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

module.exports = {
  getCards,
  createCard,
  likeCard,
  deleteCard,
  dislikeCard,
};
