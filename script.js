async function analyze() {
  const jd = document.getElementById("jd").value;
  const files = document.getElementById("files").files;
  const output = document.getElementById("output");

  output.innerHTML = "Analyzing resumes...";

  let results = [];

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

  results.sort((a,b)=> b.score - a.score);

  renderResults(results, output);
}


function renderResults(results, output) {

  output.innerHTML = `
    <h2 style="margin-bottom:25px">Candidate Ranking</h2>

    <table style="width:100%; border-collapse:collapse">
      <tr style="text-align:left;border-bottom:1px solid #333">
        <th style="padding:10px">Resume</th>
        <th style="padding:10px">Score</th>
        <th style="padding:10px">Decision</th>
      </tr>

      ${results.map(r => `
        <tr style="${rowColor(r.score)} border-bottom:1px solid #222">
          <td style="padding:10px">${r.name}</td>
          <td style="padding:10px">${r.score}%</td>
          <td style="padding:10px">${r.recommendation}</td>
        </tr>
      `).join("")}
    </table>
  `;
}


function rowColor(score){
  if(score >= 75) return "background:#10291b";
  if(score >= 50) return "background:#2a220f";
  return "background:#2a1212";
}