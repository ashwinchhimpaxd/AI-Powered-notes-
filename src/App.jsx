import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Components
import Signup from "./Component/Signup";
import Login from "./Component/Login";
import LandingPage from "./Pages/LandingPage";
import Dashboard2 from "./Pages/Dashboard2.jsx";
import Editorpage from "./Pages/Editorpage.jsx";
import EditProfile from "./Component/Appsettings/allappsettingfeatures/EditProfile.jsx";
import Notfoundpage from "./Pages/Notfoundpage";

const ProtectedRoute = ({ children, authentication = true }) => {

  const authStatus = useSelector(
    (state) => state.UserAuthantication.Islogin
  );

  // redux-persist load hone tak kuch render mat karo
  if (authStatus === undefined) {
    return null;
  }

  // Agar page private hai aur login nahi hai
  if (authentication && !authStatus) {
    return <Navigate to="/Login" />;
  }

  // Agar user already login hai aur login/signup open kar raha hai
  if (!authentication && authStatus) {
    return <Navigate to="/Dashboard" />;
  }

  return children;
};

import { useEffect } from "react";
import userAuthService from "./AppWrite/auth.js";
import { login, logout } from "./redux/Authantication/UserAuthanticationSlice.js";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await userAuthService.getCurrentUser();
        if (user) {
          dispatch(login({
            UserData: {
              userdetaild: user
            }
          }));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("Session check failed:", error);
        dispatch(logout());
      }
    };
    checkSession();
  }, [dispatch]);

  return (
    <div className="h-screen w-full">
      <BrowserRouter>
        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<LandingPage />} />

          {/* AUTH */}
          <Route
            path="/Login"
            element={
              <ProtectedRoute authentication={false}>
                <Login />
              </ProtectedRoute>
            }
          />

          <Route
            path="/Signup"
            element={
              <ProtectedRoute authentication={false}>
                <Signup />
              </ProtectedRoute>
            }
          />

          {/* PRIVATE */}
          <Route
            path="/Dashboard"
            element={
              <ProtectedRoute authentication={true}>
                <Dashboard2 />
              </ProtectedRoute>
            }
          />

          <Route
            path="/editor"
            element={
              <ProtectedRoute authentication={true}>
                <Editorpage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute authentication={true}>
                <EditProfile />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Notfoundpage />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;