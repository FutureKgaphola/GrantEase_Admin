import React, { createContext, useState} from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [currentTab, setcurrentTab]=useState('Incoming');
    const [sending, setsending]=useState(false);

    return (
        <AppContext.Provider value={{
            currentTab, setcurrentTab,
            sending, setsending 
        }}>
            {children}
        </AppContext.Provider>
    );
}

export { AppContext, AppProvider };