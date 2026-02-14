import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { ComfortModeProvider } from './components/comfort/ComfortModeProvider';
import ZenLayout from './components/layout/ZenLayout';
import ProfileSetupGate from './components/auth/ProfileSetupGate';

// Pages
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import MbtiQuizPage from './pages/MbtiQuizPage';
import WeeklyMomentsPage from './pages/WeeklyMomentsPage';
import WeeklyHighlightsPage from './pages/WeeklyHighlightsPage';
import DailyChallengesPage from './pages/DailyChallengesPage';
import GlobalChartPage from './pages/GlobalChartPage';
import EmotionalSafetyPage from './pages/EmotionalSafetyPage';
import DebateRoomsPage from './pages/DebateRoomsPage';
import CirclesPage from './pages/CirclesPage';
import CircleDetailPage from './pages/CircleDetailPage';
import MatchingPage from './pages/MatchingPage';
import ChatPage from './pages/ChatPage';
import GlobalChatPage from './pages/GlobalChatPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  if (isInitializing || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 rounded-3xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zen-lavender mx-auto" />
          <p className="text-muted-foreground mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return <LandingPage />;
  }

  const showProfileSetup = isFetched && userProfile === null;

  return (
    <>
      {showProfileSetup && <ProfileSetupGate />}
      {children}
    </>
  );
}

function LayoutWrapper() {
  return (
    <ZenLayout>
      <Outlet />
    </ZenLayout>
  );
}

const rootRoute = createRootRoute({
  component: LayoutWrapper,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  ),
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

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  ),
});

const mbtiQuizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mbti-quiz',
  component: () => (
    <ProtectedRoute>
      <MbtiQuizPage />
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

const globalChartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/global-chart',
  component: () => (
    <ProtectedRoute>
      <GlobalChartPage />
    </ProtectedRoute>
  ),
});

const safetyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/safety',
  component: EmotionalSafetyPage,
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

const circleDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/circles/$circleId',
  component: () => (
    <ProtectedRoute>
      <CircleDetailPage />
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

const globalChatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/global-chat',
  component: () => (
    <ProtectedRoute>
      <GlobalChatPage />
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  homeRoute,
  profileRoute,
  mbtiQuizRoute,
  momentsRoute,
  highlightsRoute,
  challengesRoute,
  globalChartRoute,
  safetyRoute,
  debatesRoute,
  circlesRoute,
  circleDetailRoute,
  matchingRoute,
  chatRoute,
  globalChatRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ComfortModeProvider>
        <RouterProvider router={router} />
      </ComfortModeProvider>
    </QueryClientProvider>
  );
}
