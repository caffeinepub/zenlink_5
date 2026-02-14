import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import EmojiAvatarPicker from '../components/profile/EmojiAvatarPicker';
import TagMultiSelectWithOther from '../components/profile/TagMultiSelectWithOther';
import { PREDEFINED_INTERESTS, PREDEFINED_PERSPECTIVES } from '../constants/profileOptions';
import type { UserProfile } from '../backend';

export default function ProfilePage() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [communicationStyle, setCommunicationStyle] = useState('Listener');
  const [location, setLocation] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [perspectives, setPerspectives] = useState<string[]>([]);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName);
      setAvatar(userProfile.avatar || '');
      setCommunicationStyle(userProfile.communicationStyle);
      setLocation(userProfile.location);
      setInterests(userProfile.interests);
      setPerspectives(userProfile.perspectives);
    }
  }, [userProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userProfile && avatar) {
      const updatedProfile: UserProfile = {
        ...userProfile,
        displayName,
        avatar,
        communicationStyle,
        location,
        interests,
        perspectives,
      };
      saveProfile(updatedProfile);
    }
  };

  const canSave = displayName.trim() && avatar;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="glass-card p-8 md:p-12 rounded-3xl space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-semibold">Your Profile</h1>
            <p className="text-muted-foreground">Personalize your ZenLink experience</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="displayName">Anonymous Username</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="glass-card"
                required
              />
            </div>

            <EmojiAvatarPicker
              selectedAvatar={avatar}
              onSelect={setAvatar}
              required
            />

            {!avatar && (
              <div className="glass-card p-3 rounded-2xl text-sm text-destructive text-center">
                Please select an avatar to continue
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="communicationStyle">Communication Style</Label>
              <Select value={communicationStyle} onValueChange={setCommunicationStyle}>
                <SelectTrigger className="glass-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Listener">Listener</SelectItem>
                  <SelectItem value="Advisor">Advisor</SelectItem>
                  <SelectItem value="Deep Thinker">Deep Thinker</SelectItem>
                  <SelectItem value="Expressive">Expressive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., New York, USA"
                className="glass-card"
              />
            </div>

            {userProfile?.mbtiType && (
              <div className="glass-card p-4 rounded-2xl">
                <Label>Personality Type</Label>
                <p className="text-2xl font-semibold text-zen-blush mt-2">{userProfile.mbtiType}</p>
              </div>
            )}

            <TagMultiSelectWithOther
              label="Interests"
              predefinedOptions={PREDEFINED_INTERESTS}
              selectedValues={interests}
              onSelectionChange={setInterests}
              placeholder="Type your own interest..."
            />

            <TagMultiSelectWithOther
              label="Perspectives"
              predefinedOptions={PREDEFINED_PERSPECTIVES}
              selectedValues={perspectives}
              onSelectionChange={setPerspectives}
              placeholder="Type your own perspective..."
            />

            <Button 
              type="submit" 
              disabled={isPending || !canSave} 
              className="btn-primary w-full py-6 rounded-full text-lg"
            >
              {isPending ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
