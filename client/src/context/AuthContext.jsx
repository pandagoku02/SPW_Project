import { createContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { makeRequest } from "../utils/axios";

export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const cookies = new Cookies();
  const navigate = useNavigate();

  useEffect(() => {
    const details = async () => {
      const userId = cookies.get("userId");
      console.log(userId);
      if (userId) {
        const res = await makeRequest.get("/users/user-details");
        setCurrentUser(res?.data?.data);
      }
      setLoading(false);
    };

    details();
  }, []);

  const login = async ({ username, password }) => {
    try {
      const res = await makeRequest.post("/users/create-session", {
        username,
        password,
      });
      if (res?.data?.success) {
        toast.success("Logged in successfully.");
        setCurrentUser(res?.data?.data);
        navigate("/home");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Something went wrong!");
    }
  };

  const logout = () => {
    cookies.set("userId", "");
    toast.success("Logged out successfully.");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
