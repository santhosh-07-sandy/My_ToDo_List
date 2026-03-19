import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Target, 
  Lightbulb, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ChevronRight,
  Sun,
  Moon,
  Coffee,
  GraduationCap,
  Activity,
  MessageSquare,
  Newspaper,
  User,
  Bus,
  Zap,
  Dumbbell,
  Sparkles,
  Code,
  Utensils,
  Video,
  Bed,
  Leaf,
  Atom,
  Layers,
  GitBranch,
  Droplets,
  Brain,
  Quote,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  WEEKDAY_SCHEDULE, 
  SKILL_PLAN, 
  DEEP_FOCUS_PLAN, 
  GROWTH_PLAN, 
  PROJECT_IDEAS, 
  YOUTUBE_IDEAS 
} from './data';
import './App.css';

const ICON_MAP = {
  Sun, Moon, Coffee, GraduationCap, Activity, MessageSquare, 
  Newspaper, User, Bus, Zap, Dumbbell, Sparkles, Code, 
  Utensils, Video, Bed, Leaf, Atom, Layers, GitBranch,
  Droplets, Brain, Clock
};

function App() {
  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem('todo_completed_tasks');
    const today = new Date().toDateString();
    const parsed = saved ? JSON.parse(saved) : {};
    return parsed.date === today ? parsed.tasks : [];
  });

  const [activeTab, setActiveTab] = useState('Today');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showQuote, setShowQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState({ text: "Believe in yourself!", author: "Unknown" });
  const quoteTimeoutRef = useRef(null);

  const fetchQuote = async () => {
    try {
      const response = await fetch('https://dummyjson.com/quotes/random');
      const data = await response.json();
      setCurrentQuote({ text: data.quote, author: data.author });
    } catch (error) {
      console.error("Failed to fetch quote", error);
      // Fallback quotes
      const fallbacks = [
        { text: "Your limit is only your imagination.", author: "Success" },
        { text: "Push yourself, because no one else is going to do it for you.", author: "Success" },
        { text: "Great things never come from comfort zones.", author: "Success" }
      ];
      setCurrentQuote(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
    }
  };

  useEffect(() => {
    fetchQuote();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const triggerCelebration = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#6ee7b7']
    });
    fetchQuote();
    if (quoteTimeoutRef.current) clearTimeout(quoteTimeoutRef.current);
    setShowQuote(true);
    quoteTimeoutRef.current = setTimeout(() => setShowQuote(false), 60000);
  };

  const closeModal = () => {
    if (quoteTimeoutRef.current) clearTimeout(quoteTimeoutRef.current);
    setShowQuote(false);
  };

  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem('todo_completed_tasks', JSON.stringify({
      date: today,
      tasks: completedTasks
    }));
  }, [completedTasks]);

  const toggleTask = (index) => {
    if (!completedTasks.includes(index)) {
      triggerCelebration();
    }
    setCompletedTasks(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const currentDay = currentTime.toLocaleDateString('en-US', { weekday: 'short' });
  const todaySkill = SKILL_PLAN.find(s => s.day === currentDay) || SKILL_PLAN[0];
  const todayDeepFocus = DEEP_FOCUS_PLAN.find(s => s.day === currentDay) || DEEP_FOCUS_PLAN[0];

  const renderIcon = (name) => {
    const IconComponent = ICON_MAP[name] || Clock;
    return <IconComponent size={20} />;
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar glass">
        <div className="logo">
          <Target className="gradient-text" />
          <span className="gradient-text">GrowthPath</span>
        </div>
        <nav className="nav-links">
          {['Today', 'Weekly Plan', 'Growth Plan', 'Ideas'].map(tab => (
            <button 
              key={tab}
              className={`nav-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'Today' && <LayoutDashboard size={20} />}
              {tab === 'Weekly Plan' && <Calendar size={20} />}
              {tab === 'Growth Plan' && <Target size={20} />}
              {tab === 'Ideas' && <Lightbulb size={20} />}
              <span>{tab}</span>
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <div className="widget skill-today">
            <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.5rem' }}>Today's Focus</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {renderIcon(todaySkill.icon)}
              <strong>{todaySkill.topic}</strong>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header>
          <div className="greeting">
            <h1 className="gradient-text">{getGreeting()}!</h1>
            <p className="date">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })} • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </header>

        {activeTab === 'Today' && (
          <div className="schedule-grid">
            <div className="schedule-section">
              <div className="card-title">
                <Clock size={24} className="primary" />
                <h2>Daily Routine</h2>
              </div>
              <div className="todo-list">
                {WEEKDAY_SCHEDULE.map((item, index) => (
                  <div 
                    key={index} 
                    className={`todo-item glass ${completedTasks.includes(index) ? 'completed' : ''}`}
                    onClick={() => toggleTask(index)}
                  >
                    <div className="checkbox">
                      {completedTasks.includes(index) && <CheckCircle2 size={16} color="white" />}
                    </div>
                    <div className="time-box">{item.time}</div>
                    <div className="activity-info">
                      <span className="activity">{item.activity}</span>
                      <span className="category-tag">{item.category}</span>
                    </div>
                    <div className="activity-icon">
                      {renderIcon(item.icon)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="secondary-sections">
              <div className="section-card glass">
                <div className="card-title">
                  <Brain size={20} />
                  <h3>Deep Focus</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Today's specific aim:</p>
                <div className="todo-item" style={{ background: 'var(--surface-hover)' }}>
                  <Target size={18} style={{ color: 'var(--primary)' }} />
                  <strong>{todayDeepFocus.task}</strong>
                </div>
              </div>

              <div className="section-card glass" style={{ marginTop: '1.5rem' }}>
                <div className="card-title">
                  <Activity size={20} />
                  <h3>Daily Progress</h3>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Completed</span>
                  <span>{completedTasks.length} / {WEEKDAY_SCHEDULE.length}</span>
                </div>
                <div style={{ height: '8px', background: 'var(--surface)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${(completedTasks.length / WEEKDAY_SCHEDULE.length) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                    transition: 'width 0.4s ease'
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Weekly Plan' && (
          <div className="weekly-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {SKILL_PLAN.map((item, index) => (
              <div key={index} className="section-card glass">
                <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>{item.day}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {renderIcon(item.icon)}
                  <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{item.topic}</span>
                </div>
                <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Primary skill development focus for {item.day}.
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Growth Plan' && (
          <div className="growth-plan">
             <div className="card-title">
              <Target size={24} className="primary" />
              <h2>6-Month Transformation</h2>
            </div>
            <div className="growth-timeline" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {GROWTH_PLAN.map((item, index) => (
                <div key={index} className="section-card glass" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <div style={{ 
                    minWidth: '100px', 
                    fontSize: '1.5rem', 
                    fontWeight: 700, 
                    color: item.status === 'In Progress' ? 'var(--primary)' : 'var(--text-muted)' 
                  }}>
                    Month {item.month}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: '0.25rem' }}>{item.goal}</h3>
                    <span className="category-tag" style={{ background: item.status === 'In Progress' ? 'var(--primary-glow)' : '' }}>
                      {item.status}
                    </span>
                  </div>
                  <ChevronRight size={24} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Ideas' && (
          <div className="ideas-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="section-card glass">
              <div className="card-title">
                <Video size={20} />
                <h3>YouTube & Content</h3>
              </div>
              <ul className="todo-list">
                {YOUTUBE_IDEAS.map((idea, i) => (
                  <li key={i} className="todo-item" style={{ cursor: 'default' }}>
                    <Sparkles size={16} />
                    <span>{idea}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="section-card glass">
              <div className="card-title">
                <Code size={20} />
                <h3>Project Bank (Sat Special)</h3>
              </div>
              <ul className="todo-list">
                {PROJECT_IDEAS.map((idea, i) => (
                  <li key={i} className="todo-item" style={{ cursor: 'default' }}>
                    <Layers size={16} />
                    <span>{idea}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-nav">
        {[
          { id: 'Today', icon: LayoutDashboard },
          { id: 'Weekly Plan', icon: Calendar },
          { id: 'Growth Plan', icon: Target },
          { id: 'Ideas', icon: Lightbulb }
        ].map(item => (
          <button 
            key={item.id}
            className={`mobile-nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon size={22} />
            <span>{item.id.split(' ')[0]}</span>
          </button>
        ))}
      </nav>

      {/* Quote Notification */}
      {showQuote && (
        <div className="quote-notification glass">
          <div className="quote-content">
            <Quote size={24} className="primary" style={{ marginBottom: '0.5rem' }} />
            <p className="quote-text">"{currentQuote.text}"</p>
            <p className="quote-author">— {currentQuote.author}</p>
          </div>
          <button className="close-quote" onClick={closeModal}>
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
