import "express";

declare module 'express' {
    interface Request {
      cid?: string; // Your custom Correlation ID property
    }
  }