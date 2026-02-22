import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Music } from "lucide-react";
import { motion } from "framer-motion";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    const success = await register(name, email, password);
    setLoading(false);
    if (success) {
      navigate("/");
    } else {
      setError("Email already registered");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="rounded-xl bg-card p-8 shadow-card">
          <div className="mb-6 text-center">
            <Music className="mx-auto h-8 w-8 text-accent" />
            <h1 className="mt-3 font-display text-2xl font-bold">Create Account</h1>
            <p className="mt-1 text-sm text-muted-foreground">Join our community of musicians</p>
          </div>

          {error && <p className="mb-4 rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-accent/30" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-accent/30" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border bg-background px-4 py-2.5 pr-10 text-sm outline-none transition-all focus:ring-2 focus:ring-accent/30" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full rounded-lg bg-gradient-warm py-3 text-sm font-semibold text-primary-foreground shadow-button transition-opacity hover:opacity-90 disabled:opacity-50">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
