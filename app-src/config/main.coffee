'use strict'

express = require 'express'
mpath   = require 'path'

module.exports = (app) ->
  app.set(
    'public'
    mpath.resolve mpath.join __dirname, '../public'
  )

  app.use express.logger()
  if app.set 'gzip compression'
    app.use express.compress()
  app.use express.static(app.set 'public')
