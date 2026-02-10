import { useState } from 'react';
import {createContext} from 'react'

const SearchContext = createContext({});

export const SearchProvider = ({children}) => {
    const [searchResult, setSearchResult] = useState([]);
      const [search,setSearch] = useState("");

      return <SearchContext.Provider value={{
        search,setSearch,
        searchResult,setSearchResult
      }} >{children}</SearchContext.Provider>
}

export default SearchContext;