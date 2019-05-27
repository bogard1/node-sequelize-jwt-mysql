'use strict';

var router = require('express').Router();

var config = require('../config');
var allowOnly = require('../services/routesHelper').allowOnly;

var AuthController = require('../controllers/authController');
var UserController = require('../controllers/userController');
var noteController = require('../controllers/noteController');

var APIRoutes = function(passport) {
    // POST Routes.
   // router.post('/signup', AuthController.signUp);
    router.post('/authenticate', AuthController.authenticateUser);

    // GET Routes.
    router.post('/signup', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AuthController.signUp));

    // Todo
    // router.post('/organization', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, organizationController.add));
    // router.put('/organization/:id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, organizationController.update));
    // router.delete('/organization/:id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, organizationController.drop));
    // router.get('/organization/id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, organizationController.find_by_id));
    // router.get('/organization', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, organizationController.find_all));

    return router;
};

module.exports = APIRoutes;
