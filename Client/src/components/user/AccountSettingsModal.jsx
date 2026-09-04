import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../system/SystemSpecModal.module.css';
import AccountSettings from './AccountSettings';
import useModalA11y from '../../hooks/useModalA11y';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, delay: 0.1 }
  }
};

const contentVariants = {
  hidden: { scale: 0.95, opacity: 0, y: 20 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 25 }
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 }
  }
};

function AccountSettingsModal({ onClose, onAccountDeleted }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useModalA11y(onClose);

  return (
    <motion.div
      className={styles.modalOverlay}
      onClick={onClose}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        ref={containerRef}
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        variants={contentVariants}
        role="dialog"
        aria-modal="true"
        aria-label="Account settings"
        tabIndex={-1}
      >
        <AccountSettings onLoaded={() => setIsLoaded(true)} onAccountDeleted={onAccountDeleted} />

        {isLoaded && (
            <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            &times;
            </button>
        )}
      </motion.div>
    </motion.div>
  );
}

export default AccountSettingsModal;
