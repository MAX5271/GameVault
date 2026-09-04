import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./NotFound.module.css";

function NotFound() {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>This page doesn't exist, or has wandered off.</p>
      <Link to="/" className={styles.homeLink}>
        Back to Home
      </Link>
    </motion.div>
  );
}

export default NotFound;
