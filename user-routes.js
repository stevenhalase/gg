var userRouter = require('express').Router();
var userController = require('./user-controller');

userRouter.route('/users')
    .get(userController.all)
    .post(userController.create)

userRouter.route('/users/:id')
    .get(userController.single)
    .put(userController.update)
    .delete(userController.destroy)

module.exports = userRouter;
