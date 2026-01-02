import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import {
  FaGithub, FaLinkedin, FaReact, FaNodeJs, FaDatabase, FaCode,
  FaServer, FaMobileAlt, FaArrowRight, FaEnvelope, FaMapMarkerAlt,
  FaAward, FaCheckCircle, FaExternalLinkAlt, FaCheck, FaWhatsapp
} from 'react-icons/fa';
import { SiMongodb, SiExpress, SiTailwindcss, SiTypescript, SiMysql, SiPython } from 'react-icons/si';

// --- IMPORT YOUR IMAGE HERE ---
import profileImg from './assets/img.jpg';

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * UTILS & CONFIG
 */
const TRANSITION = { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] };

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
  }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
  }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

/**
 * LOADING SCREEN
 */
const LoadingScreen = ({ onComplete }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-slate-950 flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
            Niladri<span className="text-purple-500">.</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base">Full Stack Developer</p>
        </motion.div>

        <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${count}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-purple-400 mt-4 font-mono text-sm">{count}%</p>
      </div>
    </motion.div>
  );
};

/**
 * COMPONENTS
 */

// 1. CUSTOM CURSOR (Enhanced for mobile detection)
const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('.interactive')) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (isMobile) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 border border-white rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      animate={{
        x: mousePosition.x - 16,
        y: mousePosition.y - 16,
        scale: hovered ? 2.5 : 1,
        backgroundColor: hovered ? 'white' : 'transparent',
      }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    />
  );
};

