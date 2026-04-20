import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase, signIn, signOut, signUp } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileCacheAt, setProfileCacheAt] = useState(0);
  const lastLoggedProfileRef = useRef(null);
  //const navigate = useNavigate();

  const loadUserProfile = useCallback(async (user) => {
    if (!user?.email && !user?.id) {
      setUserProfile(null);
      return null;
    }

    try {
      setProfileLoading(true);

      let profileResult = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', user.id)
        .maybeSingle();

      if (!profileResult.data && !profileResult.error && user.email) {
        profileResult = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();
      }

      const { data: profile, error: profileError } = profileResult;

      if (profileError) {
        console.warn('⚠️ [AuthContext] Erreur profil:', profileError.message);
        setUserProfile(null);
        return null;
      }

      if (!profile) {
        console.warn('⚠️ [AuthContext] Profil non trouvé pour:', user.email);
        setUserProfile(null);
        return null;
      }

      const profileKey = `${profile.id}-${profile.role}`;
      if (lastLoggedProfileRef.current !== profileKey) {
        console.log('✅ [AuthContext] Profil chargé:', { role: profile.role, id: profile.id });
        lastLoggedProfileRef.current = profileKey;
      }

      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error('❌ [AuthContext] Erreur chargement profil:', error);
      setUserProfile(null);
      return null;
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // Écouter les changements d'authentification
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (!mounted) return;
        if (error) {
          console.error('❌ [AuthContext] Erreur session:', error);
          setCurrentUser(null);
          setSession(null);
          setUserProfile(null);
          return;
        }
        if (session?.user) {
          setCurrentUser(session.user);
          setSession(session);
        } else {
          setCurrentUser(null);
          setSession(null);
          setUserProfile(null);
        }
      })
      .catch((error) => {
        if (!mounted) return;
        if (error?.name === 'AbortError') return;
        console.error('❌ [AuthContext] Erreur critique session:', error);
        setCurrentUser(null);
        setSession(null);
        setUserProfile(null);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        try {
          if (event === 'TOKEN_REFRESHED' && session?.user) {
            setSession(session);
            setIsLoading(false);
            return;
          }
          if (event === 'SIGNED_OUT') {
            setCurrentUser(null);
            setSession(null);
            setUserProfile(null);
            setIsLoading(false);
            return;
          }
          if (session?.user) {
            setCurrentUser(session.user);
            setSession(session);
          } else {
            setCurrentUser(null);
            setSession(null);
            setUserProfile(null);
          }
        } catch (error) {
          console.error('❌ [AuthContext] Erreur onAuthStateChange:', error);
        } finally {
          if (mounted) setIsLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Charger le profil quand l'utilisateur change
  useEffect(() => {
    if (isLoading) return;
    if (!currentUser) {
      setUserProfile(null);
      return;
    }
    if (currentUser.profile) {
      setUserProfile((prev) =>
        prev?.id === currentUser.profile.id ? prev : currentUser.profile
      );
      setProfileCacheAt((prev) => currentUser.profile ? Date.now() : prev);
      return;
    }
    if (userProfile && userProfile.auth_id === currentUser.id) {
      setCurrentUser((prev) => {
        if (!prev || prev.id !== currentUser.id) return prev;
        if (prev.profile?.id === userProfile.id) return prev;
        return { ...prev, profile: userProfile };
      });
      return;
    }

    const timeoutId = setTimeout(() => {
      loadUserProfile(currentUser).then((profile) => {
        if (!profile) return;
        setCurrentUser((prev) => {
          if (!prev || prev.id !== currentUser.id) return prev;
          if (prev.profile?.id === profile.id) return prev;
          return { ...prev, profile };
        });
        setProfileCacheAt(Date.now());
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [currentUser?.id, currentUser?.profile, isLoading, loadUserProfile, userProfile]);

  // ─── LOGIN ───────────────────────────────────────────────────────────────────
  const login = async (username, password) => {
    try {
      setIsLoading(true);
      const { data, error } = await signIn(username, password);

      if (error) {
        return { success: false, error: error.message };
      }

      // Charger le profil pour récupérer le tenant_id
      const profile = await loadUserProfile(data.user);
      if (profile?.tenant_id) {
        localStorage.setItem('lastTenantId', profile.tenant_id);
      }

      const isTemporaryPassword = password === 'temp123456';
      return { success: true, user: data.user, isTemporaryPassword };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // ─── LOGOUT ──────────────────────────────────────────────────────────────────

  const logout = async () => {
  try {
    setIsLoading(true);
    const { error } = await signOut();
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    setIsLoading(false);
  }
};
  /*const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await signOut();
      if (error) return { success: false, error: error.message };

      // Rediriger vers le cabinet si on sait lequel c'est, sinon vers /login
      const lastTenantId = localStorage.getItem('lastTenantId');
      if (lastTenantId) {
        navigate('/cabinet-welcome');
      } else {
        navigate('/login');
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };*/

  // ─── REGISTER ────────────────────────────────────────────────────────────────
  const register = async (email, password, userData = {}) => {
    try {
      setIsLoading(true);
      const { data, error } = await signUp(email, password, userData);
      if (error) return { success: false, error: error.message };
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // ─── HELPERS ─────────────────────────────────────────────────────────────────
  const hasRole = (role) => {
    if (userProfile?.role) return userProfile.role === role;
    if (currentUser?.profile?.role) return currentUser.profile.role === role;
    const userRole = currentUser?.user_metadata?.role || currentUser?.app_metadata?.role;
    return userRole === role;
  };

  const hasAnyRole = (roles) => {
    if (userProfile?.role) return roles.includes(userProfile.role);
    if (currentUser?.profile?.role) return roles.includes(currentUser.profile.role);
    const userRole = currentUser?.user_metadata?.role || currentUser?.app_metadata?.role;
    return roles.includes(userRole);
  };

  const getUserProfile = async (forceRefresh = false) => {
    if (!currentUser) return null;
    if (userProfile && !forceRefresh) {
      const now = Date.now();
      if (now - profileCacheAt < 5 * 60 * 1000) return userProfile;
      return userProfile;
    }
    if (profileLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return userProfile;
    }
    try {
      setProfileLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', currentUser.email)
        .maybeSingle();
      if (error) {
        console.error('Erreur profil:', error);
        return userProfile;
      }
      setUserProfile(data);
      setProfileCacheAt(Date.now());
      return data;
    } catch (error) {
      console.error('Erreur générale profil:', error);
      return userProfile;
    } finally {
      setProfileLoading(false);
    }
  };

  const isAuthenticated = () => !!currentUser && !!session;

  const getAccessToken = () => {
    if (!session?.access_token) return null;
    if (session.expires_at && Date.now() / 1000 >= session.expires_at) return null;
    return session.access_token;
  };

  const value = {
    currentUser,
    session,
    userProfile,
    login,
    logout,
    register,
    hasRole,
    hasAnyRole,
    getUserProfile,
    isAuthenticated,
    getAccessToken,
    isLoading,
    profileLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
