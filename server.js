const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 4000
var twilio = require('twilio');

console.log("hyeh");

const accountSid = 'ACf797d7735fb2e9829bd25971bc59e76c';
const authToken = 'a9a46b2a307683509eb5ee9bc7bd5ff1';
const client = twilio(accountSid, authToken);

client.tokens.create().then(token => console.log("username  ",token.username,"\n","password",token.password,"\n","credentials ",token.toJSON())).catch(er=>{
    console.log(err);
});

app.use(express.static(__dirname + "/public"))
let clients = 0

io.on('connection', function (socket) {
    socket.on("NewClient", function () {
        if (clients < 2) {
            if (clients == 1) {
                this.emit('CreatePeer')
            }
        }
        else
            this.emit('SessionActive')
        clients++;
    })
    socket.on('Offer', SendOffer)
    socket.on('Answer', SendAnswer)
    socket.on('disconnect', Disconnect)
})

function Disconnect() {
    if (clients > 0) {
        if (clients <= 2)
            this.broadcast.emit("Disconnect")
        clients--
    }
}

function SendOffer(offer) {
    this.broadcast.emit("BackOffer", offer)
}

function SendAnswer(data) {
    this.broadcast.emit("BackAnswer", data)
}

http.listen(port, () => console.log(`Active on ${port} port`))



