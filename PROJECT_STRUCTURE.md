# Project Structure

This project is organized into a clean, modular structure for better maintainability and scalability.

## 📁 Directory Structure

```
src/
├── config/           # Configuration files
│   └── index.ts     # App configuration (ports, database URL, etc.)
├── database/         # Database related files
│   └── prisma.ts    # Prisma client instance
├── queries/          # GraphQL query definitions
│   ├── dailyReadings.ts  # Daily reading queries
│   ├── churches.ts       # Church-related queries
│   └── index.ts          # Export all queries
├── resolvers/        # GraphQL resolvers
│   ├── queries.ts        # Query resolvers
│   ├── fieldResolvers.ts # Field-level resolvers
│   └── index.ts          # Combine all resolvers
├── types/            # Type definitions
│   ├── graphql.ts        # TypeScript interfaces
│   └── index.ts          # GraphQL schema + TypeScript types
├── utils/            # Utility functions
│   ├── dateUtils.ts      # Date handling utilities
│   └── index.ts          # Export all utilities
└── index.ts          # Main application entry point
```

## 🏗️ Architecture Overview

### **Configuration (`src/config/`)**
- Centralized configuration management
- Environment variable handling
- App settings (port, database URL, etc.)

### **Database (`src/database/`)**
- Prisma client instance
- Database connection management
- Graceful shutdown handling

### **Types (`src/types/`)**
- **`index.ts`**: GraphQL schema definitions using `gql`
- **`graphql.ts`**: TypeScript interfaces for type safety
- Centralized type definitions for the entire application

### **Resolvers (`src/resolvers/`)**
- **`queries.ts`**: All GraphQL query resolvers
- **`fieldResolvers.ts`**: Field-level resolvers (date formatting, etc.)
- **`index.ts`**: Combines all resolvers into a single export

### **Queries (`src/queries/`)**
- **`dailyReadings.ts`**: Queries for fetching daily readings
- **`churches.ts`**: Queries for church-related data
- **`index.ts`**: Exports all queries for easy importing

### **Utils (`src/utils/`)**
- **`dateUtils.ts`**: Date formatting and validation utilities
- Reusable helper functions

## 🔄 Data Flow

1. **Client Request** → GraphQL query
2. **`src/index.ts`** → Apollo Server setup
3. **`src/types/`** → Schema validation
4. **`src/resolvers/`** → Query processing
5. **`src/database/`** → Data retrieval via Prisma
6. **Response** → Formatted data back to client

## 📦 Key Benefits

### **Modularity**
- Each concern is separated into its own module
- Easy to find and modify specific functionality
- Clear separation of responsibilities

### **Type Safety**
- TypeScript interfaces for all GraphQL types
- Compile-time error checking
- Better IDE support and autocomplete

### **Maintainability**
- Organized file structure
- Clear naming conventions
- Easy to add new features

### **Scalability**
- Easy to add new resolvers, types, or utilities
- Modular structure supports team development
- Clear import/export patterns

## 🚀 Adding New Features

### Adding a New Query:
1. Add type to `src/types/index.ts`
2. Add resolver to `src/resolvers/queries.ts`
3. Add query definition to `src/queries/`
4. Update TypeScript types in `src/types/graphql.ts`

### Adding a New Utility:
1. Create file in `src/utils/`
2. Add function implementation
3. Export from `src/utils/index.ts`
4. Import where needed

### Adding Configuration:
1. Add to `src/config/index.ts`
2. Use throughout the application
3. Document in this file

## 🔧 Development Workflow

1. **Start development**: `npm run dev`
2. **Test queries**: Use GraphQL Playground at `http://localhost:4002/graphql`
3. **Import queries**: Use `src/queries/` for client-side queries
4. **Add types**: Update `src/types/graphql.ts` for new interfaces
5. **Add utilities**: Create in `src/utils/` for reusable functions

## 📝 File Naming Conventions

- **PascalCase**: For GraphQL types and TypeScript interfaces
- **camelCase**: For functions, variables, and file names
- **kebab-case**: For GraphQL query names
- **UPPER_SNAKE_CASE**: For constants and environment variables

## 🔍 Import Patterns

```typescript
// Import types
import { Church, DailyReading } from './types';

// Import queries
import { GET_DAILY_READINGS_FOR_CHURCH } from './queries';

// Import utilities
import { formatDateToISO } from './utils';

// Import configuration
import { config } from './config';
``` 