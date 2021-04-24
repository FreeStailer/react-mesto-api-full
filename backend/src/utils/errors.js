const handleUserError = (err, res) => {
  if (err.message === 'CastError') {
    res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
  }
  if (err.message === 'ValidationError') {
    res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
  }
  res.status(500).send({ message: 'Ошибка сервера' });
};

const handleCardError = (err, res) => {
  if (err.message === 'CastError') {
    res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
  }
  if (err.message === 'ValidationError') {
    return res.status(400).send({ message: 'Переданы некорректные данные.' });
  }
  return res.status(500).send({ message: '500 - Внутренняя ошибка сервера' });
};

module.exports = { handleUserError, handleCardError };
