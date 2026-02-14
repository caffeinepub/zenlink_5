import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { useComfortMode } from '../components/comfort/ComfortModeProvider';
import { Send, MoreVertical, Volume2, Ban, Flag, Pause } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const { comfortMode, toggleComfortMode } = useComfortMode();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Alex', content: 'Hi! How are you doing today?', timestamp: new Date() },
    { id: 2, sender: 'You', content: 'I\'m doing well, thanks for asking!', timestamp: new Date() },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, sender: 'You', content: message, timestamp: new Date() },
      ]);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="glass-card rounded-3xl overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
          {/* Header */}
          <div className="glass-card-strong p-4 border-b flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Alex</h2>
              <p className="text-sm text-muted-foreground">Talk Mode • INFJ</p>
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
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-4 rounded-2xl ${
                    msg.sender === 'You'
                      ? 'bg-gradient-to-r from-zen-lavender/30 to-zen-blush/30 glass-card'
                      : 'glass-card'
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="glass-card-strong p-4 border-t">
            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder="Type your message..."
                className="glass-card resize-none"
                rows={2}
              />
              <Button onClick={handleSend} className="btn-primary rounded-full px-6">
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
