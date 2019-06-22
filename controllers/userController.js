/**
 * user controller.
 * userController.js
 * 
 * created by super-sean
 * version 2.1.1
 */
'use strict';

// Import project sub modules.
const UserModel = require('../models').User;

// Define user controller.
var UserController = {}; 

UserController.signup = function(req, res) {
    UserModel.findAll({
        where: {
            email: req.body.email
        }
    }).then(function(users) {
        if(users.length == 0) {
            var newUser = {
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                email: req.body.email,
                user_name: req.body.userName,
                password: req.body.password,
                bill_token: req.body.billToken,
                role: 1,
                state: 1
            }

            UserModel.create(newUser)
                .then(function(user) {
                    res.status(200).json({
                        flag: true,
                        message: 'Successfully created your account.'
                    });
                })
                .catch(function(error) {
                    console.log('Create user error: ' + error);

                    res.json({
                        flag: false,
                        message: 'Server connection error, Try again.'
                    });
                });
        } else {
            res.json({
                flag: false,
                message: ' This email already used by another user.'
            });
        }
    }).catch(function(error) {
        console.log('Get user data for Auth error: ' + error);

        res.json({
            flag: false,
            message: 'Server connection error, Try again.'
        });
    })
}
    
UserController.login = function(req, res) {
    UserModel.findOne({
        where: {
            email: req.body.email
        }
    }).then(function(user) {
        if(!user) {
            return res.json({
                flag: false,
                message: 'Authenication failure, User not found.'
            });
        }
        
        user.comparePassword(req.body.password, function(error, isMatch) {
            if(isMatch && !error) {
                req.session.user = {
                    userId: user.dataValues.id,
                    firstName: user.dataValues.first_name,
                    lastName: user.dataValues.last_name,
                    email: user.dataValues.email,
                    userName: user.dataValues.user_name,
                    role: user.dataValues.role
                };

                req.session.authenticated = true;

                res.status(200).json({
                    flag: true,
                    message: 'Welcome to Metamedias.co!'
                })
            }
        });
        
    }).catch(function(error) {
        console.log('Get user data for authentication error: ' + error);

        res.json({
            flag: false,
            message: 'Server connection error'
        });
    });
}

// Export module with UserController.
module.exports = UserController;