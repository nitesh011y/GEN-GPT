import "./App.css";
import SideBar from "./SideBar.jsx";
import Chatwindow from "./Chatwindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThread] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); //stores all chats of curr  threads
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThread,
    prevChats,
    setPrevChats,
    newChat,
    setNewChat,
    allThreads,
    setAllThreads,
  }; // passing down values

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
        <SideBar />
        <Chatwindow />
      </MyContext.Provider>
    </div>
  );
}

export default App;
