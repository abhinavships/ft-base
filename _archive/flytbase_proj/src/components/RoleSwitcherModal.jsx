import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import { 
  User, 
  Lock, 
  Key, 
  X, 
  Check, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function RoleSwitcherModal() {
  const { currentUser, userProfiles, login } = useAuth();
  const { isAuthModalOpen, setIsAuthModalOpen, setViewMode } = useProject();

  const [username, setUsername] = useState(currentUser.username);
  const [password, setPassword] = useState(currentUser.password || 'peter@123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);

    const result = login(username, password);
    if (!result.success) {
      setErrorMessage(result.error);
    } else {
      setSuccessMessage(`Authenticated as ${result.user.name} (${result.user.role})`);
      if (result.user.roleType === 'client') {
        setViewMode('customer');
      } else {
        setViewMode('internal');
      }
      setTimeout(() => {
        setSuccessMessage(null);
        setIsAuthModalOpen(false);
      }, 700);
    }
  };

  const handleQuickFill = (user) => {
    setUsername(user.username);
    setPassword(user.password);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="card-clean rounded-xl w-full max-w-md p-5 border border-zinc-800 bg-[#12151E] shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
            <Lock className="w-4 h-4 text-zinc-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Role Authentication</h3>
            <p className="text-[11px] text-zinc-400">
              Enter credentials to switch active role permissions.
            </p>
          </div>
        </div>

        {/* Quick-Select Credentials Hint Grid */}
        <div className="my-3 p-2.5 rounded-lg bg-zinc-950 border border-zinc-850 space-y-1.5">
          <span className="text-[10px] font-mono font-semibold uppercase text-zinc-400 block">
            Click to auto-fill credentials:
          </span>
          <div className="space-y-1">
            {userProfiles.map((u) => {
              const isCurrent = currentUser.id === u.id;

              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickFill(u)}
                  className={`w-full text-left px-2 py-1.5 rounded-md border text-xs transition-all flex items-center justify-between ${
                    username === u.username
                      ? 'bg-zinc-800 border-zinc-600 text-white'
                      : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-300 hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <img src={u.avatar} alt={u.name} className="w-4 h-4 rounded-full object-cover shrink-0" />
                    <span className="font-medium truncate">{u.name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">({u.badge})</span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 shrink-0">
                    key: <span className="text-zinc-200">{u.password}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              User ID / Username
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. peter.parker or tony.stark"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrorMessage(null);
                }}
                className="w-full bg-zinc-950 text-xs text-white placeholder-zinc-500 rounded-lg pl-8 pr-3 py-1.5 border border-zinc-800 focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Key className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage(null);
                }}
                className="w-full bg-zinc-950 text-xs text-white placeholder-zinc-500 rounded-lg pl-8 pr-9 py-1.5 border border-zinc-800 focus:outline-none focus:border-zinc-600 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-2 rounded-md bg-red-950/50 border border-red-800/50 text-[11px] text-red-300 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-2 rounded-md bg-emerald-950/50 border border-emerald-800/50 text-[11px] text-emerald-300 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(false)}
              className="px-3 py-1.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 rounded-md text-xs font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-1 px-3.5 py-1.5 bg-zinc-100 hover:bg-white text-zinc-900 rounded-md text-xs font-bold transition-all"
            >
              <span>Log In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
