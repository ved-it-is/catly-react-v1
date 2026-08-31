import { useEffect, useState } from "react";

const messages = [
  ["You made it this far.","There will be bad mocks. There will be questions you cannot solve. None of that decides your CAT score.","Come back tomorrow. Do the work. Keep going."],
  ["One more day. One more push.","You don't need to know everything to do well in CAT.","You need to trust the work you have already put in."],
  ["Don't chase perfection.","Chase the next question, the next set, the next hour of honest work.","That's how the score gets built."]
];

export default function MotivationPage({goMock}) {
  const [index,setIndex]=useState(0);
  useEffect(()=>{const id=setInterval(()=>setIndex(i=>(i+1)%messages.length),9000);return()=>clearInterval(id)},[]);
  const m=messages[index];
  return <div className="motivation-page">
    <div className="eyebrow">A NOTE FOR TODAY</div>
    <h1>{m[0]}</h1><p>{m[1]}</p><p><b>{m[2]}</b></p>
  </div>
}
