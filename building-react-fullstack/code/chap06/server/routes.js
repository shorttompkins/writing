let controllers = require('./controllers')

module.exports.initialize = function(app, router) {
  
  router.get('/', controllers.home.index)
  
  app.use('/', router)
}
