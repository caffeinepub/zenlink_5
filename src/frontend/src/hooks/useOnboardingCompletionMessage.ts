import { useState, useEffect } from 'react';

const STORAGE_KEY = 'zenlink_onboarding_completion';

export function useOnboardingCompletionMessage() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Read message from sessionStorage on mount
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      setMessage(stored);
    }
  }, []);

  const setCompletionMessage = (msg: string) => {
    sessionStorage.setItem(STORAGE_KEY, msg);
    setMessage(msg);
  };

  const clearCompletionMessage = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setMessage(null);
  };

  return {
    message,
    setCompletionMessage,
    clearCompletionMessage,
  };
}
