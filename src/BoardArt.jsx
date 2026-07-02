// Arte SVG del tablero y del escenario: trazo redondo y colores planos estilo Wonderblocks.
const ink = "rgba(32, 50, 58, 0.55)";
const inkStrong = "#2a3d43";

const strokeProps = {
  stroke: ink,
  strokeWidth: 3,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function PuddleArt() {
  return (
    <svg aria-hidden="true" className="tile-art tile-art-fill puddle" viewBox="0 0 64 64">
      <ellipse cx="32" cy="36" rx="26" ry="17" fill="#6cc8ef" {...strokeProps} />
      <ellipse className="ripple r1" cx="32" cy="36" rx="17" ry="10" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" />
      <ellipse className="ripple r2" cx="32" cy="36" rx="9" ry="5" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" />
      <ellipse cx="22" cy="30" rx="5" ry="2.6" fill="rgba(255,255,255,0.8)" />
    </svg>
  );
}

export function HedgeArt() {
  return (
    <svg aria-hidden="true" className="tile-art tile-art-fill" viewBox="0 0 64 64">
      <circle cx="18" cy="40" r="15" fill="#3e9440" {...strokeProps} />
      <circle cx="46" cy="41" r="14" fill="#3e9440" {...strokeProps} />
      <circle cx="32" cy="28" r="16" fill="#4caf50" {...strokeProps} />
      <circle cx="26" cy="24" r="4.5" fill="rgba(255,255,255,0.35)" stroke="none" />
      <circle cx="41" cy="34" r="3" fill="#ff5b6a" {...strokeProps} strokeWidth="2" />
      <circle cx="16" cy="35" r="3" fill="#ff5b6a" {...strokeProps} strokeWidth="2" />
      <circle cx="33" cy="45" r="3" fill="#ffd24a" {...strokeProps} strokeWidth="2" />
    </svg>
  );
}

export function TargetArt() {
  return (
    <svg aria-hidden="true" className="tile-art tile-art-fill target-pad" viewBox="0 0 64 64">
      <ellipse cx="32" cy="46" rx="24" ry="11" fill="#ffd85e" {...strokeProps} />
      <ellipse cx="32" cy="43" rx="17" ry="7" fill="#fff1b8" stroke="none" />
      <line x1="44" y1="12" x2="44" y2="42" stroke={inkStrong} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M44 12 L26 17 L44 23 Z" fill="#ff5b4d" {...strokeProps} strokeWidth="2.5" />
    </svg>
  );
}

export function SignalArt() {
  return (
    <svg aria-hidden="true" className="tile-art tile-art-fill" viewBox="0 0 64 64">
      <circle className="signal-glow" cx="32" cy="34" r="15" fill="#8fdd62" {...strokeProps} />
      <circle cx="32" cy="34" r="7" fill="#d4ff9c" stroke="none" />
      <path d="M27 34 L31 38 L38 29" fill="none" stroke="#2c6e1f" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ClockArt({ done = false }) {
  return (
    <svg aria-hidden="true" className="tile-art" viewBox="0 0 64 64">
      <circle cx="32" cy="34" r="19" fill={done ? "#c9f2ff" : "#fff6d8"} {...strokeProps} strokeWidth="3.5" />
      <circle cx="32" cy="34" r="14" fill="#fff" stroke="rgba(32,50,58,0.18)" strokeWidth="2" />
      <line x1="32" y1="34" x2="32" y2="25" stroke={inkStrong} strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="34" x2={done ? 39 : 25} y2={done ? 37 : 37} stroke={inkStrong} strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="34" r="2.4" fill={inkStrong} />
      <circle cx="32" cy="13" r="4" fill="#8bd7f3" {...strokeProps} strokeWidth="2.5" />
      {done ? <path d="M43 15 L47 19 L54 11" fill="none" stroke="#28a659" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /> : null}
    </svg>
  );
}

export function PaintOutlineArt() {
  return (
    <svg aria-hidden="true" className="tile-art tile-art-fill" viewBox="0 0 64 64">
      <path
        d="M32 12 C44 12 52 20 52 31 C52 43 43 52 32 52 C20 52 12 43 12 31 C12 20 21 12 32 12 Z"
        fill="rgba(255,255,255,0.25)"
        stroke="rgba(29,90,168,0.6)"
        strokeWidth="3"
        strokeDasharray="7 6"
        strokeLinecap="round"
      />
      <path d="M27 30 C29 26 35 26 37 30" fill="none" stroke="rgba(29,90,168,0.45)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function SplatArt() {
  return (
    <svg aria-hidden="true" className="tile-art tile-art-fill" viewBox="0 0 64 64">
      <path
        d="M32 10 C40 10 42 17 48 18 C55 19 56 28 51 32 C56 37 53 46 46 46 C44 53 34 56 30 50 C22 55 13 50 15 43 C8 40 8 30 15 28 C13 20 20 13 26 16 C28 12 30 10 32 10 Z"
        fill="#5aa9ff"
        {...strokeProps}
      />
      <circle cx="26" cy="28" r="4" fill="rgba(255,255,255,0.55)" stroke="none" />
      <circle cx="40" cy="38" r="3" fill="rgba(255,255,255,0.4)" stroke="none" />
      <circle cx="52" cy="52" r="3.5" fill="#5aa9ff" {...strokeProps} strokeWidth="2" />
      <circle cx="12" cy="52" r="2.6" fill="#5aa9ff" {...strokeProps} strokeWidth="2" />
    </svg>
  );
}

export function CowArt({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 64 64">
      <path d="M15 14 C10 8 16 3 21 9" fill="#f3d9a4" {...strokeProps} strokeWidth="2.5" />
      <path d="M49 14 C54 8 48 3 43 9" fill="#f3d9a4" {...strokeProps} strokeWidth="2.5" />
      <ellipse cx="9" cy="23" rx="7" ry="4.5" fill="#fff6e6" {...strokeProps} strokeWidth="2.5" transform="rotate(-22 9 23)" />
      <ellipse cx="55" cy="23" rx="7" ry="4.5" fill="#fff6e6" {...strokeProps} strokeWidth="2.5" transform="rotate(22 55 23)" />
      <rect x="12" y="10" width="40" height="43" rx="16" fill="#fff9ef" {...strokeProps} />
      <path d="M15 19 C20 12 29 16 26 24 C21 29 14 27 15 19 Z" fill="#3a3f45" stroke="none" />
      <path d="M45 14 C51 13 53 20 47 22 C43 22 42 16 45 14 Z" fill="#3a3f45" stroke="none" />
      <circle cx="25" cy="30" r="2.8" fill={inkStrong} />
      <circle cx="39" cy="30" r="2.8" fill={inkStrong} />
      <circle cx="26" cy="29" r="1" fill="#fff" />
      <circle cx="40" cy="29" r="1" fill="#fff" />
      <rect x="19" y="38" width="26" height="14" rx="7" fill="#ffc2cf" {...strokeProps} strokeWidth="2.5" />
      <ellipse cx="27" cy="45" rx="2.2" ry="2.8" fill="#c76a80" />
      <ellipse cx="37" cy="45" rx="2.2" ry="2.8" fill="#c76a80" />
    </svg>
  );
}

export function ChickArt({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 64 64">
      <path d="M24 13 C21 4 29 3 30 9 C31 2 39 4 37 11 C43 7 46 13 40 16 Z" fill="#ff5b4d" {...strokeProps} strokeWidth="2.5" />
      <path d="M49 29 C60 22 63 34 53 38 Z" fill="#fffdf6" {...strokeProps} strokeWidth="2.5" />
      <path d="M18 26 C18 15 35 11 43 20 C51 28 51 42 41 48 C32 53 18 50 16 40 C15 35 16 30 18 26 Z" fill="#fffdf6" {...strokeProps} />
      <path d="M34 33 C43 31 45 40 37 43 C31 44 29 37 34 33 Z" fill="#f1e6cf" stroke={ink} strokeWidth="2" />
      <circle cx="26" cy="26" r="2.8" fill={inkStrong} />
      <circle cx="27" cy="25" r="1" fill="#fff" />
      <path d="M15 27 L6 31 L15 35 Z" fill="#ff9d2e" {...strokeProps} strokeWidth="2" />
      <path d="M16 36 C14 41 19 43 20 38 Z" fill="#ff5b4d" stroke="none" />
      <path d="M28 51 V57 M36 50 V57" stroke="#ff9d2e" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M24 57 H32 M32 57 H40" stroke="#ff9d2e" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function BrushArt({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 64 64">
      <rect x="26" y="5" width="12" height="19" rx="5" fill="#b06f3d" {...strokeProps} strokeWidth="2.5" />
      <rect x="22" y="22" width="20" height="8" rx="3" fill="#98a2a8" {...strokeProps} strokeWidth="2.5" />
      <path d="M20 30 H44 C44 41 40 47 32 47 C24 47 20 41 20 30 Z" fill="#5aa9ff" {...strokeProps} strokeWidth="2.5" />
      <circle cx="32" cy="54" r="4.5" fill="#5aa9ff" {...strokeProps} strokeWidth="2" />
      <circle cx="27" cy="35" r="2.5" fill="rgba(255,255,255,0.6)" stroke="none" />
    </svg>
  );
}

export function LoopArt({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 64 64">
      <path d="M46 19 A19 19 0 1 0 52 33" fill="none" stroke="#a36400" strokeWidth="8" strokeLinecap="round" />
      <path d="M42 6 L49 22 L32 23 Z" fill="#a36400" stroke="none" />
      <circle cx="26" cy="26" r="2" fill="#fff" opacity="0.65" />
    </svg>
  );
}

export function getCommandArt(commandId, className = "command-art") {
  if (commandId === "moo") return <CowArt className={className} />;
  if (commandId === "cluck") return <ChickArt className={className} />;
  if (commandId === "paint") return <BrushArt className={className} />;
  if (commandId === "again2" || commandId === "again3") return <LoopArt className={className} />;
  return null;
}

export function SoundGoalArt({ command, done = false }) {
  return (
    <span aria-hidden="true" className={`sound-goal-art ${done ? "done" : ""}`}>
      {command === "moo" ? <CowArt className="animal" /> : <ChickArt className="animal" />}
      <svg className="sound-note" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="14" fill={done ? "#8de57b" : "#fff"} {...strokeProps} strokeWidth="2.5" />
        <path d="M13 21 L13 11 L21 9.5 L21 19" fill="none" stroke={inkStrong} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="11.6" cy="21" r="2.6" fill={inkStrong} />
        <circle cx="19.6" cy="19" r="2.6" fill={inkStrong} />
      </svg>
    </span>
  );
}

const collectibleArt = {
  estrella: (
    <svg viewBox="0 0 64 64">
      <path d="M32 6 L39 24 L59 25 L43 37 L49 57 L32 45 L15 57 L21 37 L5 25 L25 24 Z" fill="#ffd24a" {...strokeProps} />
      <circle cx="26" cy="26" r="4" fill="rgba(255,255,255,0.6)" stroke="none" />
    </svg>
  ),
  gema: (
    <svg viewBox="0 0 64 64">
      <path d="M20 12 H44 L56 27 L32 56 L8 27 Z" fill="#5fd6e0" {...strokeProps} />
      <path d="M20 12 L32 27 L44 12 M8 27 H56 M32 27 V56" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  ),
  sol: (
    <svg viewBox="0 0 64 64">
      <g stroke="#f2a51e" strokeWidth="4" strokeLinecap="round">
        <line x1="32" y1="2" x2="32" y2="10" /><line x1="32" y1="54" x2="32" y2="62" />
        <line x1="2" y1="32" x2="10" y2="32" /><line x1="54" y1="32" x2="62" y2="32" />
        <line x1="11" y1="11" x2="17" y2="17" /><line x1="47" y1="47" x2="53" y2="53" />
        <line x1="11" y1="53" x2="17" y2="47" /><line x1="47" y1="17" x2="53" y2="11" />
      </g>
      <circle cx="32" cy="32" r="17" fill="#ffd24a" {...strokeProps} />
      <circle cx="26" cy="29" r="2.4" fill={inkStrong} />
      <circle cx="38" cy="29" r="2.4" fill={inkStrong} />
      <path d="M26 37 C29 41 35 41 38 37" fill="none" stroke={inkStrong} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  ),
  libro: (
    <svg viewBox="0 0 64 64">
      <path d="M32 14 C24 8 12 8 8 12 V48 C12 44 24 44 32 50 C40 44 52 44 56 48 V12 C52 8 40 8 32 14 Z" fill="#fff6d8" {...strokeProps} />
      <line x1="32" y1="14" x2="32" y2="50" stroke={ink} strokeWidth="3" />
      <g stroke="#8bd7f3" strokeWidth="2.5" strokeLinecap="round">
        <line x1="14" y1="20" x2="26" y2="22" /><line x1="14" y1="27" x2="26" y2="29" /><line x1="14" y1="34" x2="26" y2="36" />
        <line x1="38" y1="22" x2="50" y2="20" /><line x1="38" y1="29" x2="50" y2="27" /><line x1="38" y1="36" x2="50" y2="34" />
      </g>
    </svg>
  ),
  cuchara: (
    <svg viewBox="0 0 64 64">
      <ellipse cx="24" cy="20" rx="13" ry="15" fill="#ffd85e" {...strokeProps} />
      <ellipse cx="24" cy="19" rx="7" ry="9" fill="#fff1b8" stroke="none" />
      <path d="M31 31 L48 54" stroke="#e0a32e" strokeWidth="7" strokeLinecap="round" />
      <path d="M31 31 L48 54" stroke={ink} strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.25" />
    </svg>
  ),
  bota: (
    <svg viewBox="0 0 64 64">
      <path d="M22 8 H40 V34 C48 34 54 40 54 47 V52 H14 V8 Z" fill="#ffd24a" {...strokeProps} transform="translate(-3 0)" />
      <rect x="11" y="6" width="32" height="9" rx="4" fill="#ff8ac1" {...strokeProps} strokeWidth="2.5" />
      <path d="M14 44 H51" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  mapa: (
    <svg viewBox="0 0 64 64">
      <path d="M10 14 L26 9 L38 14 L54 9 V48 L38 53 L26 48 L10 53 Z" fill="#fff6d8" {...strokeProps} />
      <path d="M26 9 V48 M38 14 V53" stroke="rgba(32,50,58,0.25)" strokeWidth="2.5" />
      <path d="M15 40 C22 32 30 40 37 30 C41 25 45 25 48 21" fill="none" stroke="#ff5b4d" strokeWidth="3" strokeDasharray="5 4" strokeLinecap="round" />
      <path d="M46 18 L52 24 M52 18 L46 24" stroke="#ff5b4d" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  ),
  flor: (
    <svg viewBox="0 0 64 64">
      <g fill="#ff8ac1" {...strokeProps} strokeWidth="2.5">
        <circle cx="32" cy="16" r="9" /><circle cx="47" cy="27" r="9" /><circle cx="42" cy="45" r="9" />
        <circle cx="22" cy="45" r="9" /><circle cx="17" cy="27" r="9" />
      </g>
      <circle cx="32" cy="32" r="9" fill="#ffd24a" {...strokeProps} strokeWidth="2.5" />
    </svg>
  ),
  tambor: (
    <svg viewBox="0 0 64 64">
      <path d="M12 26 V46 C12 52 21 56 32 56 C43 56 52 52 52 46 V26" fill="#ff5b4d" {...strokeProps} />
      <ellipse cx="32" cy="26" rx="20" ry="9" fill="#fff6d8" {...strokeProps} />
      <path d="M18 33 L24 43 M46 33 L40 43" stroke="#ffd24a" strokeWidth="4" strokeLinecap="round" />
      <line x1="10" y1="12" x2="26" y2="24" stroke={inkStrong} strokeWidth="3" strokeLinecap="round" />
      <line x1="54" y1="12" x2="38" y2="24" stroke={inkStrong} strokeWidth="3" strokeLinecap="round" />
      <circle cx="9" cy="11" r="4" fill="#ffd24a" {...strokeProps} strokeWidth="2" />
      <circle cx="55" cy="11" r="4" fill="#ffd24a" {...strokeProps} strokeWidth="2" />
    </svg>
  ),
  eco: (
    <svg viewBox="0 0 64 64">
      <path d="M24 44 L24 16 L48 11 L48 39" fill="none" stroke={inkStrong} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="19.5" cy="44" rx="6.5" ry="5.5" fill="#8f7cf6" {...strokeProps} strokeWidth="2.5" />
      <ellipse cx="43.5" cy="39" rx="6.5" ry="5.5" fill="#8f7cf6" {...strokeProps} strokeWidth="2.5" />
      <path d="M54 18 C58 22 58 28 54 32 M57 12 C64 19 64 31 57 38" fill="none" stroke="rgba(32,50,58,0.4)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  gota: (
    <svg viewBox="0 0 64 64">
      <path d="M32 6 C42 20 50 29 50 39 C50 49 42 56 32 56 C22 56 14 49 14 39 C14 29 22 20 32 6 Z" fill="#6cc8ef" {...strokeProps} />
      <path d="M23 38 C23 44 27 48 32 49" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="27" cy="31" r="2.4" fill={inkStrong} /><circle cx="37" cy="31" r="2.4" fill={inkStrong} />
      <path d="M28 39 C30 41 34 41 36 39" fill="none" stroke={inkStrong} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  ),
  candado: (
    <svg viewBox="0 0 64 64">
      <path d="M20 28 V20 C20 12 25 7 32 7 C39 7 44 12 44 20 V28" fill="none" stroke="#98a2a8" strokeWidth="6" strokeLinecap="round" />
      <rect x="13" y="26" width="38" height="30" rx="8" fill="#ffd24a" {...strokeProps} />
      <circle cx="32" cy="39" r="5" fill={inkStrong} />
      <rect x="29.5" y="41" width="5" height="9" rx="2.4" fill={inkStrong} />
    </svg>
  ),
  llave: (
    <svg viewBox="0 0 64 64">
      <circle cx="20" cy="22" r="13" fill="none" stroke="#ffd24a" strokeWidth="7" />
      <circle cx="20" cy="22" r="13" fill="none" stroke={ink} strokeWidth="2.5" opacity="0.4" />
      <path d="M29 31 L50 52 M43 45 L50 38 M37 39 L43 33" stroke="#ffd24a" strokeWidth="7" strokeLinecap="round" fill="none" />
    </svg>
  ),
  brujula: (
    <svg viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="24" fill="#e8f6ff" {...strokeProps} strokeWidth="3.5" />
      <circle cx="32" cy="32" r="18" fill="#fff" stroke="rgba(32,50,58,0.18)" strokeWidth="2" />
      <path d="M32 17 L38 32 L32 47 L26 32 Z" fill="#ff5b4d" {...strokeProps} strokeWidth="2" />
      <path d="M32 17 L38 32 L26 32 Z" fill="#fff" stroke="none" opacity="0.35" />
      <circle cx="32" cy="32" r="3" fill={inkStrong} />
    </svg>
  ),
  puente: (
    <svg viewBox="0 0 64 64">
      <path d="M6 48 C14 30 50 30 58 48" fill="none" stroke="#b06f3d" strokeWidth="7" strokeLinecap="round" />
      <g stroke="#8a5227" strokeWidth="4" strokeLinecap="round">
        <line x1="14" y1="42" x2="14" y2="52" /><line x1="26" y1="37" x2="26" y2="52" />
        <line x1="38" y1="37" x2="38" y2="52" /><line x1="50" y1="42" x2="50" y2="52" />
      </g>
      <line x1="6" y1="52" x2="58" y2="52" stroke={inkStrong} strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  ),
  telon: (
    <svg viewBox="0 0 64 64">
      <rect x="8" y="8" width="48" height="8" rx="4" fill="#ffd24a" {...strokeProps} strokeWidth="2.5" />
      <path d="M12 16 C12 34 16 46 12 54 C22 50 26 38 26 26 L26 16 Z" fill="#e04a55" {...strokeProps} />
      <path d="M52 16 C52 34 48 46 52 54 C42 50 38 38 38 26 L38 16 Z" fill="#e04a55" {...strokeProps} />
      <path d="M26 16 C28 26 36 26 38 16 Z" fill="#c73844" stroke="none" />
      <circle cx="32" cy="38" r="5" fill="#ffd24a" {...strokeProps} strokeWidth="2.5" />
    </svg>
  ),
};

export function CollectibleArt({ label = "" }) {
  const key = Object.keys(collectibleArt).find((name) => label.toLowerCase().includes(name));
  return (
    <span aria-label={label} className="collectible-art">
      {collectibleArt[key] || collectibleArt.estrella}
    </span>
  );
}

export function GrassTuft() {
  return (
    <svg aria-hidden="true" className="grass-tuft" viewBox="0 0 32 32">
      <path
        d="M10 26 C9 20 7 17 5 15 M16 26 C16 18 16 14 15 10 M22 26 C23 20 25 17 27 15"
        fill="none"
        stroke="rgba(46, 104, 24, 0.5)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SunFace({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 100 100">
      <g className="sun-rays" stroke="#ffcf3f" strokeWidth="6" strokeLinecap="round">
        <line x1="50" y1="2" x2="50" y2="14" /><line x1="50" y1="86" x2="50" y2="98" />
        <line x1="2" y1="50" x2="14" y2="50" /><line x1="86" y1="50" x2="98" y2="50" />
        <line x1="16" y1="16" x2="24" y2="24" /><line x1="76" y1="76" x2="84" y2="84" />
        <line x1="16" y1="84" x2="24" y2="76" /><line x1="76" y1="24" x2="84" y2="16" />
      </g>
      <circle cx="50" cy="50" r="27" fill="#ffdd55" {...strokeProps} strokeWidth="3.5" />
      <circle cx="42" cy="46" r="3" fill={inkStrong} />
      <circle cx="58" cy="46" r="3" fill={inkStrong} />
      <path d="M41 56 C45 61 55 61 59 56" fill="none" stroke={inkStrong} strokeWidth="3" strokeLinecap="round" />
      <circle cx="36" cy="53" r="3.4" fill="rgba(255,120,140,0.5)" />
      <circle cx="64" cy="53" r="3.4" fill="rgba(255,120,140,0.5)" />
    </svg>
  );
}

export function CloudArt({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 120 60">
      <path
        d="M25 48 C10 48 8 32 20 28 C20 16 36 12 43 20 C48 8 68 8 72 20 C86 14 98 24 92 34 C104 34 104 48 92 48 Z"
        fill="#fff"
        stroke="rgba(122, 168, 199, 0.5)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TreeArt({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 100 120">
      <rect x="44" y="78" width="12" height="34" rx="5" fill="#a06a3c" {...strokeProps} />
      <circle cx="30" cy="58" r="22" fill="#3e9440" {...strokeProps} />
      <circle cx="70" cy="58" r="22" fill="#3e9440" {...strokeProps} />
      <circle cx="50" cy="36" r="26" fill="#4caf50" {...strokeProps} />
      <circle cx="40" cy="30" r="6" fill="rgba(255,255,255,0.35)" stroke="none" />
      <circle cx="62" cy="52" r="4" fill="#ff5b6a" {...strokeProps} strokeWidth="2" />
      <circle cx="26" cy="50" r="4" fill="#ffd24a" {...strokeProps} strokeWidth="2" />
    </svg>
  );
}

export function BushArt({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 100 60">
      <circle cx="24" cy="40" r="19" fill="#57b556" {...strokeProps} />
      <circle cx="60" cy="34" r="24" fill="#4caf50" {...strokeProps} />
      <circle cx="85" cy="44" r="14" fill="#57b556" {...strokeProps} />
      <circle cx="52" cy="26" r="5" fill="rgba(255,255,255,0.3)" stroke="none" />
      <circle cx="72" cy="40" r="3.5" fill="#ff8ac1" {...strokeProps} strokeWidth="2" />
    </svg>
  );
}

export function FlowerPatchArt({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 120 40">
      <g stroke="#2e6818" strokeWidth="3" strokeLinecap="round">
        <line x1="20" y1="38" x2="20" y2="24" /><line x1="60" y1="38" x2="60" y2="20" /><line x1="98" y1="38" x2="98" y2="26" />
      </g>
      <g fill="#ff8ac1" {...strokeProps} strokeWidth="2">
        <circle cx="14" cy="19" r="5" /><circle cx="26" cy="19" r="5" /><circle cx="20" cy="12" r="5" />
      </g>
      <circle cx="20" cy="18" r="4" fill="#ffd24a" {...strokeProps} strokeWidth="2" />
      <g fill="#8f7cf6" {...strokeProps} strokeWidth="2">
        <circle cx="54" cy="15" r="5" /><circle cx="66" cy="15" r="5" /><circle cx="60" cy="8" r="5" />
      </g>
      <circle cx="60" cy="14" r="4" fill="#fff" {...strokeProps} strokeWidth="2" />
      <g fill="#ffd24a" {...strokeProps} strokeWidth="2">
        <circle cx="92" cy="21" r="5" /><circle cx="104" cy="21" r="5" /><circle cx="98" cy="14" r="5" />
      </g>
      <circle cx="98" cy="20" r="4" fill="#ff5b4d" {...strokeProps} strokeWidth="2" />
    </svg>
  );
}

export function Scenery() {
  return (
    <div aria-hidden="true" className="scenery">
      <SunFace className="sc-sun" />
      <CloudArt className="sc-cloud a" />
      <CloudArt className="sc-cloud b" />
      <CloudArt className="sc-cloud c" />
      <TreeArt className="sc-tree a" />
      <TreeArt className="sc-tree b" />
      <BushArt className="sc-bush a" />
      <BushArt className="sc-bush b" />
      <FlowerPatchArt className="sc-flowers a" />
      <FlowerPatchArt className="sc-flowers b" />
    </div>
  );
}
