# Company Search

A full-stack web application for managing and searching company links with user authentication and role-based access control.

## Features

- 🔐 User Authentication with JWT
- 👥 Role-Based Access Control (Admin, Editor, Viewer)
- 🔗 Link Management (Create, Read, Update, Delete)
- 🔍 Advanced Search & Filtering
- 📊 Statistics Dashboard
- 👨‍💼 User Management (Admin Only)
- 📜 Activity Logging
- 🎨 Responsive UI
- 📱 Mobile Friendly

## Tech Stack

**Backend:**
- Node.js with Express.js
- MySQL Database
- JWT Authentication
- Bcrypt Password Hashing
- Multer for File Uploads
- CORS Enabled

**Frontend:**
- HTML5
- CSS3
- Vanilla JavaScript
- Chart.js for Statistics
- QRCode.js for QR Generation

## Installation

### Prerequisites
- Node.js (v14+)
- MySQL Server
- npm

### Setup Steps

1. **Clone the Repository**
```bash
git clone https://github.com/Realgamer301/company-search.git
cd company-search
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment Variables**
```bash
cp .env.example .env
```

Edit `.env` and add your database credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=company_search
PORT=3000
```

4. **Create Database & Tables**
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

CREATE INDEX idx_links_created_by ON links(created_by);
CREATE INDEX idx_links_type ON links(type);
CREATE INDEX idx_logs_user_id ON logs(user_id);
CREATE INDEX idx_logs_created_at ON logs(created_at);
```

5. **Start the Server**
```bash
# Development
npm run dev

# Production
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/add-user` - Add user (Admin only)
- `GET /api/auth/users` - Get all users (Admin only)

### Links
- `GET /api/links` - Get all links
- `POST /api/links/add` - Add new link (Admin/Editor)
- `GET /api/links/search/:text` - Search links
- `GET /api/links/:id` - Get single link
- `PUT /api/links/:id` - Update link (Admin only)
- `DELETE /api/links/:id` - Delete link (Admin only)
- `GET /api/links/stats/all` - Get statistics
- `GET /api/links/stats/types` - Get stats by type
- `GET /api/links/logs/all` - Get activity logs (Admin only)

## User Roles

### Admin
- Full access to all features
- Can manage users
- Can edit/delete any link
- Can view activity logs

### Editor
- Can create and manage own links
- Can view all links
- Cannot manage users

### Viewer
- Can only view links
- Cannot create or modify content

## File Structure

```
company-search/
├── server/
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── links.js         # Link management routes
│   ├── middleware/
│   │   └── authMiddleware.js # JWT verification
│   ├── db.js                # Database connection
│   └── server.js            # Express server
├── client/
│   ├── index.html           # Main dashboard
│   ├── login.html           # Login page
│   ├── add-link.html        # Add link form
│   ├── edit-link.html       # Edit link form
│   ├── users.html           # User management
│   ├── stats.html           # Statistics page
│   ├── script.js            # Main dashboard logic
│   ├── login.js             # Login logic
│   ├── add-link.js          # Add link logic
│   ├── edit-link.js         # Edit link logic
│   ├── users.js             # User management logic
│   ├── stats.js             # Statistics logic
│   ├── style.css            # Global styles
│   └── uploads/             # Uploaded files
├── package.json
└── README.md
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=company_search

# Server
PORT=3000

# JWT
JWT_SECRET=your_secret_key
```

## Deployment

### Railway Deployment

1. Push code to GitHub
2. Connect GitHub repository to Railway
3. Add environment variables in Railway dashboard
4. Deploy

### Environment Variables for Production
```
DB_HOST=your_railway_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=company_search
PORT=3000
```

## Troubleshooting

### Database Connection Error
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database exists

### CORS Error
- Frontend and backend URLs must match in CORS configuration
- Check `server.js` cors origin settings

### Authentication Failed
- Verify JWT secret is consistent
- Check token expiration (7 days)
- Clear browser localStorage and login again

### Upload Issues
- Ensure `client/uploads` directory exists
- Check file permissions
- Verify multer configuration

## License

MIT License - Feel free to use this project

## Support

For issues and questions, please open an issue on GitHub.

## Author

Realgamer301
