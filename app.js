const express = require('express');
const Joi = require('joi');
const app = express();

app.get("/", (req, res) => {
    res.send('August 7th, 2020 | Friday 11:13 AM | Jere Sher: I\'m going to be someone one day. ...When I\'m successful show them this so they think it\'s planned');
})

app.listen(3000);
