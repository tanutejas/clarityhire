async function analyze() {

  const resume = document.getElementById("resume").value;
  const jd = document.getElementById("jd").value;
  const output = document.getElementById("output");

  output.innerHTML = "Analyzing...";

  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume, jd })
    });

    const data = await res.json();

    output.innerHTML = `
      <h2>Score: ${data.scores.overall}%</h2>
      <p>${data.hireRecommendation}</p>
      <p>${data.explanation}</p>
    `;

  } catch (e) {
    output.innerHTML = "Error occurred";
    console.error(e);
  }
}