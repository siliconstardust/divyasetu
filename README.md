# 🕉 DivyaSetu – Online Temple Booking Management System

A complete, full-stack web application for booking darshan slots at temples across India.
Built with **Node.js + Express**, **EJS**, **MySQL**, and a hand-crafted spiritual UI theme.

---

## 📁 Folder Structure

```
divyasetu/
├── config/
│   └── db.js                  # MySQL connection pool
├── middleware/
│   └── auth.js                # Auth guards & session locals
├── public/
│   ├── css/
│   │   └── style.css          # Full stylesheet (saffron/gold theme)
│   ├── js/
│   │   └── main.js            # Frontend JS (spinner, nav, animations)
│   └── images/
│       ├── temple-placeholder.svg
│       └── temples/           # Uploaded temple images go here
├── routes/
│   ├── auth.js                # Login / Register / Logout
│   ├── temples.js             # Public temple listing & detail
│   ├── bookings.js            # Create & cancel bookings
│   ├── user.js                # User dashboard
│   └── admin.js               # Full admin panel (CRUD)
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── temples/
│   │   ├── index.ejs          # Temple listing with search
│   │   └── detail.ejs         # Single temple page
│   ├── bookings/
│   │   ├── new.ejs            # Booking form
│   │   └── confirmation.ejs   # Booking confirmed page
│   ├── user/
│   │   └── dashboard.ejs      # User bookings dashboard
│   ├── admin/
│   │   ├── dashboard.ejs      # Admin stats overview
│   │   ├── temples.ejs        # Manage temples
│   │   ├── temple-form.ejs    # Add/edit temple form
│   │   ├── bookings.ejs       # Manage all bookings
│   │   └── users.ejs          # View all users
│   ├── home.ejs               # Landing page
│   └── 404.ejs                # 404 page
├── .env                       # Environment variables
├── database.sql               # MySQL schema + seed data
├── package.json
├── server.js                  # Express app entry point
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js** v16+ → https://nodejs.org
- **MySQL** v8+ → https://dev.mysql.com/downloads
- **npm** (comes with Node.js)

---

## 🚀 Step-by-Step Setup

### Step 1 – Clone / Download the project

```bash
# If using git:
git clone <repo-url>
cd divyasetu

# Or just unzip the project folder and cd into it
cd divyasetu
```

### Step 2 – Install dependencies

```bash
npm install
```

### Step 3 – Set up the MySQL database

Open your MySQL client (MySQL Workbench, phpMyAdmin, or terminal):

```bash
mysql -u root -p
```

Then run the SQL file:

```sql
SOURCE /full/path/to/divyasetu/database.sql;
-- OR in MySQL Workbench: File > Run SQL Script > select database.sql
```

This creates the `divyasetu` database with all tables and sample data.

### Step 4 – Configure environment variables

Edit the `.env` file:

```env
PORT=3000
SESSION_SECRET=divyasetu_secret_key_2024_very_secure

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=divyasetu
```

Replace `YOUR_MYSQL_PASSWORD_HERE` with your actual MySQL root password.
If your MySQL user has no password, leave `DB_PASSWORD=` blank.

### Step 5 – Start the server

```bash
# Production mode:
npm start

