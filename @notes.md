# Technical Notes

## Project Structure
- Frontend: Next.js 14 with App Router
- Backend: NestJS with MongoDB
- Authentication: NextAuth.js with JWT strategy

## API Configuration
- Backend API runs on `http://localhost:4000/api`
- Frontend API routes proxy requests through `/api/*`
- Two axios instances:
  - `api`: For server-side calls (direct to backend)
  - `clientApi`: For client-side calls (through Next.js API routes)
- Axios exports:
  - Named exports: `import { api, clientApi } from '@/lib/axios'`
  - Default export: `import api from '@/lib/axios'`

## Authentication Flow
1. User logs in through NextAuth.js credentials provider
2. Backend validates credentials and returns JWT token
3. Token stored in NextAuth.js session
4. Client requests include token via axios interceptor
5. Server-side requests pass token in Authorization header

## Validation Schemas
### Registration Schema
```typescript
const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});
```

### Task Schema
```typescript
const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  status: z.enum(['pending', 'completed', 'overdue']),
});
```

## Task Management
### Data Models
```typescript
interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed' | 'overdue';
  startDate: string;
  endDate: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateTaskData {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status?: 'pending' | 'completed' | 'overdue';
}
```

## Error Handling
### API Error Structure
```typescript
interface ApiError {
  message: string;
  statusCode: number;
}

const handleApiError = (error: any): ApiError => {
  if (error.response) {
    return {
      message: error.response.data.message || 'An error occurred',
      statusCode: error.response.status,
    };
  }
  if (error.request) {
    return {
      message: 'No response from server',
      statusCode: 503,
    };
  }
  return {
    message: 'Error setting up request',
    statusCode: 500,
  };
};
```

## Components
### TaskDialog
- Used for both creating and editing tasks
- Handles form state and validation
- Integrates with toast notifications
- Supports date-time selection

### Calendar
- Displays tasks in monthly view
- Color-coded by task status
- Supports month navigation
- Shows task duration across days

### TasksTable
- List view of all tasks
- Supports sorting and filtering
- Includes actions for edit/delete
- Confirms destructive actions

### Settings Page
- Dark mode toggle
- Password update form
- Profile information display

## Toast Notifications
- Implemented using Radix UI
- Supports different variants (default, destructive)
- Auto-dismisses after timeout
- Customizable styling

## Type Safety
- Full TypeScript implementation
- Zod validation for API requests
- Type definitions for NextAuth
- Strict type checking enabled
- Consistent error types across application

## Environment Variables
Required variables:
```
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
BACKEND_URL=http://localhost:4000/api
```

## Known Issues
1. Status update in TaskDialog needs proper type handling
2. Date formatting needs to be consistent across components
3. Error messages could be more user-friendly
4. Need to implement proper error boundaries

## Future Improvements
1. Add task categories/tags
2. Implement task search
3. Add task priority levels
4. Implement task recurrence
5. Add task sharing functionality
6. Improve mobile responsiveness
7. Add more settings options
8. Implement user preferences sync

## Password Update Implementation
### Password Update Schema
```typescript
const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(8, 'Current password must be at least 8 characters'),
  newPassword: z.string()
    .min(8, 'New password must be at least 8 characters')
    .max(32, 'Password must not exceed 32 characters')
    .regex(
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character'
    ),
  confirmPassword: z.string()
    .min(8, 'Password confirmation must be at least 8 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword'],
});
```

### Password Update Features
- Real-time validation:
  - Password matching verification
  - Password strength requirements
  - Current password validation
  - Form submission validation
- Security measures:
  - Password visibility toggles
  - Paste prevention in confirmation
  - Loading state during submission
  - Proper error handling
- User feedback:
  - Visual password matching indicator
  - Error messages for validation
  - Toast notifications for success/failure
  - Form reset after success

### API Integration
```typescript
const onSubmit = async (data: PasswordFormData) => {
  try {
    const response = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    // Handle response...
  } catch (error) {
    // Handle error...
  }
};
```

## Recent Updates

### Password Management
- Enhanced password update flow:
  - Added confirmation field
  - Real-time validation
  - Improved security measures
  - Better user feedback
- Form improvements:
  - Password visibility toggles
  - Paste prevention
  - Loading states
  - Error handling
- Validation enhancements:
  - Password matching
  - Strength requirements
  - Current password check
  - Form submission checks

### Authentication System
- Next-Auth v5 Implementation:
  - Using JWT strategy for stateless authentication
  - Environment configuration with AUTH_SECRET
  - Protected route middleware
  - Session management and persistence
  - Proper token handling and validation

### User Management
- Password Update Flow:
  - Frontend validation with Zod schema
  - Backend bcrypt password hashing
  - Current password verification
  - Password complexity requirements:
    - 8-32 characters
    - Uppercase and lowercase letters
    - Numbers or special characters
  - Proper error handling and user feedback

### Security Considerations
- JWT token handling:
  - HTTP-only cookies for token storage
  - Proper token expiration
  - Secure token validation
  - Protected routes configuration
- Session Management:
  - Secure logout implementation
  - Session cleanup
  - Local storage handling
  - Proper redirect handling

### Frontend Components
- LogoutButton:
  - Loading state handling
  - Error feedback with toast notifications
  - Proper session cleanup
  - User-friendly interface
- UpdatePasswordForm:
  - Real-time validation
  - Password requirements display
  - Error handling
  - Loading states
  - Success feedback

### Middleware Implementation
- Route Protection:
  - Public routes allowlist
  - Protected API routes
  - Authentication state checking
  - Proper redirect handling
- Error Handling:
  - Unauthorized access responses
  - Proper status codes
  - JSON error messages
  - Redirect logic

### Best Practices
- Security:
  - No sensitive data in local storage
  - Proper HTTP-only cookie usage
  - Environment variable management
  - Secure password handling
- User Experience:
  - Clear feedback messages
  - Loading states
  - Error handling
  - Smooth redirects
- Code Organization:
  - Modular components
  - Type safety
  - Clear error messages
  - Proper validation 