import { MongoClient, MongoClientOptions } from 'mongodb';

// Check if we're in a build/SSR context or client runtime
const isBuildTime = typeof window === 'undefined' && process.env.NODE_ENV === 'production';

// Define connection options with better timeout and retry settings
const options: MongoClientOptions = {
  connectTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000, // 45 seconds
  serverSelectionTimeoutMS: 30000, // 30 seconds
  maxPoolSize: 10,
  minPoolSize: 5,
};

let clientPromise: Promise<MongoClient>;

// Skip MongoDB initialization during build time to avoid errors
if (isBuildTime) {
  console.log('Build time detected, skipping MongoDB initialization');
  const dummyClient = {} as MongoClient;
  clientPromise = Promise.resolve(dummyClient);
} else {
  // Check for MongoDB URI
  if (!process.env.MONGODB_URI) {
    console.error('MongoDB URI is not defined in environment variables');
    // Provide a dummy client that will properly error when methods are called
    const dummyClient = {
      db: () => {
        throw new Error('Could not connect to database - MongoDB URI is not defined');
      }
    } as unknown as MongoClient;
    clientPromise = Promise.resolve(dummyClient);
  } else {
    const uri = process.env.MONGODB_URI;
    console.log('Initializing MongoDB client...');
    
    try {
      let client: MongoClient;
      
      if (process.env.NODE_ENV === 'development') {
        // In development mode, use a global variable so that the value
        // is preserved across module reloads caused by HMR (Hot Module Replacement).
        const globalWithMongo = global as typeof global & {
          _mongoClientPromise?: Promise<MongoClient>;
        };

        if (!globalWithMongo._mongoClientPromise) {
          client = new MongoClient(uri, options);
          globalWithMongo._mongoClientPromise = client.connect()
            .catch(err => {
              console.error('Failed to connect to MongoDB in development:', err);
              throw err;
            });
        }
        clientPromise = globalWithMongo._mongoClientPromise!;
      } else {
        // In production mode, it's best to not use a global variable.
        client = new MongoClient(uri, options);
        clientPromise = client.connect()
          .catch(err => {
            console.error('Failed to connect to MongoDB in production:', err);
            throw err;
          });
      }
      
      // Test the connection
      clientPromise
        .then(client => {
          console.log('MongoDB client initialized successfully');
          return client.db('admin').command({ ping: 1 });
        })
        .then(() => console.log('MongoDB connection verified with ping'))
        .catch(err => console.error('MongoDB connection verification failed:', err));
        
    } catch (err) {
      console.error('Error setting up MongoDB client:', err);
      // Provide a dummy client that will properly error when methods are called
      const dummyClient = {
        db: () => {
          throw new Error('Could not connect to database - client initialization failed');
        }
      } as unknown as MongoClient;
      clientPromise = Promise.resolve(dummyClient);
    }
  }
}

// Export a module-scoped MongoClient promise.
export default clientPromise; 