'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <motion.div 
      className="flex items-center gap-2 bg-neutral-900 rounded-xl p-1"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <button
        onClick={() => setLanguage('es')}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
          language === 'es' 
            ? 'bg-green-600 text-white' 
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        ES
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
          language === 'en' 
            ? 'bg-green-600 text-white' 
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        EN
      </button>
    </motion.div>
  );
}
