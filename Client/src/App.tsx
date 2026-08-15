import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import ScrollToHash from "./components/ScrollToHash";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";
import ResultsPage from "./pages/ResultsPage";
import SavedProjectsPage from "./pages/SavedProjectsPage";
import HistoryPage from "./pages/HistoryPage";

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
        <Route
          path="/results"
          element={<ResultsPage />}
        />
        <Route
          path="/saved"
          element={<SavedProjectsPage />}
        />
        <Route
          path="/history"
          element={<HistoryPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;