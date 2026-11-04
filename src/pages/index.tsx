import {useEffect, useRef, useState, type JSX} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import {projects} from '@site/src/components/Television/content';
import {createTelevision} from '@site/src/components/Television/renderer';
import styles from './index.module.css';
import JsonLd from '@site/src/components/JsonLd';

type Television = ReturnType<typeof createTelevision>;

const HOME_JSON_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Arce TV',
    alternateName: ['白日梦想家', 'arce.top'],
    url: 'https://www.arce.top/',
    description: '白日梦想家 Arce TV：独立开发者的应用、游戏、学习笔记与创意实验。',
    inLanguage: 'zh-Hans',
    publisher: {
      '@type': 'Person',
      name: 'Arce',
      alternateName: 'charles0122',
      url: 'https://github.com/charles0122',
      sameAs: ['https://github.com/charles0122', 'https://www.arce.top/about'],
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Arce',
    alternateName: ['白日梦想家', 'charles0122'],
    url: 'https://www.arce.top/about',
    image: 'https://avatars.githubusercontent.com/u/70085736?v=4',
    sameAs: ['https://github.com/charles0122'],
    jobTitle: 'Indie developer',
  },
];

export default function Home(): JSX.Element {
  const canvas = useRef<HTMLCanvasElement>(null);
  const tv = useRef<Television | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [channel, setChannel] = useState(0);
  const [heroFocused, setHeroFocused] = useState(false);
  const [ready, setReady] = useState(false);
  const [panel, setPanel] = useState<'help' | 'projects' | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [digits, setDigits] = useState('');
  const digitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const project = channel > 0 ? projects[channel - 1] : null;

  useEffect(() => {
    const element = canvas.current!;
    const lost = () => {setUnavailable(true);setReady(true);};
    const loaded = () => setReady(true);
    element.addEventListener('tv-ready', loaded);
    element.addEventListener('tv-unavailable', lost);
    try {tv.current = createTelevision(element, setChannel, setHeroFocused);} catch {lost();}
    return () => {tv.current?.dispose(); tv.current = null; element.removeEventListener('tv-unavailable', lost); element.removeEventListener('tv-ready', loaded); if(digitTimer.current) clearTimeout(digitTimer.current);};
  }, []);

  useEffect(() => {
    if(panel) dialog.current?.showModal();
    else if (dialog.current?.open) {
      dialog.current.close();
      canvas.current?.focus({preventScroll: true});
    }
  }, [panel]);

  function select(next: number) {
    tv.current?.select(next);
    setPanel(null);
    canvas.current?.focus({preventScroll: true});
  }

  return (
    <Layout
        title="Arce TV"
        description="白日梦想家 Arce TV：独立开发者的应用、游戏、学习笔记与创意实验。">
      <Head>
        <title>Arce TV — Code, Create, Play</title>
        <html lang="zh-Hans" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Arce TV" />
        <meta property="og:locale" content="zh_Hans" />
        <meta name="twitter:title" content="Arce TV — Code, Create, Play" />
        <meta name="twitter:description" content="白日梦想家 Arce TV：独立开发者的应用、游戏、学习笔记与创意实验。" />
      </Head>
      <JsonLd data={HOME_JSON_LD} />
      <main className={styles.television} data-ready={ready} id="main-content" onKeyDown={event => {
        if(panel || event.ctrlKey || event.metaKey || event.altKey || event.target instanceof HTMLAnchorElement || event.target instanceof HTMLButtonElement) return;
        if(event.key === '?') {event.preventDefault();setPanel('help');}
        if(/^\d$/.test(event.key)) {
          const number=(digits+event.key).slice(-3);setDigits(number);
          if(digitTimer.current) clearTimeout(digitTimer.current);
          digitTimer.current=setTimeout(()=>{const next=Number(number);if(next<=projects.length) tv.current?.select(next);setDigits('');},700);
        }
      }}>
        <h1 className={styles.srOnly}>Arce TV — Indie developer, apps, games and creative experiments</h1>
        <canvas ref={canvas} className={styles.screen} tabIndex={0} aria-label="Interactive portfolio. Drag or scroll with two fingers to pan; pinch or use the mouse wheel to zoom. Arrow keys move, Enter opens, Home resets. The index lists every project." aria-describedby="tv-instructions" />
        <p id="tv-instructions" className={styles.srOnly}>Channel {channel}. {project?.title || (heroFocused ? 'About Arce' : 'Home')}. Page Up and Page Down change channels. Escape returns home. Press ? for help.</p>

        <header className={styles.header}>
          <button className={styles.helpBadge} onClick={() => setPanel('help')} aria-label="Help">?</button>
          <nav aria-label="Main navigation" className={styles.navigation}>
            <Link to="/blog">BLOG <span>↗</span></Link>
            <Link to="/project">PROJECTS <span>↗</span></Link>
          </nav>
        </header>
        <div className={styles.station} aria-live="polite"><span className={styles.liveDot} /> ARCE TV <b>{digits || String(channel).padStart(3,'0')}</b></div>

        {!project && !heroFocused && <Link className={styles.sticker} to="/blog"><span>ON AIR</span><strong>IDEAS &<br />DEV NOTES</strong><small>Read the blog ↗</small></Link>}

        {unavailable && <section className={styles.fallback}>
          <h2>Arce — Creative developer</h2><p>The TV canvas is unavailable on this device. Explore the projects below.</p>
          {projects.map(p=><Link key={p.title} to={p.href||p.website||'/project'}>{p.title} ↗</Link>)}
        </section>}
        <noscript><div className={styles.fallback}><h2>Arce — Creative developer</h2><p>Enable JavaScript for the interactive TV, or visit <a href="/blog">Blog</a> or <a href="/project">Projects</a>.</p></div></noscript>

        <dialog ref={dialog} aria-label={panel === 'help' ? 'Arce TV Help' : 'Arce TV project index'} className={styles.dialog} onCancel={()=>setPanel(null)} onClose={()=>setPanel(null)} onClick={event=>{if(event.target===event.currentTarget) setPanel(null);}}>
          <div className={styles.dialogInner}>
            <div className={styles.dialogHeader}><span>{panel==='help'?'000 — HELP':'INDEX — SELECT A CHANNEL'}</span><button onClick={()=>setPanel(null)} aria-label="Close panel" autoFocus>×</button></div>
            {panel==='help'?<>
              <h2>Hello, I’m Arce.<br />Indie developer.</h2>
              <p>Exploring the space between code, games and design. Pick a project, or tune into another channel.</p>
              <div className={styles.helpGrid}>
                <div><b>DRAG</b><span>Move around the board</span></div>
                <div><b>TWO-FINGER SCROLL</b><span>Pan the board, or swipe between open projects</span></div>
                <div><b>WHEEL / PINCH</b><span>Zoom around the pointer or your fingertips</span></div>
                <div><b>CLICK / ENTER</b><span>Open a project or the introduction</span></div>
                <div><b>ARROWS</b><span>Move the board or change projects</span></div>
                <div><b>HOME / ESC</b><span>Return home and reset the board</span></div>
                <div><b>PGUP / PGDN</b><span>Tune to another channel</span></div>
                <div><b>0–9</b><span>Enter a channel number; 000 is home</span></div>
                <div><b>TAB / INDEX</b><span>Browse projects with the keyboard</span></div>
              </div>
              <div className={styles.helpLinks}><button onClick={()=>setPanel('projects')}>CHANNEL INDEX ↗</button><Link to="/blog">BLOG ↗</Link><Link to="/project">PROJECTS ↗</Link><a href="https://github.com/charles0122">GITHUB ↗</a></div>
            </>:<div className={styles.projectList}><button onClick={()=>select(0)}><span>000</span> ARCE TV · HOME</button><button onClick={()=>{setPanel(null);tv.current?.toggleHero();}}>About Arce — Full screen ↗</button>{projects.map((p,i)=><div key={p.title}><button onClick={()=>select(i+1)}><span>{String(i+1).padStart(3,'0')}</span>{p.title}</button><Link to={p.href||p.website||'/project'} aria-label={`Open ${p.title}`}>↗</Link></div>)}</div>}
          </div>
        </dialog>
      </main>
    </Layout>
  );
}
