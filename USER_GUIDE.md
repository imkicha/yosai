# Yosai Platform - User Guide

A complete guide for Customers, Vendors, and Administrators.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Customer Guide](#customer-guide)
3. [Vendor Guide](#vendor-guide)
4. [Admin Guide](#admin-guide)

---

## Getting Started

### Creating an Account

1. Visit the website and click **Sign Up** in the navigation bar.
2. Enter your **Full Name**, **Email**, and **Password**.
3. Confirm your password and click **Create Account**.
4. You will be automatically logged in and redirected to the home page.

### Signing In

1. Click **Sign In** in the navigation bar.
2. Enter your registered **Email** and **Password**.
3. Click **Sign In**. You will be redirected based on your role:
   - **Customer** - Home page
   - **Vendor** - Vendor Dashboard
   - **Admin** - Admin Dashboard

### Navigation

- **Desktop**: Use the top navigation bar to browse pages. After login, click your **name** in the navbar to access a dropdown menu with quick links.
- **Mobile**: Use the bottom navigation bar and the hamburger menu for additional options.

---

## Customer Guide

### Browsing Products

1. Click **Readymades** in the navigation bar to view all available products.
2. Use filters and search to find specific items.
3. Click on any product to view its details, images, variants (size, color), and pricing.

### Adding to Cart

1. On the product detail page, select the desired **size** and **color** (if applicable).
2. Click **Add to Cart**.
3. The cart icon in the navbar shows the number of items in your cart.

### Managing Your Cart

1. Click the **Cart** icon in the navigation bar.
2. Adjust quantities using the **+** and **-** buttons.
3. Remove items by clicking the delete/remove button.
4. View your order summary including subtotal, shipping, and total.
5. Click **Proceed to Checkout** when ready.

### Checkout & Payment

1. Select or add a **delivery address**.
2. Review your order summary.
3. Choose your payment method:
   - **Razorpay** (UPI, Cards, Net Banking, Wallets)
   - **Wallet Balance** (if available, can be combined with Razorpay)
4. Click **Place Order** to complete your purchase.
5. For Razorpay payments, a secure payment window will open. Complete the payment there.

### Tracking Orders

1. Click your **name** in the navbar and select **My Orders** from the dropdown.
2. View all your orders with their current status.
3. Click on any order to see full details including:
   - Order items and quantities
   - Payment information
   - Shipping status and tracking
   - Delivery timeline

### Order Statuses

| Status | Meaning |
|--------|---------|
| Pending | Order placed, awaiting confirmation |
| Confirmed | Vendor has confirmed the order |
| Shipped | Order has been dispatched |
| Delivered | Order has been delivered |
| Cancelled | Order has been cancelled |

### Managing Addresses

1. Click your **name** in the navbar and select **Manage Addresses**.
2. **Add Address**: Click "Add New Address" and fill in the details (name, phone, street, city, state, pincode).
3. **Edit Address**: Click the edit icon on any saved address.
4. **Delete Address**: Click the delete icon to remove an address.
5. **Set Default**: Mark an address as default for quicker checkout.

### Wallet

1. Click your **name** in the navbar and select **Wallet**.
2. View your current wallet balance.
3. See transaction history (credits from refunds, debits from orders).
4. Wallet balance can be used during checkout to reduce the payable amount.

### Edit Profile

1. Click your **name** in the navbar and select **Edit Profile**.
2. Update your **name** and **phone number**.
3. Click **Save** to update your profile.

### Support

1. Click your **name** in the navbar and select **Support**.
2. Create a new support ticket by describing your issue.
3. Track the status of your existing tickets.
4. View replies from the support team.

### Stitch Service

1. Click **Stitch Service** in the navigation bar.
2. Browse available stitching/tailoring services.
3. Click **Book Now** to schedule a service booking.
4. Fill in the required details and submit.

### Contact Us

1. Click **Contact** in the navigation bar or footer.
2. Fill in the contact form with your query.
3. You can also request a callback.

### Logging Out

1. Click your **name** in the navbar.
2. Select **Log Out** from the dropdown menu.

---

## Vendor Guide

### Becoming a Vendor

1. Visit the **Vendor Onboarding** page.
2. Fill in your business details:
   - Business name and description
   - Contact information
   - Bank account details
   - Required business documents
3. Submit your application.
4. Wait for admin approval. You will be notified once approved.

### Vendor Dashboard

After approval, log in to access your vendor panel:

1. **Dashboard** - Overview of your store performance:
   - Total orders, revenue, and products
   - Recent orders
   - Quick stats and charts

### Managing Products

1. Go to **Products** in the vendor sidebar.
2. **Add Product**: Click "Add Product" and fill in:
   - Product name and description
   - Category
   - Price and compare-at price
   - Images (upload multiple)
   - Variants (size, color combinations with individual stock)
3. **Edit Product**: Click on any product to modify its details.
4. **Delete Product**: Remove products that are no longer available.

### Managing Orders

1. Go to **Orders** in the vendor sidebar.
2. View all orders placed for your products.
3. For each order, you can:
   - **Confirm** the order (change status from Pending to Confirmed)
   - **Create Shipment** via Shiprocket integration
   - **Assign AWB** (airway bill number for tracking)
   - **Schedule Pickup** for the courier to collect the package
4. Add notes to orders for internal tracking.

### Shipping (Shiprocket Integration)

The platform uses Shiprocket for shipping. The workflow is:

1. **Create Shipment** - Generates a shipment in Shiprocket with order details.
2. **Assign AWB** - Gets a tracking number from the courier partner.
3. **Schedule Pickup** - Arranges courier pickup from your location.

Each step must be done in order. The buttons become available as you complete each step.

### Wallet & Payouts

1. Go to **Wallet** in the vendor sidebar.
2. View your earnings and wallet balance.
3. See transaction history (credits from order commissions).
4. **Request Payout**: Enter the amount you want to withdraw and submit.
5. Payout requests go to the admin for approval.
6. Track your payout request history and their statuses (Pending, Approved, Rejected).

### Bank Details

1. Go to **Bank Details** in the vendor sidebar.
2. Add or update your bank account information for payouts:
   - Account holder name
   - Account number
   - IFSC code
   - Bank name

### Coupons

1. Go to **Coupons** in the vendor sidebar.
2. Create discount coupons for your products.
3. Set coupon parameters:
   - Coupon code
   - Discount type (percentage or fixed amount)
   - Discount value
   - Minimum order amount
   - Expiry date
4. Enable or disable coupons as needed.

### Documents

1. Go to **Documents** in the vendor sidebar.
2. Upload required business documents (GST certificate, PAN, etc.).
3. View the verification status of uploaded documents.

### Vendor Support

1. Go to **Support** in the vendor sidebar.
2. Create support tickets for platform-related issues.
3. Communicate with the admin team through ticket replies.

---

## Admin Guide

### Admin Dashboard

The admin dashboard provides a complete overview:

- **Total Vendors** - Number of registered vendors (and pending approvals)
- **Total Orders** - All orders across the platform
- **Total Revenue** - Platform-wide revenue
- **Total Commission** - Earnings from vendor commissions
- **Total Products** - All products listed on the platform

### Managing Vendors

1. Go to **Vendors** in the admin sidebar.
2. View all registered vendors with their status.
3. **Approve/Reject** pending vendor applications.
4. Click on a vendor to see their full details:
   - Business information
   - Products listed
   - Order history
   - Wallet balance and transactions

### Managing Products

1. Go to **Products** in the admin sidebar.
2. View all products across all vendors.
3. Monitor product listings for quality and compliance.

### Managing Orders

1. Go to **Orders** in the admin sidebar.
2. View all orders across the platform.
3. Filter by status, date, or vendor.
4. View detailed order information including payment and shipping status.

### Managing Users

1. Go to **Users** in the admin sidebar.
2. View all registered customers.
3. Manage user accounts as needed.

### Commission Management

1. Go to **Commissions** in the admin sidebar.
2. **Set Global Commission**: Define the default commission percentage for all vendors.
3. **Set Vendor-Specific Commission**: Override the global rate for individual vendors.
4. **Commission Slabs**: Set tiered commission rates based on order value.
5. Commission is automatically calculated on each order:
   - First checks vendor-specific override
   - Then applies global default
   - Falls back to 5% if nothing is configured

### Payout Management

1. Go to **Payouts** in the admin sidebar.
2. View all payout requests from vendors.
3. Filter by status (Pending, Approved, Rejected).
4. For each request:
   - **Approve** - Confirm the payout (add transaction reference).
   - **Reject** - Decline with an admin note explaining the reason.

### Coupon Management

1. Go to **Coupons** in the admin sidebar.
2. Create platform-wide coupons.
3. Manage and monitor all coupons (admin and vendor coupons).

### Support Tickets

1. Go to **Support** in the admin sidebar.
2. View all support tickets from customers and vendors.
3. Reply to tickets to resolve issues.
4. Track ticket statuses and resolution times.

### Document Verification

1. Go to **Documents** in the admin sidebar.
2. Review documents uploaded by vendors.
3. Approve or request re-upload of documents.

---

## Policies

The platform includes the following policy pages accessible from the footer:

- **Privacy Policy** - How user data is collected and used
- **Terms and Conditions** - Platform usage terms
- **Refund Policy** - Refund eligibility and process
- **Return Policy** - Return eligibility and process
- **Shipping Policy** - Shipping timelines and charges

---

## Frequently Asked Questions

**Q: How do I reset my password?**
A: Contact support through the Support section or the Contact page.

**Q: How long does delivery take?**
A: Delivery timelines depend on your location and the vendor's shipping. Check the Shipping Policy for details.

**Q: Can I cancel an order?**
A: Orders can be cancelled before they are shipped. Go to My Orders, select the order, and request cancellation.

**Q: How do refunds work?**
A: Approved refunds are credited to your wallet balance, which can be used for future orders.

**Q: How do I become a vendor?**
A: Visit the Vendor Onboarding page, fill in your business details, upload documents, and wait for admin approval.

**Q: How is vendor commission calculated?**
A: Commission is deducted from each order. The rate is set by the admin (vendor-specific rate or global default, minimum 5%).

**Q: How do vendor payouts work?**
A: Vendors request payouts from their wallet. The admin reviews and approves/rejects requests. Approved amounts are transferred to the vendor's registered bank account.

---

## Need Help?

- Use the **Support** section (available after login)
- Visit the **Contact** page
- Use the **WhatsApp** button on the bottom-right corner of the website
