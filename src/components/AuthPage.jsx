import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaMicrosoft, FaEnvelope, FaLock, FaUser, FaArrowRight } from 'react-icons/fa';
import { auth } from '../FirebaseConfig/firebase'; // Adjust the import path as necessary
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfig/firebase';


const roles = ['Admin','Employee'];

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'Employee',
  });

  const toggleForm = () => setIsLogin(!isLogin);
  

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Add these lines to get role from Firestore
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      const userData = docSnap.exists() ? docSnap.data() : null;
      const role = userData?.role || 'Employee';
      
      localStorage.setItem('role', role); // Store in localStorage
      navigate('/dashboard', { state: { role } });
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google login failed');
    }
  };
  
  const handleMicrosoftLogin = async () => {
    const provider = new OAuthProvider('microsoft.com');
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      const userData = docSnap.exists() ? docSnap.data() : null;
      const role = userData?.role || 'Employee';
      
      localStorage.setItem('role', role);
      navigate('/dashboard', { state: { role } });
    } catch (error) {
      console.error('Microsoft login error:', error);
      toast.error('Microsoft login failed');
    }
  };
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
        const user = userCredential.user;
  
        // Get user role from Firestore
        const docSnap = await getDoc(doc(db, 'users', user.uid));
        const userData = docSnap.exists() ? docSnap.data() : null;
        const role = userData?.role || 'Employee';
        
        localStorage.setItem('role', role); // Add this line
        navigate('/dashboard', { state: { role } });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        const user = userCredential.user;
  
        // Save role to Firestore during registration
        await setDoc(doc(db, 'users', user.uid), {
          email: form.email,
          role: form.role,
        });
  
        toast.success('Registration successful! Please log in.');
        setIsLogin(true); // Switch to login mode
      }
    } catch (error) {
      console.error('Auth error:', error.message);
      toast.error(error.message);
    }
  
    setIsSubmitting(false);
  };
  
  

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4">
        <Toaster position="top-center" />
      <motion.div
        className="bg-white/5 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden w-full max-w-4xl flex border border-white/10 hover:shadow-2xl transition-all duration-300"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        {/* Left Side Branding */}
        <div className="w-1/2 bg-gradient-to-br from-purple-600/30 to-blue-500/30 text-white p-10 hidden md:flex flex-col justify-center items-start relative">
          <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl pb-3 font-bold mb-4 bg-gradient-to-r from-purple-300 to-blue-200 bg-clip-text text-transparent">
              Employee Manager
            </h1>
            <div className="space-y-6">
              <div className="flex items-center gap-3 opacity-90">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <FaArrowRight className="text-purple-300" />
                </div>
                <p className="text-lg">Enterprise-grade solutions</p>
              </div>
              <div className="flex items-center gap-3 opacity-90">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <FaArrowRight className="text-blue-300" />
                </div>
                <p className="text-lg">Real-time analytics</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 relative flex flex-col">
          <div className="self-end mb-4">
            <button
              onClick={toggleForm}
              className="text-sm bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
            >
              {isLogin ? 'Switch to Register' : 'Switch to Login'}
            </button>
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
          <AnimatePresence mode='wait'>
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="mb-10"
            >
              <h2 className="text-3xl font-bold text-white mb-2">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h2>
              <p className="text-white/70">
                {isLogin 
                  ? 'Sign in to continue to your dashboard' 
                  : 'Join our professional community'}
              </p>
            </motion.div>
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                  <FaEnvelope className="text-xl text-purple-300/80" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                  <FaLock className="text-xl text-blue-300/80" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                      <FaUser className="text-xl text-indigo-300/80" />
                      <select
                        name="role"
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className="w-full bg-transparent text-white appearance-none focus:outline-none"
                      >
                        {roles.map((role) => (
                          <option key={role} value={role} className="bg-gray-800">
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-4 rounded-xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : isLogin ? (
                  'Sign In Now'
                ) : (
                  'Create Account'
                )}
              </span>
            </motion.button>
          </form>

          <div className="mt-10">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-sm text-white/50 bg-white/5 backdrop-blur-sm rounded-full">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <motion.button
                onClick={handleGoogleLogin}
                className="p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 relative group"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <FaGoogle className="text-xl text-white/80 group-hover:text-white transition-colors" />
              </motion.button>
              <motion.button
                onClick={handleMicrosoftLogin}
                className="p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 relative group"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <FaMicrosoft className="text-xl text-white/80 group-hover:text-white transition-colors" />
              </motion.button>
            </div>
          </div>
        </div>
        </div>
      </motion.div>
    </div>
  );
}