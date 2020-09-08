import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar } from "@material-ui/core";
import db from "./firebase";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    textDecoration: "none",
    color: "black",
  },

  SideBarChat: {
    display: "flex",
    padding: "20px",
    cursor: "pointer",
    borderBottom: "1px solid #f6f6f6",
  },
}));
function SideBarChat({ addNewChat, name, id }) {
  const classes = useStyles();
  const [seed, setSeed] = useState(0);

  const [messages, setMessages] = useState(0);
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  useEffect(() => {
    let messagesCleanup = "";
    if (id) {
      messagesCleanup = db
        .collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshoot) =>
          setMessages(snapshoot.docs.map((doc) => doc.data()))
        );
    }

    return () => {
      messagesCleanup();
    };
  }, [id]);
let createNewChat=()=>{
  const name=prompt("please enter new chat name")
  if(name)
  db.collection("rooms").add({name})
}

  return !addNewChat ? (
    <Link to={`/rooms/${id}`} className={classes.root}>
      <div className={classes.SideBarChat}>
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className={classes.SideBarChatInfo}>
          <h2>{name}</h2>
          <p>{messages[0]?.message}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createNewChat} className={classes.SideBarChat}>
      <h2>Add new chat</h2>
    </div>
  );
}

export default SideBarChat;