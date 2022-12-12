import React,{useState} from 'react'
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom"
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
const ForgotPassword = () => {
  const auth = getAuth();
  let [ email, setEmail ] = useState( "" );
    let [emailErr, setEmailErr] = useState("");
  let handleUpdatePassword = () => {
      if (!email) {
        setEmailErr("email is requried");
      }
      sendPasswordResetEmail(auth, email)
        .then(() => {
          toast.success( "Please check your mail for reset your Password" );
          setEmail("")
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    };
  return (
    <div className="bg-primary w-full h-screen flex justify-center items-center ">
      <ToastContainer position="bottom-center" theme="dark" />
      <div className="bg-white w-[25%] px-5 py-8 rounded ">
        <h1 className="text-3xl font-bold font-nunito text-center">
          Forgot Password
        </h1>
        <div className="w-full relative mb-14 mt-8">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className=" border-2 border-solid border-[heading] rounded-lg w-full py-6 px-14"
          />
          <p className="absolute top-[-12px] left-[39px] text-inputHd font-nunito font-semibold	 bg-white px-[18px]">
            Email Address
          </p>
          {emailErr && (
            <p className="font-semibold font-sm p-2.5 mt-2 bg-red-500 text-white font-Nunito ">
              {emailErr}
            </p>
          )}
        </div>
        <button
          onClick={handleUpdatePassword}
          className="bg-primary px-7 py-5 rounded font-nunito font-semibold text-white text-xl mr-5"
        >
          Update Password
        </button>
        <button className="bg-primary px-7  py-5 rounded font-nunito font-semibold text-white text-xl">
          <Link to="/login">Back to login</Link>
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword