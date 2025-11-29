<<<<<<< HEAD
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
=======
 import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

/* Simple inline styles to keep things readable */
const container = { maxWidth: 900, margin: "20px auto", fontFamily: "Arial, sans-serif", padding: 16 };
const nav = { display: "flex", gap: 12, marginBottom: 16 };
const card = { border: "1px solid #ddd", padding: 12, borderRadius: 6, marginBottom: 12 };

/* Demo initial data */
const DEMO_USERS = [
  { id: "user1", password: "userpass", name: "Student One", role: "user", enrolled: ["renewable-energy"] },
  { id: "admin", password: "adminpass", name: "Admin", role: "admin" },
];
const DEMO_COURSES = [
  { id: "renewable-energy", title: "Renewable Energy Basics", description: "Learn about solar, wind and simple projects.", topics: ["Solar", "Wind", "Hydro"] },
  { id: "waste-reduction", title: "Waste Reduction & Recycling", description: "Reduce, reuse, recycle at home and school.", topics: ["Reduce", "Reuse", "Recycle"] },
];

/* localStorage helpers */
function ensureDemo() {
  if (!localStorage.getItem("fed_init")) {
    localStorage.setItem("fed_users", JSON.stringify(DEMO_USERS));
    localStorage.setItem("fed_courses", JSON.stringify(DEMO_COURSES));
    localStorage.setItem("fed_submissions", JSON.stringify([]));
    localStorage.setItem("fed_progress", JSON.stringify([]));
    localStorage.setItem("fed_init", "1");
  }
}
function read(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}
function write(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

/* Basic auth hook (stores user in localStorage) */
function useAuth() {
  const [user, setUser] = useState(() => read("fed_current_user", null));
  useEffect(() => write("fed_current_user", user), [user]);
  return { user, setUser };
}

/* App */
export default function App() {
  ensureDemo();
  const auth = useAuth();
  return (
    <Router>
      <div style={container}>
        <Header user={auth.user} setUser={auth.setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={auth.setUser} />} />
          <Route path="/courses" element={<RequireAuth user={auth.user}><Courses user={auth.user} /></RequireAuth>} />
          <Route path="/course/:id" element={<RequireAuth user={auth.user}><Course user={auth.user} /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth user={auth.user} adminOnly><Admin /></RequireAuth>} />
          <Route path="/admin/projects" element={<RequireAuth user={auth.user} adminOnly><AdminProjects /></RequireAuth>} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

/* Header */
function Header({ user, setUser }) {
  const navigate = useNavigate();
  function logout() { setUser(null); navigate("/"); }
  return (
    <div style={nav}>
      <Link to="/">Home</Link>
      <Link to="/courses">Courses</Link>
      <Link to="/admin">Admin</Link>
      <div style={{ marginLeft: "auto" }}>
        {user ? (
          <>
            <span style={{ marginRight: 10 }}>{user.name} ({user.role})</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : <Link to="/login">Login</Link>}
      </div>
    </div>
  );
}

/* Home */
function Home() {
  return (
    <div>
      <h2>fed — Sustainable Living Education</h2>
      <p>Learn about renewable energy, waste reduction, and eco-friendly choices.</p>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ ...card, flex: 1 }}>
          <h4>React Hooks</h4>
          <p>Interactive UI built with hooks.</p>
        </div>
        <div style={{ ...card, flex: 1 }}>
          <h4>Routing & Navigation</h4>
          <p>Pages for users and admin.</p>
        </div>
      </div>
    </div>
  );
}

/* Login */
function Login({ setUser }) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    const users = read("fed_users", []);
    const found = users.find(u => u.id === id && u.password === pw);
    if (!found) { setErr("Invalid credentials"); return; }
    const safe = { id: found.id, name: found.name, role: found.role, enrolled: found.enrolled || [] };
    setUser(safe);
    if (found.role === "admin") navigate("/admin");
    else navigate("/courses");
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <h3>Login</h3>
      <form onSubmit={submit} style={{ display: "grid", gap: 8 }}>
        <label>User ID<input value={id} onChange={e=>setId(e.target.value)} /></label>
        <label>Password<input type="password" value={pw} onChange={e=>setPw(e.target.value)} /></label>
        <button type="submit">Login</button>
        {err && <div style={{ color: "red" }}>{err}</div>}
        <div style={{ fontSize: 12, marginTop: 8 }}>
          Demo: user1/userpass (user) — admin/adminpass (admin)
        </div>
      </form>
    </div>
  );
}

/* Auth wrapper */
function RequireAuth({ children, user, adminOnly = false }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate("/login");
    else if (adminOnly && user.role !== "admin") navigate("/courses");
  }, [user, adminOnly, navigate]);
  if (!user) return null;
  if (adminOnly && user.role !== "admin") return null;
  return children;
}

