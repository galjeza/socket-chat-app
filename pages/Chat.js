import {useEffect, useState} from "react";
import io from "socket.io-client";
import Router from 'next/router'
import {decrypt,encrypt} from "./utils/encryption";


let socket;

export default function Chat({ username }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    useEffect( () => {
        initiateChat();
    }, []);




    const initiateChat =async () => {
        await fetch("/api/socket")

        socket = io();
        socket.emit("join", username);
        socket.on("newIncomingMessage", (data) => {
            try{
                const decryptedData = decrypt(data, "secret");
                const parsedData = JSON.parse(decryptedData);
                setMessages((messages) => [...messages, parsedData]);
            }catch (e){
                console.log(e);
            }

        }
        );

    }


    const sendMessage = async () => {
        try{
            const data = {
                author: username,
                message: message,
            }
            const stringifiedData = JSON.stringify(data);
            socket.emit("createdMessage",encrypt(stringifiedData, "secret"));
            setMessages((prevState) => [...prevState, {
                author: username,
                message: message,
            }]);
            setMessage("");
        }catch(e){
            console.log(e);
        }

    };

    const leaveChat = () => {
        socket.emit("leaveChat",encrypt( username, "secret"));
        setTimeout(() => {
            socket.disconnect();
            Router.reload(
                window.location.pathname
            );
        }, 1000);




    }

    const handleKeypress = (e) => {
        if (e.keyCode === 13) {
            if (message) {
                sendMessage();
            }
        }
    }

    return (
        <div className="flex items-center p-4 mx-auto min-h-screen justify-center bg-purple-500">
            <main className="gap-4 flex flex-col items-center justify-center w-full h-full">
                <p className="font-bold text-white text-xl">
                    Tvoje uporabniško ime: {username}
                </p>
                <div className="flex flex-col justify-end bg-white h-[20rem] min-w-[33%] rounded-md shadow-md ">
                    <div className="h-full last:border-b-0 overflow-y-scroll">
                        {messages.map((msg, i) => {
                            return (
                                <div
                                    className="w-full py-1 px-2 border-b border-gray-200"
                                    key={i}
                                >
                                    {msg.author} : {msg.message}
                                </div>
                            );
                        })}
                    </div>
                    <div className="border-t border-gray-300 w-full flex rounded-bl-md">
                        <input
                            type="text"
                            placeholder="Novo sporočilo..."
                            value={message}
                            className="outline-none py-2 px-2 rounded-bl-md flex-1"
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyUp={handleKeypress}
                        />
                        <div className="border-l border-gray-300 flex justify-center items-center  rounded-br-md group hover:bg-purple-500 transition-all">
                            <button
                                className="group-hover:text-white px-3 h-full"
                                onClick={() => {
                                    sendMessage();
                                }}
                            >
                                Pošlji
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => {
                        leaveChat();
                    }}
                    className="bg-white rounded-md px-4 py-2 text-xl"
                >
                    Zapusti klepet
                </button>
            </main>
        </div>
    );

}