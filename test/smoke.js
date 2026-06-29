const API = 'http://localhost:3000'

async function run() {
  try {
    console.log('Registering testuser')
    let res = await fetch(`${API}/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'testuser', password: 'pwd' }) })
    console.log('register status', res.status)
    console.log(await res.text())

    console.log('Logging in')
    res = await fetch(`${API}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'testuser', password: 'pwd' }) })
    const body = await res.json()
    console.log('login status', res.status, body)
    const token = body.token

    console.log('Creating aluno')
    res = await fetch(`${API}/alunos`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ id: 100, nome: 'Aluno Teste', ra: 'RA100', nota1: 6, nota2: 7 }) })
    console.log('create aluno status', res.status)
    console.log(await res.text())

    console.log('Getting medias')
    res = await fetch(`${API}/alunos/medias`, { headers: { Authorization: `Bearer ${token}` } })
    console.log('medias status', res.status)
    console.log(await res.text())
  } catch (err) {
    console.error('error', err)
  }
}

run()
