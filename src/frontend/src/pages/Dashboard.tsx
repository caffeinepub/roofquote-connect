import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@tanstack/react-router";
import {
  Home,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import type { Lead } from "../backend";
import { JobType } from "../backend";
import { useGetAllLeadsPublic } from "../hooks/useQueries";

const ADMIN_PASSWORD = "KangaroosandAustralia2026!!";
const SESSION_KEY = "rqc_admin_auth";

const JOB_TYPE_LABELS: Record<JobType, string> = {
  [JobType.repair]: "Repair",
  [JobType.replacement]: "Replacement",
  [JobType.inspection]: "Inspection",
  [JobType.emergency]: "Emergency",
};

const JOB_TYPE_COLOURS: Record<JobType, string> = {
  [JobType.repair]: "bg-blue-100 text-blue-800",
  [JobType.replacement]: "bg-purple-100 text-purple-800",
  [JobType.inspection]: "bg-green-100 text-green-800",
  [JobType.emergency]: "bg-red-100 text-red-800",
};

function formatDate(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => sessionStorage.getItem(SESSION_KEY) === "true",
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const {
    data: leads,
    isLoading: leadsLoading,
    refetch,
    isFetching,
  } = useGetAllLeadsPublic();

  const sortedLeads: Lead[] = leads
    ? [...leads].sort((a, b) => Number(b.createdAt - a.createdAt))
    : [];

  const year = new Date().getFullYear();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    setPassword("");
    setError("");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-brand-navy shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-orange rounded flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-display font-bold text-lg">
              RoofQuote <span className="text-brand-orange">Connect</span>
            </span>
          </Link>
          {isAuthenticated && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              data-ocid="admin.logout_button"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              Logout
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 w-full">
        {!isAuthenticated ? (
          /* Password Gate */
          <div className="flex items-center justify-center min-h-[80vh] px-4">
            <div className="w-full max-w-sm">
              <div className="bg-white rounded-2xl border border-border shadow-xl p-8">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-14 h-14 bg-brand-navy rounded-xl flex items-center justify-center mb-4">
                    <Lock className="w-7 h-7 text-brand-orange" />
                  </div>
                  <h1 className="font-display text-2xl font-bold text-brand-navy">
                    Admin Dashboard
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1 text-center">
                    Enter the admin password to view leads.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="admin-password"
                      className="text-brand-navy font-medium"
                    >
                      Password
                    </Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError("");
                      }}
                      className="border-border focus:border-brand-orange"
                      data-ocid="admin.password_input"
                      autoFocus
                    />
                  </div>

                  {error && (
                    <p
                      className="text-red-500 text-sm"
                      data-ocid="admin.error_state"
                    >
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white border-0 font-semibold"
                    data-ocid="admin.submit_button"
                  >
                    Enter Dashboard
                  </Button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          /* Leads Dashboard */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-brand-navy">
                Leads Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                View and manage all roofing quote submissions.
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: "Total Leads",
                  value: sortedLeads.length,
                  icon: <Mail className="w-5 h-5 text-brand-orange" />,
                },
                {
                  label: "Emergency",
                  value: sortedLeads.filter(
                    (l) => l.jobType === JobType.emergency,
                  ).length,
                  icon: <Wrench className="w-5 h-5 text-red-500" />,
                },
                {
                  label: "Repair",
                  value: sortedLeads.filter((l) => l.jobType === JobType.repair)
                    .length,
                  icon: <Wrench className="w-5 h-5 text-blue-500" />,
                },
                {
                  label: "Replacement",
                  value: sortedLeads.filter(
                    (l) => l.jobType === JobType.replacement,
                  ).length,
                  icon: <Wrench className="w-5 h-5 text-purple-500" />,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white border border-border rounded-xl p-4 shadow-card"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                      {stat.label}
                    </span>
                    {stat.icon}
                  </div>
                  <p className="font-display font-bold text-3xl text-brand-navy">
                    {leadsLoading ? (
                      <Skeleton className="h-8 w-10" />
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
              ))}
            </div>

            {/* Table header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-brand-navy text-lg">
                Lead Submissions
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="border-border"
              >
                {isFetching ? (
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-1.5" />
                )}
                Refresh
              </Button>
            </div>

            {leadsLoading ? (
              <div data-ocid="dashboard.loading_state" className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : sortedLeads.length === 0 ? (
              <div
                data-ocid="dashboard.empty_state"
                className="flex flex-col items-center gap-4 py-20 text-center bg-brand-grey rounded-xl"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-card">
                  <Mail className="w-8 h-8 text-brand-navy/40" />
                </div>
                <div>
                  <p className="font-semibold text-brand-navy">No leads yet.</p>
                  <p className="text-muted-foreground text-sm">
                    Leads will appear here once homeowners submit the form.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <Table data-ocid="dashboard.table">
                    <TableHeader>
                      <TableRow className="bg-brand-grey hover:bg-brand-grey">
                        <TableHead className="font-semibold text-brand-navy">
                          Name
                        </TableHead>
                        <TableHead className="font-semibold text-brand-navy">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" /> Phone
                          </span>
                        </TableHead>
                        <TableHead className="font-semibold text-brand-navy">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" /> Email
                          </span>
                        </TableHead>
                        <TableHead className="font-semibold text-brand-navy">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> Postcode
                          </span>
                        </TableHead>
                        <TableHead className="font-semibold text-brand-navy">
                          Type
                        </TableHead>
                        <TableHead className="font-semibold text-brand-navy">
                          Message
                        </TableHead>
                        <TableHead className="font-semibold text-brand-navy">
                          Date
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedLeads.map((lead, idx) => (
                        <TableRow
                          key={lead.id.toString()}
                          data-ocid={`dashboard.row.${idx + 1}`}
                          className="hover:bg-brand-grey/50 transition-colors"
                        >
                          <TableCell className="font-medium text-brand-navy">
                            {lead.name}
                          </TableCell>
                          <TableCell>
                            <a
                              href={`tel:${lead.phone.replace(/\s/g, "")}`}
                              className="text-brand-navy hover:text-brand-orange transition-colors flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              {lead.phone}
                            </a>
                          </TableCell>
                          <TableCell>
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-brand-navy hover:text-brand-orange transition-colors"
                            >
                              {lead.email}
                            </a>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {lead.postcode}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${JOB_TYPE_COLOURS[lead.jobType]} border-0 font-medium`}
                            >
                              {JOB_TYPE_LABELS[lead.jobType]}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <span className="text-muted-foreground text-sm truncate block">
                              {lead.message ?? "--"}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                            {formatDate(lead.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-brand-navy-dark py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-white/40 text-xs">
            &copy; {year}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 transition-colors"
            >
              Built with love using caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
