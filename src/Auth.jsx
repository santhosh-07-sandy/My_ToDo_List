import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Target, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { playClick } from './soundUtils';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    playClick();
    setError('');
    
    try {
      if (isLogin) {
        login(email, password);
      } else {
        signup({ name, email, password });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass fade-in">
        <div className="auth-header">
          <div className="logo">
            <Target className="gradient-text" size={32} />
            <h1 className="gradient-text">GrowthPath</h1>
          </div>
          <p className="auth-subtitle">
            {isLogin ? 'Welcome back! Ready to grow?' : 'Start your journey to excellence.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="input-group glass">
              <User size={20} className="input-icon" />
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          <div className="input-group glass">
            <Mail size={20} className="input-icon" />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group glass">
            <Lock size={20} className="input-icon" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="auth-error fade-in">{error}</p>}

          <button type="submit" className="primary-btn auth-submit">
            <span>{isLogin ? 'Login' : 'Create Account'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              className="auth-toggle-btn"
              onClick={() => {
                playClick();
                setIsLogin(!isLogin);
                setError('');
              }}
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
      
      <div className="auth-bg-decor">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="sparkle-decor">
          <Sparkles size={40} className="sparkle-1" />
          <Sparkles size={24} className="sparkle-2" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
