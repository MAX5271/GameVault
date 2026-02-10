import { useContext, useState, useMemo, useEffect } from "react";
import debounce from "lodash.debounce";
import styles from "./Nav.module.css";
import SearchContext from "../context/SearchContext";

function Nav() {
  const { setSearch } = useContext(SearchContext);
  const [localInput, setLocalInput] = useState("");

  const debouncedUpdate = useMemo(
    () =>
      debounce((val) => {
        setSearch(val);
      }, 500),
    [setSearch]
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalInput(val);
    debouncedUpdate(val);
  };

  return (
    <nav className={styles.navBar}>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="Search" className={styles.label}>
          Search
        </label>
        <input
          id="Search"
          className={styles.input}
          value={localInput}
          onChange={handleChange}
          autoComplete="off"
          placeholder="Search games..."
        />
      </form>
    </nav>
  );
}

export default Nav;