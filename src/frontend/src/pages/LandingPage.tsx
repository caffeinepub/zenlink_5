import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Shield, Users, Heart, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function LandingPage() {
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url(/assets/generated/zenlink-hero-bg.dim_1920x1080.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-zen-lavender/20 blur-3xl floating-animation" />
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-zen-blush/20 blur-3xl floating-animation-delayed" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-zen-sky/20 blur-2xl floating-animation" />

        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-zen-lavender via-zen-blush to-zen-peach bg-clip-text text-transparent">
                Not Social Media.
              </span>
              <br />
              <span className="bg-gradient-to-r from-zen-sky via-zen-lavender to-zen-blush bg-clip-text text-transparent">
                Social Connection.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              ZenLink helps you connect deeply with people who think, feel, and grow like you — without identity pressure.
            </p>
          </div>

          {isAuthenticated ? (
            <Link to="/home">
              <Button className="btn-primary px-8 py-6 text-lg rounded-full zen-glow">
                <Sparkles className="w-5 h-5 mr-2" />
                Begin Your Journey
              </Button>
            </Link>
          ) : (
            <Button onClick={login} className="btn-primary px-8 py-6 text-lg rounded-full zen-glow">
              <Sparkles className="w-5 h-5 mr-2" />
              Begin Your Journey
            </Button>
          )}
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="glass-card p-8 md:p-12 rounded-3xl space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-semibold">About ZenLink – The Vision</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                In a world full of noise and followers, ZenLink builds safe, personality-based human connections. 
                It focuses on empathy, communication, emotional growth, and meaningful conversations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Shield, label: 'Safety', color: 'text-zen-lavender' },
                { icon: Users, label: 'Personality Matching', color: 'text-zen-sky' },
                { icon: Heart, label: 'Emotional Growth', color: 'text-zen-blush' },
                { icon: MessageCircle, label: 'Respectful Communication', color: 'text-zen-peach' },
              ].map((item, index) => (
                <div
                  key={item.label}
                  className="glass-card p-6 rounded-2xl text-center space-y-3 hover:scale-105 transition-transform duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-${item.color}/20 to-${item.color}/10 flex items-center justify-center`}>
                    <item.icon className={`w-8 h-8 ${item.color}`} />
                  </div>
                  <h3 className="font-semibold">{item.label}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Closing Promise Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(/assets/generated/zenlink-footer-bg.dim_1920x600.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="relative z-10 container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-semibold">
            <span className="bg-gradient-to-r from-zen-lavender to-zen-blush bg-clip-text text-transparent">
              ZenLink connects souls, not profiles.
            </span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {['Privacy First', 'No Judgment', 'Respect Always', 'Growth Together'].map((item) => (
              <div key={item} className="glass-card p-4 rounded-2xl">
                <p className="font-medium text-sm">{item}</p>
              </div>
            ))}
          </div>

          {isAuthenticated ? (
            <Link to="/matching">
              <Button className="btn-primary px-8 py-6 text-lg rounded-full zen-glow">
                Start Connecting
              </Button>
            </Link>
          ) : (
            <Button onClick={login} className="btn-primary px-8 py-6 text-lg rounded-full zen-glow">
              Start Connecting
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-card border-t py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} ZenLink. Built with <Heart className="inline w-4 h-4 text-zen-blush fill-zen-blush" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
