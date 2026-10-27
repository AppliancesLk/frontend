# 🛍️ Appliances.lk — Frontend

\<p align="center">
&#x20; \<strong>Modern Mobile Accessories Marketplace & Device Repair Service Platform\</strong>
\</p>

\<p align="center">
&#x20; Built with React • TypeScript • Vite • Tailwind CSS
\</p>

---

## 🌟 About Appliances.lk

**Appliances.lk** is a full-stack e-commerce and repair-service platform designed to provide customers with a simple and modern way to:

- 🛒 Browse and purchase mobile devices and accessories
- 🔍 Search and filter products
- 🛍️ Manage shopping carts and orders
- 💳 Complete payments through supported payment methods
- 🎁 Earn and redeem loyalty rewards
- ⭐ Review purchased products
- 🔧 Submit mobile-device repair requests
- 📋 Track repair progress
- 💬 Chat with administrators through live chat
- 🤖 Ask the AI product assistant questions about products
- 🔔 Receive account, order, repair, and promotional notifications
- 🎨 Experience seasonal storefront themes and promotional campaigns

The frontend communicates with the **Appliances.lk NestJS backend API** and is deployed using **Azure Container Apps**.

---

# 🚀 Live Environments

## 🧪 Development / Staging

🌐 **Frontend**

