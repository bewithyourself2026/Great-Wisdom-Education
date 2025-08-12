# Great Wisdom Education Platform

A comprehensive global educational platform that connects students with professors, industry leaders, and English teachers through interactive camps and learning experiences.

## 🌟 Features

### For Students
- **Browse Educational Camps**: Explore camps across various categories (Academic, Language, Technology, Business, Arts, Sports, Science, Leadership)
- **Global Learning**: Connect with instructors and students from around the world
- **Flexible Scheduling**: Choose from various time slots that fit your schedule
- **Real-time Communication**: Live chat and messaging with instructors and fellow students
- **Progress Tracking**: Monitor your learning progress and achievements
- **Certificates**: Earn certificates upon camp completion

### For Instructors
- **Camp Creation**: Create and manage educational camps with rich content
- **Student Management**: Track student progress and attendance
- **Real-time Sessions**: Conduct live sessions with integrated video conferencing
- **Content Management**: Upload materials, assignments, and resources
- **Analytics**: View detailed analytics and student performance metrics

### Platform Features
- **Multi-language Support**: Platform available in multiple languages
- **Timezone Handling**: Automatic timezone conversion for global users
- **Payment Integration**: Secure payment processing with Stripe
- **Email Notifications**: Automated email notifications and reminders
- **Real-time Updates**: Live updates using Socket.IO
- **Responsive Design**: Mobile-friendly interface

## 🚀 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Socket.IO** for real-time features
- **Nodemailer** for email notifications
- **Stripe** for payment processing
- **Cloudinary** for file uploads
- **Express Validator** for input validation
- **Helmet** for security headers
- **Rate Limiting** for API protection

### Frontend
- **React 18** with TypeScript
- **Material-UI** for UI components
- **React Router** for navigation
- **React Query** for data fetching
- **Socket.IO Client** for real-time features
- **Framer Motion** for animations
- **React Hook Form** for form handling
- **Axios** for HTTP requests

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd great-wisdom-education
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment example file
   cp .env.example .env
   
   # Edit .env file with your configuration
   nano .env
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if not running)
   mongod
   
   # The application will automatically create the database
   ```

5. **Start the Application**
   ```bash
   # Development mode (runs both server and client)
   npm run dev
   
   # Or run separately:
   # Server only
   npm run server
   
   # Client only
   npm run client
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/great-wisdom-education

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@greatwisdomeducation.com

# Client URL
CLIENT_URL=http://localhost:3000

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-email` - Send email verification
- `POST /api/auth/confirm-email` - Confirm email address

### Camp Endpoints
- `GET /api/camps` - Get all camps with filtering
- `GET /api/camps/:id` - Get camp details
- `POST /api/camps` - Create a new camp (instructors only)
- `PUT /api/camps/:id` - Update camp (instructor/admin only)
- `DELETE /api/camps/:id` - Delete camp (instructor/admin only)
- `POST /api/camps/:id/reviews` - Add camp review
- `GET /api/camps/featured` - Get featured camps

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/instructors` - Get all instructors
- `GET /api/users/instructors/:id` - Get instructor profile

### Enrollment Endpoints
- `POST /api/enrollments` - Enroll in a camp
- `GET /api/enrollments/my` - Get user enrollments
- `GET /api/enrollments/camp/:campId` - Get camp enrollments (instructor only)
- `PUT /api/enrollments/:id/status` - Update enrollment status
- `PUT /api/enrollments/:id/attendance` - Update attendance
- `DELETE /api/enrollments/:id` - Cancel enrollment

### Payment Endpoints
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/history` - Get payment history

## 🏗️ Project Structure

```
great-wisdom-education/
├── server/
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   ├── socket.js         # Socket.IO configuration
│   └── index.js          # Server entry point
├── client/
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   ├── hooks/        # Custom hooks
│   │   ├── utils/        # Utility functions
│   │   ├── types/        # TypeScript types
│   │   ├── App.tsx       # Main app component
│   │   └── index.tsx     # Entry point
│   └── package.json
├── package.json
└── README.md
```

## 🎯 Key Features Implementation

### Real-time Communication
- Socket.IO integration for live chat
- Real-time notifications
- Live session updates
- Typing indicators

### Payment Processing
- Stripe integration for secure payments
- Multiple currency support
- Payment history tracking
- Refund handling

### File Management
- Cloudinary integration for file uploads
- Support for images, documents, and videos
- Automatic file optimization
- Secure file access

### Email System
- Automated welcome emails
- Password reset functionality
- Camp enrollment confirmations
- Session reminders

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Security headers with Helmet
- SQL injection prevention
- XSS protection

## 🚀 Deployment

### Production Build
```bash
# Build the client
cd client
npm run build
cd ..

# Start production server
npm start
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong JWT secret
- Configure production database
- Set up production email service
- Configure production payment keys

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@greatwisdomeducation.com or create an issue in the repository.

## 🗺️ Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] AI-powered course recommendations
- [ ] Virtual reality learning experiences
- [ ] Blockchain-based certificates
- [ ] Multi-language platform expansion
- [ ] Advanced assessment tools
- [ ] Integration with learning management systems

---

**Great Wisdom Education** - Empowering minds, connecting worlds through education.
