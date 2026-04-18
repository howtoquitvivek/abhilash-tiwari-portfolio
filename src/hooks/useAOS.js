import { useEffect } from 'react';

/**
 * Custom hook to handle "Animate On Scroll" (AOS) functionality.
 * Toggles the 'aos-animate' class on elements with a 'data-aos' attribute
 * when they enter the viewport.
 */
export const useAOS = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1, // Trigger when 10% of element is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          // Once animated, we don't need to observe it anymore
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const observeNewElements = () => {
      const elements = document.querySelectorAll('[data-aos]:not(.aos-animate)');
      elements.forEach((el) => observer.observe(el));
    };

    // Initial scan
    observeNewElements();

    // Observe body for changes to catch dynamic elements (like ProjectList items)
    const mutationObserver = new MutationObserver(() => {
      observeNewElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
};
