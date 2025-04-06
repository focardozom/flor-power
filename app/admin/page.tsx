'use client';

import { useState, useEffect } from 'react';
import ClientOnly from '../components/ClientOnly';

interface Subscriber {
  email: string;
  subscribedAt: string;
}

export default function AdminPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  
  const fetchSubscribers = async () => {
    if (!apiKey) {
      setError('API key is required');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/subscribers?apiKey=${encodeURIComponent(apiKey)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch subscribers');
      }
      
      setSubscribers(data.subscribers || []);
    } catch (err) {
      setError((err as Error).message);
      setSubscribers([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSubscribers();
  };
  
  const handleExport = () => {
    const csvContent = 
      'data:text/csv;charset=utf-8,' + 
      'Email,Subscribed At\n' +
      subscribers.map(s => 
        `${s.email},${new Date(s.subscribedAt).toLocaleString()}`
      ).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `flor-power-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ClientOnly>
      <main className="min-h-screen p-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Flor Power Admin - Subscribers</h1>
          
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter admin API key"
                className="flex-1 px-4 py-2 border border-gray-300 rounded"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded disabled:bg-blue-400"
              >
                {isLoading ? 'Loading...' : 'Fetch Subscribers'}
              </button>
            </div>
            
            {error && (
              <p className="mt-2 text-red-500">{error}</p>
            )}
          </form>
          
          {subscribers.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Subscribers ({subscribers.length})
                </h2>
                <button
                  onClick={handleExport}
                  className="px-4 py-1 bg-green-600 text-white text-sm rounded"
                >
                  Export CSV
                </button>
              </div>
              
              <div className="border border-gray-300 rounded overflow-hidden">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subscribed At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subscribers.map((subscriber, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {subscriber.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(subscriber.subscribedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          
          {subscribers.length === 0 && !isLoading && !error && (
            <p className="text-center py-8 text-gray-500">
              No subscribers found or enter your API key to view subscribers.
            </p>
          )}
        </div>
      </main>
    </ClientOnly>
  );
} 