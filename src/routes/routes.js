const express = require('express');

const router =  express.Router();

const toursController = require('../controllers/toursController');

router.post('/tour', toursController.createTour);
router.get('/tours', toursController.getAllTour);
router.get('/tour/:tourId', toursController.getTourById)
router.put('/tour/:tourId', toursController.updateTour);
router.delete('/tour/:tourId', toursController.deleteTour)

module.exports = router;