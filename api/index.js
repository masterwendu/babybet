const express = require('express')
const bodyParser = require('body-parser')

const getLogic = require('./logic/bet/get')
const postLogic = require('./logic/bet/post')
const patchLogic = require('./logic/bet/patch')
const getListForBrowserLogic = require('./logic/bet/getListForBrowser')

const jsonParser = bodyParser.json()

const app = express()

app.get('/api/bet/:id', getLogic)
app.get('/api/myBets/:uniqueBrowserId', getListForBrowserLogic)
app.post('/api/bet', jsonParser, postLogic)
app.patch('/api/bet/:id', jsonParser, patchLogic)

module.exports = app