# Promotion email editor

Open **Admin → Promotions** (`/admin/promotions`). The landing page lists existing promotions with draft/last-send status and delivery counts. **Send new promotion** opens the editor. **View, edit & resend** reopens any existing promotion.

1. Choose selected users or **All eligible users**. Eligible means active and email-verified, including staff accounts. Individual selection supports up to 1,000 users, with search and pagination.
2. Choose up to 12 active products. Their images, prices and product links are added by the backend.
3. Edit the subject, headline, inbox preview text, message, button label/link and closing note. Messages support paragraphs and line breaks; input is rendered as text inside the professional branded template.
4. Inspect the live preview, including desktop/mobile sizing. It uses the actual backend renderer, with an example greeting; each delivered email greets its recipient by name. Previewing never sends mail.
5. Save a draft, or select **Review & send**. The review step saves changes and refreshes the recipient count before enabling the final send action.

Drafts may be incomplete. Sending requires a subject, headline, message, product selection and at least one eligible recipient. Disabled/unverified accounts are excluded, and eligibility is checked again by the worker. The email is sent individually to each user.

The list and editor refresh pending delivery counts automatically. **Send history → View sent version** shows the original email and per-recipient outcomes, even after subsequent edits. The editor shows the latest 20 send attempts. Every attempt remains stored on the backend. Editing and resending creates a new attempt; historical email content and prices remain immutable.

Sent means accepted by the email server. Failed and unknown results are shown separately. Unknown attempts may have reached the provider before a timeout/interruption; review the report before resending. The app does not automatically retry these emails.

The backend checks admin permissions, edit versions, recipient counts and send request IDs. The preview is contained in a sandboxed iframe; custom content is escaped. Existing API, auth, components, fonts and site colors are reused.

## Backend dependency

Deploy the promotions module and apply both `1792600000000-AdminPromotions` and `1792600100000-PromotionQueueIsolation`. Normal backend startup runs the delivery worker. Existing email settings and public media URLs are required. Detailed API/queue notes are in `docs/promotions.md` in the backend repository.

## Verification

```sh
npm run test:promotions:e2e
npm run build
npm run lint
```

Browser tests cover desktop/mobile create, recipient/product selection, live preview, draft persistence, sending, report viewing, editing/resending, all-users selection, preview errors and customer access rejection. They use temporary accounts, a private queue namespace and mocked email, and remove their data afterward. Use a development/test database.
