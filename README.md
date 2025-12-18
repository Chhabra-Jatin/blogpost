# 📝 React + Firebase Blogging App

A modern **full‑stack blogging platform** built using **React** and **Firebase**, featuring real‑time updates, authentication, likes/dislikes, sorting, and smooth animations.

---

## 🚀 Features

* 🔐 **Authentication** (Firebase Auth)

  * Login / Logout with persistent session

* 📝 **Posts**

  * Create, edit, and delete your own posts
  * View posts from other users in real time

* 👍👎 **Likes & Dislikes**

  * Like or dislike posts
  * See total counts for each post
  * Instantly see which posts you have reacted to
  * Real‑time updates without page refresh

* 🔄 **Real‑Time Updates**

  * Uses Firestore `onSnapshot` for live post updates

* 🔃 **Sorting Options**

  * Newest first
  * Oldest first
  * Most liked (with tie‑breaker handling)

* 🎬 **Smooth Animations**

  * Collapsible sections (My Posts / All Posts)
  * Powered by **Framer Motion**

* ⚡ **Optimistic UI Updates**

  * Likes & dislikes update instantly before Firestore response

* 📱 **Responsive Design**

  * Clean UI across desktop and mobile

---

## 🛠️ Tech Stack

* ⚛️ **React**
* 🔥 **Firebase**

  * Authentication
  * Firestore (Real‑time database)
* 🎞️ **Framer Motion** (Animations)
* 🎨 **CSS / Bootstrap Icons**

---

## 📂 Project Structure

```bash
src/
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── PostCard.jsx
│   ├── SkeletonCard.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── CreatePost.jsx
│   ├── PageNotFound.jsx
├── firebase/
│   ├── config.js
├── hooks/
│   ├── useTitle.js
├── App.jsx
```

---

## ⚙️ Setup & Installation

1. **Clone the repository**

```bash
git clone https://github.com/Chhabra-Jatin/blogpost.git
cd blogpost
```

2. **Install dependencies**

```bash
npm install
```

3. **Firebase Configuration**

Create a Firebase project and add your config in:

```js
src/firebase/config.js
```

```js
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

4. **Run the app**

```bash
npm start
```

---

## 🧠 Key Learnings

* Real‑time data handling with Firestore
* Optimistic UI patterns
* State management with React hooks
* Conditional rendering & UX edge cases
* Smooth UI animations using Framer Motion

---

## 🔮 Future Improvements

* 🔔 Notifications for likes/comments
* 💬 Comments on posts
* 🔍 Search posts by title or author
* 🌙 Dark mode

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

---

## 📬 Contact

* 💼 LinkedIn: https://www.linkedin.com/in/jatinchhabra1997/

---

⭐ If you like this project, don’t forget to give it a star!
