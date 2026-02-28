# GameVault 🎮

GameVault is a full-stack web application designed for gamers to discover, track, and manage their video game collections. Built with the MERN stack and powered by the RAWG API, it provides a comprehensive database of games, personalized library management, and a unique system requirement comparison tool. 

## 🌐 Live Demo
* **Frontend:** [Your Vercel URL Here]
* **Backend API:** [Your Render URL Here]

## ✨ Features

### Core Functionality
* **Vast Game Discovery:** Browse a massive collection of games fetched via the RAWG API, complete with descriptions, genres, platforms, and metacritic ratings.
* **Library Management:** Categorize your personal gaming journey into four distinct lists: *Played*, *Want to Play*, *On Hold*, and *Dropped*.
* **Personalized Ratings:** Rate games on a granular scale of 0-100 to keep track of your true favorites.
* **System Spec Comparison (Beta):** Save your PC specifications and instantly compare them against a game's minimum and recommended system requirements.

### Technical & UI Features
* **Stylized Aesthetics:** Clean, minimalist design with a high-contrast art style inspired by modern RPGs, featuring smooth animations powered by Framer Motion.
* **Optimized Performance:** Implements infinite scrolling and React Query for seamless data caching and fetching.
* **Smart Search:** Fast, responsive search functionality utilizing debouncing on the client and fuzzy matching on the server.
* **Secure Authentication:** User registration and login protected by bcrypt password hashing and secure JWT cookies.

## 🛠️ Tech Stack

**Frontend (Deployed on Vercel):**
* React 19 (via Vite)
* React Router DOM 
* TanStack React Query 
* Framer Motion 
* RC-Slider 

**Backend (Deployed on Render):**
* Node.js & Express.js
* MongoDB & Mongoose
* JSON Web Tokens (JWT) & Cookie Parser 
* Bcrypt 
* Fast-Fuzzy 
* Axios 

## 🚀 Getting Started Locally

### Prerequisites
* Node.js installed on your machine
* A MongoDB database (local or Atlas)
* A free API key from [RAWG](https://rawg.io/apidocs)

### 1. Clone the repository
```bash
git clone [https://github.com/MAX5271/GameVault.git](https://github.com/MAX5271/GameVault.git)
cd GameVault

```

### 2. Setup the Backend

```bash
cd backend
npm install

```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
DATABASE_URI=<your_mongodb_uri_here>
ACCESS_TOKEN_SECRET=<your_access_token_secret_here>
REFRESH_TOKEN_SECRET=<your_refresh_token_secret_here>
RAWG_API_KEY=<your_rawg_api_key_here>

```

Start the backend server:

```bash
npm start

```

### 3. Setup the Frontend

```bash
cd ../frontend
npm install

```

Create a `.env` file in the `frontend` directory. For local development, point it to your local backend:

```env
VITE_API_URL="http://localhost:5000"

```

Start the frontend development server:

```bash
npm run dev

```

## ☁️ Deployment Notes

This project is configured for split deployment:

* **Frontend (Vercel):** Ensure your build command is set to `npm run build` and the output directory is `dist`. Add `VITE_API_URL` to your Vercel environment variables, pointing to your live Render backend URL.
* **Backend (Render):** Set up as a Web Service. Ensure the Build Command is `npm install` and the Start Command is `node index.js` (or your entry file). Add all backend `.env` variables to the Render dashboard. Make sure to configure CORS in your Express app to accept requests from your specific Vercel domain.

## 🗺️ Future Implementations

* **OAuth Integration:** Simplified user login.
* **Advanced Filtering:** Genre-based filtering across libraries and searches.
* **Recommendation Engine:** Personalized game suggestions based on user rating history.

