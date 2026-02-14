# Specification

## Summary
**Goal:** Polish key judging-flow UX by adding a Home quote, enabling circle entry, preventing Connections chat crashes, and ensuring Global Chat isn’t empty on fresh state.

**Planned changes:**
- Add a new motivational quote section (English) at the bottom of the Home page after “Your Journey Continues,” ensuring it renders consistently on mobile and desktop without disrupting existing layout.
- Update the Circles page so each circle’s primary action navigates to an in-app circle view screen (frontend-only), showing the circle name/topic and providing a clear way to return to the Circles list.
- Fix the Connections → Start Chat flow to prevent runtime errors by safely handling invalid/placeholder partner identifiers and ensuring ChatPage can render a safe “no chat selected / invalid partner” state with a user-friendly message.
- Seed Global Chat with multiple initial thoughts/experiences so a fresh state shows a non-empty feed, and update/remove empty-state copy to avoid “you are the first” phrasing (remove “Be the first to share”); keep all user-facing text in English.

**User-visible outcome:** Users see a motivational quote at the end of Home, can enter and view a circle screen from Circles, can start chats from Connections without crashes (with graceful handling of invalid chat targets), and Global Chat shows realistic seeded posts and no longer implies the user is the first poster.
