# Buddy Script — Project Documentation

A full-stack social feed application with authentication, posts, comments, replies, and a like system supporting public/private visibility.

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js (App Router) | SSR for fast first paint, file-based routing, works cleanly with a separate API |
| Backend | Node.js + Express | Explicit control over middleware, auth flow, and error handling |
| Database | PostgreSQL | Relational integrity for users/posts/comments/likes; scales well with proper indexing |
| ORM | Prisma | Type-safe queries, migration management, readable schema |
| Frontend data layer | Axios + TanStack Query | See "Key Decisions" below |
| Auth | JWT (dual-token: access + refresh) | Stateless, scalable, no server-side session store needed |

---

## What Was Built

### Authentication
- Registration (first name, last name, email, password) and login, both password-hashed with bcrypt (12 salt rounds).
- Dual-token JWT strategy: short-lived access token returned in the response body, long-lived refresh token set as an httpOnly cookie.
- `/api/auth/refresh` mints a new access token from the refresh cookie without requiring the user to log in again.
- `/api/auth/me` returns the current user's profile, used to rehydrate client state on page reload.
- `/api/auth/logout` clears the refresh cookie.
- Route protection enforced at two layers: Next.js middleware (UX-level redirect) and Express middleware verifying the JWT on every protected API call (actual security boundary).

### Feed
- Posts support text content, an optional image, and a visibility flag (`PUBLIC` / `PRIVATE`).
- Private posts are filtered at the database query level (`WHERE visibility = PUBLIC OR authorId = currentUser`), never on the client — this is a deliberate security decision so a private post can never leak through an API response regardless of frontend behavior.
- Feed is cursor-paginated (not offset-based) and ordered newest-first.
- Comments and replies share one self-referencing table (`Comment.parentId`) rather than separate tables — a reply is structurally identical to a comment (author, content, likes), so this avoids duplicated logic while still supporting nested replies.
- Likes use a single polymorphic-style table (`targetType` + `targetId`) shared by posts and comments, so the like/unlike/who-liked logic is identical for both instead of being implemented twice.
- A unique constraint on `(userId, targetType, targetId)` makes like/unlike idempotent and prevents duplicate likes even under concurrent requests — enforced at the database level, not just in application code.

---

## Key Decisions

### Why a dual-token JWT strategy instead of a single token
A single long-lived token stored anywhere accessible to JavaScript is a standing XSS liability. Splitting into two tokens with different storage and lifetimes limits the blast radius of any single compromise:

| | Storage | Exposed to JS? | Lifetime | Risk profile |
|---|---|---|---|---|
| Access token | In-memory (React state) | Yes, but never persisted | Short | Leaks are time-limited by design |
| Refresh token | httpOnly cookie | No | Long | Can't be read by an XSS payload at all |

The access token is attached manually via an `Authorization: Bearer` header (not auto-sent like a cookie), which also reduces CSRF exposure — a forged cross-site request can't attach a header it doesn't have.

### Why the refresh token is a cookie and the access token is not
This was a point of confusion during development worth documenting: only the refresh token is ever set as a cookie. The access token is deliberately kept out of cookie storage so it isn't automatically replayed by the browser on every request — it's sent only when the frontend explicitly attaches it.

### Why Axios + TanStack Query over plain `fetch`
Plain `fetch` would require hand-rolling: token-attachment on every call, 401-triggered refresh-and-retry, request deduplication, and optimistic UI for likes/comments. Each of those is a plausible source of subtle bugs at scale. TanStack Query provides `useInfiniteQuery` (maps directly onto the backend's cursor pagination), built-in optimistic updates with automatic rollback on failure (used for like/unlike), and automatic request deduplication/caching. Axios's interceptor handles the token-refresh-and-retry flow in one place instead of repeating it per call site.

### Why Next.js middleware checks the refresh cookie, not the access token
The access token never exists as a cookie, so a middleware check against an `accessToken` cookie would always fail even for logged-in users. The middleware checks for the presence of the refresh cookie as a fast UX-level redirect; it does not itself authorize API access — that's enforced separately by the Express `requireAuth` middleware on every protected route.

### Why private-post filtering happens in the database query, not the frontend
Any filtering done client-side implies the data was already sent to the browser and is recoverable via devtools/network tab regardless of UI. Visibility is enforced in the `WHERE` clause of the feed query itself.



---



## Scaling Notes (beyond this assignment's scope)

The current design (indexed cursor pagination, denormalized counters, DB-level uniqueness constraints) is sufficient for the assignment's scope and outperforms a naive implementation by a wide margin. For genuinely millions of concurrent users, the natural next additions would be: PostgreSQL read replicas with connection pooling (PgBouncer), a Redis-buffered counter for likes on hot/viral posts to avoid single-row write contention, S3/CDN for image storage instead of local disk, and a Redis cache for the first page of the public feed. None of these were necessary to implement for the current scope but are documented here as the identified next steps.

## Security Checklist

- Passwords hashed with bcrypt, never stored or logged in plaintext.
- Refresh token in httpOnly, secure (production), sameSite=strict cookie.
- Access token never persisted (memory only), attached via header.
- CORS locked to the frontend origin with `credentials: true` (no wildcard).
- All route inputs validated server-side (zod) before touching the database — client-side validation is UX only, never trusted.
- Private-post and auth checks enforced server-side at the query/middleware level, not the UI level.
- No sensitive data (tokens, full request objects) written to logs.