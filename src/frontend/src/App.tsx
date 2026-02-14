import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import MbtiQuizPage from './pages/MbtiQuizPage';
import ProfilePage from './pages/ProfilePage';
import MatchingPage from './pages/MatchingPage';
import ChatPage from './pages/ChatPage';
import GlobalChartPage from './pages/GlobalChartPage';
import DebateRoomsPage from './pages/DebateRoomsPage';
import CirclesPage from './pages/CirclesPage';
import WeeklyMomentsPage from './pages/WeeklyMomentsPage';
import WeeklyHighlightsPage from './pages/WeeklyHighlightsPage';
import DailyChallengesPage from './pages/DailyChallengesPage';
import EmotionalSafetyPage from './pages/EmotionalSafetyPage';
import ZenLayout from './components/layout/ZenLayout';
import ProfileSetupGate from './components/auth/ProfileSetupGate';
import { ComfortModeProvider } from './components/comfort/ComfortModeProvider';

function RootComponent() {
  return (
    <ComfortModeProvider>
      <ZenLayout>
        <Outlet />
      </ZenLayout>
    </ComfortModeProvider>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { identity, login, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  if (isInitializing || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="glass-card p-8 rounded-3xl max-w-md w-full text-center space-y-6">
          <h2 className="text-2xl font-semibold">Sign In Required</h2>
          <p className="text-muted-foreground">Please sign in to access this feature</p>
          <button
            onClick={login}
            className="btn-primary w-full py-3 rounded-full font-medium"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const showProfileSetup = isFetched && userProfile === null;

  if (showProfileSetup) {
    return <ProfileSetupGate />;
  }

  return <>{children}</>;
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: () => (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  ),
});

const mbtiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mbti',
  component: () => (
    <ProtectedRoute>
      <MbtiQuizPage />
    </ProtectedRoute>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  ),
});

const matchingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/matching',
  component: () => (
    <ProtectedRoute>
      <MatchingPage />
    </ProtectedRoute>
  ),
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat',
  component: () => (
    <ProtectedRoute>
      <ChatPage />
    </ProtectedRoute>
  ),
});

const globalChartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/global-chart',
  component: () => (
    <ProtectedRoute>
      <GlobalChartPage />
    </ProtectedRoute>
  ),
});

const debatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/debates',
  component: () => (
    <ProtectedRoute>
      <DebateRoomsPage />
    </ProtectedRoute>
  ),
});

const circlesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/circles',
  component: () => (
    <ProtectedRoute>
      <CirclesPage />
    </ProtectedRoute>
  ),
});

const momentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/moments',
  component: () => (
    <ProtectedRoute>
      <WeeklyMomentsPage />
    </ProtectedRoute>
  ),
});

const highlightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/highlights',
  component: () => (
    <ProtectedRoute>
      <WeeklyHighlightsPage />
    </ProtectedRoute>
  ),
});

const challengesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/challenges',
  component: () => (
    <ProtectedRoute>
      <DailyChallengesPage />
    </ProtectedRoute>
  ),
});

const safetyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/safety',
  component: EmotionalSafetyPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  homeRoute,
  mbtiRoute,
  profileRoute,
  matchingRoute,
  chatRoute,
  globalChartRoute,
  debatesRoute,
  circlesRoute,
  momentsRoute,
  highlightsRoute,
  challengesRoute,
  safetyRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
