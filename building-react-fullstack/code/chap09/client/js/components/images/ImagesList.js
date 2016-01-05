import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class ImagesList extends Component {
  render() {
    let imageId = '123abc456def'
    return (
      <div>
        <div className="images">
          List of Images will appear here...<br/>
          <Link to={`/image/${imageId}`}>View image details</Link>
        </div>
      </div>
    )
  }
}

export default ImagesList
