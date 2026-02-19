import { useState } from 'react';
import { motion } from 'framer-motion';
import GameDetails from '../pages/GameDetails';
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

function Modal({ activeId, onClose }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div 
      className={styles.modalOverlay} 
      onClick={onClose}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <GameDetails 
            id={activeId} 
            onLoaded={() => setIsLoaded(true)}
            onClose={onClose}
        />
        
        {isLoaded && (
            <button className={styles.closeButton} onClick={onClose}>
            &times;
            </button>
        )}
      </div>
    </motion.div>
  );
}

export default Modal;