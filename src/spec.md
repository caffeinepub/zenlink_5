# Specification

## Summary
**Goal:** Fix the onboarding sequence to start with profile setup, add an MBTI known-vs-test decision step, auto-redirect to Home after MBTI completion, and update Home to center the user profile while providing navigation to all main app sections.

**Planned changes:**
- Update the authenticated LandingPage “Begin Your Journey” action to route into onboarding starting with profile setup (ProfileSetupGate) instead of going directly to the MBTI quiz.
- After profile setup saves, add an MBTI decision screen: let users choose between entering a known MBTI type or taking the existing MBTI test; only show quiz questions when “Take the MBTI test” is selected.
- Complete onboarding by automatically navigating to “/home” immediately after the MBTI step finishes (known type saved, quiz result saved, or skipped), with no extra required “Continue” screen.
- Update the Home screen layout to show the current user’s avatar and display name as the central, prominent element, including a reasonable loading/empty state while fetching profile data.
- Ensure Home includes navigation entries to all primary app routes/sections currently available (avoiding redundant duplicate Home entries), and verify each entry routes correctly.

**User-visible outcome:** Signed-in users who click “Begin Your Journey” complete profile setup, choose to enter or test MBTI, and are taken to Home automatically; on Home they see their avatar and name centered and can navigate to every main section from the Home screen.
