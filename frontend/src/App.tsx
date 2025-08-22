import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Zoom } from 'react-toastify';

import Login from "./Feature/Login/Login";
import Register from "./Feature/Register/Register";

import UserProfile from "./Pages/UserProfile/UserProfile";

import {
  LoginProtectedRoute,
  ProtectedRoute,
} from "./Shared/Guard/ProtectedRoute";
import Careers from "./Pages/Careers/Careers";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile";
import NotFound from "./Pages/NotFound/NotFound";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/login"
            element={
              <LoginProtectedRoute>
                <Login />
              </LoginProtectedRoute>
            }
          ></Route>
          <Route
            path="/register"
            element={
              <LoginProtectedRoute>
                <Register />
              </LoginProtectedRoute>
            }
          ></Route>
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/user/:id"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          ></Route>
          <Route path="/careers" element={<Careers />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Zoom}
        theme="light"
      />
    </>
  );
}

export default App;
