import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Hand, Clock, Users } from 'lucide-react';

const mockRooms = [
  { id: 1, topic: 'The Future of AI and Human Connection', participants: 12, timeLeft: 45 },
  { id: 2, topic: 'Emotional Intelligence in Modern Society', participants: 8, timeLeft: 30 },
  { id: 3, topic: 'Personal Growth vs. Social Expectations', participants: 15, timeLeft: 20 },
];

export default function DebateRoomsPage() {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [handRaised, setHandRaised] = useState(false);

  const room = mockRooms.find(r => r.id === selectedRoom);

  if (selectedRoom && room) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="container mx-auto max-w-4xl space-y-6">
          <Button
            onClick={() => setSelectedRoom(null)}
            variant="ghost"
            className="mb-4"
          >
            ← Back to Rooms
          </Button>

          <div className="glass-card p-8 rounded-3xl space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-semibold">{room.topic}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {room.participants} participants
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {room.timeLeft} min left
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4">
              <h3 className="font-semibold">Respect Guidelines</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Listen actively and respectfully to all perspectives</li>
                <li>• Speak from personal experience, not assumptions</li>
                <li>• Avoid interrupting; use the raise hand feature</li>
                <li>• Focus on ideas, not personal attacks</li>
                <li>• Embrace diverse viewpoints as learning opportunities</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Raised Hands</h3>
              <div className="glass-card p-4 rounded-2xl">
                {handRaised ? (
                  <p className="text-sm text-muted-foreground">You have your hand raised</p>
                ) : (
                  <p className="text-sm text-muted-foreground">No hands raised currently</p>
                )}
              </div>
            </div>

            <Button
              onClick={() => setHandRaised(!handRaised)}
              className={handRaised ? 'btn-secondary w-full py-6 rounded-full' : 'btn-primary w-full py-6 rounded-full'}
            >
              <Hand className="w-5 h-5 mr-2" />
              {handRaised ? 'Lower Hand' : 'Raise Hand'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold">Live Debate Rooms</h1>
          <p className="text-muted-foreground">Join respectful discussions on meaningful topics</p>
        </div>

        <div className="space-y-4">
          {mockRooms.map((room) => (
            <div key={room.id} className="glass-card p-6 rounded-2xl hover:bg-card/60 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-lg">{room.topic}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {room.participants}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {room.timeLeft} min
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => setSelectedRoom(room.id)}
                  className="btn-primary rounded-full"
                >
                  Join
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
