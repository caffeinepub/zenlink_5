import { useGetDailyChallenges, useCompleteDailyChallenge } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { CheckCircle2, Circle, Flame } from 'lucide-react';

const defaultChallenges = [
  { id: BigInt(1), description: 'Listen without interrupting today.', streak: BigInt(0) },
  { id: BigInt(2), description: 'Ask one meaningful question.', streak: BigInt(0) },
  { id: BigInt(3), description: 'Share something you learned from failure.', streak: BigInt(0) },
];

export default function DailyChallengesPage() {
  const { data: challenges, isLoading } = useGetDailyChallenges();
  const { mutate: completeChallenge } = useCompleteDailyChallenge();

  const displayChallenges = challenges && challenges.length > 0 ? challenges : defaultChallenges;
  const maxStreak = displayChallenges.reduce((max, c) => Math.max(max, Number(c.streak)), 0);

  const handleComplete = (challengeId: bigint) => {
    completeChallenge(challengeId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold">Daily Emotional Growth Challenges</h1>
          <p className="text-muted-foreground">Small steps toward meaningful growth</p>
        </div>

        <div className="glass-card p-8 rounded-3xl text-center space-y-4">
          <Flame className="w-16 h-16 mx-auto text-zen-peach" />
          <div>
            <div className="text-4xl font-bold text-zen-peach">{maxStreak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </div>
          <p className="text-sm text-muted-foreground">Keep growing, one day at a time</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Today's Challenges</h2>
          {displayChallenges.map((challenge) => (
            <div key={Number(challenge.id)} className="glass-card p-6 rounded-2xl flex items-start gap-4">
              <button
                onClick={() => handleComplete(challenge.id)}
                className="mt-1 text-zen-lavender hover:text-zen-blush transition-colors"
              >
                {Number(challenge.streak) > 0 ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </button>
              <div className="flex-1">
                <p className="text-lg">{challenge.description}</p>
                {Number(challenge.streak) > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {Number(challenge.streak)} day streak
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card p-6 rounded-2xl text-center text-sm text-muted-foreground">
          <p>Remember: This is about personal growth, not competition. Every step counts.</p>
        </div>
      </div>
    </div>
  );
}
