import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import dns from 'dns';
import { promisify } from 'util';

const dnsLookup = promisify(dns.lookup);

export async function GET(request: NextRequest) {
  try {
    // Basic API key auth
    const url = new URL(request.url);
    const apiKey = url.searchParams.get('apiKey');
    const adminKey = process.env.ADMIN_API_KEY || 'flor-power-admin-secret';
    
    if (apiKey !== adminKey) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Verify environment variables
    const diagnostics = {
      environment: process.env.NODE_ENV,
      envVars: {
        MONGODB_URI: !!process.env.MONGODB_URI,
        MONGODB_URI_LENGTH: process.env.MONGODB_URI?.length || 0,
        MONGODB_DB: process.env.MONGODB_DB || 'flor_power',
        ADMIN_API_KEY: !!process.env.ADMIN_API_KEY,
      },
      dns: {} as any,
      connection: {} as any,
    };
    
    // Extract hostname from URI for DNS lookup
    let hostname = '';
    try {
      if (process.env.MONGODB_URI) {
        const url = new URL(process.env.MONGODB_URI.replace('mongodb+srv://', 'https://'));
        hostname = url.hostname;
        
        // Test DNS resolution
        diagnostics.dns = {
          hostname,
          lookup: 'pending',
        };
        
        try {
          const dnsResult = await dnsLookup(hostname);
          diagnostics.dns.lookup = 'success';
          diagnostics.dns.address = dnsResult.address;
          diagnostics.dns.family = dnsResult.family;
        } catch (dnsError: any) {
          diagnostics.dns.lookup = 'failed';
          diagnostics.dns.error = dnsError.message;
        }
      }
    } catch (parseError: any) {
      diagnostics.dns.error = `Failed to parse URI: ${parseError.message}`;
    }
    
    // Test MongoDB connection
    diagnostics.connection = {
      status: 'pending',
    };
    
    try {
      // Only proceed if we have a connection string
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not set');
      }
      
      // Configure MongoDB client with verbose options
      const options = {
        connectTimeoutMS: 10000,
        socketTimeoutMS: 10000,
        serverSelectionTimeoutMS: 10000,
      };
      
      // Connect to MongoDB
      const client = new MongoClient(process.env.MONGODB_URI, options);
      diagnostics.connection.clientCreated = true;
      
      // Time the connection
      const startTime = Date.now();
      await client.connect();
      const connectTime = Date.now() - startTime;
      
      diagnostics.connection.status = 'connected';
      diagnostics.connection.connectTimeMs = connectTime;
      
      // Test command execution
      const adminDb = client.db('admin');
      const pingResult = await adminDb.command({ ping: 1 });
      
      diagnostics.connection.ping = pingResult.ok === 1 ? 'success' : 'failed';
      
      // Check intended database
      const db = client.db(process.env.MONGODB_DB || 'flor_power');
      const collections = await db.listCollections().toArray();
      
      diagnostics.connection.databaseAccessed = true;
      diagnostics.connection.collections = collections.map(c => c.name);
      
      // Close connection
      await client.close();
      diagnostics.connection.closed = true;
    } catch (dbError: any) {
      diagnostics.connection.status = 'failed';
      diagnostics.connection.error = dbError.message;
      diagnostics.connection.errorCode = dbError.code;
      diagnostics.connection.errorName = dbError.name;
    }
    
    // Return full diagnostics
    return NextResponse.json({
      success: diagnostics.connection.status === 'connected',
      diagnostics
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Test failed',
      error: error.message,
    }, { status: 500 });
  }
} 