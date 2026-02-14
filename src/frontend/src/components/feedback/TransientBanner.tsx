import { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Button } from '../ui/button';

interface TransientBannerProps {
  message: string;
  onDismiss: () => void;
  autoHideDuration?: number;
}

export default function TransientBanner({ message, onDismiss, autoHideDuration = 5000 }: TransientBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    // Auto-hide after duration
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300); // Wait for fade-out animation
    }, autoHideDuration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [autoHideDuration, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="glass-card px-6 py-4 rounded-2xl shadow-lg zen-glow flex items-center gap-4 max-w-md">
        <CheckCircle2 className="w-6 h-6 text-zen-lavender flex-shrink-0" />
        <p className="text-sm font-medium flex-1">{message}</p>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          className="flex-shrink-0 h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
