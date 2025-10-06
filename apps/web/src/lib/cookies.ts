export const COOKIE_CONSENT_KEY = "packchampion_cookie_consent";

export type CookiePreferences = {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

export type CookieConsentData = {
  preferences: CookiePreferences;
  timestamp: string;
};

/**
 * Get the current cookie preferences from localStorage
 */
export function getCookiePreferences(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!savedConsent) return null;
    
    const data: CookieConsentData = JSON.parse(savedConsent);
    return data.preferences;
  } catch (e) {
    console.error("Failed to parse cookie preferences", e);
    return null;
  }
}

/**
 * Check if a specific cookie category is enabled
 */
export function isCookieEnabled(category: keyof CookiePreferences): boolean {
  const preferences = getCookiePreferences();
  if (!preferences) return false;
  return preferences[category];
}

/**
 * Check if user has made a cookie choice
 */
export function hasGivenConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(COOKIE_CONSENT_KEY) !== null;
}

/**
 * Save cookie preferences
 */
export function saveCookiePreferences(preferences: CookiePreferences): void {
  if (typeof window === 'undefined') return;
  
  const consentData: CookieConsentData = {
    preferences,
    timestamp: new Date().toISOString(),
  };
  
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
  
  // Trigger custom event for other parts of the app to react to
  window.dispatchEvent(new CustomEvent('cookiePreferencesChanged', { 
    detail: preferences 
  }));
}

/**
 * Clear cookie preferences
 */
export function clearCookiePreferences(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(COOKIE_CONSENT_KEY);
}

/**
 * Initialize analytics if consent is given
 */
export function initializeAnalytics(): void {
  if (!isCookieEnabled('analytics')) return;
  
  // Add your analytics initialization code here
  // Example: Google Analytics, Matomo, etc.
  console.log("Analytics initialized");
}

/**
 * Initialize marketing tools if consent is given
 */
export function initializeMarketing(): void {
  if (!isCookieEnabled('marketing')) return;
  
  // Add your marketing tools initialization code here
  // Example: Facebook Pixel, Google Ads, etc.
  console.log("Marketing tools initialized");
}

/**
 * Initialize functional features if consent is given
 */
export function initializeFunctional(): void {
  if (!isCookieEnabled('functional')) return;
  
  // Add your functional features initialization code here
  console.log("Functional features initialized");
}
