import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  try {
    // Simple direct connection test
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      return NextResponse.json({ error: 'No MongoDB URI provided in environment variables' });
    }
    
    // Create a new client and connect
    const client = new MongoClient(uri);
    await client.connect();
    
    // Test the connection by accessing the admin database
    const adminDb = client.db('admin');
    const result = await adminDb.command({ ping: 1 });
    
    // Close the connection
    await client.close();
    
    return NextResponse.json({
      success: true,
      ping: result.ok === 1 ? 'success' : 'failed',
      message: 'MongoDB connection test successful'
    });
  } catch (error: unknown) {
    // Return detailed error information
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      code: (error as { code?: string }).code,
      name: error instanceof Error ? error.name : typeof error,
      message: 'MongoDB connection test failed'
    });
  }
} 