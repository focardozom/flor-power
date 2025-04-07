import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// This is a simple admin endpoint to view all subscribers
// In a production app, you should add authentication to this endpoint!
export async function GET(request: NextRequest) {
  try {
    // Basic API key auth (not very secure, but better than nothing)
    const url = new URL(request.url);
    const apiKey = url.searchParams.get('apiKey');
    const adminKey = process.env.ADMIN_API_KEY || 'flor-power-admin-secret';
    
    if (apiKey !== adminKey) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    try {
      // Get MongoDB connection string from environment variables
      const uri = process.env.MONGODB_URI;
      if (!uri) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'MongoDB URI is not configured',
            debug: { env: process.env.NODE_ENV }
          },
          { status: 500 }
        );
      }
      
      console.log('Connecting to MongoDB...');
      
      // Connect directly instead of using the shared client
      const client = new MongoClient(uri, {
        connectTimeoutMS: 10000,
        socketTimeoutMS: 10000,
        serverSelectionTimeoutMS: 10000
      });
      
      await client.connect();
      console.log('Connected to MongoDB successfully');
      
      const db = client.db(process.env.MONGODB_DB || 'flor_power');
      const collection = db.collection('subscribers');
      
      // Get all subscribers
      const subscribers = await collection.find({}).toArray();
      console.log(`Found ${subscribers.length} subscribers`);
      
      // Close the connection
      await client.close();
      console.log('Connection closed');
      
      return NextResponse.json({
        success: true,
        count: subscribers.length,
        subscribers: subscribers.map(sub => ({ 
          email: sub.email, 
          subscribedAt: sub.subscribedAt 
        }))
      });
    } catch (dbError: unknown) {
      console.error('Database error:', dbError);
      
      // Provide detailed error information
      const errorMessage = dbError instanceof Error 
        ? dbError.message 
        : String(dbError);
        
      return NextResponse.json(
        { 
          success: false, 
          message: 'Database connection error',
          error: errorMessage,
          errorCode: (dbError as {code?: string}).code,
          errorName: dbError instanceof Error ? dbError.name : undefined
        },
        { status: 500 }
      );
    }
    
  } catch (error: unknown) {
    console.error('Error fetching subscribers:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while fetching subscribers',
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 