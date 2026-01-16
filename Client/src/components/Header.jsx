import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

function Header({ title }) {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <h1 className={styles.title} onClick={() => navigate('/')}>
        {title}
      </h1>
    </header>
  );
}

export default Header;