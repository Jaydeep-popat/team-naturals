# Backend Requirements for Account UI Overhaul

The frontend Account section has been overhauled to improve UI/UX, but it relies on several APIs and data points that do not currently exist in the backend. 
Please implement the following changes to support the new frontend UI:

## 1. User Profile
- **Avatar Upload:** Need an endpoint to upload and manage user profile pictures (e.g. `POST /api/users/me/avatar`). Currently, the frontend simulates a success state.
- **Profile Updates:** Need an endpoint to update user information (e.g., `PATCH /api/users/me`) for fields like `firstName`, `lastName`, `phoneNo`, `dateOfBirth`, etc. Currently, the inline editing UI only updates local component state temporarily.

## 2. Orders & Order Tracking
- **Order Details API:** Need an endpoint to fetch full order details by ID (e.g., `GET /api/orders/:id`), which includes:
  - `status` (Delivered, On the way, Cancelled, Returned)
  - `subtotal`, `shipping`, `discount`, `total`
  - `paymentMethod` used
  - Snapshot of the `shippingAddress` used for that specific order.
  - A list of `items` in the order (with `name`, `variant`, `price`, `image`).
- **Tracking Timeline:** The order details API should return an array of `trackingSteps` or a timeline of status changes with timestamps, so the frontend can populate the vertical stepper component accurately.

## 3. Saved Addresses
- **Address Labels:** Add a `label` or `tag` field (e.g., `enum: ['Home', 'Work', 'Other']`) to the Address schema so users can categorize their saved addresses. Currently, the frontend stubs the label as 'Home' for the first address and 'Other' for the rest.

## 4. Admin Panel & Roles
- **Granular Admin Roles:** Update the backend auth payload (JWT) to include an `adminRole` claim (e.g., `'super_admin' | 'order_manager' | 'product_manager' | 'support'`). Currently, the backend only knows about `Role: 'admin'`. The frontend needs this claim to enforce granular access control within the Admin Panel.
- **Admin Products CRUD:** Need comprehensive endpoints for managing products, categories, variants, and stock from the admin side.
- **Stock Adjustment Logs:** Implement logging for manual stock adjustments including the delta and reason.
- **Admin Users Management:** Endpoint for Super Admins to create, edit, and deactivate other admin users and assign roles.
