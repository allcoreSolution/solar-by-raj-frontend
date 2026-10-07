export default function Logo({ uid = "a" }) {
  const rays = [-75, -50, -25, 0, 25, 50, 75];
  return (
    <svg className="logo-svg" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0a1a44" /><stop offset="1" stopColor="#1547b8" /></linearGradient>
        <linearGradient id={`sun-${uid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe27a" /><stop offset="1" stopColor="#ff9f0a" /></linearGradient>
        <linearGradient id={`pn-${uid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6cb0ff" /><stop offset="1" stopColor="#1d4ed8" /></linearGradient>
      </defs>
      <rect width="200" height="200" rx="46" fill={`url(#bg-${uid})`} />
      {rays.map((a) => (
        <g key={a} transform={`rotate(${a} 100 114)`}><path d="M95.5 68L100 42L104.5 68Z" fill="#ffc93c" /></g>
      ))}
      <circle cx="100" cy="114" r="34" fill={`url(#sun-${uid})`} />
      <path d="M30 172L60 114H140L170 172Z" fill={`url(#pn-${uid})`} stroke={`url(#pn-${uid})`} strokeWidth="8" strokeLinejoin="round" />
      <path d="M46 143H154M53 128.5H147M81 114L69 172M100 114V172M119 114L131 172" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" opacity=".9" fill="none" />
    </svg>
  );
}