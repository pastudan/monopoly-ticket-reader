const express = require('express')
const fs = require('fs')
const uuidv4 = require('uuid/v4');
const redis = require("redis");

const app = express()
const redisClient = redis.createClient();

//TODO allow CORS for prod

app.post('/upload', function (req, res) {
  const uuid = uuidv4();
  const writeStream = fs.createWriteStream(`image-uploads/original/${uuid}`)
  req.on('end', () => {
    res.sendStatus(200)
    redisClient.lpush('crop-queue', uuid)
  }).pipe(writeStream)
})

const port = process.env.PORT || 3001
app.listen(port, function () {
  console.log(`listening on port ${port}`)
})