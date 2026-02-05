import  { useEffect } from "react";
import { motion, useTransform, useMotionValue } from "framer-motion";
import SkullIcon from "../assets/icons/SkullIcon";
import NeutralFace from "../assets/icons/NeutralFace";
import HappyFace from "../assets/icons/HappyFace";
import AbsoluteCinema from "../assets/icons/AbsoluteCinema";


const CinemaFace = ({ rating,size }) => {
  const ratingMv = useMotionValue(rating);

  useEffect(() => {
    ratingMv.set(rating);
  }, [rating]);

  const skullOpacity = useTransform(ratingMv, [0, 25, 35], [1, 1, 0]);
  const skullScale = useTransform(ratingMv, [0, 35], [1, 0.8]);

  const neutralOpacity = useTransform(ratingMv, [25, 40, 55, 65], [0, 1, 1, 0]);
  const neutralScale = useTransform(ratingMv, [25, 45, 65], [0.8, 1, 0.8]);

  const happyOpacity = useTransform(ratingMv, [55, 70, 85, 95], [0, 1, 1, 0]);
  const happyScale = useTransform(ratingMv, [55, 75, 95], [0.8, 1, 0.8]);

  const cinemaOpacity = useTransform(ratingMv, [85, 95, 100], [0, 1, 1]);
  const cinemaScale = useTransform(ratingMv, [85, 100], [0.8, 1.2]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "auto" }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <motion.div
          style={{
            opacity: skullOpacity,
            scale: skullScale,
            position: "absolute", inset: 0,
            display: "flex", justifyContent: "center", alignItems: "center"
          }}
        >
          <SkullIcon width="100%" height="100%" />
        </motion.div>

        <motion.div
          style={{
            opacity: neutralOpacity,
            scale: neutralScale,
            position: "absolute", inset: 0,
            display: "flex", justifyContent: "center", alignItems: "center"
          }}
        >
          <NeutralFace width="100%" height="100%" />
        </motion.div>

        <motion.div
          style={{
            opacity: happyOpacity,
            scale: happyScale,
            position: "absolute", inset: 0,
            display: "flex", justifyContent: "center", alignItems: "center"
          }}
        >
          <HappyFace width="100%" height="100%" />
        </motion.div>

        <motion.div
          style={{
            opacity: cinemaOpacity,
            scale: cinemaScale,
            position: "absolute", inset: 0,
            display: "flex", justifyContent: "center", alignItems: "center",
            filter: "drop-shadow(0 0 10px rgba(245, 158, 11, 0.5))"
          }}
        >
          <AbsoluteCinema width="100%" height="100%" />
        </motion.div>
      </div>
    </div>
  );
};

export default CinemaFace;