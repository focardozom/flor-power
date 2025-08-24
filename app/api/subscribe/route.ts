import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { sendEmail, generateWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body from the request
    const { email, language = 'es' } = await request.json();
    
    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
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
      
      console.log('Connecting to MongoDB for subscription...');
      
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
      
      // Check if email already exists
      const existingSubscriber = await collection.findOne({ email });
      if (existingSubscriber) {
        await client.close();
        return NextResponse.json(
          { success: false, message: 'Email already subscribed' },
          { status: 400 }
        );
      }
      
      // Add the new subscriber
      const result = await collection.insertOne({
        email,
        subscribedAt: new Date(),
      });
      
      console.log(`Added new subscriber: ${email}`, result.insertedId);
      
      // Close the connection
      await client.close();
      console.log('Connection closed');
      
      // Send welcome email
      try {
        const welcomeEmail = generateWelcomeEmail(email, language);
        const emailResult = await sendEmail({
          to: email,
          subject: welcomeEmail.subject,
          html: welcomeEmail.html,
        });
        
        if (!emailResult.success) {
          console.warn('Failed to send welcome email:', emailResult.error);
        }
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // Continue with the subscription process even if the email fails
      }
      
      // Return success response
      return NextResponse.json({
        success: true,
        message: 'Subscription successful'
      });
    } catch (dbError: unknown) {
      console.error('Database error during subscription:', dbError);
      
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
    console.error('Subscription error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred during subscription',
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 