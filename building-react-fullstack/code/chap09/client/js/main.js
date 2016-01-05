import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute } from 'react-router'
import App from './components/App'
import ImagesList from './components/images/ImagesList'
import Image from './components/images/Image'

ReactDOM.render((
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={ImagesList} />
      <Route path="image/:id" component={Image} />
    </Route>
  </Router>
), document.getElementById('app'))
