import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { useSelector } from "react-redux";
const Message = () => {
  const db = getDatabase();
  let data = useSelector((state) => state.userAllInfo.userInformaition);
  const [groupList, setGroupList] = useState([]);
  const [groupMember, setGroupMember] = useState([]);
  useEffect(() => {
    const groupRef = ref(db, "createGroup/");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.uid == item.val().adminId) {
          arr.push({ ...item.val(), groupId: item.key });
        }
      });
      setGroupList(arr);
    });
  }, []);
  useEffect(() => {
    const memberRef = ref(db, "acceptGroup/");
    onValue(memberRef, (snapshot) => {
      let arr = [];
      snapshot.forEach( ( item ) => {
        console.log(item.val());
        if (data.uid !== item.val().adminId) {
          arr.push({ ...item.val(), acceptId: item.key });
        }
      });
      setGroupMember(arr);
    });
  }, []);

  return (
    <>
      {" "}
      {/* My Group list */}
      {groupList.map((item) => (
        <div className="flex mt-5 items-center border-b border-black pb-4">
          <div className="w-[80px]">
            <img src="images/friends.png" />
          </div>
          <div className="w-[312px]">
            <p className="font-pop font-medium text-[#4D4D4D]">
              Admin: {item.adminName}
            </p>
            <h3 className="font-pop font-semibold text-xl text-black">
              {item.groupName}
            </h3>
            <p className="font-pop font-medium text-[#4D4D4D]">
              {item.userName}
            </p>
          </div>

          <div className="w-[90px]">
            <button className="font-pop font-semibold text-white bg-primary text-xl py-1 w-full rounded-lg mr-2">
              my groups
            </button>
          </div>
        </div>
      ))}
      {/* Member Group */}
      {groupMember.map((item) => (
        <div className="flex mt-5 items-center border-b border-black pb-4">
          <div className="w-[80px]">
            <img src="images/friends.png" />
          </div>
          <div className="w-[312px]">
            <p className="font-pop font-medium text-[#4D4D4D]">
              Admin:{item.adminName}{" "}
            </p>
            <h3 className="font-pop font-semibold text-xl text-black">
              {item.groupName}
            </h3>
            <p className="font-pop font-medium text-[#4D4D4D]">group</p>
          </div>

          <div className="w-[90px]">
            <button className="font-pop font-semibold text-white bg-primary text-xl py-1 w-full rounded-lg mr-2">
              member
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default Message;
