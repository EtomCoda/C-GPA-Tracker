import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignIn) {
        await signIn(email, password);
      } else {
        await signUp(email, password, username);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col lg:flex-row items-center justify-center p-4 relative overflow-hidden">
      {/* Left Side */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center text-center p-8 lg:p-16">
        <h1
          className="text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-green-400 dark:from-blue-600 dark:to-green-600 animate-fade-in-down"
          style={{ textShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
        >
          Horizon
        </h1>
        <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 mt-4 animate-fade-in-up">
          Track your academic progress. Predict your performance. <p>Stay one step ahead.</p>
        </p>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <div className="bg-white bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-xl max-w-md w-full p-8 z-10 animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-center mb-6">
            <img src="/horizon.png" alt="Horizon logo" className="w-32 h-32 object-contain shadow-xl rounded-xl" />
          </div>
          <p className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
            {isSignIn ? 'Sign in' : 'Create a new account'}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isSignIn && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    required
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 rounded-lg transition-colors mt-6"
            >
              {loading ? 'Loading...' : isSignIn ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {isSignIn ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => {
                  setIsSignIn(!isSignIn);
                  setError('');
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                {isSignIn ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-600">
            <div className="flex items-center justify-center">
              <p>Horizon by EtomCoda</p>
              <img src="/metransparent.png" alt="Horizon logo" className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