# Development mode (auto-restart on file changes):
npm run dev
```

### Step 6 – Open in browser

```
http://localhost:3000
```

---

## 🔐 Demo Login Credentials

| Role  | Email                    | Password  |
|-------|--------------------------|-----------|
| Admin | admin@divyasetu.com      | admin123  |
| User  | ramesh@example.com       | user123   |

You can also use the **"Demo User"** and **"Admin"** buttons on the login page.

---

## 🗄️ Database Schema

### `users`
| Column     | Type         | Notes              |
|------------|--------------|--------------------|
| id         | INT PK AI    |                    |
| name       | VARCHAR(100) | Required           |
| email      | VARCHAR(150) | Unique             |
| password   | VARCHAR(255) | bcrypt hashed      |
| role       | ENUM         | 'user' or 'admin'  |
| created_at | DATETIME     | Auto               |

### `temples`
| Column      | Type         | Notes           |
|-------------|--------------|-----------------|
| id          | INT PK AI    |                 |
| name        | VARCHAR(150) | Required        |
| location    | VARCHAR(200) |                 |
| description | TEXT         |                 |
| image_url   | VARCHAR(500) | URL or local path|
| deity       | VARCHAR(100) |                 |
| capacity    | INT          | Default: 50     |
| is_active   | TINYINT(1)   | Default: 1      |

### `bookings`
| Column       | Type        | Notes                    |
|--------------|-------------|--------------------------|
| id           | INT PK AI   |                          |
| user_id      | INT FK      | → users.id               |
| temple_id    | INT FK      | → temples.id             |
| booking_date | DATE        |                          |
| time_slot    | VARCHAR(50) | E.g. "06:00 AM - 07:00 AM"|
| persons      | INT         | 1–20                     |
| status       | ENUM        | confirmed/cancelled/pending|
| booking_ref  | VARCHAR(20) | Unique reference code    |
| created_at   | DATETIME    |                          |

---

## 🌐 Pages & Routes

| URL                        | Description                        | Auth       |
|----------------------------|------------------------------------|------------|
| `/`                        | Home page with featured temples    | Public     |
| `/temples`                 | All temples with search/filter     | Public     |
| `/temples/:id`             | Individual temple detail page      | Public     |
| `/auth/login`              | Login form                         | Guest only |
| `/auth/register`           | Registration form                  | Guest only |
| `/auth/logout`             | Logout                             | Any        |
| `/bookings/new`            | Booking form                       | User       |
| `/bookings`                | POST: create booking               | User       |
| `/bookings/:id/cancel`     | Cancel a booking                   | User       |
| `/user/dashboard`          | User's booking dashboard           | User       |
| `/admin`                   | Admin dashboard with stats         | Admin      |
| `/admin/temples`           | Manage all temples                 | Admin      |
| `/admin/temples/new`       | Add a new temple                   | Admin      |
| `/admin/temples/:id/edit`  | Edit a temple                      | Admin      |
| `/admin/bookings`          | Manage all bookings                | Admin      |
| `/admin/users`             | View all registered users          | Admin      |

---

## ✨ Features

### User Module
- ✅ Register with email + password (bcrypt hashed)
- ✅ Login with session-based authentication
- ✅ Dashboard: upcoming bookings, past visits, stats
- ✅ Cancel upcoming bookings
- ✅ Form validation (frontend + backend)

### Temple Booking System
- ✅ Browse 6 pre-loaded Indian temples with images
- ✅ Search by name, location, or deity
- ✅ Temple detail page with slot timings
- ✅ 11 darshan time slots per day
- ✅ Capacity check (prevents overbooking)
- ✅ Unique booking reference ID generation
- ✅ Animated booking confirmation page with confetti

### Admin Module
- ✅ Admin dashboard with live stats
- ✅ Add, edit, delete temples
- ✅ Upload temple images (local file or URL)
- ✅ View and update booking statuses
- ✅ View all registered users with booking counts
- ✅ Filter bookings by status

### UI/UX
- ✅ Spiritual theme: saffron, gold, cream, deep brown
- ✅ Fully responsive (mobile + desktop)
- ✅ Lotus loading spinner
- ✅ Hero section with particle effects
- ✅ Scroll animations
- ✅ Flash messages (success/error)
- ✅ Mobile hamburger navigation
- ✅ Print-friendly confirmation page

---

## 🛠️ Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | HTML5, CSS3 (Flexbox/Grid), Vanilla JS |
| Fonts    | Cinzel, Playfair Display, Lato (Google Fonts) |
| Icons    | Font Awesome 6                    |
| Backend  | Node.js + Express.js              |
| Template | EJS (Embedded JavaScript)         |
| Database | MySQL + mysql2/promise            |
| Auth     | express-session + bcryptjs        |
| Upload   | Multer                            |
| Flash    | connect-flash                     |

---

## 🐛 Troubleshooting

**"Cannot connect to MySQL"**
→ Check DB_PASSWORD in .env matches your MySQL root password
→ Ensure MySQL service is running (`sudo service mysql start`)

**"Table 'divyasetu.users' doesn't exist"**
→ Run `database.sql` in MySQL first (Step 3)

**Port 3000 already in use**
→ Change `PORT=3001` in `.env`

**Images not loading**
→ The seed data uses Wikipedia image URLs; ensure you have internet access
→ Or upload local images via the Admin panel

---

## 📸 UI Preview

- **Home Page**: Dark hero with saffron gradient, particle effects, featured temple cards
- **Temples Page**: Responsive grid of temple cards with hover overlay
- **Booking Form**: Interactive slot selector, live summary, persons counter
- **Confirmation**: Animated checkmark, confetti burst, printable layout
- **Dashboard**: Stats cards, upcoming bookings with images, past visits table
- **Admin Panel**: Sidebar navigation, stat cards, filterable data tables

---

*Built with 🙏 devotion — DivyaSetu 2024*
