import './App.css'

const stats = [
  { label: 'Total apps', value: '42', change: '+8%', tone: 'cyan' },
  { label: 'Waiting', value: '12', change: '+3', tone: 'amber' },
  { label: 'Interviews', value: '7', change: '+2', tone: 'green' },
  { label: 'Offers', value: '3', change: '+1', tone: 'violet' },
]

const pipeline = [
  { name: 'Applied', count: 18, color: 'cyan' },
  { name: 'Screening', count: 12, color: 'amber' },
  { name: 'Interview', count: 7, color: 'green' },
  { name: 'Offer', count: 3, color: 'violet' },
  { name: 'Rejected', count: 2, color: 'rose' },
]

const applications = [
  { company: 'Northstar Labs', role: 'Frontend Engineer', location: 'Remote', status: 'Waiting', salary: '$120k–$150k' },
  { company: 'Signal Forge', role: 'Product Designer', location: 'Boston, MA', status: 'Interview', salary: '$110k–$130k' },
  { company: 'Harbor One', role: 'Full Stack Engineer', location: 'Hybrid', status: 'Applied', salary: '$135k–$160k' },
  { company: 'Summit AI', role: 'Senior UX Engineer', location: 'New York, NY', status: 'Offer', salary: '$145k–$175k' },
]

const activity = [42, 68, 51, 76, 86, 74, 92]

function App() {
  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">CT</div>
          <div>
            <p className="eyebrow">CareerTrack</p>
            <h2>Dashboard</h2>
          </div>
        </div>

        <nav className="nav">
          <button className="nav-item active">Overview</button>
          <button className="nav-item">Pipeline</button>
          <button className="nav-item">Applications</button>
          <button className="nav-item">Calendar</button>
          <button className="nav-item">Reports</button>
        </nav>

        <div className="mini-card">
          <span className="mini-label">This week</span>
          <strong>5 follow-ups</strong>
          <small>2 interviews scheduled</small>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Overview</p>
            <h1>Job search dashboard</h1>
          </div>

          <div className="top-actions">
            <button className="secondary-btn">Export</button>
            <button className="primary-btn">+ Add role</button>
          </div>
        </header>

        <section className="stats-grid">
          {stats.map((stat) => (
            <article key={stat.label} className={`stat-card ${stat.tone}`}>
              <div className="stat-header">
                <span>{stat.label}</span>
                <span className="change">{stat.change}</span>
              </div>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <div className="panel large-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Pipeline</p>
                <h3>Application stages</h3>
              </div>
              <button className="ghost-btn">View all</button>
            </div>

            <div className="pipeline-list">
              {pipeline.map((stage) => (
                <div key={stage.name} className="pipeline-row">
                  <div className="stage-meta">
                    <span className={`dot ${stage.color}`}></span>
                    <span>{stage.name}</span>
                  </div>
                  <div className="stage-bar">
                    <span style={{ width: `${(stage.count / 18) * 100}%` }} />
                  </div>
                  <strong>{stage.count}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Momentum</p>
                <h3>Weekly activity</h3>
              </div>
            </div>

            <div className="chart-bars" aria-label="Weekly activity chart">
              {activity.map((value, index) => (
                <div key={index} className="bar-wrap">
                  <span className="bar" style={{ height: `${value}%` }} />
                  <small>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="panel table-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Applications</p>
              <h3>Recent roles</h3>
            </div>
            <button className="ghost-btn">Filter</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Location</th>
                <th>Status</th>
                <th>Salary</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((item) => (
                <tr key={`${item.company}-${item.role}`}>
                  <td>{item.company}</td>
                  <td>{item.role}</td>
                  <td>{item.location}</td>
                  <td>
                    <span className={`status ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.salary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  )
}

export default App
