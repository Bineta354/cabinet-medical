import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour détecter la taille de l'écran et les breakpoints
 * Permet aux composants de s'adapter responsively
 */
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  // Breakpoints selon Tailwind CSS
  const breakpoints = {
    xs: 360,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    width: screenSize.width,
    height: screenSize.height,
    
    // Vérification des breakpoints
    isXs: screenSize.width < breakpoints.sm,
    isSm: screenSize.width >= breakpoints.sm && screenSize.width < breakpoints.md,
    isMd: screenSize.width >= breakpoints.md && screenSize.width < breakpoints.lg,
    isLg: screenSize.width >= breakpoints.lg && screenSize.width < breakpoints.xl,
    isXl: screenSize.width >= breakpoints.xl && screenSize.width < breakpoints['2xl'],
    is2xl: screenSize.width >= breakpoints['2xl'],
    
    // Utilitaires
    isMobile: screenSize.width < breakpoints.md,
    isTablet: screenSize.width >= breakpoints.md && screenSize.width < breakpoints.lg,
    isDesktop: screenSize.width >= breakpoints.lg,
    
    // Taille de l'écran
    isSmallScreen: screenSize.width < breakpoints.md,
    isMediumScreen: screenSize.width >= breakpoints.md && screenSize.width < breakpoints.lg,
    isLargeScreen: screenSize.width >= breakpoints.lg,
    
    // Utilitaires d'orientation
    isLandscape: screenSize.width > screenSize.height,
    isPortrait: screenSize.width <= screenSize.height,
    
    // Nombre de colonnes recommandé
    getGridColumns: () => {
      if (screenSize.width < breakpoints.sm) return 1;
      if (screenSize.width < breakpoints.md) return 2;
      if (screenSize.width < breakpoints.lg) return 3;
      if (screenSize.width < breakpoints.xl) return 4;
      return 5;
    },
    
    // Taille de padding recommandée
    getPadding: () => {
      if (screenSize.width < breakpoints.xs) return '0.5rem';
      if (screenSize.width < breakpoints.sm) return '0.75rem';
      if (screenSize.width < breakpoints.md) return '1rem';
      if (screenSize.width < breakpoints.lg) return '1.5rem';
      return '2rem';
    },
    
    // Taille de gap recommandée
    getGap: () => {
      if (screenSize.width < breakpoints.xs) return '0.5rem';
      if (screenSize.width < breakpoints.sm) return '0.75rem';
      if (screenSize.width < breakpoints.md) return '1rem';
      if (screenSize.width < breakpoints.lg) return '1.25rem';
      return '1.5rem';
    },
  };
};

/**
 * Hook pour contrôler la visibilité d'éléments en fonction de la taille de l'écran
 */
export const useResponsiveVisibility = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return {
    showOnMobile: isMobile,
    showOnTablet: isTablet,
    showOnDesktop: isDesktop,
    hideOnMobile: !isMobile,
    hideOnTablet: !isTablet,
    hideOnDesktop: !isDesktop,
  };
};

/**
 * Hook pour optimiser les images en fonction de la taille de l'écran
 */
export const useResponsiveImage = () => {
  const { width } = useResponsive();

  return {
    getSrcset: (baseUrl, sizes = [320, 640, 768, 1024, 1280, 1536]) => {
      return sizes.map(size => `${baseUrl}?w=${size} ${size}w`).join(', ');
    },
    
    getOptimalSize: () => {
      if (width < 640) return 320;
      if (width < 768) return 640;
      if (width < 1024) return 768;
      if (width < 1280) return 1024;
      if (width < 1536) return 1280;
      return 1536;
    },
  };
};

export default useResponsive;
