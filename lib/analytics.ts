// Google Analytics event tracking helpers

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, eventParams);
  }
};

// Track section views
export const trackSectionView = (sectionName: string) => {
  trackEvent("section_view", {
    section_name: sectionName,
  });
};

// Track social link clicks
export const trackSocialClick = (platform: string) => {
  trackEvent("social_click", {
    platform: platform,
  });
};

// Track contact form interactions
export const trackContactFormStart = () => {
  trackEvent("contact_form_start");
};

export const trackContactFormSubmit = (success: boolean) => {
  trackEvent("contact_form_submit", {
    success: success,
  });
};
