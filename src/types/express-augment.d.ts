import "express";

declare module 'express' {
    interface Request {
      cid?: string; 
    }
  }

declare module 'morgan' {
  interface Request {
      cid?: string;
  }
}

declare module 'jsonwebtoken';