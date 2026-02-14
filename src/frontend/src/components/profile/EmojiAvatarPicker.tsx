import { ALLOWED_AVATARS } from '../../constants/allowedAvatars';

interface EmojiAvatarPickerProps {
  selectedAvatar?: string;
  onSelect: (avatar: string) => void;
  required?: boolean;
}

export default function EmojiAvatarPicker({ selectedAvatar, onSelect, required = false }: EmojiAvatarPickerProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">
          Avatar {required && <span className="text-destructive">*</span>}
        </label>
        {!selectedAvatar && required && (
          <span className="text-xs text-muted-foreground">(Please select one)</span>
        )}
      </div>
      <div className="grid grid-cols-6 sm:grid-cols-7 gap-2">
        {ALLOWED_AVATARS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onSelect(emoji)}
            className={`
              aspect-square rounded-xl text-3xl sm:text-4xl
              transition-all duration-200
              hover:scale-110 hover:shadow-lg
              ${
                selectedAvatar === emoji
                  ? 'bg-zen-lavender/30 ring-2 ring-zen-lavender scale-105 shadow-lg'
                  : 'glass-card hover:bg-zen-sky/20'
              }
            `}
            aria-label={`Select ${emoji} avatar`}
            aria-pressed={selectedAvatar === emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
