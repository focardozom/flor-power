'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const BentoGrid = () => {
  return (
    <main className="min-h-screen p-8 bg-neutral-950">
      {/* Logo Section */}
      <motion.div 
        className="flex justify-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src="/logo.png"
          alt="Flor Power Logo"
          width={100}
          height={100}
          className="w-auto h-24" // Made logo bigger, adjust size as needed
        />
      </motion.div>

      {/* Description Section */}
      <div className="max-w-7xl mx-auto mb-8 md:mb-16 text-center px-4">
        <motion.h1 
          className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 font-cinzel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Flower Power
        </motion.h1>
        <motion.p 
          className="text-base md:text-lg text-neutral-400 max-w-2xl mx-auto font-karla"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Between November 2020 and December 2022, 533 cannabis samples were analyzed in Colombia to assess their potency using near-infrared spectrometry. This analysis included flowers and extracts from licensed projects, home growers, and cannabis competitions. With these data, we aim to contribute to an informed debate on cannabis regulation and responsible consumption. 
        </motion.p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto px-4">
        {/* Large featured card - THC Data */}
        <motion.div 
          className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 bg-neutral-900 rounded-3xl p-4 md:p-6 hover:bg-neutral-800 transition-colors"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Average THC</h2>
          <div className="flex flex-col gap-2">
            <span className="text-6xl font-bold text-white font-karla">12.8%</span>
            <p className="text-neutral-400 font-karla">Average THC content in cannabis samples.</p>
          </div>
        </motion.div>

        {/* Educational Card - THC Awareness */}
        <motion.div 
          className="col-span-1 md:col-span-1 lg:col-span-2 row-span-1 bg-gradient-to-r from-green-900 to-indigo-900 rounded-3xl p-4 md:p-6 hover:from-purple-800 hover:to-indigo-800 transition-colors"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">THC Potency Awareness</h2>
          <p className="text-neutral-200 font-karla">More THC doesn't always mean a better experience. Cannabis with high THC levels can increase the risk of adverse effects.</p>
        </motion.div>

        {/* NEW CARD - THC Range */}
        <motion.div 
          className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 bg-gradient-to-r from-green-900 to-indigo-900 rounded-3xl p-4 md:p-6 hover:from-purple-800 hover:to-indigo-800 transition-colors"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Typical THC Range</h2>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center">
              <span className="text-3xl md:text-5xl font-bold text-white">10.3%</span>
              <span className="mx-2 text-xl text-neutral-400">to</span>
              <span className="text-3xl md:text-5xl font-bold text-white">15.3%</span>
            </div>
            <p className="text-neutral-400 font-karla">Half of all samples fell within this THC range, representing the most common potency levels found.</p>
          </div>
        </motion.div>

        {/* Data Card - CBD */}
        <motion.div 
          className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1 bg-neutral-900 rounded-3xl p-4 md:p-6 hover:bg-neutral-800 transition-colors"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Average CBD</h2>
          <div className="flex flex-col gap-2">
            <span className="text-4xl md:text-5xl font-bold text-white">0.9%</span>
            <p className="text-neutral-400">Average CBD content</p>
          </div>
        </motion.div>

        {/* NEW CARD - THC/CBD Relationship */}
        <motion.div 
          className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1 bg-gradient-to-r  from-green-900 to-indigo-900 rounded-3xl p-4 md:p-6 hover:from-purple-800 hover:to-blue-800 transition-colors"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">The THC-CBD Relationship</h2>
          <p className="text-neutral-200 font-karla">
            When THC levels go up, CBD levels goes down. This relationship is strongest in cannabis with less than 10% THC.
          </p>
        </motion.div>
        
        {/* NEW CARD - Highest CBD */}
        <motion.div 
          className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1 bg-neutral-900 rounded-3xl p-4 md:p-6 hover:bg-neutral-800 transition-colors"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Highest CBD</h2>
          <div className="flex flex-col gap-2">
            <span className="text-4xl md:text-5xl font-bold text-white">9.3%</span>
            <p className="text-neutral-400">Maximum CBD level recorded</p>
          </div>
        </motion.div>

        {/* Educational Card - CBD-THC Balance */}
        <motion.div 
          className="col-span-1 md:col-span-2 lg:col-span-3 row-span-1 bg-gradient-to-r from-green-900 to-indigo-900 rounded-3xl p-4 md:p-6 hover:from-purple-800 hover:to-indigo-800 transition-colors"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">CBD-THC Balance</h2>
          <p className="text-neutral-200 font-karla">CBD can counteract THC’s psychoactive effects, making balanced strains preferable for those seeking therapeutic benefits like pain relief and anxiety reduction without intense psychoactivity.</p>
        </motion.div>

        {/* Data Card - Highest THC */}
        <motion.div 
          className="col-span-1 md:col-span-1 lg:col-span-2 row-span-1 bg-neutral-900 rounded-3xl p-4 md:p-6 hover:bg-neutral-800 transition-colors"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Highest THC</h2>
          <div className="flex flex-col gap-2">
            <span className="text-4xl md:text-5xl font-bold text-white">20.40%</span>
            <p className="text-neutral-400">Highest THC level recorded in a sample</p>
          </div>
        </motion.div>

        {/* Educational Card - Historical Context */}
        <motion.div 
          className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 bg-gradient-to-r from-green-900 to-indigo-900 rounded-3xl p-4 md:p-6 hover:from-purple-800 hover:to-indigo-800 transition-colors"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Historical Context</h2>
          <p className="text-neutral-200 font-karla">Cannabis potency has changed. Decades ago, 10% THC was considered strong. Today, some strains exceed 30%, posing new challenges for informed consumption.</p>
        </motion.div>

        {/* Data Card - Colombian Usage */}
        <motion.div 
          className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1 bg-neutral-900 rounded-3xl p-4 md:p-6 hover:bg-neutral-800 transition-colors"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Colombian Usage</h2>
          <div className="flex flex-col gap-2">
            <span className="text-4xl md:text-5xl font-bold text-white">8.3%</span>
            <p className="text-neutral-400">Proportion of Colombians who have consumed cannabis. Data from the 2019 National Survey of Drug Use).</p>
          </div>
        </motion.div>

        {/* Educational Card - Market Education */}
        <motion.div 
          className="col-span-1 md:col-span-2 lg:col-span-3 row-span-1 bg-gradient-to-r from-green-900 to-indigo-900 rounded-3xl p-4 md:p-6 hover:from-purple-800 hover:to-indigo-800 transition-colors"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Market Education</h2>
          <p className="text-neutral-200 font-karla">A more informed market is a safer market. Accessing reliable information about cannabinoids in cannabis products is key to reducing risks and improving the consumer experience.</p>
        </motion.div>

        {/* Contact Card */}
        <motion.div 
          className="col-span-1 md:col-span-3 lg:col-span-4 row-span-1 bg-neutral-900 rounded-3xl p-4 md:p-6 hover:bg-neutral-800 transition-colors"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Get the Complete Report</h2>
          <p className="text-sm md:text-base text-neutral-400 mb-4 md:mb-6">Leave your email to receive a complete analysis of cannabis potency in Colombia.</p>
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <input
              type="email"
              placeholder="Your email"
              className="w-full md:flex-1 px-4 py-2 rounded-xl bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:border-green-500"
            />
            <button
              className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-colors"
            >
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-8 md:mt-16 pb-4 md:pb-8 text-center px-4">
        <motion.p 
          className="text-xs md:text-sm text-neutral-500 font-karla"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Created by figura01 © {new Date().getFullYear()}
        </motion.p>
      </div>
    </main>
  )
}

export default BentoGrid
