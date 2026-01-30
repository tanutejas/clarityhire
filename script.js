async function analyze() {
  const resumeText = document.getElementById("resume").value;
  const jd = document.getElementById("jd").value;
  const files = document.getElementById("files").files;
  const output = document.getElementById("output");

  output.innerHTML = "Analyzing...";

  let tasks = [];

  // pasted resume
  if (resumeText.trim()) {
    tasks.push(
      analyzeOne("Pasted Resume", resumeText, jd)
    );
  }

  // uploaded files
  for (let file of files) {
    tasks.push(
      file.text().then(text =>
        analyzeOne(file.name, text, jd)
      )
    );
  }

  if (tasks.length === 0) {
    output.innerHTML = "Please paste resume or upload files.";
    return;
  }

  try {
    const results = await Promise.all(tasks);

    // sort highest score first
    results.sort((a,b)=> b.score - a.score);

    renderUI(results, output);

  } catch (e) {
    console.error(e);
    output.innerHTML = "Something went wrong.";
  }
}



/* =========================
   Analyze single resume
========================= */
async function analyzeOne(name, resume, jd) {

  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume, jd })
  });

  const data = await res.json();

  return {
    name,
    score: data.scores.overall,
    recommendation: data.hireRecommendation,
    explanation: data.explanation,
    scores: data.scores
  };
}



/* =========================
   Render UI
========================= */
function renderUI(results, output) {

  // single resume → show Apple dashboard
  if (results.length === 1) {
    renderSingle(results[0], output);
    return;
  }

  // multiple resumes → show ranking table
  renderTable(results, output);
}



/* =========================
   Apple style single view
========================= */
function renderSingle(r, output) {

  const score = r.score;

  let color = "#ef4444";
  if (score >= 75) color = "#22c55e";
  else if (score >= 50) color = "#f59e0b";

  output.innerHTML = `
    <div class="output">

      <div style="text-align:center;margin-bottom:40px">
        <div style="
          width:170px;
          height:170px;
          border-radius:50%;
          margin:auto;
          background:conic-gradient(${color} ${score}%, #333 ${score}%);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:30px;
          font-weight:bold;
        ">
          ${score}%
        </div>
        <p style="margin-top:12px;color:#aaa">Overall Match</p>
      </div>

      ${bar("Skills", r.scores.skills)}
      ${bar("Experience", r.scores.experience)}
      ${bar("Keywords", r.scores.keywords)}
      ${bar("Seniority", r.scores.seniority)}
      ${bar("Education", r.scores.education)}

      <div style="
        margin-top:30px;
        padding:20px;
        border-radius:14px;
        border:2px solid ${color};
      ">
        <h3>${r.recommendation}</h3>
        <p>${r.explanation}</p>
      </div>

    </div>
  `;
}



/* =========================
   Table for bulk resumes
========================= */
function renderTable(results, output) {

  output.innerHTML = `
    <h2 style="margin-bottom:20px">Candidate Ranking</h2>

    <table style="width:100%; border-collapse:collapse">
      <tr>
        <th style="text-align:left">Resume</th>
        <th>Score</th>
        <th>Decision</th>
      </tr>

      ${results.map(r => `
        <tr style="${rowColor(r.score)} border-bottom:1px solid #222">
          <td>${r.name}</td>
          <td>${r.score}%</td>
          <td>${r.recommendation}</td>
        </tr>
      `).join("")}
    </table>
  `;
}



/* =========================
   Helpers
========================= */

function bar(label, value){
  return `
    <div style="margin:12px 0">
      <div style="font-size:14px;margin-bottom:6px">${label}</div>
      <div style="height:8px;background:#333;border-radius:8px">
        <div style="height:100%;width:${value}%;background:#6cf;border-radius:8px"></div>
      </div>
    </div>
  `;
}

function rowColor(score){
  if(score >= 75) return "background:#10291b";
  if(score >= 50) return "background:#2a220f";
  return "background:#2a1212";
}