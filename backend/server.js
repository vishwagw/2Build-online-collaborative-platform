const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API: Profiles
app.get('/api/profiles', (req, res) => {
  const rows = db.prepare('SELECT * FROM profiles').all();
  res.json(rows.map(r => ({...r, skills: r.skills ? r.skills.split(',') : [] })));
});

app.post('/api/profiles', (req, res) => {
  const { name, role, skills = [], bio } = req.body;
  const stmt = db.prepare('INSERT INTO profiles (name, role, skills, bio) VALUES (?, ?, ?, ?)');
  const info = stmt.run(name, role || '', skills.join(','), bio || '');
  res.json({ id: info.lastInsertRowid });
});

// API: Projects
app.get('/api/projects', (req, res) => {
  const rows = db.prepare('SELECT * FROM projects').all();
  res.json(rows.map(r => ({...r, required_skills: r.required_skills ? r.required_skills.split(',') : [] })));
});

app.post('/api/projects', (req, res) => {
  const { title, description, required_skills = [], equity_offered = 0 } = req.body;
  const stmt = db.prepare('INSERT INTO projects (title, description, required_skills, equity_offered) VALUES (?, ?, ?, ?)');
  const info = stmt.run(title, description || '', required_skills.join(','), equity_offered);
  res.json({ id: info.lastInsertRowid });
});

// Simple match endpoint: given a profile id, score projects by overlapping skills
app.get('/api/match', (req, res) => {
  const profileId = Number(req.query.profileId);
  if (!profileId) return res.status(400).json({ error: 'profileId required' });

  const profile = db.prepare('SELECT * FROM profiles WHERE id = ?').get(profileId);
  if (!profile) return res.status(404).json({ error: 'profile not found' });

  const pSkills = (profile.skills || '').split(',').map(s => s.trim()).filter(Boolean);
  const projects = db.prepare('SELECT * FROM projects').all();

  const scored = projects.map(proj => {
    const rSkills = (proj.required_skills || '').split(',').map(s => s.trim()).filter(Boolean);
    const common = pSkills.filter(s => rSkills.includes(s));
    const score = rSkills.length ? common.length / rSkills.length : 0;
    return { ...proj, required_skills: rSkills, score };
  }).sort((a,b) => b.score - a.score);

  res.json(scored);
});

// Serve frontend static if built
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({error:'not found'});
  res.sendFile(path.join(distPath, 'index.html'), err => {
    if (err) res.status(404).send('Not found');
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
