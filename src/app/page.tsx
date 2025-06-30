'use client'

import { motion } from 'framer-motion'

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10
      }
    }
  }

  return (
    <div className="min-h-screen bg-black p-8 overflow-hidden">
      <motion.div 
        className="bento-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bento-item bento-small bg-white rounded-lg"
          variants={itemVariants}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        ></motion.div>
        
        <motion.div 
          className="bento-item bento-small bg-white rounded-lg"
          variants={itemVariants}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        ></motion.div>
        
        <motion.div 
          className="bento-item bento-tall bg-white rounded-lg"
          variants={itemVariants}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        ></motion.div>
        
        <motion.div 
          className="bento-item bento-small bg-white rounded-lg"
          variants={itemVariants}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        ></motion.div>
        
        <motion.div 
          className="bento-item bento-small bg-white rounded-lg"
          variants={itemVariants}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        ></motion.div>
        
        <motion.div 
          className="bento-item bento-wide bg-white rounded-lg"
          variants={itemVariants}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        ></motion.div>
      </motion.div>
    </div>
  )
}