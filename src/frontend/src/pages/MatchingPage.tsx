import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Loader2, MessageCircle, UserPlus, Check } from 'lucide-react';
import { useGetAllMembers, useGetMyConnections, useConnectToMember } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useState } from 'react';

export default function MatchingPage() {
  const { data: members = [], isLoading } = useGetAllMembers();
  const { data: myConnections = [], isLoading: connectionsLoading } = useGetMyConnections();
  const connectMutation = useConnectToMember();
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentUserPrincipal = identity?.getPrincipal().toString();

  const isConnected = (memberPrincipal: string) => {
    return myConnections.includes(memberPrincipal);
  };

  const isSelf = (memberPrincipal: string) => {
    return currentUserPrincipal === memberPrincipal;
  };

  const handleConnect = async (memberPrincipal: string) => {
    setErrorMessage(null);
    try {
      await connectMutation.mutateAsync(memberPrincipal);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to connect. Please try again.');
    }
  };

  const handleStartConversation = (memberPrincipal: string) => {
    if (!memberPrincipal || memberPrincipal.trim() === '') {
      setErrorMessage('Invalid member identifier');
      return;
    }

    try {
      // Validate that it's a valid principal format
      const testPrincipal = memberPrincipal.trim();
      if (testPrincipal.length < 10) {
        setErrorMessage('Invalid member identifier');
        return;
      }

      navigate({ to: '/chat', search: { partner: testPrincipal } });
    } catch (error) {
      setErrorMessage('Unable to start conversation with this member');
    }
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

        {errorMessage && (
          <div className="glass-card p-4 rounded-2xl bg-destructive/10 border border-destructive/20">
            <p className="text-destructive text-sm text-center">{errorMessage}</p>
          </div>
        )}

        {isLoading || connectionsLoading ? (
          <div className="glass-card p-8 rounded-3xl text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-muted-foreground mt-4">Loading connections...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="glass-card p-8 rounded-3xl text-center space-y-4">
            <p className="text-muted-foreground">No members found yet.</p>
            <p className="text-sm text-muted-foreground">
              Be the first to join the community and create your profile!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member, index) => {
              const connected = isConnected(member.principal);
              const isCurrentUser = isSelf(member.principal);
              const isConnecting = connectMutation.isPending;

              return (
                <div key={index} className="glass-card p-6 rounded-3xl space-y-4 hover:scale-105 transition-transform">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <Avatar className="w-20 h-20">
                      <AvatarFallback className="text-4xl bg-gradient-to-br from-zen-lavender to-zen-blush">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold">{member.displayName}</h3>
                      {isCurrentUser && (
                        <p className="text-xs text-muted-foreground">(You)</p>
                      )}
                    </div>
                  </div>

                  {!isCurrentUser && (
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleConnect(member.principal)}
                        disabled={connected || isConnecting}
                        variant={connected ? "outline" : "default"}
                        className="w-full"
                        size="sm"
                      >
                        {connected ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Connected
                          </>
                        ) : isConnecting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Connect
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={() => handleStartConversation(member.principal)}
                        variant="outline"
                        className="w-full"
                        size="sm"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Start Conversation
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
