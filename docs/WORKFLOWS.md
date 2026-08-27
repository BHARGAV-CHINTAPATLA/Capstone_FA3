# MindMingle Workflows

This document is a visual map of the current codebase. Arrows show the normal direction of control or data. Protected API calls include the JWT created during authentication.

## 1. System At A Glance

```mermaid
graph LR
    Browser[Browser]
    Client[React client]
    API[Axios API client]
    Express[Express app]
    Routes[Feature routes]
    Services[Feature services]
    Models[Mongoose models]
    Mongo[(MongoDB)]
    Push[Web Push service]
    SW[public/sw.js]
    Notification[Browser notification]

    Browser --> Client
    Client --> API
    API -->|HTTP + Bearer JWT| Express
    Express --> Routes
    Routes --> Services
    Services --> Models
    Models --> Mongo
    Services --> Push
    Push --> SW
    SW --> Notification
```

## 2. Application Startup

```mermaid
sequenceDiagram
    participant Node as server/server.js
    participant DB as connection.js
    participant Seed as seedMindfulnessExercises
    participant App as src/app.js
    participant Push as webpush.js
    participant Scheduler as reminderScheduler.js
    participant HTTP as Express HTTP server

    Node->>DB: connectDB()
    DB-->>Node: MongoDB connection
    Node->>Seed: seed missing mindfulness exercises
    Seed-->>Node: database ready
    Node->>App: configure Web Push VAPID keys
    Node->>Push: configureWebPush()
    Node->>Scheduler: startReminderScheduler()
    Scheduler-->>Node: cron runs every minute
    Node->>HTTP: app.listen(PORT)
```

## 3. Authentication And Protected Requests

```mermaid
sequenceDiagram
    participant User
    participant Page as Login or SignUp
    participant API as client/src/api/index.js
    participant Auth as auth.routes.js
    participant Service as authService.js
    participant DB as MongoDB
    participant Context as AuthContext.jsx
    participant Protected as ProtectedRoute.jsx

    User->>Page: Submit credentials or OAuth token
    Page->>API: POST /auth/login, /signup, /google, or /facebook
    API->>Auth: HTTP request
    Auth->>Service: Validate and authenticate
    Service->>DB: Find or create user
    Service-->>Auth: JWT with user id
    Auth-->>API: JWT response
    API-->>Context: Store token in localStorage
    Context-->>Protected: Authentication state
    Protected-->>User: Render protected page

    Page->>API: Later protected API call
    API->>API: Attach Authorization: Bearer JWT
    API->>Protected: Server request
    Protected->>DB: authenticateJWT reloads user
    DB-->>Protected: req.user
```

If a protected request returns `401`, the Axios response interceptor removes the token and redirects to `/login`.

## 4. Frontend Navigation

```mermaid
flowchart TD
    Start[Open application] --> Auth{JWT present?}
    Auth -->|No| Login[/login]
    Auth -->|Yes| Dashboard[/dashboard]
    Login -->|Successful login/signup| Dashboard

    Dashboard --> Mood[/mood-tracker]
    Dashboard --> Mindfulness[/mindfulness]
    Dashboard --> Goals[/goals]
    Dashboard --> Reminders[/reminders]
    Dashboard --> Peers[/peer-support]
    Dashboard --> Chat[/chat]

    Mindfulness -->|Remind exercise| Reminders
    Peers -->|Select peer| Chat
    Chat -->|chatId and peer query params| Chat
    Navbar[Navbar] --> Dashboard
    Navbar --> Mood
    Navbar --> Mindfulness
    Navbar --> Goals
    Navbar --> Reminders
    Navbar --> Peers
    Navbar --> Chat
    Navbar --> Bell[ReminderBell dropdown]
    Bell -->|Manage| Reminders
```

## 5. Reminder Creation And Bell Dropdown

```mermaid
sequenceDiagram
    participant User
    participant Page as Reminders.jsx
    participant Form as ReminderForm.jsx
    participant API as Axios API client
    participant Route as reminder.routes.js
    participant Service as reminderService.js
    participant DB as MongoDB
    participant Bell as ReminderBell.jsx

    User->>Form: Enter exercise, frequency, and time
    Form->>Page: Submit reminder
    Page->>API: POST /reminders
    API->>Route: Authenticated request
    Route->>Service: Create reminder for req.user
    Service->>DB: Save reminder
    DB-->>Service: Saved reminder
    Service-->>Page: Success
    Page->>API: GET /reminders
    API-->>Page: Current reminders
    Page->>Bell: Dispatch reminders-updated event
    Bell->>API: GET /reminders
    API-->>Bell: Current reminders
    User->>Bell: Click bell icon
    Bell-->>User: Count and grouped dropdown
```

The bell groups reminders in this display order:

