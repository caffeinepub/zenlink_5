import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { useOnboardingCompletionMessage } from '../hooks/useOnboardingCompletionMessage';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const questions = [
  {
    id: 1,
    question: 'At a party, you tend to:',
    options: [
      { value: 'E', label: 'Interact with many people' },
      { value: 'I', label: 'Interact with a few close friends' },
    ],
  },
  {
    id: 2,
    question: 'You prefer to focus on:',
    options: [
      { value: 'S', label: 'Facts and details' },
      { value: 'N', label: 'Ideas and possibilities' },
    ],
  },
  {
    id: 3,
    question: 'When making decisions, you rely more on:',
    options: [
      { value: 'T', label: 'Logic and analysis' },
      { value: 'F', label: 'Personal values and feelings' },
    ],
  },
  {
    id: 4,
    question: 'You prefer to:',
    options: [
      { value: 'J', label: 'Have things decided and organized' },
      { value: 'P', label: 'Stay open to new options' },
    ],
  },
  {
    id: 5,
    question: 'You get energy from:',
    options: [
      { value: 'E', label: 'Being around others' },
      { value: 'I', label: 'Spending time alone' },
    ],
  },
  {
    id: 6,
    question: 'You are more interested in:',
    options: [
      { value: 'S', label: 'What is actual and real' },
      { value: 'N', label: 'What is possible and imaginative' },
    ],
  },
  {
    id: 7,
    question: 'You tend to be:',
    options: [
      { value: 'T', label: 'Objective and fair' },
      { value: 'F', label: 'Empathetic and compassionate' },
    ],
  },
  {
    id: 8,
    question: 'You prefer:',
    options: [
      { value: 'J', label: 'Structure and planning' },
      { value: 'P', label: 'Flexibility and spontaneity' },
    ],
  },
];

const mbtiTypes = [
  'ENFP', 'INFJ', 'ENTJ', 'INTJ',
  'ENFJ', 'INFP', 'ENTP', 'INTP',
  'ESFP', 'ISFP', 'ESTP', 'ISTP',
  'ESFJ', 'ISFJ', 'ESTJ', 'ISTJ',
];

const mbtiDescriptions: Record<string, { title: string; description: string }> = {
  ENFP: { title: 'The Inspirer', description: 'Enthusiastic, creative, and sociable free spirits who can always find a reason to smile.' },
  INFJ: { title: 'The Advocate', description: 'Quiet and mystical, yet very inspiring and tireless idealists.' },
  ENTJ: { title: 'The Commander', description: 'Bold, imaginative, and strong-willed leaders who always find a way.' },
  INTJ: { title: 'The Architect', description: 'Imaginative and strategic thinkers with a plan for everything.' },
  ENFJ: { title: 'The Protagonist', description: 'Charismatic and inspiring leaders who are able to mesmerize their listeners.' },
  INFP: { title: 'The Mediator', description: 'Poetic, kind, and altruistic people, always eager to help a good cause.' },
  ENTP: { title: 'The Debater', description: 'Smart and curious thinkers who cannot resist an intellectual challenge.' },
  INTP: { title: 'The Logician', description: 'Innovative inventors with an unquenchable thirst for knowledge.' },
  ESFP: { title: 'The Entertainer', description: 'Spontaneous, energetic, and enthusiastic people who love life and people.' },
  ISFP: { title: 'The Adventurer', description: 'Flexible and charming artists, always ready to explore and experience something new.' },
  ESTP: { title: 'The Entrepreneur', description: 'Smart, energetic, and very perceptive people who truly enjoy living on the edge.' },
  ISTP: { title: 'The Virtuoso', description: 'Bold and practical experimenters, masters of all kinds of tools.' },
  ESFJ: { title: 'The Consul', description: 'Extraordinarily caring, social, and popular people, always eager to help.' },
  ISFJ: { title: 'The Defender', description: 'Very dedicated and warm protectors, always ready to defend their loved ones.' },
  ESTJ: { title: 'The Executive', description: 'Excellent administrators, unsurpassed at managing things or people.' },
  ISTJ: { title: 'The Logistician', description: 'Practical and fact-minded individuals whose reliability cannot be doubted.' },
};

type MbtiStep = 'decision' | 'known-type' | 'quiz' | 'results';

