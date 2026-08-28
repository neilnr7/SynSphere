# SynSphere

**A Full-Stack Project Management and Team Collaboration Platform**

SynSphere is a full-stack project management application designed to help teams organize projects, manage tasks, collaborate through comments, track project activity, receive real-time-style notifications, and monitor project progress through analytics dashboards.

The application features role-based project collaboration, JWT-based authentication, task assignment and tracking, activity logging, notifications, user profile management, and project analytics.

## Live Deployment

- **Web Application:** https://syn-sphere.vercel.app


> **Note:** The backend is hosted on Render's free tier and may take a short time to wake up after a period of inactivity.


## Key Features

### Authentication & Security
- User registration and login with JWT-based authentication
- Stateless authentication using Spring Security
- Password hashing using BCrypt
- Protected frontend routes and backend API endpoints

### Project Management
- Create, view, and update projects
- Role-based project access with `OWNER`, `MANAGER`, and `MEMBER` roles
- Add existing SynSphere users as project members
- Role-based permissions for project operations

### Task Management
- Create, view, update, and delete tasks
- Assign tasks to project members
- Track tasks using TODO, IN_PROGRESS, and DONE statuses
- Task priority and deadline management
- Search and filter project tasks
- Role and assignment-based task permissions

### Team Collaboration
- Add, edit, and delete task comments
- Project activity feed for tracking important actions
- Automatic activity logging for projects, tasks, comments, and members

### Notifications
- User-specific project notifications
- Unread notification count
- Mark individual notifications as read
- Mark all notifications as read
- Navigate directly from notifications to related projects or tasks

### Dashboard Analytics
- Project task statistics
- Task status and priority insights
- Member-wise task statistics
- Overdue task tracking

### Profile & Settings
- Update user profile information
- Profile image support
- Secure password change functionality


## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- Tailwind CSS


### Backend
- Java 21
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- Maven
- Lombok

### Database
- PostgreSQL
- Neon PostgreSQL

### Deployment
- Vercel — Frontend
- Render — Backend


### Development Tools
- Git
- GitHub
- Postman

