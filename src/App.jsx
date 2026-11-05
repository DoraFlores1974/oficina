import { useState } from 'react'
import { isSupabaseConfigured, supabase } from './lib/supabase'

const menuItems = [
  { id: 'inicio', label: 'Início', icon: '⌂' },
  { id: 'cadastro', label: 'Cadastro', icon: '＋' },
  { id: 'relatorios', label: 'Relatórios', icon: '▤' },
]
const footerItems = [
  { id: 'inicio', label: 'Início', icon: '⌂' },
  { id: 'cadastro', label: 'Novo nome', icon: '＋' },
  { id: 'ajuda', label: 'Ajuda', icon: '?' },
]

export default function App() {
  const [activePage, setActivePage] = useState('cadastro')
  const [nome, setNome] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const cleanName = nome.trim()
    if (!cleanName) {
      setStatus('error')
      setMessage('Digite um nome antes de salvar.')
      return
    }
    if (!isSupabaseConfigured) {
      setStatus('error')
      setMessage('Configure as variáveis do Supabase para habilitar o cadastro.')
      return
    }
    setStatus('loading')
    setMessage('')
    const { error } = await supabase.from('oficina_nomes').insert({ nome: cleanName })
    if (error) {
      setStatus('error')
      setMessage('Não foi possível salvar. Confira a conexão e tente novamente.')
      console.error('Supabase insert error:', error)
      return
    }
    setStatus('success')
    setMessage('Nome salvo com sucesso no Supabase!')
    setNome('')
  }

  function navigate(page) {
    setActivePage(page)
    setStatus('idle')
    setMessage(page === 'ajuda' ? 'Navegação demonstrativa: esta seção é apenas um mock.' : '')
  }

  const pageTitle = activePage === 'cadastro' ? 'Cadastro' : activePage === 'relatorios' ? 'Relatórios' : activePage === 'ajuda' ? 'Ajuda' : 'Início'

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" onClick={() => navigate('inicio')} aria-label="Oficina, início">
          <span className="brand-mark">O</span><span>oficina<span className="brand-dot">.</span></span>
        </a>
        <div className="topbar-right">
          <span className="environment"><span className="status-dot" /> Ambiente de teste</span>
          <div className="avatar" aria-label="Perfil de teste">OF</div>
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <div className="sidebar-label">MENU PRINCIPAL</div>
          <nav aria-label="Menu lateral">
            {menuItems.map(item => (
              <button className={`nav-item ${activePage === item.id ? 'active' : ''}`} key={item.id} onClick={() => navigate(item.id)} type="button">
                <span className="nav-icon">{item.icon}</span>{item.label}
                {item.id === 'cadastro' && <span className="nav-indicator" />}
              </button>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="connection-card">
              <span className="connection-icon">⌁</span>
              <div><strong>Banco de dados</strong><span>{isSupabaseConfigured ? 'Supabase configurado' : 'Aguardando configuração'}</span></div>
              <span className={`connection-light ${isSupabaseConfigured ? 'online' : ''}`} />
            </div>
            <span className="sidebar-version">OFICINA · VERSÃO 1.0</span>
          </div>
        </aside>

        <main className="main-content">
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-separator">/</span><strong>{pageTitle}</strong></div>
          <section className="content-wrap">
            <div className="eyebrow"><span className="eyebrow-line" /> TESTE DE INTEGRAÇÃO</div>
            <h1>{activePage === 'cadastro' ? 'Vamos começar.' : activePage === 'relatorios' ? 'Relatórios' : activePage === 'ajuda' ? 'Central de ajuda' : 'Bem-vindo à Oficina.'}</h1>
            <p className="subtitle">Um espaço simples para testar a conexão entre React, Supabase e Vercel.</p>

            <div className="form-card">
              <div className="card-heading">
                <div><span className="card-kicker">CADASTRO RÁPIDO</span><h2>Adicionar nome</h2></div>
                <span className="card-number">01 <span>/ 01</span></span>
              </div>
              <form onSubmit={handleSubmit}>
                <label htmlFor="nome">Nome</label>
                <input id="nome" name="nome" type="text" placeholder="Digite seu nome" value={nome} onChange={event => setNome(event.target.value)} maxLength={120} autoComplete="name" disabled={status === 'loading'} />
                <div className="form-footer">
                  <span className="field-hint">Até 120 caracteres</span>
                  <button className="submit-button" type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Salvando...' : 'Salvar nome'}<span aria-hidden="true">↗</span></button>
                </div>
                {message && <p className={`feedback ${status}`} role="status" aria-live="polite">{message}</p>}
              </form>
            </div>
            <div className="helper-note"><span className="helper-icon">i</span><p>Este é um ambiente de demonstração. O formulário grava somente o nome enviado, sem exibir uma lista pública de registros.</p></div>
          </section>
          <footer className="page-footer"><span>© 2026 Oficina</span><span>Feito para testar. Pronto para evoluir.</span></footer>
        </main>
      </div>

      <nav className="mobile-footer" aria-label="Navegação inferior">
        {footerItems.map(item => (
          <button className={`mobile-nav-item ${activePage === item.id ? 'active' : ''}`} key={item.id} onClick={() => navigate(item.id)} type="button">
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}