import React, { createContext, useState} from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [currentTab, setcurrentTab]=useState('Incoming');

    return (
        <AppContext.Provider value={{
            currentTab, setcurrentTab
        }}>
            {children}
        </AppContext.Provider>
    );
}

export { AppContext, AppProvider };