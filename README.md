

# OxideCMS Web Client

Welcome to **OxideCMS Web**, a modern, fast, and offline-first client for your content, built with Preact and Vite. This project is designed to deliver a seamless and performant reading experience for any content-driven platform.


#### **This is the front-end client. For details on the backend that powers these features (API, search logic, etc.), please visit the OxideCMS Core Backend repository. https://github.com/a-s-l-a-h/oxidecms-core-backend**

## ✨ Features

*   **Blazing Fast Performance**: Built with Preact and Vite for near-instant loading and Hot Module Replacement (HMR) during development.
*   **Offline First**: Read your favorite articles even without an internet connection. Posts can be saved for offline access using IndexedDB.
*   **Powerful Search**: A fast, debounced search implementation to quickly find articles.
*   **Dynamic Filtering**: Easily filter posts by tags to discover content that interests you.
*   **PWA Ready**: Installable as a Progressive Web App for a native-like experience on any device.
*   **Dark Mode**: A sleek, eye-friendly dark theme that can be toggled on and off and is saved to user preferences.
*   **Responsive Design**: A beautiful and functional interface on desktops, tablets, and mobile devices.

## 🎥 Demo Video




https://github.com/user-attachments/assets/9298699e-55dc-4ea6-b539-207c2454c216




## 🚀 Tech Stack

*   **Framework**: [Preact](https://preactjs.com/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Routing**: [preact-router](https://github.com/preactjs/preact-router)
*   **Offline Storage**: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) via the `idb` library
*   **Icons**: [Lucide](https://lucide.dev/)

## 📂 Project Structure

The project follows a standard and scalable structure for a modern front-end application.

```
/
├── public/ # Static assets (icons, etc.)
├── src/ # Main application source code
│   ├── components/ # Reusable Preact components (Header, Sidebar, etc.)
│   ├── pages/ # Page-level components used for routing (Home, PostDetail)
│   ├── services/ # Logic for API calls (api.js) and IndexedDB (db.js)
│   ├── store/ # Global state management with Zustand (store.js)
│   ├── utils/ # Helper functions (date formatting, URL resolving, etc.)
│   ├── App.jsx # The main application component with router setup
│   ├── index.jsx # The entry point where the Preact app is mounted
│   └── style.css # Global styles and Tailwind CSS base imports
├── .env.development # Environment variables for local development
├── .env.production # Environment variables for production builds
├── index.html # The main HTML entry point for Vite
├── package.json # Project dependencies and scripts
├── postcss.config.js # PostCSS configuration (for Tailwind/Autoprefixer)
├── tailwind.config.js # Tailwind CSS theme and content configuration
└── vite.config.js # Vite build and PWA plugin configuration
```

## 🏁 Getting Started

Follow these instructions to get a local copy of the project up and running on your machine.

### Prerequisites

You need to have Node.js (version 18 or higher is recommended) and npm installed on your system.

*   [Node.js](https://nodejs.org/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/a-s-l-a-h/oxidecms-web.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd oxidecms-web
    ```

3.  **Install the dependencies:**
    ```sh
    npm install
    ```

### Environment Variables

This project uses environment variables to configure the API endpoint. You'll need to create two `.env` files in the root of the project.

1.  **Create a development environment file:**
    Create a file named `.env.development` and add the following content. This file is used when you run the development server.

    ```env
    # .env.development

    # The base URL for your local server.
    # This should point to where your backend API is running.
    VITE_BASE_URL=http://localhost:8080
    ```

2.  **Create a production environment file:**
    Create a file named `.env.production` and add the following content. This is used when building the project for deployment.

    ```env
    # .env.production

    # The base URL for your live production server.
    VITE_BASE_URL=https://
    ```

## 📜 Available Scripts

In the project directory, you can run the following commands:

### `npm run dev`

This command starts the Vite development server. Open [http://localhost:5173](http://localhost:5173) to view the application in your browser. The page will automatically reload if you make edits to the code, thanks to Hot Module Replacement (HMR).

### `npm run build`

This command builds the app for production. The optimized and minified files will be generated in the `dist/` directory. It correctly bundles Preact in production mode and configures the Service Worker for PWA capabilities.

### `npm run preview`

This command starts a local server to preview the production build from the `dist/` directory. It's an essential tool for testing the final, optimized app and the Service Worker behavior before deploying it.

