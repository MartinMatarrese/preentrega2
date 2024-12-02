import express from "express";
import { create } from "express-handlebars";
import { Server } from "socket.io";
import path  from "path";
import { __dirname } from "./patch.js";
import productRouter from "./routes/productos.js";
import cartRouter from "./routes/carritos.js";
import multerRouter from "./routes/image.js";
import chatRouter from "./routes/chat.js";



const app = express();
const hbs = create();
const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log("server on port", PORT);    
})

const io = new Server(server)

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.engine("handlebars", hbs.engine);

app.set("view engine", "handlebars")

app.set("views", path.join(__dirname, "views"));

app.use("/public", express.static(__dirname + "/public"));

app.use("/api/products", productRouter);

app.use("/api/carts", cartRouter);

app.use("/api/chat", chatRouter)

app.use("/upload", multerRouter);

app.get("/", (req, res) => {
    res.status(200).send("Ok");
})

let mensajes = [];

io.on("connection", (socket) => {
    console.log("Usuario conectado: ", socket.id);
    socket.on("mensaje", (data) => {
        console.log("Mensaje recibido: ", data);
        mensajes.push(data);
        socket.emit("respuesta", mensajes)        
    })
    socket.on("disconnect", () => {
        console.log("Usuario desconectad: ", socket.id);        
    })
    
})