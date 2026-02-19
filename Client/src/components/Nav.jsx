import { useContext, useState, useMemo, useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Nav.module.css";
import SearchContext from "../context/SearchContext";

function Nav() {
  const { setSearch } = useContext(SearchContext);
  const [localInput, setLocalInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalInput(val);
    debouncedUpdate(val);
  };

  const handleClear = () => {
    setLocalInput("");
    setSearch("");
    inputRef.current?.focus();
  };

  return (
    <nav className={styles.navBar}>
      <motion.form
        className={styles.form}
        onSubmit={(e) => e.preventDefault()}
        animate={isFocused ? "focused" : "idle"}
        initial="idle"
        variants={{
          idle: { scale: 1, width: "100%", maxWidth: "450px" },
          focused: { scale: 1.02, width: "100%", maxWidth: "600px" },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <motion.div
            className={styles.iconWrapper}
            animate={{ color: isFocused ? "#fff" : "#888" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </motion.div>

        <input
          ref={inputRef}
          id="Search"
          className={styles.input}
          value={localInput}
          onChange={handleChange}
          autoComplete="off"
          placeholder="Search games..."
        />

        <AnimatePresence>
          {localInput && (
            <motion.button
              type="button"
              className={styles.clearBtn}
              onClick={handleClear}
              initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: -45 }}
              transition={{ duration: 0.2 }}
              aria-label="Clear search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
            {!localInput && !isFocused && (
                <motion.span 
                    className={styles.shortcutHint}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    ⌘K
                </motion.span>
            )}
        </AnimatePresence>

      </motion.form>
    </nav>
  );
}

export default Nav;