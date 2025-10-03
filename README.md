# 🌐 Social Hub - Modern Social Media Platform

A full-stack social media application built with React, Node.js, Express, and MongoDB. Features modern UI design, real-time interactions, and comprehensive testing.

![GitHub](https://img.shields.io/badge/GitHub-social--media-blue)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)
![Test Coverage](https://img.shields.io/badge/Coverage-75.5%25-brightgreen)

## ✨ Features

### 🎨 Modern UI/UX
- **Gradient Design** - Beautiful purple gradient color scheme
- **Smooth Animations** - Fade-in, slide-in, and hover effects
- **Responsive Layout** - Mobile-first design that works on all devices
- **Interactive Elements** - Like buttons, search, and real-time updates

### 👤 User Management
- User registration and authentication
- JWT-based secure sessions
- User profiles with custom descriptions
- Profile avatars with dynamic colors

### 📝 Status Updates
- Create, read, update, and delete posts
- **280-character limit** with visual counter
- Real-time character count with color indicators
- Status timestamps with "time ago" format

### ❤️ Social Interactions
- Like/unlike posts
- Real-time like counters
- Search posts by content or username
- Filter and discover content

### 🧪 Testing
- **75.5% test coverage** for frontend pages
- **100% coverage** for Login and SignUp pages
- Comprehensive unit tests for components and API routes
- Jest + React Testing Library + Supertest

## 🚀 Tech Stack

### Frontend
- **React 18.3** - UI library
- **React Router 6** - Client-side routing
- **Vite 5.4** - Build tool and dev server
- **CSS3** - Custom styling with modern features

### Backend
- **Node.js** - Runtime environment
- **Express 4.21** - Web framework
- **MongoDB 6.11** - NoSQL database
- **Mongoose 8.8** - ODM for MongoDB

### Authentication & Security
- **JWT (jsonwebtoken 9.0)** - Token-based auth
- **bcrypt 5.1** - Password hashing
- **CORS** - Cross-origin resource sharing

### Testing
- **Jest 30.2** - Testing framework
- **React Testing Library 16.3** - Component testing
- **Supertest 7.1** - API endpoint testing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or remote instance)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/vincentvicente/social-media.git
cd social-media
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:
```env
MONGO_URI=mongodb://localhost:27017/social_media
JWT_SECRET=your_secret_key_here
PORT=3000
```

4. **Start MongoDB**
```bash
# Make sure MongoDB is running on your system
mongod
```

5. **Run the application**

**Backend (Terminal 1):**
```bash
npm start
```

**Frontend (Terminal 2):**
```bash
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 🧪 Testing

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run only backend tests
```bash
npm run test:backend
```

### Run only frontend tests
```bash
npm run test:frontend
```

### Test Coverage
Current test coverage statistics:
- **Pages**: 75.5% (38% → 75.5% improvement)
- **Components**: 73.46%
- **Backend Routes**: 75.67%

## 📁 Project Structure

```
social-media/
├── backend/
│   ├── __tests__/           # Backend unit tests
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── authMiddleware.js    # JWT authentication
│   ├── db.js                # Database connection
│   └── server.js            # Express server
├── frontend/
│   ├── src/
│   │   ├── __tests__/       # Frontend unit tests
│   │   ├── component/       # React components
│   │   ├── pages/           # Page components
│   │   ├── styling/         # CSS files
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   └── index.html
├── jest.config.js           # Jest configuration
├── jest.setup.js            # Test setup
├── babel.config.js          # Babel configuration
├── vite.config.js           # Vite configuration
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id/description` - Update user description

### Statuses
- `GET /api/statuses` - Get all statuses
- `POST /api/statuses` - Create new status (auth required)
- `PUT /api/statuses/:id` - Update status (auth required)
- `DELETE /api/statuses/:id` - Delete status (auth required)
- `POST /api/statuses/:id/like` - Like/unlike status (auth required)

## 🎯 Key Features Implementation

### Character Counter
- Visual circular progress indicator
- Changes color as limit approaches (blue → yellow → red)
- Prevents submission when over 280 characters

### Like System
- Toggle like/unlike with single click
- Real-time counter updates
- Heart emoji changes (🤍 ↔️ ❤️)
- Backend validation and persistence

### Search Functionality
- Real-time filtering
- Searches both post content and usernames
- Case-insensitive matching

### Responsive Design
Breakpoints:
- Mobile: < 480px
- Tablet: < 768px
- Desktop: > 768px

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token authentication
- Protected API routes
- CORS configuration
- Input validation

## 🎨 Design Highlights

### Color Palette
- Primary: `#667eea` (Purple)
- Secondary: `#764ba2` (Purple-Red)
- Background: `#f5f7fa` (Light Gray-Blue)
- Text: `#14171a` (Dark Gray)
- Success: `#4caf50` (Green)
- Error: `#e0245e` (Red)

### Typography
- Font Family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'
- Headings: 700-800 weight
- Body: 400-600 weight

## 📝 Available Scripts

```bash
npm start          # Start backend server
npm run dev        # Start frontend dev server
npm test           # Run all tests with coverage
npm run test:watch # Run tests in watch mode
npm run build      # Build production frontend
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Vincent**
- GitHub: [@vincentvicente](https://github.com/vincentvicente)

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the flexible database
- All open-source contributors

## 📸 Screenshots

### Home Page
Modern card-based layout with search functionality and like buttons.

### User Profile
Personalized profile page with status management and description editing.

### Mobile Responsive
Fully responsive design that works seamlessly on all devices.

---

⭐ **Star this repo if you find it helpful!**

🐛 **Found a bug?** Open an issue!

💡 **Have a suggestion?** We'd love to hear it!

