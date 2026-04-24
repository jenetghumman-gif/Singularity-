function randn(){
  let u=0,v=0;
  while(u===0)u=Math.random();
  while(v===0)v=Math.random();
  return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
}

function normalCdf(x){
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

function erf(x){
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  const a1=0.254829592,a2=-0.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=0.3275911;
  const t=1/(1+p*x);
  const y=1-(((((a5*t+a4)*t)+a3)*t+a2)*t+a1)*t*Math.exp(-x*x);
  return sign*y;
}

function bsCall(S,K,r,sigma,T){
  const d1=(Math.log(S/K)+(r+0.5*sigma*sigma)*T)/(sigma*Math.sqrt(T));
  const d2=d1-sigma*Math.sqrt(T);
  return S*normalCdf(d1)-K*Math.exp(-r*T)*normalCdf(d2);
}

function calculateReturns(prices){
  const returns=[];
  for(let i=1;i<prices.length;i++) returns.push((prices[i]-prices[i-1])/prices[i-1]);
  const mean=returns.reduce((a,b)=>a+b,0)/returns.length;
  const variance=returns.reduce((s,r)=>s+Math.pow(r-mean,2),0)/(returns.length-1);
  let peak=prices[0], maxDD=0;
  for(const p of prices){
    peak=Math.max(peak,p);
    maxDD=Math.min(maxDD,(p-peak)/peak);
  }
  return {returns,mean,vol:Math.sqrt(variance),maxDD};
}

function runReturnLab(){
  const input=document.getElementById("prices");
  const output=document.getElementById("calcOutput");
  if(!input||!output)return;
  const prices=input.value.split(",").map(x=>Number(x.trim())).filter(Number.isFinite);
  if(prices.length<3){output.textContent="Enter at least three valid prices.";return;}
  const r=calculateReturns(prices);
  output.textContent=`prices: [${prices.join(", ")}]

returns:
${r.returns.map(x=>(x*100).toFixed(2)+"%").join("   ")}

average return: ${(r.mean*100).toFixed(3)}%
sample volatility: ${(r.vol*100).toFixed(3)}%
annualized volatility: ${(r.vol*Math.sqrt(252)*100).toFixed(3)}%
max drawdown: ${(r.maxDD*100).toFixed(3)}%

textbook interpretation:
Returns normalize the price series. Volatility measures dispersion. Drawdown measures path pain. These three metrics become the base layer for Sharpe ratio, VaR, CVaR, and backtesting reports.`;
}

function runMonteCarlo(){
  const out=document.getElementById("mcOutput");
  if(!out)return;
  const S0=Number(document.getElementById("mcSpot").value);
  const K=Number(document.getElementById("mcStrike").value);
  const r=Number(document.getElementById("mcRate").value);
  const sigma=Number(document.getElementById("mcVol").value);
  const T=Number(document.getElementById("mcTime").value);
  const paths=Number(document.getElementById("mcPaths").value);
  let sum=0,sumSq=0;
  for(let i=0;i<paths;i++){
    const z=randn();
    const ST=S0*Math.exp((r-0.5*sigma*sigma)*T+sigma*Math.sqrt(T)*z);
    const payoff=Math.max(ST-K,0);
    sum+=payoff; sumSq+=payoff*payoff;
  }
  const avg=sum/paths;
  const price=Math.exp(-r*T)*avg;
  const variance=sumSq/paths-avg*avg;
  const se=Math.exp(-r*T)*Math.sqrt(Math.max(variance,0)/paths);
  const bs=bsCall(S0,K,r,sigma,T);
  out.textContent=`Monte Carlo European Call

S0=${S0}, K=${K}, r=${r}, sigma=${sigma}, T=${T}
paths=${paths.toLocaleString()}

Monte Carlo estimate: ${price.toFixed(4)}
Standard error:      ${se.toFixed(4)}
Black-Scholes check: ${bs.toFixed(4)}
Difference:          ${(price-bs).toFixed(4)}

Interpretation:
The Monte Carlo price should move closer to Black-Scholes as paths increase, because both assume the same GBM dynamics for this plain European call.`;
}

function runFrontier(){
  const out=document.getElementById("frontierOutput");
  if(!out)return;
  const assets=[
    {name:"Asset A", ret:.09, vol:.18},
    {name:"Asset B", ret:.06, vol:.10},
    {name:"Asset C", ret:.12, vol:.24}
  ];
  const corr=[[1,.35,.55],[.35,1,.2],[.55,.2,1]];
  let bestSharpe={s:-Infinity}, minVol={v:Infinity};
  let lines=[];
  for(let n=0;n<5000;n++){
    let a=Math.random(),b=Math.random(),c=Math.random();
    const total=a+b+c; const w=[a/total,b/total,c/total];
    const ret=w.reduce((s,wi,i)=>s+wi*assets[i].ret,0);
    let variance=0;
    for(let i=0;i<3;i++){
      for(let j=0;j<3;j++) variance+=w[i]*w[j]*assets[i].vol*assets[j].vol*corr[i][j];
    }
    const vol=Math.sqrt(variance);
    const sharpe=(ret-.03)/vol;
    if(sharpe>bestSharpe.s) bestSharpe={w,ret,vol,s:sharpe};
    if(vol<minVol.v) minVol={w,ret,v:vol,s:sharpe};
  }
  function fmt(p){return p.map(x=>(x*100).toFixed(1)+"%").join(" / ")}
  out.textContent=`Random Efficient Frontier Approximation

Assets:
A: return 9%, volatility 18%
B: return 6%, volatility 10%
C: return 12%, volatility 24%

Maximum Sharpe Portfolio:
weights A/B/C: ${fmt(bestSharpe.w)}
return: ${(bestSharpe.ret*100).toFixed(2)}%
volatility: ${(bestSharpe.vol*100).toFixed(2)}%
Sharpe: ${bestSharpe.s.toFixed(3)}

Minimum Volatility Portfolio:
weights A/B/C: ${fmt(minVol.w)}
return: ${(minVol.ret*100).toFixed(2)}%
volatility: ${(minVol.v*100).toFixed(2)}%
Sharpe: ${minVol.s.toFixed(3)}

Interpretation:
This is a random-search approximation. In full C++, you would store covariance in a matrix and evaluate thousands of candidate portfolios.`;
}

function setupQuizzes(){
  document.querySelectorAll(".quiz-option").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const box=btn.closest(".quiz-card");
      box.querySelectorAll(".quiz-option").forEach(b=>{
        b.disabled=true;
        if(b.dataset.correct==="true") b.classList.add("correct");
      });
      const fb=box.querySelector(".quiz-feedback");
      if(btn.dataset.correct==="true"){btn.classList.add("correct");fb.textContent="Correct."}
      else{btn.classList.add("wrong");fb.textContent="Not quite — the correct answer is highlighted."}
    });
  });
}

