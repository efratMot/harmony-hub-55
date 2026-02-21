import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, LogOut, Music, Shield, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      location.pathname === path ? "text-primary" : "text-muted-foreground"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Music className="h-6 w-6 text-accent" />
          <span className="font-display text-xl font-bold text-foreground">Harmony</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className={linkClass("/")}>Shop</Link>
          {isAuthenticated && isAdmin && (
            <Link to="/admin" className={linkClass("/admin")}>
              <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> Admin</span>
            </Link>
          )}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Link to="/cart" className="relative text-muted-foreground transition-colors hover:text-primary">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{user?.name}</span>
              <button onClick={logout} className="text-muted-foreground transition-colors hover:text-destructive">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              <User className="h-4 w-4" /> Login
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t bg-card md:hidden"
          >
            <div className="flex flex-col gap-3 p-4">
              <Link to="/" onClick={() => setMobileOpen(false)} className={linkClass("/")}>Shop</Link>
              <Link to="/cart" onClick={() => setMobileOpen(false)} className={linkClass("/cart")}>
                Cart {totalItems > 0 && `(${totalItems})`}
              </Link>
              {isAuthenticated && isAdmin && (
                <Link to="/admin" onClick={() => setMobileOpen(false)} className={linkClass("/admin")}>Admin</Link>
              )}
              {isAuthenticated ? (
                <button onClick={() => { logout(); setMobileOpen(false); }} className="text-left text-sm text-destructive">
                  Logout
                </button>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className={linkClass("/login")}>Login</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
