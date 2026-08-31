import { useEffect, useState } from "react";
import { getCountdown, pad } from "../utils/countdown";

export default function CountdownWidget({ examDate, full=false }) {
  const [time, setTime] = useState(() => getCountdown(examDate));

  useEffect(() => {
    const id = setInterval(() => setTime(getCountdown(examDate)), 1000);
    return () => clearInterval(id);
  }, [examDate]);

  if (full) return (
    <div className="countdown-full">
      <div className="eyebrow">THE FINISH LINE</div>
      <div className="days-big">{time.days}</div>
      <div className="days-label">DAYS TO CAT</div>
      <div className="clock-big">{pad(time.hours)} : {pad(time.minutes)} : {pad(time.seconds)}</div>
      <p className="muted">Every day between now and CAT is one less day you'll ever have to prepare.</p>
    </div>
  );

  return (
    <div>
      <div className="eyebrow">UNTIL CAT 2026</div>
      <div className="days-big compact">{time.days}<span>DAYS</span></div>
      <div className="clock">{pad(time.hours)} : {pad(time.minutes)} : {pad(time.seconds)}</div>
    </div>
  );
}