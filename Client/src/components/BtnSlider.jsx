import Slider from "rc-slider";
import styles from "./BtnSlider.module.css";
import "rc-slider/assets/index.css";
import { useEffect, useState } from "react";

const BtnSlider = ({value,handleChange}) => {
    const [num,setNum] = useState(value);

    useEffect(()=>{
        setNum(value);
    },[value]);


    const handleLocalChange = (newValue)=>{
        setNum(newValue);
    }

    const handleRelease = (finalValue) => {
        handleChange(finalValue);
    }

  return (
    <div className={styles.container}>
      <Slider
        min={0}
        max={10}
        value={num}
        onChange={handleLocalChange}
        onChangeComplete={handleRelease}
        classNames={{
          track: "my-track-class",
          rail: "my-rail-class",
          handle: "my-handle-class",
        }}
      />
    </div>
  );
};

export default BtnSlider;
