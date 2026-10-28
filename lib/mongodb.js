import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'mh-study-hub';

const globalWithMongo = globalThis;

let cached = globalWithMongo.__mongo;

if (!cached) {
  cached = globalWithMongo.__mongo = { client: null, promise: null };
}

const mongoOptions = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 5000,
  maxPoolSize: 5,
};

export async function getMongoClient() {
  if (!uri) {
    throw new Error(
      'MongoDB is not configured. Add MONGODB_URI to your environment variables.'
    );
  }

  if (!cached.client) {
    cached.promise ??= new MongoClient(uri, mongoOptions).connect();
    try {
      cached.client = await cached.promise;
    } catch (error) {
      cached.promise = null;
      throw error;
    }
  }

  return cached.client;
}

export async function getDb() {
  const client = await getMongoClient();
  return client.db(dbName);
}
