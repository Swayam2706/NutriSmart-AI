<div align="center">

<img src="frontend/public/favicon.svg" alt="NutriSmart AI Logo" width="64" height="64" />

# NutriSmart AI

### Eat Smart. Live Better.

**A full-stack AI-powered nutrition tracking web application** — personalized meal recommendations, calorie tracking, habit building, and smart food insights, all in one place.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Google Cloud](https://img.shields.io/badge/Google_Cloud-Run-4285F4?style=flat-square&logo=googlecloud)](https://cloud.google.com/run)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[Live Demo](#) · [Report Bug](https://github.com/Swayam2706/NutriSmart-AI/issues) · [Request Feature](https://github.com/Swayam2706/NutriSmart-AI/issues)

</div>

---

## 📸 Screenshots

| Landing | Dashboard | Tracker |
|---------|-----------|---------|
| ![Landing](https://placehold.co/400x250/3b82f6/white?text=Landing+Page) | ![Dashboard](https://placehold.co/400x250/8b5cf6/white?text=Dashboard) | ![Tracker](https://placehold.co/400x250/10b981/white?text=Tracker) |

| Recommendations | Habits | Login |
|-----------------|--------|-------|
| ![Recs](https://placehold.co/400x250/f59e0b/white?text=Recommendations) | ![Habits](https://placehold.co/400x250/ef4444/white?text=Habits) | ![Login](https://placehold.co/400x250/6366f1/white?text=Login) |

---

## ✨ Features

### 🧠 Smart Recommendations
- AI-powered food suggestions based on your **diet preference** (veg / non-veg) and **fitness goal** (lose / maintain / gain)
- Filter by meal time: Breakfast, Lunch, Snack, Dinner
- Full macro breakdown (protein, carbs, fat) per food item

### 📊 Daily Calorie Tracker
- Log meals from a rich food database (500+ items)
- Real-time calorie progress bar with goal tracking
- Delete meals and auto-recalculate totals
- BMR-based personalized daily calorie goal (Mifflin-St Jeor equation)

### 🎯 Habit Builder
- 4 default healthy habits with daily completion tracking
- Streak counter — consecutive day tracking with reset logic
- Visual completion celebration when all habits are done

### 🏠 Dashboard
- BMI calculation with category label (Underweight / Normal / Overweight / Obese)
- Calories consumed vs goal — animated progress ring + bar chart
- Quick action shortcuts to all features

### 🔐 Authentication
- JWT-based auth with 7-day token expiry
- 3-step registration wizard (Account → Body Stats → Goals)
- Secure password hashing with bcrypt (cost factor 12)

### 🎨 Premium UI/UX
- Blue → Violet gradient design system
- Glassmorphism cards + smooth Framer Motion animations
- Full dark mode support (system preference + manual toggle)
- Fully responsive — mobile, tablet, desktop
- Toast notifications, skeleton loaders, empty states

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| Vite 8 | Build tool |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animations |
| React Router v7 | Client-side routing |
| Axios | HTTP client |
| Recharts | Data visualization |
| React Hot Toast | Notifications |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database + ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| express-validator | Input validation |
| express-mongo-sanitize | NoSQL injection prevention |
| Helmet | Security headers |
| express-rate-limit | Rate limiting |
| Morgan | HTTP logging |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| Google Cloud Run | Serverless container hosting |
| Google Cloud Build | CI/CD pipeline |
| Google Secret Manager | Secrets management |
| MongoDB Atlas | Managed cloud database |
| Docker | Containerization |
| Nginx | Frontend static file serving |

---

## 📁 Project Structure

```
NutriSmart-AI/
├── backend/
│   ├── __tests__/              # Jest test suites
│   │   ├── auth.test.js        # Auth API tests
│   │   ├── tracker.test.js     # Tracker API tests
│   │   └── calculations.test.js # Unit tests for utils
│   ├── controllers/            # Route handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── foodController.js
│   │   ├── trackerController.js
│   │   └── habitController.js
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT protect middleware
│   │   ├── validate.js         # Validation error handler
│   │   └── validators.js       # express-validator rules
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── Food.js
│   │   ├── DailyTracker.js
│   │   └── HabitTracker.js
│   ├── routes/                 # Express routers
│   ├── utils/
│   │   ├── asyncHandler.js     # Async error wrapper
│   │   └── calculations.js     # BMI + calorie formulas
│   ├── data/
│   │   └── foodDataset.json    # Seed data
│   ├── Dockerfile
│   ├── .env.example
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx  # Sticky nav with mobile menu
│   │   │   │   └── Footer.jsx  # Dark themed footer
│   │   │   ├── ui/
│   │   │   │   ├── StatCard.jsx
│   │   │   │   ├── ProgressRing.jsx
│   │   │   │   ├── Spinner.jsx
│   │   │   │   ├── SkeletonCard.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   └── Toast.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx       # Split-screen with gradient panel
│   │   │   ├── Register.jsx    # 3-step wizard
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Tracker.jsx
│   │   │   ├── Recommendations.jsx
│   │   │   └── Habits.jsx
│   │   ├── services/
│   │   │   └── api.js          # Axios instance + interceptors
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css           # Design tokens + utilities
│   ├── Dockerfile
│   ├── nginx.conf
│   └── vite.config.js
│
├── cloudbuild.yaml             # GCP Cloud Build pipeline
├── DEPLOY.md                   # Deployment guide
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org)
- **MongoDB Atlas** account — [Sign up free](https://mongodb.com/atlas)
- **Git** — [Download](https://git-scm.com)

### 1. Clone the repository

```bash
git clone https://github.com/Swayam2706/NutriSmart-AI.git
cd NutriSmart-AI
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/nutrismart
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

### 3. Seed the food database

```bash
curl -X POST http://localhost:5000/api/foods/seed
```

### 4. Frontend setup

```bash
cd ../frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

### 5. Open the app

Visit **http://localhost:5173** — register an account and start tracking!

---

## 🔌 API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login + get token | ❌ |

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/users/profile` | Get profile + BMI + calorie goal | ✅ |

### Foods

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/foods` | Get all foods | ✅ |
| `GET` | `/api/foods/recommendations?timeOfDay=lunch` | Get personalized recommendations | ✅ |
| `POST` | `/api/foods/seed` | Seed food database | ❌ |

### Tracker

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/tracker/today` | Get today's tracking data | ✅ |
| `POST` | `/api/tracker/add` | Add a meal | ✅ |
| `DELETE` | `/api/tracker/meal/:mealId` | Remove a meal | ✅ |

### Habits

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/habits` | Get user habits | ✅ |
| `PUT` | `/api/habits/complete/:habitId` | Mark habit complete | ✅ |

---

## 🧪 Testing

```bash
cd backend
npm test
```

Test coverage includes:
- ✅ User registration (valid, duplicate, invalid fields)
- ✅ User login (correct/wrong credentials)
- ✅ Protected route access (with/without token)
- ✅ Meal add/delete with calorie recalculation
- ✅ Input validation (invalid timeOfDay, missing fields)
- ✅ BMI calculation unit tests
- ✅ Calorie needs calculation (lose/gain/maintain goals)

---

## 🔒 Security

- **Helmet** — sets 11 secure HTTP headers
- **Rate limiting** — 100 req/15min globally, 20 req/15min on auth routes
- **express-mongo-sanitize** — strips `$` and `.` from inputs (NoSQL injection prevention)
- **bcrypt** — passwords hashed with cost factor 12
- **JWT** — 7-day expiry, verified on every protected route
- **Input validation** — all endpoints validated with express-validator
- **CORS** — restricted to `FRONTEND_URL` env variable
- **Payload limit** — `express.json({ limit: '10kb' })` prevents large payload attacks

---

## ☁️ Deploy to Google Cloud Run

See the full guide in **[DEPLOY.md](DEPLOY.md)**.

**Quick summary:**

```bash
# 1. Enable GCP services
gcloud services enable run.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com

# 2. Store secrets
echo -n "mongodb+srv://..." | gcloud secrets create MONGODB_URI --data-file=-
echo -n "your-jwt-secret"   | gcloud secrets create JWT_SECRET --data-file=-

# 3. Deploy
gcloud builds submit --config cloudbuild.yaml .
```

---

## 🧮 Calorie Calculation

Uses the **Mifflin-St Jeor BMR equation** (gender-neutral average):

```
BMR = (10 × weight_kg) + (6.25 × height_cm) − (5 × age)
TDEE = BMR × 1.375  (lightly active)

Goal adjustments:
  Lose weight:     TDEE − 500 kcal
  Maintain:        TDEE
  Gain muscle:     TDEE + 500 kcal
  Minimum floor:   1200 kcal
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## 👤 Author

**Swayam Pawar**

- GitHub: [@Swayam2706](https://github.com/Swayam2706)

---

<div align="center">
  Made with ❤️ for healthier lives
</div>
