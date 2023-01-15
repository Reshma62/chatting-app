import React, { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  set,
  push,
} from "firebase/database";
import { useSelector } from "react-redux";
const AllGroupList = () => {
  const db = getDatabase();
  const [show, setShow] = useState(false);
  const [gName, setGName] = useState("");
  const [gTag, setGTag] = useState("");
  const [gNameErr, setGNameErr] = useState("");
  const [gTagErr, setGTagErr] = useState("");
  let data = useSelector((state) => state.userAllInfo.userInformaition);
  let handleGName = (e) => {
    setGName(e.target.value);
    setGNameErr("");
  };
  let handlegTagName = (e) => {
    setGTag(e.target.value);
    setGTagErr("");
  };

  let handlegroupCreate = () => {
    setShow(!show);
  };
  let handleGroup = () => {
    if (!gName) {
      setGNameErr("Group Name Required");
    }
    if (!gTag) {
      setGTagErr("Group Tag Required");
    }
    set(push(ref(db, "createGroup")), {
      adminName: data.displayName,
      adminId: data.uid,
      groupName: gName,
      groupTagline: gTag,
    }).then(() => {
      setShow(false);
    });
    setGTag("");
    setGName("");
  };
  const [groupList, setGroupList] = useState([]);
  useEffect(() => {
    const groupRef = ref(db, "createGroup/");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
          arr.push({ ...item.val(), groupId: item.key });
        
      });
      setGroupList(arr);
    });
  }, []);
  let groupJoinReq = (item) => {
    console.log(item);
    set(push(ref(db, "groupJoinRequset")), {
      ...item,
      userId: data.uid,
      userName: data.displayName,
    });
  };
  const [groupReqList, setGroupReqList] = useState([]);
  useEffect(() => {
    const groupReqJoinRef = ref(db, "groupJoinRequset/");
    onValue(groupReqJoinRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        // arr.push(item.val().userId + item.val().groupId);
        arr.push(item.val().groupId + item.val().userId);
      });
      setGroupReqList(arr);
      console.log(arr);
    });
  }, []);

  return (
    <div className="mt-6 shadow-xl rounded-lg px-5 py-4 h-[400px] overflow-hidden overflow-y-scroll">
      <div className="relative">
        <h2 className="font-pop text-xl font-semibold mb-5">Groups List</h2>
        {show ? (
          <button
            onClick={handlegroupCreate}
            className=" absolute right-0 top-0 font-pop font-semibold text-white bg-primary text-sm py-2 px-3 rounded-lg"
          >
            Go Back
          </button>
        ) : (
          <button
            onClick={handlegroupCreate}
            className=" absolute right-0 top-0 font-pop font-semibold text-white bg-primary text-sm py-2 px-3 rounded-lg"
          >
            Create Group
          </button>
        )}

        {show ? (
          <div className="mt-8">
            <input
              className="border-2 border-gray-400 rounded mb-2.5 p-2.5 w-full outline-0"
              type="email"
              placeholder="Group Name"
              onChange={handleGName}
              value={gName}
            />
            {gNameErr && (
              <p className="font-semibold font-sm p-2.5 mt-2 bg-red-500 text-white font-Nunito mb-2.5">
                {gNameErr}
              </p>
            )}
            <input
              className="border-2 border-gray-400 rounded mb-2.5 p-2.5 w-full outline-0"
              type="email"
              placeholder="Group Tagline"
              onChange={handlegTagName}
              value={gTag}
            />
            {gTagErr && (
              <p className="font-semibold font-sm p-2.5 mt-2 bg-red-500 text-white font-Nunito mb-2.5">
                {gTagErr}
              </p>
            )}
            <button
              onClick={handleGroup}
              className="bg-primary py-2.5 w-full rounded text-xl text-white font-semibold font-Nunito"
            >
              Create
            </button>
          </div>
        ) : groupList.length == 0 ? (
          <h2 className=" mt-8 bg-blue-500 text-xl text-white font-semibold font-OpenSans p-2">
            No Group List Available
          </h2>
        ) : (
          groupList.map((item) => (
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
                  {item.groupTagline}
                </p>
              </div>
              {groupReqList.includes(item.groupId + data.uid) ||
              groupReqList.includes(data.uid + item.groupId) ? (
                <div className="w-[90px]">
                  <button className="font-pop font-semibold text-white bg-primary text-base py-1 w-full rounded-lg mr-2">
                    Pending
                  </button>
                </div>
              ) : (
                <div className="w-[90px]">
                  <button
                    onClick={() => groupJoinReq(item)}
                    className="font-pop font-semibold text-white bg-primary text-xl py-1 w-full rounded-lg mr-2"
                  >
                    Join
                  </button>
                </div>
              )}

              {/* <button
                onClick={() => handleGrDelete(item)}
                className="font-pop font-semibold text-white bg-red-500 text-xl py-1 px-3 rounded-lg"
              >
                Delete
              </button> */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllGroupList;
