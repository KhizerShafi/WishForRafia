import React, { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft, ArrowRight, Sparkles, Heart, Gift, Star, PartyPopper,
  Music2, VolumeX, Volume2, MoonStar, Flower2, WandSparkles
} from "lucide-react";
import "./styles.css";

const screens = [
  { eyebrow: "A little something for you", title: "Hey, Rafia!", subtitle: "Someone wonderful deserves a moment that feels just as special.", icon: "✦" },
  { eyebrow: "Today is all about you", title: "Happy Birthday", subtitle: "May your new chapter be full of soft mornings, loud laughter, and beautiful surprises.", icon: "🎂" },
  { eyebrow: "A few wishes, from the heart", title: "A year of beautiful things", subtitle: "May the things you quietly hope for find their way to you, one lovely little moment at a time.", icon: "💌" },
  { eyebrow: "A gentle reminder", title: "Never forget your sparkle", subtitle: "Your kindness matters. Your smile makes a difference. And the world is brighter with you in it.", icon: "✨" },
  { eyebrow: "Psst… there's one more thing", title: "Ready for a tiny surprise?", subtitle: "Tap the gift and let a little birthday magic find you.", icon: "🎁" },
  { eyebrow: "Made with love, just for you", title: "Keep shining, Rafia", subtitle: "May this year bring you peace in your heart, courage in your dreams, and a thousand reasons to smile.", icon: "💖" },
];

const wishCards = [
  { icon: "🌷", title: "Gentle days", text: "More peace, more ease, and more moments where everything feels right." },
  { icon: "🌟", title: "Big dreams", text: "The courage to chase what excites you and the joy of watching it happen." },
  { icon: "🥂", title: "Happy surprises", text: "Unexpected good news, spontaneous laughter, and memories worth keeping." },
];

function Confetti({ active }) {
  const pieces = Array.from({ length: 46 }, (_, i) => ({
    left: `${(i * 37 + 7) % 100}%`,
    delay: `${(i % 12) * 0.12}s`,
    duration: `${3.2 + (i % 7) * 0.33}s`,
    rotate: `${(i * 71) % 360}deg`,
    shape: i % 3 === 0 ? "round" : i % 3 === 1 ? "strip" : "diamond",
  }));
  if (!active) return null;
  return <div className="confetti-layer" aria-hidden="true">
    {pieces.map((p, i) => <span key={i} className={`confetti ${p.shape}`} style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, transform: `rotate(${p.rotate})` }} />)}
  </div>;
}


function RoamingMagic() {
  const bits = Array.from({ length: 34 }, (_, i) => ({
    left: `${(i * 29 + 5) % 100}%`,
    top: `${(i * 43 + 11) % 100}%`,
    dx: `${((i * 17) % 46) - 23}vw`,
    dy: `${((i * 23) % 54) - 27}vh`,
    delay: `${-((i * 7) % 50) / 10}s`,
    duration: `${2.8 + ((i * 13) % 28) / 10}s`,
    size: `${12 + ((i * 11) % 17)}px`,
  }));
  return <div className="roaming-magic" aria-hidden="true">
    {bits.map((bit, i) => <span key={i} style={{ left: bit.left, top: bit.top, '--dx': bit.dx, '--dy': bit.dy, animationDelay: bit.delay, animationDuration: bit.duration, fontSize: bit.size }}>{['✦', '✧', '♥', '✿', '★', '❋'][i % 6]}</span>)}
  </div>;
}

