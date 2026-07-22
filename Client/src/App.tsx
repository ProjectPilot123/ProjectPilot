import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import ScrollToHash from "./components/ScrollToHash";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";


function App() {

  return (

    <BrowserRouter>

      <ScrollToHash />

      <NavBar />

      <Routes>

        <Route
          path="/"
          element={<LandingPage />}
        />


        <Route
          path="/login"
          element={<LoginPage />}
        />


        <Route
          path="/signup"
          element={<SignupPage />}
        />


        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


      </Routes>

    </BrowserRouter>

  );
}


export default App;