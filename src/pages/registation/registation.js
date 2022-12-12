import React,{useState} from 'react'
import { ToastContainer, toast } from "react-toastify";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { FallingLines } from "react-loader-spinner";
import { useDispatch } from 'react-redux';
import { userLoginInfo } from '../../slices/userSlices';
import { useNavigate, Link } from 'react-router-dom';
import { getDatabase, ref, set } from "firebase/database";
const Registation = () => {
  const auth = getAuth();
  const db = getDatabase();
  let navigate = useNavigate()
  let dispatch=useDispatch()
    let [email, setEmail] = useState("");
    let [fullname, setFullname] = useState("");
    let [password, setPassword] = useState("");
    let [loading, setLoading] = useState(false);
    let [showPassword, setShowPassword] = useState(false);

    let [emailErr, setEmailErr] = useState("");
    let [fullnameErr, setFullnameErr] = useState("");
  let [ passwordErr, setPasswordErr ] = useState( "" );
  let handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailErr("");
  };
  let handleFullName = (e) => {
    setFullname(e.target.value);
    setFullnameErr("");
  };
  let handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordErr("");
  };
   let handleSubmit = () => {
     if (!email) {
       setEmailErr("Email is required");
     } else {
       if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
         setEmailErr("Email is Invalid");
       }
     }
     if (!fullname) {
       setFullnameErr("Full Name is required");
     }
     if (!password) {
       setPasswordErr("Password is required");
     }
     /* else {
      if (!/^(?=.*[a-z])/.test(password)) {
        setPasswordErr("lowercase is required");
      } else if (!/^(?=.*[A-Z])/.test(password)) {
        setPasswordErr("Uppercase is required");
      } else if (!/^(?=.*[0-9])/.test(password)) {
        setPasswordErr("Number is required");
      } else if (!/^(?=.*[!@#$%^&*])/.test(password)) {
        setPasswordErr("Symbol is required");
      } else if (!/^(?=.{8,})/.test(password)) {
        setPasswordErr("At least 8 charecter need ");
      }
    } */
     if (
       fullname &&
       password &&
       email &&
       /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
     ) {
       setLoading(true);
       createUserWithEmailAndPassword(auth, email, password)
         .then( ( users ) => {
           updateProfile(auth.currentUser, {
             displayName: fullname,
             photoURL: "images/demo.png",
           })
             .then( () => {
                 toast.success(
                   "Registation sucessfull. Please verify your Email"
               );
               sendEmailVerification(auth.currentUser);
                 setFullname("");
                 setEmail("");
                 setPassword("");
                 setLoading(false);
                 setTimeout(() => {
                   navigate("/login");
                 }, 2000);
                 dispatch(userLoginInfo(users.user));
              
             } ).then( () => {
               set(ref(db, "users/" + users.user.uid), {
                 username: users.user.displayName,
                 email: users.user.email,
               });
             } )
             .catch((error) => {
               console.log(error);
             });
         
         })
         .catch((error) => {
           const errorCode = error.code;
           if ( errorCode.includes( "" ) ) {
             setEmailErr("Email is already in use");
           }
           setLoading(false);
         });
     }

     
   };
  return (
    <div className="flex px-5 md:px-0 box-border">
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className=" w-full md:w-1/2 flex md:justify-end justify-center items-center">
        <div className="md:mr-16 my-10 md:my-0">
          <h1 className=" text-3xl md:text-4xl font-bold font-Nunito text-secondary mb-5">
            Get started with easily register
          </h1>
          <p className="text-xl mb-10 md:mb-14 text-smallText font-Nunito">
            Free register and you can enjoy it
          </p>
          <div className="md:w-96 w-full relative mb-8 md:mb-14">
            <input
              className="border-2 py-6 px-14 w-full rounded-lg"
              type="email"
              onChange={handleEmail}
              value={email}
            />
            <p className="absolute top-[-10px] left-[56px] font-semibold font-sm pl-[18px] pr-[13px] bg-white text-inputText font-Nunito ">
              Email Address
            </p>
            {emailErr && (
              <p className="font-semibold font-sm p-2.5 mt-2 bg-red-500 text-white font-Nunito ">
                {emailErr}
              </p>
            )}
          </div>
          <div className="md:w-96 w-full relative mb-8 md:mb-14">
            <input
              className="border-2 py-6 px-14 w-full rounded-lg"
              type="text"
              onChange={handleFullName}
              value={fullname}
            />
            <p className="absolute top-[-10px] left-[56px] font-semibold font-sm pl-[18px] pr-[13px] bg-white text-inputText font-Nunito ">
              Full Name
            </p>
            {fullnameErr && (
              <p className="font-semibold font-sm p-2.5 mt-2 bg-red-500 text-white font-Nunito ">
                {fullnameErr}
              </p>
            )}
          </div>
          <div className="md:w-96 w-full relative mb-8 md:mb-14">
            <input
              className="border-2 py-6 px-14 w-full rounded-lg"
              type={showPassword ? "text" : "password"}
              onChange={handlePassword}
              value={password}
            />
            <p className="absolute top-[-10px] left-[56px] font-semibold text-sm pl-[18px] pr-[13px] bg-white text-inputText font-Nunito ">
              Password
            </p>
            {showPassword ? (
              <AiFillEye
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-[50%] right-[20px] translate-y-[-50%]"
              />
            ) : (
              <AiFillEyeInvisible
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-[50%] right-[20px] translate-y-[-50%]"
              />
            )}
            {passwordErr && (
              <p className="font-semibold font-sm p-2.5 mt-2 bg-red-500 text-white font-Nunito ">
                {passwordErr}
              </p>
            )}
          </div>

          {loading ? (
            <div className="bg-primary  md:w-96 w-full rounded-full flex justify-center">
              <FallingLines
                color="#fff"
                width="70"
                visible={true}
                ariaLabel="falling-lines-loading"
              />
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-primary py-5 md:w-96 w-full rounded-full text-xl text-white font-semibold font-Nunito"
            >
              Sign up
            </button>
          )}

          <p className="text-sm	md:w-96 w-full text-center mt-9 md:mt-9 font-OpenSans">
            Already have an account ?{" "}
            <Link to="/login" className="font-bold text-[#EA6C00]">
              Sign In
            </Link>
          </p>
        </div>
      </div>
      <div className="w-1/2 hidden md:block">
        <picture>
          <img
            className="w-full h-screen object-cover	"
            src="images/registation.png"
          />
        </picture>
      </div>
    </div>
  );
}

export default Registation