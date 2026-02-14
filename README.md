# AI-Powered Resume Builder Website 

A simple, full-stack website that allows users to create CVs with AI enhancement.  
This project contains both a Vue.js frontend and a Node.js backend API, organized in separate folders for clear structure and ease of development.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Frontend (Client)](#frontend-client)
- [Backend (Server)](#backend-server)
- [Getting Started](#getting-started)
- [Tech Stack](#tech-stack)
- [License](#license)
- [Contact](#contact)

---

## Overview

 A website that allows users to create, manage, and enhance professional resumes/CVs with the assistance of AI technologies. The website provides user authentication, PDF upload, advanced AI-based content improvement, multiple template selection, and personalized dashboard features. Its main goal is to help users generate modern, compelling resumes quickly while leveraging AI for optimal wording and design.


---

## Features

- **AI-Powered Suggestions:** Enhance your CV content with intelligent recommendations.
- **Section Editing:** Modify personal info, education, experience, skills, projects, and more.
- **Real-time Preview:** Instantly see your CV as you build it.
- **PDF Download:** Export your completed CV to PDF.
- **User Authentication:** (if implemented) Register/login to save and manage your CVs.
- **Cloud Storage:** (if implemented) Save your CVs to the cloud for future editing.


---

## Project Structure

```
SS2_Final_Demo/
│
├── client/              # Frontend (Vue.js, Vite, TailwindCSS)
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── composables/
│   │   ├── configs/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── App.vue
│   │   ├── main.js
│   │   └── style.css
│   ├── store/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── ...
│
├── server/              # Backend (Node.js/Express)
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.js       # Entry point
│   ├── package.json
│   └── ...
│
├── README.md
└── package-lock.json
```

---

## Frontend (Client)

The frontend is built with [Vue.js 3](https://vuejs.org/) and [Vite](https://vitejs.dev/), styled with [Tailwind CSS](https://tailwindcss.com/).

### Main folders:

- **`src/components/`**: Reusable UI components (forms, previews, inputs, dialogs, etc.)
- **`src/pages/`**: Page-level Vue components (Home, CV Editor, Login, etc.)
- **`src/routes/`**: Routing and navigation setup.
- **`src/composables/`**: Vue composition logic and custom hooks.
- **`store/`**: Pinia/Vuex (state management) modules.

### Key configuration:

- **Development server:** Vite (`npm run dev`)
- **Styling:** Tailwind CSS
- **API Communication:** Axios (calls to backend server)

### Usage

```bash
cd client
npm install
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173).

---

## Backend (Server)

The backend is structured with [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/).

### Main folders:

- **`src/controllers/`**: Business logic and request handlers.
- **`src/models/`**: Data models and database schemas (if any, e.g. MongoDB).
- **`src/routes/`**: Express route definitions (e.g., `/api/cv`, `/api/auth`).
- **`src/services/`**: Service modules (AI integration, PDF generation, etc.).
- **`src/middlewares/`**: Authentication, logging, error handling.
- **`src/utils/`**: Utility/helper functions.
- **`src/index.js`**: Main entry, sets up Express server.
- **`package.json`**: Backend dependencies.

### Usage

```bash
cd server
npm install
npm start
```
The backend runs by default on [http://localhost:3000](http://localhost:3000).

---

## Getting Started

1. **Clone the repo**
    ```bash
    git clone https://github.com/truongson04/SS2_Final_Demo.git
    cd SS2_Final_Demo
    ```

2. **Setup the Backend**

    ```bash
    cd server
    npm install
    npm start
    ```

3. **Setup the Frontend**

    In another terminal window:
    ```bash
    cd client
    npm install
    npm run dev
    ```

4. **Open the app**

    - Frontend: [http://localhost:5173](http://localhost:5173)
    - Backend API: [http://localhost:3000](http://localhost:3000)

---

## Tech Stack

- **Frontend**  
  - Vue.js 3
  - Vite
  - Tailwind CSS
  - Pinia 
  - Axios

- **Backend**  
  - Node.js
  - Express
  - Gemini API

---

## License

MIT License

---

## Contact

- Author: [truongson04](https://github.com/truongson04)
- Issues: [Open an Issue](https://github.com/truongson04/SS2_Final_Demo/issues)

---

> *Note: Some features (e.g. authentication, cloud storage, or AI) depend on backend implementation details. Please check the `server/` directory and route docs for actual capabilities and endpoints.*
