import { MongoClient } from "mongodb"

// Check if we're in a build environment or if MONGODB_URI is not set
if (!process.env.MONGODB_URI) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error("MONGODB_URI must be defined in production")
  }
  // In development, we'll use a mock client for build time
  console.warn("MONGODB_URI not set, using mock client for build time")
}

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/beautySalon"
const options = {}

let client
let clientPromise

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

// Database connection test
export async function testConnection() {
  try {
    const client = await clientPromise
    const db = client.db("beautySalon")
    await db.admin().ping()
    console.log("MongoDB connected successfully")
    return true
  } catch (error) {
    console.error("MongoDB connection failed:", error)
    return false
  }
}

// Get database instance
export async function getDatabase() {
  const client = await clientPromise
  return client.db("beautySalon")
}
