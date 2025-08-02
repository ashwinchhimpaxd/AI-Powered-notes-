import "./App.css";
import Signup from "./Component/Signup";
import Login from "./Component/Login";
import LandingPage from "./Pages/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Notfoundpage from "./Pages/Notfoundpage";
import Editor from "./Pages/Editor";
function App() {

  function AppRoute() {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Editor" element={<Editor />} />
        <Route path="*" element={<Notfoundpage />} />
      </Routes>
    )
  }
  return (
    <>
      <div className=" h-screen w-full">

        <BrowserRouter>

          <AppRoute />
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
