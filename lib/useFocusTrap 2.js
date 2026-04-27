import { useEffect, useRef } from 'react';

/**
 * Custom hook to trap focus inside a modal dialog.
 * When active, Tab/Shift+Tab cycle through focusable elements inside the ref.
 * @param {boolean} active - Whether the trap is active
 * @returns {React.RefObject} ref to attach to the modal container
 */
export function useFocusTrap(active) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active || !ref.current) return;

    const container = ref.current;
    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function handleKeyDown(e) {
      if (e.key !== 'Tab') return;

      const focusable = Array.from(container.querySelectorAll(focusableSelector)).filter(el => el.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }

    container.addEventListener('keydown', handleKeyDown);

    // Focus first focusable element on mount
    const focusable = container.querySelectorAll(focusableSelector);
    if (focusable.length > 0) focusable[0].focus();

    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [active]);

  return ref;
}
