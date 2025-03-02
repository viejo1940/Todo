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

## Authentication Flow
1. User logs in through NextAuth.js credentials provider
2. Backend validates credentials and returns JWT token
3. Token stored in NextAuth.js session
4. Client requests include token via axios interceptor
5. Server-side requests pass token in Authorization header

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

## Toast Notifications
- Implemented using Radix UI
- Supports different variants (default, destructive)
- Auto-dismisses after timeout
- Customizable styling

## Error Handling
- Client-side error handling with toast notifications
- Server-side error handling with proper status codes
- Type-safe error responses
- Consistent error format across application

## Type Safety
- Full TypeScript implementation
- Zod validation for API requests
- Type definitions for NextAuth
- Strict type checking enabled

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