import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import ApiService from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [userCategories, setUserCategories] = useState([]);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence);
  }, []);

  const reloadCategories = async () => {
    if (!user) return;
    
    try {
      const categoriesResponse = await ApiService.getUserCategories(user.uid);
      setUserCategories(categoriesResponse.categories || []);
      console.log('Categories reloaded:', categoriesResponse.categories);
    } catch (error) {
      console.error('Failed to reload categories:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          picture: firebaseUser.photoURL
        };
        
        setUser(userData);
        setIsUserAuthenticated(true);
        
        try {
          const categoriesResponse = await ApiService.getUserCategories(firebaseUser.uid);
          setUserCategories(categoriesResponse.categories || []);
          console.log('Initial categories loaded:', categoriesResponse.categories);
        } catch (error) {
          console.error('Failed to load user categories:', error);
          setUserCategories([]);
        }
      } else {
        setUser(null);
        setIsUserAuthenticated(false);
        setUserCategories([]);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    setIsAuthLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      const userData = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        picture: firebaseUser.photoURL
      };
      
      setUser(userData);
      setIsUserAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsUserAuthenticated(false);
      setUserCategories([]);
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      return { success: false, error: error.message };
    }
  };

  const addCategory = async (prompt) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      console.log('Adding category:', prompt);
      
      const tempCategory = {
        id: 'temp-' + Date.now(),
        prompt: prompt,
        isGenerating: true
      };
      
      setUserCategories(prev => [tempCategory, ...prev]);
      
      const response = await ApiService.createCategory(user.uid, prompt);
      console.log('Category creation response:', response);
      
      await reloadCategories();
      
      return { success: true, data: response };
    } catch (error) {
      console.error('Failed to add category:', error);
      setUserCategories(prev => prev.filter(cat => cat.id !== tempCategory.id));
      return { success: false, error: error.message };
    }
  };

  // FIXED: This function now properly deletes by category ID
  const removeCategory = async (categoryPrompt) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      console.log('Removing category with prompt:', categoryPrompt);
      
      // Find the category by prompt to get its ID
      const category = userCategories.find(cat => cat.prompt === categoryPrompt);
      if (!category) {
        console.error('Category not found:', categoryPrompt);
        return { success: false, error: 'Category not found' };
      }
      
      console.log('Found category to delete:', category);
      
      // Delete from backend using category ID
      await ApiService.deleteCategory(user.uid, category.id);
      
      // Remove from local state immediately
      setUserCategories(prev => {
        const updated = prev.filter(cat => cat.prompt !== categoryPrompt);
        console.log('Updated categories after delete:', updated);
        return updated;
      });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to remove category:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isUserAuthenticated,
      isAuthLoading,
      userCategories,
      login,
      logout,
      addCategory,
      removeCategory,
      reloadCategories
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
