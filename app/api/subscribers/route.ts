import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../app/lib/mongodb';

// This is a simple admin endpoint to view all subscribers
// In a production app, you should add authentication to this endpoint!
export async function GET(request: NextRequest) {
  try {
    // Basic API key auth (not very secure, but better than nothing)
    const url = new URL(request.url);
    const apiKey = url.searchParams.get('apiKey');
    const adminKey = process.env.ADMIN_API_KEY || 'flor-power-admin';
    
    if (apiKey !== adminKey) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'flor_power');
    const collection = db.collection('subscribers');
    
    // Get all subscribers
    const subscribers = await collection.find({}).toArray();
    
    return NextResponse.json({
      success: true,
      count: subscribers.length,
      subscribers: subscribers.map(sub => ({ 
        email: sub.email, 
        subscribedAt: sub.subscribedAt 
      }))
    });
    
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching subscribers' },
      { status: 500 }
    );
  }
} 