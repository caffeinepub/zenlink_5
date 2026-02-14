import { useGetTopMoments } from '../hooks/useQueries';
import { Sparkles } from 'lucide-react';

export default function WeeklyHighlightsPage() {
  const { data: moments, isLoading } = useGetTopMoments();

  const categories = {
    'Most Helpful': moments?.filter(m => m.category === 'Helpful').slice(0, 3) || [],
    'Most Growth-Oriented': moments?.filter(m => m.category === 'Growth').slice(0, 3) || [],
    'Most Supportive': moments?.filter(m => m.category === 'Supportive').slice(0, 4) || [],
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading highlights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl space-y-12">
        <div className="text-center space-y-4">
          <Sparkles className="w-16 h-16 mx-auto text-zen-lavender" />
          <h1 className="text-3xl md:text-4xl font-semibold">Weekly Highlights</h1>
          <p className="text-muted-foreground">Top 10 Most Inspiring Moments of the Week</p>
        </div>

        {Object.entries(categories).map(([categoryName, categoryMoments]) => (
          <div key={categoryName} className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">
              <span className="bg-gradient-to-r from-zen-lavender to-zen-blush bg-clip-text text-transparent">
                {categoryName}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryMoments.map((moment, index) => (
                <div
                  key={index}
                  className="glass-card p-6 rounded-2xl space-y-4 hover:scale-105 transition-transform duration-300 pulse-glow"
                >
                  <div className="flex items-center justify-between">
                    <span className="glass-card px-3 py-1 rounded-full text-sm">{moment.category}</span>
                    <span className="text-sm font-semibold text-zen-blush">{Number(moment.impactCount)} Impact</span>
                  </div>
                  <p className="text-sm">{moment.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(Number(moment.timestamp) / 1000000).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
