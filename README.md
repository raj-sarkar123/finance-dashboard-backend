# Finance Dashboard Backend

## Overview
Backend system for managing financial records with role-based access control.

## Tech Stack
- Node.js
- Express
- Supabase (PostgreSQL)
- JWT Authentication

## Features
- User authentication
- Role-based access control (Viewer, Analyst, Admin)
- Financial records CRUD
- Dashboard analytics (summary, trends, categories)

## Setup Instructions
1. Clone repo
2. npm install
3. Add .env
4. npm run dev

## Environment Variables
PORT=
SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=

## Role-Based Access Control
- Viewer → read-only
- Analyst → read + dashboard
- Admin → full access

## Important Security Note
Users cannot self-assign roles. All new users are created as 'viewer'.
Admin roles are assigned only by existing admins.

## API Endpoints
(mention all your APIs here)

## Sample Flow
Register → Login → Get Token → Use APIs