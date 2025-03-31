import React, { createContext, useState } from "react";

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const login = (email, password) => {
    if (email.trim() !== "" && password.trim() !== "") {
      const generatedToken = "token_" + Math.random().toString(36).substr(2, 9);
      setToken(generatedToken);
      return true;
    }
    return false;
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <LoginContext.Provider value={{ token, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};
