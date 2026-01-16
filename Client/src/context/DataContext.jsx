import { createContext, useEffect, useState } from "react";
import axios from '../api/axios';


const DataContext = createContext({});

export const DataProvider = ({children})=>{
  const apiKey = import.meta.env.VITE_API_KEY;
  const [searchResult, setSearchResult] = useState([]);
  const [search,setSearch] = useState("");
  const [user,setUser] = useState({});

  useEffect(()=>{
    const controller = new AbortController();

    const fetchGame = async ()=>{
        try {
            const res = await axios.get('/api/v1/games',{
                headers:{
                    'Content-Type': 'application/json'
                },
                params: {
                    search: search
                },
                signal: controller.signal,
                withCredentials: true
            });
            if (!res.status)
            throw new Error("Something went wrong with fetching games");
            setSearchResult(res.data.response);
        } catch (error) {
            console.log(error.message);
        }
    }

    fetchGame();

    return ()=>{
        controller.abort();
    };

  },[search]);


  

    return <DataContext.Provider value={{
        search,setSearch,
        searchResult,setSearchResult,apiKey,
        user,setUser
    }} >{children}</DataContext.Provider>

}

export default DataContext;