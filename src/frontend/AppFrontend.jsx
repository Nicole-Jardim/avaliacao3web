import { useState } from 'react'

// Use relative paths so Vite dev proxy can forward API calls to backend
const API_BASE = ''

const safeParseJson = (text) => {
  try {
    return text ? JSON.parse(text) : null
  } catch (e) {
    return text
  }
}

export default function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [apiResult, setApiResult] = useState('')
  const [aluno, setAluno] = useState({ id: '', nome: '', ra: '', nota1: '', nota2: '' })

  const doRegister = async () => {
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const text = await res.text()
      const data = safeParseJson(text)
      setApiResult(JSON.stringify(data, null, 2))
    } catch (err) {
      setApiResult(String(err))
    }
  }

  const doLogin = async () => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const text = await res.text()
      const data = safeParseJson(text)
      if (data && data.token) setToken(data.token)
      setApiResult(JSON.stringify(data, null, 2))
    } catch (err) {
      setApiResult(String(err))
    }
  }

  const createAluno = async () => {
    try {
      const res = await fetch(`${API_BASE}/alunos`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: Number(aluno.id), nome: aluno.nome, ra: aluno.ra, nota1: Number(aluno.nota1), nota2: Number(aluno.nota2) }),
      })
      const text = await res.text()
      const data = safeParseJson(text)
      setApiResult(JSON.stringify(data, null, 2))
    } catch (err) {
      setApiResult(String(err))
    }
  }

  const getMedias = async () => {
    try {
      const res = await fetch(`${API_BASE}/alunos/medias`, { mode: 'cors', headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
      const text = await res.text()
      const data = safeParseJson(text)
      setApiResult(JSON.stringify(data, null, 2))
    } catch (err) {
      setApiResult(String(err))
    }
  }

  const logout = () => {
    setToken('')
    localStorage.removeItem('token')
    setApiResult('')
  }

  // persist token
  if (!token) {
    const saved = localStorage.getItem('token')
    if (saved) setToken(saved)
  } else {
    localStorage.setItem('token', token)
  }

  // simple router: if no token show auth page, else show alunos page
  if (!token) {
    return (
      <div className="container">
        <h1>Autenticação</h1>
        <div className="server-ui">
          <h2>Registrar / Login</h2>
          <div className="form-row">
            <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
          </div>
          <div className="form-row">
            <button className="btn" onClick={doRegister}>Register</button>
            <button className="btn" onClick={doLogin}>Login</button>
          </div>
          <div className="api-result">{apiResult || 'Resultados aparecerão aqui'}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Menu de Alunos</h1>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', maxWidth: 900, margin: '8px auto' }}>
        <button className="btn secondary" onClick={logout}>Logout</button>
      </div>

      <div className="server-ui">
        <h2>Criar Aluno</h2>
        <div className="form-row">
          <input placeholder="id" value={aluno.id} onChange={(e) => setAluno({ ...aluno, id: e.target.value })} />
          <input placeholder="nome" value={aluno.nome} onChange={(e) => setAluno({ ...aluno, nome: e.target.value })} />
        </div>
        <div className="form-row">
          <input placeholder="ra" value={aluno.ra} onChange={(e) => setAluno({ ...aluno, ra: e.target.value })} />
          <input placeholder="nota1" value={aluno.nota1} onChange={(e) => setAluno({ ...aluno, nota1: e.target.value })} />
          <input placeholder="nota2" value={aluno.nota2} onChange={(e) => setAluno({ ...aluno, nota2: e.target.value })} />
          <button className="btn" onClick={createAluno}>Create</button>
        </div>

        <div className="form-row">
          <button className="btn" onClick={getMedias}>Get Medias</button>
        </div>

        <div className="api-result">{apiResult || 'Resultados aparecerão aqui'}</div>
      </div>
    </div>
  )
}
