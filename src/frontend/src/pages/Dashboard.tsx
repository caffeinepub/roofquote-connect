import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  KeyRound,
  Loader2,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import type { Lead } from "../backend";
import { JobType } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useClaimAdmin, useGetAllLeads, useIsAdmin } from "../hooks/useQueries";

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
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const isLoggedIn = !!identity;

  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const {
    data: leads,
    isLoading: leadsLoading,
    refetch,
    isFetching,
  } = useGetAllLeads();

  const claimAdmin = useClaimAdmin();
  const [adminToken, setAdminToken] = useState("");
  const [claimError, setClaimError] = useState("");
  const [claimSuccess, setClaimSuccess] = useState(false);

  const handleClaimAdmin = async () => {
    setClaimError("");
    try {
      await claimAdmin.mutateAsync(adminToken);
      setClaimSuccess(true);
    } catch {
      setClaimError(
        "Invalid token. Please check your Caffeine admin token and try again.",
      );
    }
  };

  const sortedLeads: Lead[] = leads
    ? [...leads].sort((a, b) => Number(b.createdAt - a.createdAt))
    : [];

  const year = new Date().getFullYear();

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
          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <span className="text-white/60 text-xs hidden sm:inline">
                {identity?.getPrincipal().toString().slice(0, 12)}...
              </span>
            )}
            {isLoggedIn ? (
              <Button
                variant="outline"
                size="sm"
                onClick={clear}
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Logout
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn || isInitializing}
                className="bg-brand-orange hover:bg-brand-orange-hover text-white border-0"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4 mr-1.5" />
                )}
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-brand-navy">
            Leads Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage all roofing quote submissions.
          </p>
        </div>

        {/* Not logged in */}
        {!isLoggedIn && (
          <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
            <div className="w-20 h-20 bg-brand-navy/8 rounded-full flex items-center justify-center">
              <LogIn className="w-10 h-10 text-brand-navy" />
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl text-brand-navy">
                Admin Login Required
              </h2>
              <p className="text-muted-foreground mt-2 max-w-sm">
                You must be logged in as an administrator to view lead
                submissions.
              </p>
            </div>
            <Button
              onClick={login}
              disabled={isLoggingIn || isInitializing}
              size="lg"
              className="bg-brand-orange hover:bg-brand-orange-hover text-white border-0 px-8"
              data-ocid="dashboard.primary_button"
            >
              {isLoggingIn ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <LogIn className="w-5 h-5 mr-2" />
              )}
              Login with Internet Identity
            </Button>
          </div>
        )}

        {/* Loading admin status */}
        {isLoggedIn && adminLoading && (
          <div
            data-ocid="dashboard.loading_state"
            className="flex items-center justify-center gap-3 py-24"
          >
            <Loader2 className="w-6 h-6 text-brand-navy animate-spin" />
            <span className="text-muted-foreground">
              Checking permissions...
            </span>
          </div>
        )}

        {/* Access denied - show claim admin form */}
        {isLoggedIn && !adminLoading && !isAdmin && (
          <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
            {claimSuccess ? (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-2xl text-brand-navy">
                    Admin Access Granted
                  </h2>
                  <p className="text-muted-foreground mt-2 max-w-sm">
                    You now have administrator access. Reload the page to view
                    your leads.
                  </p>
                </div>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-brand-orange hover:bg-brand-orange-hover text-white border-0 px-8"
                >
                  View Leads Dashboard
                </Button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
                  <ShieldAlert className="w-10 h-10 text-amber-600" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-2xl text-brand-navy">
                    Set Up Admin Access
                  </h2>
                  <p className="text-muted-foreground mt-2 max-w-sm">
                    Enter your Caffeine admin token to claim administrator
                    access for this app. You only need to do this once.
                  </p>
                </div>
                <div className="w-full max-w-sm space-y-3">
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Enter admin token"
                      value={adminToken}
                      onChange={(e) => setAdminToken(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleClaimAdmin()}
                      className="pl-9"
                      data-ocid="dashboard.input"
                    />
                  </div>
                  {claimError && (
                    <p
                      className="text-red-600 text-sm"
                      data-ocid="dashboard.error_state"
                    >
                      {claimError}
                    </p>
                  )}
                  <Button
                    onClick={handleClaimAdmin}
                    disabled={claimAdmin.isPending || !adminToken}
                    className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white border-0"
                    data-ocid="dashboard.primary_button"
                  >
                    {claimAdmin.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 mr-2" />
                    )}
                    Claim Admin Access
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Find your admin token in the Caffeine platform under your
                    app settings.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={clear}
                  className="border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </div>
        )}

        {/* Admin: Leads Table */}
        {isLoggedIn && isAdmin && (
          <div>
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
                              {lead.message ?? "—"}
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
