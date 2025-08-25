import { motion } from "framer-motion"

export const MotionWrapper = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </motion.div>
  )
}