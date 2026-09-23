import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Trash2 } from "lucide-react";

type JobApplication = {
  id: string;
  company: string;
  position: string;
  location: string | null;
  jobUrl: string | null;
  salary: string | null;
  status: string;
  appliedAt: string | null;
  createdAt: string;
};

type FormValues = {
  company: string;
  position: string;
  location: string;
  jobUrl: string;
  salary: string;
  status: string;
  appliedAt: string;
};

const initialForm: FormValues = {
  company: "",
  position: "",
  location: "",
  jobUrl: "",
  salary: "",
  status: "APPLIED",
  appliedAt: "",
};

const dailyApplicationGoal = 20;
const applicationsPerPage = 5;
const apiBaseUrl = (() => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "";
    }
  }

  const configured = import.meta.env.VITE_API_URL;
  return configured ? configured.replace(/\/+$/, "") : "";
})();

const todayLabel = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
}).format(new Date());

const statusLanes = [
  { key: "APPLIED", label: "Applied", tone: "applied" },
  { key: "WAITING", label: "Waiting", tone: "waiting" },
  { key: "INTERVIEW", label: "Interview", tone: "interview" },
  { key: "OFFER", label: "Offer", tone: "offer" },
  { key: "REJECTED", label: "Rejected", tone: "rejected" },
] as const;

