# Affordmed URL Shortener - Frontend

## 📌 Overview

A modern React frontend for the Affordmed URL Shortener service. Users can shorten URLs (with optional custom shortcodes and expiry), view statistics, and interact with a backend logging service. Built with usability, error handling, and logging in mind.

---

## ✨ Features

- 🔗 Shorten single or multiple (bulk) URLs (up to 5 at once)
- 🧾 Custom shortcodes and expiration settings
- 📊 View URL statistics: clicks, referrers, locations
- 🔄 Automatic redirection from short links
- ⚙️ Centralized API calls with error handling
- 🧩 `ErrorBoundary` for React error capture
- 🛠️ Integrated frontend logging to backend

---

## 🛠️ Tech Stack

- **Frontend:** React.js, JavaScript (ES6+), CSS
- **UI Library:** Material-UI
- **Routing:** React Router DOM

---

## ⚙️ Prerequisites

- npm 

---

## 🚀 Getting Started

### 1. Clone or Navigate to the Project

```bash
git clone https://github.com/Divyasinha111/12222737.git
cd 12222737
```

_Or manually:_

```bash
cd C:\Users\divya\OneDrive\Desktop\new\test1
```

### 2. Install Dependencies

```bash
npm install

```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_AFFORDMED_EMAIL=your-email@example.com
REACT_APP_AFFORDMED_ROLL_NUMBER=your-roll-number
REACT_APP_AFFORDMED_NAME=Your Full Name
REACT_APP_AFFORDMED_ACCESS_CODE=your-access-code
```

> 💡 Replace placeholders with your actual details.

---

## 🧪 Running the App

Start the development server:

```bash
npm start

```

Then visit: [http://localhost:3000](http://localhost:3000)

---

## 📡 Backend API Endpoints

**Base URL:** `http://20.244.56.144/evaluation-service`

| Endpoint               | Description                     |
|------------------------|---------------------------------|
| `/register`            | Register the user               |
| `/auth`                | Authenticate and get token      |
| `/shorten`             | Shorten one or more URLs        |
| `/resolve/:shortCode`  | Resolve and redirect            |
| `/stats`               | Fetch global statistics         |
| `/stats/:shortCode`    | Stats for a specific short code |
| `/logs`                | Send app logs                   |

---

## 🛡️ Error Handling & Logging

- ✅ All API calls use robust error handling and fallback logic.
- 🧱 Errors in React components are caught by an `ErrorBoundary` and logged.
- 📤 App logs (`info`, `warn`, `error`, `fatal`) are sent to the backend via `/logs`.

---

## 🤝 Contributing

1. Fork this repository.
2. Create a feature branch:  
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes.
4. Push to your fork.
5. Submit a Pull Request.

---

snapshot :-<img width="1872" height="858" alt="image" src="https://github.com/user-attachments/assets/064418e0-d467-4335-a267-4044e011e93b" />


## 🔗 Useful Links

- 🔍 **Project Repo:** [https://github.com/Divyasinha111/12222737](https://github.com/Divyasinha111/12222737)  
- 👤 **GitHub Profile:** [https://github.com/Divyasinha111](https://github.com/Divyasinha111)

---

> Made with ❤️ for the Affordmed evaluation project.
