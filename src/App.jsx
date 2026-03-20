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
  X,
  Trash2,
  Plus,
  Bell
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
import { playClick, playSuccess } from './soundUtils';
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
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('todo_tasks');
    return saved ? JSON.parse(saved) : WEEKDAY_SCHEDULE;
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({ 
    time: "", 
    activity: "", 
    category: "Personal", 
    icon: "Clock" 
  });
  const [weeklyTasks, setWeeklyTasks] = useState(() => {
    const saved = localStorage.getItem('todo_weekly_tasks');
    return saved ? JSON.parse(saved) : SKILL_PLAN;
  });
  const [showAddWeekly, setShowAddWeekly] = useState(false);
  const [newWeeklyItem, setNewWeeklyItem] = useState({
    day: "Mon",
    topic: "",
    icon: "Leaf"
  });
  const [activeToast, setActiveToast] = useState(null);
  const [notifiedTasks, setNotifiedTasks] = useState([]); // Array of activity names already notified today
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showQuote, setShowQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState({ text: "Quality is not an act, it is a habit.", author: "Aristotle" });
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const quoteTimeoutRef = useRef(null);

  const fetchQuote = async () => {
    setIsQuoteLoading(true);
    try {
      const response = await fetch('https://dummyjson.com/quotes/random');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setCurrentQuote({ text: data.quote, author: data.author });
    } catch (error) {
      console.error("Failed to fetch quote", error);
      const fallbacks = [
        { text: "Your limit is only your imagination.", author: "Success" },
        { text: "Push yourself, because no one else is going to do it for you.", author: "Success" },
        { text: "Great things never come from comfort zones.", author: "Success" }
      ];
      setCurrentQuote(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
    } finally {
      setIsQuoteLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const triggerCelebration = () => {
    playSuccess();
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
    localStorage.setItem('todo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('todo_weekly_tasks', JSON.stringify(weeklyTasks));
  }, [weeklyTasks]);

  // Notification Permission
  useEffect(() => {
    if (Notification.permission === 'default') {
      const timer = setTimeout(() => {
        Notification.requestPermission();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Scheduler Engine
  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      
      const taskToNotify = tasks.find(t => {
        // Match start time (e.g., "09:00 AM")
        const startTime = t.time.split('-')[0].trim();
        return startTime === timeStr && !notifiedTasks.includes(t.activity);
      });

      if (taskToNotify) {
        triggerNotification(taskToNotify);
        setNotifiedTasks(prev => [...prev, taskToNotify.activity]);
      }
    };

    const interval = setInterval(checkSchedule, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [tasks, notifiedTasks]);

  const triggerNotification = (task) => {
    playSuccess();
    const motivation = getMotivation(task.category, task.activity);
    
    // In-App Toast
    setActiveToast({ ...task, motivation });
    setTimeout(() => setActiveToast(null), 8000);

    // Browser Notification
    if (Notification.permission === 'granted') {
      new Notification(`Time for: ${task.activity}`, {
        body: motivation,
        icon: '/favicon.ico'
      });
    }
  };

  const getMotivation = (category, activity) => {
    const messages = {
      Personal: ["Time for yourself! You deserve this. 🧘‍♂️", "Ready for a refresh? Let's go!", "Balance is key choice."],
      Skill: ["Get 1% better today. You've got this! 🚀", "Knowledge is power. Focus time!", "Consistency is your superpower."],
      Work: ["Focused work brings great results. Let's crush it! 💼", "Time to shine in your craft.", "One step closer to your goals."],
      Travel: ["New adventures await. Enjoy the journey! 🌍", "Exploring the world, one step at a time.", "Ready for some fresh air?"]
    };
    const list = messages[category] || messages.Personal;
    return list[Math.floor(Math.random() * list.length)];
  };

  const parseTime = (timeStr) => {
    if (!timeStr) return 0;
    // Extract first time if it's a range (e.g., "05:00 AM - 05:10 AM")
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return 0;

    let [_, hours, minutes, period] = match;
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);
    
    if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
    if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
  };

  const addTask = (e) => {
    e.preventDefault();
    playClick();
    if (!newTask.time || !newTask.activity) return;

    const updatedTasks = [...tasks, newTask].sort((a, b) => 
      parseTime(a.time) - parseTime(b.time)
    );

    setTasks(updatedTasks);
    setNewTask({ time: "", activity: "", category: "Personal", icon: "Clock" });
    setShowAddForm(false);
  };

  const deleteTask = (e, index) => {
    e.stopPropagation(); // Prevent toggling completion
    playClick();
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const addWeeklyItem = (e) => {
    e.preventDefault();
    playClick();
    if (!newWeeklyItem.topic) return;

    // Remove existing item for the same day (Deduplication)
    const filtered = weeklyTasks.filter(item => item.day !== newWeeklyItem.day);
    
    // Add new item and Sort chronologically
    const updated = [...filtered, newWeeklyItem].sort((a, b) => 
      DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day)
    );

    setWeeklyTasks(updated);
    setNewWeeklyItem({ day: "Mon", topic: "", icon: "Leaf" });
    setShowAddWeekly(false);
  };

  const deleteWeeklyItem = (index) => {
    playClick();
    setWeeklyTasks(weeklyTasks.filter((_, i) => i !== index));
  };

  const toggleTask = (index) => {
    playClick();
    const taskTitle = tasks[index].activity;
    const isNowCompleted = !completedTasks.includes(taskTitle);
    
    if (isNowCompleted) {
      triggerCelebration();
    }
    
    setCompletedTasks(prev => 
      prev.includes(taskTitle) ? prev.filter(t => t !== taskTitle) : [...prev, taskTitle]
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

  const categories = ["Personal", "Skill", "Work", "Travel"];
  const icons = Object.keys(ICON_MAP);
  const DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
              id={`nav-tab-${tab.toLowerCase().replace(' ', '-')}`}
              className={`nav-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => {
                playClick();
                setActiveTab(tab);
              }}
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
              })} • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
            </p>
          </div>
        </header>

        {activeTab === 'Today' && (
          <div className="schedule-grid fade-in">
            <div className="schedule-section">
              <div className="card-header">
                <div className="card-title">
                  <Clock size={24} className="primary" />
                  <h2>Daily Routine</h2>
                </div>
                <button 
                  className="add-task-btn glass"
                  onClick={() => {
                    playClick();
                    setShowAddForm(true);
                  }}
                >
                  <Plus size={18} />
                  <span>Add Task</span>
                </button>
              </div>

              {showAddForm && (
                <form className="add-task-form glass fade-in" onSubmit={addTask}>
                  <div className="form-grid">
                    <input 
                      type="text" 
                      placeholder="e.g. 09:00 AM" 
                      value={newTask.time}
                      onChange={(e) => setNewTask({...newTask, time: e.target.value})}
                      required
                    />
                    <input 
                      type="text" 
                      placeholder="Activity" 
                      value={newTask.activity}
                      onChange={(e) => setNewTask({...newTask, activity: e.target.value})}
                      required
                    />
                    <select 
                      value={newTask.category}
                      onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select 
                      value={newTask.icon}
                      onChange={(e) => setNewTask({...newTask, icon: e.target.value})}
                    >
                      {icons.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div className="form-actions">
                    <button type="button" onClick={() => { playClick(); setShowAddForm(false); }}>Cancel</button>
                    <button type="submit" className="primary-btn">Add Task</button>
                  </div>
                </form>
              )}

              <div className="todo-list">
                {tasks.map((item, index) => (
                  <div 
                    key={index} 
                    className={`todo-item glass ${completedTasks.includes(item.activity) ? 'completed' : ''}`}
                    onClick={() => toggleTask(index)}
                  >
                    <div className="checkbox">
                      {completedTasks.includes(item.activity) && <CheckCircle2 size={16} color="white" />}
                    </div>
                    <div className="time-box">{item.time}</div>
                    <div className="activity-info">
                      <span className="activity">{item.activity}</span>
                      <span className="category-tag">{item.category}</span>
                    </div>
                    <div className="activity-icon">
                      {renderIcon(item.icon)}
                    </div>
                    <button 
                      className="delete-task" 
                      onClick={(e) => deleteTask(e, index)}
                    >
                      <Trash2 size={16} />
                    </button>
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
                  <span>{completedTasks.length} / {tasks.length}</span>
                </div>
                <div style={{ height: '8px', background: 'var(--surface)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0}%`,
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
          <div className="weekly-tab-content fade-in">
            <div className="card-header">
              <div className="card-title">
                <Calendar size={24} className="primary" />
                <h2>Weekly Schedule</h2>
              </div>
              <button 
                className="add-task-btn glass"
                onClick={() => { playClick(); setShowAddWeekly(true); }}
              >
                <Plus size={18} />
                <span>Add Skill</span>
              </button>
            </div>

            {showAddWeekly && (
              <form className="add-task-form glass fade-in" onSubmit={addWeeklyItem}>
                <div className="form-grid">
                  <select 
                    value={newWeeklyItem.day}
                    onChange={(e) => setNewWeeklyItem({...newWeeklyItem, day: e.target.value})}
                  >
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <input 
                    type="text" 
                    placeholder="Skill Topic" 
                    value={newWeeklyItem.topic}
                    onChange={(e) => setNewWeeklyItem({...newWeeklyItem, topic: e.target.value})}
                    required
                  />
                  <select 
                    value={newWeeklyItem.icon}
                    onChange={(e) => setNewWeeklyItem({...newWeeklyItem, icon: e.target.value})}
                    style={{ gridColumn: 'span 2' }}
                  >
                    {icons.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => { playClick(); setShowAddWeekly(false); }}>Cancel</button>
                  <button type="submit" className="primary-btn">Add Item</button>
                </div>
              </form>
            )}

            <div className="weekly-grid">
              {weeklyTasks.map((item, index) => (
                <div key={index} className="section-card glass weekly-card">
                  <div className="weekly-card-header">
                    <h3 className="weekly-day">{item.day}</h3>
                    <button className="delete-task" onClick={() => deleteWeeklyItem(index)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="weekly-topic">
                    {renderIcon(item.icon)}
                    <span>{item.topic}</span>
                  </div>
                  <p className="weekly-desc">
                    Primary skill development focus for {item.day}.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Growth Plan' && (
          <div className="growth-plan fade-in">
             <div className="card-title">
              <Target size={24} className="primary" />
              <h2>6-Month Transformation</h2>
            </div>
            <div className="growth-timeline">
              {GROWTH_PLAN.map((item, index) => (
                <div key={index} className="growth-card section-card glass">
                  <div className="growth-month">
                    Month {item.month}
                  </div>
                  <div className="growth-info">
                    <h3>{item.goal}</h3>
                    <span className={`category-tag ${item.status === 'In Progress' ? 'tag-active' : ''}`}>
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
          <div className="ideas-grid fade-in">
            <div className="section-card glass">
              <div className="card-title">
                <Video size={20} />
                <h3>YouTube & Content</h3>
              </div>
              <ul className="todo-list">
                {YOUTUBE_IDEAS.map((idea, i) => (
                  <li key={i} className="todo-item disabled-item">
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
                  <li key={i} className="todo-item disabled-item">
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
            onClick={() => {
              playClick();
              setActiveTab(item.id);
            }}
          >
            <item.icon size={22} />
            <span>{item.id.split(' ')[0]}</span>
          </button>
        ))}
      </nav>

      {activeToast && (
        <div className="toast-notification glass fade-in">
          <div className="toast-content">
            <div className="toast-icon">
              <Bell size={24} color="var(--primary)" />
            </div>
            <div className="toast-info">
              <p className="toast-label">Current Task</p>
              <h3 className="toast-task">{activeToast.activity}</h3>
              <p className="toast-motivation">"{activeToast.motivation}"</p>
            </div>
            <button className="toast-close" onClick={() => setActiveToast(null)}>
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Quote Notification */}
      {showQuote && (
        <div className="quote-notification glass">
          <div className="quote-content">
            <Quote size={24} className="primary" style={{ marginBottom: '0.5rem' }} />
            <p className="quote-text">"{currentQuote.text}"</p>
            <p className="quote-author">— {currentQuote.author}</p>
          </div>
          <button className="close-quote" onClick={() => { playClick(); closeModal(); }}>
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
