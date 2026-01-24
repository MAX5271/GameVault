import styles from "./BackgroundVideo.module.css";
import videoBg from "../assets/background.mp4"; 

function BackgroundVideo() {
  return (
    <div className={styles.videoContainer}>
      <video autoPlay loop muted playsInline className={styles.video}>
        <source src={videoBg} type="video/mp4" />
      </video>
      <div className={styles.overlay}></div>
    </div>
  );
}

export default BackgroundVideo;