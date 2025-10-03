// Standardized breakpoints for consistent responsive design
export const BREAKPOINTS = {
  xs: 0,      // Extra small devices (phones)
  sm: 600,    // Small devices (tablets)
  md: 900,    // Medium devices (small laptops)
  lg: 1200,   // Large devices (desktops)
  xl: 1536    // Extra large devices (large desktops)
};

// Standardized media queries
export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.md - 1}px)`,
  tablet: `(min-width: ${BREAKPOINTS.sm}px) and (max-width: ${BREAKPOINTS.md - 1}px)`,
  desktop: `(min-width: ${BREAKPOINTS.md}px)`,
  largeDesktop: `(min-width: ${BREAKPOINTS.lg}px)`
};

// Hook for consistent breakpoint usage
export const useStandardBreakpoints = (theme) => ({
  isMobile: theme.breakpoints.down('md'),
  isTablet: theme.breakpoints.between('sm', 'md'),
  isDesktop: theme.breakpoints.up('md'),
  isLargeDesktop: theme.breakpoints.up('lg')
});

// Responsive values helper
export const getResponsiveValue = (mobile, tablet, desktop) => ({
  xs: mobile,
  sm: tablet || mobile,
  md: desktop || tablet || mobile
});

export default BREAKPOINTS;