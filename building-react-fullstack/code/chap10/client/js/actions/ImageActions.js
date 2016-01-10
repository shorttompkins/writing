import ActionTypes from '../constants/ActionTypes'
import AppDispatcher from '../dispatchers/Dispatcher'
import request from 'superagent'

export default {
  loadImages() {
    AppDispatcher.dispatch({
      actionType: ActionTypes.LOAD_IMAGES
    })

    request
      .get('/api/images')
      .end((err, res) => {
        if (err) {
          AppDispatcher.dispatch({
            actionType: ActionTypes.LOAD_IMAGES_FAIL,
            error: err
          })
        } else {
          AppDispatcher.dispatch({
            actionType: ActionTypes.LOAD_IMAGES_SUCCESS,
            images: res.body
          })
        }
      })
  }
}
