# 📝 node.js-express-board-tutorial

A Node.js Express-based web application for managing posts, comments, and user interactions. This project includes session-based authentication, CRUD operations for posts, hierarchical comments (upments and downments). Users can interact with posts and comments efficiently, with a responsive UI built using EJS and ccxzzjQuery.

---

## 🚀 Features

- **🔒 User Authentication**: Session-based login and registration with email verification.
- **📝 Posts Management**: Create, read, update, and delete posts.
- **💬 Comments & Replies**: Hierarchical comment system. (upments and downments)
- **🗄️ Database Integration**: MySQL database stores all application data.
- **🖥️ Responsive UI**: Frontend rendered using EJS templates with jQuery and AJAX for dynamic interactions.

---

## 📦 Dependencies

- **express** – Core web framework for building the server
- **mysql2** – MySQL client for Node.js, supports promises
- **bcrypt** – Password hashing and security
- **express-session** – Session management for user authentication
- **dotenv** – Environment variables management
- **nodemailer** – Email sending utility (e.g. registration/verification)
- **ejs** – Templating engine for rendering server-side HTML
- **helmet** – Security middleware for HTTP headers
- **compression** – Gzip/deflate compression for faster responses
- **jquery** – Frontend library for AJAX and DOM manipulation
- **aws-sdk** – AWS SDK for Node.js, used here for S3 integration
- **multer** – Middleware for handling file uploads
- **multer-s3** – Multer storage engine for directly uploading to AWS S3
- **path** – Utility for working with file and directory paths
- **method-override** – Allows HTTP verbs such as PUT or DELETE in places where the client doesn’t support it
- **sanitize-html** – Cleans user-submitted HTML to prevent XSS

---

## 🗄️ MySQL Tables settings

### **Database name: test_db**
### **users table**
```sql
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  userID VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mpimageUrl VARCHAR(255)
);
```

### **posts table**
```sql
CREATE TABLE posts (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME,
  authorID INT NOT NULL
);
```

### **upment table**
```sql
CREATE TABLE upment (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  description TEXT NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME,
  downment_count INT NOT NULL DEFAULT 0,
  like_count INT NOT NULL DEFAULT 0,
  postID INT NOT NULL,
  authorID INT NOT NULL
);
```

### **downment table**
```sql
CREATE TABLE downment (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  description TEXT NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME,
  like_count INT NOT NULL DEFAULT 0,
  postID INT NOT NULL,
  parentID INT NOT NULL,
  authorID INT NOT NULL
);
```

---

## ⚙️ Installation & Usage

1. Clone the repository
```bash
git clone https://github.com/watashiniuta/node.js-express-board-tutorial
```
2. run a program
```bash
cd project
npm install <packages>
node main.js
```
