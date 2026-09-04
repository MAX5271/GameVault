import { useContext, useState, useMemo, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import axiosInstance from "../../api/axios";
import DataContext from "../../context/DataContext";
import SearchContext from "../../context/SearchContext";
import ThemeContext from "../../context/ThemeContext";
import styles from "./TopBar.module.css";
import { AnimatePresence, motion } from "framer-motion";

function TopBar() {
  const { user } = useContext(DataContext);
  const { setSearch } = useContext(SearchContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const showSearch = location.pathname !== "/login" && location.pathname !== "/register";

  const [localInput, setLocalInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const debouncedUpdate = useMemo(
    () =>
      debounce((val) => {
        setSearch(val);
      }, 500),
    [setSearch]
  );

  const debouncedFetchSuggestions = useMemo(
    () =>
      debounce(async (val) => {
        if (!val) {
          setSuggestions([]);
          setLoadingSuggestions(false);
          return;
        }
        setLoadingSuggestions(true);
        try {
          const res = await axiosInstance.get("/api/v1/games", {
            params: { search: val, page: 1, page_size: 5 },
          });
          setSuggestions(res.data.response || []);
        } catch {
          setSuggestions([]);
        } finally {
          setLoadingSuggestions(false);
        }
      }, 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
      debouncedFetchSuggestions.cancel();
    };
  }, [debouncedUpdate, debouncedFetchSuggestions]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalInput(val);
    setShowSuggestions(true);
    debouncedUpdate(val);
    debouncedFetchSuggestions(val);
  };

  const handleSuggestionClick = (game) => {
    setLocalInput(game.name);
    setSearch(game.name);
    setShowSuggestions(false);
    navigate("/");
  };

  const handleClear = () => {
    setLocalInput("");
    setSearch("");
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleProfileClick = () => {
    if (user?.accessToken) {
      navigate(`/profile/${user.username}`);
    } else {
      navigate("/login");
    }
  };

  const handleLogoClick = () => {
    setSearch("");
    navigate("/");
  };

  return (
    <header className={styles.topBar}>
      <button type="button" className={styles.logo} onClick={handleLogoClick} aria-label="GameVault home">
        GameVault
      </button>

      <div className={styles.searchWrapper} ref={wrapperRef}>
        {showSearch && (
        <>
        <form className={styles.searchForm} onSubmit={(e) => e.preventDefault()}>
          <span className={styles.iconWrapper}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>

          <input
            ref={inputRef}
            id="Search"
            className={styles.input}
            value={localInput}
            onChange={handleChange}
            onFocus={() => { setIsFocused(true); setShowSuggestions(true); }}
            onBlur={() => setIsFocused(false)}
            autoComplete="off"
            placeholder="Search games..."
          />

          {localInput && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={handleClear}
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}

          {!localInput && !isFocused && <span className={styles.shortcutHint}>⌘K</span>}
        </form>

        <AnimatePresence>
          {showSuggestions && localInput && (
            <motion.ul
              className={styles.suggestionsList}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {loadingSuggestions ? (
                <li className={styles.suggestionLoading}>Searching...</li>
              ) : suggestions.length > 0 ? (
                suggestions.map((game) => (
                  <li
                    key={game.id}
                    className={styles.suggestionItem}
                    onMouseDown={() => handleSuggestionClick(game)}
                  >
                    <span>{game.name}</span>
                    {game.metacritic && <span className={styles.suggestionScore}>{game.metacritic}</span>}
                  </li>
                ))
              ) : (
                <li className={styles.suggestionEmpty}>No games found</li>
              )}
            </motion.ul>
          )}
        </AnimatePresence>
        </>
        )}
      </div>

      <div className={styles.rightCluster}>
        <button
          type="button"
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"></circle>
              <line x1="12" y1="2" x2="12" y2="4"></line>
              <line x1="12" y1="20" x2="12" y2="22"></line>
              <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"></line>
              <line x1="17.66" y1="17.66" x2="19.07" y2="19.07"></line>
              <line x1="2" y1="12" x2="4" y2="12"></line>
              <line x1="20" y1="12" x2="22" y2="12"></line>
              <line x1="4.93" y1="19.07" x2="6.34" y2="17.66"></line>
              <line x1="17.66" y1="6.34" x2="19.07" y2="4.93"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>

        <button type="button" className={styles.profilePill} onClick={handleProfileClick}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.pillText}>
            {user?.accessToken ? user.username : "Login"}
          </span>
        </button>
      </div>
    </header>
  );
}

export default TopBar;
