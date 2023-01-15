import React, { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
const BlockUser = () => {
  const db = getDatabase();
  let data = useSelector((state) => state.userAllInfo.userInformaition);
  const [blocklist, setBlocklist] = useState([]);
  useEffect(() => {
    const starCountRef = ref(db, "block/");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.uid == item.val().blockbyId) {
          arr.push({
            id: item.key,
            block: item.val().block,
            blockid: item.val().blockId,
          });
        } else {
          arr.push({
            id: item.key,
            block: item.val().blockby,
            blockbyid: item.val().blockbyId,
          });
        }
      });
      setBlocklist(arr);
    });
  }, []);
  let handleUnblock = (item) => {
    // console.log( item );
    set(push(ref(db, "friends")), {
      receiverId: data.uid,
      receiverName: data.displayName,
      senderId: item.blockid,
      senderName: item.block,
    }).then(() => {
      remove(ref(db, "block/" + item.id));
    });
  };
  return (
    <div className="mt-8 shadow-xl rounded-2xl px-5 py-4 h-[451px] overflow-hidden overflow-y-scroll">
      <div className="relative">
        <h2 className="font-pop text-xl font-semibold mb-5">Blocked User</h2>
        <BsThreeDotsVertical className="absolute right-0 text-2xl top-2.5 text-primary" />
        {blocklist.length === 0 ? (
          <h2 className=" mt-8 bg-blue-500 text-xl text-white font-semibold font-OpenSans p-2">
            No Block user
          </h2>
        ) : (
          blocklist.map((item) => (
            <div className="flex mt-5 items-center border-b border-black pb-4">
              <div className="w-[80px]">
                <img src="images/friends.png" />
              </div>
              <div className="w-[312px]">
                <h3 className="font-pop font-semibold text-xl text-black">
                  {item.block}
                </h3>
                <p className="font-pop font-medium text-[#4D4D4D]">
                  Hi Guys, Wassup!
                </p>
              </div>
              {!item.blockbyid && (
                <div className="w-[90px]">
                  <button
                    onClick={() => handleUnblock(item)}
                    className=" w-full font-pop font-semibold text-white bg-primary text-base py-2 rounded-lg"
                  >
                    unblock
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlockUser;
