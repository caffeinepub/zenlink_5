import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useGetAvailableConnections } from '../hooks/useQueries';

export default function MatchingPage() {
  const navigate = useNavigate();
  const { data: connections = [], isLoading } = useGetAvailableConnections();

  const handleStartChat = (connectionId: string) => {
    // Validate that the connection ID could be a valid Principal
    // Connection IDs from backend are simple strings like "1", "2", etc.
    // These are not valid Principal strings, so we navigate to safe state
    // In a real app, connections would have actual Principal IDs
    
    // For now, navigate to chat without partner to show safe state
    navigate({ to: '/chat' });
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zen-lavender to-zen-blush bg-clip-text text-transparent">
            Connections
          </h1>
          <p className="text-muted-foreground">Connect with people in the community</p>
        </div>

        {isLoading ? (
          <div className="glass-card p-8 rounded-3xl text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-muted-foreground mt-4">Loading connections...</p>
          </div>
        ) : connections.length === 0 ? (
          <div className="glass-card p-8 rounded-3xl text-center space-y-4">
            <p className="text-muted-foreground">No connections found yet.</p>
            <p className="text-sm text-muted-foreground">
              Check back later as more people join the community!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {connections.map((connection) => (
              <div key={connection.id} className="glass-card p-6 rounded-3xl space-y-4 hover:scale-105 transition-transform">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="text-3xl bg-gradient-to-br from-zen-lavender to-zen-blush">
                      {connection.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-semibold">{connection.name}</h3>
                    <Badge variant="secondary" className="glass-card">
                      {connection.personalityType}
                    </Badge>
                    {connection.isAvailable ? (
                      <Badge className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30">
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="opacity-60">
                        Busy
                      </Badge>
                    )}
                  </div>
                </div>

                {connection.interests.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground">Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {connection.interests.slice(0, 3).map((interest, idx) => (
                        <span key={idx} className="glass-card px-3 py-1 rounded-full text-xs">
                          {interest}
                        </span>
                      ))}
                      {connection.interests.length > 3 && (
                        <span className="glass-card px-3 py-1 rounded-full text-xs text-muted-foreground">
                          +{connection.interests.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => handleStartChat(connection.id)}
                  className="btn-primary w-full rounded-full"
                  disabled={!connection.isAvailable}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {connection.isAvailable ? 'Start Chat' : 'Currently Unavailable'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