function setupProgress(){
  const checks=[...document.querySelectorAll(".progress-check")];
  checks.forEach(ch=>{
    ch.checked=localStorage.getItem(ch.dataset.key)==="true";
    ch.addEventListener("change",()=>{
      localStorage.setItem(ch.dataset.key,ch.checked);
      updateProgress();
    });
  });
  updateProgress();
}

function updateProgress(){
  const checks=[...document.querySelectorAll(".progress-check")];
  const done=checks.filter(c=>c.checked).length;
  const pct=checks.length?Math.round(done/checks.length*100):0;
  document.querySelectorAll(".progress-fill").forEach(f=>f.style.width=pct+"%");
  document.querySelectorAll(".progress-number").forEach(n=>n.textContent=pct+"%");
}

document.addEventListener("DOMContentLoaded",()=>{
  setupQuizzes();
  setupProgress();
  const retBtn=document.getElementById("runCalc");
  if(retBtn){retBtn.addEventListener("click",runReturnLab);runReturnLab();}
  const mcBtn=document.getElementById("runMonteCarlo");
  if(mcBtn){mcBtn.addEventListener("click",runMonteCarlo);runMonteCarlo();}
  const frBtn=document.getElementById("runFrontier");
  if(frBtn){frBtn.addEventListener("click",runFrontier);runFrontier();}
});
