import React, { Component } from 'react'
import Header from './layout/Header'

import 'stylesheets/base'

class App extends Component {
  static propTypes = {
    children: React.PropTypes.node
  }

  render() {
    return (
      <div>
        <Header />

        <div className="body">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default App
