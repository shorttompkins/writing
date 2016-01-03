let controllers = require('./controllers'),
    api = require('./controllers/api')

module.exports.initialize = function(app, router) {
  
  router.get('/', controllers.home.index)
  router.get('/api/images', api.images.list)
  
  app.use('/', router)
}
