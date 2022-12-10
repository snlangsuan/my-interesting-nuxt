import * as tf from '@tensorflow/tfjs'

class L2 {
  static className = 'L2'
  constructor(config) {
    return tf.regularizers.l1l2(config)
  }
}
tf.serialization.registerClass(L2)

class Lambda extends tf.layers.Layer {
  constructor() {
    super({})
  }

  static get className() {
    return 'Lambda'
  }
}

tf.serialization.registerClass(Lambda)

export default ({ app }, inject) => {
  inject('tfjs', tf)
  // install: (app, options) => {
  //   app.config.globalProperties.$tfjs = () => tf
  // }
}
