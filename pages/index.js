import io from "socket.io-client";
import { useState, useEffect } from "react";
import ChooseUsername from "./ChooseUsername";
import Chat from "./Chat";

let socket;



export default function Home() {
    const [username, setUsername] = useState("");


    return !username ?  <ChooseUsername setChosenUsername={setUsername} /> : <Chat username={username}></Chat> ;


}