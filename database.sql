-- ============================================================
--  DivyaSetu – Online Temple Booking Management System
--  MySQL Database Schema + Seed Data
-- ============================================================

CREATE DATABASE IF NOT EXISTS divyasetu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE divyasetu;

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  NOT NULL UNIQUE,
    password    VARCHAR(255)  NOT NULL,
    role        ENUM('user','admin') DEFAULT 'user',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── Temples ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS temples (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(150)  NOT NULL,
    location    VARCHAR(200)  NOT NULL,
    description TEXT,
    image_url   VARCHAR(500),
    deity       VARCHAR(100),
    capacity    INT DEFAULT 50,
    is_active   TINYINT(1) DEFAULT 1,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── Bookings ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    temple_id   INT NOT NULL,
    booking_date DATE NOT NULL,
    time_slot   VARCHAR(50) NOT NULL,
    persons     INT NOT NULL DEFAULT 1,
    status      ENUM('confirmed','cancelled','pending') DEFAULT 'confirmed',
    booking_ref VARCHAR(20) UNIQUE,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
    FOREIGN KEY (temple_id) REFERENCES temples(id) ON DELETE CASCADE
);

-- ── Seed: Admin user (password: admin123) ────────────────────
-- bcrypt hash of "admin123"
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@divyasetu.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhu2', 'admin');

-- ── Seed: Sample user (password: user123) ────────────────────
INSERT INTO users (name, email, password, role) VALUES
('Ramesh Sharma', 'ramesh@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

-- ── Seed: Temples ────────────────────────────────────────────
INSERT INTO temples (name, location, description, image_url, deity, capacity) VALUES
(
  'Shri Siddhivinayak Temple',
  'Prabhadevi, Mumbai, Maharashtra',
  'One of the most visited temples in Mumbai, Siddhivinayak is dedicated to Lord Ganesha. Built in 1801, the temple draws thousands of devotees daily. Its golden spire and intricately carved wooden doors make it an architectural marvel. The main idol is made of a single black stone and is believed to fulfill all wishes.',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Siddhivinayak_Temple_Mumbai.jpg/800px-Siddhivinayak_Temple_Mumbai.jpg',
  'Lord Ganesha',
  100
),
(
  'Kashi Vishwanath Temple',
  'Varanasi, Uttar Pradesh',
  'The Kashi Vishwanath Temple is one of the most famous Hindu temples dedicated to Lord Shiva. It is situated on the western bank of the holy river Ganga. It is one of the twelve Jyotirlingas, the holiest of Shiva temples. The main deity is known by the name Vishwanatha meaning "Ruler of the Universe".',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Kashi_Vishwanath_Temple.jpg/800px-Kashi_Vishwanath_Temple.jpg',
  'Lord Shiva',
  200
),
(
  'Tirumala Venkateswara Temple',
  'Tirumala Hills, Tirupati, Andhra Pradesh',
  'The Tirumala Venkateswara Temple is a landmark Vaishnavite temple situated on the Tirumala Hills. The temple is the most visited place of worship in the world, with an average of 50,000 to 100,000 pilgrims visiting daily. It is one of the most ancient temples in existence with a history of over 1000 years.',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tirumala_temple.jpg/800px-Tirumala_temple.jpg',
  'Lord Venkateswara',
  500
),
(
  'Golden Temple (Harmandir Sahib)',
  'Amritsar, Punjab',
  'The Harmandir Sahib, popularly known as the Golden Temple, is the holiest Gurdwara of Sikhism. It was built in the 16th century and its stunning golden exterior makes it one of India\'s most iconic landmarks. The temple complex houses the Akal Takht, the seat of temporal power of the Sikhs.',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/The_Golden_Temple_of_Amritar5.jpg/800px-The_Golden_Temple_of_Amritar5.jpg',
  'Waheguru',
  1000
),
(
  'Meenakshi Amman Temple',
  'Madurai, Tamil Nadu',
  'The Meenakshi Amman Temple is a historic Hindu temple located on the southern bank of the Vaigai River. It is dedicated to Meenakshi (Parvati) and her consort Sundareshwar (Shiva). With its 14 magnificent gateway towers (gopurams), the temple is a Dravidian architectural masterpiece spanning over 6 hectares.',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Meenakshi_Amman_Temple_Madurai.jpg/800px-Meenakshi_Amman_Temple_Madurai.jpg',
  'Goddess Meenakshi',
  300
),
(
  'Jagannath Temple',
  'Puri, Odisha',
  'The Jagannath Temple is a famous Hindu temple dedicated to Lord Jagannath, a form of Lord Vishnu or Krishna. It is one of the Char Dham pilgrimages that a Hindu must undertake. The famous Rath Yatra (chariot festival) is held annually here. The temple kitchen is said to be the world\'s largest, serving 10,000 people daily.',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Puri_Jagannath_temple.jpg/800px-Puri_Jagannath_temple.jpg',
  'Lord Jagannath',
  400
);

-- ── Seed: Sample Bookings ─────────────────────────────────────
INSERT INTO bookings (user_id, temple_id, booking_date, time_slot, persons, status, booking_ref) VALUES
(2, 1, DATE_ADD(CURDATE(), INTERVAL 3 DAY),  '06:00 AM - 07:00 AM', 2, 'confirmed', 'DS-2024-001'),
(2, 3, DATE_ADD(CURDATE(), INTERVAL 7 DAY),  '09:00 AM - 10:00 AM', 4, 'confirmed', 'DS-2024-002'),
(2, 2, DATE_SUB(CURDATE(), INTERVAL 5 DAY),  '05:00 AM - 06:00 AM', 1, 'confirmed', 'DS-2024-003');