/* User: Courses list / enroll */
function Courses({ user }) {
  const all = read("fed_courses", []);
  return (
    <div>
      <h3>Your Courses</h3>
      {(user.enrolled || []).length === 0 ? <p>No enrollments yet.</p> : (
        (all.filter(c => (user.enrolled||[]).includes(c.id)).map(c => (
          <div key={c.id} style={card}><h4>{c.title}</h4><p>{c.description}</p><Link to={`/course/${c.id}`}>Open</Link></div>
        )))
      )}
      <h3>All Courses</h3>
      {all.map(c => (
        <div key={c.id} style={card}>
          <h4>{c.title}</h4><p>{c.description}</p>
          {(user.enrolled||[]).includes(c.id) ? <span>Enrolled</span> : <Enroll user={user} courseId={c.id} />}
        </div>
      ))}
    </div>
  );
}
function Enroll({ user, courseId }) {
  const navigate = useNavigate();
  function doEnroll() {
    const users = read("fed_users", []);
    const updated = users.map(u => u.id === user.id ? ({ ...u, enrolled: Array.from(new Set([...(u.enrolled||[]), courseId])) }) : u);
    write("fed_users", updated);
    const cur = read("fed_current_user", null);
    if (cur && cur.id === user.id) { cur.enrolled = Array.from(new Set([...(cur.enrolled||[]), courseId])); write("fed_current_user", cur); }
    navigate("/courses");
  }
  return <button onClick={doEnroll}>Enroll</button>;
}

/* Course page with quiz/project logging */
function Course() {
  const { id } = useParams();
  const all = read("fed_courses", []);
  const course = all.find(c => c.id === id);
  const user = read("fed_current_user", null);
  const [answer, setAnswer] = useState("");
  const [project, setProject] = useState("");
  const [msg, setMsg] = useState("");

  if (!course) return <div>Course not found</div>;

  function submitQuiz() {
    const p = read("fed_progress", []); p.push({ userId: user.id, courseId: id, type: "quiz", answer, time: Date.now() }); write("fed_progress", p);
    setMsg("Quiz logged"); setAnswer("");
  }
  function submitProject() {
    const s = read("fed_submissions", []); s.push({ id: "s"+Math.random().toString(36).slice(2), courseId: id, userId: user.id, content: project, status: "submitted", time: Date.now() }); write("fed_submissions", s);
    setMsg("Project submitted"); setProject("");
  }

  return (
    <div>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <h4>Topics</h4><ul>{course.topics.map(t => <li key={t}>{t}</li>)}</ul>

      <div style={card}>
        <h5>Quick quiz</h5>
        <p>Q: Name one renewable energy source.</p>
        <input value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Your answer" />
        <div style={{ marginTop: 8 }}><button onClick={submitQuiz}>Submit</button></div>
      </div>

      <div style={card}>
        <h5>Project</h5>
        <textarea value={project} onChange={e=>setProject(e.target.value)} rows={4} style={{ width: "100%" }} placeholder="Describe your project"></textarea>
        <div style={{ marginTop: 8 }}><button onClick={submitProject}>Submit project</button></div>
      </div>

      {msg && <div style={{ color: "green" }}>{msg}</div>}
    </div>
  );
}

/* Admin pages */
function Admin() {
  const courses = read("fed_courses", []);
  return (
    <div>
      <h3>Admin Dashboard</h3>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <h4>Courses</h4>
          {courses.map(c => <div key={c.id} style={card}><h5>{c.title}</h5><p>{c.description}</p></div>)}
        </div>
        <div style={{ flex: 1 }}>
          <h4>Project evaluation</h4>
          <Link to="/admin/projects">Open submissions</Link>
        </div>
      </div>
    </div>
  );
}
function AdminProjects() {
  const [subs, setSubs] = useState(() => read("fed_submissions", []));
  function grade(subId) {
    const g = prompt("Enter grade/feedback (e.g. A / Good work):");
    if (g == null) return;
    const updated = subs.map(s => s.id === subId ? ({ ...s, status: "graded", feedback: g }) : s);
    setSubs(updated); write("fed_submissions", updated); alert("Saved");
  }
  return (
    <div>
      <h3>Submissions</h3>
      {subs.length === 0 ? <p>No submissions</p> : subs.map(s => (
        <div key={s.id} style={card}>
          <div><strong>{s.userId}</strong> — {s.courseId} — {new Date(s.time).toLocaleString()}</div>
          <div style={{ marginTop: 8 }}>{s.content}</div>
          <div style={{ marginTop: 8 }}>Status: {s.status} {s.feedback ? ` — ${s.feedback}` : ""}</div>
          <div style={{ marginTop: 8 }}><button onClick={()=>grade(s.id)}>Grade / Feedback</button></div>
        </div>
      ))}
    </div>
  );
}

>>>>>>> 2780a8bf50a9293e7aba9411fb84f3aebbaf6cd0
