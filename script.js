async function analyze() {
  const jd = document.getElementById("jd").value;
  const resumeText = document.getElementById("resume").value;
  const files = document.getElementById("files").files;
  const output = document.getElementById("output");

  output.innerHTML = "Analyzing...";

  let results = [];

  // If pasted resume exists
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

  // If files uploaded
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

  // Nothing provided
  if (results.length === 0) {
    output.innerHTML = "Please paste resume or upload files.";
    return;
  }

  results.sort((a,b)=> b.score - a.score);

  renderResults(results, output);
}