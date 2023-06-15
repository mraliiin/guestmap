const express = require('express');
const router = express.Router();
const Joi = require('joi');

const db = require('../db');
const messages = db.get('messages');

const messageSchema = Joi.object().keys({
    name: Joi.string().alphanum().min(3).max(100).required(),
    message: Joi.string().min(1).max(500).required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    date: Joi.date(),
});


router.get('/', (req, res) => {
    messages
        .find()
        .then(data => res.send(data));
});

router.post('/', (req, res, next) => {
    const result = Joi.validate(req.body, messageSchema);

    if (result.error === null) {
        const {name, message, latitude, longitude } = req.body;
        let messageModel = {
            name, 
            message, 
            latitude,
            longitude,
            date: new Date()
        }

        messages
            .insert(messageModel)
            .then(newMessage => res.json(newMessage))
    } else {
        next(result.error);
    }
})

module.exports = router;