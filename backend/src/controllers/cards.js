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
  const owner = req.user._id;
  Card.findById(req.params.cardId).orFail(new NotFoundError('Card not found'))
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card not found');
      }
      if (card.owner.toString() !== owner) {
        throw new ForbiddenError('No enough rights');
      }
      Card.findByIdAndDelete(req.params.cardId)
        .then(() => res.status(200).send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Некорректные данные');
      }
      if (err.name === 'MongoError' || err.code === '11000') {
        throw new ConflictError('Конфликтная ошибка');
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка не найдена')
    }
    res.status(200).send(card);
  })
  .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена')
      }
      res.status(200).send(card);
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

/// ////////////
// const Card = require('../models/card');
// const NotFoundError = require('../utils/notfound-error.js');
// const ConflictError = require('../utils/conflict-error.js');
// const BadRequestError = require('../utils/badrequest-error.js');
// const ForbiddenError = require('../utils/forbidden-error.js');

// const getCards = (req, res, next) => {
//   Card.find({})
//     .then((cards) => res.status(200).send(cards))
//     .catch((err) => {
//       if (err.name === 'ValidationError' || err.name === 'CastError') {
//         throw new BadRequestError('Некорректные данные');
//       }
//       if (err.name === 'MongoError' || err.code === '11000') {
//         throw new ConflictError('Конфликтная ошибка');
//       }
//     })
//     .catch(next);
// };

// const createCard = (req, res, next) => {
//   const owner = req.user._id;
//   const { name, link } = req.body;
//   Card.create({ name, link, owner })
//     .then((card) => res.status(200).send(card))
//     .catch((err) => {
//       if (err.name === 'ValidationError' || err.name === 'CastError') {
//         throw new BadRequestError('Некорректные данные');
//       }
//       if (err.name === 'MongoError' || err.code === '11000') {
//         throw new ConflictError('Конфликтная ошибка');
//       }
//     })
//     .catch(next);
// };

// const deleteCard = (req, res, next) => {
//   Card.findById(req.params.cardId).orFail(new NotFoundError('Карточка не найдена'))
//     .then((card) => {
//       if (card.owner.toString() === req.user._id.toString()) {
//         Card.findByIdAndDelete(card._id)
//           .then(() => res.status(200).send({ message: 'Карточка удалена' }))
//           .catch((err) => {
//             if (err.name === 'ValidationError' || err.name === 'CastError') {
//               throw new BadRequestError('Некорректные данные');
//             }
//             if (err.name === 'MongoError' || err.code === '11000') {
//               throw new ConflictError('Конфликтная ошибка');
//             }
//             throw err;
//           });
//       } else {
//         throw new ForbiddenError('Недостаточно прав');
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'ValidationError' || err.name === 'CastError') {
//         throw new BadRequestError('Некорректные данные');
//       }
//       if (err.name === 'MongoError' || err.code === '11000') {
//         throw new ConflictError('Конфликтная ошибка');
//       }
//     })
//     .catch(next);
// };

// const likeCard = (req, res, next) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true },
//   ).orFail(new NotFoundError('Карточка не найдена'))
//     .then((card) => res.status(200).send(card))
//     .catch((err) => {
//       if (err.name === 'ValidationError' || err.name === 'CastError') {
//         throw new BadRequestError('Некорректные данные');
//       }
//       if (err.name === 'MongoError' || err.code === '11000') {
//         throw new ConflictError('Конфликтная ошибка');
//       }
//     })
//     .catch(next);
// };

// const dislikeCard = (req, res, next) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $pull: { likes: req.user._id } },
//     { new: true },
//   ).orFail(new NotFoundError('Карточка не найдена'))
//     .then((card) => {
//       res.status(200).send(card);
//     })
//     .catch((err) => {
//       if (err.name === 'ValidationError' || err.name === 'CastError') {
//         throw new BadRequestError('Некорректные данные');
//       }
//       if (err.name === 'MongoError' || err.code === '11000') {
//         throw new ConflictError('Конфликтная ошибка');
//       }
//       throw err;
//     })
//     .catch(next);
// };

// module.exports = {
//   getCards,
//   createCard,
//   likeCard,
//   deleteCard,
//   dislikeCard,
// };
