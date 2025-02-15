'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ListTodo, Clock, Target, ArrowRight, Circle } from 'lucide-react';
import { useRef } from 'react';

// Predefined positions for dots to avoid hydration mismatch
const dotPositions = [
  { left: "10%", top: "20%" },
  { left: "20%", top: "40%" },
  { left: "30%", top: "60%" },
  { left: "40%", top: "80%" },
  { left: "50%", top: "20%" },
  { left: "60%", top: "40%" },
  { left: "70%", top: "60%" },
  { left: "80%", top: "80%" },
  { left: "90%", top: "20%" },
  { left: "15%", top: "30%" },
  { left: "25%", top: "50%" },
  { left: "35%", top: "70%" },
  { left: "45%", top: "90%" },
  { left: "55%", top: "30%" },
  { left: "65%", top: "50%" },
  { left: "75%", top: "70%" },
  { left: "85%", top: "90%" },
  { left: "95%", top: "30%" },
  { left: "5%", top: "50%" },
  { left: "95%", top: "70%" }
];

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Background Shapes Component
const BackgroundShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <motion.div
        className="absolute top-[20%] left-[10%] w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-[40%] right-[10%] w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -30, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[33%] w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

// Floating Dots Component
const FloatingDots = () => {
  return (
    <div className="absolute inset-0 -z-10">
      {dotPositions.map((position, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gray-200 rounded-full"
          style={position}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    content: "This todo app has transformed how I manage my daily tasks. The interface is intuitive and the features are exactly what I need.",
    avatar: "SJ"
  },
  {
    name: "Michael Chen",
    role: "Software Developer",
    content: "The best todo app I've used. Clean design, great functionality, and it helps me stay organized with my projects.",
    avatar: "MC"
  },
  {
    name: "Emma Davis",
    role: "Freelancer",
    content: "I love how this app helps me track my activities. It's become an essential part of my daily workflow.",
    avatar: "ED"
  }
];

const features = [
  {
    icon: <ListTodo className="h-6 w-6" />,
    title: "Task Management",
    description: "Easily create, organize, and manage your tasks with our intuitive interface."
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Activity Tracking",
    description: "Monitor your productivity and track time spent on different tasks."
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Goal Setting",
    description: "Set and achieve your goals with our progress tracking features."
  },
  {
    icon: <CheckCircle2 className="h-6 w-6" />,
    title: "Progress Monitoring",
    description: "Visual insights into your task completion and productivity patterns."
  }
];

export default function Home() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={ref} className="min-h-screen bg-white relative overflow-hidden">
      <BackgroundShapes />
      <FloatingDots />

      {/* Hero Section */}
      <motion.section 
        className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <motion.div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none"
          style={{ y, opacity }}
        >
          <div className="w-full h-full flex items-center justify-center opacity-10">
            <ListTodo className="w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96" />
          </div>
        </motion.div>

        <motion.h1 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gray-900 px-4 text-center"
          style={{ textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Track Your Progress,<br className="hidden sm:block" />Achieve Your Goals
        </motion.h1>
        <motion.p 
          className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 max-w-sm sm:max-w-xl lg:max-w-2xl mx-auto text-center px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Stay organized and boost your productivity with our intuitive todo app.
          Track your activities, manage tasks, and accomplish more every day.
        </motion.p>
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center px-4 w-full sm:w-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/signup" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white px-8 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/signin" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto px-8 h-12 rounded-full hover:shadow-md transition-all duration-300">
              Sign In
            </Button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
            variants={fadeInUp}
          >
            Features that help you succeed
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <motion.div 
                      className="rounded-full bg-gray-100 w-12 h-12 flex items-center justify-center mb-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="font-semibold mb-2 text-lg">{feature.title}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
            variants={fadeInUp}
          >
            What our users say
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <motion.div 
                        className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center font-semibold text-gray-600 mr-3"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {testimonial.avatar}
                      </motion.div>
                      <div>
                        <div className="font-semibold text-base sm:text-lg">{testimonial.name}</div>
                        <div className="text-gray-600 text-sm">{testimonial.role}</div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{testimonial.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-center relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
        <div className="max-w-3xl mx-auto relative z-10 px-4">
          <motion.h2 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6"
            variants={fadeInUp}
          >
            Ready to get started?
          </motion.h2>
          <motion.p 
            className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8"
            variants={fadeInUp}
          >
            Join thousands of users who are already improving their productivity with our todo app.
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="w-full sm:w-auto inline-block"
          >
            <Link href="/signup">
              <Button className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100 px-8 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                Create Free Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
