# Chatty - Real Time MERN Chat App

Chatty is a real-time chat application built using the MERN stack (MongoDB, Express, React, Node.js). The project utilizes various technologies to provide a seamless and feature-rich chatting experience. 🚀💬

## Features

- **Authentication:**
  - Fully supported authentication using Google OAuth.
  - Custom authentication mechanism with JWT tokens for access and refresh token management.
  - Refresh token management using cookies. 🍪🔐

- **Real-time Communication:**
  - Leveraging Socket.io for real-time connections between clients and the server.
  - Enables instant messaging and updates in conversations. 🚀📡

- **Frontend Technologies:**
  - Vite + React for a fast and efficient development environment.
  - TypeScript for type safety throughout the application.
  - Redux Toolkit and Redux Toolkit Query for global state management and server state management.
  - Material-UI (MUI) for a sleek and responsive user interface.
  - Emoji picker integration for a fun and expressive chat experience. 😄✨
  - React Hook Form for robust form validation.

- **Backend Technologies:**
  - Node.js + Express for the server-side implementation.
  - MongoDB for the database, with Mongoose as the ODM (Object Document Mapper).
  - TypeScript for enhanced type safety.
  - Custom authentication system with JWT tokens for secure access and refresh token management.
  - Efficient handling of refresh tokens using cookies. 🍪👮‍♂️

## Project Structure

### Client

- **/public:** Contains static assets.
- **/src:**
  - **/components:** Reusable React components.
  - **/hooks:** Reusable custom hooks.
  - **/pages:** React components representing different application pages/routes.
  - **/utils:** Utility functions used across the application.
  - **/store:** Redux Toolkit and Redux Toolkit Query setup.
  - **/types:** TypeScript types and interfaces.
  - **/validations:** Reusable functions for React Hook Form.
  - **App.tsx, main.tsx, and other...** Main entry points and additional application files. 📁🚀

### Server

- **/src:**
  - **/controllers:** Controller functions handling business logic.
  - **/models:** Database models defined using Mongoose.
  - **/routes:** Route definitions for various endpoints.
  - **/utils:** Utility functions used on the server.
  - **app.ts, index.ts, auth.d.ts:** Main entry points and TypeScript declaration file for authentication. 🚀🌐

Feel free to explore, contribute, and enhance your MERN stack skills with this project! 🚀🎉
