import "./App.css";
import Signup from "./Component/Signup";
import LoginUsingNumber from "./Component/LoginAuthantication/LoginUsingNumber";
import Login from "./Component/Login";
import LandingPage from "./Pages/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Notfoundpage from "./Pages/Notfoundpage";
import Editorpage from "./Pages/Editorpage.jsx";
import Dashboard2 from "./Pages/Dashboard2.jsx";


function App() {

  function AppRoute() {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Dashboard" element={<Dashboard2 />} />
        <Route path="/editor" element={<Editorpage />} />
        <Route path="*" element={<Notfoundpage />} />
      </Routes>
    )
  }
  return (
    <>
      <div className=" h-screen w-full">

        <BrowserRouter>
          {/* <Navbar /> */}
          {/* <Dashboard2 /> */}

          {/* <Editor2 /> */}
          <AppRoute />
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
