const apiRouter = require('express').Router();
const matchesController = require('./matches-controller');

apiRouter.route('/matches')
    .get(matchesController.all)
    .post(matchesController.create)

apiRouter.route('/matches/:id')
    .get(matchesController.single)
    .put(matchesController.update)
    .delete(matchesController.destroy)

module.exports = apiRouter;

// console.log(Date.now() + 60*60*24*7)
