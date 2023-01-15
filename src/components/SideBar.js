import React, { useState } from "react";
import {
  MdCloudUpload,
  MdNotifications,
  MdSettings,
  MdOutlineLogout,
} from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { BsFillChatDotsFill } from "react-icons/bs";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { userLoginInfo } from "../slices/userSlices";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { FallingLines } from "react-loader-spinner";
const SideBar = ({active}) => {
  const auth = getAuth();
  let [modal, setModal] = useState(false);
  let [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [cropData, setCropData] = useState("");
  const [cropper, setCropper] = useState("");
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let data = useSelector((state) => state.userAllInfo.userInformaition);
  // console.log(data);
  let handleModalOpen = () => {
    setModal(true);
  };
  let handleModalClose = () => {
    setModal(false);
    setImage("");
    setCropData("");
    setCropper("");
  };
  let handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
        dispatch(userLoginInfo(null));
        localStorage.removeItem("userInfoStore");
      })
      .catch((error) => {
        // An error happened.
      });
  };
  const handleImgUp = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
    }
    setLoading(true);
    const storage = getStorage();
    const storageRef = ref(storage, auth.currentUser.uid);
    // Data URL string
    const message4 = cropper.getCroppedCanvas().toDataURL();
    uploadString(storageRef, message4, "data_url").then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        updateProfile(auth.currentUser, {
          photoURL: downloadURL,
        }).then(() => {
          setLoading(false);
          setModal(false);
          setImage("");
          setCropData("");
          setCropper("");
        });
      });
    });
  };
  return (
    <div className="">
      <div className="flex justify-center mt-8 relative group w-28 h-28 mx-auto">
        <img className="w-full h-full rounded-full" src={data.photoURL} />
        <div
          onClick={handleModalOpen}
          className=" opacity-0 group-hover:opacity-100 absolute w-full h-full bg-[rgba(0,0,0,.4)] rounded-full top-0 left-0 flex justify-center items-center "
        >
          <MdCloudUpload className="text-white text-2xl  rounded-full" />
        </div>
      </div>
      <h4 className="text-white text-center text-xl mt-5">
        {data.displayName}
      </h4>
      <div className="">
        <Link to="/">
          <div className="relative mt-24 z-[1] flex justify-center ">
            <FaHome
              className={`text-4xl ${
                active == "home" ? "text-primary" : "  text-[#BAD1FF]"
              }`}
            />
            <div
              className={`absolute w-[80%] ${
                active == "home" ? " bg-white" : "bg-primary "
              }  top-[-13px] z-[-1] left-[36px] pt-10 py-6  rounded-l-2xl `}
            ></div>
            <div className="absolute w-[13px]  bg-primary  top-[-13px] z-[-1] right-[0] pt-10 py-6 rounded-l-2xl"></div>
          </div>
        </Link>
        <Link to="/message">
          <div className="relative mt-24 z-[1] flex justify-center ">
            <BsFillChatDotsFill
              className={`text-4xl ${
                active == "message" ? "text-primary" : "  text-[#BAD1FF]"
              }`}
            />
            <div
              className={`absolute w-[80%] ${
                active == "message" ? " bg-white" : "bg-primary "
              }  top-[-13px] z-[-1] left-[36px] pt-10 py-6  rounded-l-2xl `}
            ></div>
            <div className="absolute w-[13px]  bg-primary  top-[-13px] z-[-1] right-[0] pt-10 py-6 rounded-l-2xl"></div>
          </div>
        </Link>
        <div className="relative mt-24 z-[1] flex justify-center ">
          <MdNotifications className="text-4xl text-[#BAD1FF]" />
          <div className="absolute w-[80%]  bg-none  top-[-13px] z-[-1] left-[36px] pt-10 py-6 rounded-l-2xl"></div>
          <div className="absolute w-[13px]  bg-none  top-[-13px] z-[-1] right-[0] pt-10 py-6 rounded-l-2xl"></div>
        </div>
        <div className="relative mt-24 z-[1] flex justify-center ">
          <MdSettings className="text-4xl text-[#BAD1FF]" />
          <div className="absolute w-[80%]  bg-none  top-[-13px] z-[-1] left-[36px] pt-10 py-6 rounded-l-2xl"></div>
          <div className="absolute w-[13px]  bg-none  top-[-13px] z-[-1] right-[0] pt-10 py-6 rounded-l-2xl"></div>
        </div>
        <div
          onClick={handleLogout}
          className="relative mt-24 z-[1] flex justify-center "
        >
          <MdOutlineLogout className="text-4xl text-[#BAD1FF]" />
          <div className="absolute w-[80%]  bg-none  top-[-13px] z-[-1] left-[36px] pt-10 py-6 rounded-l-2xl"></div>
          <div className="absolute w-[13px]  bg-none  top-[-13px] z-[-1] right-[0] pt-10 py-6 rounded-l-2xl"></div>
        </div>
      </div>
      {/* Modal Upload Pic */}
      {modal && (
        <div className="w-full h-screen absolute bg-primary top-0 left-0 z-50 flex justify-center items-center">
          <div className="bg-white  py-5 px-8 w-2/4 rounded-xl">
            <h3 className="text-2xl font-pop font-semibold mb-5">
              Please upload your profile pic
            </h3>

            {image ? (
              <div className="w-[100px] h-[100px] mx-auto rounded-full overflow-hidden my-5">
                <div className=" img-preview  w-full h-full"></div>
              </div>
            ) : (
              <div className="w-[100px] h-[100px] mx-auto rounded-full overflow-hidden mb-5">
                <img className="w-full h-full" src={data.photoURL} />
              </div>
            )}
            {image && (
              <Cropper
                className="mb-5"
                style={{ height: 400, width: "100%" }}
                zoomTo={0.5}
                initialAspectRatio={1}
                preview=".img-preview"
                src={image}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                onInitialized={(instance) => {
                  setCropper(instance);
                }}
                guides={true}
              />
            )}

            <input onChange={handleImgUp} className="mb-5" type="file" />
            <br />
            {loading ? (
              <div className="bg-primary  w-96 rounded-full flex justify-center">
                <FallingLines
                  color="#fff"
                  width="70"
                  visible={true}
                  ariaLabel="falling-lines-loading"
                />
              </div>
            ) : (
              <>
                <button
                  onClick={getCropData}
                  className="bg-primary px-7 py-5 rounded font-nunito font-semibold text-white text-xl mr-5"
                >
                  Upload
                </button>
                <button
                  onClick={handleModalClose}
                  className="bg-primary px-7 py-5 rounded font-nunito font-semibold text-white text-xl mr-5"
                >
                  Cancle
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;
