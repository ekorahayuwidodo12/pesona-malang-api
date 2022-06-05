import Tour from '../models/Tour.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

export const getTours = async (req, res) => {
    Tour.find()
    .then(result => {
        res.status(200).json({
            message: 'Tour data succesfully called',
            data: result
        });
    })
    .catch(error => {
        res.status(500).json({message: error.message});
    })
};

export const getTourById = async (req, res) => {
    const tourId = req.params.id;
    Tour.findById(tourId)
    .then(result => {
        if(!result) {
            const error = new Error('Tour data not found');
            error.errorStatus = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Tour data succesfully called',
            data: result
        });
    })
    .catch(error => {
        res.status(404).json({message: error.message});
    })
};

export const createTour = async (req, res) => {
    if(!req.file) {
        const err = new Error('Image must be uploaded');
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
    .catch (error => {
        res.status(400).json({message: error.message});
    })
};

export const updateTour = async (req, res) => {
    if(!req.file) {
        const err = new Error('Image must be uploaded');
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
    const tourId = req.params.id;

    Tour.findById(tourId)
    .then(tour => {
        if(!tour) {
            const error = new Error('Tour data not found');
            error.errorStatus = 404;
            throw error;
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
            message: 'Update Succesfully',
            data: result
        });
    })
    .catch (error => {
        res.status(400).json({message: error.message});
    })
}

export const deleteTour = async (req, res, next) => {
    const tourId = req.params.id;

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
    .catch (error => {
        res.status(400).json({message: error.message});
    })
}

const removeImage = (filePath) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    filePath = path.join(__dirname, '../', filePath);
    fs.unlink(filePath, err => console.log(err));
}