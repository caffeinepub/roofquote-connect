# RoofQuote Connect

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- One-page lead generation landing page for UK homeowners seeking roofing services
- Lead capture form: name, phone, email, postcode, roofing issue type, optional message
- Lead management dashboard (admin login required) to view all submissions
- Backend storage for leads with fields: name, phone, email, postcode, job type, message, timestamp

### Modify
N/A

### Remove
N/A

## Implementation Plan

### Backend
- `submitLead(name, phone, email, postcode, jobType, message)` — stores lead, returns success
- `getLeads()` — returns all leads (admin only via authorization)
- Lead record: id, name, phone, email, postcode, jobType, message, createdAt

### Frontend

**Landing Page (public)**
1. Header — logo "RoofQuote Connect", click-to-call 0800 000 0000, sticky nav with CTA button
2. Hero — headline, subheadline, lead form embedded, orange CTA button
3. Trust badges — Local Professionals, Fast Response, Free Quotes, No Obligation
4. How It Works — 3-step process with icons
5. Benefits — fast response, local contractors, free quotes, trusted professionals, no obligation
6. Testimonials — 3 example homeowner reviews with star ratings
7. Final CTA section — large banner encouraging form submission
8. Footer — privacy policy, terms, contact email, disclaimer

**Admin Dashboard (protected)**
- Login via authorization component
- Table of all lead submissions
- Columns: name, phone, email, postcode, job type, message, date submitted

### Design
- Primary: dark blue
- Secondary/CTA: orange
- Background: white
- Sections: light grey alternating
- Mobile-first, fully responsive
- Sticky header with phone number
