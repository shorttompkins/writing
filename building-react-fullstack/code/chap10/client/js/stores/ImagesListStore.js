import AppDispatcher from '../dispatchers/Dispatcher'
import ActionTypes from '../constants/ActionTypes'
import { EventEmitter } from 'events'
import { assign } from 'lodash'

let _images = []

let ImagesStore = assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit('change')
  },

  addChangeListener: function(callback) {
    this.on('change', callback)
  },

  removeChangeListener: function(callback) {
    this.removeListener('change', callback)
  },

  getImages: function() {
    return _images
  },

  dispatcherIndex: AppDispatcher.register((payload) => {
    let { actionType } = payload

    switch(actionType) {
      case ActionTypes.LOAD_IMAGES_SUCCESS:
        _images = payload.images
        ImagesStore.emitChange()
        break
    }

    return true
  })
})

export default ImagesStore
