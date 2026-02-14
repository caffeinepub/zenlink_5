import { useNavigate, useParams } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { ArrowLeft, Users, MessageCircle } from 'lucide-react';
import { mockCircles } from '../data/mockCircles';

export default function CircleDetailPage() {
  const navigate = useNavigate();
  const { circleId } = useParams({ strict: false }) as { circleId: string };
  
  const circle = mockCircles.find((c) => c.id === circleId);

  if (!circle) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-card p-8 rounded-3xl text-center space-y-4">
            <h2 className="text-2xl font-semibold">Circle Not Found</h2>
            <p className="text-muted-foreground">
              The circle you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate({ to: '/circles' })} className="btn-primary rounded-full">
              Back to Circles
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/circles' })}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Circles
        </Button>

        <div className="glass-card p-8 rounded-3xl space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zen-lavender to-zen-blush bg-clip-text text-transparent">
                  {circle.name}
                </h1>
                <p className="text-lg text-muted-foreground">{circle.topic}</p>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-5 h-5" />
                <span className="text-lg font-semibold">{circle.members}/{circle.maxMembers}</span>
              </div>
            </div>

            <div className="glass-card-strong p-6 rounded-2xl space-y-4">
              <h3 className="font-semibold text-lg">About This Circle</h3>
              <p className="text-muted-foreground leading-relaxed">
                This is a safe, intimate space for {circle.members} members to connect deeply around {circle.topic.toLowerCase()}.
                Share experiences, support each other, and grow together in a trusted environment.
              </p>
            </div>

            <div className="glass-card-strong p-6 rounded-2xl space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Circle Chat
              </h3>
              <p className="text-muted-foreground">
                Connect with circle members through private group conversations.
              </p>
              <Button className="btn-primary w-full rounded-full">
                Open Circle Chat
              </Button>
            </div>

            <div className="glass-card-strong p-6 rounded-2xl space-y-4">
              <h3 className="font-semibold text-lg">Circle Guidelines</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Respect everyone's privacy and confidentiality</li>
                <li>• Listen actively and speak from your own experience</li>
                <li>• Create a judgment-free space for vulnerability</li>
                <li>• Support each other's growth and healing journey</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