```mermaid
flowchart LR
    All[All reminders] --> Daily[Daily]
    All --> Monthly[Monthly]
    All --> Weekly[Weekly]
    Daily --> SortDaily[Latest time first]
    Monthly --> SortMonthly[Latest time first]
    Weekly --> SortWeekly[Latest time first]
```

The reminders page itself displays all reminders in descending time order.

## 6. Scheduled Reminder Notifications

```mermaid
sequenceDiagram
    participant Cron as reminderScheduler.js
    participant DB as MongoDB
    participant Service as reminderService.js
    participant Push as Web Push provider
    participant SW as public/sw.js
    participant User as Browser user

    Cron->>DB: Every minute, find reminders
    DB-->>Cron: Reminder records
    Cron->>Cron: Compare current local time and recurrence
    alt Reminder is due
        Cron->>Service: Send reminder notification
        Service->>Push: webpush.sendNotification(subscription)
        Push->>SW: Push event
        SW->>User: Show browser notification
        User->>SW: Click notification
        SW-->>User: Open notification URL
    else Not due
        Cron-->>Cron: Wait for next minute
    end
```

Current behavior to remember:

- Daily reminders match every day.
- Weekly reminders recur on the weekday of `createdAt`.
- Monthly reminders recur on the calendar date of `createdAt`.
- Matching is based on the server's local timezone.
- Notification clicks currently use `/mindfulness-exercises`, while the React route is `/mindfulness`; the client wildcard then redirects to `/dashboard`.

## 7. Mood Tracking And Dashboard

```mermaid
sequenceDiagram
    participant User
    participant Tracker as MoodTracker.jsx
    participant API as Axios API client
    participant Route as mood.routes.js
    participant Service as moodService.js
    participant DB as User model
    participant Dashboard as Dashboard.jsx

    User->>Tracker: Choose mood and enter details
    Tracker->>API: POST /mood-tracking
    API->>Route: Authenticated request
    Route->>Service: trackUserMood(req.user)
    Service->>DB: Append mood to user's moods array
    DB-->>Service: Updated user
    Service-->>Tracker: Saved mood
    Tracker-->>User: Follow-up action or confirmation

    Dashboard->>API: GET /mood-history
    API->>Route: Authenticated request
    Route->>Service: getUserMoodHistory(req.user)
    Service->>DB: Read mood history
    DB-->>Dashboard: Newest-first mood entries
    Dashboard-->>User: Current mood, counts, and charts
```

## 8. Peer Support And Anonymous Chat

```mermaid
sequenceDiagram
    participant User
    participant Peers as PeerSupport.jsx
    participant API as Axios API client
    participant PeerRoute as peerSupport.routes.js
    participant PeerService as peerSupportService.js
    participant ChatPage as ChatPage.jsx
    participant ChatRoute as chat.routes.js
    participant ChatService as chatService.js
    participant DB as MongoDB

    User->>Peers: Choose mood or affecting-mood filters
    Peers->>API: GET /peer-support/users with query params
    API->>PeerRoute: Authenticated request
    PeerRoute->>PeerService: Find matching users
    PeerService->>DB: Read users and embedded moods
    DB-->>Peers: Anonymous peer cards

    User->>Peers: Select peer
    Peers->>API: POST /chats with anonymousUsername
    API->>ChatRoute: Authenticated request
    ChatRoute->>ChatService: Find or create two-person chat
    ChatService->>DB: Resolve peer and chat
    DB-->>ChatPage: chatId
    ChatPage->>API: GET /chats/:chatId/messages
    API->>ChatRoute: Authenticated request
    ChatRoute->>ChatService: Verify participant and read messages
    ChatService->>DB: Read messages
    DB-->>ChatPage: Message history
    ChatPage->>API: POST /chats/:chatId/messages
    API->>ChatRoute: Authenticated request
    ChatRoute->>ChatService: Verify participant and save message
    ChatService->>DB: Create message
```

`ChatWindow.jsx` refreshes the active conversation by polling every three seconds. The chat push-notification block in `chatService.js` is currently disabled.

## 9. API Ownership Map

```mermaid
graph TD
    API[/api/v1]
    API --> Auth[auth.routes.js\n/auth/*]
    API --> Mood[mood.routes.js\n/mood-tracking, /mood-history]
    API --> Mind[mindfulness.routes.js\n/mindfulness-exercises]
    API --> Rem[reminder.routes.js\n/reminders]
    API --> Peer[peerSupport.routes.js\n/peer-support/users]
    API --> Chat[chat.routes.js\n/chats]
    API --> Notify[notification.routes.js\n/notifications/subscribe]
    API --> Goals[goal.routes.js\n/goals]

    Auth --> AuthService[authService.js]
    Mood --> MoodService[moodService.js]
    Mind --> MindService[mindfulnessService.js]
    Rem --> RemService[reminderService.js]
    Peer --> PeerService[peerSupportService.js]
    Chat --> ChatService[chatService.js]
    Notify --> NotifyService[notificationService.js]
    Goals --> GoalService[goalService.js]
```
