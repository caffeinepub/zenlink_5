import { useState } from 'react';
import { useGetTopMoments, useSubmitWeeklyMoment, useIncrementImpact } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Heart, Plus } from 'lucide-react';

export default function WeeklyMomentsPage() {
  const { data: moments, isLoading } = useGetTopMoments();
  const { mutate: submitMoment, isPending: isSubmitting } = useSubmitWeeklyMoment();
  const { mutate: incrementImpact } = useIncrementImpact();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Growth');

  const handleSubmit = () => {
    if (content.trim()) {
      submitMoment(
        { content, category },
        {
          onSuccess: () => {
            setOpen(false);
            setContent('');
            setCategory('Growth');
          },
        }
      );
    }
  };

  const handleImpact = (momentId: bigint) => {
    incrementImpact(momentId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading moments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-semibold">Weekly Moments</h1>
            <p className="text-muted-foreground">Share one meaningful moment each week</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary rounded-full">
                <Plus className="w-5 h-5 mr-2" />
                Share Moment
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card">
              <DialogHeader>
                <DialogTitle>Share Your Weekly Moment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="content">Your Moment</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share a problem solved, lesson learned, or kind act done..."
                    className="glass-card min-h-[120px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="glass-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Growth">Growth</SelectItem>
                      <SelectItem value="Helpful">Helpful</SelectItem>
                      <SelectItem value="Supportive">Supportive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !content.trim()}
                  className="btn-primary w-full rounded-full"
                >
                  {isSubmitting ? 'Sharing...' : 'Share Moment'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {moments && moments.length > 0 ? (
            moments.map((moment, index) => (
              <div key={index} className="glass-card p-6 rounded-2xl space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="glass-card px-3 py-1 rounded-full text-sm">{moment.category}</span>
                    </div>
                    <p className="text-lg">{moment.content}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(Number(moment.timestamp) / 1000000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Heart className="w-5 h-5" />
                    <span className="font-semibold">{Number(moment.impactCount)} Impact</span>
                  </div>
                  <Button
                    onClick={() => handleImpact(BigInt(index))}
                    variant="ghost"
                    size="sm"
                    className="text-zen-blush hover:text-zen-blush"
                  >
                    Add Impact
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-card p-12 rounded-2xl text-center">
              <p className="text-muted-foreground">No moments shared yet. Be the first!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
