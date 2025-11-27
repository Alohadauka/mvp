import React from 'react'
import { motion } from 'framer-motion'

export default function Preloader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
        className="text-6xl mb-4"
      >
        🔒
      </motion.div>
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-lg font-semibold text-brand mb-2"
      >
        Загрузка системы
      </motion.div>
      <div className="text-sm text-slate-400">Инициализация безопасного подключения...</div>
    </div>
  )
}

