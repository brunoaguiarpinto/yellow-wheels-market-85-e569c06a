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
  const [profileRetryCount, setProfileRetryCount] = useState(0);
  const { toast } = useToast();

  const fetchProfile = async (userId: string, retryCount = 0) => {
    console.log('🔍 fetchProfile attempt:', { userId, retryCount });
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      console.log('📋 Profile query result:', { data, error, hasData: !!data });

      if (error) {
        console.error('❌ Profile fetch error:', error);
        if (retryCount < 2) {
          console.log('🔄 Retrying profile fetch...');
          setTimeout(() => fetchProfile(userId, retryCount + 1), 1000);
          return;
        }
        throw error;
      }
      
      if (!data) {
        console.warn('⚠️ No profile found for user:', userId);
        console.log('🔍 This might be normal for new users or indicate RLS issues');
        setProfile(null);
        setLoading(false);
        return;
      }
      
      console.log('✅ Profile data received:', data);
      
      // Type guard to ensure role is valid
      const validRoles = ['admin', 'manager', 'employee'] as const;
      const role = validRoles.includes(data.role as any) ? data.role as 'admin' | 'manager' | 'employee' : 'employee';
      
      const profileData = {
        ...data,
        role
      };
      
      setProfile(profileData);
      setProfileRetryCount(0);
      console.log('👤 Profile state updated successfully:', profileData);
    } catch (error) {
      console.error('💥 Error in fetchProfile:', error);
      if (retryCount < 2) {
        console.log('🔄 Retrying profile fetch due to error...');
        setProfileRetryCount(retryCount + 1);
        setTimeout(() => fetchProfile(userId, retryCount + 1), 1000);
      } else {
        console.error('🚫 Max retries reached, setting profile to null');
        setProfile(null);
      }
    }
  };

  useEffect(() => {
    console.log('🚀 Setting up auth state listener');
    let timeoutId: NodeJS.Timeout;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', { event, userId: session?.user?.id });
        
        // Clear any existing timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('👍 User authenticated, fetching profile...');
          await fetchProfile(session.user.id);
          
          // Safety timeout - if profile doesn't load in 10 seconds, continue anyway
          timeoutId = setTimeout(() => {
            console.warn('⏰ Profile fetch timeout - continuing without profile');
            if (loading) {
              setLoading(false);
            }
          }, 10000);
        } else {
          console.log('👎 No user session, clearing profile');
          setProfile(null);
          setLoading(false);
        }
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
          
          // Safety timeout for initial load
          timeoutId = setTimeout(() => {
            console.warn('⏰ Initial profile fetch timeout - continuing anyway');
            if (loading) {
              setLoading(false);
            }
          }, 10000);
        } else {
          setLoading(false);
        }
        
        console.log('✅ Auth initialization complete');
      } catch (error) {
        console.error('💥 Error in auth initialization:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      subscription.unsubscribe();
    };
  }, []);

  // Set loading to false when we have both user and profile, or when we have user but no profile after retries
  useEffect(() => {
    if (user && (profile || profileRetryCount >= 2)) {
      console.log('🎯 Setting loading to false - auth complete', { hasUser: !!user, hasProfile: !!profile, retryCount: profileRetryCount });
      setLoading(false);
    } else if (!user && !loading) {
      console.log('🎯 No user and not loading - ensure loading is false');
      setLoading(false);
    }
  }, [user, profile, profileRetryCount, loading]);

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
      
      return true;
    } catch (error: any) {
      console.error('💥 Sign in failed:', error.message);
      return false;
    } finally {
      // Don't set loading to false here - let the auth state change handle it
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
    isManager,
    retryCount: profileRetryCount
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
