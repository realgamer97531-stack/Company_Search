# Quick Start Guide

## Prerequisites
- Node.js v14+
- MySQL Server running
- npm

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Configure Database

### Option A: Local Development (Recommended for testing)

1. Make sure MySQL is running
2. Create database and tables:
   ```sql
   CREATE DATABASE company_search;
   USE company_search;
   
   CREATE TABLE users (
       id INT PRIMARY KEY AUTO_INCREMENT,
       username VARCHAR(255) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL,
       role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   CREATE TABLE links (
       id INT PRIMARY KEY AUTO_INCREMENT,
       title VARCHAR(255) NOT NULL,
       description TEXT,
       url VARCHAR(500) NOT NULL,
       type VARCHAR(100),
       thumbnail VARCHAR(500),
       tags TEXT,
       created_by INT NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (created_by) REFERENCES users(id)
   );
   
   CREATE TABLE logs (
       id INT PRIMARY KEY AUTO_INCREMENT,
       user_id INT NOT NULL,
       action_type VARCHAR(100),
       target_id INT,
       description TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (user_id) REFERENCES users(id)
   );
   ```

3. The `.env` file already has default local settings:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=root
   DB_NAME=company_search
   ```

### Option B: Create Test User (Optional)

To create a test user for login, you need to use a bcrypt hashed password.

Use this script to create a user:

```bash
node -e "
const bcrypt = require('bcrypt');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'company_search'
});

db.connect((err) => {
    if(err) {
        console.error('DB Error:', err);
        return;
    }
    
    const username = 'admin';
    const password = 'admin123';
    const role = 'admin';
    
    bcrypt.hash(password, 10, (err, hash) => {
        if(err) {
            console.error('Hash error:', err);
            return;
        }
        
        const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
        db.query(sql, [username, hash, role], (err, result) => {
            if(err) {
                console.error('Insert error:', err);
            } else {
                console.log('User created!');
                console.log('Username: admin');
                console.log('Password: admin123');
                console.log('Role: admin');
            }
            db.end();
        });
    });
});
"
```

## Step 3: Start Development Server

```bash
npm run dev
```

You should see:
```
✓ MySQL Connected Successfully
✓ Server Running On Port 3000
```

## Step 4: Open in Browser

Open `http://localhost:3000` in your browser

**Login with:**
- Username: `admin`
- Password: `admin123`

## Step 5: Test Features

After login:
1. ✓ Dashboard - View all links
2. ✓ Add Link (if admin/editor)
3. ✓ Search links
4. ✓ View Stats (if admin)
5. ✓ Manage Users (if admin)

---

## Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server with auto-reload |
| `npm start` | Start production server |
| `npm install` | Install dependencies |

---

## Environment Variables

Edit `.env` to change:
- Database credentials
- Server port
- Node environment

Example:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=company_search
PORT=3000
NODE_ENV=development
```

---

## Troubleshooting

- **Can't connect to MySQL?** → Make sure MySQL is running
- **Port already in use?** → Change PORT in `.env`
- **Login failed?** → Check if user exists in database
- **Favicon 404?** → Harmless, will be added soon

See `TROUBLESHOOTING.md` for detailed help.

---

## Next Steps

1. Create additional users
2. Add links and test search
3. Customize styling in `client/style.css`
4. Deploy to Railway
