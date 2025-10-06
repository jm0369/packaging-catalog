# Cookie Consent System

This directory contains the cookie consent banner and management system for the PackChampion website.

## Components

### CookieConsent (`/components/cookie-consent.tsx`)
A professional cookie consent banner that appears on first visit. Features:
- Main banner with overview of cookie types
- Detailed settings panel for granular control
- Three action options: Accept All, Necessary Only, Custom Settings
- Smooth animations and professional styling matching the site design
- Integrates with the cookie utilities for preference management

### Cookies Page (`/app/cookies/page.tsx`)
A dedicated page where users can manage their cookie preferences at any time. Features:
- Detailed explanations of each cookie category
- Visual toggle switches for each category
- Quick action buttons (Accept All / Necessary Only)
- Success notifications when settings are saved
- Display of when settings were last updated
- Comprehensive information about cookies and privacy

## Utilities

### Cookie Management (`/lib/cookies.ts`)
Utility functions for managing cookie preferences throughout the application:

- `getCookiePreferences()` - Get current preferences
- `isCookieEnabled(category)` - Check if a category is enabled
- `hasGivenConsent()` - Check if user has made a choice
- `saveCookiePreferences(prefs)` - Save preferences with timestamp
- `clearCookiePreferences()` - Clear saved preferences
- `initializeAnalytics()` - Initialize analytics if consent given
- `initializeMarketing()` - Initialize marketing tools if consent given
- `initializeFunctional()` - Initialize functional features if consent given

## Cookie Categories

### 1. Necessary Cookies (Always Active)
- Session management
- Security features
- Basic functionality
- Cookie preferences storage

### 2. Functional Cookies (Optional)
- Language preferences
- Display settings
- Personalized content suggestions

### 3. Analytics Cookies (Optional)
- Page views and visitor counts
- User behavior analysis
- Performance metrics
- Technical information (browser, device)

### 4. Marketing Cookies (Optional)
- Personalized advertising
- Remarketing and retargeting
- Ad effectiveness measurement
- Social media integration

## Implementation

The cookie consent system is integrated into the root layout (`/app/layout.tsx`), making it available across all pages.

### Adding Your Tracking Scripts

Update the initialization functions in `/lib/cookies.ts`:

```typescript
export function initializeAnalytics(): void {
  if (!isCookieEnabled('analytics')) return;
  
  // Add Google Analytics
  // gtag('config', 'GA_MEASUREMENT_ID');
  
  // Or Matomo
  // _paq.push(['trackPageView']);
}

export function initializeMarketing(): void {
  if (!isCookieEnabled('marketing')) return;
  
  // Add Facebook Pixel
  // fbq('init', 'YOUR_PIXEL_ID');
  
  // Add Google Ads
  // gtag('config', 'AW-CONVERSION_ID');
}
```

## Storage

Cookie preferences are stored in localStorage with the key `packchampion_cookie_consent` as JSON:

```json
{
  "preferences": {
    "necessary": true,
    "functional": false,
    "analytics": true,
    "marketing": false
  },
  "timestamp": "2025-10-06T12:34:56.789Z"
}
```

## User Experience

1. **First Visit**: Banner appears after 1 second with smooth fade-in animation
2. **Choice Made**: Preference stored for 12 months (or until user clears data)
3. **Returning Visitor**: No banner shown if choice was already made
4. **Settings Management**: Users can update preferences anytime via `/cookies` page
5. **Custom Events**: A `cookiePreferencesChanged` event is dispatched when preferences change

## Styling

All components use the existing design system:
- Emerald color scheme matching the brand
- Tailwind CSS for styling
- shadcn/ui components for consistency
- Responsive design for all screen sizes
- Smooth animations and transitions

## GDPR Compliance

The system is designed to be GDPR compliant:
- ✓ Clear information about cookie usage
- ✓ Granular consent options
- ✓ Easy access to settings
- ✓ Ability to withdraw consent
- ✓ Non-essential cookies only loaded after consent
- ✓ Documentation and transparency

## Future Enhancements

Consider adding:
- Cookie expiration (auto-reset after 12 months)
- A/B testing for consent rates
- Consent analytics dashboard
- Integration with cookie scanning tools
- Multi-language support
