import React, { useState } from "react";
import { UserRound, LockKeyhole, Mail, ArrowRight, Sparkles } from "lucide-react";
import Brand from "./Brand";

export default function Login({ onLogin, onRegister }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("alex@northbank.com");
  const [password, setPassword] = useState("northbank");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fillDemo = () => {
    setIsRegisterMode(false);
    setEmail("alex@northbank.com");
    setPassword("northbank");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isRegisterMode) {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError("Please fill out all fields.");
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
      }
      setLoading(true);
      try {
        await onRegister(name.trim(), email.trim(), password);
      } catch (err) {
        setError(err.message || "Failed to create account");
      } finally {
        setLoading(false);
      }
    } else {
      if (!email.trim() || !password.trim()) {
        setError("Enter your email and password to continue.");
        return;
      }
      setLoading(true);
      try {
        await onLogin(email.trim(), password);
      } catch (err) {
        setError(err.message || "Invalid credentials");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main className="login-shell min-h-dvh flex items-center">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1400px] items-stretch">
        {/* Left Hero Section (Desktop) */}
        <section className="hidden w-[48%] flex-col justify-between p-12 lg:flex xl:p-16">
          <Brand size="large" />
          <div className="max-w-lg pb-8">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
              Banking, made clear
            </p>
            <h1 className="text-[clamp(3.25rem,5.3vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.065em] text-slate-950">
              Your money.
              <br />
              <span className="text-sky-600">In your hands.</span>
            </h1>
            <p className="mt-7 max-w-md text-lg leading-8 text-slate-600">
              A simple place to see your balance, send money, and stay close to every transaction.
            </p>
          </div>
          <p className="text-xs font-medium tracking-wide text-slate-400">
            PRIVATE. SIMPLE. YOURS.
          </p>
        </section>

        {/* Right Form Card */}
        <section className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
          <div className="login-card w-full max-w-[470px] rounded-[2rem] border border-slate-200/80 bg-white p-7 shadow-[0_32px_80px_rgba(15,23,42,0.10)] sm:p-11">
            <div className="mb-10 lg:hidden">
              <Brand />
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-sky-700">
                  {isRegisterMode ? "Get started" : "Welcome back"}
                </p>
                <button
                  type="button"
                  onClick={fillDemo}
                  className="flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                  title="Auto-fill with test demo user"
                >
                  <Sparkles size={13} />
                  Demo User
                </button>
              </div>

              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-4xl">
                {isRegisterMode ? "Create an account" : "Sign in to your account"}
              </h2>
              <p className="mt-3 leading-7 text-slate-500">
                {isRegisterMode
                  ? "Open your digital banking account in seconds."
                  : "Your finances are ready when you are."}
              </p>
            </div>

            {/* Mode Switch Tabs */}
            <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(false);
                  setError("");
                }}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                  !isRegisterMode
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(true);
                  setError("");
                }}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                  isRegisterMode
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {isRegisterMode && (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Full Name</span>
                  <span className="input-wrap flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4">
                    <UserRound size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-14 min-w-0 flex-1 bg-transparent text-[15px] text-slate-900 outline-none placeholder:text-slate-400"
                      placeholder="e.g. Alex Morgan"
                      required
                    />
                  </span>
                </label>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Email address</span>
                <span className="input-wrap flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4">
                  <Mail size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 min-w-0 flex-1 bg-transparent text-[15px] text-slate-900 outline-none placeholder:text-slate-400"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
                <span className="input-wrap flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4">
                  <LockKeyhole size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 min-w-0 flex-1 bg-transparent text-[15px] text-slate-900 outline-none placeholder:text-slate-400"
                    placeholder={isRegisterMode ? "Create a password (min 8 chars)" : "Enter your password"}
                    autoComplete={isRegisterMode ? "new-password" : "current-password"}
                    required
                  />
                </span>
              </label>

              {error && (
                <div className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-600 border border-rose-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-sky-600 font-semibold text-white shadow-[0_12px_28px_rgba(2,132,199,0.24)] transition hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-70"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>{isRegisterMode ? "Create account" : "Sign in"}</span>
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </>
                )}
              </button>
            </form>

            <div className="mt-7 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setError("");
                }}
                className="text-xs text-slate-500 hover:text-sky-600 transition font-medium"
              >
                {isRegisterMode ? (
                  <>Already have an account? <span className="font-semibold text-sky-600">Sign in</span></>
                ) : (
                  <>New to Northbank? <span className="font-semibold text-sky-600">Create an account</span></>
                )}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

