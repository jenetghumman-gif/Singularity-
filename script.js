const tracks = {
  cppTrack: [
    {
      id: "cpp-foundations",
      num: "01",
      title: "C++ Foundations: syntax, compilation, and program structure",
      level: "Beginner",
      time: "4–6 hours",
      project: "Build a command-line return calculator",
      summary: "This phase teaches you how a C++ program is written, compiled, debugged, and structured. The goal is to stop treating C++ like mysterious syntax and start seeing it as a precise machine for transforming inputs into outputs.",
      steps: [
        "Install a compiler and learn the compile-run loop. Use g++ or clang++ with flags like -std=c++20 -Wall -Wextra so the compiler warns you about risky code before it becomes a bug.",
        "Understand program anatomy: includes, namespaces, main(), statements, expressions, functions, and return values. Every C++ file should have a clear entry point or a clear role as a support file.",
        "Learn primitive types: int for whole numbers, double for financial decimals, bool for logic, char/string for text. Pay special attention to integer division because 1 / 2 gives 0 unless one side is a double.",
        "Practice control flow: if/else, for loops, while loops, and early returns. In quant code, loops are used constantly for prices, returns, paths, scenarios, and portfolio weights.",
        "Write small functions with clear inputs and outputs. For finance work, functions like mean(), variance(), simpleReturn(), and logReturn() are the building blocks of larger models.",
        "Learn how to read compiler errors. Do not ignore warnings. Treat warnings like risk signals: they often point to hidden bugs, implicit conversions, or uninitialized variables."
      ],
      checklist: [
        "I can compile and run a C++ file from the terminal.",
        "I can explain the difference between int, double, bool, and string.",
        "I can write a function that accepts a vector of prices.",
        "I can calculate simple returns from a price series.",
        "I can read a compiler error and identify the line causing the problem."
      ],
      code: `#include <iostream>
#include <vector>

double simple_return(double previous, double current) {
  return (current - previous) / previous;
}

int main() {
  std::vector<double> prices = {100, 102, 101, 105};

  for (size_t i = 1; i < prices.size(); ++i) {
    std::cout << simple_return(prices[i - 1], prices[i]) << "\\n";
  }
}`,
      projectDetail: "Build a terminal program that accepts a hard-coded vector of prices, calculates simple returns, prints each return, and prints the average return. Then extend it so the user can type prices manually.",
      quiz: {
        q: "Why should a quant C++ beginner usually use double for prices and returns?",
        options: ["Because double stores text", "Because double gives more decimal precision than int or float", "Because double automatically prevents all rounding errors", "Because C++ does not support integers"],
        correct: 1,
        explain: "double is not perfect, but it is the standard starting point for continuous numerical values like prices, rates, returns, and volatility."
      }
    },
    {
      id: "cpp-memory",
      num: "02",
      title: "Memory, references, vectors, and safe data handling",
      level: "Core",
      time: "6–8 hours",
      project: "Build a reusable time-series container",
      summary: "Quant work often means large arrays of prices, returns, paths, or scenarios. This phase explains how C++ stores and passes data without copying everything unnecessarily.",
      steps: [
        "Understand stack versus heap conceptually. Stack variables are automatic and fast; heap allocation is used for dynamic data structures. Most beginners should use containers instead of manual allocation.",
        "Use std::vector for dynamic numerical arrays. It stores values contiguously, which is useful for performance and cache locality in numerical work.",
        "Pass large vectors by const reference: const std::vector<double>&. This avoids expensive copies while also promising not to modify the input.",
        "Use references when a function needs access to an existing object. Use pointers only when you need nullable access, ownership semantics, or low-level interfaces.",
        "Avoid raw new and delete in normal learning projects. Prefer std::vector, std::array, std::unique_ptr, and objects that clean themselves up.",
        "Use const wherever possible. In quant code, const helps protect market data, model parameters, and calibration inputs from accidental mutation."
      ],
      checklist: [
        "I can explain why passing a vector by value can be expensive.",
        "I can use const references in function parameters.",
        "I can safely add values to a vector with push_back.",
        "I understand why manual new/delete should usually be avoided.",
        "I can design a small struct to store a date, price, and return."
      ],
      code: `#include <vector>
#include <numeric>

double mean(const std::vector<double>& values) {
  double sum = std::accumulate(values.begin(), values.end(), 0.0);
  return sum / values.size();
}`,
      projectDetail: "Create a TimeSeries struct with vectors for dates and prices. Add methods for addPrice(), size(), simpleReturns(), and printSummary().",
      quiz: {
        q: "What is the main reason to pass std::vector<double> as const std::vector<double>&?",
        options: ["It makes the vector global", "It avoids copying and prevents modification", "It sorts the vector automatically", "It converts the vector to a pointer"],
        correct: 1,
        explain: "A const reference avoids a full copy and signals that the function will not mutate the input data."
      }
    },
    {
      id: "cpp-modern",
      num: "03",
      title: "Modern C++: STL algorithms, lambdas, RAII, and templates",
      level: "Intermediate",
      time: "8–10 hours",
      project: "Build a generic statistics library",
      summary: "Modern C++ is what makes C++ manageable. This phase moves you from basic loops into reusable, expressive, safer code that is still fast.",
      steps: [
        "Learn STL algorithms: std::accumulate, std::sort, std::transform, std::minmax_element. These make code shorter and reduce manual loop mistakes.",
        "Use lambdas for small pieces of logic. They are useful for transformations, filters, custom sorts, and quick calculations inside algorithms.",
        "Understand RAII: resources are released when objects leave scope. This principle is why C++ can be safe despite giving you low-level control.",
        "Use smart pointers only when ownership is dynamic. std::unique_ptr means one owner; std::shared_ptr means shared ownership. Do not use them just to look advanced.",
        "Learn templates by writing functions that work for multiple numeric types or containers. In quant libraries, templates can help build generic pricing and statistics functions.",
        "Separate interface from implementation. Use header files for declarations and .cpp files for implementation once projects get larger."
      ],
      checklist: [
        "I can use std::accumulate to compute a sum.",
        "I can use a lambda inside std::transform.",
        "I can explain RAII in one sentence.",
        "I know when unique_ptr is appropriate.",
        "I can write a templated mean function."
      ],
      code: `#include <algorithm>
#include <vector>
#include <cmath>

std::vector<double> log_returns(const std::vector<double>& prices) {
  std::vector<double> returns;
  returns.reserve(prices.size() - 1);

  for (size_t i = 1; i < prices.size(); ++i) {
    returns.push_back(std::log(prices[i] / prices[i - 1]));
  }

  return returns;
}`,
      projectDetail: "Build a small Stats namespace with mean(), variance(), stdev(), covariance(), correlation(), min(), max(), and percentile(). Use it later for VaR and portfolio analytics.",
      quiz: {
        q: "What does RAII mainly help with?",
        options: ["Manual chart design", "Resource lifetime and cleanup", "Predicting stock prices", "Changing compiler syntax"],
        correct: 1,
        explain: "RAII ties resource management to object lifetime, helping prevent leaks and unsafe cleanup patterns."
      }
    },
    {
      id: "cpp-engineering",
      num: "04",
      title: "C++ project engineering: CMake, testing, debugging, and performance",
      level: "Advanced foundation",
      time: "8–12 hours",
      project: "Build a tested quant analytics library",
      summary: "A serious quant project needs structure. This phase shows how to organize code into modules, test model outputs, profile performance, and prepare for larger projects.",
      steps: [
        "Organize your project into include/, src/, tests/, data/, and examples/. This separates reusable code from experiments.",
        "Use CMake to build multi-file projects. CMake helps when your project grows beyond a single .cpp file.",
        "Write unit tests for numerical functions. For example, test that mean({1,2,3}) equals 2 and that Black-Scholes output matches a known benchmark.",
        "Use debugging tools to inspect values step by step. Debugging numerical models often means checking intermediate values like d1, d2, discount factors, and payoff arrays.",
        "Profile before optimizing. Use compiler flags first, then analyze bottlenecks. Most speed issues come from unnecessary copies, poor data layout, or repeated expensive calculations.",
        "Document assumptions directly in the code. Quant code should state day-count assumptions, annualization conventions, and whether returns are simple or log."
      ],
      checklist: [
        "I can split code into headers and source files.",
        "I can describe what CMake does.",
        "I can write tests for a statistics function.",
        "I can compile with optimization flags.",
        "I can identify one performance bottleneck in a loop-heavy program."
      ],
      code: `project/
  include/
    stats.hpp
    option_pricing.hpp
  src/
    stats.cpp
    option_pricing.cpp
  tests/
    test_stats.cpp
  examples/
    price_option.cpp
  CMakeLists.txt`,
      projectDetail: "Create a quantlib-style mini library. Include stats.hpp, returns.hpp, risk.hpp, and option_pricing.hpp. Add a tests folder with known expected outputs.",
      quiz: {
        q: "Why should you test numerical finance functions?",
        options: ["Because markets are closed", "Because small formula mistakes can produce believable but wrong outputs", "Because tests make code slower", "Because C++ requires tests to compile"],
        correct: 1,
        explain: "Financial model errors often look plausible, so benchmark tests are essential."
      }
    }
  ],

  tacticsTrack: [
    {
      id: "tactics-data",
      num: "01",
      title: "Market data ingestion and cleaning",
      level: "Quant workflow",
      time: "5–8 hours",
      project: "CSV price loader and validator",
      summary: "Before modelling, you need clean data. This lesson covers the practical process of reading prices, validating rows, handling missing values, and preparing a clean time series.",
      steps: [
        "Define the schema before reading data: date, open, high, low, close, adjusted close, volume. Know which price you are using and why.",
        "Parse CSV lines carefully. Start simple with std::getline and string streams, then later move to a proper CSV parser if files get complex.",
        "Validate numeric fields. Reject or flag rows where price is missing, zero, negative, or not convertible into a double.",
        "Sort by date and check duplicates. Return calculations assume correct chronological order.",
        "Handle missing trading days intentionally. Markets close on weekends and holidays, so missing calendar dates are not automatically errors.",
        "Create a clean vector of adjusted close prices for return calculations and a separate metadata structure for dates."
      ],
      checklist: [
        "I can load a CSV line by line.",
        "I can identify invalid price rows.",
        "I can explain adjusted close versus close.",
        "I can sort or verify chronological order.",
        "I can create a clean vector<double> of prices."
      ],
      code: `std::ifstream file("prices.csv");
std::string line;

while (std::getline(file, line)) {
  // split line by comma
  // parse date and adjusted close
  // validate numeric price
  // push into vectors
}`,
      projectDetail: "Build a CSV loader that reads dates and adjusted close prices. Print total rows, rejected rows, first date, last date, min price, and max price.",
      quiz: {
        q: "Why should you usually use adjusted close for historical return analysis?",
        options: ["It includes adjustments like splits and dividends", "It is always higher than close", "It removes all market risk", "It is only used for options"],
        correct: 0,
        explain: "Adjusted close is designed to make historical price series more comparable across corporate actions."
      }
    },
    {
      id: "tactics-returns",
      num: "02",
      title: "Return analytics, volatility, drawdown, and correlation",
      level: "Core quant",
      time: "7–10 hours",
      project: "Risk summary dashboard engine",
      summary: "Returns are the foundation of quantitative analysis. This lesson turns prices into simple returns, log returns, volatility, drawdown, covariance, and correlation.",
      steps: [
        "Convert prices into simple returns when you want intuitive percentage changes: (P_t - P_{t-1}) / P_{t-1}.",
        "Use log returns when working with compounding, time aggregation, and many mathematical models: log(P_t / P_{t-1}).",
        "Compute average return carefully. Decide whether you are using arithmetic mean or geometric/compound return.",
        "Estimate volatility as the sample standard deviation of returns. Annualize daily volatility by multiplying by sqrt(252), assuming 252 trading days.",
        "Calculate max drawdown by tracking the running peak and measuring the worst percentage decline from that peak.",
        "Compute covariance and correlation to understand how two assets move together. Correlation is normalized covariance."
      ],
      checklist: [
        "I can calculate simple and log returns.",
        "I can explain sample volatility.",
        "I can annualize daily volatility.",
        "I can calculate max drawdown.",
        "I can calculate correlation between two return series."
      ],
      code: `double drawdown = (current_price - running_peak) / running_peak;
max_drawdown = std::min(max_drawdown, drawdown);`,
      projectDetail: "Build a risk summary engine that prints average return, annualized volatility, max drawdown, best day, worst day, and correlation versus a benchmark.",
      quiz: {
        q: "What does max drawdown measure?",
        options: ["The best daily return", "The worst peak-to-trough decline", "The number of trades", "The option strike price"],
        correct: 1,
        explain: "Max drawdown measures the largest decline from a previous high to a later low."
      }
    },
    {
      id: "tactics-portfolio",
      num: "03",
      title: "Portfolio analytics: weights, Sharpe ratio, beta, and covariance",
      level: "Portfolio quant",
      time: "8–12 hours",
      project: "Two-asset portfolio analyzer",
      summary: "Portfolio analysis combines assets using weights. This lesson covers expected portfolio return, portfolio variance, diversification, Sharpe ratio, beta, and covariance matrices.",
      steps: [
        "Represent portfolio weights as a vector. Check that weights sum to 1 unless you intentionally allow leverage.",
        "Calculate portfolio return as the weighted sum of asset returns. For each day, multiply each asset return by its weight and sum the result.",
        "Calculate portfolio volatility using covariance. For two assets, variance = w1²σ1² + w2²σ2² + 2w1w2cov12.",
        "Calculate Sharpe ratio as excess return divided by volatility. Be consistent about annualization.",
        "Calculate beta as covariance(asset, benchmark) / variance(benchmark). Beta estimates sensitivity to market movement.",
        "Compare portfolios by risk-adjusted return, not only raw return. A high return with extreme volatility may not be attractive."
      ],
      checklist: [
        "I can represent portfolio weights in a vector.",
        "I can calculate weighted portfolio return.",
        "I can explain covariance in a portfolio context.",
        "I can calculate Sharpe ratio.",
        "I can calculate beta against a benchmark."
      ],
      code: `double portfolio_return = 0.0;

for (size_t i = 0; i < weights.size(); ++i) {
  portfolio_return += weights[i] * asset_returns[i];
}`,
      projectDetail: "Build a two-asset portfolio analyzer where the user changes weights from 0% to 100%. Print expected return, volatility, and Sharpe ratio for each weight combination.",
      quiz: {
        q: "What does diversification depend on mathematically?",
        options: ["Only the asset names", "Correlation or covariance between assets", "The color of the chart", "The number of C++ files"],
        correct: 1,
        explain: "Diversification benefit depends heavily on how asset returns co-move."
      }
    },
    {
      id: "tactics-backtesting",
      num: "04",
      title: "Backtesting architecture and strategy evaluation",
      level: "Applied quant",
      time: "10–14 hours",
      project: "Moving-average crossover backtester",
      summary: "Backtesting turns a trading idea into a historical simulation. This lesson covers signals, positions, lookahead bias, transaction costs, slippage, and performance metrics.",
      steps: [
        "Separate data, signal generation, execution, portfolio accounting, and reporting. This keeps your strategy logic from becoming tangled.",
        "Generate signals using only information available at that time. Avoid lookahead bias by shifting signals before applying them to returns.",
        "Convert signals into positions. A signal says what you want; a position is what the portfolio actually holds.",
        "Model transaction costs and slippage. Even simple cost assumptions make a backtest more realistic.",
        "Track portfolio equity over time. Start with initial capital, update daily based on position returns and costs.",
        "Report performance: CAGR, volatility, Sharpe, max drawdown, win rate, turnover, and benchmark comparison."
      ],
      checklist: [
        "I can explain lookahead bias.",
        "I can separate signal and position.",
        "I can apply transaction costs.",
        "I can calculate an equity curve.",
        "I can compare a strategy against buy-and-hold."
      ],
      code: `// Avoid lookahead bias:
// today's position should use yesterday's signal.
position[t] = signal[t - 1];
strategy_return[t] = position[t] * asset_return[t] - transaction_cost;`,
      projectDetail: "Build a moving-average crossover backtester. Use a short moving average and long moving average. Buy when short > long, exit when short <= long.",
      quiz: {
        q: "What is lookahead bias?",
        options: ["Using future information in a historical simulation", "Using C++ instead of Python", "Using adjusted close prices", "Testing more than one asset"],
        correct: 0,
        explain: "Lookahead bias makes a strategy appear better than it would have been in real time."
      }
    }
  ],

  algorithmTrack: [
    {
      id: "algo-black-scholes",
      num: "01",
      title: "Black-Scholes option pricing",
      level: "Options",
      time: "8–12 hours",
      project: "European option pricer",
      summary: "Black-Scholes is the classic closed-form model for European options. It connects spot price, strike, volatility, time, and risk-free rate to a theoretical option price.",
      steps: [
        "Understand the inputs: spot price S, strike K, risk-free rate r, volatility sigma, and time to maturity T.",
        "Compute d1 and d2. These intermediate values combine moneyness, carry, volatility, and time.",
        "Implement the standard normal cumulative distribution function. In C++, you can approximate it using std::erfc.",
        "Calculate call price: S * N(d1) - K * exp(-rT) * N(d2). Calculate put price using the corresponding formula or put-call parity.",
        "Validate your output against known online examples or textbook values. A small formula error can still create a believable result.",
        "Document assumptions: European exercise, constant volatility, constant risk-free rate, no transaction costs, lognormal price dynamics."
      ],
      checklist: [
        "I can define S, K, r, sigma, and T.",
        "I can compute d1 and d2.",
        "I can implement a normal CDF approximation.",
        "I can calculate a European call price.",
        "I can state the model assumptions."
      ],
      code: `double norm_cdf(double x) {
  return 0.5 * std::erfc(-x / std::sqrt(2.0));
}

double black_scholes_call(double S, double K, double r, double sigma, double T) {
  double d1 = (std::log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * std::sqrt(T));
  double d2 = d1 - sigma * std::sqrt(T);
  return S * norm_cdf(d1) - K * std::exp(-r * T) * norm_cdf(d2);
}`,
      projectDetail: "Build a European option pricer that accepts S, K, r, sigma, and T. Print call price, put price, and put-call parity check.",
      quiz: {
        q: "What type of option does basic Black-Scholes price directly?",
        options: ["American option with early exercise", "European option", "Any path-dependent option", "Only crypto options"],
        correct: 1,
        explain: "The basic closed-form Black-Scholes formula prices European options under its assumptions."
      }
    },
    {
      id: "algo-greeks",
      num: "02",
      title: "Greeks: Delta, Gamma, Vega, Theta, and Rho",
      level: "Options risk",
      time: "7–10 hours",
      project: "Greeks sensitivity table",
      summary: "Greeks measure how an option price changes when inputs change. They are essential for hedging, risk monitoring, and understanding option behavior.",
      steps: [
        "Delta measures sensitivity to the underlying price. A call option delta is often between 0 and 1.",
        "Gamma measures how delta changes as the underlying changes. High gamma means delta can move quickly.",
        "Vega measures sensitivity to volatility. Options with more time value often have higher vega.",
        "Theta measures sensitivity to time decay. Long options often lose value as expiration approaches, all else equal.",
        "Rho measures sensitivity to interest rates. It is often less central for short-dated equity options but still part of the full risk picture.",
        "Implement both analytical Greeks and finite-difference checks. Finite differences help validate formulas."
      ],
      checklist: [
        "I can explain Delta in plain language.",
        "I can explain why Gamma matters for hedging.",
        "I can calculate finite-difference sensitivity.",
        "I can create a table of Greeks for different strikes.",
        "I can connect Greeks to risk management."
      ],
      code: `double finite_difference_delta(double S, double h) {
  double up = black_scholes_call(S + h, K, r, sigma, T);
  double down = black_scholes_call(S - h, K, r, sigma, T);
  return (up - down) / (2.0 * h);
}`,
      projectDetail: "Build a Greeks table across strikes from 80 to 120. For each strike, print price, delta, gamma, vega, theta, and rho.",
      quiz: {
        q: "Which Greek measures sensitivity to volatility?",
        options: ["Delta", "Gamma", "Vega", "Rho"],
        correct: 2,
        explain: "Vega measures how much the option price changes when implied volatility changes."
      }
    },
    {
      id: "algo-monte-carlo",
      num: "03",
      title: "Monte Carlo simulation for option pricing",
      level: "Simulation",
      time: "10–16 hours",
      project: "Monte Carlo call and put pricer",
      summary: "Monte Carlo pricing simulates many possible future paths, computes payoffs, averages them, and discounts the result. It is especially useful for path-dependent payoffs.",
      steps: [
        "Choose a stochastic process. A common starting point is geometric Brownian motion: S_T = S0 exp((r - 0.5σ²)T + σ√T Z).",
        "Create a random number generator using std::mt19937. Use std::normal_distribution<double> to generate standard normal shocks.",
        "Simulate terminal prices for many paths. More paths usually reduce sampling error but increase runtime.",
        "Calculate payoff for each path. For a call, payoff = max(S_T - K, 0). For a put, payoff = max(K - S_T, 0).",
        "Average the payoffs and discount them using exp(-rT). This gives the estimated option price.",
        "Track standard error. A Monte Carlo estimate should include uncertainty, not just a single number."
      ],
      checklist: [
        "I can explain why Monte Carlo uses random paths.",
        "I can simulate a terminal stock price.",
        "I can calculate discounted expected payoff.",
        "I can explain why more paths reduce noise.",
        "I can compute standard error of simulated payoffs."
      ],
      code: `for (int i = 0; i < paths; ++i) {
  double ST = S0 * std::exp((r - 0.5 * sigma * sigma) * T
              + sigma * std::sqrt(T) * normal(gen));
  double payoff = std::max(ST - K, 0.0);
  sum += payoff;
}

double price = std::exp(-r * T) * sum / paths;`,
      projectDetail: "Build a Monte Carlo pricer for European calls and puts. Add path count, seed control, standard error, and comparison against Black-Scholes.",
      quiz: {
        q: "What is the final Monte Carlo option price based on?",
        options: ["The maximum simulated payoff only", "The discounted average payoff", "The first simulated path", "The strike price only"],
        correct: 1,
        explain: "Risk-neutral Monte Carlo pricing estimates discounted expected payoff."
      }
    },
    {
      id: "algo-binomial",
      num: "04",
      title: "Binomial trees and lattice pricing",
      level: "Options algorithm",
      time: "8–14 hours",
      project: "Binomial option tree",
      summary: "A binomial tree models price movement as up/down steps. It is intuitive, flexible, and can handle early exercise more naturally than basic Black-Scholes.",
      steps: [
        "Choose the number of steps N. More steps usually improve approximation but increase computation.",
        "Define up factor u, down factor d, and risk-neutral probability p. A common setup uses u = exp(σ√dt) and d = 1/u.",
        "Build terminal asset prices at maturity. Each node represents a possible number of up moves.",
        "Calculate terminal option payoffs. For a call, use max(S - K, 0).",
        "Step backward through the tree. Each node value is the discounted expected value of its two future nodes.",
        "For American options, compare continuation value with immediate exercise value at every node."
      ],
      checklist: [
        "I can define u, d, p, and dt.",
        "I can compute terminal payoffs.",
        "I can perform backward induction.",
        "I can explain how American exercise is added.",
        "I can compare tree output with Black-Scholes."
      ],
      code: `for (int step = N - 1; step >= 0; --step) {
  for (int i = 0; i <= step; ++i) {
    values[i] = discount * (p * values[i + 1] + (1.0 - p) * values[i]);
  }
}`,
      projectDetail: "Build a binomial tree pricer for European and American calls/puts. Add a toggle for number of steps and compare convergence.",
      quiz: {
        q: "What technique does a binomial tree use to calculate today’s option price?",
        options: ["Backward induction", "Only linear regression", "Sorting strings", "Ignoring volatility"],
        correct: 0,
        explain: "The tree starts from maturity payoffs and works backward to today."
      }
    },
    {
      id: "algo-var-cvar",
      num: "05",
      title: "Value at Risk and Conditional Value at Risk",
      level: "Risk",
      time: "7–11 hours",
      project: "Historical VaR/CVaR calculator",
      summary: "VaR estimates a loss threshold at a confidence level. CVaR estimates the average loss beyond that threshold, making it more informative about tail risk.",
      steps: [
        "Convert historical prices into returns, then convert returns into profit/loss values for a given portfolio value.",
        "Sort losses from smallest to largest or returns from worst to best. Be consistent about sign conventions.",
        "Choose a confidence level, such as 95% or 99%. VaR is the loss threshold exceeded only in the worst tail.",
        "Calculate historical VaR using the relevant percentile of losses.",
        "Calculate CVaR by averaging the losses worse than the VaR threshold.",
        "Explain limitations: historical VaR depends on the historical window and may underestimate new regimes or extreme events."
      ],
      checklist: [
        "I can define VaR in plain language.",
        "I can calculate a percentile-based loss threshold.",
        "I can explain why CVaR is more tail-aware.",
        "I can handle sign conventions for losses.",
        "I can state at least two limitations of historical VaR."
      ],
      code: `std::sort(losses.begin(), losses.end());
size_t index = static_cast<size_t>(confidence * losses.size());
double var = losses[index];`,
      projectDetail: "Build a historical VaR/CVaR calculator for a portfolio. Let the user choose 95% or 99% confidence and print the worst 10 historical losses.",
      quiz: {
        q: "What does CVaR measure?",
        options: ["Average loss beyond the VaR threshold", "The average stock price", "The highest positive return", "The option delta"],
        correct: 0,
        explain: "CVaR focuses on the average severity of tail losses beyond VaR."
      }
    },
    {
      id: "algo-optimization",
      num: "06",
      title: "Portfolio optimization and efficient frontier",
      level: "Optimization",
      time: "10–18 hours",
      project: "Efficient frontier generator",
      summary: "Portfolio optimization searches for weights that balance return and risk. The efficient frontier shows portfolios that offer the highest expected return for a given level of risk.",
      steps: [
        "Calculate expected returns for each asset. Start with historical average returns, but understand that expected return estimation is fragile.",
        "Calculate the covariance matrix. This is the engine of portfolio risk estimation.",
        "Represent portfolio return as wᵀμ and variance as wᵀΣw.",
        "Generate many candidate weight combinations. For a beginner project, brute force random weights are easier than full quadratic optimization.",
        "Calculate return, volatility, and Sharpe ratio for each candidate portfolio.",
        "Plot or print the best portfolios: minimum volatility, maximum Sharpe, and target-risk portfolios."
      ],
      checklist: [
        "I can explain what an efficient frontier represents.",
        "I can calculate weighted portfolio return.",
        "I can calculate portfolio variance from covariance.",
        "I can generate random portfolio weights that sum to 1.",
        "I can identify the maximum Sharpe portfolio."
      ],
      code: `// portfolio variance concept:
// variance = transpose(weights) * covariance_matrix * weights`,
      projectDetail: "Generate 10,000 random portfolios for 3–5 assets. Print the minimum-volatility portfolio and maximum-Sharpe portfolio.",
      quiz: {
        q: "What does the efficient frontier show?",
        options: ["Only losing portfolios", "Best risk-return tradeoffs among available portfolios", "Compiler warnings", "Only single-stock investments"],
        correct: 1,
        explain: "The frontier contains portfolios that are not dominated by another portfolio with better return for the same or lower risk."
      }
    },
    {
      id: "algo-stochastic",
      num: "07",
      title: "Stochastic processes: random walk, GBM, mean reversion",
      level: "Modelling",
      time: "10–16 hours",
      project: "Path simulator library",
      summary: "Stochastic processes describe how variables evolve randomly over time. Quant finance uses them to model prices, rates, volatility, and spreads.",
      steps: [
        "Start with a random walk. Each next value equals the previous value plus a random shock.",
        "Move to geometric Brownian motion for positive asset prices. GBM is the process behind the standard Black-Scholes setup.",
        "Understand drift and volatility. Drift controls average direction; volatility controls dispersion.",
        "Implement time stepping. For each time step, update the price using a random draw and model formula.",
        "Learn mean reversion. Some variables, such as spreads or interest rates, are often modelled as moving back toward a long-run mean.",
        "Visualize or print multiple paths. The point is not one prediction; it is a distribution of possible outcomes."
      ],
      checklist: [
        "I can explain random walk versus GBM.",
        "I can simulate multiple price paths.",
        "I can explain drift and volatility.",
        "I can describe mean reversion.",
        "I can connect stochastic paths to Monte Carlo pricing."
      ],
      code: `S = S * std::exp((mu - 0.5 * sigma * sigma) * dt
    + sigma * std::sqrt(dt) * Z);`,
      projectDetail: "Build a path simulator that supports random walk, GBM, and mean reversion. Print final-price distribution statistics.",
      quiz: {
        q: "Why is GBM commonly used for stock-price simulation?",
        options: ["It keeps simulated prices positive", "It guarantees profit", "It removes volatility", "It only works for bonds"],
        correct: 0,
        explain: "The exponential form of GBM helps keep simulated prices positive."
      }
    },
    {
      id: "algo-signals",
      num: "08",
      title: "Signal generation: momentum, mean reversion, and z-scores",
      level: "Strategy research",
      time: "8–14 hours",
      project: "Signal research engine",
      summary: "Signals transform market data into trading rules. This lesson covers simple momentum, moving averages, z-scores, and mean-reversion logic.",
      steps: [
        "Define a signal as a rule that maps data into an action or score. Example: if 20-day return is positive, signal = 1.",
        "Build momentum signals using past returns. Momentum assumes recent winners may continue winning over some horizon.",
        "Build moving-average signals using short and long averages. A crossover can indicate trend direction.",
        "Build z-score signals for mean reversion. A z-score measures how far a value is from its recent mean in standard deviation units.",
        "Convert signals into positions with a lag. This prevents using information from the same period you are trading.",
        "Evaluate signals with hit rate, average return after signal, turnover, and performance after transaction costs."
      ],
      checklist: [
        "I can define a trading signal.",
        "I can calculate moving averages.",
        "I can calculate a z-score.",
        "I can lag a signal before backtesting.",
        "I can evaluate whether a signal has value."
      ],
      code: `double z = (price - rolling_mean) / rolling_stdev;

if (z < -2.0) signal = 1;
else if (z > 2.0) signal = -1;
else signal = 0;`,
      projectDetail: "Build a signal engine that generates momentum, moving-average, and z-score signals. Compare their next-day average returns.",
      quiz: {
        q: "Why should signals be lagged before applying them in a backtest?",
        options: ["To avoid lookahead bias", "To make code longer", "To reduce compiler warnings", "To remove all losses"],
        correct: 0,
        explain: "A lag makes the strategy use only information that would have been known before the trade."
      }
    }
  ]
};

