import { Link } from '@tanstack/react-router';
import { Home, TrendingUp, MessageSquare, Users, Circle, MessageCircleMore, Calendar, Globe, User, Shield, Sparkles, MessagesSquare, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { useGetCallerUserProfile, useGetTopMoments } from '../hooks/useQueries';
import { useOnboardingCompletionMessage } from '../hooks/useOnboardingCompletionMessage';
import TransientBanner from '../components/feedback/TransientBanner';
import WeeklyHighlightSpotlight from '../components/highlights/WeeklyHighlightSpotlight';

const motivationalQuotes = [
  "Every step forward is progress, no matter how small.",
  "Your vulnerability is your strength.",
  "Growth happens outside your comfort zone.",
  "You are worthy of connection and belonging.",
  "Healing is not linear, and that's okay.",
  "Your story matters, and so do you.",
  "Be gentle with yourself—you're doing your best.",
  "Connection begins with authenticity.",
];

export default function HomePage() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const { data: topMoments = [], isLoading: momentsLoading } = useGetTopMoments();
  const { message, clearCompletionMessage } = useOnboardingCompletionMessage();

  // Select a random quote
  const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const navigationOptions = [
    {
      to: '/highlights',
      label: 'Weekly Highlights',
      icon: TrendingUp,
      description: 'Top inspiring moments',
      gradient: 'from-zen-sky to-zen-blush',
    },
    {
      to: '/debates',
      label: 'Weekly Debates',
      icon: MessageSquare,
      description: 'Join respectful discussions',
      gradient: 'from-zen-blush to-zen-peach',
    },
    {
      to: '/matching',
      label: 'Connections',
      icon: Users,
      description: 'Find like-minded people',
      gradient: 'from-zen-peach to-zen-lavender',
    },
    {
      to: '/global-chat',
      label: 'Global Chat',
      icon: MessagesSquare,
      description: 'Share with the community',
      gradient: 'from-zen-lavender to-zen-sky',
    },
    {
      to: '/circles',
      label: 'Circles',
      icon: Circle,
      description: 'Your intimate groups',
      gradient: 'from-zen-lavender to-zen-blush',
    },
    {
      to: '/chat',
      label: 'Chat',
      icon: MessageCircleMore,
      description: 'Connect with others',
      gradient: 'from-zen-sky to-zen-peach',
    },
    {
      to: '/moments',
      label: 'Weekly Moments',
      icon: Sparkles,
      description: 'Share your experiences',
      gradient: 'from-zen-blush to-zen-lavender',
    },
    {
      to: '/challenges',
      label: 'Daily Challenges',
      icon: Calendar,
      description: 'Grow emotionally every day',
      gradient: 'from-zen-peach to-zen-sky',
    },
    {
      to: '/global-chart',
      label: 'Global Chart',
      icon: Globe,
      description: 'Community insights',
      gradient: 'from-zen-lavender to-zen-sky',
    },
    {
      to: '/profile',
      label: 'Profile',
      icon: User,
      description: 'Manage your identity',
      gradient: 'from-zen-blush to-zen-peach',
    },
    {
      to: '/safety',
      label: 'Safety',
      icon: Shield,
      description: 'Learn about our safety features',
      gradient: 'from-zen-sky to-zen-lavender',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      {message && (
        <TransientBanner
          message={message}
          onDismiss={clearCompletionMessage}
        />
      )}
      
      <div className="container mx-auto max-w-6xl space-y-12">
        {/* User Profile Section - Centered and Prominent */}
        <div className="flex flex-col items-center justify-center space-y-6">
          {isLoading ? (
            <div className="glass-card p-8 rounded-3xl zen-glow">
              <div className="w-32 h-32 rounded-full bg-muted animate-pulse" />
            </div>
          ) : userProfile ? (
            <div className="glass-card p-8 rounded-3xl zen-glow text-center space-y-4">
              <Avatar className="w-32 h-32 mx-auto text-6xl">
                <AvatarFallback className="text-6xl bg-gradient-to-br from-zen-lavender to-zen-blush">
                  {userProfile.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-zen-lavender via-zen-blush to-zen-peach bg-clip-text text-transparent">
                  {userProfile.displayName}
                </h2>
                {userProfile.mbtiType && (
                  <p className="text-lg text-muted-foreground">
                    {userProfile.mbtiType} Personality
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card p-8 rounded-3xl zen-glow text-center">
              <p className="text-muted-foreground">Profile not found</p>
            </div>
          )}

          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-zen-lavender via-zen-blush to-zen-peach bg-clip-text text-transparent">
              Welcome to ZenLink
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your space for meaningful connections, emotional growth, and supportive community
            </p>
          </div>
        </div>

        {/* Weekly Highlight Spotlight */}
        {!momentsLoading && <WeeklyHighlightSpotlight moments={topMoments} />}

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Link key={option.to} to={option.to}>
                <div className="glass-card p-6 rounded-3xl hover:scale-105 transition-transform duration-300 zen-glow h-full">
                  <div className="space-y-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{option.label}</h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <Button className="btn-primary w-full rounded-full">
                      Explore
                    </Button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Journey Info */}
        <div className="glass-card p-8 rounded-3xl text-center space-y-4">
          <h2 className="text-2xl font-semibold">Your Journey Continues</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            ZenLink is designed to foster genuine connections and emotional well-being. 
            Explore weekly debates, share meaningful moments, connect with others, and grow together in a supportive environment.
          </p>
        </div>

        {/* Motivational Quote Section */}
        <div className="glass-card p-8 rounded-3xl text-center space-y-4 bg-gradient-to-br from-zen-lavender/10 via-zen-blush/10 to-zen-peach/10">
          <div className="flex justify-center">
            <Heart className="w-8 h-8 text-zen-blush" />
          </div>
          <blockquote className="text-xl md:text-2xl font-medium italic text-foreground/90 max-w-2xl mx-auto">
            "{quote}"
          </blockquote>
          <p className="text-sm text-muted-foreground">
            A reminder for your journey
          </p>
        </div>
      </div>
    </div>
  );
}
