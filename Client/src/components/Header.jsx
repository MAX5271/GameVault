import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import DataContext from "../context/DataContext";
import styles from "./Header.module.css";

function Header({ title }) {
  const navigate = useNavigate();
  const { user,setSearch } = useContext(DataContext);

  const handleProfileClick = () => {
    if (user?.accessToken) {
      navigate(`/profile/${user.username}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title} onClick={() => {setSearch("");navigate('/');}}>
        {title}
      </h1>

      <button className={styles.profileBtn} onClick={handleProfileClick}>
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
        <span className={styles.btnText}>
            {user?.accessToken ? "Profile" : "Login"}
        </span>
      </button>
    </header>
  );
}

export default Header;