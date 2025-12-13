import "./App.css";
import Signup from "./Component/Signup";
import Login from "./Component/Login";
import LandingPage from "./Pages/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Notfoundpage from "./Pages/Notfoundpage";
import Editor from "./Pages/Editor";
import Editor2 from "./Component/Editor/Editor2";
import Editorpage from "./Pages/Editorpage";
import Navbar from "./Component/Navbar";
import Dashboard2 from "./Pages/Dashboard2";


function App() {

  function AppRoute() {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Dashboard" element={<Dashboard2 />} />
        <Route path="/Editor" element={<Editor2 />} />
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
