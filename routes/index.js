const express = require('express');
const router = express.Router();

const coinController=require('../controllers/coin-controller')

router.get('/', coinController.scrape)

module.exports = router;
