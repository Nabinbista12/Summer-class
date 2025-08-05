import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Feature/Login/Login";
import Register from "./Feature/Register/Register";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile";

import {
  LoginProtectedRoute,
  ProtectedRoute,
} from "./Shared/Guard/ProtectedRoute";

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
        </Routes>
      </Router>
    </>
  );
}

export default App;
