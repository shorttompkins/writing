import React, { Component } from 'react'
import Header from './layout/Header'

class App extends Component {
  static propTypes = {
    place: React.PropTypes.string
  }

  clickLogger(title) {
    console.log(title)
  }

  render() {
    let myvar = this.props.place

    return (
      <div>
        <Header title="My First React Component" logger={this.clickLogger}/>

        <div className="body">
          <p>Hello {myvar}!</p>
        </div>
      </div>
    )
  }
}

export default App
