import { 
    signInWithEmailAndPassword, 
    signOut as firebaseSignOut,
    UserCredential
  } from 'firebase/auth';
  import { auth } from '@/lib/firebase';
  
  export const AuthService = {
    async signIn(email: string, password: string): Promise<UserCredential> {
      return signInWithEmailAndPassword(auth, email, password);
    },
    
    async signOut(): Promise<void> {
      return firebaseSignOut(auth);
    }
  };