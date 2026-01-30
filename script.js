async function analyze() {
  const resume = document.getElementById("resume").value;
  const jd = document.getElementById("jd").value;

  document.getElementById("output").innerHTML = "Analyzing…";

  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume, jd })
  });

  const data = await res.json();

  document.getElementById("output").innerHTML = `
    <h3>Overall Match Score: ${data.match}%</h3>
    <p><strong>Strengths:</strong> ${data.strengths}</p>
    <p><strong>Gaps:</strong> ${data.gaps}</p>
    <p><strong>Suggestions:</strong> ${data.suggestions}</p>
  `;
}