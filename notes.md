# Development Notes & Best Practices

## Technical Considerations

### Next.js Frontend
- Remember to use proper data fetching methods (Server Components vs Client Components)
- Implement proper error boundaries
- Use proper loading states for better UX
- Keep components modular and reusable
- Next-Auth v5 Implementation:
  - Use middleware for protected routes
  - Implement proper session handling with JWT strategy
  - Set up appropriate callbacks for token and session
  - Handle authentication errors gracefully
  - Use built-in CSS for auth pages with shadcn
  - Properly type session and JWT data
  - Implement secure token storage
  - Handle token refresh and expiration
  - Use HTTP-only cookies for security

### Dashboard Implementation
- Component Architecture:
  - Separate concerns between stats and tasks
  - Use proper TypeScript interfaces
  - Implement loading states
  - Handle errors gracefully
  - Use proper data fetching patterns
  - Optimize re-renders
- API Route Handlers:
  - Implement proper error handling
  - Use type-safe responses
  - Handle authentication properly
  - Implement proper validation
  - Use proper HTTP status codes
- Performance Optimization:
  - Implement proper loading states
  - Use client-side data fetching
  - Optimize API calls
  - Use proper caching strategies
  - Minimize re-renders
- Animation Best Practices:
  - Use Framer Motion efficiently
  - Implement proper transitions
  - Handle mounting/unmounting
  - Consider performance impact
  - Use proper animation cleanup

### Frontend Services Architecture
- Service Layer Best Practices:
  - Keep services singleton
  - Implement proper type definitions
  - Handle errors consistently
  - Use proper TypeScript generics
  - Maintain clear service boundaries
  - Use proper session token management
- API Integration:
  - Use axios interceptors for common functionality
  - Implement token refresh logic
  - Handle network errors gracefully
  - Type all API responses
  - Use proper error handling
  - Include proper CORS headers
  - Handle cookie-based authentication
- State Management:
  - Use Next-Auth session for auth state
  - Use React Query for server state
  - Implement proper caching strategies
  - Handle loading and error states
  - Optimize re-renders
  - Use proper invalidation strategies

### Authentication Implementation
- Security Best Practices:
  - Hash passwords with bcrypt
  - Use JWT for stateless authentication
  - Implement proper token refresh
  - Secure token storage in HTTP-only cookies
  - Handle session expiry gracefully
  - Implement rate limiting
  - Use proper CORS configuration
  - Implement proper validation
- Form Validation:
  - Use Zod for schema validation
  - Implement proper error messages
  - Show clear validation feedback
  - Handle async validation
  - Validate on blur and submit
  - Type-safe form handling
- Error Handling:
  - Use toast notifications
  - Show user-friendly messages
  - Log errors properly
  - Handle network issues
  - Implement retry logic
  - Proper error typing
- JWT Token Security:
  - Implement proper payload validation
  - Use type-safe JWT strategy
  - Validate required token fields
  - Synchronize MongoDB _id with JWT sub
  - Handle token validation errors gracefully
  - Use proper TypeScript interfaces for payloads
  - Implement secure user information extraction
  - Use decorators for type-safe user access
- User Information Handling:
  - Extract user data from JWT tokens only
  - Implement type-safe user decorators
  - Validate user presence in requests
  - Handle missing user information gracefully
  - Use proper error messages for invalid tokens
  - Maintain consistent user ID field naming
- Error Handling Improvements:
  - Specific error messages for token validation
  - Proper error handling for missing fields
  - Type-safe error responses
  - Consistent error handling patterns
  - Clear error messages for debugging
  - Proper logging of authentication errors

### Landing Page Implementation
- Animation Best Practices:
  - Use Framer Motion for smooth animations
  - Avoid layout shifts during animations
  - Implement progressive enhancement
  - Consider reduced motion preferences
  - Use deterministic values for SSR compatibility
- Component Organization:
  - Separate reusable components
  - Maintain consistent styling patterns
  - Use Tailwind CSS utility classes effectively
  - Implement responsive design patterns
- Performance Considerations:
  - Optimize animation performance
  - Lazy load off-screen content
  - Use proper image optimization
  - Minimize bundle size

### Nest.js Backend
- Follow proper module organization
- Implement proper error handling and logging
- Use DTOs for data validation
- Implement proper authentication guards
- JWT Implementation:
  - Use secure secret key
  - Implement refresh token strategy
  - Set appropriate token expiration
  - Use Guards consistently
  - Implement rate limiting for auth routes
  - Proper cookie handling
  - Secure token generation
  - Type-safe responses
  - Implement proper payload validation
  - Use type-safe JWT strategy
  - Validate token fields thoroughly
  - Handle token errors gracefully
  - Use proper TypeScript interfaces
  - Implement secure user extraction
  - Maintain consistent field naming
  - Use decorators for type safety

