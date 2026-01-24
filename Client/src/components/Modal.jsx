import { useState } from 'react';
import GameDetails from '../pages/GameDetails';
import styles from './Modal.module.css';

function Modal({ activeId, onClose }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <GameDetails 
            id={activeId} 
            onLoaded={() => setIsLoaded(true)}
        />
        
        {isLoaded && (
            <button className={styles.closeButton} onClick={onClose}>
            &times;
            </button>
        )}
      </div>
    </div>
  );
}

export default Modal;