function createLessonCard(lesson) {
  const checklist = lesson.checklist.map((item, index) => `
    <label>
      <input type="checkbox" class="progress-check" data-key="${lesson.id}-${index}">
      <span>${item}</span>
    </label>
  `).join("");

  const steps = lesson.steps.map(step => `<li>${step}</li>`).join("");

  const options = lesson.quiz.options.map((option, index) => `
    <button class="quiz-option" data-correct="${index === lesson.quiz.correct}" data-explain="${lesson.quiz.explain}">
      ${option}
    </button>
  `).join("");

  return `
    <article class="lesson-card glass" id="${lesson.id}">
      <div class="lesson-top">
        <span class="lesson-num">${lesson.num}</span>
        <div>
          <h3>${lesson.title}</h3>
          <p>${lesson.summary}</p>
          <div class="lesson-meta">
            <span class="pill">${lesson.level}</span>
            <span class="pill">${lesson.time}</span>
            <span class="pill">Project: ${lesson.project}</span>
          </div>
        </div>
        <span class="expand-icon">+</span>
      </div>

      <div class="lesson-detail">
        <div class="detail-grid">
          <div>
            <h4>Step-by-step lesson</h4>
            <ol class="step-list">${steps}</ol>

            <h4>Progress checklist</h4>
            <div class="checklist">${checklist}</div>
          </div>

          <div>
            <h4>Core C++ pattern</h4>
            <pre><code>${escapeHtml(lesson.code)}</code></pre>

            <div class="project-box">
              <h4>Linked project / simulation</h4>
              <p><strong>${lesson.project}</strong></p>
              <p>${lesson.projectDetail}</p>
            </div>

            <div class="quiz-box">
              <h4>Module quiz</h4>
              <p>${lesson.quiz.q}</p>
              <div class="quiz-options">${options}</div>
              <p class="quiz-feedback"></p>
            </div>
          </div>
        </div>
      </div>
    </article>
  `;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderTrack(containerId, lessons) {
  document.getElementById(containerId).innerHTML = lessons.map(createLessonCard).join("");
}

renderTrack("cppTrack", tracks.cppTrack);
renderTrack("tacticsTrack", tracks.tacticsTrack);
renderTrack("algorithmTrack", tracks.algorithmTrack);

document.querySelectorAll(".lesson-top").forEach(top => {
  top.addEventListener("click", () => {
    const card = top.closest(".lesson-card");
    card.classList.toggle("open");
    const icon = card.querySelector(".expand-icon");
    icon.textContent = card.classList.contains("open") ? "−" : "+";
  });
});

function loadProgress() {
  document.querySelectorAll(".progress-check").forEach(check => {
    check.checked = localStorage.getItem(check.dataset.key) === "true";
    check.addEventListener("change", () => {
      localStorage.setItem(check.dataset.key, check.checked);
      updateOverallProgress();
    });
  });
  updateOverallProgress();
}

function updateOverallProgress() {
  const checks = [...document.querySelectorAll(".progress-check")];
  const done = checks.filter(check => check.checked).length;
  const progress = checks.length ? Math.round((done / checks.length) * 100) : 0;
  document.getElementById("overallProgress").textContent = progress + "%";
}

loadProgress();

document.querySelectorAll(".quiz-option").forEach(button => {
  button.addEventListener("click", () => {
    const box = button.closest(".quiz-box");
    box.querySelectorAll(".quiz-option").forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.correct === "true") btn.classList.add("correct");
    });

    if (button.dataset.correct === "true") {
      button.classList.add("correct");
      box.querySelector(".quiz-feedback").textContent = "Correct. " + button.dataset.explain;
    } else {
      button.classList.add("wrong");
      box.querySelector(".quiz-feedback").textContent = "Not quite. " + button.dataset.explain;
    }
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
annualized volatility estimate: ${(result.vol * Math.sqrt(252) * 100).toFixed(3)}%

quant note:
This is the first layer of risk analytics. Once you can calculate returns and volatility, you can build Sharpe ratio, drawdown, beta, VaR, and portfolio optimization.`;
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

function randn() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function runMonteCarlo() {
  const S0 = Number(document.getElementById("mcSpot").value);
  const K = Number(document.getElementById("mcStrike").value);
  const r = Number(document.getElementById("mcRate").value);
  const sigma = Number(document.getElementById("mcVol").value);
  const T = Number(document.getElementById("mcTime").value);
  const paths = Number(document.getElementById("mcPaths").value);

  let sum = 0;
  let sumSq = 0;

  for (let i = 0; i < paths; i++) {
    const z = randn();
    const ST = S0 * Math.exp((r - 0.5 * sigma * sigma) * T + sigma * Math.sqrt(T) * z);
    const payoff = Math.max(ST - K, 0);
    sum += payoff;
    sumSq += payoff * payoff;
  }

  const avgPayoff = sum / paths;
  const price = Math.exp(-r * T) * avgPayoff;
  const variance = (sumSq / paths) - avgPayoff * avgPayoff;
  const standardError = Math.exp(-r * T) * Math.sqrt(variance / paths);

  document.getElementById("mcOutput").textContent =
`Monte Carlo European Call Estimate

S0: ${S0}
K: ${K}
r: ${r}
sigma: ${sigma}
T: ${T}
paths: ${paths.toLocaleString()}

estimated call price: ${price.toFixed(4)}
standard error: ${standardError.toFixed(4)}

interpretation:
The price is the discounted average payoff across simulated terminal prices. Increase paths to reduce sampling noise. In C++, this same model would use std::mt19937 and std::normal_distribution<double>.`;
}

document.getElementById("runMonteCarlo").addEventListener("click", runMonteCarlo);
runMonteCarlo();
