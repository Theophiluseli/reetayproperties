REETAY APARTMENTS
Booking Platform — Development Documentation
A property/vehicle/experience booking marketplace, modeled on the UX patterns observed in Africa.Luxury (BookingHub listing page and User Dashboard)
Prepared for: Reetay Apartments Product & Engineering Team
Document Version 1.0 — August 2026
 
0. How This Document Was Produced — Please Read First
This documentation was built by visually analyzing two screenshots supplied by the product owner: the public listing/search screen (“BookingHub”) and the logged-in “User Dashboard” of africa.luxury. No source code, network traffic, server headers, or backend of africa.luxury was inspected — that site's real backend, frameworks, hosting provider, and infrastructure are not knowable from screenshots and are not claimed anywhere in this document.
What follows is therefore two distinct kinds of content, kept clearly separate throughout:
●	UX / Information Architecture / Feature inventory — this is a faithful description of what is visible on screen in the two supplied screenshots (layout, navigation, components, data fields, states).
●	Technical Stack & Architecture — this is a recommended stack for building Reetay Apartments to reproduce the same look, feel, and functionality. It is an engineering recommendation chosen for this type of product (multi-vertical booking marketplace), not a claim about what africa.luxury actually runs on.
Recommendation: if pixel-perfect visual cloning is required (exact fonts, spacing, colour tokens, animations), have a developer inspect the live site's rendered DOM/CSS in browser DevTools, or supply additional screenshots of every page/state (search results with filters open, property detail page, checkout/payment flow, booking confirmation, messaging, reviews, cars & experiences tabs, mobile views, admin/vendor side). This document can be expanded once those are available.
1. Product Overview
Reetay Apartments is a booking marketplace for short-stay apartments (with room to extend into car rentals and experiences, mirroring the reference product's three-tab model). Guests search by destination, dates and guest count, filter by amenities, browse listing cards, and book a stay. Registered users manage bookings, messages, reviews, favourites, payments and notifications from a personal dashboard.
1.1 Core Verticals
●	Stays — apartment/serviced-apartment short-let bookings (primary focus for Reetay Apartments).
●	Cars — vehicle rental listings (secondary vertical, same booking engine pattern).
●	Experiences — bookable local experiences/activities (secondary vertical).
1.2 Primary User Roles
Role	Description
Guest (unauthenticated)	Can browse and search listings, view details, must sign up/log in to book.
Registered User (Guest account)	Can book, message admin/host, leave reviews, save favourites, manage payments, receive notifications.
Host / Property Manager	Lists and manages apartments, pricing, availability calendar, responds to messages and bookings (implied by “Message Admin” and property inventory; to be built out for Reetay).
Platform Admin	Manages listings, users, payments, disputes, content, and platform-wide settings via an admin console.
2. Information Architecture / Sitemap
●	/ (Home / BookingHub) — Stays | Cars | Experiences tabs, search bar, filters, listing grid
●	/stays/:id — Property detail page (gallery, amenities, calendar, price breakdown, reviews, booking widget) — to be designed; not present in supplied screenshots
●	/checkout — Booking review, guest details, payment
●	/booking/:id/confirmation — Booking confirmation
●	/login, /signup, /forgot-password — Authentication
●	/dashboard — User Dashboard (home)
○	/dashboard/bookings — My Bookings
○	/dashboard/messages — My Messages
○	/dashboard/reviews — My Reviews
○	/dashboard/favorites — My Favorites
○	/dashboard/payments — Payments
○	/dashboard/profile — My Profile / Edit Profile
○	/dashboard/preferences — Preferences
○	/dashboard/notifications — Notifications
○	/dashboard/support — Support
●	/about, /how-we-ensure-quality, /privacy-policy, /terms — Static/CMS pages (from footer)
●	/admin/* — Platform admin console (listings, users, bookings, payments, CMS) — not visible in screenshots, standard requirement for this product type
 
 
3. Page-by-Page Feature Breakdown
Based directly on the two supplied screenshots.
3.1 BookingHub — Public Listing / Search Page
3.1.1 Top Navigation Bar
●	Logo (“Africa.Luxury” wordmark with a small mountain/triangle icon) — left aligned. For Reetay Apartments: replace with Reetay Apartments logo.
●	Primary vertical tabs, centered: Stays (active/underlined), Cars, Experiences — each with a small icon (bed, car, star).
●	Right-aligned auth controls: “Log in” (text link) and “Sign up” (solid gold/amber button, rounded).
3.1.2 Search Bar
A single pill-shaped, segmented search control directly under the nav bar, split into 4 zones separated by thin vertical dividers:
●	Search destinations — free-text input with placeholder
●	Add dates — date range picker trigger
●	Guests — stepper showing “2 guests”
●	Search button — solid gold/amber, rounded, with a search icon, right-aligned within the pill
3.1.3 Amenity Filter Chip Bar
A horizontally scrollable row of outlined, pill-shaped filter chips, each with a small icon + label, e.g. Extra Pillows & Blankets, Air Conditioning, Fully Equipped Kitchen, Refrigerator, Microwave, Electric Stove … with a right-arrow affordance indicating more chips off-screen, and a dedicated “Filters” button (with a sliders icon) pinned at the far right for the full filter panel/modal.
3.1.4 Listing Grid
A responsive 4-column card grid (collapses to fewer columns on smaller viewports). Each listing card contains:
●	Cover image (or 2-photo split layout on some cards, suggesting a mini photo carousel/gallery preview)
●	Top-right overlay icons: Share and Favourite/heart (wishlist toggle)
●	Promotional badge, top-left over the image, e.g. “Summer Deals” (dynamic/seasonal campaign tag)
●	Title (property name, truncated with ellipsis)
●	Location line with a pin icon (property area / building name)
●	Stat icons row: guests capacity, bedrooms, beds, bathrooms (person / bed / door / bath icons with counts)
●	Price, bold, with “per night” unit label
“Load More” button centered below the grid — indicates client-side pagination / incremental loading rather than numbered pages (or infinite scroll fallback).
3.1.5 Footer
●	Brand block: logo, tagline (“Luxury apartments and more!!!”), social icons (Facebook, Twitter/X, Instagram, LinkedIn)
●	Our Policies: About us, Home, How we ensure quality, Privacy policy, Terms and services
●	Our Information: support email, phone number, physical address
●	Our Services: Stays, Car Rentals, Experiences
●	Bottom bar: copyright line
On dark navy background, contrasting the light body of the page.
3.2 User Dashboard (Authenticated)
3.2.1 Left Sidebar Navigation
●	User identity block: avatar (initial-letter avatar circle), name, email, and an “Edit Profile” button
●	Grouped nav sections with small caption labels: MAIN (Home, Dashboard), ACCOUNT (Payments), ACTIVITY (My Bookings, My Messages, My Reviews, My Favorites), PREFERENCES (Notifications)
●	Each nav item has an icon + label; active item (“Dashboard”) is highlighted with a light background and amber accent text/left border
●	“Logout” pinned at the bottom, styled in red/destructive colour, separated by a divider
3.2.2 Dashboard Home Content
●	Greeting header: “Welcome back, {first name}!” with a sparkle icon, plus a subtitle line
●	Quick action row (5 cards): New Booking (primary, solid black/dark button with + icon), Message Admin, My Profile, Preferences, Support — each an equal-width bordered card with icon above label
●	Stat cards row (4 cards): Total Bookings (“All time”), Upcoming (“Next trips”), Active (“Right now”), Completed (“Past stays”) — each shows a large number, caption, and a coloured icon badge (box, calendar, trending-up, check-circle)
●	Recent Bookings panel with “See All Bookings” link (top-right); empty state shows an icon, “No bookings yet” message, helper text, and a “Browse Listings” CTA button back to the search/listing page
●	Two side-by-side panels: Recent Messages (empty state: “No messages”) and Recent Reviews (empty state: “No reviews yet”), each with a “See All…” link
●	Recent Favorites panel, full width, with “See All Favorites” link; empty state with heart icon, “No favorites yet”, and “Start Browsing” CTA
All panels implement a consistent empty-state pattern: icon + bold headline + grey helper text + primary CTA. This pattern should be built as one reusable component (see §4.3) and reused across Bookings, Messages, Reviews and Favorites list/detail pages once populated with data.
3.3 Pages Implied but Not Captured in Screenshots
The following are standard, necessary pages for this product to function end-to-end. They are not visible in the two supplied screenshots and are included here as required scope for a working clone — flagged clearly as recommendations, not observed fact:
●	Property detail / listing page (gallery, full amenities list, house rules, location map, availability calendar, reviews list, host info, sticky booking widget with price breakdown)
●	Checkout / booking flow (guest details, add-ons, payment method, terms acceptance, booking summary)
●	Booking confirmation / e-receipt page and email
●	Authentication screens: login, signup, forgot/reset password, email verification
●	Messaging thread view (per-conversation chat UI)
●	Review submission form (post-stay)
●	Admin/host console: listing CRUD, calendar & pricing management, booking approvals, payout tracking
4. Component Inventory
Reusable UI components implied by the two screens, to be built once and shared across the app.
Component	Used In	Notes
TopNavBar	All public pages	Logo, vertical tabs, auth buttons; sticky on scroll
SegmentedSearchBar	BookingHub / Home	Destination, dates (range picker), guest stepper, submit
FilterChipRow	BookingHub	Horizontally scrollable, multi-select, syncs to query params
FiltersModal/Drawer	BookingHub	Full filter set: price range, property type, amenities, rating
ListingCard	Grid, Favorites, Search results	Image carousel, badge, wishlist toggle, share, stats row, price
ListingGrid	BookingHub, Favorites	Responsive CSS grid + “Load More” / infinite scroll
SidebarNav	Dashboard shell	Grouped links, active state, user identity block, logout
StatCard	Dashboard home	Icon badge, big number, label, caption
QuickActionCard	Dashboard home	Icon + label, primary variant for “New Booking”
EmptyState	Bookings/Messages/Reviews/Favorites panels	Icon, headline, helper text, CTA button — single reusable component
SectionPanel	Dashboard home	Card wrapper with title, icon, “See all” link, body slot
Footer	All public pages	4-column link groups + social icons + copyright
Avatar	Sidebar, navbar, reviews	Initials fallback, image fallback
Toast/NotificationBell	Dashboard	Unread indicator, dropdown list
5. Data Model
Minimum viable relational schema to support the observed features (stays, bookings, messages, reviews, favourites, payments, notifications). Field lists are representative, not exhaustive.
5.1 users
Field	Type	Notes
id	UUID (PK)	
full_name	string	
email	string, unique	
password_hash	string	if not using a managed auth provider
avatar_url	string, nullable	falls back to initials avatar
role	enum	guest, host, admin
phone	string, nullable	
created_at / updated_at	timestamp	
5.2 properties (listings)
Field	Type	Notes
id	UUID (PK)	
host_id	UUID (FK -> users)	
title	string	
description	text	
vertical	enum	stay, car, experience
location	geo point + address text	for search + map
price_per_night	decimal	
max_guests / bedrooms / beds / bathrooms	integers	shown as stat icons on card
amenities	array / join table	drives filter chips
images	array (URLs)	gallery + card cover + 2-photo preview
badge	string, nullable	e.g. “Summer Deals”, campaign-driven
status	enum	draft, published, archived
created_at / updated_at	timestamp	
5.3 bookings
Field	Type	Notes
id	UUID (PK)	
user_id	UUID (FK -> users)	
property_id	UUID (FK -> properties)	
check_in / check_out	date	
guests	integer	
status	enum	upcoming, active, completed, cancelled — drives dashboard stat cards
total_price	decimal	
payment_id	UUID (FK -> payments)	
created_at / updated_at	timestamp	
5.4 payments, messages, reviews, favorites, notifications
Table	Key Fields
payments	id, booking_id, user_id, amount, currency, method, provider_reference, status, created_at
conversations / messages	id, participant ids, booking_id (nullable), body, sender_id, read_at, created_at
reviews	id, booking_id, user_id, property_id, rating, comment, created_at
favorites	id, user_id, property_id, created_at (unique on user_id+property_id)
notifications	id, user_id, type, payload, read_at, created_at
6. Recommended Technology Stack
This is a proposed stack for building Reetay Apartments — chosen to comfortably deliver everything catalogued in §3–5, not a report of what africa.luxury runs. Substitute any layer for an in-house standard if Reetay's engineering team already has one.
6.1 Frontend
Layer	Recommendation	Why
Framework	Next.js 14+ (React, App Router)	SSR/SSG for fast, SEO-friendly listing & property pages; API routes for BFF needs
Language	TypeScript	Type-safe data models shared with backend contracts
Styling	Tailwind CSS + shadcn/ui (Radix primitives)	Matches the clean, rounded, pill-button aesthetic observed; fast to theme (amber/gold + navy palette)
State / data fetching	TanStack Query (React Query)	Caching for listings, bookings, dashboard stats; optimistic UI for favourites/wishlist toggle
Forms	React Hook Form + Zod	Search bar, filters, checkout, profile forms with schema validation
Maps	Mapbox GL JS or Google Maps JS SDK	Property location + search-by-map, if added later
Icons	Lucide React	Matches the line-icon style used throughout (bed, car, star, bell, etc.)
Date picker	react-day-picker	Powers the “Add dates” range control
6.2 Backend
Layer	Recommendation	Why
Runtime / framework	Node.js + NestJS (TypeScript)	Structured, modular REST/GraphQL API; shares types with the Next.js frontend
API style	REST (OpenAPI-documented); GraphQL optional for dashboard aggregations	Simple resource model (properties, bookings, users) fits REST well
Database	PostgreSQL	Relational integrity for bookings/availability/payments; PostGIS extension for geo search
ORM	Prisma	Type-safe schema matching §5, easy migrations
Caching / queues	Redis (cache + BullMQ for background jobs)	Search result caching, email/notification queues, availability locks
Search	PostgreSQL full-text or Meilisearch/Algolia (if scale requires)	Destination search-as-you-type
Auth	Auth.js (NextAuth) or Clerk/Auth0, JWT + refresh tokens	Email/password + social login, session management
File/image storage	Amazon S3 or Cloudflare R2 + CDN, with on-the-fly resizing (e.g. Cloudinary or imgproxy)	Listing photo galleries, avatars
Payments	Stripe (cards) + a regional gateway (e.g. Paystack/Flutterwave) for local currencies	Ghana/West Africa market coverage alongside international cards
Real-time messaging	WebSockets via Socket.IO, or a managed service (Pusher/Ably)	“Message Admin” / conversations, live notification bell
Transactional email/SMS	Resend or SendGrid; Twilio for SMS/OTP	Booking confirmations, password reset, alerts
6.3 Infrastructure & DevOps
Layer	Recommendation	Why
Hosting (frontend)	Vercel	Native Next.js hosting, image optimization, edge caching
Hosting (backend/API)	AWS (ECS Fargate or Elastic Beanstalk) or Railway/Render for a leaner start	Scales independently from frontend; background workers for jobs/queues
Managed database	AWS RDS for PostgreSQL, or Supabase for a faster MVP	Automated backups, read replicas as traffic grows
CI/CD	GitHub Actions	Lint, test, type-check, preview deploys, migrations on merge
Monitoring / errors	Sentry (errors) + Grafana/Datadog (metrics/logs)	Track booking-flow errors and API latency
Infra as code	Terraform	Reproducible environments (staging/production)
6.4 Suggested Repository Structure
Monorepo (e.g. Turborepo/pnpm workspaces) keeping frontend, backend, and shared types together:
●	apps/web — Next.js frontend (BookingHub, dashboard, checkout)
●	apps/api — NestJS backend (auth, properties, bookings, payments, messaging)
●	apps/admin — Admin/host console (Next.js, separate app or role-gated routes)
●	packages/ui — Shared component library (ListingCard, EmptyState, StatCard, etc. from §4)
●	packages/types — Shared TypeScript types / Zod schemas mirroring §5
●	packages/config — ESLint, TS, Tailwind shared config
●	infra/ — Terraform, Docker, CI workflows
7. API Endpoint Structure (Illustrative)
Method & Path	Purpose
GET /api/properties	List/search properties — supports vertical, destination, dates, guests, amenities filters, pagination (“Load More”)
GET /api/properties/:id	Property detail
POST /api/properties (host/admin)	Create listing
PATCH /api/properties/:id (host/admin)	Update listing
GET /api/properties/:id/availability	Calendar availability
POST /api/bookings	Create booking (pre-payment hold)
GET /api/bookings (auth)	Current user's bookings, filterable by status — backs stat cards & “My Bookings”
GET /api/bookings/:id (auth)	Booking detail / confirmation
POST /api/payments/intent	Create payment intent (Stripe/Paystack)
POST /api/payments/webhook	Provider webhook → confirm booking on success
GET/POST /api/favorites (auth)	List / toggle wishlist
GET/POST /api/reviews	List property reviews / submit review post-stay
GET /api/conversations, POST /api/conversations/:id/messages (auth)	Messaging — backs “Message Admin” and “My Messages”
GET /api/notifications (auth)	Notification bell / Notifications page
GET /api/users/me, PATCH /api/users/me (auth)	Profile view/edit
POST /api/auth/signup, /login, /refresh, /logout	Authentication
8. Non-Functional Requirements
8.1 Performance
●	Server-render the listing page for first paint; hydrate for interactivity (filters, wishlist).
●	Debounce destination search input; paginate/virtualize the listing grid for large result sets.
●	Cache popular search queries (Redis) and CDN-cache listing images at multiple sizes.
8.2 Security
●	HTTPS everywhere; HttpOnly, Secure, SameSite cookies for session tokens.
●	Server-side authorization checks on every dashboard/booking/payment endpoint (never trust client role).
●	PCI-DSS scope minimized by using Stripe/Paystack hosted elements — never store raw card numbers.
●	Rate-limit auth and search endpoints; input validation (Zod) on every request body.
8.3 Accessibility & i18n
●	Keyboard-navigable search bar, filter chips, and modal/drawer filters; visible focus states.
●	Colour contrast check on the amber-on-white and navy-footer palettes.
●	Structure copy for future multi-currency (GHS/USD) and multi-language support.
8.4 Scalability
●	Stateless API instances behind a load balancer; horizontal scaling for traffic spikes (seasonal ‘Summer Deals’-style campaigns).
●	Read replica for the properties table once search volume grows; background workers isolated from the request path.
9. Suggested Delivery Phases
Phase	Scope
Phase 1 — Foundations	Design system (colours/typography from Reetay branding), auth, property data model, admin CRUD for listings, public listing grid + search + filters (§3.1)
Phase 2 — Booking Core	Property detail page, availability calendar, checkout, payment integration, booking confirmation, booking statuses
Phase 3 — Dashboard	User Dashboard shell (§3.2): stat cards, quick actions, recent bookings/messages/reviews/favorites panels with empty states
Phase 4 — Engagement	Messaging (Message Admin / conversations), reviews, favourites/wishlist, notifications
Phase 5 — Expansion	Cars & Experiences verticals reusing the same ListingCard/search components; host console; analytics

also pay use this tech stacks 
1.leaflet
2.Nginx
3.React
4.React router
5.supabase

for vivid reference https://africa.luxury