// 2. FLOATING NAVIGATION (Enhanced with mobile menu)
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-lg border-b border-white/10' : ''
          }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 md:px-12 py-4 md:py-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-white font-bold text-lg sm:text-xl cursor-pointer"
          >
            NILADRI<span className="text-purple-400">.</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            {menuItems.map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                whileHover={{ y: -2 }}
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white text-sm font-medium z-50 relative"
          >
            <div className="flex flex-col gap-1.5">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-white block"
              />
              <motion.span
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-6 h-0.5 bg-white block"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-white block"
              />
            </div>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-slate-950 md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {menuItems.map((item, i) => (
                <motion.a
                  key={i}
                  href={item.href}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setIsOpen(false)}
                  className="text-white text-2xl font-bold hover:text-purple-400 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// 3. HERO SECTION (Enhanced with parallax and animations)
const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section id="home" className="relative min-h-screen flex items-center px-4 sm:px-6 md:px-12 bg-slate-950 overflow-hidden pt-24 md:pt-20">
      {/* Animated Background Gradients */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-purple-600/20 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-[10%] left-[-10%] w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-blue-600/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none"
      />

      {/* Floating Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-purple-500/30 rounded-full"
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            left: `${10 + i * 20}%`,
            top: `${20 + i * 15}%`
          }}
        />
      ))}

      <motion.div
        style={{ opacity }}
        className="z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center w-full max-w-7xl mx-auto"
      >
        {/* LEFT COLUMN: TEXT & INFO */}
        <div className="flex flex-col justify-center text-center md:text-left order-2 md:order-1">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h3
              variants={fadeInUp}
              className="text-lg sm:text-xl md:text-2xl font-medium text-purple-400 mb-2"
            >
              Hi, I am
            </motion.h3>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight"
            >
              Niladri Sekhar Maji
            </motion.h2>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-violet-400 to-white mb-6 md:mb-8"
            >
              Full Stack Developer
            </motion.h1>
          </motion.div>

          {/* Social Icons Row */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex gap-3 sm:gap-4 mb-8 md:mb-10 justify-center md:justify-start"
          >
            {[
              { icon: <FaGithub />, link: "https://github.com/nilubhai93" },
              { icon: <FaLinkedin />, link: "https://www.linkedin.com/in/niladri-sekhar-maji-475430308" },
              { icon: <FaEnvelope />, link: "mailto:your@email.com" },
              { icon: <FaCode />, link: "#" }
            ].map((item, index) => (
              <motion.a
                key={index}
                variants={scaleIn}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-purple-400 hover:border-purple-400 hover:bg-white/5 transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                {item.icon}
              </motion.a>
            ))}
          </motion.div>

          {/* Buttons Row */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-4 sm:gap-6 mb-8 md:mb-12 justify-center md:justify-start"
          >
            <motion.button
              variants={fadeInUp}
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(168,85,247,0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="interactive px-6 sm:px-8 py-3 sm:py-3.5 border border-white/30 hover:border-white text-white font-medium rounded-lg transition-all hover:bg-white/5 text-sm sm:text-base"
            >
              Download CV
            </motion.button>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: IMAGE */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="relative flex justify-center items-center order-1 md:order-2 mt-8 md:mt-0"
        >
          {/* Animated Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] rounded-full border-2 border-purple-500/20 border-dashed z-0"
          />

          {/* Circular Background */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] bg-slate-800/50 rounded-full border border-white/5 z-0"
          />

          {/* Profile Image */}
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            src={profileImg}
            alt="Niladri Sekhar Maji"
            className="relative z-10 w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] md:w-[450px] md:h-[450px] object-cover rounded-full border-4 border-white/10 shadow-2xl drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]"
          />
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-gray-500 text-xs">Scroll Down</span>
          <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-purple-500 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// 4. ABOUT & STATS SECTION (Enhanced animations)
const About = () => {
  const stats = [
    { label: "Years Exp.", value: "2+" },
    { label: "Projects", value: "15+" },
    { label: "Satisfaction", value: "100%" },
  ];

  return (
    <section id="about" className="py-16 sm:py-24 md:py-32 bg-slate-950 relative overflow-hidden">
      {/* Background Element */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500 rounded-full blur-[150px]"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <motion.h2
              variants={fadeInLeft}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 md:mb-8"
            >
              Engineering <br />
              <span className="text-purple-400">The Future.</span>
            </motion.h2>
            <motion.p
              variants={fadeInLeft}
              className="text-gray-400 text-base sm:text-lg leading-relaxed mb-6 md:mb-8"
            >
              I don't just write code; I architect solutions. Specializing in the MERN stack and React Native,
              I bring a disciplined approach to full-stack development. My work bridges the gap between
              complex backend logic and buttery-smooth frontend interactions.
            </motion.p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 gap-4 sm:gap-6"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                whileHover={{ y: -5, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="interactive p-6 sm:p-8 border border-white/5 bg-slate-900 rounded-2xl hover:border-purple-500/30 hover:bg-slate-800 transition-all group"
              >
                <motion.h3
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", delay: i * 0.1 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors"
                >
                  {stat.value}
                </motion.h3>
                <p className="text-xs sm:text-sm uppercase tracking-wider text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// 5. CERTIFICATIONS SECTION (Enhanced mobile layout)
const Certifications = () => {
  const certifications = [
    {
      id: 1,
      title: "IBM Full Stack Development Training",
      issuer: "IBM",
      desc: "Completion of 100 hours training. Built 'SoundScape - Ambient Sound Generator', demonstrating enterprise-level architecture and full-stack integration.",
      link: "https://drive.google.com/file/d/1YK4cVbvyElBMwR6m6cAxpU8WkNypCtHa/view?usp=drivesdk",
      color: "text-blue-400"
    },
    {
      id: 2,
      title: "PW Full Stack Development",
      issuer: "Physics Wallah (PW Skills)",
      desc: "Comprehensive Full Stack Development program (April '24). Mastered MERN stack concepts with rigorous hands-on project implementation.",
      link: "https://drive.google.com/file/d/1-DOSLEJ2b2yMNYyBg_HBIGN_hJJnTFZ9/view?usp=drivesdk",
      color: "text-yellow-400"
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#030014] px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-12"
        >
          <motion.div
            variants={scaleIn}
            className="p-3 bg-white/5 rounded-xl border border-white/10"
          >
            <FaAward className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center sm:text-left"
          >
            Certifications
          </motion.h2>
        </motion.div>

        {/* Certificates Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.id}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="group relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-purple-500/30 transition-all duration-300"
            >
              {/* Glow Effect */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl blur-xl"
              />

              <div className="relative z-10">
                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 font-mono mt-1 uppercase tracking-wide">
                      Issued by {cert.issuer}
                    </p>
                  </div>
                  <FaCheckCircle className={`w-5 h-5 sm:w-6 sm:h-6 ${cert.color} flex-shrink-0`} />
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-6 sm:mb-8">
                  {cert.desc}
                </p>

                {/* Link Button */}
                <motion.a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="interactive inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/5 hover:bg-white/10 px-4 sm:px-5 py-2.5 rounded-lg transition-colors border border-white/5"
                >
                  View Credential <FaExternalLinkAlt className="w-3 h-3" />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};


// 6. SKILLS SECTION (Infinite Right-to-Left Loop + Tabular Format)
const Skills = () => {
  const skillCategories = [
    {
      category: "Frontend",
      skills: [
        { name: "React", icon: <FaReact />, level: "Expert" },
        { name: "React Native", icon: <FaMobileAlt />, level: "Advanced" },
        { name: "TypeScript", icon: <SiTypescript />, level: "Advanced" },
        { name: "Tailwind CSS", icon: <SiTailwindcss />, level: "Expert" },
      ]
    },
    {
      category: "Backend",
      skills: [
        { name: "Node.js", icon: <FaNodeJs />, level: "Expert" },
        { name: "Express", icon: <SiExpress />, level: "Advanced" },
        { name: "Python", icon: <SiPython />, level: "Intermediate" },
      ]
    },
    {
      category: "Database",
      skills: [
        { name: "MongoDB", icon: <SiMongodb />, level: "Expert" },
        { name: "MySQL", icon: <SiMysql />, level: "Advanced" },
      ]
    }
  ];

  // Skills for infinite marquee
  const marqueeSkills = [
    { name: "React", icon: <FaReact />, color: "text-cyan-400" },
    { name: "Node.js", icon: <FaNodeJs />, color: "text-green-400" },
    { name: "MongoDB", icon: <SiMongodb />, color: "text-green-500" },
    { name: "TypeScript", icon: <SiTypescript />, color: "text-blue-400" },
    { name: "React Native", icon: <FaMobileAlt />, color: "text-cyan-400" },
    { name: "Tailwind CSS", icon: <SiTailwindcss />, color: "text-teal-400" },
    { name: "MySQL", icon: <SiMysql />, color: "text-blue-500" },
    { name: "Python", icon: <SiPython />, color: "text-yellow-400" },
    { name: "Express", icon: <SiExpress />, color: "text-gray-400" },
  ];

  return (
    <section id="skills" className="py-16 sm:py-20 bg-slate-950 overflow-hidden border-t border-white/5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 text-center px-4"
      >
        <span className="text-purple-400 tracking-widest text-xs sm:text-sm font-bold uppercase">Tech Stack</span>
        <h2 className="text-2xl sm:text-3xl text-white mt-4 font-bold">Arsenal of Tools</h2>
      </motion.div>

      {/* INFINITE RIGHT-TO-LEFT MARQUEE - NEVER ENDING */}
      <div className="relative mb-16 overflow-hidden">
        {/* Gradient Overlays for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

        <div className="flex">
          {/* First Set */}
          <div className="flex animate-scroll-rtl">
            {marqueeSkills.map((skill, i) => (
              <div
                key={`set1-${i}`}
                className="flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-3 sm:py-4 mx-3 border border-white/10 rounded-full bg-slate-900/50 backdrop-blur-sm hover:border-purple-500/50 hover:bg-slate-800/50 transition-all hover:scale-110 cursor-pointer flex-shrink-0"
              >
                <span className={`text-xl sm:text-2xl ${skill.color}`}>{skill.icon}</span>
                <span className="text-base sm:text-xl text-white font-medium whitespace-nowrap">{skill.name}</span>
              </div>
            ))}
          </div>

          {/* Second Set - Duplicate for seamless loop */}
          <div className="flex animate-scroll-rtl">
            {marqueeSkills.map((skill, i) => (
              <div
                key={`set2-${i}`}
                className="flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-3 sm:py-4 mx-3 border border-white/10 rounded-full bg-slate-900/50 backdrop-blur-sm hover:border-purple-500/50 hover:bg-slate-800/50 transition-all hover:scale-110 cursor-pointer flex-shrink-0"
              >
                <span className={`text-xl sm:text-2xl ${skill.color}`}>{skill.icon}</span>
                <span className="text-base sm:text-xl text-white font-medium whitespace-nowrap">{skill.name}</span>
              </div>
            ))}
          </div>

          {/* Third Set - Extra for ultra smooth loop */}
          <div className="flex animate-scroll-rtl">
            {marqueeSkills.map((skill, i) => (
              <div
                key={`set3-${i}`}
                className="flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-3 sm:py-4 mx-3 border border-white/10 rounded-full bg-slate-900/50 backdrop-blur-sm hover:border-purple-500/50 hover:bg-slate-800/50 transition-all hover:scale-110 cursor-pointer flex-shrink-0"
              >
                <span className={`text-xl sm:text-2xl ${skill.color}`}>{skill.icon}</span>
                <span className="text-base sm:text-xl text-white font-medium whitespace-nowrap">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABULAR FORMAT - Skill Categories */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {skillCategories.map((category, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <FaCode className="text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">{category.category}</h3>
              </div>

              {/* Skills Table */}
              <div className="space-y-4">
                {category.skills.map((skill, skillIdx) => (
                  <motion.div
                    key={skillIdx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: skillIdx * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl text-purple-400 group-hover:scale-110 transition-transform">
                        {skill.icon}
                      </span>
                      <span className="text-white font-medium text-sm sm:text-base">{skill.name}</span>
                    </div>

                    {/* Skill Level Badge */}
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${skill.level === 'Expert'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : skill.level === 'Advanced'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                      {skill.level}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Skills Progress Bars */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-slate-900 border border-white/10 rounded-2xl p-6 sm:p-8"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <FaServer className="text-purple-400" />
            Proficiency Overview
          </h3>

          <div className="space-y-4">
            {[
              { name: "MERN Stack", percent: 95 },
              { name: "React Native", percent: 90 },
              { name: "Database Design", percent: 88 },
              { name: "API Development", percent: 92 },
              { name: "UI/UX Implementation", percent: 85 }
            ].map((skill, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-sm font-medium">{skill.name}</span>
                  <span className="text-purple-400 text-sm font-bold">{skill.percent}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* INFINITE SCROLL ANIMATION - NEVER ENDS */}
      <style>{`
        @keyframes scroll-rtl {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-scroll-rtl {
          animation: scroll-rtl 30s linear infinite;
        }

        /* Pause on hover */
        .animate-scroll-rtl:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};



// 7. EXPERIENCE TIMELINE (Mobile optimized)
const Experience = () => {
  const experiences = [
    {
      role: "Senior Frontend Architect",
      company: "TechNova Agency",
      year: "2023 - Present",
      desc: "Leading frontend architecture for enterprise clients using Next.js and Micro-frontends."
    },
    {
      role: "Full Stack Developer",
      company: "Innovate Solutions",
      year: "2021 - 2023",
      desc: "Developed scalable APIs and interactive dashboards for FinTech sector."
    },
    {
      role: "IBM Full Stack Training",
      company: "IBM Certified",
      year: "2020",
      desc: "Intensive training program covering Cloud Native methodologies, DevOps, and Advanced DB management."
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-12 sm:mb-16 text-center"
        >
          Professional Journey
        </motion.h2>

        <div className="relative border-l-2 border-white/10 ml-4 space-y-12 sm:space-y-16">
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.2 }}
              className="relative pl-8 sm:pl-12"
            >
              {/* Timeline Dot */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 + 0.3 }}
                className="absolute -left-[7px] top-2 w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              />

              <motion.div
                whileHover={{ x: 5 }}
                className="bg-slate-900 border border-white/10 p-6 sm:p-8 rounded-2xl hover:bg-slate-800 transition-all"
              >
                <span className="text-xs sm:text-sm text-purple-400 font-mono mb-2 block">{exp.year}</span>
                <h3 className="text-lg sm:text-xl text-white font-bold">{exp.role}</h3>
                <h4 className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">{exp.company}</h4>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {exp.desc}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 8. PROJECTS SECTION (Enhanced card animations)
const Projects = () => {
  const projects = [
    {
      title: "Educational CRM Platform",
      category: "Enterprise System",
      desc: "Complete customer relationship management system for educational institutions with student tracking, enrollment management, and analytics dashboard.",
      tech: ["React", "Node.js", "MySQL", "JWT"],
      features: ["500+ Students", "Real-time Analytics", "Role-based Access"]
    },
    {
      title: "Learning Management System",
      category: "Educational Platform",
      desc: "Scalable LMS with course management, live sessions, assignment tracking, and automated grading serving 1000+ active users.",
      tech: ["React", "Python", "MongoDB", "WebSocket"],
      features: ["1000+ Users", "Live Classes", "AI Grading"]
    },
    {
      title: "Hostel Management System",
      category: "Property Management",
      desc: "Comprehensive hostel and hotel management platform with booking, billing, room allocation, and maintenance tracking.",
      tech: ["React Native", "Node.js", "MySQL", "Redis"],
      features: ["Multi-property", "Automated Billing", "Mobile App"]
    }
  ];

  return (
    <section id="projects" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-slate-950 relative overflow-hidden">
      {/* Background Animation */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/5 rounded-full blur-[100px]"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 sm:mb-16 text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Selected Works</h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-1 bg-purple-500 mx-auto rounded-full"
          />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {projects.map((project, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group p-6 sm:p-8 rounded-2xl bg-slate-900 border border-white/10 hover:border-purple-500/50 hover:bg-slate-800 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
            >
              {/* Hover Gradient Effect */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl"
              />

              <div className="relative z-10">
                <div className="mb-6">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-bold tracking-wider uppercase bg-cyan-900/20 border border-cyan-500/30 text-cyan-400"
                  >
                    {project.category}
                  </motion.span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 leading-tight group-hover:text-purple-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                  {project.desc}
                </p>

                <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                  {project.tech.map((t, idx) => (
                    <motion.span
                      key={idx}
                      whileHover={{ scale: 1.1 }}
                      className="px-3 py-1.5 rounded-md border border-purple-500/30 bg-purple-500/10 text-xs font-medium text-purple-200"
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>

                <div className="space-y-3 pt-6 border-t border-white/10">
                  {project.features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <FaCheck size={10} className="text-blue-400" />
                      </div>
                      <span className="text-sm text-gray-300 font-medium">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// 9. CONTACT SECTION (Mobile optimized)
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    details: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.details) {
      alert("Please fill in your name and project details.");
      return;
    }

    const message = `Hi Niladri, my name is *${formData.name}*.%0a%0aI have a project in mind:%0a${formData.details}`;
    const phoneNumber = "919382472550";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="contact" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-slate-950 relative overflow-hidden">
      {/* Background Decoration */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 45, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-purple-900/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none"
      />

      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.span
            variants={fadeInUp}
            className="text-purple-400 text-xs sm:text-sm tracking-widest font-bold uppercase"
          >
            Get In Touch
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold mt-4 mb-6 sm:mb-8 px-4"
          >
            Let's create something extraordinary.
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-gray-400 text-base sm:text-lg mb-8 sm:mb-12"
          >
            Open for freelance projects and full-time opportunities.
          </motion.p>
        </motion.div>

        <motion.form
          onSubmit={handleSendMessage}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="space-y-6 text-left bg-slate-900/80 p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-white/10 backdrop-blur-md"
        >
          {/* Name Field */}
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="group"
          >
            <label className="text-gray-500 text-xs uppercase tracking-wider mb-2 block group-focus-within:text-purple-400 transition-colors">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-transparent border-b-2 border-white/20 py-2 sm:py-3 text-white text-sm sm:text-base outline-none focus:border-purple-400 transition-colors"
              placeholder="Your Name"
            />
          </motion.div>

          {/* Project Details Field */}
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="group"
          >
            <label className="text-gray-500 text-xs uppercase tracking-wider mb-2 block group-focus-within:text-purple-400 transition-colors">
              Project Details
            </label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              rows="4"
              className="w-full bg-transparent border-b-2 border-white/20 py-2 sm:py-3 text-white text-sm sm:text-base outline-none focus:border-purple-400 transition-colors resize-none"
              placeholder="Tell me about your idea..."
            ></textarea>
          </motion.div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="interactive w-full py-3 sm:py-4 bg-white text-black font-bold rounded-lg hover:bg-[#25D366] hover:text-white transition-all duration-300 mt-4 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <FaWhatsapp className="text-lg sm:text-xl" /> Send via WhatsApp
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
};

// 10. FOOTER (Mobile optimized)
const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-slate-900 py-8 sm:py-12 px-4 sm:px-6 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-white font-bold text-xl sm:text-2xl tracking-tighter"
        >
          Niladri<span className="text-purple-500">.</span>PORTFOLIO
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex gap-6 sm:gap-8"
        >
          {[
            { icon: <FaGithub size={18} />, link: "#" },
            { icon: <FaLinkedin size={18} />, link: "#" },
            { icon: <FaEnvelope size={18} />, link: "#" }
          ].map((item, i) => (
            <motion.a
              key={i}
              href={item.link}
              whileHover={{ scale: 1.2, y: -3 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {item.icon}
            </motion.a>
          ))}
        </motion.div>

        <div className="text-gray-600 text-xs sm:text-sm text-center">
          © 2024 All Rights Reserved.
        </div>
      </div>
    </motion.footer>
  );
};

/**
 * MAIN APP COMPONENT
 */
function App() {
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  // Initialize Smooth Scroll (Lenis)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen selection:bg-purple-500 selection:text-white font-sans overflow-x-hidden">
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <>
          <CustomCursor />
          <Navigation />

          <main ref={scrollRef}>
            <Hero />
            <About />
            <Certifications />
            <Skills />
            <Experience />
            <Projects />
            <Contact />
            <Footer />
          </main>
        </>
      )}
    </div>
  );
}

export default App;