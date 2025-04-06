import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body from the request
    const { email } = await request.json();
    
    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'flor_power');
    const collection = db.collection('subscribers');
    
    // Check if email already exists
    const existingSubscriber = await collection.findOne({ email });
    if (existingSubscriber) {
      return NextResponse.json(
        { success: false, message: 'Email already subscribed' },
        { status: 400 }
      );
    }
    
    // Add the new subscriber
    await collection.insertOne({
      email,
      subscribedAt: new Date(),
    });
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Subscription successful'
    });
    
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during subscription' },
      { status: 500 }
    );
  }
} 