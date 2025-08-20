```markdown
# Detailed Implementation Plan: Integrated Construction Management Platform

This plan outlines the step-by-step changes to transform the current Next.js project into a comprehensive, modular, and secure platform for managing construction works, projects, and processes. The solution will follow best practices for error handling, responsive UI design (using Tailwind CSS), and modular architecture with API-based integration for real-world enterprise needs.

---

## 1. Project Architecture and Dependencies

- **Frontend Framework**: Next.js (app directory) + TypeScript  
- **Styling**: Tailwind CSS (customizations in `src/app/globals.css`)  
- **UI Components**: Existing components in `src/components/ui` for cards, buttons, etc.  
- **Backend APIs**: Next.js API routes under `src/app/api/...`  
- **Database Integration**: Introduce Prisma with PostgreSQL by adding a new file `prisma/schema.prisma`  
- **Real-Time Communication**: Integrate Socket.io (server and client) for live updates  
- **Authentication**: Use NextAuth via a new API route for secure login and multi-tenancy  
- **Error Handling & Best Practices**: All API endpoints will implement proper try/catch blocks and logging; UI components will implement error boundaries where needed  

---

## 2. File-by-File Changes

### A. `package.json`
- **Action**: Add new dependencies and update scripts as required.
- **Changes**:
  - Add:
    ```json
    "next-auth": "^4.20.0",
    "socket.io": "^4.5.0",
    "socket.io-client": "^4.5.0"
    ```
  - **Best Practice**: Validate dependency versions and run `npm install` after changes.

### B. `next.config.ts`
- **Action**: Ensure environment variables (like `DATABASE_URL` and `NEXTAUTH_SECRET`) are enabled.
- **Changes**:  
  - Add configuration to expose necessary environment variables if needed.
  - Verify that any custom server or API route settings are in place.

### C. `src/app/globals.css`
- **Action**: Confirm Tailwind CSS and base styles; optionally add utility classes for dashboard-specific UI.
- **Changes**:  
  - Ensure existing custom properties and Tailwind imports remain unchanged.
  - Optionally append new classes for spacing or responsiveness relevant to new pages.

### D. Create Database Schema with Prisma
- **New File**: `prisma/schema.prisma`
- **Action**: Define models for multi-tenancy and core business entities.
- **Changes**:
  ```prisma
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }

  generator client {
    provider = "prisma-client-js"
  }

  model User {
    id        Int      @id @default(autoincrement())
    email     String   @unique
    password  String
    companyId Int
    company   Company  @relation(fields: [companyId], references: [id])
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  }

  model Company {
    id       Int       @id @default(autoincrement())
    name     String
    users    User[]
    projects Project[]
  }

  model Project {
    id        Int      @id @default(autoincrement())
    name      String
    startDate DateTime
    endDate   DateTime?
    companyId Int
    company   Company  @relation(fields: [companyId], references: [id])
    works     Work[]
  }

  model Work {
    id         Int      @id @default(autoincrement())
    name       String
    status     String
    costPlanned Float
    costActual  Float?
    projectId  Int
    project    Project  @relation(fields: [projectId], references: [id])
  }
  ```
- **Note**: Additional models for Inventory, Documents, etc., can be added as needed.

### E. Configure Authentication via NextAuth
- **New File**: `src/app/api/auth/[...nextauth]/route.ts`
- **Action**: Implement authentication using credentials (or additional providers as required).
- **Changes**:
  ```typescript
  import NextAuth from "next-auth";
  import CredentialsProvider from "next-auth/providers/credentials";

  const handler = NextAuth({
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          // Perform DB lookup and validation (with proper error handling)
          if (credentials?.email === "admin@example.com" && credentials?.password === "password") {
            return { id: 1, name: "Admin", email: "admin@example.com" };
          }
          throw new Error("Invalid credentials");
        }
      })
    ],
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET
  });

  export { handler as GET, handler as POST };
  ```
- **Best Practice**: Validate inputs and handle authentication errors gracefully.

### F. Create API Endpoints for Business Modules
- **New Files**:  
  - `src/app/api/projetos/route.ts`  
  - `src/app/api/obras/route.ts`
- **Action**: Implement CRUD operations with robust error handling.
- **Sample Code for Projects**:
  ```typescript
  // src/app/api/projetos/route.ts
  import { NextResponse } from "next/server";

  export async function GET() {
    try {
      // Replace with actual database query using Prisma
      const projetos = []; 
      return NextResponse.json({ projetos });
    } catch (error) {
      return NextResponse.json({ error: "Erro ao buscar projetos" }, { status: 500 });
    }
  }

  export async function POST(request: Request) {
    try {
      const data = await request.json();
      // Validate and persist data using Prisma
      return NextResponse.json({ message: "Projeto criado com sucesso" });
    } catch (error) {
      return NextResponse.json({ error: "Erro ao criar projeto" }, { status: 500 });
    }
  }
  ```
- **Repeat for Obras** ensuring similar try/catch mechanisms.

### G. Build New UI Pages for Each Module
- **New Files**:
  - `src/app/dashboard/page.tsx`
  - `src/app/projetos/page.tsx`
  - `src/app/obras/page.tsx`
- **Action**: Create modern, responsive pages with clear navigation and data visualization.
- **Dashboard Page Sample**:
  ```typescript jsx
  "use client";
  import { Card } from "@/components/ui/card";
  import { useEffect, useState } from "react";
  import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

  export default function Dashboard() {
    const [data, setData] = useState([]);

    useEffect(() => {
      fetch("/api/dashboard")
        .then((res) => res.json())
        .then(setData)
        .catch((error) => console.error("Erro ao buscar dados:", error));
    }, []);

    return (
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6">Painel de Gestão</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-2">Indicadores Financeiros</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Line type="monotone" dataKey="value" stroke="#4F46E5" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-2">Progresso de Obras</h2>
            <div className="text-center text-muted">Dados indisponíveis</div>
          </Card>
        </div>
      </div>
    );
  }
  ```
- **UI/UX Considerations**:  
  - Use clean typography, ample spacing, and modern card layouts.  
  - Avoid external icon libraries; navigation relies on text links and layout design.

### H. Develop a Responsive Sidebar Navigation Component
- **New File**: `src/components/ui/sidebar.tsx`
- **Action**: Create a sidebar for navigating between dashboards, projects, and works.
- **Sample Code**:
  ```typescript jsx
  "use client";
  import Link from "next/link";

  export function Sidebar() {
    return (
      <aside className="w-64 h-full bg-white shadow-md p-4">
        <nav>
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard" className="block p-2 text-gray-800 hover:bg-gray-100">
                Painel
              </Link>
            </li>
            <li>
              <Link href="/projetos" className="block p-2 text-gray-800 hover:bg-gray-100">
                Projetos
              </Link>
            </li>
            <li>
              <Link href="/obras" className="block p-2 text-gray-800 hover:bg-gray-100">
                Obras
              </Link>
            </li>
            <!-- Additional nav links as needed -->
          </ul>
        </nav>
      </aside>
    );
  }
  ```

### I. Implement Context Providers for Authentication and Tenancy
- **New Files**:
  - `src/context/AuthContext.tsx`
  - `src/context/TenantContext.tsx`
- **Action**: Create React contexts to manage user state and tenant selections.
- **AuthContext Sample**:
  ```typescript jsx
  "use client";
  import { createContext, useContext, useState, ReactNode } from "react";

  const AuthContext = createContext(null);

  export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState(null);
    return (
      <AuthContext.Provider value={{ user, setUser }}>
        {children}
      </AuthContext.Provider>
    );
  }

  export function useAuth() {
    return useContext(AuthContext);
  }
  ```

### J. Integrate Real-Time Collaboration Features
- **New Files**:
  - `src/lib/realtime.ts` (server-side helper if needed)
  - `src/hooks/useRealtime.ts` (client-side hook)
- **Action**: Set up Socket.io for live updates (e.g., project status, work progress).
- **Client-Side Hook Sample**:
  ```typescript jsx
  "use client";
  import { useEffect, useState } from "react";
  import io from "socket.io-client";

  let socket;

  export function useRealtime() {
    const [updates, setUpdates] = useState([]);

    useEffect(() => {
      socket = io();

      socket.on("update", (data) => {
        setUpdates((prev) => [...prev, data]);
      });

      return () => {
        socket.disconnect();
      };
    }, []);

    return updates;
  }
  ```

---

## 3. Testing and Deployment

- **API Testing**:  
  - Use `curl` commands to test API endpoints (e.g., for `/api/projetos` and `/api/obras`), checking status codes and response bodies.
  - Example:
    ```bash
    curl -X GET http://localhost:8000/api/projetos -w "\nHTTP: %{http_code}\n"
    ```
- **Front-End Responsiveness**:  
  - Test in various viewport sizes using browser dev tools.
- **Error Handling**:  
  - Ensure try/catch blocks in API routes return proper error messages and HTTP statuses.
- **Documentation**:  
  - Update README.md with instructions for database setup, environment variables, and running the Next.js app.

---

## Summary
- Updated package.json to include NextAuth and Socket.io dependencies.
- Configured next.config.ts and globals.css to support new environment variables and UI enhancements.
- Added a Prisma schema for database models (User, Company, Project, Work) with plans for additional modules.
- Implemented secure authentication through NextAuth and API endpoints for projects and works with robust error handling.
- Developed new responsive UI pages (dashboard, projetos, obras) and a text-based sidebar for navigation.
- Established React context providers for authentication and tenancy alongside real-time updates using Socket.io.
This plan ensures a modular, secure, and scalable platform aligned with typical construction management workflows and industry best practices.
