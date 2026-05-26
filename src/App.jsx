import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import React, { Suspense, lazy, useEffect, useState } from "react";

// Standard Components (Lightweight)
import Signup from "./Component/Signup";
import Login from "./Component/Login";
import LandingPage from "./Pages/LandingPage";
import Notfoundpage from "./Pages/Notfoundpage";
import ToastContainer from "./Component/Toast/ToastContainer";

// Lazy Loaded Components (Heavy chunks)
const Dashboard2 = lazy(() => import("./Pages/Dashboard2.jsx"));
const Editorpage = lazy(() => import("./Pages/Editorpage.jsx"));
const EditProfile = lazy(() => import("./Component/Appsettings/allappsettingfeatures/EditProfile.jsx"));

const PageLoader = () => (
  <div className="min-h-screen w-full bg-[#0b1120] flex flex-col items-center justify-center">

    {/* Logo Section */}
    <div className="relative mb-10">
      {/* Animated Spotlight/Aura */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-2xl opacity-50 animate-pulse">
      </div>

      {/* Main Logo */}
      <div className="relative z-10 w-32 h-32 flex items-center justify-center bg-[#10192f] border border-gray-700 rounded-2xl shadow-2xl hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-shadow duration-500 group">

        {/* Glowing Icon - Subtle pulse */}
        <span className="text-5xl text-blue-400 group-hover:text-blue-300 transition-colors duration-300 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.636 4.776l-1.686 3.181a2.796 2.796 0 01-2.214.923h-3.593a2.797 2.797 0 01-2.213-.923l-1.687-3.181M17.636 20.051l-1.686-3.181a2.797 2.797 0 00-2.214-.923H9.44a2.795 2.795 0 00-2.213.923L6.364 20.05M22 12l-2.89 5.478-2.235-4.211c-.158-.297-.46-.49-.8-.49h-6.154c-.337 0-.64.193-.8.49L4 12 1.11 6.522 3.344 2.31c.158-.297.46-.49.8-.49h6.154c.339 0 .642.193.8.49l2.235 4.211L22 12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>

        {/* Floating Orbs */}
        <div className="absolute top-4 left-3 w-3 h-3 bg-purple-400 rounded-full blur-sm animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-4 right-3 w-3 h-3 bg-cyan-400 rounded-full blur-sm animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-70"></div>
      </div>

      {/* Brand Text */}
      <h1 className="mt-6 text-3xl font-extrabold text-white tracking-tight">
        Nexus <span className="text-blue-400">AI</span>
      </h1>
    </div>

    {/* Loading Spinner */}
    {/* <div className="relative w-16 h-16">
      <svg className="absolute inset-0 w-full h-full text-blue-500 animate-spin" viewBox="0 0 32 32">
        <path className="opacity-10" fill="currentColor" d="M16 30A14 14 0 1 1 30 16" />
        <path fill="currentColor" d="M16 30A14 14 0 1 1 30 16a14 14 0 0 1-14 14z" />
      </svg>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-800 border-t-blue-500 rounded-full animate-spin"></div>
    </div> */}

    {/* Status Text */}
    <p className="mt-6 text-gray-400 text-sm font-medium animate-pulse">
      Initializing neural pathways...
    </p>
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
import { clearNotes } from "./redux/NotesCreation/NotesCreationSlice.js";

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
          dispatch(clearNotes());
          dispatch(logout());
        }
      } catch (error) {
        console.error("Session check failed:", error);
        dispatch(clearNotes());
        dispatch(logout());
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkSession();
  }, [dispatch]);

  if (isCheckingAuth) {
    return null;
  }

  return (
    <div className="h-screen w-full">
      <ToastContainer />
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
                  <Suspense fallback={null}>
                  <Dashboard2 />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/editor"
            element={
              <ProtectedRoute authentication={true}>
                <Suspense fallback={null}>
                  <Editorpage />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute authentication={true}>
                <Suspense fallback={null}>
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