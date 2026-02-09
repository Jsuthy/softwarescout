"use client";

import { useState, useEffect, useCallback } from "react";
import type { Lead } from "@/lib/types";

export default function AdminLeadsPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchLeads = useCallback(async (pw: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ password: pw, sort: sortDir });
      if (filterCategory) params.set("category", filterCategory);
      if (filterStatus) params.set("status", filterStatus);

      const res = await fetch(`/api/admin/leads?${params}`);
      if (!res.ok) {
        if (res.status === 401) {
          setAuthenticated(false);
          setAuthError("Session expired. Please log in again.");
        }
        return;
      }
      const data = await res.json();
      setLeads(data.leads || []);
    } catch {
      // Network error
    } finally {
      setLoading(false);
    }
  }, [sortDir, filterCategory, filterStatus]);

  useEffect(() => {
    if (authenticated) {
      fetchLeads(password);
    }
  }, [authenticated, password, fetchLeads]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    // Verify by making a request
    fetch(`/api/admin/leads?password=${encodeURIComponent(password)}`)
      .then((res) => {
        if (res.ok) {
          setAuthenticated(true);
        } else {
          setAuthError("Invalid password");
        }
      })
      .catch(() => setAuthError("Connection error"));
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-24">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-8">
          <h1 className="text-xl font-bold">Admin Access</h1>
          <p className="mt-1 text-sm text-[var(--fg-secondary)]">
            Enter the admin password to view leads
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm transition-colors placeholder:text-[var(--fg-tertiary)] focus:border-[var(--accent)] focus:outline-none"
              autoFocus
            />
            {authError && (
              <p className="text-sm text-red-400">{authError}</p>
            )}
            <button
              type="submit"
              className="w-full rounded-xl bg-[var(--accent)] py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  const categories = [...new Set(leads.map((l) => l.software_category))].sort();
  const statuses = ["new", "contacted", "sold", "invalid"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="mt-1 text-[var(--fg-secondary)]">
            {leads.length} total leads
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setSortDir(sortDir === "desc" ? "asc" : "desc")}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm transition-colors hover:bg-[var(--bg-secondary)]"
        >
          Date: {sortDir === "desc" ? "Newest first" : "Oldest first"}
        </button>

        {loading && (
          <span className="text-sm text-[var(--fg-tertiary)]">Loading...</span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bg-secondary)]">
              <th className="p-4 text-left font-semibold text-[var(--fg-tertiary)]">
                Date
              </th>
              <th className="p-4 text-left font-semibold">Name</th>
              <th className="p-4 text-left font-semibold">Email</th>
              <th className="p-4 text-left font-semibold">Company</th>
              <th className="p-4 text-left font-semibold">Category</th>
              <th className="p-4 text-left font-semibold">Industry</th>
              <th className="p-4 text-left font-semibold">Budget</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-left font-semibold">Matched</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-12 text-center text-[var(--fg-tertiary)]"
                >
                  {loading ? "Loading leads..." : "No leads found"}
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-t border-[var(--border)] transition-colors hover:bg-[var(--bg-secondary)]"
                >
                  <td className="whitespace-nowrap p-4 text-[var(--fg-tertiary)]">
                    {formatDate(lead.created_at)}
                  </td>
                  <td className="p-4 font-medium">{lead.name}</td>
                  <td className="p-4">
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-[var(--accent)] hover:underline"
                    >
                      {lead.email}
                    </a>
                  </td>
                  <td className="p-4 text-[var(--fg-secondary)]">
                    {lead.company_name || "—"}
                  </td>
                  <td className="p-4">{lead.software_category}</td>
                  <td className="p-4 text-[var(--fg-secondary)]">
                    {lead.industry || "—"}
                  </td>
                  <td className="p-4">{lead.budget || "—"}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        lead.status === "new"
                          ? "bg-blue-500/10 text-blue-400"
                          : lead.status === "contacted"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : lead.status === "sold"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 text-[var(--fg-secondary)]">
                    {Array.isArray(lead.matched_tools)
                      ? lead.matched_tools
                          .map((t) =>
                            typeof t === "string" ? t : t.name
                          )
                          .join(", ")
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
