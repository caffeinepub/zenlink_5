import { Link } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Heart, MessageCircle, Lightbulb, TrendingUp } from 'lucide-react';

export default function MatchingPage() {
  // Mock matching data - in a real app, this would come from backend
  const matches = [
    {
      id: 1,
      name: 'Alex',
      mbtiType: 'INFJ',
      valuesMatch: 78,
      communicationMatch: 82,
      interests: ['Philosophy', 'Art', 'Meditation'],
    },
  ];

  const modes = [
    { id: 'talk', label: 'Talk Mode', icon: MessageCircle, description: 'Casual conversation and sharing' },
    { id: 'advice', label: 'Advice Mode', icon: Lightbulb, description: 'Seek or give guidance' },
    { id: 'support', label: 'Support Mode', icon: Heart, description: 'Emotional support and empathy' },
    { id: 'growth', label: 'Growth Mode', icon: TrendingUp, description: 'Personal development focus' },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold">Smart Matching</h1>
          <p className="text-muted-foreground">Connect with people who resonate with you</p>
        </div>

        {matches.map((match) => (
          <div key={match.id} className="glass-card p-8 rounded-3xl space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">{match.name}</h2>
                <p className="text-zen-blush font-medium">{match.mbtiType}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-4 rounded-2xl">
                <div className="text-sm text-muted-foreground mb-1">Values Match</div>
                <div className="text-3xl font-bold text-zen-lavender">{match.valuesMatch}%</div>
              </div>
              <div className="glass-card p-4 rounded-2xl">
                <div className="text-sm text-muted-foreground mb-1">Communication Style</div>
                <div className="text-3xl font-bold text-zen-sky">{match.communicationMatch}%</div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Shared Interests</h3>
              <div className="flex flex-wrap gap-2">
                {match.interests.map((interest) => (
                  <span key={interest} className="glass-card px-3 py-1 rounded-full text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Choose Connection Mode</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modes.map((mode) => (
                  <Link key={mode.id} to="/chat">
                    <button className="glass-card p-4 rounded-2xl w-full text-left hover:bg-card/60 transition-all group">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zen-lavender/20 to-zen-blush/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <mode.icon className="w-5 h-5 text-zen-lavender" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{mode.label}</div>
                          <div className="text-sm text-muted-foreground">{mode.description}</div>
                        </div>
                      </div>
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="text-center">
          <Button className="btn-secondary px-8 py-6 rounded-full">
            Find More Matches
          </Button>
        </div>
      </div>
    </div>
  );
}
