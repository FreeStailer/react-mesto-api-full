const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../utils/notfound-error');

router.use('/users*', auth);
router.use('/', usersRouter);
router.use('/cards*', auth);
router.use('/', cardsRouter);

router.use('/*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
