
import { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { MessageSquare, Send } from 'lucide-react';

const FeedbackPage = () => {
  const [subject, setSubject] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const { user } = useAuth();
  const username = user ? user.user_metadata.username : ' ';
  const email = user ? user.email : ' ';

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
        const { error } = await supabase.functions.invoke('send-suggestion-ack', {
            body: {
                email: email,
                name: username,
                subject: subject,
                suggestion: suggestion,
            },
        });

        if (error) {
            console.error('Error invoking edge function:', error);
            throw new Error(error.message || 'Failed to submit suggestion');
        }

        setSubmitStatus('success');
        setSubject('');
        setSuggestion('');
        setCooldown(60); // Start 60s cooldown
    } catch (err) {
        console.error('Submission error:', err);
        setSubmitStatus('error');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
            <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Feedback & Suggestions
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Help us improve Horizon. Report bugs or suggest new features.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Feature Request: Dark mode improvements"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
            <textarea
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              placeholder="Tell us what's on your mind..."
              className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || cooldown > 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              'Sending...'
            ) : cooldown > 0 ? (
              `Wait ${cooldown}s`
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Feedback
              </>
            )}
          </button>
        </form>

        {submitStatus === 'success' && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center animate-fade-in">
            <p className="text-green-800 dark:text-green-300 font-medium">
              Thank you! Your feedback has been sent successfully.
            </p>
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center animate-fade-in">
             <p className="text-red-800 dark:text-red-300 font-medium">
              Something went wrong. Please try again later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
