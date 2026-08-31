import CountdownWidget from "../components/CountdownWidget";

export default function CountdownPage({ examDate }) {
  return (
    <div className="countdown-page">
      <CountdownWidget examDate={examDate} full />
    </div>
  );
}