import React from "react";
import SideBar from "../../components/SideBar";
import AllGroupList from "../../components/AllGroupList";
import Friends from "../../components/Friends";
import Chat from "../../components/Chat";

const Messages = () => {
  return (
    <div className="flex gap-x-10">
      <div className="w-[180px] bg-primary h-screen max-h-[930px] rounded-3xl">
        <SideBar active="message" />
      </div>
      <div className="w-[530px]">
        <div className="mb-10">

        <AllGroupList  />
        </div>
        <Friends />
      </div>
      <div className="w-[1130px]">
        <Chat/>
      </div>
    </div>
  );
};

export default Messages;
