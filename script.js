const phases = [
  {
    title: "C++ Foundations",
    body: "Start here if C++ feels intimidating. Your job is to become comfortable writing, compiling, and debugging small programs.",
    bullets: [
      "Variables, functions, loops, conditionals",
      "Header files versus source files",
      "References and const correctness",
      "Vectors, arrays, strings, and structs",
      "Compiler flags: -std=c++20 -Wall -Wextra",
      "Debugging with print statements, gdb, or an IDE"
    ]
  },
  {
    title: "Modern C++",
    body: "This is where C++ becomes cleaner and safer. Modern C++ means using the language without constantly fighting memory bugs.",
    bullets: [
      "RAII: resources are acquired and released through object lifetime",
      "Smart pointers: unique_ptr and shared_ptr",
      "STL algorithms: sort, transform, accumulate",
      "Lambdas for concise transformations",
      "Templates for reusable numerical code",
      "Exceptions, optional, variant, and error boundaries"
    ]
  },
  {
    title: "Numerical Finance",
    body: "Translate financial theory into precise, testable code. This layer makes your projects portfolio-ready.",
    bullets: [
      "Simple returns and log returns",
      "Volatility, covariance, and correlation",
      "Sharpe ratio, beta, max drawdown",
      "Black-Scholes and Greeks",
      "Binomial trees and Monte Carlo pricing",
      "VaR, CVaR, and stress tests"
    ]
  },
  {
    title: "Quant Engineering",
    body: "Quant finance is not just formulas. You need robust systems that can ingest data, run experiments, and avoid false signals.",
    bullets: [
      "CSV and market-data parsing",
      "Backtesting architecture",
      "Transaction costs and slippage",
      "Performance profiling and cache-aware layout",
      "Unit tests for pricing and risk functions",
      "Clean project structure with CMake"
    ]
  }
];

const detail = document.getElementById("phase-detail");
const phaseCards = document.querySelectorAll(".phase");

function renderPhase(index) {
  const phase = phases[index];
  detail.innerHTML = `
    <p class="eyebrow">Phase ${String(index + 1).padStart(2, "0")}</p>
    <h3>${phase.title}</h3>
    <p>${phase.body}</p>
    <ul>${phase.bullets.map(item => `<li>${item}</li>`).join("")}</ul>
  `;

  phaseCards.forEach(card => card.classList.remove("active"));
  phaseCards[index].classList.add("active");
}

phaseCards.forEach(card => {
  card.addEventListener("click", () => renderPhase(Number(card.dataset.phase)));
});

renderPhase(0);

document.querySelectorAll(".acc-item button").forEach(button => {
  button.addEventListener("click", () => {
    button.parentElement.classList.toggle("open");
  });
});

function calculateReturns(prices) {
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1);
  return { returns, mean, vol: Math.sqrt(variance) };
}

const output = document.getElementById("calcOutput");
const pricesInput = document.getElementById("prices");

function runCalc() {
  const prices = pricesInput.value
    .split(",")
    .map(x => Number(x.trim()))
    .filter(x => Number.isFinite(x));

  if (prices.length < 3) {
    output.textContent = "Enter at least three valid prices.";
    return;
  }

  const result = calculateReturns(prices);
  output.textContent =
`prices: [${prices.join(", ")}]

simple returns:
${result.returns.map(r => (r * 100).toFixed(2) + "%").join("   ")}

average return: ${(result.mean * 100).toFixed(3)}%
sample volatility: ${(result.vol * 100).toFixed(3)}%

quant note:
Volatility here is sample standard deviation of returns. In a real project, annualize it based on frequency, e.g. daily volatility × sqrt(252).`;
}

document.getElementById("runCalc").addEventListener("click", runCalc);
runCalc();

const cppSnippet = `#include <vector>
#include <numeric>
#include <cmath>

std::vector<double> simple_returns(const std::vector<double>& prices) {
  std::vector<double> r;
  for (size_t i = 1; i < prices.size(); ++i) {
    r.push_back((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  return r;
}`;

document.getElementById("copyCpp").addEventListener("click", async () => {
  await navigator.clipboard.writeText(cppSnippet);
  output.textContent = "Copied C++ snippet to clipboard. Paste it into quant_engine.cpp.";
});

const quiz = [
  {
    q: "Which C++ type is usually preferred for financial calculations?",
    a: ["int", "float", "double", "char"],
    correct: 2,
    explain: "double is commonly used because it gives better precision than float."
  },
  {
    q: "What does RAII help manage?",
    a: ["Interest rates", "Resource lifetime", "Market sentiment", "CSV column names"],
    correct: 1,
    explain: "RAII ties resource cleanup to object lifetime, making C++ safer."
  },
  {
    q: "What is a common way to estimate volatility from returns?",
    a: ["String length", "Sample standard deviation", "Header count", "Pointer address"],
    correct: 1,
    explain: "Volatility is often estimated as the standard deviation of returns."
  },
  {
    q: "Why is C++ popular in quantitative finance?",
    a: ["It is always easier than Python", "It is low-latency and high-performance", "It removes all math", "It cannot crash"],
    correct: 1,
    explain: "C++ is used when speed, control, and predictable performance matter."
  }
];

let questionIndex = 0;
const qEl = document.getElementById("question");
const ansEl = document.getElementById("answers");
const feedback = document.getElementById("quizFeedback");

function renderQuestion() {
  const item = quiz[questionIndex];
  qEl.textContent = item.q;
  ansEl.innerHTML = "";
  feedback.textContent = "";

  item.a.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.className = "answer";
    btn.textContent = answer;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".answer").forEach(b => b.disabled = true);
      btn.classList.add(index === item.correct ? "correct" : "wrong");
      feedback.textContent = index === item.correct ? "Correct. " + item.explain : "Not quite. " + item.explain;
    });
    ansEl.appendChild(btn);
  });
}

document.getElementById("nextQuestion").addEventListener("click", () => {
  questionIndex = (questionIndex + 1) % quiz.length;
  renderQuestion();
});

renderQuestion();
