import { motion } from "framer-motion";

export function CampusCarIllustration({ className = "" }) {
  return (
    <motion.svg
      viewBox="0 0 600 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Road */}
      <rect x="0" y="220" width="600" height="60" rx="8" fill="#1e293b" />
      <motion.rect
        x="40" y="248" width="60" height="4" rx="2" fill="#475569"
        animate={{ x: [40, -80] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      <motion.rect
        x="180" y="248" width="60" height="4" rx="2" fill="#475569"
        animate={{ x: [180, 60] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      <motion.rect
        x="320" y="248" width="60" height="4" rx="2" fill="#475569"
        animate={{ x: [320, 200] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      <motion.rect
        x="460" y="248" width="60" height="4" rx="2" fill="#475569"
        animate={{ x: [460, 340] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      {/* Car body */}
      <motion.g
        animate={{ x: [0, 8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Car base */}
        <rect x="160" y="180" width="200" height="50" rx="12" fill="url(#carGradient)" />
        {/* Car top / cabin */}
        <rect x="200" y="140" width="130" height="45" rx="14" fill="url(#cabinGradient)" />
        {/* Windshield */}
        <rect x="207" y="147" width="50" height="32" rx="8" fill="#60a5fa" opacity="0.4" />
        {/* Rear window */}
        <rect x="270" y="147" width="50" height="32" rx="8" fill="#60a5fa" opacity="0.3" />

        {/* Student 1 in car - driver */}
        <circle cx="230" cy="155" r="8" fill="#fbbf24" />
        <rect x="225" y="163" width="10" height="10" rx="3" fill="#3b82f6" />

        {/* Student 2 in car - passenger */}
        <circle cx="295" cy="155" r="8" fill="#f97316" />
        <rect x="290" y="163" width="10" height="10" rx="3" fill="#a855f7" />

        {/* Headlights */}
        <motion.circle
          cx="165" cy="200" r="6" fill="#fbbf24"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.circle
          cx="165" cy="200" r="12" fill="#fbbf24" opacity="0.15"
          animate={{ r: [12, 18, 12], opacity: [0.15, 0.05, 0.15] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* Tail lights */}
        <motion.circle
          cx="355" cy="200" r="5" fill="#ef4444"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />

        {/* Front wheel */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "200px 228px" }}
        >
          <circle cx="200" cy="228" r="18" fill="#334155" />
          <circle cx="200" cy="228" r="10" fill="#64748b" />
          <circle cx="200" cy="228" r="3" fill="#94a3b8" />
        </motion.g>

        {/* Rear wheel */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "320px 228px" }}
        >
          <circle cx="320" cy="228" r="18" fill="#334155" />
          <circle cx="320" cy="228" r="10" fill="#64748b" />
          <circle cx="320" cy="228" r="3" fill="#94a3b8" />
        </motion.g>
      </motion.g>

      {/* Campus building in background */}
      <rect x="430" y="100" width="80" height="120" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <rect x="440" y="115" width="15" height="15" rx="2" fill="#fbbf24" opacity="0.4" />
      <rect x="465" y="115" width="15" height="15" rx="2" fill="#60a5fa" opacity="0.3" />
      <rect x="490" y="115" width="15" height="15" rx="2" fill="#fbbf24" opacity="0.5" />
      <rect x="440" y="145" width="15" height="15" rx="2" fill="#60a5fa" opacity="0.4" />
      <rect x="465" y="145" width="15" height="15" rx="2" fill="#fbbf24" opacity="0.3" />
      <rect x="490" y="145" width="15" height="15" rx="2" fill="#60a5fa" opacity="0.5" />
      <rect x="440" y="175" width="15" height="15" rx="2" fill="#fbbf24" opacity="0.3" />
      <rect x="465" y="175" width="15" height="15" rx="2" fill="#60a5fa" opacity="0.4" />
      <rect x="490" y="175" width="15" height="15" rx="2" fill="#fbbf24" opacity="0.4" />
      {/* Building entrance */}
      <rect x="455" y="195" width="20" height="25" rx="3" fill="#334155" />

      {/* Tree */}
      <rect x="95" y="160" width="8" height="60" fill="#78350f" />
      <circle cx="99" cy="140" r="25" fill="#166534" opacity="0.7" />
      <circle cx="85" cy="150" r="18" fill="#15803d" opacity="0.6" />
      <circle cx="113" cy="148" r="18" fill="#15803d" opacity="0.6" />

      {/* Walking student */}
      <motion.g
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Head */}
        <circle cx="540" cy="175" r="10" fill="#fbbf24" />
        {/* Body */}
        <rect x="534" y="185" width="12" height="20" rx="4" fill="#8b5cf6" />
        {/* Backpack */}
        <rect x="545" y="188" width="6" height="14" rx="3" fill="#6366f1" />
        {/* Legs */}
        <motion.line
          x1="538" y1="205" x2="534" y2="218"
          stroke="#334155" strokeWidth="3" strokeLinecap="round"
          animate={{ x2: [534, 538, 534] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
        <motion.line
          x1="542" y1="205" x2="546" y2="218"
          stroke="#334155" strokeWidth="3" strokeLinecap="round"
          animate={{ x2: [546, 542, 546] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      </motion.g>

      {/* Graduation cap on building */}
      <polygon points="470,90 450,100 490,100" fill="#1e40af" />
      <rect x="466" y="88" width="8" height="4" fill="#1e40af" />
      <line x1="470" y1="88" x2="470" y2="78" stroke="#fbbf24" strokeWidth="1.5" />
      <circle cx="470" cy="76" r="3" fill="#fbbf24" />

      {/* Sparkles / stars */}
      <motion.circle
        cx="50" cy="80" r="2" fill="#fbbf24"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
      />
      <motion.circle
        cx="150" cy="50" r="2" fill="#60a5fa"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />
      <motion.circle
        cx="400" cy="60" r="2" fill="#a855f7"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      />
      <motion.circle
        cx="550" cy="40" r="2" fill="#fbbf24"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
      />

      <defs>
        <linearGradient id="carGradient" x1="160" y1="180" x2="360" y2="230" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="cabinGradient" x1="200" y1="140" x2="330" y2="185" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4f46e5" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}

export function RideSharingIllustration({ className = "" }) {
  return (
    <motion.svg
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Location pin A */}
      <motion.g
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="60" cy="80" r="20" fill="#3b82f6" opacity="0.2" />
        <circle cx="60" cy="80" r="12" fill="#3b82f6" />
        <circle cx="60" cy="80" r="5" fill="white" />
        <text x="57" y="55" fill="#60a5fa" fontSize="14" fontWeight="bold">A</text>
      </motion.g>

      {/* Dotted route path */}
      <motion.path
        d="M 80 80 Q 200 30 320 80"
        stroke="#475569"
        strokeWidth="2"
        strokeDasharray="8 6"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Moving car dot along path */}
      <motion.circle
        cx="200" cy="55" r="6" fill="#fbbf24"
        animate={{
          cx: [80, 200, 320],
          cy: [80, 45, 80],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Location pin B */}
      <motion.g
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <circle cx="340" cy="80" r="20" fill="#a855f7" opacity="0.2" />
        <circle cx="340" cy="80" r="12" fill="#a855f7" />
        <circle cx="340" cy="80" r="5" fill="white" />
        <text x="337" y="55" fill="#c084fc" fontSize="14" fontWeight="bold">B</text>
      </motion.g>

      {/* Students below */}
      <g>
        {/* Student group 1 */}
        <circle cx="120" cy="140" r="10" fill="#fbbf24" />
        <rect x="113" y="150" width="14" height="16" rx="4" fill="#3b82f6" />
        <rect x="126" y="152" width="5" height="12" rx="2" fill="#6366f1" />

        {/* Student group 2 */}
        <circle cx="200" cy="135" r="10" fill="#f97316" />
        <rect x="193" y="145" width="14" height="16" rx="4" fill="#8b5cf6" />

        {/* Student group 3 */}
        <circle cx="280" cy="140" r="10" fill="#22c55e" />
        <rect x="273" y="150" width="14" height="16" rx="4" fill="#ec4899" />
        <rect x="286" y="152" width="5" height="12" rx="2" fill="#6366f1" />
      </g>

      {/* Dollar sign savings */}
      <motion.g
        animate={{ opacity: [0, 1, 0], y: [0, -15] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <text x="180" y="120" fill="#22c55e" fontSize="16" fontWeight="bold">$</text>
      </motion.g>

      {/* Connection lines from students */}
      <line x1="120" y1="135" x2="145" y2="100" stroke="#3b82f6" strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
      <line x1="200" y1="130" x2="200" y2="95" stroke="#a855f7" strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
      <line x1="280" y1="135" x2="260" y2="100" stroke="#22c55e" strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
    </motion.svg>
  );
}

export function DriverIllustration({ className = "" }) {
  return (
    <motion.svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Steering wheel */}
      <motion.g
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "100px 85px" }}
      >
        <circle cx="100" cy="85" r="35" stroke="#3b82f6" strokeWidth="4" fill="none" />
        <circle cx="100" cy="85" r="8" fill="#3b82f6" />
        <line x1="100" y1="58" x2="100" y2="77" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
        <line x1="70" y1="98" x2="92" y2="88" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
        <line x1="130" y1="98" x2="108" y2="88" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
      </motion.g>

      {/* Driver avatar */}
      <circle cx="100" cy="30" r="18" fill="url(#avatarGrad)" />
      <circle cx="95" cy="27" r="2" fill="white" />
      <circle cx="105" cy="27" r="2" fill="white" />
      <path d="M 94 34 Q 100 38 106 34" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Speed lines */}
      <motion.line
        x1="20" y1="80" x2="40" y2="80"
        stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"
        animate={{ opacity: [0, 0.6, 0], x1: [20, 10], x2: [40, 30] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.line
        x1="15" y1="95" x2="38" y2="95"
        stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"
        animate={{ opacity: [0, 0.4, 0], x1: [15, 5], x2: [38, 28] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
      />

      {/* Notification bell */}
      <motion.g
        animate={{ rotate: [-10, 10, -10] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
        style={{ transformOrigin: "170px 35px" }}
      >
        <path d="M 162 40 Q 170 20 178 40" fill="#fbbf24" />
        <circle cx="170" cy="42" r="3" fill="#fbbf24" />
      </motion.g>
      <motion.circle
        cx="178" cy="25" r="5" fill="#ef4444"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <text x="175" y="28" fill="white" fontSize="8" fontWeight="bold">!</text>

      <defs>
        <linearGradient id="avatarGrad" x1="82" y1="12" x2="118" y2="48">
          <stop stopColor="#fbbf24" />
          <stop offset="1" stopColor="#f97316" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}
