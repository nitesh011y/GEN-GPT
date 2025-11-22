import "./SideBar.css";
import { MyContext } from "./MyContext";
import { useContext, useEffect } from "react";
import { v1 as uuidv1 } from "uuid";

function SideBar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setCurrThread,
    setNewChat,
    setPrompt,
    setReply,
    setPrevChats,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch(
        "https://gen-gptt-backend.onrender.com/GPT/thread"
      );
      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      console.log(filteredData);
      setAllThreads(filteredData);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, []);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThread(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThread(newThreadId);
    try {
      const response = await fetch(
        `https://gen-gptt-backend.onrender.com/GPT/thread/${newThreadId}`
      );
      const res = await response.json();
      console.log(res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `https://gen-gptt-backend.onrender.com/GPT/thread/${threadId}`,
        {
          method: "DELETE",
        }
      );

      const res = await response.json();
      console.log(res);
      //updated threads re-render
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId != threadId)
      );

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img
          src="src/assets/blacklogo.png"
          alt="gpt logo"
          className="logo"
        ></img>
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li
            key={idx}
            onClick={(e) => {
              changeThread(thread.threadId);
            }}
            className={thread.threadId === currThreadId ? "highlighted" : ""}
          >
            {thread.title}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p>BY Nitesh &hearts;</p>
      </div>
    </section>
  );
}

export default SideBar;
