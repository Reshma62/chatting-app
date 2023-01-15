import React, { useState, useEffect } from "react";
import {
  BsThreeDotsVertical,
  BsTriangleFill,
  BsCamera,
  BsFillMicFill,
} from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { GrGallery } from "react-icons/gr";
import ModalImage from "react-modal-image";
import Camera, { FACING_MODES, IMAGE_TYPES } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import { useSelector } from "react-redux";
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import moment from "moment";
import {
  getStorage,
  ref as stroageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const Chat = () => {
  const db = getDatabase();
  const storage = getStorage();
  let activeChat = useSelector((state) => state.activeChatFriend.activeChat);
  let data = useSelector((state) => state.userAllInfo.userInformaition);
  // console.log(data);
  const [cameraShow, setCameraShow] = useState(false);
  const [chat, setChat] = useState("");
  const [chatList, setChatList] = useState([]);
  function handleTakePhoto(dataUri) {
    
    set(push(ref(db, "activeMessage")), {
      whoSendId: data.uid,
      whoSendName: data.displayName,
      whoReceiveId: activeChat.id,
      whoReceiveName: activeChat.name,
      img: dataUri,
      date: `${new Date().getFullYear()}-${
        new Date().getMonth() + 1
      }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
    }).then(() => {
      setCameraShow(false);
    });
  }

  function handleTakePhotoAnimationDone(dataUri) {
    // Do stuff with the photo...
    console.log("takePhoto");
  }

  function handleCameraError(error) {
    console.log("handleCameraError", error);
  }

  function handleCameraStart(stream) {
    console.log("handleCameraStart");
  }

  function handleCameraStop() {
    console.log("handleCameraStop");
  }
  let handleSendMess = () => {
    if (!chat) {
      console.log("no mess");
    }
    if (activeChat.status == "single") {
      set(push(ref(db, "activeMessage")), {
        whoSendId: data.uid,
        whoSendName: data.displayName,
        whoReceiveId: activeChat.id,
        whoReceiveName: activeChat.name,
        message: chat,
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
      });
    } else {
      console.log("this is group");
    }
    setChat("");
  };
  let handleTextMess = (e) => {
    setChat(e.target.value);
  };
  useEffect(() => {
    const activeChatRef = ref(db, "activeMessage");
    onValue(activeChatRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          (data.uid == item.val().whoSendId &&
            activeChat.id == item.val().whoReceiveId) ||
          (data.uid == item.val().whoReceiveId &&
            activeChat.id == item.val().whoSendId)
        ) {
          arr.push(item.val());
        }
      });
      setChatList(arr);
    });
  }, [activeChat.id]);
  let fileUpload = (e) => {
    console.log("upload", e.target.files[0]);
    const storageRef = stroageRef(
      storage,
      "uploadFile/" + e.target.files[0].name
    );

    const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          set(push(ref(db, "activeMessage")), {
            whoSendId: data.uid,
            whoSendName: data.displayName,
            whoReceiveId: activeChat.id,
            whoReceiveName: activeChat.name,
            img: downloadURL,
            date: `${new Date().getFullYear()}-${
              new Date().getMonth() + 1
            }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
          });
        });
      }
    );
  };
  return (
    <div>
      <div className="shadow-lg bg-white rounded-2xl  py-6">
        {/* Profile Name and Pic Start */}
        <div className=" mx-14 flex gap-x-8 border-b border-solid border-[rgba(0,0,0,0.25)] pb-6 items-center mb-14">
          <div className="relative w-[75px] h-[75px] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
            <img src="images/profilePic.png" alt="" />
            <div className="bg-green-500 absolute w-[15px] h-[15px] rounded-full bottom-[7px] right-0"></div>
          </div>
          <div>
            <h3 className="font-pop font-semibold text-2xl">
              {activeChat.name}{" "}
            </h3>
            <p className="font-pop font-normal text-sm text-[rgba(0, 0, 0, 0.85)]">
              Online
            </p>
          </div>
          <div className="self-end grow text-right">
            <BsThreeDotsVertical className=" inline-flex text-2xl text-primary" />
          </div>
        </div>
        {/* Profile Name and Pic End */}

        {/* Messageing Start */}

        <div className=" px-14 h-[640px] overflow-y-auto">
          {activeChat.status == "single" ? (
            chatList.map((item) =>
              item.whoSendId == data.uid ? (
                item.message ? (
                  <div className="mb-7 text-right">
                    <div className="bg-primary px-5 py-3 inline-block rounded-lg relative text-left">
                      <p className="font-pop font-medium text-base text-white">
                        {item.message}
                      </p>
                      <BsTriangleFill className="absolute right-[-8px] bottom-0 text-primary" />
                    </div>
                    <p className="font-pop font-medium text-sm text-[rgba(0,0,0,0.25)] mt-2">
                      {moment(item.date, "YYYYMMDD hh:mm").calendar()}
                    </p>
                  </div>
                ) : (
                  <div className="mb-7 text-right">
                    <div className="w-64 bg-primary p-3 inline-block rounded-lg relative text-left">
                      <ModalImage small={item.img} large={item.img} />

                      <BsTriangleFill className="absolute right-[-8px] bottom-0 text-primary" />
                    </div>
                    <p className="font-pop font-medium text-sm text-[rgba(0,0,0,0.25)] mt-2">
                      {moment(item.date, "YYYYMMDD hh:mm").calendar()}
                    </p>
                  </div>
                )
              ) : item.message ? (
                <div className="mb-7">
                  <div className="bg-[#F1F1F1] px-5 py-3 inline-block rounded-lg relative">
                    <p className="font-pop font-medium text-base text-black">
                      {item.message}
                    </p>
                    <BsTriangleFill className="absolute left-[-8px] bottom-0 text-[#F1F1F1]" />
                  </div>
                  <p className="font-pop font-medium text-sm text-[rgba(0,0,0,0.25)] mt-2">
                    {/* {moment().calendar(item.date)} */}
                    {moment(item.date, "YYYYMMDD hh:mm").calendar()}
                  </p>
                </div>
              ) : (
                <div className="mb-7 text-left">
                  <div className="w-64 bg-[#f1f1f1] p-3 rounded-lg  text-left">
                    <ModalImage small={item.img} large={item.img} />
                  </div>
                  <p className="font-pop font-medium text-sm text-[rgba(0,0,0,0.25)] mt-2">
                    {moment(item.date, "YYYYMMDD hh:mm").calendar()}
                  </p>
                </div>
              )
            )
          ) : (
            <h1>ami group theke</h1>
          )}

          {/* Receive Message Start */}
          {/*  <div className="mb-7">
            <div className="bg-[#F1F1F1] px-5 py-3 inline-block rounded-lg relative">
              <p className="font-pop font-medium text-base text-black">
                Hey There !
              </p>
              <BsTriangleFill className="absolute left-[-8px] bottom-0 text-[#F1F1F1]" />
            </div>
            <p className="font-pop font-medium text-sm text-[rgba(0,0,0,0.25)] mt-2">
              Today, 2:01pm
            </p>
          </div>
          <div className="mb-7">
            <div className="bg-[#F1F1F1] px-5 py-3 inline-block rounded-lg relative">
              <p className="font-pop font-medium text-base text-black">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Maiores quibusdam nemo, culpa natus dicta mollitia voluptas
                commodi temporibus eligendi optio corrupti provident animi nobis
                quisquam quaerat excepturi sunt? Blanditiis, corporis.
              </p>
              <BsTriangleFill className="absolute left-[-8px] bottom-0 text-[#F1F1F1]" />
            </div>
            <p className="font-pop font-medium text-sm text-[rgba(0,0,0,0.25)] mt-2">
              Today, 2:01pm
            </p>
          </div> */}

          {/* Receive Message End */}
          {/* Send Message Start */}
          {/*  <div className="mb-7 text-right">
            <div className="bg-primary px-5 py-3 inline-block rounded-lg relative text-left">
              <p className="font-pop font-medium text-base text-white">Hey !</p>
              <BsTriangleFill className="absolute right-[-8px] bottom-0 text-primary" />
            </div>
            <p className="font-pop font-medium text-sm text-[rgba(0,0,0,0.25)] mt-2">
              Today, 2:01pm
            </p>
          </div>
          <div className="mb-7 text-right">
            <div className="bg-primary px-5 py-3 inline-block rounded-lg relative text-left">
              <p className="font-pop font-medium text-base text-white">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Maiores quibusdam nemo, culpa natus dicta mollitia voluptas
                commodi temporibus eligendi optio corrupti provident animi nobis
                quisquam quaerat excepturi sunt? Blanditiis, corporis. Lorem
                ipsum dolor sit amet, consectetur adipisicing elit. Maiores
                quibusdam nemo, culpa natus dicta mollitia voluptas commodi
                temporibus eligendi optio corrupti provident animi nobis
                quisquam quaerat excepturi sunt? Blanditiis, corporis. Lorem
                ipsum dolor sit amet, consectetur adipisicing elit. Maiores
                quibusdam nemo, culpa natus dicta mollitia voluptas commodi
                temporibus eligendi optio corrupti provident animi nobis
                quisquam quaerat excepturi sunt? Blanditiis, corporis.
              </p>
              <BsTriangleFill className="absolute right-[-8px] bottom-0 text-primary" />
            </div>
            <p className="font-pop font-medium text-sm text-[rgba(0,0,0,0.25)] mt-2">
              Today, 2:01pm
            </p>
          </div>
          <div className="mb-7 text-right">
            <div className="bg-primary px-5 py-3 inline-block rounded-lg relative text-left">
              <p className="font-pop font-medium text-base text-white">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Maiores quibusdam nemo, culpa natus dicta mollitia voluptas
                commodi temporibus eligendi optio corrupti provident animi nobis
                quisquam quaerat excepturi sunt? Blanditiis, corporis.
              </p>
              <BsTriangleFill className="absolute right-[-8px] bottom-0 text-primary" />
            </div>
            <p className="font-pop font-medium text-sm text-[rgba(0,0,0,0.25)] mt-2">
              Today, 2:01pm
            </p>
          </div> */}

          {/* Send Message End */}
          {/* Send Img Start */}
          {/*  <div className="mb-7 text-right">
            <div className="w-64 bg-primary p-3 inline-block rounded-lg relative text-left">
              <ModalImage
                small={"images/login.png"}
                large={"images/login.png"}
              />

              <BsTriangleFill className="absolute right-[-8px] bottom-0 text-primary" />
            </div>
            <p className="font-pop font-medium text-sm text-[rgba(0,0,0,0.25)] mt-2">
              Today, 2:01pm
            </p>
          </div> */}
          {/* Send Img End */}
          {/* Receive Img Start */}
          {/* <div className="mb-7 text-left">
            <div className="w-64 bg-[#f1f1f1] p-3 rounded-lg  text-left">
              <ModalImage
                small={"images/login.png"}
                large={"images/login.png"}
              />
            </div>
            <p className="font-pop font-medium text-sm text-[rgba(0,0,0,0.25)] mt-2">
              Today, 2:01pm
            </p>
          </div> */}
          {/* Receive Img End */}
          {/* Receive audio Start */}
          {/* <div className="mb-7 text-left">
            <div className="w-64 inline-block rounded-lg text-left">
              <audio controls></audio>
            </div>
            <p className="font-pop font-medium text-sm text-[rgba(0,0,0,0.25)] mt-2">
              Today, 2:01pm
            </p>
          </div> */}
          {/* Receive Img End */}
          {/* Receive video Start */}
          {/* <div className="mb-7 text-left">
            <div className="w-64 inline-block rounded-lg text-left">
              <video controls></video>
            </div>
            <p className="font-pop font-medium text-sm text-[rgba(0,0,0,0.25)] mt-2">
              Today, 2:01pm
            </p>
          </div> */}
          {/* Receive Img End */}
          {/* Send audio Start */}
          {/* <div className="mb-7 text-right">
            <div className="w-64 inline-block rounded-lg text-left">
              <audio controls></audio>
            </div>
            <p className="font-pop font-medium text-sm text-[rgba(0,0,0,0.25)] mt-2">
              Today, 2:01pm
            </p>
          </div> */}
          {/* Receive audio End */}
          {/* Send video Start */}
          {/*  <div className="mb-7 text-right">
            <div className="w-64 inline-block rounded-lg text-left">
              <video controls></video>
            </div>
            <p className="font-pop font-medium text-sm text-[rgba(0,0,0,0.25)] mt-2">
              Today, 2:01pm
            </p>
          </div> */}
          {/* Receive video End */}
        </div>

        {/* Messageing End */}
        {/* Text Input Area Start */}
        <div className=" flex gap-x-5 mx-14 border-t-2 pt-8 border-solid border-[rgba(0,0,0,0.25)] ">
          <div className="relative w-[95%]">
            <input
              onChange={handleTextMess}
              type="text"
              value={chat}
              className="bg-[#f1f1f1] w-full  py-4 rounded-lg"
            />

            <BsCamera
              onClick={() => setCameraShow(!cameraShow)}
              className="absolute right-3 text-2xl top-[50%] translate-y-[-50%]"
            />

            <HiOutlineEmojiHappy className="absolute right-12 text-2xl top-[50%] translate-y-[-50%]" />
            <BsFillMicFill className="absolute right-20 text-2xl top-[50%] translate-y-[-50%]" />
            <label>
              <input
                onChange={fileUpload}
                className="hidden"
                type="file"
                name=""
                id=""
              />
              <GrGallery className="absolute right-28 text-2xl top-[50%] translate-y-[-50%]" />
            </label>
          </div>

          <button
            onClick={handleSendMess}
            className="p-4 bg-primary rounded-lg text-white font-bold"
          >
            <FiSend />
          </button>
        </div>

        {/* Text Input Area End */}
      </div>

      {cameraShow && (
        <div className="absolute w-full h-screen left-0 top-0 z-50">
          <Camera
            onTakePhoto={(dataUri) => {
              handleTakePhoto(dataUri);
            }}
            onTakePhotoAnimationDone={(dataUri) => {
              handleTakePhotoAnimationDone(dataUri);
            }}
            onCameraError={(error) => {
              handleCameraError(error);
            }}
            idealFacingMode={FACING_MODES.ENVIRONMENT}
            idealResolution={{ width: 640, height: 480 }}
            imageType={IMAGE_TYPES.JPG}
            imageCompression={0.97}
            isMaxResolution={true}
            isImageMirror={false}
            isSilentMode={false}
            isDisplayStartCameraError={true}
            isFullscreen={true}
            sizeFactor={1}
            onCameraStart={(stream) => {
              handleCameraStart(stream);
            }}
            onCameraStop={() => {
              handleCameraStop();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Chat;
