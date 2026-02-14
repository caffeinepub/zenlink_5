import { useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { useComfortMode } from '../components/comfort/ComfortModeProvider';
import { Send, MoreVertical, Volume2, Ban, Flag, Pause, ArrowLeft, Loader2 } from 'lucide-react';
import { Principal } from '@dfinity/principal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { useGetConversation, useSendMessage, useGetAllUserProfiles } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function ChatPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { partner?: string };
  const [message, setMessage] = useState('');
  const { comfortMode, toggleComfortMode } = useComfortMode();
  const { identity } = useInternetIdentity();

  // Safely parse partner principal with error handling
  let partnerPrincipal: Principal | null = null;
  try {
    if (search.partner) {
      partnerPrincipal = Principal.fromText(search.partner);
    }
  } catch (error) {
    console.error('Invalid partner principal:', error);
    // partnerPrincipal remains null
  }
  
  const { data: messages = [], isLoading: messagesLoading } = useGetConversation(partnerPrincipal);
  const { data: allProfiles = [] } = useGetAllUserProfiles();
  const sendMessageMutation = useSendMessage();

  const profileMap = new Map(allProfiles.map(([principal, profile]) => [principal.toString(), profile]));
  const partnerProfile = partnerPrincipal ? profileMap.get(partnerPrincipal.toString()) : null;

  const handleSend = async () => {
    if (!message.trim() || !partnerPrincipal) return;

    try {
      await sendMessageMutation.mutateAsync({
        receiver: partnerPrincipal,
        content: message.trim(),
      });
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!partnerPrincipal) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-card p-8 rounded-3xl text-center space-y-4">
            <h2 className="text-2xl font-semibold">No Chat Selected</h2>
            <p className="text-muted-foreground">
              Please select a person from Connections to start chatting
            </p>
            <Button onClick={() => navigate({ to: '/matching' })} className="btn-primary rounded-full">
              Go to Connections
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="glass-card rounded-3xl overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
          {/* Header */}
          <div className="glass-card-strong p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate({ to: '/matching' })}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Avatar className="w-10 h-10">
                <AvatarFallback className="text-xl bg-gradient-to-br from-zen-lavender to-zen-blush">
                  {partnerProfile?.avatar || '👤'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{partnerProfile?.displayName || 'User'}</h2>
                <p className="text-sm text-muted-foreground">
                  {partnerProfile?.mbtiType || 'Unknown Type'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="comfort-mode"
                  checked={comfortMode}
                  onCheckedChange={toggleComfortMode}
                />
                <Label htmlFor="comfort-mode" className="text-sm">Comfort Mode</Label>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card">
                  <DropdownMenuItem>
                    <Volume2 className="w-4 h-4 mr-2" />
                    Mute
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Ban className="w-4 h-4 mr-2" />
                    Block
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause Conversation
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            {messagesLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => {
                  const isOwnMessage = identity && msg.sender.toString() === identity.getPrincipal().toString();
                  return (
                    <div
                      key={index}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-4 rounded-2xl ${
                          isOwnMessage
                            ? 'bg-gradient-to-br from-zen-lavender to-zen-blush text-white'
                            : 'glass-card'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p className={`text-xs mt-2 ${isOwnMessage ? 'text-white/70' : 'text-muted-foreground'}`}>
                          {formatTimestamp(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Message Input */}
          <div className="glass-card-strong p-4 border-t">
            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="glass-card resize-none"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button
                onClick={handleSend}
                disabled={!message.trim() || sendMessageMutation.isPending}
                className="btn-primary rounded-full self-end"
                size="icon"
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
