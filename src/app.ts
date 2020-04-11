import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as socket from 'socket.io'
import * as opn from 'opn'
import axios, { AxiosResponse } from 'axios'
import { Server } from 'http'
import { AddressInfo } from 'net'
const app: express.Application = express()
const http = new Server(app)
const io = socket(http)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const reachAxios = async (): Promise<void> => {
  const response: AxiosResponse = await axios.get(
    'http://192.168.8.1/api/monitoring/status',
    {
      headers: {
        common: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          "Content-Type": "application/json",
          Accept: "application/xml",
        },
      }
    },
  )
  
  console.log('Response =>', response.data)
  io.emit('packet', response.data)
}

reachAxios()

io.on('connection', () => {
  console.log('Ehehn')
  opn()
})

const server: Server = http.listen(9009, () => {
  const addr = <AddressInfo>server.address()
  console.log('Server running. Port =>', addr.port);
});
