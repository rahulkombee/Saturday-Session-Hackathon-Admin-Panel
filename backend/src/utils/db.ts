import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/app';

export async function connectDB(): Promise<void> {
  await mongoose.connect(MONGODB_URI);
}
