import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../styles/animations";
import { CampusCarIllustration } from "../components/common/Illustrations";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-accent-500 rounded-lg flex items-center justify-center text-white font-bold">
            CR
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            CampusRide
          </span>
        </div>
        <div className="flex gap-3">
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 text-sm font-medium text-slate-300 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-all"
            >
              Sign In
            </motion.button>
          </Link>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl shadow-lg shadow-primary-500/25"
            >
              Get Started
            </motion.button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="max-w-5xl mx-auto px-8 pt-20 pb-32 text-center"
      >
        <motion.div variants={fadeInUp}>
          <span className="inline-block px-4 py-1.5 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm font-medium mb-6">
            By Students, For Students
          </span>
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="text-6xl sm:text-7xl font-extrabold mb-6 leading-tight"
        >
          <span className="bg-gradient-to-r from-white via-primary-200 to-accent-300 bg-clip-text text-transparent">
            Save Money.
          </span>
          <br />
          <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            Make Money.
          </span>
          <br />
          <span className="text-white">Share Rides.</span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-xl text-slate-400 max-w-2xl mx-auto mb-10"
        >
          The cheapest way to get around campus. Students driving students - connect with
          fellow students offering rides at prices that won't break your wallet.
        </motion.p>

        <motion.div variants={fadeInUp} className="flex gap-4 justify-center">
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(99, 102, 241, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl shadow-xl shadow-primary-500/25"
            >
              Start Riding
            </motion.button>
          </Link>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 text-lg font-semibold text-primary-400 bg-primary-500/10 border border-primary-500/20 rounded-2xl"
            >
              Start Driving
            </motion.button>
          </Link>
        </motion.div>

        {/* Campus Car Illustration */}
        <motion.div variants={fadeInUp} className="mt-16 max-w-2xl mx-auto">
          <CampusCarIllustration className="w-full" />
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-3 gap-8 mt-12 max-w-lg mx-auto"
        >
          {[
            { value: "$0.50", label: "per mile" },
            { value: "500+", label: "US cities" },
            { value: "Real-time", label: "matching" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* How It Works */}
      <div className="max-w-5xl mx-auto px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
          <p className="text-slate-400">Three simple steps to get started</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              step: "1",
              icon: "\uD83D\uDCDD",
              title: "Post Your Trip",
              desc: "Enter your pickup and dropoff locations. We calculate the distance and suggest a fair price.",
              color: "from-blue-500 to-cyan-500",
            },
            {
              step: "2",
              icon: "\uD83E\uDD1D",
              title: "Get Matched",
              desc: "Drivers see your request and compete to offer you the best price in real-time.",
              color: "from-purple-500 to-pink-500",
            },
            {
              step: "3",
              icon: "\uD83D\uDE97",
              title: "Ride Together",
              desc: "Accept the best offer and ride with a fellow student. Save money, make friends!",
              color: "from-green-500 to-emerald-500",
            },
          ].map((item) => (
            <motion.div
              key={item.step}
              whileHover={{ scale: 1.03, y: -5 }}
              className="relative p-6 bg-white/5 border border-white/10 rounded-2xl text-center"
            >
              <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-4`}>
                {item.step}
              </div>
              <span className="text-3xl block mb-3">{item.icon}</span>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-3">Why CampusRide?</h2>
          <p className="text-slate-400">Built for the student lifestyle</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: "\uD83D\uDCB0",
              title: "Cheapest Rides",
              desc: "Drivers compete with prices. You always see the cheapest option first.",
            },
            {
              icon: "\u26A1",
              title: "Real-Time Matching",
              desc: "Get instant offers from available drivers. No waiting around.",
            },
            {
              icon: "\uD83D\uDDFA\uFE0F",
              title: "Interactive Maps",
              desc: "See routes, distances, and estimated times on a live map.",
            },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              whileHover={{ scale: 1.03, y: -5 }}
              className="p-6 bg-white/5 border border-white/10 rounded-2xl"
            >
              <span className="text-4xl block mb-4">{feature.icon}</span>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
