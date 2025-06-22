
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'employee';
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isManager: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    console.log('🔍 Fetching profile for user ID:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        throw error;
      }
      
      console.log('✅ Profile fetched successfully:', data);
      
      // Type guard to ensure role is valid
      const validRoles = ['admin', 'manager', 'employee'] as const;
      const role = validRoles.includes(data.role as any) ? data.role as 'admin' | 'manager' | 'employee' : 'employee';
      
      const profileData = {
        ...data,
        role
      };
      
      setProfile(profileData);
      console.log('👤 Profile state updated:', profileData);
    } catch (error) {
      console.error('💥 Error in fetchProfile:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    console.log('🚀 Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('👍 User authenticated, fetching profile...');
          await fetchProfile(session.user.id);
        } else {
          console.log('👎 No user session, clearing profile');
          setProfile(null);
        }
        
        setLoading(false);
        console.log('⏰ Loading set to false');
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      console.log('🔍 Checking for existing session...');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          setLoading(false);
          return;
        }
        
        console.log('📋 Initial session check:', session?.user?.id || 'No session');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
        
        setLoading(false);
        console.log('✅ Auth initialization complete');
      } catch (error) {
        console.error('💥 Error in auth initialization:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    console.log('🔑 Attempting sign in for:', email);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        throw error;
      }
      
      console.log('✅ Sign in successful:', data.user?.id);
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao sistema Lord Veículos.",
      });
      
      return true;
    } catch (error: any) {
      console.error('💥 Sign in failed:', error.message);
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    console.log('📝 Attempting sign up for:', email);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu email para confirmar a conta.",
      });
      
      return true;
    } catch (error: any) {
      console.error('💥 Sign up failed:', error.message);
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const signOut = async () => {
    console.log('🚪 Signing out user');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      setSession(null);
      
      toast({
        title: "Logout realizado com sucesso!",
        description: "Até logo!",
      });
    } catch (error: any) {
      console.error('💥 Sign out error:', error.message);
      toast({
        title: "Erro no logout",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Add debug logs for computed values
  const isAdmin = profile?.role === 'admin';
  const isManager = profile?.role === 'manager' || profile?.role === 'admin';
  
  console.log('🔍 Current auth state:', {
    hasUser: !!user,
    hasProfile: !!profile,
    hasSession: !!session,
    loading,
    userRole: profile?.role,
    isAdmin,
    isManager
  });

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isManager,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