### Database
- Always use migrations for database changes
- Implement proper indexing for frequently queried fields
- Regular backup strategy
- Consider caching strategy early
- MongoDB Best Practices:
  - Use proper indexing for frequently queried fields
  - Implement schema validation
  - Use aggregation pipelines efficiently
  - Handle MongoDB connections properly
  - Implement proper error handling for database operations
  - Use transactions when necessary
  - Regular backup strategy
  - Consider caching strategy early
  - Use Mongoose middleware when needed

## Best Practices

### Code Quality
- Write clean, self-documenting code
- Follow TypeScript best practices
- Maintain consistent code style
- Regular code reviews
- Write unit tests for critical functionality
- Proper type definitions
- Use TypeScript strict mode

### UI/UX Considerations
- Ensure text contrast and visibility
- Implement smooth animations
- Provide visual feedback for interactions
- Maintain consistent spacing
- Follow accessibility guidelines
- Test on multiple screen sizes
- Consider color theory in design
- Proper loading states
- Clear error messages

### Performance
- Implement proper caching strategies
- Optimize API calls
- Use proper loading states
- Implement proper error handling
- Monitor performance metrics
- Optimize bundle size
- Use proper code splitting
- Implement client-side data fetching
- Optimize component re-renders

### Security
- Never store sensitive data in plain text
- Implement proper authentication and authorization
- Regular security audits
- Keep dependencies updated
- Implement rate limiting
- Use environment variables for sensitive data
- MongoDB Security:
  - Enable authentication
  - Use SSL/TLS for connections
  - Implement proper access controls
  - Regular security patches
- JWT Security:
  - Secure token storage in HTTP-only cookies
  - Implement refresh token rotation
  - Use proper token expiration
  - Implement CSRF protection
  - Proper error handling
  - Secure session management

## Common Pitfalls to Avoid
- Avoid prop drilling - use proper state management
- Don't forget error handling
- Don't ignore TypeScript types
- Avoid unnecessary re-renders
- Don't ignore security best practices
- Avoid non-deterministic values in SSR
- Prevent layout shifts during animations
- Handle token expiration properly
- Implement proper error boundaries
- Don't expose sensitive information in errors
- Don't fetch data without proper loading states
- Avoid direct DOM manipulation with animations
- JWT Token Handling:
  - Don't trust token payload without validation
  - Avoid mixing user ID field names
  - Don't skip type safety in token handling
  - Never expose sensitive token information
  - Handle missing token fields properly
  - Validate all required token fields
  - Use proper error handling
  - Maintain consistent field naming

## Useful Resources
- Next-Auth v5 documentation
- Framer Motion documentation
- shadcn/ui component library
- Tailwind CSS documentation
- Next.js best practices
- Animation performance guides
- MongoDB best practices
- JWT security guidelines
- TypeScript handbook
- Zod documentation

## Troubleshooting Guide
- Authentication issues:
  - Check token expiration
  - Verify CORS settings
  - Monitor network requests
  - Check authorization headers
  - Verify cookie settings
  - Check session configuration
- SSR hydration issues:
  - Use deterministic values
  - Avoid random numbers in initial render
  - Check for client/server markup mismatches
- Animation performance:
  - Use hardware-accelerated properties
  - Implement proper animation cleanup
  - Monitor frame rates
- Dashboard loading issues:
  - Check API response times
  - Verify data fetching patterns
  - Monitor component re-renders
  - Check error boundaries
  - Verify state management
- JWT Token Issues:
  - Check payload validation
  - Verify field naming consistency
  - Monitor token validation errors
  - Check user information extraction
  - Verify decorator implementation
  - Test error handling
  - Validate type safety
  - Check MongoDB ID synchronization

## Team Conventions
- Use conventional commits
- Follow GitFlow branching strategy
- Document all API endpoints
- Keep documentation up to date
- Use proper TypeScript types
- Follow error handling patterns
- Maintain service architecture
- Document authentication flows
- Follow component naming conventions
- Maintain consistent styling patterns
- Authentication Conventions:
  - Use type-safe JWT strategies
  - Implement proper payload validation
  - Maintain consistent field naming
  - Use decorators for user access
  - Handle errors consistently
  - Document token structure
  - Follow security best practices

## Environment Setup Notes
### Required Environment Variables
```env
# MongoDB
MONGODB_URI=
MONGODB_DB_NAME=

# JWT
JWT_SECRET=
JWT_REFRESH_SECRET=
JWT_EXPIRATION=
JWT_REFRESH_EXPIRATION=

# Next-Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Frontend
NEXT_PUBLIC_API_URL=
```

Remember to update this file regularly with new learnings and important notes! 