# 💼 JobHub — AI-Powered Job Portal & Mock Interview Suite

JobHub is a state-of-the-art MERN-stack application that transforms the traditional job search and recruitment pipeline. By integrating cutting-edge language models (Groq AI & Gemini) alongside a fully-featured job recruitment system, JobHub provides candidates with interactive AI interview coaching and resume optimization tools while helping recruiters seamlessly manage top talent.

---

## 🌟 Key Features

### 🤖 AI Mock Interview Coach
* **Dynamic Question Generation:** Custom interviews tailored to 7 specialized domains (*ReactJS, JavaScript, Cybersecurity, MongoDB, OOPs in C++, Node.js, and System Design*) and adjustable difficulty levels (*Easy, Medium, Hard*).
* **Interactive Speech Recognition:** Uses the Web Speech API for real-time speech-to-text transcriptions as users speak their answers.
* **Camera Feed & Recording:** Integrates with `navigator.mediaDevices` to provide an interactive video preview and video/audio responses.
* **Granular Grading:** Groq-powered grading engine provides a scorecard (1-10 rating) with specific strengths, improvement tips, and a cumulative average tracking system.

### 📄 Resume ATS Analyzer
* **One-Click PDF Parsing:** Uses local extraction libraries (`pdfjs-dist` and `pdf-parse`) to parse text straight from the uploaded resume.
* **ATS Scoring System:** Evaluates overall ATS compatibility score (0-100%) in a single, high-speed pass.
* **Structural Ratings:** Scores key resume categories: Education, Experience, Skills, and Formatting.
* **Keyword Detection & Career Roadmap:** Highlights missing industry keywords required for ATS checks and outlines a recommended career progression roadmap.

### 💼 Recruiter Panel & Job Boards
* **Job Postings Management:** Recruiter-authenticated workflows to create, update, and manage job listings.
* **Advanced Job Search:** Multi-faceted search using keyword filters, job categories, salaries, and locations.
* **Premium Recruiter Subscriptions:** Integration for subscription tiers and premium access control.

### 🔐 Secure Authentication & Integration
* **Hybrid Auth System:** Traditional Email & Password (signed with JWT & HTTP-Only cookies) paired with Google Sign-in (via Firebase).
* **Email notifications:** Automatic transactional notifications powered by Nodemailer.

---

## 🛠️ Technology Stack

| Domain | Technologies |
|---|---|
| **Frontend Core** | React 18, Vite, Redux Toolkit, Redux Persist, React Router Dom |
| **Styling & UI** | TailwindCSS, Material UI, Framer Motion, GSAP, Lucide/React Icons, Swiper |
| **Backend Core** | Node.js, Express.js, MongoDB (Mongoose ORM) |
| **AI Evaluation** | Groq API, Gemini API, PDF-Parse, Web Speech API |
| **Authentication** | JWT, Firebase SDK (Google Auth) |
| **Communications** | Nodemailer, Cloudinary (File/Image Upload) |

---

## 📂 Project Structure

```text
JobHub-hackthon/
├── api/                    # Node.js + Express Backend
│   ├── config/             # DB and service configurations
│   ├── controllers/        # Request handling and logic
│   ├── middlewares/        # Authentication and error verification
│   ├── models/             # Mongoose schemas (User, Listing, etc.)
│   ├── routes/             # Express API routing endpoints
│   ├── services/           # Business logic layer
│   └── index.js            # Server entry point
├── client/                 # React + Vite Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI elements (Interviews, Home, Common)
│   │   ├── config/         # Firebase, Groq, and Prompts setups
│   │   ├── pages/          # Page layouts (AIInterview, Resume, Search, Profile)
│   │   ├── redux/          # State management (userSlice, store)
│   │   └── index.css       # Core Tailwind directives & styling tokens
│   └── package.json        # Frontend dependencies & scripts
├── package.json            # Root configuration & dev scripts
└── README.md               # Documentation
```

---

## 🚀 Getting Started

### 📋 Prerequisites
Ensure you have the following installed on your local machine:
* [Node.js](https://nodejs.org/) (v16+ recommended)
* [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)

### 🔧 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/narendrakumar5264/newjibhub.git
   cd JobHub-hackthon
   ```

2. **Install dependencies:**
   Install server-side dependencies at the root directory:
   ```bash
   npm install
   ```
   Install client-side dependencies:
   ```bash
   npm install --prefix client
   ```

3. **Configure Environment Variables:**
   * Create a `.env` file in the **root** folder based on `.env.example`:
     ```env
     MONGO=your_mongodb_connection_url
     JWT_SECRET=your_jwt_signing_secret
     EMAIL_PASS=your_gmail_app_password
     CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     CLOUDNARY_API=your_cloudinary_api_key
     CLOUDNARY_SECRET=your_cloudinary_api_secret
     ```
   * Create a `.env` file inside the **`client`** folder:
     ```env
     VITE_GROQ_API_KEY=your_groq_api_key
     VITE_FIREBASE_API_KEY=your_firebase_api_key
     ```

### 💻 Running Locally

You can run both the server and client concurrently or separately:

* **Start the Express backend:**
  ```bash
  npm run dev
  ```
  *The backend server runs on `http://localhost:3000` (or the port defined in index.js).*

* **Start the Vite frontend dev server:**
  ```bash
  npm run dev --prefix client
  ```
  *The React frontend will load on `http://localhost:5173`.*

---

## 📈 Verification & Testing
* Open `http://localhost:5173` to verify client-side routing.
* Test Google Sign-in flow to verify Firebase credentials.
* Upload a sample PDF resume in the **Resume ATS Analyzer** to confirm PDF parsing and Groq API response.
* Open the **AI Interview Coach**, select a topic, and record/type answers to verify real-time speech processing and evaluation feedback.

---

## 🤝 Contributing
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License
Distributed under the ISC License. See `package.json` for details.
