import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

interface EnvironmentVars {
  MONGODB_URI: boolean;
  MONGODB_DB: boolean;
}

export async function GET() {
  try {
    // Log connection attempt
    console.log('Attempting to connect to MongoDB...');
    
    // Get connection string from environment
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      return NextResponse.json({
        success: false,
        message: 'MONGODB_URI environment variable is not set',
      }, { status: 500 });
    }
    
    // Show masked connection string for debugging (hiding credentials)
    const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    console.log('Connection string (masked):', maskedUri);
    
    try {
      // Attempt connection with timeout
      console.log('Creating MongoDB client...');
      const client = new MongoClient(uri);
      
      console.log('Attempting to connect...');
      const connectPromise = client.connect();
      
      // Add timeout to connection attempt
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000);
      });
      
      // Race the connection against the timeout
      await Promise.race([connectPromise, timeoutPromise]);
      console.log('Connected successfully to server');
      
      // Try to access DB
      console.log('Accessing database...');
      const db = client.db(process.env.MONGODB_DB || 'flor_power');
      
      console.log('Listing collections...');
      const collections = await db.listCollections().toArray();
      
      // Close the connection
      await client.close();
      console.log('Connection closed');
      
      return NextResponse.json({
        success: true,
        message: 'Connected to MongoDB successfully',
        database: process.env.MONGODB_DB || 'flor_power',
        collections: collections.map(c => c.name),
        environmentVarsPresent: {
          MONGODB_URI: !!process.env.MONGODB_URI,
          MONGODB_DB: !!process.env.MONGODB_DB,
        } as EnvironmentVars
      });
    } catch (connError: unknown) {
      console.error('MongoDB connection error:', connError);
      
      const errorMessage = connError instanceof Error 
        ? connError.message 
        : String(connError);
        
      const errorStack = connError instanceof Error 
        ? connError.stack 
        : undefined;
        
      const errorCode = (connError as { code?: string }).code;
      const errorName = connError instanceof Error 
        ? connError.name 
        : undefined;
      
      return NextResponse.json({
        success: false,
        message: 'Failed to connect to MongoDB',
        error: errorMessage,
        stack: errorStack,
        code: errorCode,
        name: errorName
      }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error('Debug endpoint error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Unexpected error in debug endpoint',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 