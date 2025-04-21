const express = require('express');
const router = express.Router();

const { addCard, getAllCards, reviewCard } = require('../controller/flashController');

router.post('/add',addCard)

router.get('/:userId',getAllCards);

router.post('/review', reviewCard);

module.exports = router;