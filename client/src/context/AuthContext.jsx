import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const Auth = createContext();

const AuthContext = ({ children }) => {
  const HOST = import.meta.env.VITE_SERVER;

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const fetchUser = async () => {
    const { data } = await axios.post(
      `${HOST}/api/auth/getUser`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      }
    );
    if (data.status === "success") {
      setUser(data.data);
    } else {
      alert("Some error occurred");
    }
  };

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.clear();
  }

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      fetchUser();
    }
  }, [token]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  return (
    <Auth.Provider
      value={{
        HOST,
        token,
        setToken,
        user,
        logout,
      }}
    >
      {children}
    </Auth.Provider>
  );
};

export default AuthContext;

export const AuthState = () => useContext(Auth);
