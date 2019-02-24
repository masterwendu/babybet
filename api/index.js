const express = require('express')
const bodyParser = require('body-parser')

const getLogic = require('./logic/bet/get')
const getAdminLogic = require('./logic/bet/getAdmin')
const postLogic = require('./logic/bet/post')
const patchLogic = require('./logic/bet/patch')
const patchAdminLogic = require('./logic/bet/patchAdmin')
const patchAdminCloseLogic = require('./logic/bet/patchAdminClose')
const getListForBrowserLogic = require('./logic/bet/getListForBrowser')

const jsonParser = bodyParser.json()

const app = express()

app.get('/api/bet/:id', getLogic)
app.get('/api/bet/admin/:id', getAdminLogic)
app.get('/api/myBets/:uniqueBrowserId', getListForBrowserLogic)
app.post('/api/bet', jsonParser, postLogic)
app.patch('/api/bet/:id', jsonParser, patchLogic)
app.patch('/api/bet/admin/:id', jsonParser, patchAdminLogic)
app.patch('/api/bet/admin/close/:id', jsonParser, patchAdminCloseLogic)

module.exports = app