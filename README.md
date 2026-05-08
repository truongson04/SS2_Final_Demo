# 🚀 AI-Powered Resume Builder & Mock Interview Platform

A comprehensive full-stack web application designed to empower users in their job search journey. It provides a robust, intuitive resume builder with AI-assisted content generation, alongside an interactive AI mock interview module to practice and refine interview skills.

## 📖 Project Overview

This project delivers an end-to-end career preparation workflow. It goes beyond simple resume formatting by integrating advanced AI capabilities. Users can create professional resumes using rich-text editing, get smart suggestions from AI, export them to pixel-perfect PDFs, and even practice for their actual interviews using text and voice-based AI modules.

The repository is organized into a monorepo structure containing:

- `client`: A reactive and modern frontend built with Vue 3 and Vite.
- `server`: A robust RESTful API backend built with Node.js, Express, and MongoDB.

## Member list
Group 02 (SS2-CLC-02)  
Vũ Thị Xuân- 2301140104  
Lê Như Quỳnh - 2301140084  
Bạch Đăng Trường Sơn- 2201140075  

## 🛠 Tech Stack

### Frontend

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Routing & State**: Vue Router, Pinia
- **Styling**: Tailwind CSS
- **Editor**: Tiptap (Rich Text Editor)
- **HTTP Client**: Axios

### Backend

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, express-session, Passport.js (Google OAuth strategy)
- **AI Integration**: `@google/generative-ai` (Gemini API SDK)
- **PDF Generation**: Puppeteer
- **File Uploads**: Multer, ImageKit
- **Email Services**: Nodemailer

## ✨ Key Features

- **Advanced Resume Builder**: Built with Tiptap rich-text editor, offering structural formatting, multiple professional templates, and a live preview.
- **AI-Assisted Resume Enhancement**: Leverage Google's Gemini AI to generate impactful bullet points, summarize experiences, and refine resume content.
- **Interactive AI Mock Interviews**:
  - **Text-based Chat**: Practice interview questions in a conversational chat interface.
  - **Live Voice Interviews**: Real-time mock interviews utilizing Speech-to-Text (STT) and Text-to-Speech (TTS) for a realistic interview experience.
- **Secure Authentication & Authorization**: Supports standard email/password login as well as Google OAuth. Includes role-based routing (e.g., dedicated Admin dashboard redirection).
- **High-Quality PDF Export**: Reliable resume rendering and PDF generation mechanisms.
- **Cloud Media Management**: Seamless user avatar and asset uploads managed via ImageKit and Multer.

## 📂 Project Structure

```text
SS2_Final_Demo/
├── client/                     # Frontend Application
│   ├── src/
│   │   ├── assets/             # Static assets (images, fonts)
│   │   ├── components/         # Reusable Vue components (UI elements)
│   │   ├── composables/        # Vue composables (e.g., useTheme for dark mode)
│   │   ├── configs/            # Client-side configuration files
│   │   ├── pages/              # Application views (ResumeBuilder, Interview, Analysis, etc.)
│   │   ├── routes/             # Vue Router configuration
│   │   ├── store/              # Pinia state management stores
│   │   ├── App.vue             # Root component
│   │   └── main.js             # Frontend entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend API
│   ├── config/                 # Database and service configurations
│   ├── controllers/            # Request handlers (auth, resume, ai, users)
│   ├── middlewares/            # Custom Express middlewares (auth protection, upload)
│   ├── models/                 # Mongoose database schemas
│   ├── routes/                 # API route definitions
│   ├── index.js                # Server entry point
│   └── package.json
│
└── README.md                   # Project documentation
```

## 💻 Getting Started (Detailed Setup Guide)

