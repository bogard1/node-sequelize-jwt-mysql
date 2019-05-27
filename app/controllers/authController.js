'use strict';

var jwt = require('jsonwebtoken');
var bCrypt = require('bcrypt');
var config = require('../config');
var db = require('../services/database');
var User = require('../models/user');

// The authentication controller.
var AuthController = {
    signUp: function(req, res) {
        console.log(req.body.user);
        if(!req.body.user.id || !req.body.user.password) {
            res.json({ message: 'Please provide user id  and a password.' });
            res.json({ message: 'Please provide user id  and a password.' });

            return
        }

        db.sync().then(function() {
            req.body.user.role = config.userRoles.user;
            var newUser = req.body.user;
            return User.create(newUser).then(function() {
                console.log('Account created');
                res.status(201).json({ message: 'Account created!' });
            });
        }).catch(function(error) {
            console.log(error);
            res.status(403).json({ message: 'Username already exists!' });
        });
    },

    authenticateUser: function(req, res) {
        if(!req.body.user.id || !req.body.user.password) {
            res.status(404).json(
                { message: 'Username and password are needed!' }
            );

            return
        }
        console.log(req.body.user.id);
        // console.log(req.body.user.password);

        var id = req.body.user.id;
        var password = req.body.user.password;

        User.findOne({ where: { id: id } })
            .then(function(user) {
                if(!user) {
                    console.log('auth failed');
                    res.status(404).json({ message: 'Authentication failed!' });
                    return
                }

                comparePasswords(password, user.password, function(error, isMatch) {
                    if(isMatch && !error) {
                        console.log('password match');

                        var token = jwt.sign(
                            { id: user.id },
                            config.keys.secret,
                            { expiresIn: '30m' }
                        );

                        res.json({
                            success: true,
                            token: 'JWT ' + token,
                            role: user.role
                        });
                    } else {
                        res.status(404).json({ message: 'Login failed!' });
                    }
                });
            }).catch(function(error) {
                console.log(error);
                res.status(500).json({ message: 'There was an error!' });
            });
        }
    }
};

// Compares two passwords.
function comparePasswords(password, hash, callback) {
    bCrypt.compare(password, hash, function(error, isMatch) {
        if(error) {
            return callback(error);
        }

        return callback(null, isMatch);
    });
}

// Hashes the password for a user object.
function hashPassword(user) {
    if(user.changed('password')) {
        return bcrypt.hash(user.password, 10).then(function(password) {
            user.password = password;
        });
    }
}

module.exports = AuthController;
