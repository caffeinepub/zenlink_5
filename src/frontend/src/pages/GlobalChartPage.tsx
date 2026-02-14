import { useGetGlobalStats } from '../hooks/useQueries';
import { Users, TrendingUp, Heart } from 'lucide-react';

export default function GlobalChartPage() {
  const { data: stats, isLoading } = useGetGlobalStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading global stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold">Global Chart</h1>
          <p className="text-muted-foreground">See the pulse of our community</p>
        </div>

        {/* World Map Visualization */}
        <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'url(/assets/generated/zenlink-worldmap.dim_1600x900.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="relative z-10 space-y-6">
            <h2 className="text-2xl font-semibold text-center">Global Connections</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-2xl text-center space-y-2 pulse-glow">
                <Users className="w-12 h-12 mx-auto text-zen-lavender" />
                <div className="text-3xl font-bold">{stats ? Number(stats.activeUsers) : 0}</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="glass-card p-6 rounded-2xl text-center space-y-2 pulse-glow">
                <TrendingUp className="w-12 h-12 mx-auto text-zen-sky" />
                <div className="text-lg font-semibold">
                  {stats?.trendingMbtiTypes.join(', ') || 'Loading...'}
                </div>
                <div className="text-sm text-muted-foreground">Trending Personality Types</div>
              </div>
              <div className="glass-card p-6 rounded-2xl text-center space-y-2 pulse-glow">
                <Heart className="w-12 h-12 mx-auto text-zen-blush" />
                <div className="text-lg font-semibold">
                  {stats?.emotionalHeatmap.join(', ') || 'Loading...'}
                </div>
                <div className="text-sm text-muted-foreground">Emotional Trends</div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="font-semibold text-lg">Connection Quality</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Meaningful Conversations</span>
                <span className="font-semibold text-zen-lavender">High</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Emotional Safety</span>
                <span className="font-semibold text-zen-sky">Excellent</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Growth Focus</span>
                <span className="font-semibold text-zen-blush">Strong</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="font-semibold text-lg">Community Mood</h3>
            <div className="space-y-2">
              {stats?.emotionalHeatmap.map((mood, index) => (
                <div key={index} className="glass-card p-3 rounded-xl">
                  <span className="text-sm">{mood}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
