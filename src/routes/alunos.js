const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const alunos = require('../data/alunos');

router.use(auth);

// 1. GET /alunos/medias
router.get('/medias', (req, res) => {
  try {
    const result = alunos.map((a) => ({ nome: a.nome, media: (Number(a.nota1) + Number(a.nota2)) / 2 }));
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
});

// 2. GET /alunos/aprovados
router.get('/aprovados', (req, res) => {
  try {
    const result = alunos.map((a) => {
      const media = (Number(a.nota1) + Number(a.nota2)) / 2;
      return { nome: a.nome, status: media >= 6 ? 'aprovado' : 'reprovado' };
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
});

// 3. GET /alunos/:id
router.get('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const aluno = alunos.find((a) => a.id === id);
    if (!aluno) return res.status(404).json({ message: 'Aluno não encontrado.' });
    return res.status(200).json(aluno);
  } catch (error) {
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
});

// GET /alunos (all)
router.get('/', (req, res) => {
  try {
    return res.status(200).json(alunos);
  } catch (error) {
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
});

// POST /alunos
router.post('/', (req, res) => {
  try {
    const { id, nome, ra, nota1, nota2 } = req.body;
    if (typeof id !== 'number') return res.status(400).json({ message: 'Campo id deve ser Number.' });

    const exists = alunos.find((a) => a.id === id);
    if (exists) return res.status(409).json({ message: 'Aluno com esse id já existe.' });

    const novo = { id, nome, ra, nota1: Number(nota1), nota2: Number(nota2) };
    alunos.push(novo);
    return res.status(201).json(novo);
  } catch (error) {
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
});

// PUT /alunos/:id
router.put('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const aluno = alunos.find((a) => a.id === id);
    if (!aluno) return res.status(404).json({ message: 'Aluno não encontrado.' });

    const { nome, ra, nota1, nota2 } = req.body;
    if (nome !== undefined) aluno.nome = nome;
    if (ra !== undefined) aluno.ra = ra;
    if (nota1 !== undefined) aluno.nota1 = Number(nota1);
    if (nota2 !== undefined) aluno.nota2 = Number(nota2);

    return res.status(200).json(aluno);
  } catch (error) {
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
});

// DELETE /alunos/:id
router.delete('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const index = alunos.findIndex((a) => a.id === id);
    if (index === -1) return res.status(404).json({ message: 'Aluno não encontrado.' });

    const removed = alunos.splice(index, 1);
    return res.status(200).json({ message: 'Aluno removido.', aluno: removed[0] });
  } catch (error) {
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
});

module.exports = router;
