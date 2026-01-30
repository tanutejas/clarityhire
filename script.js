async function analyze() {
  alert("clicked");

  const resume = document.getElementById("resume").value;
  const jd = document.getElementById("jd").value;

  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume, jd })
  });

  const data = await res.json();

  alert(JSON.stringify(data));
}