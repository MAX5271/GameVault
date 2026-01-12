import { useContext } from "react"
import DataContext from "../context/DataContext"

function Nav() {
    const {search,setSearch} = useContext(DataContext);
  return (
    <nav className="NavBar" >
      <form onSubmit={(e)=>e.preventDefault()} >
        <label htmlFor="Search">Search</label>
        <input id="Search" value={search} onChange={(e)=>setSearch(e.target.value)} />
      </form>
    </nav>
  )
}

export default Nav