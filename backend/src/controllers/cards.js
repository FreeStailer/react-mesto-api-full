const Card = require('../models/card');
const { handleCardError } = require('../utils/errors');
const NotFoundError = require('../utils/notfound-error.js');
const ForbiddenError = require('../utils/forbidden-error.js');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => handleCardError(err, res));
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => handleCardError(err, res));
};

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId).orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => {
      if (card.owner.toString() === req.user._id.toString()) {
        Card.findByIdAndDelete(card._id)
          .then(() => res.status(200).send({ message: 'Карточка удалена' }))
          .catch((err) => handleCardError(err, res));
      } else {
        throw new ForbiddenError('Недостаточно прав');
      }
    })
    .catch((err) => handleCardError(err, res));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => res.status(200).send(card))
    .catch((err) => handleCardError(err, res));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => handleCardError(err, res));
};

module.exports = {
  getCards,
  createCard,
  likeCard,
  deleteCard,
  dislikeCard,
};
