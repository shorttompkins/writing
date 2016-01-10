import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import ImagesListStore from '../../stores/ImagesListStore'
import ImageActions from '../../actions/ImageActions'

class ImagesList extends Component {
  constructor() {
    super()
    this.state = { images: ImagesListStore.getImages() }
    ImagesListStore.addChangeListener(this._onChange)
  }
  _onChange = () => {
    this.setState({ images: ImagesListStore.getImages() })
  }
  componentWillMount() {
    ImageActions.loadImages()
  }
  componentWillUnmount() {
    ImagesListStore.removeChangeListener(this._onChange)
  }
  render() {
    let imageId = '123abc456def'
    let images = this.state.images.map(image => {
      return (
        <li>{image._id}</li>
      )
    })
    return (
      <div>
        <div className="images">
          List of Images will appear here...<br/>
          <Link to={`/image/${imageId}`}>View image details</Link>
          <br/><br/>
          <ul>
            {images}
          </ul>
        </div>
      </div>
    )
  }
}

export default ImagesList
