import styles from "./Footer.module.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      GameVault, {year}
    </footer>
  );
}

export default Footer;