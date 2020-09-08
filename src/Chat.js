import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import AttachFile from "@material-ui/icons/AttachFile";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import SendIcon from "@material-ui/icons/Send";
import MicIcon from "@material-ui/icons/Mic";
import { useParams } from "react-router-dom";
import db from "./firebase";
import firebase from "firebase";

const useStyles = makeStyles((theme) => ({
  chat: {
    flex: "0.65",
    display: "flex",
    flexDirection: "column",
  },
  chatHeader: {
    padding: "20px",
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid lightgray",
  },
  chatHeaderInfo: {
    flex: "1",
  },
  chatHeaderRight: {
    marginLeft: "auto",
  },
  chatBody: {
    flex: "1",
    backgroundImage:
      "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
    backgroundRepeat: "repeat",
    backgroundPosition: "center",
    padding: "30px",
    overflow: "auto",
  },
  chatMessage: {
    position: "relative",
    fontSize: "16px",
    padding: "10px",
    borderRadius: "10px",
    width: "fit-content",
    display: "flex",
    backgroundColor: "#ffffff",
    marginBottom: "4%",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "8%",
    },
  },
  reciver: {
    marginLeft: "auto",
    backgroundColor: "#dcf8c6",
  },

  chatName: {
    position: "absolute",
    top: "-15px",
    fontSize: "10px",
  },
  chatTimeStamp: {
    fontSize: "xx-small",
    marginLeft: "6px",
    alignSelf: "flex-end",
  },

  chatFooter: {
    display: "flex",
    alignItems: "center",
    height: "62px",
    borderTop: "1px solid lightgray",
  },
  chatFooterForm: {
    display: "flex",
    alignItems: "center",
    flex: "1",
  },
  chatFooterFormInput: {
    flex: "1",
    minHeight: "40px",
    borderRadius: "20px",
    border: "none",
    outline: "none",
    paddingLeft: "2%",
    fontSize: "18px",
  },
}));
function Chat() {
  const currentUserId = "asaf";
  const classes = useStyles(currentUserId === "asaf");
  const [seed, setSeed] = useState(0);
  const [input, setInput] = useState("");
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const { roomId } = useParams();
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
    let roomNameCleanup = "";
    let messagesCleanup = "";
    if (roomId) {
      roomNameCleanup = db
        .collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshoot) => setRoomName(snapshoot.data().name));
      messagesCleanup = db
        .collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshoot) =>
          setMessages(snapshoot.docs.map((doc) => doc.data()))
        );
    }

    return () => {
      roomNameCleanup();
      messagesCleanup();
    };
  }, [roomId]);

  let hundleSubmit = (e) => {
    e.preventDefault();
    db.collection("rooms").doc(roomId).collection("messages").add({
      message: input,
      name: currentUserId,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInput("");
  };
  return (
    <div className={classes.chat}>
      <div className={classes.chatHeader}>
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className={classes.chatHeaderInfo}>
          <h3>{roomName}</h3>
          <p>
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toUTCString()}
          </p>
        </div>
        <div className={classes.chatHeaderRight}>
          <IconButton size="small">
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className={classes.chatBody}>
        {messages.map((message,i) => (
          <p
            key={i}
            className={`${classes.chatMessage} ${
              message.name === currentUserId && classes.reciver
            }`}
          >
            <span className={`${classes.chatName}  `}> {message.name}</span>
            {message.message}
            <span className={classes.chatTimeStamp}>
              {new Date(message?.timestamp?.toDate()).toUTCString()}
            </span>
          </p>
        ))}
      </div>

      <div className={classes.chatFooter}>
        <IconButton>
          <InsertEmoticonIcon />
        </IconButton>

        <form onSubmit={hundleSubmit} className={classes.chatFooterForm}>
          <input
            type="text"
            className={classes.chatFooterFormInput}
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <IconButton type="submit">
            <SendIcon />
          </IconButton>
          <IconButton>
            <MicIcon />
          </IconButton>
        </form>
      </div>
    </div>
  );
}

export default Chat;