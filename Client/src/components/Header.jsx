import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import DataContext from "../context/DataContext";
import styles from "./Header.module.css";
import SearchContext from "../context/SearchContext";

function Header({ title }) {
  const navigate = useNavigate();
  const { user } = useContext(DataContext);
  const { setSearch } = useContext(SearchContext);

  const handleProfileClick = () => {
    if (user?.accessToken) {
      navigate(`/profile/${user.username}`);
    } else {
      navigate('/login');
    }
  };

  const handleHomeClick = () => {
    setSearch("");
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer} onClick={handleHomeClick}>
        <h1 className={styles.title}>{title}</h1>
      </div>

      <button className={styles.profileBtn} onClick={handleProfileClick}>
        <span className={styles.btnText}>
            {user?.accessToken ? user.username : "Login"}
        </span>
        <div className={styles.iconWrapper}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      </button>
    </header>
  );
}

export default Header;