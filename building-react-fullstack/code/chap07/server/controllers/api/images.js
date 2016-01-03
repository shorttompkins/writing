let Models = require('../../models')

module.exports = {
  list(req, res) {
    Models.Image.find({}, (err, images) => {
      res.json(images)
    })
  }
}
