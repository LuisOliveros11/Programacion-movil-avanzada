import React, { createContext, useState, useEffect } from "react";
import { getRealm } from "./database";

export const RealmContext = createContext(null);

export const RealmProvider = ({ children }) => {
  const [realm, setRealm] = useState(null);

  useEffect(() => {
    let mounted = true;
    getRealm().then((r) => {
      if (mounted) setRealm(r);
    });
    return () => {
      mounted = false;
      if (realm && !realm.isClosed) {
        realm.close();
      }
    };
  }, []);
  
  if (!realm) return null;

  return (
    <RealmContext.Provider value={realm}>
      {children}
    </RealmContext.Provider>
  );
};
