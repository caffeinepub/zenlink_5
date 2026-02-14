import { Link, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Menu, X, Heart } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';

export default function ZenNav() {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const isAuthenticated = !!identity;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks = isAuthenticated
    ? [
        { to: '/home', label: 'Home' },
        { to: '/highlights', label: 'Weekly Highlights' },
        { to: '/debates', label: 'Weekly Debates' },
        { to: '/matching', label: 'Connections' },
        { to: '/circles', label: 'Circles' },
      ]
    : [
        { to: '/', label: 'Home' },
        { to: '/safety', label: 'Safety' },
      ];

  return (
    <nav className="sticky top-0 z-50 glass-card border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-zen-blush fill-zen-blush" />
            <span className="text-xl font-semibold bg-gradient-to-r from-zen-lavender to-zen-blush bg-clip-text text-transparent">
              ZenLink
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  currentPath === link.to ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && (
              <Link to="/profile">
                <Button variant="ghost" size="sm">
                  Profile
                </Button>
              </Link>
            )}
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              className="btn-primary px-6 rounded-full"
              size="sm"
            >
              {isLoggingIn ? 'Signing in...' : isAuthenticated ? 'Sign Out' : 'Sign In'}
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass-card w-64">
              <div className="flex flex-col space-y-4 mt-8">
                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      currentPath === link.to ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated && (
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-muted-foreground hover:text-primary"
                  >
                    Profile
                  </Link>
                )}
                <Button
                  onClick={() => {
                    handleAuth();
                    setMobileOpen(false);
                  }}
                  disabled={isLoggingIn}
                  className="btn-primary rounded-full w-full"
                >
                  {isLoggingIn ? 'Signing in...' : isAuthenticated ? 'Sign Out' : 'Sign In'}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
