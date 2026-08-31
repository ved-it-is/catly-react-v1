import { Home, BarChart3, Timer, Heart, Target, ClipboardCheck, Bell, X } from "lucide-react";

const items = [
  ["dashboard","Home",Home], ["analytics","Analytics",BarChart3],
  ["countdown","Countdown",Timer], ["motivation","Motivation",Heart],
  ["target","My Target",Target], ["mock","CAT Watch",ClipboardCheck],
  ["reminders","Reminders",Bell]
];

export default function Sidebar({ page, setPage, mobileOpen, closeMobile }) {
  return (
    <>
      {mobileOpen && <div className="mobile-overlay" onClick={closeMobile} />}
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand-row">
          <div className="brand">CAT<span>LY</span></div>
          <button className="icon-btn mobile-close" onClick={closeMobile}><X size={18}/></button>
        </div>
        <div className="brand-sub">CAT 2026 command centre</div>
        <nav>
          {items.map(([id,label,Icon]) => (
            <button key={id} className={`nav-item ${page===id ? "active":""}`}
              onClick={()=>{setPage(id); closeMobile();}}>
              <Icon size={18}/><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">Built for the CAT journey.<br/>V1 frontend</div>
      </aside>
    </>
  );
}