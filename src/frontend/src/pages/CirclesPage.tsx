import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Users, Plus } from 'lucide-react';
import { mockCircles } from '../data/mockCircles';

export default function CirclesPage() {
  const navigate = useNavigate();
  const [circleName, setCircleName] = useState('');
  const [circleTopic, setCircleTopic] = useState('Growth');
  const [open, setOpen] = useState(false);

  const handleCreateCircle = () => {
    // In real app, this would call backend
    console.log('Creating circle:', { circleName, circleTopic });
    setOpen(false);
    setCircleName('');
    setCircleTopic('Growth');
  };

  const handleViewCircle = (circleId: string) => {
    navigate({ to: '/circles/$circleId', params: { circleId } });
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-semibold">Private Circles</h1>
            <p className="text-muted-foreground">Small, intimate groups for deeper connection</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary rounded-full">
                <Plus className="w-5 h-5 mr-2" />
                Create Circle
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card">
              <DialogHeader>
                <DialogTitle>Create a New Circle</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="circleName">Circle Name</Label>
                  <Input
                    id="circleName"
                    value={circleName}
                    onChange={(e) => setCircleName(e.target.value)}
                    placeholder="Enter circle name"
                    className="glass-card"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="circleTopic">Topic</Label>
                  <Select value={circleTopic} onValueChange={setCircleTopic}>
                    <SelectTrigger className="glass-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Growth">Growth</SelectItem>
                      <SelectItem value="Healing">Healing</SelectItem>
                      <SelectItem value="Career">Career</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleCreateCircle}
                  disabled={!circleName.trim()}
                  className="btn-primary w-full rounded-full"
                >
                  Create Circle
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {mockCircles.map((circle) => (
            <div key={circle.id} className="glass-card-strong p-6 rounded-2xl space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{circle.name}</h3>
                  <p className="text-sm text-muted-foreground">{circle.topic}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{circle.members}/{circle.maxMembers}</span>
                </div>
              </div>
              <Button 
                onClick={() => handleViewCircle(circle.id)}
                className="btn-secondary w-full rounded-full"
              >
                View Circle
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
