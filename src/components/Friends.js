import React, { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { activeFriends } from "../slices/activeFriendSlices";
const Friends = () => {
  const db = getDatabase();
  let [friend, setFriend] = useState([]);
  let data = useSelector( ( state ) => state.userAllInfo.userInformaition );
  let dispatch = useDispatch();

  useEffect(() => {
    const friendsRef = ref(db, "friends/");
    onValue(friendsRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          data.uid == item.val().receiverId ||
          data.uid == item.val().senderId
        ) {
          arr.push({ ...item.val(), friendId: item.key });
        }
      });
      setFriend(arr);
    });
  }, []);

  let handleBlock = (item) => {
    // console.log(item);
    if (data.uid == item.senderId) {
      set(push(ref(db, "block")), {
        block: item.receiverName,
        blockId: item.receiverId,
        blockby: item.senderName,
        blockbyId: item.senderId,
      }).then(() => {
        remove(ref(db, "friends/" + item.friendId));
      });
    } else {
      set(push(ref(db, "block")), {
        block: item.senderName,
        blockId: item.senderId,
        blockby: item.receiverName,
        blockbyId: item.receiverId,
      }).then(() => {
        remove(ref(db, "friends/" + item.friendId));
      });
    }
  };
  let handleAllFriends = ( item ) => {
    let receiverFriends = {
      status: "single",
      id: item.receiverId,
      name: item.receiverName,
    };
    let senderFriends = {
      status: "single",
      id: item.senderId,
      name: item.senderName,
    };
    if (item.senderId == data.uid) {
      localStorage.setItem("activeChatUser", JSON.stringify(receiverFriends));
      dispatch( activeFriends( receiverFriends ) );
    } else {
      localStorage.setItem("activeChatUser", JSON.stringify(senderFriends));
      dispatch(activeFriends(senderFriends));
    }
  };
  return (
    <div className=" shadow-xl rounded-lg px-5 py-4 h-[440px] overflow-hidden overflow-y-scroll">
      <div className="relative">
        <h2 className="font-pop text-xl font-semibold mb-5">Friends</h2>
        <BsThreeDotsVertical className="absolute right-0 text-2xl top-2.5 text-primary" />
        {friend.map((item) => (
          <div
            onClick={() => handleAllFriends(item)}
            className="flex justify-between mt-5 items-center border-b border-black pb-4"
          >
            <div className="w-[80px]">
              <img src="images/friends.png" />
            </div>
            <div className="w-[312px]">
              <h3 className="font-pop font-semibold text-xl text-black">
                {data.uid == item.senderId
                  ? item.receiverName
                  : item.senderName}
              </h3>
              <p className="font-pop font-medium text-[#4D4D4D]">
                Hi Guys, Wassup!
              </p>
            </div>
            <div className="w-[90px]">
              <button
                onClick={() => handleBlock(item)}
                className="font-pop font-semibold text-white bg-primary text-base py-2 w-full rounded-lg"
              >
                Block
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Friends;
