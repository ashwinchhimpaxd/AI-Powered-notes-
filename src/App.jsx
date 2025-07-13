import "./App.css";
import Signup from "./Component/Signup";
import Login from "./Component/Login";
import LandingPage from "./Pages/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
function App() {

  function AppRoute() {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        {/* <Route path="/" element={<LandingPage />} /> */}
      </Routes>
    )
  }
  return (
    <>
      <div className=" h-screen w-full">

        {/* <BrowserRouter>
          <AppRoute />
        </BrowserRouter> */}
        <Dashboard />
      </div>
    </>
  );
}

export default App;
