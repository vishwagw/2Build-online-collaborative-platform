import React, { useEffect, useState } from 'react'
import api from './api'

export default function App() {
  const [profiles, setProfiles] = useState([])
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState({})

  useEffect(() => { fetchData() }, [])

  async function fetchData(){
    const p = await api.get('/profiles')
    const pr = await api.get('/projects')
    setProfiles(p.data)
    setProjects(pr.data)
  }

  async function addProfile(e){
    e.preventDefault()
    await api.post('/profiles', { ...form, skills: (form.skills||'').split(',').map(s=>s.trim()) })
    setForm({})
    fetchData()
  }

  async function match(profileId){
    const res = await api.get(`/match?profileId=${profileId}`)
    alert('Top match:\n' + res.data.slice(0,5).map(m=>`${m.title} (score ${m.score.toFixed(2)})`).join('\n'))
  }

  return (
    <div className="container">
      <header>
        <h1>2-Build — Connect founders, freelancers & collaborators</h1>
      </header>

      <section className="panel">
        <h2>Create Profile</h2>
        <form onSubmit={addProfile}>
          <input placeholder="Name" value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})} />
          <input placeholder="Role (e.g. Developer)" value={form.role||''} onChange={e=>setForm({...form,role:e.target.value})} />
          <input placeholder="Skills (comma separated)" value={form.skills||''} onChange={e=>setForm({...form,skills:e.target.value})} />
          <textarea placeholder="Bio" value={form.bio||''} onChange={e=>setForm({...form,bio:e.target.value})}></textarea>
          <button type="submit">Add Profile</button>
        </form>
      </section>

      <section className="panel">
        <h2>Profiles</h2>
        {profiles.length===0 && <p>No profiles yet.</p>}
        <ul>
          {profiles.map(p=> (
            <li key={p.id}>
              <strong>{p.name}</strong> — {p.role} — { (p.skills||[]).join(', ') }
              <button onClick={()=>match(p.id)}>Find Matches</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Projects</h2>
        {projects.length===0 && <p>No projects yet. Use API to create projects.</p>}
        <ul>
          {projects.map(pr => (
            <li key={pr.id}><strong>{pr.title}</strong> — { (pr.required_skills||[]).join(', ') }</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
