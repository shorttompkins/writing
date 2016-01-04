import React, { Component, PropTypes } from 'react'

class Header extends Component {
  constructor() {
    super()
    this.clickLogger = this.clickLogger.bind(this)
    this.state = { clickCounter: 0 }
  }

  static propTypes = {
    title: PropTypes.string,
    logger: PropTypes.func
  }

  clickLogger() {
    this.setState({clickCounter: this.state.clickCounter+1})
    this.props.logger(this.props.title)
  }

  render() {
    return (
      <h1 onClick={this.clickLogger}>
        {this.props.title} - {this.state.clickCounter}
      </h1>
    )
  }
}

export default Header
