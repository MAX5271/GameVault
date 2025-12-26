# 🎮 GameVault

**GameVault** is a personal game tracking application designed to help users discover new titles and organize their gaming journey. It serves as a comprehensive library to keep track of games you have played, are currently playing, or plan to play in the future.

Powered by the [RAWG Video Games Database API](https://rawg.io/apidocs).

## ✨ Features
* **Search & Discover:** Browse a massive database of games with real-time search functionality.
* **Game Details:** View detailed information including Metacritic scores, genres, platforms, and descriptions.
* **Personal Library:** (Planned) Categorize games into "Played", "Playing", and "Wishlist".

## 🛠️ Tech Stack
* **Frontend:** React.js
* **Build Tool:** Vite
* **Styling:** CSS3 (Custom Glassmorphism & Responsive Flexbox)
* **API:** RAWG.io
* **Routing:** React Router DOM

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
* **Node.js** (Version 18 or higher recommended)
* **npm** (comes with Node.js)

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/game-vault.git](https://github.com/your-username/game-vault.git)
    cd game-vault
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    This project requires an API key from RAWG.
    * Get your free key at [https://rawg.io/apidocs](https://rawg.io/apidocs).
    * Create a file named `.env` in the root directory of the project.
    * Add your key using the following format:
        ```env
        VITE_API_KEY="YOUR_ACTUAL_API_KEY_HERE"
        ```

### 🏃‍♂️ Running the Project

Start the development server:

```bash
npm run dev