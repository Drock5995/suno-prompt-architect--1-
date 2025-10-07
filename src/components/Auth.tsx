import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { LogoIcon } from './icons/Icons';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      }
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-spotify-gray-500 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <LogoIcon size={64} />
          <h1 className="text-4xl font-bold text-white mt-4">Suno Architect</h1>
          <p className="text-spotify-gray-100 mt-2">Your AI Music Co-pilot</p>
        </div>
        
        <div className="bg-black p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-white mb-6">{isLogin ? 'Log In' : 'Sign Up'}</h2>
            <form onSubmit={handleAuth} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-spotify-gray-100">Email address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-1 p-3 bg-spotify-gray-300 border border-spotify-gray-200 rounded-md text-white focus:ring-spotify-green focus:border-spotify-green"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label htmlFor="password"className="block text-sm font-medium text-spotify-gray-100">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete={isLogin ? "current-password" : "new-password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mt-1 p-3 bg-spotify-gray-300 border border-spotify-gray-200 rounded-md text-white focus:ring-spotify-green focus:border-spotify-green"
                        placeholder="••••••••"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-black bg-spotify-green hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-spotify-green disabled:bg-spotify-gray-200 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div> : (isLogin ? 'Log In' : 'Sign Up')}
                    </button>
                </div>
            </form>
            {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}
            {message && <p className="mt-4 text-center text-sm text-green-400">{message}</p>}
            <p className="mt-6 text-center text-sm text-spotify-gray-100">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }} className="font-medium text-spotify-green hover:text-green-400">
                    {isLogin ? 'Sign up' : 'Log in'}
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;