function App() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [applicationPage, setApplicationPage] = useState(1);
  const pipelineRef = useRef<HTMLElement>(null);

  const showStatusApplications = (status: string) => {
    setStatusFilter(status);
    setSearchTerm("");
    setApplicationPage(1);
    requestAnimationFrame(() => {
      pipelineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const today = new Date().toDateString();
  const dailyApplications = applications.filter((application) => {
    return new Date(application.createdAt).toDateString() === today;
  });

  const loadApplications = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/applications`);
      if (!response.ok) throw new Error("Unable to load applications");

      const payload = await response.json();
      setApplications(Array.isArray(payload) ? payload : []);
      setError("");
    } catch {
      setError("Could not load your applications.");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadApplications();
  }, []);

  const filteredApplications = applications.filter((application) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = [application.company, application.position, application.location]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(search));
    return matchesSearch && (statusFilter === "ALL" || application.status === statusFilter);
  });
  const totalApplicationPages = Math.max(1, Math.ceil(filteredApplications.length / applicationsPerPage));
  useEffect(() => {
    setApplicationPage((page) => Math.min(page, totalApplicationPages));
  }, [totalApplicationPages]);
  const paginatedApplications = filteredApplications.slice(
    (applicationPage - 1) * applicationsPerPage,
    applicationPage * applicationsPerPage,
  );
  const appliedCount = applications.filter((application) => application.status === "APPLIED").length;
  const waitingCount = applications.filter((application) => application.status === "WAITING").length;
  const rejectedCount = applications.filter((application) => application.status === "REJECTED").length;

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setApplicationPage(1);
  };

  const handleStatusFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value);
    setApplicationPage(1);
  };

  const handleDelete = async (application: JobApplication) => {
    if (!window.confirm(`Delete the application for ${application.position} at ${application.company}?`)) return;

    setError("");
    try {
      const response = await fetch(`${apiBaseUrl}/api/applications/${application.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Unable to delete application");

      setApplications((current) => current.filter((item) => item.id !== application.id));
      setSuccess("Application deleted.");
    } catch {
      setError("Could not delete this application. Please try again.");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) throw new Error("Unable to save application");

      setFormValues(initialForm);
      setSuccess("Application saved.");
      await loadApplications();
    } catch {
      setError("Could not save this application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="app-shell">
      <nav className="topbar" aria-label="Main navigation">
        <a className="brand" href="/">
          <img className="brand-logo" src="/logo.svg" alt="CareerTrack logo" />
          <span>CareerTrack</span>
        </a>
        <div className="topbar-actions">
          <span className="live-indicator"><i /> Workspace live</span>
          <button className="avatar" type="button" aria-label="Account menu">AT</button>
        </div>
      </nav>
      <div className="dashboard-layout">
        <aside className="side-rail">
          <p className="rail-label">Workspace</p>
          <a className="rail-link active" href="#overview"><span className="rail-icon">◈</span>Overview</a>
          <a className="rail-link" href="#new-application"><span className="rail-icon">＋</span>New application</a>
          <a className="rail-link" href="#pipeline"><span className="rail-icon">≡</span>Pipeline</a>
          <div className="rail-divider" />
          <p className="rail-label">Today</p>
          <div className="weekly-goal">
            <div className="goal-heading"><span>Daily applications</span><strong>{Math.min(dailyApplications.length, dailyApplicationGoal)} / {dailyApplicationGoal}</strong></div>
            <div className="goal-track"><span style={{ width: `${Math.min((dailyApplications.length / dailyApplicationGoal) * 100, 100)}%` }} /></div>
            <p>{dailyApplications.length >= dailyApplicationGoal ? "Goal reached. Keep going." : `${dailyApplicationGoal - dailyApplications.length} more to hit your goal.`}</p>
          </div>
        </aside>

        <div className="dashboard-content">
          <header className="app-header hero-banner" id="overview">
            <div>
              <p className="eyebrow">{todayLabel}</p>
              <h1>Make every application count.</h1>
              <p className="intro">Track progress, follow up with confidence, and keep your search moving forward.</p>
            </div>
            <section className="metrics hero-metrics" aria-label="Application overview">
              <article className="metric-card metric-primary"><span>Total applications</span><strong>{applications.length}</strong><small>All time</small></article>
              <article className="metric-card metric-applied"><span>Applied jobs</span><strong>{appliedCount}</strong><small>Recently submitted</small></article>
              <article className="metric-card metric-waiting"><span>Waiting for reply</span><strong>{waitingCount}</strong><small>Follow up soon</small></article>
              <article className="metric-card metric-rejected"><span>Rejected jobs</span><strong>{rejectedCount}</strong><small>Keep moving forward</small></article>
            </section>
          </header>

          <section className="status-board" aria-labelledby="status-board-heading">
            <div className="board-heading">
              <div>
                <p className="eyebrow">Status overview</p>
                <h2 id="status-board-heading">Your pipeline at a glance</h2>
              </div>
              <span className="board-caption">{applications.length} total roles</span>
            </div>
            <div className="lane-grid">
              {statusLanes.map((lane) => {
                const laneApplications = applications.filter((application) => application.status === lane.key);
                const visibleApplications = laneApplications.slice(0, 3);
                return (
                  <article className={`status-lane lane-${lane.tone}`} key={lane.key}>
                    <div className="lane-title"><span>{lane.label}</span><strong>{laneApplications.length}</strong></div>
                    {laneApplications.length === 0 ? (
                      <p className="lane-empty">No roles here yet</p>
                    ) : (
                      <>
                        <ul>
                        {visibleApplications.map((application) => (
                          <li key={application.id}><strong>{application.position}</strong><span>{application.company}</span></li>
                        ))}
                        </ul>
                        {laneApplications.length > 3 && (
                          <button className="lane-view-all" type="button" onClick={() => showStatusApplications(lane.key)}>
                            View all {laneApplications.length}
                          </button>
                        )}
                      </>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          <div className="workspace">
        <section className="form-panel" id="new-application" aria-labelledby="form-heading">
          <div className="section-heading">
            <p className="eyebrow">New entry</p>
            <h2 id="form-heading">Add an application</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field-grid">
              <label>
                Company <span>*</span>
                <input name="company" value={formValues.company} onChange={handleChange} required placeholder="e.g. Northstar Labs" />
              </label>
              <label>
                Position <span>*</span>
                <input name="position" value={formValues.position} onChange={handleChange} required placeholder="e.g. Software Engineer" />
              </label>
              <label>
                Location
                <input name="location" value={formValues.location} onChange={handleChange} placeholder="Remote or city" />
              </label>
              <label>
                Salary range
                <input name="salary" value={formValues.salary} onChange={handleChange} placeholder="$100k - $130k" />
              </label>
              <label>
                Status
                <select name="status" value={formValues.status} onChange={handleChange}>
                  <option value="APPLIED">Applied</option>
                  <option value="WAITING">Waiting</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="OFFER">Offer</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </label>
              <label>
                Date applied
                <input type="date" name="appliedAt" value={formValues.appliedAt} onChange={handleChange} />
              </label>
            </div>
            <label>
              Job link
              <input type="url" name="jobUrl" value={formValues.jobUrl} onChange={handleChange} placeholder="https://..." />
            </label>
            <button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save application"}
            </button>
            {error && <p className="form-message error" role="alert">{error}</p>}
            {success && <p className="form-message success" role="status">{success}</p>}
          </form>
        </section>

        <section className="list-panel" id="pipeline" ref={pipelineRef} aria-labelledby="list-heading">
          <div className="section-heading list-heading">
            <div>
              <p className="eyebrow">Your pipeline</p>
              <h2 id="list-heading">Application activity</h2>
            </div>
            <span className="list-count">
              {statusFilter === "ALL" ? `${filteredApplications.length} roles` : `${statusFilter.toLowerCase()} · ${filteredApplications.length}`}
            </span>
          </div>

          <div className="list-controls">
            <label className="search-field">
              <span className="sr-only">Search applications</span>
              <input value={searchTerm} onChange={handleSearchChange} placeholder="Search company or role" />
            </label>
            <label className="filter-field">
              <span className="sr-only">Filter by status</span>
              <select value={statusFilter} onChange={handleStatusFilterChange}>
                <option value="ALL">All statuses</option>
                <option value="APPLIED">Applied</option>
                <option value="WAITING">Waiting</option>
                <option value="INTERVIEW">Interview</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </label>
          </div>

          {loading ? <p className="empty-state">Loading applications...</p> : applications.length === 0 ? (
            <p className="empty-state">Your first application will appear here.</p>
          ) : filteredApplications.length === 0 ? (
            <p className="empty-state">No applications match this view.</p>
          ) : (
            <ul className="application-list">
              {paginatedApplications.map((application) => (
                <li key={application.id}>
                  <div>
                    <strong>{application.position}</strong>
                    <span>{application.company}{application.location ? ` / ${application.location}` : ""}</span>
                  </div>
                  <div className="application-meta">
                    <span className={`status status-${application.status.toLowerCase()}`}>{application.status}</span>
                    {application.jobUrl && <a className="view-role" href={application.jobUrl} target="_blank" rel="noreferrer">View role</a>}
                    <button className="delete-application" type="button" onClick={() => handleDelete(application)} aria-label={`Delete ${application.position} at ${application.company}`} title="Delete application">
                      <Trash2 size={15} strokeWidth={2} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {!loading && filteredApplications.length > applicationsPerPage && (
            <div className="pagination" aria-label="Application pages">
              <span>Page {applicationPage} of {totalApplicationPages}</span>
              <div className="pagination-actions">
                <button type="button" onClick={() => setApplicationPage((page) => page - 1)} disabled={applicationPage === 1}>Previous</button>
                <button type="button" onClick={() => setApplicationPage((page) => page + 1)} disabled={applicationPage === totalApplicationPages}>Next</button>
              </div>
            </div>
          )}
        </section>
          </div>
        </div>
      </div>
      <footer className="site-footer">
        <a className="footer-brand" href="/">
          <img className="brand-logo small" src="/logo.svg" alt="CareerTrack logo" />
          <span>CareerTrack</span>
        </a>
        <p>Keep your search organized. Keep moving forward.</p>
        <nav aria-label="Footer navigation">
          <a href="#overview">Overview</a>
          <a href="#new-application">Add application</a>
          <a href="#pipeline">Activity</a>
        </nav>
      </footer>
    </main>
  );
}

export default App;
