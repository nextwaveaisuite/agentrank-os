/**
 * DashboardLayout.tsx — updated with AI Office sidebar
 * Drop this into client/src/components/DashboardLayout.tsx
 *
 * Preserves the existing layout structure from the original AgentRank OS
 * and adds the Office navigation section.
 */

import { useState } from "react";
import { useLocation, Link } from "wouter";
import {
  Building2,
  Rocket,
  Users,
  Mail,
  PhoneCall,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Menu,
  X,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

// ─── NAV ITEMS ────────────────────────────────────────────────────────────────

const NAV = [
  {
    section: "AI Office",
    items: [
      { href: "/office", label: "My Office", icon: Building2 },
      { href: "/office/campaigns/new", label: "Launch campaign", icon: Rocket },
      { href: "/office/leads", label: "Leads", icon: Users },
      { href: "/office/email-approval", label: "Email approval", icon: Mail },
    ],
  },
  {
    section: "Platform",
    items: [
      { href: "/", label: "Home", icon: Home },
    ],
  },
];

// ─── NAV LINK ─────────────────────────────────────────────────────────────────

function NavLink({
  href,
  label,
  icon: Icon,
  collapsed,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  collapsed: boolean;
}) {
  const [location] = useLocation();
  const active = location === href || (href !== "/office" && location.startsWith(href));

  return (
    <Link href={href}>
      <a
        style={{
          display: "flex",
          alignItems: "center",
          gap: collapsed ? 0 : 10,
          padding: collapsed ? "8px" : "8px 12px",
          borderRadius: "var(--border-radius-md)",
          background: active ? "var(--color-background-info)" : "transparent",
          color: active ? "var(--color-text-info)" : "var(--color-text-secondary)",
          fontSize: 14,
          fontWeight: active ? 500 : 400,
          textDecoration: "none",
          transition: "all 0.12s",
          justifyContent: collapsed ? "center" : "flex-start",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          if (!active) e.currentTarget.style.background = "var(--color-background-secondary)";
        }}
        onMouseLeave={(e) => {
          if (!active) e.currentTarget.style.background = "transparent";
        }}
        title={collapsed ? label : undefined}
      >
        <Icon size={16} style={{ flexShrink: 0 }} />
        {!collapsed && <span>{label}</span>}
      </a>
    </Link>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => (window.location.href = "/"),
  });
  const meQuery = trpc.auth.me.useQuery();

  return (
    <div
      style={{
        width: collapsed ? 56 : 220,
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        background: "var(--color-background-primary)",
        borderRight: "0.5px solid var(--color-border-tertiary)",
        transition: "width 0.2s",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: collapsed ? 0 : 10,
          padding: collapsed ? "16px 8px" : "16px",
          justifyContent: collapsed ? "center" : "flex-start",
          borderBottom: "0.5px solid var(--color-border-tertiary)",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          AR
        </div>
        {!collapsed && (
          <span style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)", whiteSpace: "nowrap" }}>
            AgentRank OS
          </span>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "12px 8px" }}>
        {NAV.map((group) => (
          <div key={group.section} style={{ marginBottom: 20 }}>
            {!collapsed && (
              <p
                style={{
                  margin: "0 0 6px",
                  padding: "0 4px",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--color-text-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {group.section}
              </p>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {group.items.map((item) => (
                <NavLink key={item.href} collapsed={collapsed} {...item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: user + collapse toggle */}
      <div style={{ padding: "8px", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        {/* Logout */}
        <button
          onClick={() => logoutMutation.mutate()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: collapsed ? 0 : 8,
            padding: collapsed ? "8px" : "8px 12px",
            width: "100%",
            border: "none",
            borderRadius: "var(--border-radius-md)",
            background: "transparent",
            cursor: "pointer",
            fontSize: 14,
            color: "var(--color-text-tertiary)",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-background-secondary)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          title={collapsed ? "Sign out" : undefined}
        >
          <LogOut size={15} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Sign out</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "6px",
            marginTop: 4,
            border: "none",
            borderRadius: "var(--border-radius-md)",
            background: "transparent",
            cursor: "pointer",
            color: "var(--color-text-tertiary)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-background-secondary)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </div>
  );
}

// ─── MOBILE HEADER ────────────────────────────────────────────────────────────

function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        borderBottom: "0.5px solid var(--color-border-tertiary)",
        background: "var(--color-background-primary)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <button
        onClick={onMenuClick}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--color-text-secondary)",
          padding: 4,
          display: "flex",
        }}
      >
        <Menu size={20} />
      </button>
      <span style={{ fontSize: 15, fontWeight: 500 }}>AgentRank OS</span>
    </div>
  );
}

// ─── LAYOUT ───────────────────────────────────────────────────────────────────

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--color-background-tertiary)" }}>
      {/* Desktop sidebar */}
      <div style={{ display: "none" }} className="desktop-sidebar">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 200,
            }}
          />
          <div style={{ position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 201 }}>
            <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
          </div>
        </>
      )}

      {/* Always show sidebar on desktop via inline style */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-sidebar { display: flex !important; }
          .mobile-header { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-sidebar { display: none !important; }
          .mobile-header { display: flex !important; }
        }
      `}</style>

      {/* Sidebar always visible on desktop */}
      <div className="desktop-sidebar" style={{ display: "flex" }}>
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div className="mobile-header" style={{ display: "none" }}>
          <MobileHeader onMenuClick={() => setMobileOpen(true)} />
        </div>

        <main
          style={{
            flex: 1,
            background: "var(--color-background-primary)",
            minHeight: "100vh",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
