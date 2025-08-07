# **App Name**: CampusVenue

## Core Features:

- Role-Based Access Control: Integrate sign-in via Google or college Single Sign-On (SSO). Assign roles upon login or registration: Student, Club Leader, Faculty, Admin (includes HOD, Principal, Facility Manager). Only logged-in users can access the app. Users must have roles stored in DB. All permission checks should reference session.user.role.
- Real-Time Venue Availability: Create a calendar view (month/week/day) for all venues. Show slot statuses (Available, Booked, Pending, Maintenance). Support filters: Venue type (classroom, lab, hall), Equipment (projector, sound system, AC), Capacity, Building/floor
- Booking Workflow: Users select venue -> date & time -> enter event details -> attach documents -> submit. Automatically check for booking conflicts. Save request as a pending approval (status: Submitted).
- Automated Approval Routing: Route requests based on role and venue type: Requester Approval Chain Student Faculty Advisor -> HOD -> Admin Club Leader Faculty Advisor -> HOD -> Admin Faculty HOD -> Admin Admin Auto-approved Show approval status and timestamps on request page.
- Conflict Detection & Resolution: Detect overlapping time slot conflicts automatically. Notify requester instantly if a slot is unavailable. Suggest alternative time slots or venues (based on capacity/type). Admins can override or reschedule conflicting events.
- Document Upload & Storage: Support PDF/image upload for: Permission letters, Event proposals, Faculty approvals. Store securely with metadata (uploader, booking ID, timestamp). Only accessible by authorized reviewers.
- Notifications & Alerts: Send email + in-app notifications for: Request submission, Approval/rejection, Conflict alerts, Upcoming events (24h reminder), Admin notifications for pending approvals and conflicts.
- Admin Dashboard: View bookings by date/venue/department. Export booking logs (CSV/PDF). See pending approvals and conflict logs. Venue usage heatmap and stats.
- Policy Engine: Set rules such as: Academic > Cultural > Club priority Faculty > Student priority Max duration per booking (e.g., 4 hrs) Advance booking limit (e.g., 30 days) Automatically enforce these rules during booking.
- AI Smart Suggestions: AI tool that provides smart suggestions of alternative time slots or venues, based on capacity and type, to resolve conflicts.

## Style Guidelines:

- Use a muted blue (#5DADE2) to evoke trust and stability, reflecting the academic environment.
- Light gray (#F5F7FA) to provide a clean and modern look, ensuring readability and focus.
- A vibrant orange (#F39C12) to highlight calls to action and important notifications, catching the user's eye.
- 'Inter', a sans-serif font, will be used for a modern, machined, objective, neutral look; suitable for headlines and body text.
- Use clean, simple icons to represent venue types and features, ensuring clarity and ease of use.
- Maintain a clean and structured layout, prioritizing ease of navigation and quick access to essential functions.