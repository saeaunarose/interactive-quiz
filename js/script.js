console.log("script.js connected!");

// Store selected points by question id
const answers = {}; // e.g., { q1: 4, q2: 3, ... }

// Category mapping by total points (example from your instructions)
function categorize(total) {
  if (total >= 4 && total <= 6)  return { name: "Explorer",  variant: "info",    gif: "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif" };
  if (total >= 7 && total <= 9)  return { name: "Artist",    variant: "primary", gif: "https://media.giphy.com/media/l0ExncehJzexFpRHq/giphy.gif" };
  if (total >= 10 && total <= 12) return { name: "Leader",    variant: "success", gif: "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif" };
  if (total >= 13 && total <= 16) return { name: "Thinker",   variant: "warning", gif: "https://media.giphy.com/media/xUPGcyi4YxcZp8dWZq/giphy.gif" };
  return { name: "Uncategorized", variant: "secondary", gif: "" };
}

// Wire up the quiz
function initQuiz() {
  const blocks = document.querySelectorAll(".question-block");

  blocks.forEach(block => {
    const qid = block.id; // q1, q2, ...
    const buttons = block.querySelectorAll(".answer-btn");

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        // remove .selected from all buttons in this block
        buttons.forEach(b => b.classList.remove("selected"));

        // add .selected to clicked button
        btn.classList.add("selected");

        // store the points
        const pts = Number(btn.dataset.points);
        answers[qid] = pts;

        // For debugging:
        console.log(`Selected ${qid}: +${pts} points`);
      });
    });
  });

  // Submit button -> compute & display result
  document.getElementById("submit-btn").addEventListener("click", displayResult);

  // Reset behavior
  document.getElementById("reset-link").addEventListener("click", (e) => {
    e.preventDefault();
    Object.keys(answers).forEach(k => delete answers[k]);
    document.querySelectorAll(".answer-btn").forEach(b => b.classList.remove("selected"));
    const result = document.getElementById("result-container");
    const media  = document.getElementById("result-media");
    result.className = "alert d-none";
    result.textContent = "";
    media.innerHTML = "";
    console.info("Quiz reset");
  });
}

// Step 9: tally + show result
function displayResult() {
  const totalQuestions = document.querySelectorAll(".question-block").length;

  // Check if user answered all
  if (Object.keys(answers).length < totalQuestions) {
    const missing = totalQuestions - Object.keys(answers).length;
    const result = document.getElementById("result-container");
    result.className = "alert alert-secondary";
    result.textContent = `Please answer all questions (${missing} left).`;
    return;
  }

  // Sum up points
  const total = Object.values(answers).reduce((sum, n) => sum + n, 0);
  const cat = categorize(total);

  const result = document.getElementById("result-container");
  const media  = document.getElementById("result-media");
  result.className = `alert alert-${cat.variant}`;
  result.innerHTML = `<strong>${cat.name}</strong><br>Total points: ${total}`;
  media.innerHTML = cat.gif ? `<img src="${cat.gif}" class="img-fluid rounded mt-2" alt="${cat.name}">` : "";
}

// Run now or wait for DOM (covers all load orders)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initQuiz);
} else {
  initQuiz();
}
