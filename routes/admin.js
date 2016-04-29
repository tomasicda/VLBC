var express = require('express');
var admin = express.Router();
var User = require('../Models/User');
var dbConnection = require('../DAO/DBConnection');

/* GET home page. */
admin.get('/', function (req, res, next) {
    res.render('admin.ejs', {
        title: 'admin | VLBC'
    });
});

module.exports = admin;