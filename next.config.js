const webpack = require('webpack')
/**
 * After the next require you can use process.env to get your secrets
 */
if (process.env.NODE_ENV !== 'production') {
  require('now-env')
}

module.exports = {}