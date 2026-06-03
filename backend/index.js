// Setting up the Server
import express from "express";
import http from "http";
import dotenv from "dotenv";
dotenv.config();
import Connecttomongo from "./db.js";
import cookieParser from "cookie-parser";
const port = process.env.PORT || 5000;
import cors from "cors"
import userRoutes from "./routes/userRoutes.js"
import shopRouter from "./routes/shopRoutes.js";
import itemRouter from "./routes/itemRoutes.js";
import orderRouter from "./routes/order.js";
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: 'https://spicesprint.onrender.com',
        methods: ['GET','POST'],
        credentials: true
    }
})
app.set("io", io) ;
// Connecting to server
Connecttomongo();

//Middlewares
app.use(cors({
    origin: 'https://spicesprint.onrender.com',
    credentials: true 
}));
app.use(express.json()); 
app.use(cookieParser());

// Creating the routes
app.use("/api" , userRoutes);
app.use("/api" , shopRouter);
app.use("/api" , itemRouter);
app.use("/api" , orderRouter);

socketHandler(io);

server.listen(port, ()=>{
    console.log(`The Server is Running on port : ${port}`) ; 
})