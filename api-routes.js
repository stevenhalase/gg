const apiRouter = require('express').Router();
const csgoMatchesController = require('./csgo-matches-controller');

apiRouter.route('/csgo-matches')
    .get(csgoMatchesController.all)
    .post(csgoMatchesController.create)

apiRouter.route('/csgo-matches/:id')
    .get(csgoMatchesController.single)
    .put(csgoMatchesController.update)
    .delete(csgoMatchesController.destroy)

module.exports = apiRouter;

// console.log(Date.now() + 60*60*24*7)
