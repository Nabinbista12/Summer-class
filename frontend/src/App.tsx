import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Feature/Login/Login";
import Register from "./Feature/Register/Register";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile";

import UserProfile from "./Pages/UserProfile/UserProfile";

import {
  LoginProtectedRoute,
  ProtectedRoute,
} from "./Shared/Guard/ProtectedRoute";
import Network from "./Pages/Network/Network";
import Careers from "./Pages/Careers/Careers";

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
          <Route
            path="/mynetwork"
            element={
              <ProtectedRoute>
                <Network />
              </ProtectedRoute>
            }
          ></Route>
          <Route path="/careers" element={<Careers />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