Follow these step-by-step instructions to set up the project on your local machine.

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18.x or higher recommended)
- **npm** (Node Package Manager)
- **Git**
- **MongoDB**: You can install MongoDB locally or use a free cloud cluster from [MongoDB Atlas](https://www.mongodb.com/atlas/database).

### Step 1: Clone the Repository (if you already have our source code, you can skip this step)

Open your terminal and run:

```bash
git clone https://github.com/truongson04/SS2_Final_Demo.git
cd SS2_Final_Demo
```

### Step 2: Install Dependencies

You need to install dependencies for both the frontend (`client`) and the backend (`server`).

**Install Client Dependencies:**

```bash
cd client
npm install
```

**Install Server Dependencies:**

```bash
cd ../server
npm install
```

### Step 3: Configure Environment Variables

The backend requires several environment variables to connect to external services (Database, OAuth, AI, Cloud Storage).

1. Inside the `server/` directory, create a new file named `.env`.
2. Copy the following template into your `.env` file and fill in the actual values:

```env
# Server Configuration
PORT=3600
CLIENT_URL=http://localhost:5173
NODE_ENV=develop

# MongoDB Configuration
MONGO_URL=your_mongodb_connection_string

# Authentication Secrets
JWT_SECRET=a_very_strong_random_jwt_secret_string
SESSION_SECRET=a_very_strong_random_session_secret_string

# Google OAuth Credentials (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3600/api/users/auth/google/callback

# GitHub OAuth Credentials (Get from GitHub Developer Settings)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3600/api/users/auth/github/callback

# Gemini AI (Get from Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3-flash-preview
VOICE_KEY=your_voice_api_key
VOICE_MODEL=gemini-2.5-flash-preview-tts

# ImageKit (For Avatar Uploads - Get from ImageKit.io)
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key

# Email/SMTP Settings (For sending notifications/password resets)
AUTH_EMAIL=your_smtp_user_email
PASS_AUTH_EMAIL=your_smtp_password_or_app_password
```
The frontend only need 1 environmental variable, inside `/client` directory, create .env file and copy this into it 
```env
VITE_BASE_URL='http://localhost:3600'
```

#### How to get the keys:

- **MongoDB URL**: If using Atlas, click "Connect" -> "Connect your application" and copy the connection string. Replace `<password>` with your database user password.
- **Google OAuth**: Go to the Google Cloud Console, create a project, set up the OAuth consent screen, and create Web Application Credentials to get the ID and Secret.
- **GitHub OAuth**: Go to GitHub -> Settings -> Developer settings -> OAuth Apps, register a new application to get the ID and Secret.
- **Gemini AI**: Visit [Google AI Studio](https://aistudio.google.com/) and generate API keys for standard features and voice TTS.
- **ImageKit**: Sign up at [ImageKit.io](https://imagekit.io/), go to the Developer section, and copy your Private Key.

### Step 4: Run the Application

You need to run both the backend server and the frontend development server simultaneously. It's recommended to use two separate terminal windows/tabs.

**Terminal 1: Start the Backend Server**

```bash
cd server
npm start
```

_The server should start running at `http://localhost:3600` and indicate a successful MongoDB connection._

**Terminal 2: Start the Frontend Application**

```bash
cd client
npm run dev
```

_The Vite development server will start and provide a local URL, usually `http://localhost:5173`._

Open your web browser and navigate to `http://localhost:5173` to view the application!

## 📜 Available Scripts

### Client (`client/`)

- `npm run dev`: Starts the Vite development server with Hot-Module Replacement (HMR).
- `npm run build`: Compiles and minifies the application for production.
- `npm run preview`: Locally previews the built production application.

### Server (`server/`)

- `npm start`: Starts the backend server using Nodemon for automatic restarts upon file changes (`nodemon --inspect ./index.js`).

### Demo account

- **Normal user** Email: vobin53175@keecs.com/ password: 123
- **Admin** : Email: wifeba1054@desiys.com/ password : 123

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the project, please follow these steps:

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 📧 Contact

- **Repository**: [https://github.com/truongson04/SS2_Final_Demo](https://github.com/truongson04/SS2_Final_Demo)
- **Issue Tracker**: [https://github.com/truongson04/SS2_Final_Demo/issues](https://github.com/truongson04/SS2_Final_Demo/issues)
