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

  renderTable(results, output);
}

function renderTable(results, output) {
  output.innerHTML = `
    <h2 style="margin-bottom:20px">Candidate Ranking</h2>
    <table style="width:100%; border-collapse:collapse">
      <tr>
        <th>Name</th>
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