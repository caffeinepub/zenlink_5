import { useState, useMemo } from 'react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Send, Loader2 } from 'lucide-react';
import { useGetGlobalChatFeed, usePostGlobalMessage, useGetAllUserProfiles } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { globalChatSeed } from '../data/globalChatSeed';

const PERSPECTIVES = [
  'Growth',
  'Confidence',
  'Anxiety',
  'Support',
  'Gratitude',
  'Reflection',
  'Challenge',
  'Joy',
  'Uncertainty',
  'Hope',
];

export default function GlobalChatPage() {
  const [content, setContent] = useState('');
  const [perspective, setPerspective] = useState('');
  const { identity } = useInternetIdentity();
  
  const { data: backendMessages = [], isLoading: messagesLoading } = useGetGlobalChatFeed();
  const { data: allProfiles = [] } = useGetAllUserProfiles();
  const postMessage = usePostGlobalMessage();

  const profileMap = new Map(allProfiles.map(([principal, profile]) => [principal.toString(), profile]));

  // Merge backend messages with seed data when backend is empty
  const displayMessages = useMemo(() => {
    if (backendMessages.length > 0) {
      return backendMessages.map((msg) => ({
        type: 'backend' as const,
        message: msg,
      }));
    }
    
    // Show seed messages when backend is empty
    const now = Date.now();
    return globalChatSeed.map((seed) => ({
      type: 'seed' as const,
      seed,
      timestamp: BigInt((now - seed.hoursAgo * 3600000) * 1000000),
    }));
  }, [backendMessages]);

  const handleSubmit = async () => {
    if (!content.trim() || !perspective) return;

    try {
      await postMessage.mutateAsync({ content: content.trim(), perspective });
      setContent('');
      setPerspective('');
    } catch (error) {
      console.error('Failed to post message:', error);
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const canSubmit = content.trim() && perspective && !postMessage.isPending;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zen-lavender to-zen-blush bg-clip-text text-transparent">
            Global Chat
          </h1>
          <p className="text-muted-foreground">
            Share your thoughts and feelings with the community
          </p>
        </div>

        {/* Post Composer */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="space-y-2">
            <Label htmlFor="perspective">Select Perspective</Label>
            <Select value={perspective} onValueChange={setPerspective}>
              <SelectTrigger id="perspective" className="glass-card">
                <SelectValue placeholder="Choose a perspective..." />
              </SelectTrigger>
              <SelectContent className="glass-card">
                {PERSPECTIVES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Your Message</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts or feelings..."
              className="glass-card min-h-[120px] resize-none"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right">
              {content.length}/500
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="btn-primary w-full rounded-full"
          >
            {postMessage.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Post to Global Chat
              </>
            )}
          </Button>
        </div>

        {/* Feed */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Community Feed</h2>
          
          {messagesLoading ? (
            <div className="glass-card p-8 rounded-3xl text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-4">Loading messages...</p>
            </div>
          ) : displayMessages.length === 0 ? (
            <div className="glass-card p-8 rounded-3xl text-center">
              <p className="text-muted-foreground">Share your thoughts with the community!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayMessages.map((item, index) => {
                if (item.type === 'backend') {
                  const message = item.message;
                  const authorProfile = profileMap.get(message.sender.toString());
                  const isOwnMessage = identity && message.sender.toString() === identity.getPrincipal().toString();

                  return (
                    <div key={`backend-${index}`} className="glass-card p-6 rounded-3xl space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="text-xl bg-gradient-to-br from-zen-lavender to-zen-blush">
                              {authorProfile?.avatar || '👤'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">
                              {authorProfile?.displayName || 'Anonymous'}
                              {isOwnMessage && (
                                <span className="text-xs text-muted-foreground ml-2">(You)</span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatTimestamp(message.timestamp)}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="glass-card">
                          {message.perspective}
                        </Badge>
                      </div>
                      <p className="text-foreground leading-relaxed">{message.content}</p>
                    </div>
                  );
                } else {
                  // Seed message
                  const seed = item.seed!;
                  return (
                    <div key={`seed-${index}`} className="glass-card p-6 rounded-3xl space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="text-xl bg-gradient-to-br from-zen-lavender to-zen-blush">
                              {seed.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{seed.displayName}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatTimestamp(item.timestamp!)}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="glass-card">
                          {seed.perspective}
                        </Badge>
                      </div>
                      <p className="text-foreground leading-relaxed">{seed.content}</p>
                    </div>
                  );
                }
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
