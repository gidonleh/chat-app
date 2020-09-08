import React, {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles';
import {Avatar, IconButton} from '@material-ui/core';
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ChatIcon from '@material-ui/icons/Chat';
import SideBarChat from './SideBarChat';
import db from './firebase'
import { cleanup } from '@testing-library/react';

    const useStyles = makeStyles((theme) => ({
        sideBar: {
          flexDirection: "column",
          flex: "0.35",
          overflow: "auto",
          backgroundColor: "white",
        },
        search: {
          display: "flex",
          alignItems: "center",
          backgroundColor: "#f6f6f6",
          height: "39px",
          padding: "10px",
        },
        searchContainer: {
          display: "flex",
          alignItems: "center",
          backgroundColor: "White",
          flex: "1",
          height: "95%",
          borderRadius: "20px",
          "& input": {
            border: "none",
            marginLeft: "10px",
          },
          "& .MuiSvgIcon-root": {
            color: "gray",
            padding: "10px",
          },
        },
        sidebarHeader: {
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
          borderRight: "1px solid lightgray",
        },
        sidebarHeaderRight: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginLeft: "auto",
          gap: "10px",
        },
        SideBarChat: {
          background: "white",
          flex: "1",
          "& :hover": {
            backgroundColor: "#ebebeb",
          },
        },
      }));   
     
export default function SideBar() {

  const classes=useStyles();
    const [rooms, setRooms] = useState([]);
    useEffect(() => {
        const unsubscribe = db
        .collection('rooms')
        .onSnapshot( (snapshot) =>
        setRooms( snapshot.docs.map((doc) => ({
            id: doc.id, data :doc.data()
        }))));
        return () => {
            unsubscribe();
        };
    }, []);   

    return (
        
            <div className={classes.sideBar}>
      <div className={classes.sidebarHeader}>
        <Avatar className={classes.avatar} />
        <div className={classes.sidebarHeaderRight}>
          <IconButton size="small">
            <DonutLargeIcon />
          </IconButton>
          <IconButton size="small">
            <ChatIcon />
          </IconButton>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className={classes.search}>
        <div className={classes.searchContainer}>
          <SearchOutlinedIcon />
          <input placeholder="search or start new chat" type="text" />
        </div>
      </div>
      <div className={classes.SideBarChat}>
        <SideBarChat addNewChat />
        {rooms?.map((room) => (
          <SideBarChat key={room.id} id={room.id} name={room.data.name} />
        ))}
      </div>
    </div>        
    
    )
}
