import { createContext, useState } from "react";


const DataContext = createContext({});

export const DataProvider = ({children})=>{
  const [searchResult, setSearchResult] = useState([]);
  const [search,setSearch] = useState("");
  const [user,setUser] = useState({});

  
  

    return <DataContext.Provider value={{
        search,setSearch,
        searchResult,setSearchResult,
        user,setUser
    }} >{children}</DataContext.Provider>

}

export default DataContext;