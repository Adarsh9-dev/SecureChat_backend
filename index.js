import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./router/userRouter.js";
import convRoute from "./router/conversationRoute.js";
import fs from "fs";
import {Server} from "socket.io"
import {createServer} from "http";

dotenv.config();

const app = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());
//createReadStream create a readable stream for reading data from a file

mongoose.set('strictQuery', true);
//Mongodb Connection
mongoose.connect("mongodb+srv://Adarsh:qEXLiMWjB4Vvy6y7@cluster0.sf8bwna.mongodb.net/chat_application?retryWrites=true&w=majority")
.then(()=>console.log("DB Connected"))
.catch((err)=>console.log("DB Not Connected",err))


const httpServer = createServer(app)


// Connection to Socket.io
const io = new Server (httpServer, {
    cors: {
        origin: "https://securechatapplication.netlify.app/",
        methods: ["GET","POST"],
    },
});

let users = [];
let ServerPersonId = [];
io.on("connection",(socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on("addUser", userId=> {
        const isUserExist = users.find(user => user.userId === userId);
        if (!isUserExist) {
            const user = {userId: userId,socketId: socket.id};
            users.push(user)
            io.emit("getUsers",users);
        }
        // console.log(users)
    })

    socket.on("sendMessage",({senderId,receverId,message})=> {
        const recever = users.find(user=> user.userId === receverId)
        const sender = users.find(user=> user.userId === senderId)
        if (recever) {
            io.to(recever.socketId).to(sender.socketId).emit("getMessage",{
                senderId,
                receverId,
                message
            })
        }
    })

    socket.on("changeMessage",({senderId,receverId,message,typing})=> {
        const recever = users.find(user=> user.userId === receverId)
        const serverClick = ServerPersonId.find(use => use.id === receverId);

        if (recever) {
            const serverClickId = serverClick.personId;

            io.to(recever.socketId).emit("modifyMessage",{typing,message,senderId,serverClickId})
        }
    })

    socket.on("setPerson",({PersonId,id})=> {
        const isPresent = ServerPersonId.find(user => user.id === id);
        if (!isPresent) {
            const user = {personId: PersonId,id: id,socketId: socket.id};
            ServerPersonId.push(user);
        } else {
            isPresent.personId = PersonId;
        }
    })

    socket.on("disconnect", ()=> {
        ServerPersonId = ServerPersonId.filter(user => user.socketId !== socket.id);
        users = users.filter(user=> user.socketId !== socket.id)
        io.emit("getUsers",users)

    })
})



//Routing
app.get("/image/:id",(req,res)=> {
    // console.log(req.params.id)
    const imageStream = fs.createReadStream(`uploads/${req.params.id}`)
    imageStream.pipe(res)
    //Pipe method convert output of one stream to another another stream as input and provide a way so that we can easyly transfer your data
})

app.use('/user',authRoute);
app.use('/conversation',convRoute);

app.use((err,req,res,next)=> {
    return res.status(500).json({"message": "Something going wrong"});
})


httpServer.listen(process.env.PORT,()=> {
    console.log("I am listening");
})