[https://appliances-web-dev.graysky-2e2a33e6.centralindia.azurecontainerapps.io](https://appliances-web-dev.graysky-2e2a33e6.centralindia.azurecontainerapps.io)

This environment is used for integration testing and development verification before production deployment.

### 👤 Customer Test Account

| Field        | Value                        |
| ------------ | ---------------------------- |
| **Role**     | Customer                     |
| **Email**    | `induwaramihisara@gmail.com` |
| **Password** | `123456789`                  |

### 🛡️ Admin Test Account

| Field        | Value     |
| ------------ | --------- |
| **Role**     | Admin     |
| **Username** | `admin`   |
| **Password** | 123456789 |

> **Note:** The admin password above corresponds to the development seed account when the default seed password is used.

---

# 🌍 Production

🌐 **Frontend**

[https://appliances-web-prod.nicehill-aa13b60f.centralindia.azurecontainerapps.io](https://appliances-web-prod.nicehill-aa13b60f.centralindia.azurecontainerapps.io)

### 👤 Customer Demo Account

| Field        | Value                        |
| ------------ | ---------------------------- |
| **Role**     | Customer                     |
| **Email**    | `induwaramihisara@gmail.com` |
| **Password** | `123456789`                  |

### 🛡️ Admin Account

The production admin account was created through the administrative seeding process.

| Field        | Value                               |
| ------------ | ----------------------------------- |
| **Role**     | Admin                               |
| **Username** | `admin`                             |
| **Password** | ⚠️ Use the production seed password |

> The production admin password is intentionally not written here until it is verified against the production seed configuration. Do not guess or publish an incorrect production credential.

---

# 🧱 Technology Stack

### Frontend

- ⚛️ **React**
- 🔷 **TypeScript**
- ⚡ **Vite**
- 🎨 **Tailwind CSS**
- 🧭 Client-side routing
- 📡 REST API integration
- 🔐 Role-based user interfaces
- 💬 Real-time live-chat integration

### Backend Integration

The frontend communicates with a backend built using:

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT-based authentication
- Azure Blob Storage
- Gemini AI
- PayHere
- Email notifications

---

# 👥 Supported User Roles

The platform contains three main roles.

### 👤 Customer

Customers can:

- Register and log in
- Browse products and categories
- Search and filter products
- View detailed product information
- Add products to the cart
- Place orders
- Complete payments
- Track orders
- Earn and redeem loyalty points
- Submit product reviews
- Request device repairs
- Track repair tickets
- Communicate with administrators
- Use the AI product assistant

### 🛡️ Admin

Administrators can:

- Manage users
- Manage products
- Manage categories
- Manage inventory
- Process and monitor orders
- Review repair requests
- Assign repair technicians
- Manage promotions
- Manage banner content
- Manage seasonal storefront themes
- Communicate with customers
- Monitor platform activity

### 🔧 Repairer

Repair personnel can:

- Access assigned repair requests
- View device and issue information
- Update repair progress
- Move repair tickets through supported repair statuses

---

# 🛒 E-Commerce Features

The Appliances.lk storefront supports a complete shopping journey.

```text
Browse Products
      ↓
View Product
      ↓
Add to Cart
      ↓
Checkout
      ↓
Select Payment Method
      ↓
Place Order
      ↓
Track Order
      ↓
Delivery
```

Supported platform functionality includes:

- Product catalog
- Categories
- Product specifications
- Product images
- Product ratings and reviews
- Shopping cart
- Order history
- Order status tracking
- Inventory management
- Loyalty rewards
- Promotional campaigns

---

# 🔧 Repair Service

Appliances.lk is more than an e-commerce application.

Customers can submit repair requests for their devices directly through the platform.

Typical repair lifecycle:

```text
PENDING
   ↓
APPROVED
   ↓
ASSIGNED
   ↓
IN_PROGRESS
   ↓
READY_FOR_COLLECTION
   ↓
COMPLETED
```

Additional states such as rejection, awaiting parts, and cancellation are also supported.

---

# 🤖 AI Product Assistant

The application contains an AI-powered product assistant that helps customers understand products more easily.

Customers can ask questions about:

- Product specifications
- Features
- Compatibility
- Product differences
- Recommended use cases
- Related product information

The backend integrates with **Google Gemini** for AI-powered responses.

---

# 💬 Live Chat

Customers can communicate directly with administrators through the integrated live-chat feature.

The chat system supports:

- Customer ↔ Admin communication
- Multiple chat sessions
- Unread message tracking
- Session history
- Message limits
- Chat status management

---

# 🔔 Notification System

Appliances.lk provides email notifications for important events including:

- Welcome messages
- Login activity
- Email verification
- Password reset
- Order creation
- Payment success
- Payment failure
- Order status changes
- Repair request creation
- Repair approval or rejection
- Repair status updates
- Repair ready-for-collection alerts
- Promotional campaigns

---

# 🎨 Storefront Experience

The frontend includes dynamic promotional and seasonal functionality.

Supported seasonal storefront themes include:

- 🎉 Default
- 🌞 Avurudu
- 🎄 Christmas
- 🎃 Halloween
- 🐰 Easter

Administrators can also manage:

- Hero banners
- Promotional sections
- Campaign content
- Storefront messages
- Visual decorations
- Animations

---

# 🏗️ Deployment Architecture

```text
                    ┌──────────────────────────┐
                    │        Customer          │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │   React Frontend         │
                    │ Azure Container Apps     │
                    └────────────┬─────────────┘
                                 │
                              /api
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │     NestJS Backend       │
                    │ Azure Container Apps     │
                    └──────┬─────────┬─────────┘
                           │         │
                  ┌────────┘         └──────────┐
                  ▼                             ▼
        ┌──────────────────┐         ┌──────────────────┐
        │ PostgreSQL       │         │ Azure Blob      │
        │ Flexible Server  │         │ Storage         │
        └──────────────────┘         └──────────────────┘
```

Production infrastructure is provisioned using **Terraform**.

---

# 🐳 Containerization

The frontend is packaged using Docker and served through **Nginx**.

The production Nginx configuration dynamically receives the backend host through:

```text
BACKEND_HOST
```

Frontend API requests use:

```text
/api
```

Nginx then proxies those requests to the production backend.

This allows the same frontend architecture to be deployed across multiple environments without hardcoding a backend URL.

---

# 🩺 Production Health

The production frontend-to-backend-to-database path has been verified successfully.

```text
Frontend
   ↓
Nginx /api Proxy
   ↓
NestJS Backend
   ↓
PostgreSQL
```

Production database health endpoint:

```text
/api/health/database
```

Expected healthy response:

```json
{
  "status": "ok",
  "database": "connected"
}
```

---

# 🏷️ Releases

### Frontend

**Current production configuration release**

```text
v1.0.1
```

`v1.0.1` includes the production Nginx backend configuration required for the Azure production deployment.

### Initial Release

```text
v1.0.0
```

The original application release containing the Sprint 8 production feature set.

---

# 💻 Local Development

Clone the repository:

```bash
git clone https://github.com/AppliancesLk/frontend.git
```

Enter the project:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open the local URL displayed by Vite.

---

# 🧪 Quality Assurance

The project includes automated frontend testing as part of the overall Appliances.lk quality assurance process.

Testing areas include:

- Authentication
- Customer workflows
- Administrative functionality
- Product interfaces
- Cart and checkout
- Order workflows
- Repair services
- Notifications
- Live chat
- AI-assisted functionality

The overall project testing process also includes:

- Unit testing
- Integration testing
- End-to-end scenarios
- Performance testing
- Security validation

---

# 🔐 Security Notice

The credentials above are **demo/test credentials provided for project evaluation**.

Do not place:

- API keys
- database passwords
- JWT secrets
- email app passwords
- payment secrets
- Azure credentials

inside this repository.

Sensitive application configuration must be supplied through secure environment variables or deployment secrets.

---

# 🎓 Academic Project

**Appliances.lk** was developed as a university Software Engineering group project.

The project demonstrates practical application of:

- Software architecture
- Full-stack development
- REST API development
- Authentication and authorization
- Database design
- Cloud deployment
- Infrastructure as Code
- Containerization
- CI/CD concepts
- Software testing
- Security practices
- AI integration

---

# ❤️ Appliances.lk

\<p align="center">
&#x20; \<strong>Shop Smart • Repair Easy • Stay Connected\</strong>
\</p>

\<p align="center">
&#x20; Built by the Appliances.lk development team.
\</p>
