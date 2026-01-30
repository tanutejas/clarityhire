async function analyze() {
  const resume = document.getElementById("resume").value;
  const jd = document.getElementById("jd").value;

  const output = document.getElementById("output");

  output.innerHTML = "Analyzing...";

  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume, jd })
  });

  const data = await res.json();

  console.log(data);

  const score = data.scores.overall;

  let color = "#ef4444";
  if (score >= 75) color = "#22c55e";
  else if (score >= 50) color = "#f59e0b";

  output.innerHTML = `
    <div style="padding:40px;background:#111;border-radius:20px;margin-top:40px">

      <div style="text-align:center;margin-bottom:40px">
        <div style="
          width:150px;
          height:150px;
          border-radius:50%;
          margin:auto;
          background:conic-gradient(${color} ${score}%, #333 ${score}%);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:28px;
          font-weight:bold;
        ">
          ${score}%
        </div>
        <p style="margin-top:10px;color:#aaa">Overall Match</p>
      </div>

      ${bar("Skills", data.scores.skills)}
      ${bar("Experience", data.scores.experience)}
      ${bar("Keywords", data.scores.keywords)}
      ${bar("Seniority", data.scores.seniority)}
      ${bar("Education", data.scores.education)}

      <h3 style="margin-top:40px">Missing Skills</h3>
      <ul>${data.missingCriticalSkills.map(x => `<li>${x}</li>`).join("")}</ul>

      <h3>Risk Flags</h3>
      <ul>${data.riskFlags.map(x => `<li>${x}</li>`).join("")}</ul>

      <div style="
        margin-top:30px;
        padding:20px;
        border-radius:12px;
        border:2px solid ${color};
      ">
        <h3>${data.hireRecommendation}</h3>
        <p>${data.explanation}</p>
      </div>

    </div>
  `;
}


function bar(label, value) {
  return `
    <div style="margin:14px 0">
      <div style="font-size:14px;margin-bottom:6px">${label}</div>
      <div style="height:8px;background:#333;border-radius:8px">
        <div style="height:100%;width:${value}%;background:#6cf;border-radius:8px"></div>
      </div>
    </div>
  `;
}