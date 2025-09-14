# Project GreenMitra - Waste Management Platform

## Overview

Project GreenMitra is a decentralized waste management ecosystem that incentivizes citizens to engage in proper waste segregation and reporting environmental issues. The platform connects three types of users - citizens, green champions, and ULB (Urban Local Body) administrators - in a comprehensive system that rewards good environmental practices through a points-based gamification system.

The application enables citizens to report illegal dumping, track waste collection vehicles, earn green points for proper waste management, and redeem rewards. Green champions verify citizen reports and approve points, while ULB administrators oversee the entire system with analytics and management capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript running on Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing with role-based dashboard navigation
- **State Management**: React Query (TanStack Query) for server state management with local auth state handling
- **UI Components**: Shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming

### Backend Architecture
- **Server**: Express.js with TypeScript providing RESTful API endpoints
- **Development**: Hot module replacement via Vite integration for seamless development experience
- **API Structure**: Resource-based REST endpoints for authentication, users, reports, and rewards
- **Error Handling**: Centralized error handling middleware with structured error responses

### Data Storage Solutions
- **Database**: PostgreSQL configured via Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for database migrations and schema synchronization
- **Development Storage**: In-memory storage implementation for rapid prototyping and testing
- **Connection**: Neon Database serverless PostgreSQL for production deployment

### Authentication and Authorization
- **Authentication**: Simple email/password-based authentication with user type differentiation
- **Session Management**: Client-side auth state management with subscription pattern for reactivity
- **User Types**: Role-based access with three distinct user roles (citizen, champion, admin)
- **Route Protection**: Protected routes that redirect based on authentication status and user role

### External Dependencies
- **Database**: Neon Database serverless PostgreSQL as the primary data store
- **Component Library**: Radix UI primitives for accessible, unstyled components
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Icons**: Lucide React for consistent iconography throughout the application
- **Date Handling**: date-fns for date manipulation and formatting
- **Build Tools**: ESBuild for production server bundling and TypeScript compilation

The architecture follows a modern full-stack approach with clear separation between client and server concerns, type safety throughout the stack, and development-focused tooling for rapid iteration.