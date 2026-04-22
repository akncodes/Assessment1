# 📝 AI-Powered Blogging Platform

This project is a simple full-stack blogging platform built using **Next.js** and **Supabase**, with an added AI feature that automatically generates summaries for blog posts.

The goal of this project was not just to build features, but to design a system that is clean, scalable, and easy to understand.

---

## 🚀 Features

### 🔐 Authentication & Roles

* User authentication using Supabase Auth
* Three roles supported:

  * **Author** → Can create and edit their own posts
  * **Viewer** → Can read posts and add comments
  * **Admin** → Has full access to all posts and comments

---

### 📝 Blog System

* Create, edit, and view blog posts
* Each post includes:

  * Title
  * Featured Image
  * Content
* Search functionality for posts
* Pagination for better performance

---

### 🤖 AI Integration

* Automatically generates a **~200-word summary** when a post is created
* Uses Google AI API
* Summary is:

  * Generated once
  * Stored in the database
  * Displayed on the post listing page

---

### 💬 Comments

* Users can comment on blog posts
* Comments are linked to both user and post

---

## 🛠 Tech Stack

* **Frontend + Backend:** Next.js
* **Database:** Supabase
* **Authentication:** Supabase Auth
* **Storage:** Supabase Storage (for images)
* **AI Integration:** Google AI API
* **Deployment:** Vercel
* **Version Control:** Git & GitHub

---

## 📂 Project Structure

```
/app
/components
/lib
/services
/types
```

The structure is kept modular to make the project easy to scale and maintain.

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-link>
cd project-folder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env.local` file and add:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
GOOGLE_AI_API_KEY=your_api_key
```

---

### 4. Run Locally

```bash
npm run dev
```

---

## 🌐 Deployment

The project is deployed using **Vercel**.

Steps followed:

* Connected GitHub repository to Vercel
* Added environment variables
* Deployed and tested live

---

## 🧠 Key Implementation Details

### 🔑 Authentication Flow

* Supabase handles login/signup
* User role is stored in the database
* Role-based access is enforced on both frontend and backend

---

### 🧩 Role-Based Access

* Access control is handled centrally
* Authors can only modify their own posts
* Admin can manage everything

---

### 🤖 AI Summary Flow

1. User creates a post
2. Content is sent to Google AI API
3. Summary is generated
4. Stored in database
5. Displayed in UI

---

### 💸 Cost Optimization

* Summary is generated only once
* Stored to avoid repeated API calls
* Reduces token usage significantly

---

## 🐞 Challenges Faced

One issue I faced was handling user sessions properly with role-based access.
Initially, roles were not updating correctly after login.

**Solution:**
Handled session refresh properly and ensured role data is fetched after authentication.

---

## 📌 What I Learned

* Structuring a full-stack app properly is more important than just writing code
* Role-based access needs careful planning
* AI integration is simple, but optimization matters
* Clean code and explanation matter as much as functionality

---

## 🔗 Links

* GitHub Repo: *[Add your link]*
* Live Project: *[Add your deployed URL]*

---

## 🙌 Final Note

This project was built with a focus on clarity, maintainability, and real-world practices rather than just completing features.

---
Supabase pass : iu*Mieh7YHXK.2.