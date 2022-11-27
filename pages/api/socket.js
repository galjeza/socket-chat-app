import {Server} from "socket.io";
import {encrypt, decrypt} from "../utils/encryption";

const sendError = (socket, error) => {
    const data = {
        author: "Server",
        message: "Prišlo je do napake: " + error.message,
    }
    socket.emit("newIncomingMessage", encrypt(data, "secret"));
}

export default function SocketHandler(req, res) {
    if (res.socket.server.io) {
        res.end();
        return;
    } else {
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on("connection", (socket) => {
            socket.on("createdMessage", (data) => {
                try {
                    const decryptedData = decrypt(data, "secret");
                    const parsedData = JSON.parse(decryptedData);
                    console.log("Uporabnik " + parsedData.author + " je poslal sporočilo: " + parsedData.message);
                    socket.broadcast.emit("newIncomingMessage", data);
                } catch (e) {
                    sendError(socket, e);
                }

            })

            socket.on("join", (username) => {
                try {
                    const decryptedUsername = decrypt(username, "secret");
                    const stringifiedData = JSON.stringify({
                        author: "Server",
                        message: `${decryptedUsername} se je pridružil klepetu `,

                    });
                    const encryptedData = encrypt(stringifiedData, "secret");
                    console.log("Uporabnik " + username + " se je pridružil klepetu");
                    socket.broadcast.emit("newIncomingMessage", encryptedData);
                } catch (e) {
                    sendError(socket, e);
                }

            });

            socket.on("leaveChat", (data) => {
                try {
                    const decryptedData = decrypt(data, "secret");
                    const stringifiedData = JSON.stringify({
                        author: "Server",
                        message: `${decryptedData} je spustil klepet`,
                    });

                    console.log("Uporabnik " + decryptedData + " je zapustil klepet");
                    const encryptedData = encrypt(stringifiedData, "secret");
                    socket.broadcast.emit("newIncomingMessage", encryptedData);
                } catch (e) {
                    sendError(socket, e);
                }

            });

        });

        res.end();

    }


}