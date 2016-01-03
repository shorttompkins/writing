let express = require('express'),
    app = express(),
    configure = require('./configure')

app = configure(app)

app.listen('3300', () => {
  console.log(`Server listening at http://localhost:3300`)
})
