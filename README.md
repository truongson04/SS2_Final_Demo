# AI-Powered Resume Builder

A full-stack web application for creating, editing, and exporting professional resumes with AI-assisted content generation.

## Overview

This project provides an end-to-end resume building workflow, including:

- account authentication and session handling
- resume editing with structured sections
- AI assistance for resume content
- template-based visual rendering
- PDF export and related utilities

The repository is organized into two main apps:

- `client`: Vue 3 frontend built with Vite
- `server`: Node.js + Express API with MongoDB integration

## Key Features

- User authentication (email/password and OAuth flow support in backend dependencies)
- Resume CRUD management
- AI resume enhancement endpoints
- Multiple resume templates and live preview
- PDF-related processing and export flow
- Cloud/media integration via ImageKit

## Tech Stack

### Frontend

- Vue 3
- Vite
- Vue Router
- Pinia
- Tailwind CSS
- Axios

### Backend

- Node.js (ES Modules)
- Express
- MongoDB + Mongoose
- JWT + express-session
- Passport (Google OAuth strategy)
- Gemini API SDK (`@google/generative-ai`)
- Puppeteer
- Multer
- Nodemailer

## Project Structure

```text
SS2_Final_Demo/
|-- client/
|   |-- src/
|   |   |-- assets/
|   |   |-- components/
|   |   |-- composables/
|   |   |-- configs/
|   |   |-- pages/
|   |   |-- routes/
|   |   |-- App.vue
|   |   `-- main.js
|   |-- store/
|   |-- package.json
|   `-- vite.config.js
|-- server/
|   |-- config/
|   |-- controllers/
|   |-- middlewares/
|   |-- models/
|   |-- routes/
|   |-- index.js
|   `-- package.json
`-- README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm
- MongoDB instance (local or cloud)

### 1. Clone the repository

```bash
git clone https://github.com/truongson04/SS2_Final_Demo.git
cd SS2_Final_Demo
```

### 2. Install dependencies

Install client dependencies:

```bash
cd client
npm install
```

Install server dependencies:

```bash
cd ../server
npm install
```

## Environment Variables

Create a `.env` file inside `server/` and define values based on your setup.

Typical variables used by this stack include:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=your_google_callback_url
GEMINI_API_KEY=your_gemini_api_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
EMAIL_USER=your_smtp_user
EMAIL_PASS=your_smtp_password
CLIENT_URL=http://localhost:5173
```

Note: exact variable names may differ slightly depending on implementation in `server/config` and controllers.

## Run the Application

Start backend (from `server/`):

```bash
npm start
```

Start frontend (from `client/` in another terminal):

```bash
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## Available Scripts

### Client (`client/package.json`)

- `npm run dev`: start Vite development server
- `npm run build`: build for production
- `npm run preview`: preview production build

### Server (`server/package.json`)

- `npm start`: run server with Nodemon (`nodemon --inspect ./index.js`)

## API Modules

Main backend route groups:

- `routes/userRoute.js`
- `routes/resumeRoute.js`
- `routes/aiRoute.js`

Refer to route/controller files for endpoint-level details.

## Deployment Notes

Both `client/` and `server/` include `vercel.json`, indicating Vercel-based deployment configuration.

Before deploying, ensure:

- all required environment variables are configured on your hosting provider
- CORS and callback URLs match your production domain
- MongoDB/network access is correctly configured

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes with clear messages.
4. Open a pull request.

## License

This project is licensed under the ISC License (per `server/package.json`).

## Contact

- Repository: <https://github.com/truongson04/SS2_Final_Demo>
- Issues: <https://github.com/truongson04/SS2_Final_Demo/issues>
