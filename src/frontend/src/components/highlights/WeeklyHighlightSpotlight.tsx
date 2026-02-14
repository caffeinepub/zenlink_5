import { Sparkles } from 'lucide-react';
import type { WeeklyMoment } from '../../backend';

interface WeeklyHighlightSpotlightProps {
  moments: WeeklyMoment[];
}

export default function WeeklyHighlightSpotlight({ moments }: WeeklyHighlightSpotlightProps) {
  if (!moments || moments.length === 0) {
    return (
      <div className="glass-card p-8 rounded-3xl text-center space-y-4">
        <Sparkles className="w-12 h-12 mx-auto text-zen-lavender opacity-50" />
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-zen-lavender to-zen-blush bg-clip-text text-transparent">
          Weekly Highlight
        </h2>
        <p className="text-muted-foreground">
          No highlights available yet. Share your moments to inspire the community!
        </p>
      </div>
    );
  }

  // Select the first moment from the top moments list
  const highlight = moments[0];

  return (
    <div className="glass-card p-8 rounded-3xl space-y-6 zen-glow pulse-glow">
      <div className="flex items-center justify-center gap-3">
        <Sparkles className="w-8 h-8 text-zen-lavender" />
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-zen-lavender to-zen-blush bg-clip-text text-transparent">
          Weekly Highlight
        </h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="glass-card px-4 py-2 rounded-full text-sm font-medium">
            {highlight.category}
          </span>
          <span className="text-sm font-semibold text-zen-blush">
            {Number(highlight.impactCount)} Impact
          </span>
        </div>
        
        <p className="text-lg leading-relaxed">{highlight.content}</p>
        
        <p className="text-sm text-muted-foreground text-center">
          {new Date(Number(highlight.timestamp) / 1000000).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </div>
    </div>
  );
}
