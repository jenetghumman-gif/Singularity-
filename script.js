function $(id){ return document.getElementById(id); }

function randn(){
  let u=0,v=0;
  while(u===0) u=Math.random();
  while(v===0) v=Math.random();
  return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
}

function erf(x){
  const sign=x>=0?1:-1; x=Math.abs(x);
  const a1=.254829592,a2=-.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=.3275911;
  const t=1/(1+p*x);
  const y=1-(((((a5*t+a4)*t)+a3)*t+a2)*t+a1)*t*Math.exp(-x*x);
  return sign*y;
}

function normCdf(x){ return .5*(1+erf(x/Math.sqrt(2))); }

function bsCall(S,K,r,sigma,T){
  const d1=(Math.log(S/K)+(r+.5*sigma*sigma)*T)/(sigma*Math.sqrt(T));
  const d2=d1-sigma*Math.sqrt(T);
  return S*normCdf(d1)-K*Math.exp(-r*T)*normCdf(d2);
}

function bsPut(S,K,r,sigma,T){
  const d1=(Math.log(S/K)+(r+.5*sigma*sigma)*T)/(sigma*Math.sqrt(T));
  const d2=d1-sigma*Math.sqrt(T);
  return K*Math.exp(-r*T)*normCdf(-d2)-S*normCdf(-d1);
}

