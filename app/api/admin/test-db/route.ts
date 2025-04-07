import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import dns from 'dns';
import { promisify } from 'util';

const dnsLookup = promisify(dns.lookup);

// Define proper types for our diagnostic data
interface DNSDiagnostics {
  hostname?: string;
  lookup?: 'pending' | 'success' | 'failed';
  address?: string;
  family?: number;
  error?: string;
}

interface ConnectionDiagnostics {
  status: 'pending' | 'connected' | 'failed';
  clientCreated?: boolean;
  connectTimeMs?: number;
  ping?: 'success' | 'failed';
  databaseAccessed?: boolean;
  collections?: string[];
  closed?: boolean;
  error?: string;
  errorCode?: string;
  errorName?: string;
}

interface DiagnosticsData {
  environment: string | undefined;
  envVars: {
    MONGODB_URI: boolean;
    MONGODB_URI_LENGTH: number;
    MONGODB_DB: string;
    ADMIN_API_KEY: boolean;
  };
  dns: DNSDiagnostics;
  connection: ConnectionDiagnostics;
}

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
    const diagnostics: DiagnosticsData = {
      environment: process.env.NODE_ENV,
      envVars: {
        MONGODB_URI: !!process.env.MONGODB_URI,
        MONGODB_URI_LENGTH: process.env.MONGODB_URI?.length || 0,
        MONGODB_DB: process.env.MONGODB_DB || 'flor_power',
        ADMIN_API_KEY: !!process.env.ADMIN_API_KEY,
      },
      dns: {},
      connection: {
        status: 'pending'
      },
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
        } catch (dnsError: unknown) {
          diagnostics.dns.lookup = 'failed';
          if (dnsError instanceof Error) {
            diagnostics.dns.error = dnsError.message;
          } else {
            diagnostics.dns.error = String(dnsError);
          }
        }
      }
    } catch (parseError: unknown) {
      if (parseError instanceof Error) {
        diagnostics.dns.error = `Failed to parse URI: ${parseError.message}`;
      } else {
        diagnostics.dns.error = `Failed to parse URI: ${String(parseError)}`;
      }
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
    } catch (dbError: unknown) {
      diagnostics.connection.status = 'failed';
      
      if (dbError instanceof Error) {
        diagnostics.connection.error = dbError.message;
        diagnostics.connection.errorName = dbError.name;
        
        // Handle case where error might have a code property
        const errorWithCode = dbError as { code?: string };
        if (errorWithCode.code) {
          diagnostics.connection.errorCode = errorWithCode.code;
        }
      } else {
        diagnostics.connection.error = String(dbError);
      }
    }
    
    // Return full diagnostics
    return NextResponse.json({
      success: diagnostics.connection.status === 'connected',
      diagnostics
    });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      message: 'Test failed',
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
} 