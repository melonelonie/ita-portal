import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSuccess(true);
  };

  return (
    <div className="flex min-h-screen bg-[#09090b]">
      {/* Left Panel - Simplified gradient */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-[#09090b] to-purple-950" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-indigo-500/15 blur-[120px]"
          animate={{ x: [0, 30, -20, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '20%', left: '30%' }}
        />

        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
              <span className="text-xl font-bold text-white">I</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              ITA
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Password Recovery
          </h1>
          <p className="text-lg text-zinc-400 max-w-md">
            Don't worry, it happens to the best of us. We'll help you get back in.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-16">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back button */}
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </button>

          {!isSuccess ? (
            <>
              <div className="mb-8">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6">
                  <Mail className="w-7 h-7 text-indigo-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Forgot password?</h2>
                <p className="text-zinc-500">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@initus.com"
                    required
                    className="w-full h-12 px-4 rounded-xl border border-[#27272a] bg-[#18181b] text-zinc-200 placeholder-zinc-600 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold transition-all hover:from-indigo-500 hover:to-purple-500 hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span className={`transition-opacity ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                    Send Reset Link
                  </span>
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  )}
                </button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Check your email</h2>
              <p className="text-zinc-400 mb-8">
                We've sent a password reset link to{' '}
                <span className="text-zinc-200 font-medium">{email}</span>
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full h-12 rounded-xl border border-[#27272a] bg-[#18181b] text-zinc-200 font-medium hover:bg-[#27272a] transition-colors"
              >
                Back to login
              </button>
              <p className="mt-4 text-sm text-zinc-600">
                Didn't receive the email?{' '}
                <button
                  onClick={() => setIsSuccess(false)}
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  Try again
                </button>
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
