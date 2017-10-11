
process.title = 'dioe-analyze'
console.log('process.env.NODE_PORT', process.env.NODE_PORT)

const express         = require('express')
const server          = express()
// const cookieParser    = require('cookie-parser')
// const session         = require('express-session')
// const RedisStore      = require('connect-redis')(session)
const compression     = require('compression')
const bodyParser      = require('body-parser')
const path            = require('path')

// server.use(cookieParser())
server.use(compression())
server.use(bodyParser.json({limit : '2mb'}))

server.use('/static', express.static(path.join(__dirname, '../dist/static')))

// this has to be defined last
server.use('/', express.static(path.join(__dirname, '../dist/')))

process.on('unhandledRejection', (error, promise) => {
  console.error('UNHANDLED REJECTION', error.stack)
})

server.listen(process.env.NODE_PORT || 80)
