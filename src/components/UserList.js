import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useSelector } from "react-redux";

const UserList = () => {
  const db = getDatabase();

  let [userList, setUserList] = useState([]);
  let [friendReqList, setFriendReqList] = useState([]);
  let [friendsList, setFriendsList] = useState([]);
  let [block, setBlock] = useState([]);
  let data = useSelector((state) => state.userAllInfo.userInformaition);
  // console.log( data );
  useEffect(() => {
    const userListRef = ref(db, "users/");
    onValue(userListRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.uid != item.key) {
          arr.push({ ...item.val(), userId: item.key });
        }
      });
      setUserList(arr);
    });
  }, []);
  let handleReqSend = (item) => {
    set(push(ref(db, "friendRequest")), {
      senderName: data.displayName,
      senderId: data.uid,
      receiverName: item.username,
      receiverId: item.userId,
    });
  };
  useEffect(() => {
    const friendRequestRef = ref(db, "friendRequest/");
    onValue(friendRequestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().receiverId + item.val().senderId);
      });
      setFriendReqList(arr);
    });
  }, []);
  useEffect(() => {
    const friendsRef = ref(db, "friends/");
    onValue(friendsRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().receiverId + item.val().senderId);
      });
      setFriendsList(arr);
    });
  }, []);
  useEffect(() => {
    const blockRef = ref(db, "block/");
    onValue(blockRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().blockId + item.val().blockbyId);
      });
      setBlock( arr );
      console.log(arr);
    });
  }, []);

  return (
    <div className=" shadow-xl rounded-lg px-5 py-4 h-[440px] overflow-hidden overflow-y-scroll">
      <div className="relative">
        <h2 className="font-pop text-xl font-semibold mb-5">User List</h2>
        <BsThreeDotsVertical className="absolute right-0 text-2xl top-2.5 text-primary" />
        {userList.map((item) => (
          <div className="flex justify-between mt-5 items-center border-b border-black pb-4">
            <div className="w-[80px]">
              <img src="images/friends.png" />
            </div>
            <div className="w-[312px]">
              <h3 className="font-pop font-semibold text-xl text-black">
                {item.username}
              </h3>
              <p className="font-pop font-medium text-[#4D4D4D]">
                {item.email}
              </p>
            </div>
            {/* { friendsList.includes(data.uid + item.userId) ||
              friendsList.includes(item.userId + data.uid) ? (
              <button className="font-pop font-semibold text-white bg-primary text-xl py-2 px-6 rounded-lg">
                F
              </button>
            ) : friendReqList.includes(data.uid + item.userId) ||
              friendReqList.includes(item.userId + data.uid) ? (
              <button className="font-pop font-semibold text-white bg-primary text-xl py-2 px-6 rounded-lg">
                P
              </button>
            ) : (
              <button
                onClick={() => handleReqSend(item)}
                className="font-pop font-semibold text-white bg-primary text-xl py-2 px-6 rounded-lg"
              >
                +
              </button>
            )} */}
            {block.includes(data.uid + item.userId) ||
            block.includes(item.userId + data.uid) ? (
              <div className="w-[90px]">
                <button className=" w-full font-pop font-semibold text-white bg-primary text-base py-2  rounded-lg">
                  Blocked
                </button>
              </div>
            ) : friendsList.includes(data.uid + item.userId) ||
              friendsList.includes(item.userId + data.uid) ? (
              <div className="w-[90px]">
                <button className=" w-full font-pop font-semibold text-white bg-primary text-base py-2  rounded-lg">
                  Friend
                </button>
              </div>
            ) : friendReqList.includes(data.uid + item.userId) ||
              friendReqList.includes(item.userId + data.uid) ? (
              <div className="w-[90px]">
                <button className=" w-full font-pop font-semibold text-white bg-primary text-base py-2  rounded-lg">
                  Pending
                </button>
              </div>
            ) : (
              <div className="w-[90px]">
                <button
                  onClick={() => handleReqSend(item)}
                  className=" w-full font-pop font-semibold text-white bg-primary text-base py-2 rounded-lg"
                >
                  Request
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
