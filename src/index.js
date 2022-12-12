import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import "react-toastify/dist/ReactToastify.css";
import firebaseConfig from './firebase.confige';
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Registation from './pages/registation/registation';

import Login from './pages/login/login';
import ForgetPassword from "./pages/forgetPassword/forgotPassword";
import Home from './pages/home';
import store from "./store";
import { Provider } from "react-redux";
import Message from './pages/message';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    path: "/registation",
    element: <Registation/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/forgetPassword",
    element: <ForgetPassword/>,
  },
  {
    path: "/message",
    element: <Message/>,
  },
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={router} />
      
    </Provider>
  </React.StrictMode>
);