function drawLine(canvasId, series, label=""){
  const c=$(canvasId); if(!c)return;
  const ctx=c.getContext("2d"), w=c.width, h=c.height;
  ctx.clearRect(0,0,w,h);
  ctx.strokeStyle="rgba(247,241,232,.15)";
  ctx.lineWidth=1;
  for(let i=0;i<5;i++){ const y=30+i*(h-60)/4; ctx.beginPath(); ctx.moveTo(30,y); ctx.lineTo(w-20,y); ctx.stroke(); }
  const min=Math.min(...series), max=Math.max(...series), range=max-min || 1;
  ctx.strokeStyle="#d7ff5f"; ctx.lineWidth=3; ctx.beginPath();
  series.forEach((v,i)=>{
    const x=30+i*(w-55)/(series.length-1);
    const y=h-30-(v-min)/range*(h-60);
    if(i===0)ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();
  ctx.fillStyle="rgba(247,241,232,.75)";
  ctx.font="14px IBM Plex Mono";
  ctx.fillText(label, 30, 22);
}

function drawScatter(canvasId, points){
  const c=$(canvasId); if(!c)return;
  const ctx=c.getContext("2d"), w=c.width, h=c.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle="rgba(247,241,232,.08)";
  ctx.fillRect(0,0,w,h);
  const xs=points.map(p=>p.x), ys=points.map(p=>p.y);
  const minX=Math.min(...xs), maxX=Math.max(...xs), minY=Math.min(...ys), maxY=Math.max(...ys);
  points.forEach(p=>{
    const x=35+(p.x-minX)/(maxX-minX || 1)*(w-65);
    const y=h-30-(p.y-minY)/(maxY-minY || 1)*(h-60);
    ctx.fillStyle=p.best?"#d7ff5f":"rgba(98,244,255,.5)";
    ctx.beginPath(); ctx.arc(x,y,p.best?5:2.2,0,Math.PI*2); ctx.fill();
  });
  ctx.fillStyle="rgba(247,241,232,.75)";
  ctx.font="14px IBM Plex Mono";
  ctx.fillText("risk → / return ↑", 30, 22);
}

function metricsFromPrices(prices){
  const returns=[];
  for(let i=1;i<prices.length;i++) returns.push((prices[i]-prices[i-1])/prices[i-1]);
  const mean=returns.reduce((a,b)=>a+b,0)/returns.length;
  const variance=returns.reduce((s,r)=>s+(r-mean)**2,0)/(returns.length-1);
  const vol=Math.sqrt(variance);
  let peak=prices[0], maxDD=0;
  for(const p of prices){ peak=Math.max(peak,p); maxDD=Math.min(maxDD,(p-peak)/peak); }
  const losses=returns.map(r=>-r).sort((a,b)=>a-b);
  const idx=Math.floor(.95*losses.length);
  const var95=losses[idx] || 0;
  const tail=losses.filter(x=>x>=var95);
  const cvar95=tail.reduce((a,b)=>a+b,0)/(tail.length||1);
  return {returns,mean,vol,annVol:vol*Math.sqrt(252),maxDD,var95,cvar95};
}

function riskBand(m){
  const score=Math.min(100, Math.max(0, Math.round((m.annVol*120)+(Math.abs(m.maxDD)*160)+(m.cvar95*200))));
  let band="Low";
  if(score>65) band="High";
  else if(score>35) band="Moderate";
  return {score,band};
}

function runRisk(){
  const prices=$("riskPrices").value.split(",").map(x=>Number(x.trim())).filter(Number.isFinite);
  const m=metricsFromPrices(prices), rb=riskBand(m);
  $("riskOutput").textContent=`Risk Analyzer Report

observations: ${prices.length}
average return: ${(m.mean*100).toFixed(3)}%
annualized volatility: ${(m.annVol*100).toFixed(2)}%
max drawdown: ${(m.maxDD*100).toFixed(2)}%
historical VaR 95: ${(m.var95*100).toFixed(2)}%
historical CVaR 95: ${(m.cvar95*100).toFixed(2)}%

Risk score: ${rb.score}/100
Risk band: ${rb.band}

Interpretation:
VaR estimates where the bad tail begins. CVaR estimates the average severity inside that bad tail. Max drawdown captures path pain that volatility alone can miss.`;
  $("heroRisk").textContent=rb.score+"/100";
  drawLine("riskChart", prices, "price path");
  drawHero();
}

function runOptions(){
  const S=+$("optSpot").value,K=+$("optStrike").value,r=+$("optRate").value,sigma=+$("optVol").value,T=+$("optTime").value,paths=+$("optPaths").value;
  const call=bsCall(S,K,r,sigma,T), put=bsPut(S,K,r,sigma,T);
  const d1=(Math.log(S/K)+(r+.5*sigma*sigma)*T)/(sigma*Math.sqrt(T));
  const d2=d1-sigma*Math.sqrt(T);
  const delta=normCdf(d1);
  const gamma=Math.exp(-.5*d1*d1)/(S*sigma*Math.sqrt(2*Math.PI*T));
  const vega=S*Math.exp(-.5*d1*d1)*Math.sqrt(T)/Math.sqrt(2*Math.PI)/100;
  let sum=0,sumSq=0;
  for(let i=0;i<paths;i++){
    const ST=S*Math.exp((r-.5*sigma*sigma)*T+sigma*Math.sqrt(T)*randn());
    const payoff=Math.max(ST-K,0); sum+=payoff; sumSq+=payoff*payoff;
  }
  const avg=sum/paths, mc=Math.exp(-r*T)*avg;
  const se=Math.exp(-r*T)*Math.sqrt(Math.max(sumSq/paths-avg*avg,0)/paths);
  $("optionsOutput").textContent=`Options Pricing Report

Black-Scholes call: ${call.toFixed(4)}
Black-Scholes put:  ${put.toFixed(4)}
Monte Carlo call:   ${mc.toFixed(4)}
MC standard error:  ${se.toFixed(4)}

Greeks:
Delta: ${delta.toFixed(4)}
Gamma: ${gamma.toFixed(5)}
Vega per 1 vol point: ${vega.toFixed(4)}

Interpretation:
Black-Scholes is fast and closed-form. Monte Carlo is slower but flexible. Greeks describe how the option changes when market inputs move.`;
  $("heroMc").textContent=mc.toFixed(2);
  const strikes=[]; for(let k=70;k<=135;k+=5) strikes.push(bsCall(S,k,r,sigma,T));
  drawLine("optionsChart", strikes, "call value across strikes");
  drawHero();
}

function runPortfolio(){
  const assets=[
    {ret:+$("retA").value, vol:+$("volA").value},
    {ret:+$("retB").value, vol:+$("volB").value},
    {ret:+$("retC").value, vol:+$("volC").value}
  ];
  const corr=[[1,.35,.55],[.35,1,.2],[.55,.2,1]];
  const points=[]; let best={s:-Infinity}, minv={v:Infinity};
  for(let n=0;n<5000;n++){
    let a=Math.random(),b=Math.random(),c=Math.random(),sum=a+b+c;
    const w=[a/sum,b/sum,c/sum];
    const ret=w.reduce((s,wi,i)=>s+wi*assets[i].ret,0);
    let variance=0;
    for(let i=0;i<3;i++) for(let j=0;j<3;j++) variance+=w[i]*w[j]*assets[i].vol*assets[j].vol*corr[i][j];
    const vol=Math.sqrt(variance), sharpe=(ret-.03)/vol;
    const p={x:vol,y:ret,w,s:sharpe};
    points.push(p);
    if(sharpe>best.s) best=p;
    if(vol<minv.v) minv={...p,v:vol};
  }
  best.best=true;
  const fmt=w=>w.map(x=>(x*100).toFixed(1)+"%").join(" / ");
  $("portfolioOutput").textContent=`Portfolio Optimizer Report

Maximum Sharpe portfolio:
weights A/B/C: ${fmt(best.w)}
expected return: ${(best.y*100).toFixed(2)}%
volatility: ${(best.x*100).toFixed(2)}%
Sharpe: ${best.s.toFixed(3)}

Minimum volatility portfolio:
weights A/B/C: ${fmt(minv.w)}
expected return: ${(minv.y*100).toFixed(2)}%
volatility: ${(minv.x*100).toFixed(2)}
Sharpe: ${minv.s.toFixed(3)}

Interpretation:
This random-search frontier is a practical prototype. A production C++ version would use covariance matrices, constraints, and optimization routines.`;
  $("heroSharpe").textContent=best.s.toFixed(2);
  drawScatter("frontierChart", points);
  drawHero();
}

function generatePricePath(days, drift=.08, vol=.22, start=100){
  const prices=[start], dt=1/252;
  for(let i=1;i<days;i++){
    const prev=prices[i-1];
    prices.push(prev*Math.exp((drift-.5*vol*vol)*dt+vol*Math.sqrt(dt)*randn()));
  }
  return prices;
}

function movingAverage(arr, idx, win){
  if(idx<win) return null;
  let s=0; for(let i=idx-win;i<idx;i++) s+=arr[i];
  return s/win;
}

function runBacktest(){
  const short=+$("shortMa").value,long=+$("longMa").value,cost=+$("cost").value,days=+$("days").value;
  const prices=generatePricePath(days,.09,.23,100);
  const returns=[], equity=[10000], buyHold=[10000];
  let prevPos=0;
  for(let i=1;i<prices.length;i++){
    const r=(prices[i]-prices[i-1])/prices[i-1];
    const sMA=movingAverage(prices,i,short), lMA=movingAverage(prices,i,long);
    const signal=(sMA!==null&&lMA!==null&&sMA>lMA)?1:0;
    const tradeCost=Math.abs(signal-prevPos)*cost;
    const stratR=prevPos*r-tradeCost;
    equity.push(equity[equity.length-1]*(1+stratR));
    buyHold.push(buyHold[buyHold.length-1]*(1+r));
    prevPos=signal;
  }
  const stratMetrics=metricsFromPrices(equity);
  const total=equity[equity.length-1]/equity[0]-1;
  const bh=buyHold[buyHold.length-1]/buyHold[0]-1;
  const sharpe=(stratMetrics.mean*252)/(stratMetrics.vol*Math.sqrt(252)||1);
  $("backtestOutput").textContent=`Strategy Backtest Report

strategy: moving-average crossover
short window: ${short}
long window: ${long}
transaction cost: ${(cost*100).toFixed(2)}%

strategy total return: ${(total*100).toFixed(2)}%
buy & hold return: ${(bh*100).toFixed(2)}%
strategy Sharpe: ${sharpe.toFixed(3)}
max drawdown: ${(stratMetrics.maxDD*100).toFixed(2)}%

Interpretation:
This is a research prototype, not a trading recommendation. The key lesson is that costs, signal lag, and parameter sensitivity can completely change a strategy.`;
  $("heroReturn").textContent=(total*100).toFixed(1)+"%";
  drawLine("backtestChart", equity, "strategy equity curve");
  drawHero();
}

function runScenario(){
  const initial=+$("scInitial").value, drift=+$("scDrift").value, vol=+$("scVol").value, years=+$("scYears").value, loss=+$("scLoss").value/100, paths=+$("scPaths").value;
  const finals=[], dt=1, threshold=initial*(1-loss);
  let bad=0;
  for(let i=0;i<paths;i++){
    const final=initial*Math.exp((drift-.5*vol*vol)*years+vol*Math.sqrt(years)*randn());
    finals.push(final); if(final<threshold) bad++;
  }
  finals.sort((a,b)=>a-b);
  const median=finals[Math.floor(paths*.5)], p5=finals[Math.floor(paths*.05)], p95=finals[Math.floor(paths*.95)];
  $("scenarioOutput").textContent=`Scenario Stress Report

initial value: $${initial.toLocaleString()}
years: ${years}
annual drift: ${(drift*100).toFixed(1)}%
annual volatility: ${(vol*100).toFixed(1)}%

median final value: $${median.toFixed(0)}
5th percentile: $${p5.toFixed(0)}
95th percentile: $${p95.toFixed(0)}

probability of losing ${(loss*100).toFixed(0)}%+: ${(bad/paths*100).toFixed(2)}%

Interpretation:
Scenario simulation is useful because it turns uncertainty into a distribution. The single expected value is less informative than the range of outcomes.`;
  drawLine("scenarioChart", finals.filter((_,i)=>i%Math.ceil(paths/100)===0), "sorted terminal outcomes");
}

function drawHero(){
  const c=$("heroCanvas"); if(!c)return;
  const ctx=c.getContext("2d"), w=c.width, h=c.height;
  ctx.clearRect(0,0,w,h);
  const series=generatePricePath(80,.10,.24,100);
  const min=Math.min(...series), max=Math.max(...series), range=max-min||1;
  ctx.strokeStyle="rgba(247,241,232,.15)"; ctx.lineWidth=1;
  for(let i=0;i<5;i++){let y=28+i*(h-54)/4;ctx.beginPath();ctx.moveTo(24,y);ctx.lineTo(w-20,y);ctx.stroke();}
  ctx.strokeStyle="#d7ff5f"; ctx.lineWidth=3; ctx.beginPath();
  series.forEach((v,i)=>{let x=24+i*(w-44)/(series.length-1), y=h-26-(v-min)/range*(h-54); if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.stroke();
  ctx.fillStyle="rgba(247,241,232,.72)";ctx.font="14px IBM Plex Mono";ctx.fillText("simulated market path",24,20);
}

document.addEventListener("DOMContentLoaded",()=>{
  $("runRisk").addEventListener("click",runRisk);
  document.querySelectorAll("[data-load]").forEach(btn=>btn.addEventListener("click",()=>{
    if(btn.dataset.load==="calm") $("riskPrices").value="100,101,101.5,102,102.8,103.1,103.9,104.2,105,105.5,106";
    else $("riskPrices").value="100,108,94,112,89,120,97,130,91,118,102,126,88";
    runRisk();
  }));
  $("runOptions").addEventListener("click",runOptions);
  $("runPortfolio").addEventListener("click",runPortfolio);
  $("runBacktest").addEventListener("click",runBacktest);
  $("runScenario").addEventListener("click",runScenario);
  runRisk(); runOptions(); runPortfolio(); runBacktest(); runScenario(); drawHero();
});
