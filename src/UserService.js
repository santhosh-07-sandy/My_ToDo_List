const USERS_KEY = 'growthpath_users';
const CURRENT_USER_KEY = 'growthpath_current_user';

export const UserService = {
  signup: (userData) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (users.find(u => u.email === userData.email)) {
      throw new Error('User already exists');
    }
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser;
  },

  login: (email, password) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: () => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  getUserData: (userId, key, defaultValue) => {
    const data = localStorage.getItem(`user_${userId}_${key}`);
    return data ? JSON.parse(data) : defaultValue;
  },

  setUserData: (userId, key, value) => {
    localStorage.setItem(`user_${userId}_${key}`, JSON.stringify(value));
  }
};
