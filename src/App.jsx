import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import React, { Suspense, lazy, useEffect, useState } from "react";

// Standard Components (Lightweight)
import Signup from "./Component/Signup";
import Login from "./Component/Login";
import LandingPage from "./Pages/LandingPage";
import Notfoundpage from "./Pages/Notfoundpage";

// Lazy Loaded Components (Heavy chunks)
const Dashboard2 = lazy(() => import("./Pages/Dashboard2.jsx"));
const Editorpage = lazy(() => import("./Pages/Editorpage.jsx"));
const EditProfile = lazy(() => import("./Component/Appsettings/allappsettingfeatures/EditProfile.jsx"));

const PageLoader = () => (
  <div className="flex h-screen w-full justify-center items-center bg-[#1e1e1e] text-zinc-400">
    <div className="animate-pulse text-lg tracking-widest font-semibold flex items-center gap-2">
        Loading Module...
    </div>
  </div>
);

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

import userAuthService from "./AppWrite/auth.js";
import { login, logout } from "./redux/Authantication/UserAuthanticationSlice.js";

function App() {
  const dispatch = useDispatch();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

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
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkSession();
  }, [dispatch]);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-full justify-center items-center bg-[#1e1e1e] text-zinc-400">
        <div className="animate-pulse text-lg tracking-widest font-semibold flex items-center gap-2">
            Loading...
        </div>
      </div>
    );
  }

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
                <Suspense fallback={<PageLoader />}>
                  <Dashboard2 />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/editor"
            element={
              <ProtectedRoute authentication={true}>
                <Suspense fallback={<PageLoader />}>
                  <Editorpage />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute authentication={true}>
                <Suspense fallback={<PageLoader />}>
                  <EditProfile />
                </Suspense>
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