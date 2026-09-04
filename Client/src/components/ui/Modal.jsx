import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GameDetails from '../../pages/game/GameDetails';
import useModalA11y from '../../hooks/useModalA11y';
import styles from './Modal.module.css';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.5, delay: 0.1 }
  }
};

function Modal({ activeId, onClose, onNavigate }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useModalA11y(onClose);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0 });
  }, [activeId, containerRef]);

  return (
    <motion.div
      className={styles.modalOverlay}
      onClick={onClose}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div
        ref={containerRef}
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Game details"
        tabIndex={-1}
      >
        <GameDetails
            id={activeId}
            onLoaded={() => setIsLoaded(true)}
            onClose={onClose}
            onNavigate={onNavigate}
        />

        {isLoaded && (
            <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            &times;
            </button>
        )}
      </div>
    </motion.div>
  );
}

export default Modal;