import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { useSelector } from "react-redux";
const FriendList = () => {
  const db = getDatabase();
  let [friendReqList, setFriendReqList] = useState([]);
  let data = useSelector((state) => state.userAllInfo.userInformaition);
  useEffect(() => {
    const friendRequestRef = ref(db, "friendRequest/");
    onValue(friendRequestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.uid == item.val().receiverId) {
          arr.push({ ...item.val(), reqId: item.key });
        }
      });
      setFriendReqList(arr);
    });
  }, []);

  let handleAccept = (item) => {
    console.log(item);
    set(push(ref(db, "friends")), {
      ...item,
    }).then(() => {
      remove(ref(db, "friendRequest/" + item.reqId));
    });
  };
  return (
    <div className="mt-8 shadow-xl rounded-lg px-5 py-4 h-[462px] overflow-hidden overflow-y-scroll">
      <div className="relative">
        <h2 className="font-pop text-xl font-semibold mb-5">Friend Request</h2>
        <BsThreeDotsVertical className="absolute right-0 text-2xl top-2.5 text-primary" />
        {friendReqList.length == 0 ? (
          <h2 className=" mt-8 bg-blue-500 text-xl text-white font-semibold font-OpenSans p-2">
            No friend Request
          </h2>
        ) : (
          friendReqList.map((item) => (
            <div className="flex mt-5 items-center border-b border-black pb-4">
              <div className="mr-10">
                <img src="images/group2.png" />
              </div>
              <div className="mr-20">
                <h3 className="font-pop font-semibold text-xl text-black">
                  {item.senderName}
                </h3>
                <p className="font-pop font-medium text-[#4D4D4D]">
                  Hi Guys, Wassup!
                </p>
              </div>
              <button
                onClick={() => handleAccept(item)}
                className="font-pop font-semibold text-white bg-primary text-xl py-2 px-6 rounded-lg"
              >
                Accept
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FriendList;
