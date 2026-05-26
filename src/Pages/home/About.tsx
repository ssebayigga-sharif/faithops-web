import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionItem, Tag } from '@carbon/react';
import { ArrowRight, ChevronDown } from '@carbon/icons-react';
import { LEADERS, BELIEFS, STATS } from './church';
import { useFadeIn } from './useFadeIn';
import type { Leader, BeliefItem } from './index';

// ─── About Hero ───────────────────────────────────────────────────────────────
const AboutHero: React.FC = () => (
  <section style={{ background: 'var(--church-navy)', padding: '6rem 2rem 5rem', position: 'relative', overflow: 'hidden' }}>
    {/* Cross background */}
    <svg aria-hidden viewBox="0 0 600 600" style={{ position: 'absolute', right: -60, bottom: -60, width: 520, height: 520, opacity: 0.05 }}>
      <rect x="265" y="0" width="70" height="600" fill="var(--church-gold)" />
      <rect x="0" y="240" width="600" height="70" fill="var(--church-gold)" />
    </svg>
    {/* Page indicator strip */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, var(--church-gold) 0%, transparent 100%)' }} />

    <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '2rem', fontSize: '0.8rem', color: '#6b6b8a' }}>
        <Link to="/" style={{ color: 'var(--church-gold)', textDecoration: 'none' }}>Home</Link>
        <span>›</span>
        <span style={{ color: '#9aa0ac' }}>About</span>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem', animation: 'pageEnter 0.6s 0.1s both' }}>
        <div style={{ width: 32, height: 2, background: 'var(--church-gold)' }} />
        <span style={{ color: 'var(--church-gold)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
          Our Identity
        </span>
      </div>

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#f0ece4', lineHeight: 1.1, marginBottom: '1.5rem', maxWidth: 700, animation: 'pageEnter 0.6s 0.2s both' }}>
        Who We Are &<br /><span style={{ color: 'var(--church-gold)' }}>What We Believe</span>
      </h1>

      <p style={{ fontSize: '1.1rem', color: '#9aa0ac', lineHeight: 1.8, maxWidth: 560, animation: 'pageEnter 0.6s 0.3s both' }}>
        Kampala Central is a Seventh-day Adventist congregation — a people of prophecy, united by a shared mission to proclaim God's final message of grace and judgment to East Africa and the world.
      </p>

      <div style={{ display: 'flex', gap: '3rem', marginTop: '3rem', flexWrap: 'wrap', animation: 'pageEnter 0.6s 0.4s both' }}>
        {[
          { value: '1967', label: 'Founded' },
          { value: '1,240+', label: 'Members' },
          { value: '3', label: 'Campuses' },
        ].map((s) => (
          <div key={s.label}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--church-gold)', fontWeight: 700, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#9aa0ac', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Mission Vision Values ─────────────────────────────────────────────────────
const MissionSection: React.FC = () => {
  const ref = useFadeIn();
  const pillars = [
    {
      label: 'Our Mission',
      icon: '✦',
      title: 'Proclaim the Three Angels',
      body: 'We exist to share the eternal gospel, the judgment hour, and the call to pure worship — the messages of Revelation 14 — to every person within our reach.',
      verse: '"The hour of his judgment is come." — Rev 14:7',
    },
    {
      label: 'Our Vision',
      icon: '◆',
      title: 'A People Prepared',
      body: 'To be a Spirit-filled, outward-focused community that disciples its members into wholistic disciples — ready for the soon return of Jesus Christ.',
      verse: '"Prepare the way of the Lord." — Luke 3:4',
    },
    {
      label: 'Our Values',
      icon: '✚',
      title: 'Scripture · Wholeness · Service',
      body: 'We hold the Bible as our only creed, pursue health of mind, body, and spirit as an act of worship, and express faith through sacrificial service to our community.',
      verse: '"Faith without works is dead." — James 2:26',
    },
  ];

  return (
    <section className="section-cream" ref={ref} style={{ padding: '5rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="fade-up" style={{ marginBottom: '3.5rem' }}>
          <div className="gold-rule" style={{ marginBottom: '1.25rem' }} />
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>Mission, Vision & Values</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1px', background: 'var(--church-divider)', border: '1px solid var(--church-divider)' }}>
          {pillars.map((p) => (
            <div key={p.label} className="fade-up" style={{ background: '#faf8f3', padding: '2.5rem 2rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'var(--church-gold)' }} />
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', color: 'var(--church-gold)', textTransform: 'uppercase', marginBottom: '1rem' }}>
                {p.icon} {p.label}
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--church-navy)', marginBottom: '1rem', lineHeight: 1.3 }}>{p.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--church-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>{p.body}</p>
              <blockquote style={{ borderLeft: '3px solid var(--church-gold)', paddingLeft: '0.875rem', margin: 0, fontFamily: 'var(--font-verse)', fontStyle: 'italic', fontSize: '0.825rem', color: 'var(--church-text)', lineHeight: 1.6 }}>
                {p.verse}
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Church History ────────────────────────────────────────────────────────────
const HistorySection: React.FC = () => {
  const ref = useFadeIn();
  const timeline = [
    { year: '1844', event: 'The Great Disappointment', detail: 'William Miller\'s prophecy leads to re-examination of Scripture — a movement is born from the ashes of disappointment.' },
    { year: '1863', event: 'General Conference Founded', detail: 'The Seventh-day Adventist Church is formally organized in Battle Creek, Michigan with a mission to proclaim biblical truth globally.' },
    { year: '1920s', event: 'East Africa Missions', detail: 'Adventist missionaries reach Uganda, establishing schools, clinics, and congregations that form the foundation of our regional church.' },
    { year: '1967', event: 'Kampala Central Established', detail: 'Our local congregation is planted in Nakasero, Kampala, growing from a small house church into a thriving urban ministry.' },
    { year: '2010', event: 'Kampala Campus Expansion', detail: 'We launch our second campus to serve the growing Nakawa and Kira communities with dedicated pastoral leadership.' },
    { year: 'Today', event: 'Three Campuses, One Mission', detail: 'Kampala Central serves over 1,200 members across three campuses, with robust outreach and health ministry programs throughout Greater Kampala.' },
  ];

  return (
    <section className="section-navy" ref={ref} style={{ padding: '5rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="fade-up" style={{ marginBottom: '3.5rem' }}>
          <div className="gold-rule" style={{ marginBottom: '1.25rem' }} />
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', color: '#f0ece4' }}>Our History</h2>
          <p style={{ color: '#9aa0ac', maxWidth: 480, marginTop: '0.5rem', lineHeight: 1.7 }}>
            From a prophetic movement in 1844 to a global church with 21 million members — and a vibrant home in Kampala.
          </p>
        </div>

        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: 64, top: 0, bottom: 0, width: 1, background: 'rgba(200,168,75,0.3)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {timeline.map((t, i) => (
              <div key={i} className="fade-up" style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start' }}>
                {/* Year */}
                <div style={{ minWidth: 80, textAlign: 'right', paddingTop: 4 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--church-gold)', fontWeight: 700 }}>{t.year}</span>
                </div>
                {/* Dot */}
                <div style={{ position: 'relative', paddingTop: 6, flexShrink: 0 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--church-gold)', border: '3px solid var(--church-navy)', boxSizing: 'border-box' }} />
                </div>
                {/* Content */}
                <div style={{ paddingBottom: '1rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#f0ece4', marginBottom: '0.5rem' }}>{t.event}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#9aa0ac', lineHeight: 1.7, margin: 0, maxWidth: 540 }}>{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── SDA Distinctives ─────────────────────────────────────────────────────────
const DistinctivesSection: React.FC = () => {
  const ref = useFadeIn();
  const items = [
    { icon: '📖', title: 'Sola Scriptura', body: 'Scripture alone is our creed. Every doctrine is tested by "the law and the testimony" (Isaiah 8:20). We interpret the Bible using the Bible.' },
    { icon: '🕯', title: 'The Sabbath (Saturday)', body: 'The seventh-day Sabbath is God\'s memorial of creation and redemption. We rest, worship, and delight in God from Friday sunset to Saturday sunset.' },
    { icon: '🏥', title: 'Wholistic Health', body: 'Based on the NEWSTART principles, we believe the body is a temple of the Holy Spirit. Health reform is an act of worship and preparation.' },
    { icon: '✝', title: 'The Sanctuary Message', body: 'Christ is our High Priest ministering in the heavenly sanctuary. His atonement is the foundation of our salvation and the basis of our judgment-hour message.' },
    { icon: '🌍', title: 'Prophetic Mission', body: 'We understand our identity through Bible prophecy — we are the remnant church called to proclaim the Three Angels\' Messages before Christ\'s return.' },
    { icon: '✉', title: 'Personal Evangelism', body: 'Every member is called to be a missionary. We equip each believer to share their faith through Bible studies, community service, and personal witness.' },
  ];

  return (
    <section className="section-white" ref={ref} style={{ padding: '5rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="gold-rule-center" style={{ marginBottom: '1.25rem' }} />
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>What Makes Us Adventist</h2>
          <p style={{ color: 'var(--church-muted)', maxWidth: 500, margin: '0.75rem auto 0', lineHeight: 1.7 }}>
            Six distinctive convictions that shape how we worship, live, and serve.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {items.map((item) => (
            <div key={item.title} className="fade-up" style={{ padding: '2rem', border: '1px solid var(--church-divider)', background: '#fff', borderTop: '3px solid var(--church-gold)', transition: 'box-shadow 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(10,22,40,0.08)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{item.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--church-navy)', marginBottom: '0.75rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--church-muted)', lineHeight: 1.75, margin: 0 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Fundamental Beliefs (Accordion) ─────────────────────────────────────────
const BeliefsSection: React.FC = () => {
  const ref = useFadeIn();
  return (
    <section className="section-gold" ref={ref} style={{ padding: '5rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="fade-up" style={{ marginBottom: '3rem' }}>
          <div className="gold-rule" style={{ marginBottom: '1.25rem' }} />
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>Fundamental Beliefs</h2>
          <p style={{ color: 'var(--church-muted)', maxWidth: 560, marginTop: '0.5rem', lineHeight: 1.7 }}>
            The SDA Church has 28 Fundamental Beliefs, each drawn solely from Scripture. Below are a selection central to our identity.
          </p>
        </div>

        <div className="fade-up">
          <Accordion>
            {BELIEFS.map((b: BeliefItem) => (
              <AccordionItem
                key={b.number}
                title={
                  <span style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--church-navy)' }}>
                    <span style={{ minWidth: 28, height: 28, borderRadius: '50%', background: 'var(--church-navy)', color: 'var(--church-gold)', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {b.number}
                    </span>
                    {b.title}
                  </span>
                }
              >
                <div style={{ padding: '0.5rem 0 1.25rem 2.75rem' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--church-muted)', lineHeight: 1.75, marginBottom: '0.75rem' }}>{b.summary}</p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--church-navy)', color: 'var(--church-gold)', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em' }}>
                    📖 {b.scripture}
                  </div>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="fade-up" style={{ marginTop: '2rem' }}>
          <a href="https://www.adventist.org/beliefs" target="_blank" rel="noopener noreferrer" className="btn-church-outline" style={{ display: 'inline-flex' }}>
            All 28 Beliefs → adventist.org
          </a>
        </div>
      </div>
    </section>
  );
};

// ─── Leadership ───────────────────────────────────────────────────────────────
const LeadershipSection: React.FC = () => {
  const ref = useFadeIn();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="section-white" ref={ref} style={{ padding: '5rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="gold-rule-center" style={{ marginBottom: '1.25rem' }} />
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>Our Leadership</h2>
          <p style={{ color: 'var(--church-muted)', maxWidth: 480, margin: '0.75rem auto 0', lineHeight: 1.7 }}>
            Servant leaders called to shepherd, teach, and guide our congregation.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {LEADERS.map((leader: Leader) => (
            <div key={leader.id} className="fade-up" style={{ border: '1px solid var(--church-divider)', background: '#fff', overflow: 'hidden', transition: 'box-shadow 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(10,22,40,0.08)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
            >
              {/* Avatar bar */}
              <div style={{ background: 'var(--church-navy)', padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--church-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--church-navy)', flexShrink: 0 }}>
                  {leader.initials}
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#f0ece4', lineHeight: 1.2 }}>{leader.name}</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--church-gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{leader.title}</div>
                  <div style={{ fontSize: '0.72rem', color: '#6b6b8a', marginTop: 3 }}>{leader.yearsServing} years of service</div>
                </div>
              </div>

              {/* Bio */}
              <div style={{ padding: '1.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--church-muted)', lineHeight: 1.75, margin: 0 }}>
                  {expanded === leader.id ? leader.bio : `${leader.bio.slice(0, 120)}...`}
                </p>
                <button
                  onClick={() => setExpanded(expanded === leader.id ? null : leader.id)}
                  style={{ marginTop: '0.875rem', background: 'none', border: 'none', color: 'var(--church-gold)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}
                >
                  {expanded === leader.id ? 'Show less' : 'Read more'}
                  <ChevronDown size={14} style={{ transform: expanded === leader.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Join CTA ─────────────────────────────────────────────────────────────────
const JoinCTA: React.FC = () => (
  <section style={{ background: 'var(--church-navy)', padding: '5rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      <svg aria-hidden viewBox="0 0 400 400" width="500" height="500" style={{ opacity: 0.04 }}>
        <rect x="180" y="20" width="40" height="360" fill="var(--church-gold)" />
        <rect x="20" y="160" width="360" height="40" fill="var(--church-gold)" />
      </svg>
    </div>
    <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
      <div className="gold-rule-center" style={{ marginBottom: '1.5rem' }} />
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#f0ece4', marginBottom: '1.25rem', lineHeight: 1.2 }}>
        Come Worship With Us This Sabbath
      </h2>
      <p style={{ color: '#9aa0ac', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
        We gather every Saturday at 9:00 AM for Sabbath School and 11:00 AM for Divine Worship. New faces are always welcome — come as you are.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/contact" className="btn-church-primary">
          Plan Your Visit <ArrowRight size={16} />
        </Link>
        <Link to="/" className="btn-church-outline">
          Back to Home
        </Link>
      </div>
    </div>
  </section>
);

// ─── AboutPage ─────────────────────────────────────────────────────────────────
const AboutPage: React.FC = () => (
  <main className="page-enter">
    <AboutHero />
    <MissionSection />
    <HistorySection />
    <DistinctivesSection />
    <BeliefsSection />
    <LeadershipSection />
    <JoinCTA />
  </main>
);

export default AboutPage;