export default function MbtiQuizPage() {
  const navigate = useNavigate();
  const { setCompletionMessage } = useOnboardingCompletionMessage();
  const { data: userProfile } = useGetCallerUserProfile();
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();
  const [step, setStep] = useState<MbtiStep>('decision');
  const [knownType, setKnownType] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [mbtiType, setMbtiType] = useState('');

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Auto-redirect after saving with completion message
  useEffect(() => {
    if (step === 'results' && mbtiType) {
      const timer = setTimeout(() => {
        setCompletionMessage('Profile completed successfully! Explore Connections, Weekly Debates, and Weekly Highlights to get started.');
        navigate({ to: '/home' });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, mbtiType, navigate, setCompletionMessage]);

  const handleDecision = (choice: 'know' | 'test') => {
    if (choice === 'know') {
      setStep('known-type');
    } else {
      setStep('quiz');
    }
  };

  const handleKnownTypeSubmit = () => {
    if (knownType && userProfile) {
      setMbtiType(knownType);
      saveProfile(
        {
          ...userProfile,
          mbtiType: knownType,
        },
        {
          onSuccess: () => {
            setStep('results');
          },
        }
      );
    }
  };

  const handleSkipKnownType = () => {
    setCompletionMessage('Profile saved successfully! Explore Connections, Weekly Debates, and Weekly Highlights to get started.');
    navigate({ to: '/home' });
  };

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateMbti();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateMbti = () => {
    const counts: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    Object.values(answers).forEach(answer => {
      counts[answer] = (counts[answer] || 0) + 1;
    });

    const type = [
      counts.E >= counts.I ? 'E' : 'I',
      counts.S >= counts.N ? 'S' : 'N',
      counts.T >= counts.F ? 'T' : 'F',
      counts.J >= counts.P ? 'J' : 'P',
    ].join('');

    setMbtiType(type);
    if (userProfile) {
      saveProfile(
        {
          ...userProfile,
          mbtiType: type,
        },
        {
          onSuccess: () => {
            setStep('results');
          },
        }
      );
    }
  };

  const handleSkipQuiz = () => {
    setCompletionMessage('Profile saved successfully! Explore Connections, Weekly Debates, and Weekly Highlights to get started.');
    navigate({ to: '/home' });
  };

  // Decision step
  if (step === 'decision') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="glass-card p-8 md:p-12 rounded-3xl max-w-2xl w-full space-y-8 zen-glow">
          <div className="text-center space-y-4">
            <Sparkles className="w-16 h-16 mx-auto text-zen-lavender" />
            <h2 className="text-3xl md:text-4xl font-semibold">Discover Your Personality</h2>
            <p className="text-lg text-muted-foreground">
              Understanding your MBTI type helps us connect you with compatible people
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => handleDecision('know')}
              className="btn-primary w-full py-6 text-lg rounded-full"
            >
              I know my MBTI type
            </Button>
            <Button
              onClick={() => handleDecision('test')}
              variant="outline"
              className="w-full py-6 text-lg rounded-full glass-card"
            >
              Take the MBTI test
            </Button>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                setCompletionMessage('Profile saved successfully! Explore Connections, Weekly Debates, and Weekly Highlights to get started.');
                navigate({ to: '/home' });
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Known type selection step
  if (step === 'known-type') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="glass-card p-8 md:p-12 rounded-3xl max-w-2xl w-full space-y-8 zen-glow">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold">Select Your MBTI Type</h2>
            <p className="text-lg text-muted-foreground">
              Choose your personality type from the list below
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="mbti-select">MBTI Type</Label>
              <Select value={knownType} onValueChange={setKnownType}>
                <SelectTrigger id="mbti-select" className="glass-card w-full py-6 text-lg">
                  <SelectValue placeholder="Select your MBTI type" />
                </SelectTrigger>
                <SelectContent>
                  {mbtiTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-lg py-3">
                      {type} - {mbtiDescriptions[type]?.title || 'Unique'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {knownType && mbtiDescriptions[knownType] && (
              <div className="glass-card p-6 rounded-2xl space-y-2">
                <h3 className="font-semibold text-lg">
                  {knownType} - {mbtiDescriptions[knownType].title}
                </h3>
                <p className="text-muted-foreground">{mbtiDescriptions[knownType].description}</p>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                onClick={handleKnownTypeSubmit}
                disabled={!knownType || isPending}
                className="btn-primary flex-1 py-6 text-lg rounded-full"
              >
                {isPending ? 'Saving...' : 'Continue'}
              </Button>
              <Button
                onClick={handleSkipKnownType}
                variant="outline"
                className="glass-card px-8 py-6 text-lg rounded-full"
              >
                Skip
              </Button>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setStep('decision')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results step with auto-redirect
  if (step === 'results') {
    const description = mbtiDescriptions[mbtiType] || { title: 'Unique', description: 'A wonderful individual with a unique personality.' };

    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="glass-card p-8 md:p-12 rounded-3xl max-w-2xl w-full space-y-8 zen-glow pulse-glow text-center">
          <CheckCircle2 className="w-20 h-20 mx-auto text-zen-lavender" />
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold">
              You are an <span className="text-zen-blush">{mbtiType}</span> – {description.title}
            </h2>
            <p className="text-lg text-muted-foreground">{description.description}</p>
          </div>
          <p className="text-muted-foreground">Profile completed successfully! Taking you to your home page...</p>
        </div>
      </div>
    );
  }

  // Quiz step
  const currentQ = questions[currentQuestion];
  const hasAnswer = answers[currentQuestion] !== undefined;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="glass-card p-8 md:p-12 rounded-3xl max-w-2xl w-full space-y-8 zen-glow">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-center">{currentQ.question}</h2>

          <RadioGroup value={answers[currentQuestion]} onValueChange={handleAnswer}>
            <div className="space-y-4">
              {currentQ.options.map((option) => (
                <div
                  key={option.value}
                  className={`glass-card p-6 rounded-2xl cursor-pointer transition-all hover:scale-102 ${
                    answers[currentQuestion] === option.value ? 'ring-2 ring-zen-lavender zen-glow' : ''
                  }`}
                  onClick={() => handleAnswer(option.value)}
                >
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value={option.value} id={`q${currentQ.id}-${option.value}`} />
                    <Label
                      htmlFor={`q${currentQ.id}-${option.value}`}
                      className="flex-1 cursor-pointer text-lg"
                    >
                      {option.label}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="glass-card px-8 py-3 rounded-full"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!hasAnswer || isPending}
            className="btn-primary flex-1 py-3 rounded-full"
          >
            {isPending ? 'Saving...' : currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>

        <div className="text-center">
          <button
            onClick={handleSkipQuiz}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip quiz
          </button>
        </div>
      </div>
    </div>
  );
}
