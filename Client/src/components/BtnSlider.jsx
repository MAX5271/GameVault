import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import styles from "./BtnSlider.module.css";
import { useEffect, useState } from "react";
import CinemaFace from "./CinemaFace";

const BtnSlider = ({ value, handleChange, size }) => {
  const [num, setNum] = useState(value);

  useEffect(() => {
    setNum(value);
  }, [value]);

  const handleLocalChange = (newValue) => {
    setNum(newValue);
  };

  const handleRelease = (finalValue) => {
    handleChange(finalValue);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.rating} >
        <h3 style={{ fontSize: 25,marginLeft:10, marginBottom: 10, margin: 0 }}>{num}</h3>
        <div className={styles.sliderContainer}>
          <Slider
            min={0}
            max={100}
            value={num}
            onChange={handleLocalChange}
            onChangeComplete={handleRelease}
            classNames={{
              track: styles.track,
              rail: styles.rail,
              handle: styles.handle,
            }}
          />
        </div>
      </div>

      <div className={styles.emojiContainer}>
        <CinemaFace rating={num} size={size} />
      </div>
    </div>
  );
};

export default BtnSlider;