function App() {
  const [screen, setScreen] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const audioRef = useRef(null);
  const total = screens.length;

  const goTo = useCallback((next) => {
    if (transitioning || next < 0 || next >= total || next === screen) return;
    setTransitioning(true);
    window.setTimeout(() => {
      setScreen(next);
      setTransitioning(false);
      if (next === total - 1) {
        setConfetti(true);
        window.setTimeout(() => setConfetti(false), 5500);
      }
    }, 180);
  }, [screen, total, transitioning]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "ArrowRight" || event.key === "Enter") goTo(Math.min(total - 1, screen + 1));
      if (event.key === "ArrowLeft") goTo(Math.max(0, screen - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, screen, total]);

  const toggleSound = () => {
    // The page stays silent by default. This button toggles a gentle synthesized chime, with no audio file required.
    try {
      if (!audioRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        audioRef.current = new AudioContext();
      }
      const ctx = audioRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, now + i * 0.13);
        gain.gain.exponentialRampToValueAtTime(0.055, now + i * 0.13 + 0.035);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.13 + 0.55);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(now + i * 0.13); osc.stop(now + i * 0.13 + 0.6);
      });
      setSoundOn((v) => !v);
    } catch (e) {
      console.warn("Audio is not available in this browser.", e);
    }
  };

  const current = screens[screen];

  return (
    <main className={`app-shell ${transitioning ? "is-transitioning" : ""}`}>
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="ambient ambient-three" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <RoamingMagic />
      <Confetti active={confetti} />

      <header className="topbar">
        <a className="brand-mark" href="#start" onClick={(e) => { e.preventDefault(); goTo(0); }} aria-label="Back to start">
          <span className="brand-icon"><Heart size={14} fill="currentColor" /></span>
          <span>little moments<span className="brand-dot">.</span></span>
        </a>
        <div className="topbar-right">
          <span className="edition-label">A BIRTHDAY EXPERIENCE</span>
          <button className="sound-button" onClick={toggleSound} aria-label="Play a soft birthday chime" title="Play a soft chime">
            {soundOn ? <Volume2 size={17} /> : <Music2 size={17} />}
          </button>
        </div>
      </header>

      <section className="experience" aria-live="polite">
        <div className="progress-row">
          <span className="progress-label">YOUR LITTLE JOURNEY</span>
          <span className="progress-count"><b>{String(screen + 1).padStart(2, "0")}</b><span>/</span>{String(total).padStart(2, "0")}</span>
        </div>
        <div className="progress-track" role="progressbar" aria-valuenow={screen + 1} aria-valuemin={1} aria-valuemax={total}>
          <span style={{ width: `${((screen + 1) / total) * 100}%` }} />
        </div>

        <div className={`screen screen-${screen + 1}`} key={screen}>
          {screen === 0 && <div className="hero-art intro-art" aria-hidden="true">
            <div className="orbit orbit-a" /><div className="orbit orbit-b" />
            <div className="moon"><span>✦</span></div>
            <span className="float-spark spark-a">✧</span><span className="float-spark spark-b">✦</span><span className="float-spark spark-c">✧</span>
            <div className="tiny-heart heart-a">♥</div><div className="tiny-heart heart-b">♥</div>
          </div>}

          {screen === 1 && <div className="hero-art cake-art" aria-hidden="true">
            <div className="cake-glow" />
            <div className="cake-candle"><span /></div>
            <div className="cake-tier tier-top"><i /><i /><i /></div>
            <div className="cake-tier tier-bottom"><i /><i /><i /><i /></div>
            <div className="cake-plate" />
            <span className="cake-star cs1">✦</span><span className="cake-star cs2">✧</span><span className="cake-star cs3">✦</span>
          </div>}

          {screen === 2 && <div className="hero-art letter-art" aria-hidden="true">
            <div className="letter-glow" />
            <div className="letter-card"><div className="letter-stamp">✿</div><div className="letter-lines"><span /><span /><span /><span /></div><div className="letter-heart">♡</div></div>
            <span className="letter-flower lf1">✿</span><span className="letter-flower lf2">✽</span><span className="letter-star">✧</span>
          </div>}

          {screen === 3 && <div className="hero-art sparkle-art" aria-hidden="true">
            <div className="sparkle-halo" />
            <div className="sparkle-center"><Star size={46} strokeWidth={1.1} fill="currentColor" /></div>
            <span className="shine sh1">✦</span><span className="shine sh2">✧</span><span className="shine sh3">✦</span><span className="shine sh4">✧</span>
            <div className="sparkle-ring ring-one" /><div className="sparkle-ring ring-two" />
          </div>}

          {screen === 4 && <div className={`hero-art gift-art ${revealed ? "gift-open" : ""}`} aria-hidden="true">
            <div className="gift-shadow" />
            <div className="gift-box"><div className="gift-lid"><span className="ribbon-bow bow-left" /><span className="ribbon-bow bow-right" /></div><div className="gift-ribbon ribbon-vertical" /><div className="gift-ribbon ribbon-horizontal" /></div>
            {revealed && <div className="gift-burst"><span>♡</span><span>✦</span><span>✧</span><span>♥</span><span>✦</span></div>}
          </div>}

          {screen === 5 && <div className="hero-art finale-art" aria-hidden="true">
            <div className="finale-glow" /><div className="finale-orbit" /><div className="finale-heart"><Heart size={60} strokeWidth={1.1} fill="currentColor" /></div>
            <span className="finale-star fs1">✦</span><span className="finale-star fs2">✧</span><span className="finale-star fs3">✦</span><span className="finale-star fs4">✧</span>
          </div>}

          <div className="screen-copy">
            <p className="eyebrow"><span className="eyebrow-line" />{current.eyebrow}<span className="eyebrow-line" /></p>
            <h1>{screen === 0 ? <>Hey, <em>Rafia!</em></> : screen === 1 ? <>Happy <em>Birthday</em></> : screen === 5 ? <>Keep shining, <em>Rafia</em></> : current.title}</h1>
            <p className="screen-subtitle">{current.subtitle}</p>
          </div>

          {screen === 2 && <div className="wish-cards">
            {wishCards.map((wish, i) => <article className="wish-card" key={wish.title} style={{ animationDelay: `${i * 100}ms` }}>
              <span className="wish-icon">{wish.icon}</span><div><h3>{wish.title}</h3><p>{wish.text}</p></div>
            </article>)}
          </div>}

          {screen === 3 && <div className="affirmation-pills"><span><Heart size={13} /> You are loved</span><span><Sparkles size={13} /> You are enough</span><span><Flower2 size={13} /> You are growing</span></div>}

          {screen === 4 && <div className="surprise-area">
            {!revealed ? <button className="reveal-button" onClick={() => { setRevealed(true); setConfetti(true); window.setTimeout(() => setConfetti(false), 4000); }}>
              <Gift size={17} /> Open your surprise <span className="button-arrow">↗</span>
            </button> : <div className="revealed-note">
              <span className="revealed-emoji">💗</span>
              <p><strong>Your birthday wish:</strong> May life be extra kind to you this year. May you feel proud of how far you've come, excited about where you're going, and loved in all the little moments in between.</p>
            </div>}
          </div>}

          {screen === 5 && <div className="final-signoff"><span className="signoff-rule" /><span>With lots of love & birthday magic</span><span className="signoff-rule" /></div>}
        </div>

        <nav className="screen-navigation" aria-label="Birthday screens">
          <button className="back-button" onClick={() => goTo(screen - 1)} disabled={screen === 0}>
            <ArrowLeft size={16} /><span>Back</span>
          </button>
          <div className="step-dots" aria-label={`Screen ${screen + 1} of ${total}`}>
            {screens.map((s, i) => <button key={i} className={`step-dot ${screen === i ? "active" : ""} ${screen > i ? "visited" : ""}`} onClick={() => goTo(i)} aria-label={`Go to screen ${i + 1}`} />)}
          </div>
          {screen < total - 1 ? <button className="next-button" onClick={() => goTo(screen + 1)}>
            <span>{screen === 0 ? "Click here to see what's next" : screen === 1 ? "Wanna see more?" : screen === 2 ? "Not enough yet? Keep going" : screen === 3 ? "One last surprise" : "Show me the final wish"}</span><ArrowRight size={16} />
          </button> : <button className="next-button replay-button" onClick={() => { setRevealed(false); setConfetti(false); goTo(0); }}>
            <span>One more time?</span><WandSparkles size={16} />
          </button>}
        </nav>
      </section>

      <footer className="footer">
       
<span>
  A BIRTHDAY WISH FROM{" "}
  <strong
    className="credit-name"
    onClick={() =>
      window.open(
        "https://bykhizershafi.vercel.app/",
        "_blank",
        "noopener,noreferrer"
      )
    }
    role="link"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        window.open(
          "https://bykhizershafi.vercel.app/",
          "_blank",
          "noopener,noreferrer"
        );
      }
    }}
  >
    KHIZER SHAFI
  </strong>{" "}
  <span className="footer-heart">♥</span>
</span>

        <span className="footer-note"><MoonStar size={13} /> Designed by Khizer Shafi</span>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
