'use client'

import React, { useEffect, useState } from 'react'
import { deleteProject } from '@/lib/actions'
import { CardWatermark, TerminalLoader } from '@/components/ui/Icons'
import type { Project } from '@/types'

interface Props {
  project: Project
  index: number
}

export function PreviewCard({ project, index }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [error,  setError]  = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [embeddable, setEmbeddable] = useState<boolean | null>(null)

  const hostname = (() => {
    try { return new URL(project.url).hostname }
    catch { return project.url }
  })()

  useEffect(() => {
    let mounted = true
    const controller = new AbortController()
    const check = async () => {
      try {
        const res = await fetch(`/api/check-embed?url=${encodeURIComponent(project.url)}`, { signal: controller.signal })
        if (!mounted) return
        const data = await res.json()
        if (data?.embeddable) {
          setEmbeddable(true)
        } else {
          setEmbeddable(false)
          setError(true)
          setLoaded(true)
        }
      } catch (e) {
        if (!mounted) return
        setEmbeddable(false)
        setError(true)
        setLoaded(true)
      }
    }
    check()
    return () => { mounted = false; controller.abort() }
  }, [project.url])

  const handleDelete = async () => {
    if (!confirm(`Remover "${project.title}"?`)) return
    setDeleting(true)
    try { await deleteProject(project.id); setDeleting(false) }
    catch { setDeleting(false) }
  }

  return (
    <div
      className="preview-card"
      style={{ animationDelay: `${index * 0.07}s` }}
      onClick={(e) => {
        const target = e.target as HTMLElement
        if (!target.closest('button') && !target.closest('a')) {
          window.open(project.url, '_blank')
        }
      }}
    >
      {/* iframe preview */}
      <div className="preview-frame-wrap">
        {/* show loading until embeddable check completes */}
        {(embeddable === null || !loaded) && (
          <div className={`preview-loading${error ? ' error-state' : ''}`}>
            <TerminalLoader className="loader-claw" />
            <span className="loading-text">
              {error ? 'Preview indisponível' : 'Carregando...'}
            </span>
          </div>
        )}

        {/* render iframe only when embeddable is true */}
        {embeddable ? (
          <iframe
            src={project.url}
            title={project.title}
            sandbox="allow-same-origin allow-scripts"
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => { setError(true); setLoaded(true) }}
          />
        ) : embeddable === false ? (
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%'}}>
            <div style={{textAlign:'center'}}>
              <div style={{marginBottom:8,color:'#999'}}>Preview indisponível</div>
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn-sm" onClick={e=>e.stopPropagation()}>Abrir em nova aba</a>
            </div>
          </div>
        ) : null}

        <div className="preview-overlay" />
      </div>

      <CardWatermark className="card-claw" />

      <div className="preview-info">
        <div className="preview-url">{hostname}</div>
        <div className="preview-title">{project.title}</div>
        <div className="preview-desc">
          {project.description || 'Clique para visitar o site'}
        </div>
        <div className="preview-actions">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-sm"
            onClick={e => e.stopPropagation()}
          >
            ↗ Visitar
          </a>
          <button
            className="btn-sm danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? '...' : '✕ Remover'}
          </button>
        </div>
      </div>
    </div>
  )
}
