import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import Loader from "./components/loader/Loader";

function App() {
  const { currentUser, loading } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/" />;
    }
    return children;
  };

  const LoginProtectionRoute = ({ children }) => {
    if (currentUser) {
      return <Navigate to="/home" />;
    }
    return children;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="App">
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            <LoginProtectionRoute>
              <Login />
            </LoginProtectionRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
