// Mock Firebase implementation using LocalStorage
// This allows the app to function without any external services.

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

// Mock User Type
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Mock Auth State
let currentUser: User | null = JSON.parse(localStorage.getItem('yathra_user') || 'null');
const authListeners: ((user: User | null) => void)[] = [];

const notifyListeners = () => {
  authListeners.forEach(listener => listener(currentUser));
};

export const auth = {
  get currentUser() {
    return currentUser;
  }
};

export const googleProvider = {};

export const onAuthStateChanged = (authObj: any, callback: (user: User | null) => void) => {
  authListeners.push(callback);
  // Initial call
  setTimeout(() => callback(currentUser), 0);
  return () => {
    const index = authListeners.indexOf(callback);
    if (index > -1) authListeners.splice(index, 1);
  };
};

export const signInWithPopup = async (authObj?: any, provider?: any) => {
  // Simulate Google Login
  const mockUser: User = {
    uid: 'google-user-' + Math.random().toString(36).substr(2, 9),
    email: 'google.user@example.com',
    displayName: 'Google Traveler',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=traveler'
  };
  currentUser = mockUser;
  localStorage.setItem('yathra_user', JSON.stringify(currentUser));
  notifyListeners();
  return { user: mockUser };
};

export const signInWithEmailAndPassword = async (authObj: any, email: string, pass: string) => {
  const users = JSON.parse(localStorage.getItem('yathra_mock_users') || '{}');
  
  // If user exists, check password
  if (users[email]) {
    if (users[email].password === pass) {
      currentUser = {
        uid: users[email].uid,
        email: email,
        displayName: users[email].displayName || email.split('@')[0],
        photoURL: null
      };
      localStorage.setItem('yathra_user', JSON.stringify(currentUser));
      notifyListeners();
      return { user: currentUser };
    } else {
      throw { code: 'auth/invalid-credential', message: 'Invalid password for this email.' };
    }
  }
  
  // For this prototype, if user doesn't exist, we'll automatically create them
  // to make it easier for the user.
  const newUser = {
    uid: 'local-user-' + Math.random().toString(36).substr(2, 9),
    password: pass,
    displayName: email.split('@')[0]
  };
  users[email] = newUser;
  localStorage.setItem('yathra_mock_users', JSON.stringify(users));
  
  currentUser = {
    uid: newUser.uid,
    email: email,
    displayName: newUser.displayName,
    photoURL: null
  };
  localStorage.setItem('yathra_user', JSON.stringify(currentUser));
  notifyListeners();
  return { user: currentUser };
};

export const createUserWithEmailAndPassword = async (authObj: any, email: string, pass: string) => {
  const users = JSON.parse(localStorage.getItem('yathra_mock_users') || '{}');
  if (users[email]) {
    throw { code: 'auth/email-already-in-use', message: 'Email already in use.' };
  }
  const newUser = {
    uid: 'local-user-' + Math.random().toString(36).substr(2, 9),
    password: pass,
    displayName: email.split('@')[0]
  };
  users[email] = newUser;
  localStorage.setItem('yathra_mock_users', JSON.stringify(users));
  
  currentUser = {
    uid: newUser.uid,
    email: email,
    displayName: newUser.displayName,
    photoURL: null
  };
  localStorage.setItem('yathra_user', JSON.stringify(currentUser));
  notifyListeners();
  return { user: currentUser };
};

export const signOut = async (authObj?: any) => {
  currentUser = null;
  localStorage.removeItem('yathra_user');
  notifyListeners();
};

// Mock Firestore
export const db = {};

export const doc = (dbObj: any, collection: string, id: string) => {
  return `${collection}/${id}`;
};

export const getDoc = async (path: string) => {
  const data = JSON.parse(localStorage.getItem('yathra_db_' + path) || 'null');
  return {
    exists: () => data !== null,
    data: () => data
  };
};

export const setDoc = async (path: string, data: any) => {
  localStorage.setItem('yathra_db_' + path, JSON.stringify(data));
};

export function handleFirestoreError(error: unknown, operationType?: OperationType, path?: string | null) {
  console.error('Mock DB Error:', error, operationType, path);
}

// Not needed for mock but exported for compatibility
export const collection = () => ({});
export const addDoc = async () => ({ id: 'mock-id' });
export const getDocs = async () => ({ docs: [] });
export const query = () => ({});
export const where = () => ({});
export const onSnapshot = (ref: any, callback: any) => {
  return () => {};
};
