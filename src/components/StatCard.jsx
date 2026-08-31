export default function StatCard({label,value,sub}) {
  return <div className="card stat-card"><div className="label">{label}</div><div className="metric">{value}</div>{sub && <div className="muted stat-sub">{sub}</div>}</div>;
}