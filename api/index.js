const express = require('express')
const fs = require('fs')
const uuidv4 = require('uuid/v4')
const redis = require('redis')
const WebSocket = require('ws')
const shortid = require('shortid')
const sharp = require('sharp')

const wsPort = process.env.PORT || 8080
const app = express()
const redisClient = redis.createClient()
const redisSubscriber = redis.createClient()
const wss = new WebSocket.Server({port: wsPort})

const uuidWsMapping = {}
const wsAuthMapping = {}

wss.on('connection', function connection (ws) {
  // stats.increment('connect', 1)

  const eventMapping = {
    'auth': auth,
  }
  ws.on('message', function (msg) {
    const [eventName, payload] = msg.split('|')

    if (typeof eventMapping[eventName] !== 'function') {
      console.log('Error: Unknown client event emitted')
      return
    }

    eventMapping[eventName](payload)
  })

  function auth (authKey) {
    if (!authKey) {
      authKey = shortid.generate()
      ws.authKey = authKey
      ws.send(`auth|${authKey}`)
      wsAuthMapping[authKey] = ws
      // TODO add authKey to DB
    }

    // TODO check authKey against DB
  }

  function close () {
    //TODO iterate through uuidWsMapping and remove all the UUIDs that belong to that user
  }

  // handle graceful and ungraceful disconnects
  ws.on('close', close)
  ws.on('error', close)
})

redisSubscriber.subscribe(['crop-updates', 'ml-updates'])
const channelMapping = {
  'crop-updates': cropUpdate,
  'ml-updates': mlUpdate,
}
redisSubscriber.on('message', function (channel, payload) {
  if (typeof channelMapping[channel] !== 'function') {
    console.log('Error: Unknown client event emitted')
    return
  }

  channelMapping[channel](payload)
})

function cropUpdate (payload) {
  const uuid = payload.split(':')[0]
  uuidWsMapping[uuid] && uuidWsMapping[uuid].send(`crop-update|${payload}`)
}

function mlUpdate (payload) {
  const uuid = payload.split('_')[0]
  uuidWsMapping[uuid] && uuidWsMapping[uuid].send(`ml-update|${payload}`)
}

function resize (uuid) {
  sharp(`image-uploads/original/${uuid}`)
    .resize(400)
    .rotate()
    .toFile(`image-uploads/resized/${uuid}.jpg`, (err, info) => {
      uuidWsMapping[uuid] && uuidWsMapping[uuid].send(`resize-update|${uuid}`)
    })
}

//TODO allow CORS for prod

app.post('/upload', function (req, res) {
  const authKey = typeof req.headers.authorization === 'string' && req.headers.authorization.split(' ')[1]
  const ws = wsAuthMapping[authKey]
  if (!ws) {
    res.sendStatus(401)
    return
  }

  const uuid = uuidv4()
  // TODO require auth header, the short id generated by initial connect to websocket
  uuidWsMapping[uuid] = ws
  const writeStream = fs.createWriteStream(`image-uploads/original/${uuid}`)
  req.on('end', () => {
    res.status(200).send(uuid)
    redisClient.lpush('crop-queue', uuid)
    // TODO create map of UUID -> owner auth, so we know where to send updates when received
    resize(uuid)
  }).pipe(writeStream)
})

app.use(express.static('image-uploads'))

const port = process.env.PORT || 3001
app.listen(port, function () {
  console.log(`listening on port ${port}`)
})