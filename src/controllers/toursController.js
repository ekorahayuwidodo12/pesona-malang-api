const path = require('path');
const fs = require('fs');
const Tour = require('../models/tour');

exports.createTour = (req, res, next) => {

    if(!req.file) {
        const err = new Error('Image harus di upload');
        err.errorStatus = 422;
        throw err;
    }

    const name = req.body.name;
    const category = req.body.category;
    const address = req.body.address;
    const operationalHour = req.body.operationalHour;
    const ticket = req.body.ticket;
    const description = req.body.description;
    const image = req.file.path;

    const tour = new Tour({
        name: name,
        category: category,
        address: address,
        operationalHour: operationalHour,
        ticket: ticket,
        description: description,
        image: image
    });

    tour.save()
    .then(result => {
        res.status(201).json({
            message: 'Create Tour Success',
            data: result
        });
    })
    .catch(err => {
        console.log('err: ', err);
    });
}

exports.getAllTour = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = req.query.perPage || 5;
    let totalItems;

    Tour.find()
    .countDocuments()
    .then(count => {
        totalItems = count;
        return Tour.find()
        .skip((parseInt(currentPage) - 1) * parseInt(perPage))
        .limit(parseInt(perPage))
    })
    .then(result => {
        res.status(200).json({
            message: 'Tour data succesfully called',
            data: result,
            total_data: totalItems,
            per_page: parseInt(perPage),
            current_page: parseInt(currentPage)
        })
    })
    .catch(err => {
        next(err);
    })
}

exports.getTourById = (req, res, next) => {
    const tourId = req.params.tourId;
    Tour.findById(tourId)
    .then(result => {
        if(!result) {
            const error = new Error('Tour data not found');
            err.errorStatus = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Tour data succesfully called',
            data: result
        })
    })
    .catch (err => {
        next(err);
    })
}

exports.updateTour = (req, res, next) => {

    if(!req.file) {
        const err = new Error('Image harus di upload');
        err.errorStatus = 422;
        throw err;
    }

    const name = req.body.name;
    const category = req.body.category;
    const address = req.body.address;
    const operationalHour = req.body.operationalHour;
    const ticket = req.body.ticket;
    const description = req.body.description;
    const image = req.file.path;
    const tourId = req.params.tourId;

    Tour.findById(tourId)
    .then(tour => {
        if(!tour) {
            const err = new Error('Blog post tidak ditemukan');
            err.errorStatus = 404;
            throw err;
        }

        tour.name = name;
        tour.category = category;
        tour.address = address;
        tour.operationalHour = operationalHour;
        tour.ticket = ticket;
        tour.description = description;
        tour.image = image;

        return tour.save();
    })
    .then(result => {
        res.status(200).json({
            message: 'Update Success',
            data: result
        })
    })
    .catch(err => {
        next(err);
    })
}

exports.deleteTour = (req, res, next) => {
    const tourId = req.params.tourId;

    Tour.findById(tourId)
    .then(tour => {
        if(!tour) {
            const error = new Error('Tour data not found');
            error.errorStatus = 404;
            throw error;
        }

        removeImage(tour.image);
        return Tour.findByIdAndRemove(tourId);
    })
    .then(result => {
        res.status(200).json({
            message: 'Delete tour data successfully',
            data: result,
        })
    })
    .catch(err => {
        next(err);
    })
}

const removeImage = (filePath) => {
    filePath = path.join(__dirname, '../..', filePath)
    fs.unlink(filePath, err => console.log(err));
}