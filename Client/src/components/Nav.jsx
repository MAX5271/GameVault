import { useContext } from "react";
import DataContext from "../context/DataContext";
import styles from "./Nav.module.css";

function Nav() {
  const { search, setSearch } = useContext(DataContext);

  return (
    <nav className={styles.navBar}>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="Search" className={styles.label}>
          Search
        </label>
        <input
          id="Search"
          className={styles.input}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete="off"
        />
      </form>
    </nav>
  );
}

export default Nav;