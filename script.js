async function analyze() {
  const jd = document.getElementById("jd").value;
  const resumeText = document.getElementById("resume").value;
  const files = document.getElementById("files").files;
  const output = document.getElementById("output");

  output.innerHTML = "Analyzing...";

  let results = [];

  // pasted resume
  if (resumeText.trim().length > 0) {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume: resumeText, jd })
    });

    const data = await res.json();

    results.push({
      name: "Pasted Resume",
      score: data.scores.overall,
      recommendation: data.hireRecommendation
    });
  }

  // uploaded files
  for (let file of files) {
    const text = await file.text();

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume: text, jd })
    });

    const data = await res.json();

    results.push({
      name: file.name,
      score: data.scores.overall,
      recommendation: data.hireRecommendation
    });
  }

  if (results.length === 0) {
    output.innerHTML = "Please paste resume or upload files.";
    return;
  }

  results.sort((a,b)=> b.score - a.score);

  // render directly (NO external function to avoid bugs)
  output.innerHTML = `
    <h2>Candidate Ranking</h2>
    <table style="width:100%; border-collapse:collapse; margin-top:20px;">
      <tr>
        <th style="text-align:left">Resume</th>
        <th>Score</th>
        <th>Decision</th>
      </tr>
      ${results.map(r => `
        <tr>
          <td>${r.name}</td>
          <td>${r.score}%</td>
          <td>${r.recommendation}</td>
        </tr>
      `).join("")}
    </table>
  `;
}