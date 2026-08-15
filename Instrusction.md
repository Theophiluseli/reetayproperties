REETAY APARTMENTS
Booking Platform — Development Documentation
A property/vehicle/experience booking marketplace, modeled on the UX patterns observed in Africa.Luxury (BookingHub listing page and User Dashboard)
Prepared for: Reetay Apartments Product & Engineering Team
Document Version 1.0 — August 2026

0. How This Document Was Produced — Please Read First
This documentation was built by visually analyzing two screenshots supplied by the product owner: the public listing/search screen (“BookingHub”) and the logged-in “User Dashboard” of africa.luxury. No source code, network traffic, server headers, or backend of africa.luxury was inspected — that site's real backend, frameworks, hosting provider, and infrastructure are not knowable from screenshots and are not claimed anywhere in this document.
What follows is therefore two distinct kinds of content, kept clearly separate throughout:
● UX / Information Architecture / Feature inventory — this is a faithful description of what is visible on screen in the two supplied screenshots (layout, navigation, components, data fields, states).
● Technical Stack & Architecture — this is a recommended stack for building Reetay Apartments to reproduce the same look, feel, and functionality. It is an engineering recommendation chosen for this type of product (multi-vertical booking marketplace), not a claim about what africa.luxury actually runs on.
Recommendation: if pixel-perfect visual cloning is required (exact fonts, spacing, colour tokens, animations), have a developer inspect the live site's rendered DOM/CSS in browser DevTools, or supply additional screenshots of every page/state (search results with filters open, property detail page, checkout/payment flow, booking confirmation, messaging, reviews, cars & experiences tabs, mobile views, admin/vendor side). This document can be expanded once those are available.

1. Product Overview
Reetay Apartments is a booking marketplace for short-stay apartments (with room to extend into car rentals and experiences, mirroring the reference product's three-tab model). Guests search by destination, dates and guest count, filter by amenities, browse listing cards, and book a stay. Registered users manage bookings, messages, reviews, favourites, payments and notifications from a personal dashboard.

1.1 Core Verticals
● Stays — apartment/serviced-apartment short-let bookings (primary focus for Reetay Apartments).
● Cars — vehicle rental listings (secondary vertical, same booking engine pattern).
● Experiences — bookable local experiences/activities (secondary vertical).

1.2 Primary User Roles
Role | Description
Guest (unauthenticated) | Can browse and search listings, view details, must sign up/log in to book.
Registered User (Guest account) | Can book, message admin/host, leave reviews, save favourites, manage payments, receive notifications.
Host / Property Manager | Lists and manages apartments, pricing, availability calendar, responds to messages and bookings.
Platform Admin | Manages listings, users, payments, disputes, content, and platform-wide settings via an admin console.

2. Information Architecture / Sitemap
● / (Home / BookingHub) — Stays | Cars | Experiences tabs, search bar, filters, listing grid
● /stays/:id — Property detail page (gallery, amenities, calendar, price breakdown, reviews, booking widget)
● /checkout — Booking review, guest details, payment
● /booking/:id/confirmation — Booking confirmation
● /login, /signup, /forgot-password — Authentication
● /dashboard — User Dashboard (home)
  ○ /dashboard/bookings — My Bookings
  ○ /dashboard/messages — My Messages
  ○ /dashboard/reviews — My Reviews
  ○ /dashboard/favorites — My Favorites
  ○ /dashboard/payments — Payments
  ○ /dashboard/profile — My Profile / Edit Profile
  ○ /dashboard/preferences — Preferences
  ○ /dashboard/notifications — Notifications
  ○ /dashboard/support — Support
● /about, /how-we-ensure-quality, /privacy-policy, /terms — Static/CMS pages
● /admin/* — Platform admin console

3. Page-by-Page Feature Breakdown
3.1 BookingHub — Public Listing / Search Page
3.1.1 Top Navigation Bar
● Logo (“Reetay Apartments” wordmark with luxury styling) — left aligned.
● Primary vertical tabs, centered: Stays (active/underlined), Cars, Experiences — each with a small icon (bed, car, star).
● Right-aligned auth controls: “Log in” (text link) and “Sign up” (solid gold/amber button, rounded).
3.1.2 Search Bar
A single pill-shaped, segmented search control directly under the nav bar, split into 4 zones separated by thin vertical dividers:
● Search destinations — free-text input with placeholder
● Add dates — date range picker trigger
● Guests — stepper showing “2 guests”
● Search button — solid gold/amber, rounded, with a search icon, right-aligned within the pill
3.1.3 Amenity Filter Chip Bar
A horizontally scrollable row of outlined, pill-shaped filter chips, each with a small icon + label, e.g. Extra Pillows & Blankets, Air Conditioning, Fully Equipped Kitchen, Refrigerator, Microwave, Electric Stove … with a right-arrow affordance indicating more chips off-screen, and a dedicated “Filters” button (with a sliders icon) pinned at the far right for the full filter panel/modal.
3.1.4 Listing Grid
A responsive 4-column card grid. Each listing card contains:
● Cover image (or photo preview split)
● Top-right overlay icons: Share and Favourite/heart (wishlist toggle)
● Promotional badge, top-left over the image, e.g. “Summer Deals”
● Title (property name)
● Location line with a pin icon
● Stat icons row: guests capacity, bedrooms, beds, bathrooms
● Price, bold, with “per night” unit label
“Load More” button centered below the grid.
3.1.5 Footer
● Brand block: logo, tagline (“Luxury apartments and more!!!”), social icons
● Our Policies, Our Information, Our Services, Copyright bar.

3.2 User Dashboard (Authenticated)
3.2.1 Left Sidebar Navigation
● User identity block: avatar, name, email, “Edit Profile” button
● Grouped nav sections: MAIN, ACCOUNT, ACTIVITY, PREFERENCES
● Active item highlighted with amber accent text/left border
● “Logout” pinned at the bottom in red/destructive colour
3.2.2 Dashboard Home Content
● Greeting header: “Welcome back, {first name}!”
● Quick action row (5 cards): New Booking, Message Admin, My Profile, Preferences, Support
● Stat cards row (4 cards): Total Bookings, Upcoming, Active, Completed
● Panels: Recent Bookings, Recent Messages, Recent Reviews, Recent Favorites with empty state components.

4. Technology Stack:
1. Leaflet
2. Nginx
3. React
4. React Router
5. Supabase

Reference: https://africa.luxury
