import { useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ToastContext from "../../context/ToastContext";
import styles from "./ToastContainer.module.css";

function ToastContainer() {
  const { toasts, dismissToast } = useContext(ToastContext);

  return (
    <div className={styles.container} role="region" aria-label="Notifications">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            role="alert"
            className={`${styles.toast} ${toast.type === "success" ? styles.success : styles.error}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <span>{toast.message}</span>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
            >
              &times;
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ToastContainer;
