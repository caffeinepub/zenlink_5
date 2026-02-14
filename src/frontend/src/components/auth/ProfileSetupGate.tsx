import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSaveCallerUserProfile } from '../../hooks/useQueries';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import EmojiAvatarPicker from '../profile/EmojiAvatarPicker';
import TagMultiSelectWithOther from '../profile/TagMultiSelectWithOther';
import { PREDEFINED_INTERESTS, PREDEFINED_PERSPECTIVES } from '../../constants/profileOptions';
import type { UserProfile } from '../../backend';

export default function ProfileSetupGate() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [perspectives, setPerspectives] = useState<string[]>([]);
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName.trim() && avatar) {
      const profile: UserProfile = {
        displayName: displayName.trim(),
        interests,
        perspectives,
        communicationStyle: 'Listener',
        mbtiType: undefined,
        comfortMode: false,
        location: '',
        avatar,
      };
      saveProfile(profile, {
        onSuccess: () => {
          navigate({ to: '/mbti' });
        },
      });
    }
  };

  const canContinue = displayName.trim() && avatar;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="glass-card p-8 rounded-3xl max-w-2xl w-full space-y-6 zen-glow">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Welcome to ZenLink</h2>
          <p className="text-muted-foreground">Create your anonymous identity and share what matters to you</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="displayName">Anonymous Username</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Choose a username"
              className="glass-card"
              required
            />
          </div>

          <EmojiAvatarPicker
            selectedAvatar={avatar}
            onSelect={setAvatar}
            required
          />

          <div className="space-y-6 pt-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Help us connect you with like-minded people (optional)
              </p>
            </div>

            <TagMultiSelectWithOther
              label="What are you interested in?"
              predefinedOptions={PREDEFINED_INTERESTS}
              selectedValues={interests}
              onSelectionChange={setInterests}
              placeholder="Type your own interest..."
            />

            <TagMultiSelectWithOther
              label="How do you see the world?"
              predefinedOptions={PREDEFINED_PERSPECTIVES}
              selectedValues={perspectives}
              onSelectionChange={setPerspectives}
              placeholder="Type your own perspective..."
            />
          </div>

          <Button
            type="submit"
            disabled={isPending || !canContinue}
            className="btn-primary w-full py-3 rounded-full"
          >
            {isPending ? 'Saving...' : 'Continue'}
          </Button>
        </form>

        <div className="glass-card p-4 rounded-2xl text-center text-sm text-muted-foreground space-y-2">
          <p className="font-medium">Your identity is safe. Your emotions are respected.</p>
          <p className="text-xs">Join weekly debates, share moments, and grow together in a supportive community.</p>
        </div>
      </div>
    </div>
  );
}
