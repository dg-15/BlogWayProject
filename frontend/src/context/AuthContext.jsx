// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    console.log(
      "AuthContext: loaded from localStorage →",
      savedUser,
      savedToken
    );

    if (savedUser && savedToken) {
      setCurrentUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const login = (user, token) => {
    console.log("AuthContext: login called →", user, token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setCurrentUser(user);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCurrentUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
