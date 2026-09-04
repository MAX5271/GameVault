import styles from "./Footer.module.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <span>GameVault, {year}</span>
      <span className={styles.muted}>Powered by RAWG API</span>
    </footer>
  );
}

export default Footer;