import { Shield, MessageCircle, Heart, AlertCircle } from 'lucide-react';

export default function EmotionalSafetyPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <Shield className="w-16 h-16 mx-auto text-zen-lavender" />
          <h1 className="text-3xl md:text-4xl font-semibold">AI-Guided Emotional Safety</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            ZenLink provides gentle, supportive guidance to help maintain respectful and emotionally safe conversations
          </p>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 rounded-3xl space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zen-lavender/20 to-zen-blush/20 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-zen-lavender" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Message Reflection</h3>
                <p className="text-muted-foreground">
                  Before sending, you may receive gentle suggestions to rephrase messages for clarity and kindness. 
                  This helps ensure your message conveys your true intent.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zen-sky/20 to-zen-lavender/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-zen-sky" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Toxicity Prevention</h3>
                <p className="text-muted-foreground">
                  Our system provides subtle cues when potentially harmful language is detected, helping maintain 
                  a respectful environment for everyone.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zen-blush/20 to-zen-peach/20 flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-zen-blush" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Emotional Distress Support</h3>
                <p className="text-muted-foreground">
                  If signs of distress are detected, you'll receive supportive prompts and the option to pause 
                  the conversation and take a moment for yourself.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="font-semibold">Your Control</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• All guidance is optional and non-intrusive</li>
              <li>• You always have final say in what you send</li>
              <li>• Use Comfort Mode to reduce notification intensity</li>
              <li>• Block, mute, or report features are always available</li>
              <li>• Your privacy and autonomy are always respected</li>
            </ul>
          </div>

          <div className="glass-card p-6 rounded-2xl text-center">
            <p className="text-sm text-muted-foreground">
              ZenLink's emotional safety features are designed to support, not control. 
              We believe in empowering you to have meaningful, respectful conversations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
