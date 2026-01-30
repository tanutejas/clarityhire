async function analyzeResume() {
  const resume = document.getElementById("resume").value;
  const jd = document.getElementById("jd").value;

  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume, jd }),
  });

  const data = await res.json();

  document.getElementById("score").innerText =
    data.overallScore + "%";

  document.getElementById("strengths").innerHTML =
    data.strengths.map(s => `<li>${s}</li>`).join("");

  document.getElementById("gaps").innerHTML =
    data.gaps.map(g => `<li>${g}</li>`).join("");

  document.getElementById("suggestions").innerHTML =
    data.suggestions.map(s => `<li>${s}</li>`).join("");
}