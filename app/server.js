const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
  .then(() => {
    const server = express()

    if (dev) {
      const getBetLogic = require('../api/logic/bet/get') // eslint-disable-line global-require
      server.get('/api/bet/:id', getBetLogic)
      const getListForBrowserLogic = require('../api/logic/bet/getListForBrowser') // eslint-disable-line global-require
      server.get('/api/myBets/:uniqueBrowserId', getListForBrowserLogic)

      const bodyParser = require('body-parser') // eslint-disable-line global-require
      const jsonParser = bodyParser.json()
      const postBetLogic = require('../api/logic/bet/post') // eslint-disable-line global-require
      server.post('/api/bet', jsonParser, postBetLogic)
      const patchBetLogic = require('../api/logic/bet/patch') // eslint-disable-line global-require
      server.patch('/api/bet/:id', jsonParser, patchBetLogic)
    }

    server.get('/b/:id', async (req, res) => {
      const { params: { id } } = req

      const queryParams = {
        id,
      }

      const actualPage = '/b'
      app.render(req, res, actualPage, queryParams)
    })

    server.get('*', (req, res) => handle(req, res))

    server.listen(3000, (err) => {
      if (err) throw err
      console.log('> Ready on http://localhost:3000') // eslint-disable-line no-console
    })
  })
  .catch((ex) => {
    console.error(ex.stack) // eslint-disable-line no-console
    process.exit(1)
  })
