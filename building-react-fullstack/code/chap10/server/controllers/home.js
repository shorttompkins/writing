module.exports = {
  index(req, res) {
    let viewModel = {
      layout: false,
      place: 'Earth'
    }
    res.render('home', viewModel)
  }
}
