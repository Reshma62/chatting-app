import React, { useState, useEffect } from "react";
import SideBar from '../../components/SideBar';
import Search from '../../components/Search';
import GroupList from "../../components/GroupList";
import FriendList from "../../components/FriendList";
import Friends from "../../components/Friends";
import Mygroups from "../../components/Mygroups";
import UserList from "../../components/UserList";
import BlockUser from "../../components/BlockUser";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const Home = () => {
  let [ verify, setVerify ] = useState( false );
  const auth = getAuth();
  let navigate=useNavigate()
  let data = useSelector((state) => state.userAllInfo.userInformaition);
 
  useEffect(() => {
    if (!data) {
      navigate("/login")
    }
  }, [])
   onAuthStateChanged(auth, (user) => {
     if (user.emailVerified) {
       setVerify(true);
     }
   });
  return (
    <div className="flex justify-between py-5 pl-5 box-border ">
      {verify ? (
        <>
          <div className="w-[180px] bg-primary h-screen max-h-[930px] rounded-3xl">
            <SideBar active="home"/>
          </div>
          <div className="w-[530px]">
            <Search />
            <GroupList />
            <FriendList />
          </div>
          <div className="w-[530px]">
            <Friends />
            <Mygroups />
          </div>
          <div className="w-[530px] ">
            <UserList />
            <BlockUser />
          </div>
        </>
      ) : (
        <div className="flex w-full h-screen justify-center items-center bg-primary">
          <h3 className="text-5xl bg-white text-primary text-center p-7  font-pop font-bold">
            please verify your mail
          </h3>
        </div>
      )}
    </div>
  );
}

export default Home