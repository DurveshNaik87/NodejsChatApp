const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

const port = process.env.PORT || 3500;

//Static folder to keep app static files
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
})

io.on("connection", (client) => {
    console.log("connected...");
    client.emit("acknowledge", { message: "Connection established" });

    client.on("msgToServer", (chattername, message) => {
        console.log(chattername +" says: " + message);
        client.emit("msgToClient", 'Me',message);
        client.broadcast.emit("msgToClient",chattername,message);
    });
});

server.listen(port, () => {
    console.log("socket server started at port : " + port);
});