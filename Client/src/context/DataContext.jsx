import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const DataContext = createContext({});

export const DataProvider = ({children})=>{

   const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_API_KEY;
  const [searchResult, setSearchResult] = useState([]);
  const [search,setSearch] = useState("");

  const api = axios.create({
    baseURL: `https://api.rawg.io/api`
  });

  useEffect(()=>{
    const controller = new AbortController();

    const fetchGame = async ()=>{
        try {
            const res = await api.get(`games`,{
                params: {
                    key: apiKey,
                    search: search
                },
                signal: controller.signal
                
            });

            if (!res.status)
            throw new Error("Something went wrong with fetching games");

            const data = res.data;
            if(data) setSearchResult(data.results);
            console.log(searchResult);

        } catch (error) {
            console.log(error.message);
        }
    }

    fetchGame();
    // navigate('/');

    return ()=>{
        controller.abort();
    };


  },[search]);

  

    return <DataContext.Provider value={{
        search,setSearch,
        searchResult,setSearchResult,apiKey
    }} >{children}</DataContext.Provider>

}

export default DataContext;