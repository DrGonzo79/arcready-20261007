"use client";

import {useMemo, useState} from "react";
import fixture from "../data/demo_rules.json";

type ProjectType = "Fence" | "Patio" | "Solar";
type Finding = {id: string; title: string; detail: string; severity: string};

function screenProject(type: ProjectType, height: number, material: string, sharedLine: boolean) {
  const findings = fixture.rules.filter((rule) => rule.category === "All" || rule.category === type) as Finding[];
  const blockers: string[] = [];
  if (type === "Fence" && height > 6) blockers.push("Reduce fence height to 6 ft or request a variance.");
  if (type === "Fence" && !["cedar", "composite", "wrought iron"].includes(material.toLowerCase())) blockers.push("Choose an approved fence material.");
  if (sharedLine && type === "Fence") blockers.push("Collect neighbor acknowledgment before submission.");
  const required = ["Labeled site plan with dimensions", "Color photo of project area", "Owner signature"];
  if (type === "Fence") required.push("Fence elevation and material sample");
  if (sharedLine) required.push("Adjacent owner acknowledgment");
  return {findings, blockers, required};
}

export default function Home() {
  const [type, setType] = useState<ProjectType>("Fence");
  const [height, setHeight] = useState("6");
  const [material, setMaterial] = useState("Cedar");
  const [sharedLine, setSharedLine] = useState(true);
  const [result, setResult] = useState<ReturnType<typeof screenProject> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState<string[]>([]);
  const numericHeight = Number(height);
  const progress = result ? Math.round((checked.length / result.required.length) * 100) : 0;
  const status = useMemo(() => !result ? "Not screened" : result.blockers.length ? "Action needed" : "Ready to package", [result]);

  function runScreen() {
    setError("");
    if (!height || Number.isNaN(numericHeight) || numericHeight < 1 || numericHeight > 12) {
      setError("Enter a height from 1 to 12 feet.");
      return;
    }
    if (type === "Fence" && !material.trim()) {
      setError("Enter a proposed material.");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      setResult(screenProject(type, numericHeight, material, sharedLine));
      setChecked([]);
      setLoading(false);
    }, 350);
  }

  function toggle(item: string) {
    setChecked((items) => items.includes(item) ? items.filter((value) => value !== item) : [...items, item]);
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="ArcReady home"><span>AR</span> ArcReady</a>
        <div className="demo-pill">Fictional demo data</div>
      </header>
      <section className="hero" id="top">
        <div>
          <p className="eyebrow">ARCHITECTURAL REVIEW WORKSPACE</p>
          <h1>Know what your HOA needs<br/>before you submit.</h1>
          <p className="lede">Screen a home project against cited community rules, resolve blockers, and assemble a clean approval packet.</p>
        </div>
        <div className="community-card">
          <p>Demo community</p><strong>{fixture.community}</strong><small>Rules updated {fixture.updated}</small>
        </div>
      </section>

      <section className="workspace" aria-label="Project screening workspace">
        <aside className="steps" aria-label="Workflow steps">
          <p className="eyebrow">APPLICATION 0142</p>
          <ol><li className="active"><b>1</b><span>Describe project<small>Current step</small></span></li><li><b>2</b><span>Review rules<small>{status}</small></span></li><li><b>3</b><span>Build packet<small>{progress}% complete</small></span></li></ol>
          <div className="notice"><strong>Demo boundary</strong><p>Results are simulated from fictional fixtures. ArcReady is not legal advice and does not submit to an HOA or city.</p></div>
        </aside>

        <div className="panel">
          <div className="panel-head"><div><p className="eyebrow">STEP 1 OF 3</p><h2>Describe the project</h2></div><span className={`status ${result?.blockers.length ? "warn" : result ? "good" : ""}`}>{status}</span></div>
          <div className="form-grid">
            <label>Project type<select value={type} onChange={(event) => {setType(event.target.value as ProjectType); setResult(null);}}><option>Fence</option><option>Patio</option><option>Solar</option></select></label>
            <label>Height / profile (feet)<input inputMode="decimal" value={height} onChange={(event) => setHeight(event.target.value)} aria-describedby="height-help"/><small id="height-help">Fence limit in demo rules: 6 ft</small></label>
            <label>Primary material<input value={material} onChange={(event) => setMaterial(event.target.value)} disabled={type !== "Fence"}/></label>
            <label className="check"><input type="checkbox" checked={sharedLine} onChange={(event) => setSharedLine(event.target.checked)}/><span>Touches a shared property line</span></label>
          </div>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="primary" onClick={runScreen} disabled={loading}>{loading ? "Screening rules…" : "Screen project"}</button>

          {!result && <div className="empty"><div>⌁</div><h3>No screen yet</h3><p>Complete the project details, then run the rules screen to see citations and packet requirements.</p></div>}
          {result && <div className="results" aria-live="polite">
            <div className="summary-row"><div><small>RULES FOUND</small><strong>{result.findings.length}</strong></div><div><small>BLOCKERS</small><strong>{result.blockers.length}</strong></div><div><small>PACKET</small><strong>{progress}%</strong></div></div>
            {result.blockers.length > 0 ? <section className="blockers"><h3>Resolve before submission</h3>{result.blockers.map((item) => <p key={item}>! <span>{item}</span></p>)}</section> : <section className="clear"><h3>✓ No rule conflicts detected</h3><p>Confirm the cited rules and complete the packet checklist.</p></section>}
            <section><div className="section-title"><h3>Cited community rules</h3><small>Fictional fixture</small></div>{result.findings.map((finding) => <article className="rule" key={finding.id}><span>{finding.id}</span><div><strong>{finding.title}</strong><p>{finding.detail}</p></div></article>)}</section>
            <section><div className="section-title"><h3>Packet checklist</h3><small>{checked.length} of {result.required.length} ready</small></div>{result.required.map((item) => <label className="task" key={item}><input type="checkbox" checked={checked.includes(item)} onChange={() => toggle(item)}/><span>{item}</span></label>)}</section>
          </div>}
        </div>
      </section>
      <footer><strong>ArcReady prototype</strong><span>Frontend-only static demo · Python rule engine included as runnable source</span></footer>
    </main>
  );
}
