import React, { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { getDatabase, ref, onValue, remove,set,push } from "firebase/database";
import { useSelector } from "react-redux";
const MyGroups = () => {
  const db = getDatabase();
  const [groupList, setGroupList] = useState([]);
  const [show, setShow] = useState(false);
  let data = useSelector((state) => state.userAllInfo.userInformaition);
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
  }, [] );
  let acceptRequset = (item) => {
    console.log( item );
     set(push(ref(db, "acceptGroup")) , {
       ...item,
     });
  }

 
  const [groupReqSee, setGroupReqSee] = useState([]);
  let seeGroupReq = ( gitem ) => {
    // console.log(gitem);
    setShow(true);
    const groupReqRef = ref(db, "groupJoinRequset/");
    onValue( groupReqRef, ( snapshot ) => {
      let arr = [];
      snapshot.forEach( item => {
        if (
          data.uid == item.val().adminId &&
          item.val().groupId == gitem.groupId
        ) {

          arr.push({...item.val(),reqId:item.key})
        }
      } )
      setGroupReqSee(arr)
    } );
  };
  let handleGrDelete = ( item ) => {
     console.log(item);
     remove(ref(db, "groupJoinRequset/" + item.reqId));
   };
  return (
    <div className="mt-8 shadow-xl rounded-lg px-5 py-4 h-[451px] overflow-hidden overflow-y-scroll">
      <div className="relative">
        <h2 className="font-pop text-xl font-semibold mb-5">My Groups</h2>
        {show && (
          <button
            onClick={() => setShow(false)}
            className="px-1.5  font-pop font-semibold text-white bg-primary text-base py-1 rounded-lg absolute right-0  top-2.5 "
          >
            Go Back
          </button>
        )}
        {groupList.length === 0 ? (
          <h2 className=" mt-8 bg-blue-500 text-xl text-white font-semibold font-OpenSans p-2">
            No Group Available
          </h2>
        ) : show ? (
          groupReqSee.map((item) => (
            <div className="flex justify-between mt-5 items-center border-b border-black pb-4">
              <div className="w-[100px]">
                <img src="images/friends.png" />
              </div>
              <div className="w-[312px]">
                <p className="font-pop text-lg font-medium text-[#4D4D4D]">
                  {item.groupName}
                </p>
                <p className="font-pop font-medium text-[#4D4D4D]">
                  {item.userName}
                </p>
              </div>
              <div className="flex w-[180px] justify-around flex-wrap">
                <div className=" ">
                  <button
                    onClick={() => acceptRequset(item)}
                    className="px-1.5 w-full font-pop font-semibold text-white bg-primary text-base py-1 rounded-lg "
                  >
                    Accept
                  </button>
                </div>
                <div className="">
                  <button
                    onClick={() => handleGrDelete(item)}
                    className="px-2.5 w-full font-pop font-semibold text-white bg-red-500 text-base py-1  rounded-lg"
                  >
                    Reject
                  </button>
                </div>
              </div>
              <br />

              <br />
            </div>
          ))
        ) : (
          groupList.map((item) => (
            <div className="flex justify-between mt-5 items-center border-b border-black pb-4">
              <div className="w-[100px]">
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
              <div className="flex w-[180px] justify-around flex-wrap  ">
                <div className="">
                  <button className="px-1.5 w-full font-pop font-semibold text-white bg-primary text-base py-1 rounded-lg ">
                    Info
                  </button>
                </div>
                <div className=" ">
                  <button
                    onClick={() => seeGroupReq(item)}
                    className="px-1.5 w-full font-pop font-semibold text-white bg-primary text-base py-1 rounded-lg "
                  >
                    Request
                  </button>
                </div>
                <div className=" mt-2.5">
                  <button
                    onClick={() => handleGrDelete(item)}
                    className="px-2.5 w-full font-pop font-semibold text-white bg-red-500 text-base py-1  rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <br />

              <br />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyGroups;
