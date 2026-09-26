import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const DEMO_ACCOUNTS = {
  admin: {
    id: 'usr-admin-01',
    email: 'admin@sweetbite.com',
    name: 'Chef Marie Laurent',
    role: 'admin',
    roleLabel: 'Head Baker & General Manager',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=150&q=80',
    branch: 'SweetBite HQ & Main Bakery',
    terminal: 'Admin Workstation #01',
    permissions: ['all', 'admin_portal', 'pos_billing', 'reports', 'settings'],
  },
  cashier: {
    id: 'usr-cashier-02',
    email: 'cashier@sweetbite.com',
    name: 'Priya Sharma',
    role: 'cashier',
    roleLabel: 'Senior Cashier & Barista',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    branch: 'SweetBite Downtown Store',
    terminal: 'Register #POS-01',
    permissions: ['pos_billing', 'orders', 'categories'],
  },
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sweetbite_auth_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) return parsed;
      }
    } catch (e) {
      console.error('Error loading auth session:', e);
    }
    // Default to admin for seamless initial experience
    return DEMO_ACCOUNTS.admin;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync session changes across tabs/windows
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'sweetbite_auth_session') {
        try {
          if (e.newValue) {
            setCurrentUser(JSON.parse(e.newValue));
          } else {
            setCurrentUser(null);
          }
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    // Simulate brief authentication latency
    await new Promise((resolve) => setTimeout(resolve, 400));

    const cleanEmail = email.trim().toLowerCase();

    // Check admin match
    if (
      cleanEmail === 'admin@sweetbite.com' ||
      cleanEmail === 'admin' ||
      cleanEmail.includes('admin')
    ) {
      const sessionUser = { ...DEMO_ACCOUNTS.admin, lastLogin: new Date().toISOString() };
      setCurrentUser(sessionUser);
      localStorage.setItem('sweetbite_auth_session', JSON.stringify(sessionUser));
      setIsLoading(false);
      return { success: true, user: sessionUser, redirect: '/admin' };
    }

    // Check cashier match
    if (
      cleanEmail === 'cashier@sweetbite.com' ||
      cleanEmail === 'cashier' ||
      cleanEmail.includes('cashier')
    ) {
      const sessionUser = { ...DEMO_ACCOUNTS.cashier, lastLogin: new Date().toISOString() };
      setCurrentUser(sessionUser);
      localStorage.setItem('sweetbite_auth_session', JSON.stringify(sessionUser));
      setIsLoading(false);
      return { success: true, user: sessionUser, redirect: '/' };
    }

    // Fallback: Custom email input
    if (email && password) {
      const customUser = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        email: cleanEmail,
        name: cleanEmail.split('@')[0].replace('.', ' ').toUpperCase(),
        role: 'cashier',
        roleLabel: 'Bakery Staff & Cashier',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        branch: 'SweetBite Store #1',
        terminal: 'Register #POS-01',
        permissions: ['pos_billing', 'orders'],
        lastLogin: new Date().toISOString(),
      };
      setCurrentUser(customUser);
      localStorage.setItem('sweetbite_auth_session', JSON.stringify(customUser));
      setIsLoading(false);
      return { success: true, user: customUser, redirect: '/' };
    }

    setIsLoading(false);
    return { success: false, error: 'Invalid credentials. Please enter valid email and password.' };
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('sweetbite_auth_session');
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        logout,
        DEMO_ACCOUNTS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
