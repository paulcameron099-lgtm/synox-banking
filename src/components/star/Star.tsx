import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { motion } from 'framer-motion';

export default function Star() {
  return (
    <div className="flex flex-col md:items-start items-center gap-2">
      <motion.span
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: 0.2,
          type: "spring",
          stiffness: 60,
          duration: 1.4,
        }}
        viewport={{ once: true }}
        className="flex items-center gap-2 text-green-600"
      >
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStarHalfAlt />
        <h2 className="text-white font-Poppins font-bold md:ml-3">4.8</h2>
      </motion.span>
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: 0.2,
          type: "spring",
          stiffness: 60,
          duration: 1.4,
        }}
        viewport={{ once: true }}
        className="font-Euclid font-bold text-white"
      >
        26 Reviews
      </motion.h1>
    </div>
  );
}
