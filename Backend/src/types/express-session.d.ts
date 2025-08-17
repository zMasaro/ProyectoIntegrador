import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: { email: string; name: string; rol: number }; // o lo que guardes
  }
}