'use client';

import { useState, FormEvent } from 'react';

export default function SubscriptionForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Simple client-side validation
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }
    
    try {
      setStatus('loading');
      
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
      
      setMessage(data.message);
      
      // Reset form status after 5 seconds
      setTimeout(() => {
        if (status === 'success' || status === 'error') {
          setStatus('idle');
          setMessage('');
        }
      }, 5000);
      
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
      console.error('Subscription error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 md:gap-4">
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === 'loading'}
        className="w-full md:flex-1 px-4 py-2 rounded-xl bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:border-green-500 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-colors disabled:opacity-50 disabled:bg-green-800"
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      
      {message && (
        <div className={`mt-2 text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </div>
      )}
    </form>
  );
} 