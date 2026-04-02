# Video Playlist Manager

**Assessment 1.2 (Total Marks 20)**

Assignment: **Software requirements analysis and design (Full-Stack CRUD Application Development with DevOps Practices)**

---

**Objective**

A full-stack CRUD web application that allows users to create, manage, and organise video playlists. The system includes user authentication, playlist management, video management, and search and filter functionality. Built with React.js, Node.js, Express, and MongoDB, extended from the provided starter project.

In this assignment, the following tasks have been completed:

* **Basic Version Control using GitHub**
* **Development, CI/CD Integration for Automated Deployment**
* **Project report**

---

**GitHub link of the starter project:** [https://github.com/nahaQUT/sampleapp_IFQ636.git](https://github.com/nahaQUT/sampleapp_IFQ636.git)

---

**GitHub Repository:** [https://github.com/minh25072003/IFN636](https://github.com/minh25072003/IFN636)

**Public URL:** http://3.25.216.63

---

## Features

* User registration, login, and logout
* Create, edit, and delete playlists
* Add, edit, remove, and reorder videos within playlists
* Search videos by title (not yet implemented)
* Filter videos by category (not yet implemented)
* JWT-based authentication
* Responsive UI with dark theme

---

## Tech Stack

**Frontend:** React.js, Tailwind CSS, Axios

**Backend:** Node.js, Express.js

**Database:** MongoDB (Atlas)

**DevOps:** GitHub Actions (CI/CD), AWS EC2, PM2, Nginx

---

## Getting Started

### Prerequisites

* Node.js v18+
* MongoDB Atlas account
* npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/minh25072003/IFN636.git
cd IFN636
```

2. Set up the backend:

```bash
cd backend
npm install
```

3. Create a `.env` file in the `backend` folder:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

4. Start the backend:

```bash
npm start
```

5. Set up the frontend:

```bash
cd ../frontend
npm install
npm start
```

6. Open your browser at `http://localhost:3000`

---

## Running Tests

```bash
cd backend
npm test
```

---

## CI/CD Pipeline

This project uses GitHub Actions with a self-hosted runner on AWS EC2. The pipeline automatically:

* Installs backend and frontend dependencies
* Runs backend tests using Mocha/Chai
* Builds the frontend
* Deploys to AWS EC2 via PM2

---

## Project Structure

```
IFN636/
├── .github/
│   └── workflows/
│       └── ci.yml
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── test/
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       └── pages/
└── README.md
```
