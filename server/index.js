import express from 'express'
import dotenv from 'dotenv';
import colors from 'colors'; //For using custom color in console
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';


/*Server Configuration*/
const app = express();
app.use(cors());
//Creating a server//
const server = http.createServer(app);

//Solving cross origin issue*/
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"], //Can set which methods to allow for cors
    }
});

/*Socket IO*/
io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`.green.bold)

    /*Creating Socket Events*/
    socket.on('join_room', (data) => { //Receving the value sent from client side
        socket.join(data);
        console.log(`User ID: ${socket.id} joined room: ${data}`.blue.bold)

    })

    socket.on('send_message', (data) => { //Receiving chats from client side
        socket.to(data.room).emit('receive_message', data);
    })

    socket.on('disconnect', () => {
        console.log(`User disonnected: ${socket.id}`.red.bold)
    })
})


dotenv.config();
const PORT = process.env.PORT || 5000;
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hi Im running')
})
/*Server Config*/
server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on Port ${PORT}`.yellow.underline.bold)
})