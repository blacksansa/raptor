'use client'
import React, { useEffect, useState } from 'react'
import { initialProjects, Project } from '../data/portfolio'
import { listProjects, createProject as sbCreateProject, deleteProject as sbDeleteProject, ProjectRow } from '../sc/integrations/supabase/projects'

export default function ClientHome(): JSX.Element {
  const [projects, setProjects] = useState<Project[]>([])
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [listLayout, setListLayout] = useState(false)
  const [loaded, setLoaded] = useState<Record<number, boolean>>({})

  useEffect(() => {
    let mounted = true
    // try Supabase first
    void (async () => {
      try {
        const rows = await listProjects()
        if (mounted && rows.length) {
          setProjects(rows.map(r => ({ id: r.id, url: r.url, title: r.title, description: r.description ?? '' })))
          return
        }
      } catch (e) {
        // ignore, fallback to local
      }

      // fallback to localStorage or initial
      const stored = typeof window !== 'undefined' ? localStorage.getItem('bs_projects') : null
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) setProjects(parsed)
          else setProjects(initialProjects)
        } catch (err) {
          // corrupted localStorage entry — clear and fallback
          localStorage.removeItem('bs_projects')
          setProjects(initialProjects)
        }
      } else setProjects(initialProjects)
    })()

    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('bs_projects', JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    const cursor = document.getElementById('cursor')
    const trail = document.getElementById('cursor-trail')
    if (!cursor || !trail) return
    let mx = 0, my = 0
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      (cursor as HTMLElement).style.left = mx + 'px'
      (cursor as HTMLElement).style.top = my + 'px'
      setTimeout(() => {
        (trail as HTMLElement).style.left = mx + 'px'
        (trail as HTMLElement).style.top = my + 'px'
      }, 80)
    }
    document.addEventListener('mousemove', onMove)

    const els = document.querySelectorAll('a, button, .preview-card, .skill-tag, .btn-sm')
    els.forEach(el => {
      el.addEventListener('mouseenter', () => (cursor as HTMLElement).style.transform = 'translate(-50%,-50%) scale(1.8)')
      el.addEventListener('mouseleave', () => (cursor as HTMLElement).style.transform = 'translate(-50%,-50%) scale(1)')
    })

    return () => {
      document.removeEventListener('mousemove', onMove)
    }
  }, [projects])

  async function addProject() {
    if (!url) return
    let newUrl = url
    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) newUrl = 'https://' + newUrl

    try {
      const inserted = await sbCreateProject({ url: newUrl, title: title || 'Sem título', description: '' })
      setProjects(prev => [{ id: inserted.id, url: inserted.url, title: inserted.title, description: inserted.description ?? '' }, ...prev])
      setUrl('')
      setTitle('')
      return
    } catch (e) {
      // fallback local
    }

    const id = Date.now()
    const newProject = { id, url: newUrl, title: title || 'Sem título', description: '' }
    setProjects(prev => [newProject, ...prev])
    setUrl('')
    setTitle('')
  }

  async function removeProject(id: number) {
    try {
      await sbDeleteProject(id)
      setProjects(prev => prev.filter(p => p.id !== id))
      return
    } catch (e) {
      // fallback local deletion
    }
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  function iframeLoaded(id: number) { setLoaded(prev => ({ ...prev, [id]: true })) }
  function iframeError(id: number) { setLoaded(prev => ({ ...prev, [id]: false })) }
  function toggleLayout() { setListLayout(v => !v) }

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = '1'
          (entry.target as HTMLElement).style.transform = 'translateY(0)'
        }
      })
    }, { threshold: 0.1 })

    document.querySelectorAll('section').forEach(s => {
      (s as HTMLElement).style.opacity = '0'
      (s as HTMLElement).style.transform = 'translateY(30px)'
      (s as HTMLElement).style.transition = 'opacity 0.8s ease, transform 0.8s ease'
      observer.observe(s)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div className="cursor" id="cursor">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L14 8L20 6L16 12L22 14L16 16L18 22L12 18L6 22L8 16L2 14L8 12L4 6L10 8L12 2Z" fill="#CC0000" stroke="#FF4444" strokeWidth="0.5"/>
        </svg>
      </div>
      <div className="cursor-trail" id="cursor-trail"></div>

      <nav>
        <a href="#hero" className="nav-logo">
          <svg viewBox="0 0 36 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 2 L3 24" stroke="#CC0000" strokeWidth="2.8" strokeLinecap="square"/>
            <path d="M3 2 L11 2 Q16 2 16 8 Q16 13 3 13" stroke="#CC0000" strokeWidth="2.2" strokeLinecap="square" fill="none"/>
            <path d="M3 13 L12 13 Q18 13 18 18 Q18 24 3 24" stroke="#CC0000" strokeWidth="2.2" strokeLinecap="square" fill="none"/>
            <path d="M22 5 Q22 2 25 2 L32 2 Q35 2 35 6 Q35 11 24 15 Q20 17 20 21 Q20 24 23 24 L32 24 Q35 24 35 24" stroke="#CC0000" strokeWidth="2.2" strokeLinecap="square" fill="none"/>
          </svg>
          <span className="nav-logo-text">BR<span>.</span>DEV</span>
        </a>
        <ul className="nav-links">
          <li><a href="#about-section">Sobre</a></li>
          <li><a href="#portfolio-section">Portfólio</a></li>
          <li><a href="#contact-section">Contato</a></li>
        </ul>
      </nav>

      <div id="hero">
        <div className="hero-bg"></div>
        <div className="scratch-lines"></div>

        <div className="logo-mark">
          <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 20 L18 120" stroke="#CC0000" strokeWidth="10" strokeLinecap="square"/>
            <path d="M18 20 L52 20 Q72 20 72 40 Q72 60 18 60" stroke="#CC0000" strokeWidth="8" strokeLinecap="square" strokeLinejoin="miter" fill="none"/>
            <path d="M18 60 L56 60 Q80 60 80 80 Q80 120 18 120" stroke="#CC0000" strokeWidth="8" strokeLinecap="square" strokeLinejoin="miter" fill="none"/>
            <path d="M94 28 Q94 20 102 20 L126 20 Q134 20 134 30 Q134 42 108 55 Q86 66 86 82 Q86 95 94 102 L126 102 Q134 102 134 114 Q134 120 126 120 L94 120" stroke="#CC0000" strokeWidth="8" strokeLinecap="square" strokeLinejoin="miter" fill="none"/>
            <line x1="84" y1="10" x2="86" y2="130" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.3"/>
          </svg>
        </div>

        <h1 className="hero-name"><span className="first">Bruno</span><span className="last">Santos</span></h1>
        <p className="hero-tagline">Desenvolvedor <span>//</span> Designer <span>//</span> Criador</p>

        <div className="scroll-hint"><p>Scroll</p><div className="scroll-arrow"></div></div>
      </div>

      <div className="claw-divider">
        <svg viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polyline points="8,3 2,10 8,17" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="20,3 26,10 20,17" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="17" y1="1" x2="11" y2="19" stroke="#CC0000" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6"/>
        </svg>
      </div>

      <div id="about-section">
        <section id="about">
          <div className="about-text">
            <p className="section-label">01 // Sobre</p>
            <h2 className="section-title">Quem<br/><span>Sou Eu</span></h2>
            <p>Desenvolvedor <strong>full-stack</strong> apaixonado por criar experiências digitais que deixam marca. Cada projeto é uma caçada — eu rastreio o problema, planejo o ataque e executo com precisão.</p>
            <p>Especializado em transformar ideias em produtos que <strong>realmente funcionam</strong>, com atenção obsessiva aos detalhes de design e performance.</p>
            <div className="about-skills" id="skills-list">
              <span className="skill-tag">JavaScript</span>
              <span className="skill-tag">React</span>
              <span className="skill-tag">Node.js</span>
              <span className="skill-tag">TypeScript</span>
              <span className="skill-tag">CSS/Sass</span>
              <span className="skill-tag">Python</span>
              <span className="skill-tag">PostgreSQL</span>
              <span className="skill-tag">Docker</span>
            </div>
          </div>
          <div className="about-visual">
            <div className="about-claw-bg">
              <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="16" width="124" height="108" rx="10" stroke="#CC0000" strokeWidth="4" fill="none"/>
                <line x1="8" y1="40" x2="132" y2="40" stroke="#CC0000" strokeWidth="3" strokeOpacity="0.5"/>
                <circle cx="24" cy="28" r="4" fill="#CC0000" fillOpacity="0.9"/>
                <circle cx="40" cy="28" r="4" fill="#CC0000" fillOpacity="0.5"/>
                <circle cx="56" cy="28" r="4" fill="#CC0000" fillOpacity="0.25"/>
                <polyline points="22,62 32,72 22,82" stroke="#CC0000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <line x1="40" y1="72" x2="80" y2="72" stroke="#CC0000" strokeWidth="4" strokeLinecap="round"/>
                <rect x="84" y="62" width="10" height="18" fill="#CC0000" rx="1"/>
                <line x1="22" y1="98" x2="58" y2="98" stroke="#CC0000" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.4"/>
                <line x1="64" y1="98" x2="100" y2="98" stroke="#CC0000" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.25"/>
                <line x1="22" y1="114" x2="44" y2="114" stroke="#CC0000" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.2"/>
              </svg>
            </div>
          </div>
        </section>
      </div>

      <div className="claw-divider">
        <svg viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polyline points="8,3 2,10 8,17" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="20,3 26,10 20,17" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="17" y1="1" x2="11" y2="19" stroke="#CC0000" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6"/>
        </svg>
      </div>

      <div id="portfolio-section">
        <section id="portfolio">
          <p className="section-label">02 // Trabalhos</p>
          <h2 className="section-title">Meu<br/><span>Portfólio</span></h2>

          <div className="portfolio-controls">
            <div className="add-link-form">
              <input type="text" id="url-input" placeholder="https://seu-projeto.com" value={url} onChange={e=>setUrl(e.target.value)} />
              <input type="text" id="title-input" placeholder="Nome do projeto" style={{width:180}} value={title} onChange={e=>setTitle(e.target.value)} />
              <button className="btn" onClick={addProject}><span>+ Adicionar</span></button>
            </div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}} id="sort-controls">
              <button className="btn-sm" onClick={toggleLayout} id="layout-btn">{listLayout ? 'Lista' : 'Grade'}</button>
            </div>
          </div>

          <div id="preview-grid" style={{gridTemplateColumns: listLayout ? '1fr' : undefined}}>
            {projects.length === 0 ? (
              <div id="empty-state">
                <svg viewBox="0 0 140 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="8" width="128" height="94" rx="8" stroke="#CC0000" strokeWidth="3" fill="none"/>
                  <line x1="6" y1="30" x2="134" y2="30" stroke="#CC0000" strokeWidth="2.5" strokeOpacity="0.5"/>
                  <circle cx="20" cy="19" r="3.5" fill="#CC0000" fillOpacity="0.8"/>
                  <circle cx="33" cy="19" r="3.5" fill="#CC0000" fillOpacity="0.4"/>
                  <circle cx="46" cy="19" r="3.5" fill="#CC0000" fillOpacity="0.2"/>
                  <polyline points="20,50 29,59 20,68" stroke="#CC0000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="36" y1="59" x2="70" y2="59" stroke="#CC0000" strokeWidth="3.5" strokeLinecap="round"/>
                  <rect x="74" y="50" width="8" height="16" fill="#CC0000" rx="1"/>
                  <line x1="20" y1="82" x2="50" y2="82" stroke="#CC0000" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.35"/>
                  <line x1="56" y1="82" x2="90" y2="82" stroke="#CC0000" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.2"/>
                </svg>
                <p>Nenhum projeto ainda — adicione um link acima</p>
              </div>
            ) : projects.map((p,i) => (
              <div className="preview-card" key={p.id} style={{animationDelay: `${i*0.07}s`}} onClick={(e)=>{ if(!e.target.closest('button') && !e.target.closest('a')) window.open(p.url, '_blank')}}>
                <div className="preview-frame-wrap">
                  <div className={`preview-loading ${loaded[p.id] ? 'hidden' : ''}`} id={`loading-${p.id}`}>
                    <svg className="loader-claw" viewBox="0 0 60 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="54" height="40" rx="5" stroke="#CC0000" strokeWidth="2.5" fill="none"/>
                      <line x1="3" y1="14" x2="57" y2="14" stroke="#CC0000" strokeWidth="2" strokeOpacity="0.5"/>
                      <circle cx="10" cy="8.5" r="2.5" fill="#CC0000" fillOpacity="0.8"/>
                      <circle cx="18" cy="8.5" r="2.5" fill="#CC0000" fillOpacity="0.4"/>
                      <circle cx="26" cy="8.5" r="2.5" fill="#CC0000" fillOpacity="0.2"/>
                      <polyline points="10,22 16,28 10,34" stroke="#CC0000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="20" y1="28" x2="38" y2="28" stroke="#CC0000" strokeWidth="2.5" strokeLinecap="round"/>
                      <rect x="41" y1="22" width="6" height="12" fill="#CC0000" rx="1"/>
                    </svg>
                    <span className="loading-text">{loaded[p.id] === false ? 'Preview indisponível' : 'Carregando...'}</span>
                  </div>
                  <iframe src={p.url} title={p.title} sandbox="allow-same-origin allow-scripts" loading="lazy" onLoad={()=>iframeLoaded(p.id)} onError={()=>iframeError(p.id)}></iframe>
                  <div className="preview-overlay"></div>
                </div>
                <svg className="card-claw" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="12,4 4,16 12,28" stroke="#CC0000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="28,4 36,16 28,28" stroke="#CC0000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="24" y1="2" x2="16" y2="30" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6"/>
                </svg>
                <div className="preview-info">
                  <div className="preview-url">{(() => { try { return new URL(p.url).hostname } catch { return p.url } })()}</div>
                  <div className="preview-title">{p.title}</div>
                  <div className="preview-desc">{p.desc || 'Clique para visitar o site'}</div>
                  <div className="preview-actions">
                    <a href={p.url} target="_blank" rel="noreferrer" className="btn-sm">↗ Visitar</a>
                    <button className="btn-sm danger" onClick={()=>removeProject(p.id)}>✕ Remover</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section id="contact-section">
        <p className="section-label" style={{justifyContent:'center'}}>03 // Contato</p>
        <h2 className="section-title">Vamos<br/><span>Trabalhar?</span></h2>
        <p style={{color:'#888',fontSize:'1.1rem',maxWidth:500,margin:'0 auto',lineHeight:1.7}}>
          Sempre aberto a novos projetos e colaborações. Se tem uma ideia, <span style={{color:'var(--red)'}}>manda mensagem</span>.
        </p>
        <div className="contact-links">
          <a href="mailto:bruno@email.com"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>Email</a>
                    <a href="https://github.com" target="_blank" rel="noreferrer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>GitHub</a>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>LinkedIn</a>
        </div>

        <footer>
          <p>© 2025 Bruno Santos — Feito com <span>&#9829;</span> e muito café</p>
        </footer>
      </>
    )
  }
