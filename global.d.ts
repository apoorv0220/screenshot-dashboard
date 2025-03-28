import mongoose from 'mongoose';

declare global {
  const mongoose: {
    conn: mongoose.Mongoose | null
    promise: Promise<mongoose.Mongoose> | null
  }
}