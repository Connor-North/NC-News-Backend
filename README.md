# NC News API

This is the **backend API** for NC News — a RESTful service that provides articles, topics, users, and comments. It is built with **Node.js**, **Express**, and **PostgreSQL**.

You can view the live deployed version of the API here:  
🔗 https://nc-news-v7di.onrender.com

---

## 📦 Tech Stack

---

- Node.js
- Express.js
- PostgreSQL
- node-postgres (`pg`)
- Jest & Supertest (for testing)
- Deployed on Render

---

## ⚙️ Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/Connor-North/NC-News-Backend.git
   cd NC-News-Backend
   npm install
   ```

2. **Create environment files**

   In the root of the project, create the following two files:

   - `.env.development`

     ```
     PGDATABASE=nc_news
     ```

   - `.env.test`

     ```
     PGDATABASE=nc_news_test
     ```

3. **Create and seed the databases**

   ```bash
   npm run setup-dbs
   npm run seed-dev
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The server should now be running locally.

   ---

## 🧪 Testing

Run the test suite with:

```bash
npm test
```

Tests use Jest and Supertest.

---

## 🔗 Related Repositories & Links

- Frontend repo: https://github.com/Connor-North/NC-News-Frontend  
- Deployed frontend site: https://ncnewscn.netlify.app

---

Feel free to open issues or submit pull requests to contribute!
