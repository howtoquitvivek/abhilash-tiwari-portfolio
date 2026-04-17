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
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('[data-aos]');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);
};
