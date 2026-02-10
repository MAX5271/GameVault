import { createContext, useState } from "react";


const DataContext = createContext({});

export const DataProvider = ({children})=>{
  
  const [user,setUser] = useState({});
  const [inputValue,setInputValue] = useState("");

    return <DataContext.Provider value={{
        user,setUser,
        inputValue,setInputValue
    }} >{children}</DataContext.Provider>

}

export default DataContext;