/* ============================================================
   PathAhead — Career Roadmap Builder engine
   Reads window.BRANCHES / DOMAINS_DATA / STATES / YEARS and
   assembles a personalised roadmap from the user's selections.
   ============================================================ */
(function () {
  "use strict";

  // ---- Generic, branch-agnostic content ----------------------------------
  var RESUME = [
    "One page, clean and ATS-friendly (no photos, tables or fancy graphics)",
    "Contact + GitHub + LinkedIn links at the top",
    "3–5 strong projects with impact/metrics, not just descriptions",
    "Skills grouped (languages, frameworks, tools) — only ones you can defend",
    "Internships/POR with action verbs and outcomes",
    "Tailor keywords to each job description; export as PDF"
  ];
  var GITHUB = [
    "A clear profile README introducing you",
    "Pinned repositories showing your best 4–6 projects",
    "Every project has a README: problem, tech, screenshots, how to run",
    "Meaningful commit history (not one giant commit)",
    "At least one project deployed with a live link",
    "Contribute to 1–2 open-source repos (docs or good-first-issues)"
  ];
  var LINKEDIN = [
    "Professional photo + a headline that states your target role",
    "About section: who you are, your stack, what you're looking for",
    "Add projects, skills, and any internships/certifications",
    "Connect with seniors, alumni and recruiters; personalise requests",
    "Post about your projects/learnings monthly to stay visible",
    "Follow target companies and engage genuinely with their posts"
  ];
  var INTERVIEW = [
    "DSA: arrays, strings, hashing, two-pointers, recursion, trees, graphs, DP",
    "Practice on LeetCode/HackerRank; aim for ~150–250 curated problems",
    "Core subjects (OS, DBMS, CN, OOP) — common in Indian placements",
    "Project deep-dive: be ready to defend every choice you made",
    "System design basics for final-year/senior roles",
    "HR + behavioural: STAR format, why this company, your strengths"
  ];
  var MISTAKES = [
    "Tutorial hell — watching endlessly without building anything",
    "Learning too many things shallowly instead of one stack deeply",
    "No GitHub/portfolio to prove skills",
    "Starting placement prep only in final year",
    "Ignoring communication and aptitude",
    "Chasing trends over fundamentals (DSA, CS core, or branch core)"
  ];
  var INTERNSHIP_STEPS = [
    "Build 2–3 solid projects first — proof beats claims",
    "Polish GitHub, LinkedIn and a one-page resume",
    "Apply on Internshala, LinkedIn, company careers pages and AICTE",
    "Cold-email founders/engineers with a short, specific pitch + your work",
    "Ask seniors/alumni for referrals — the highest-yield channel",
    "Track every application (company, date, status) in a sheet",
    "Prepare for OA + a project/DSA interview round"
  ];
  var PLACEMENT_PROCESS = [
    "Online assessment (aptitude + coding)",
    "1–2 technical interviews (DSA, projects, core subjects)",
    "System design / advanced round (for some roles)",
    "HR / behavioural round",
    "Offer + (sometimes) a bond or training period"
  ];

  var GOALS = {
    placement: { label: "Placement (job)", steps: [
      "Lock your target domain and build 3–5 portfolio projects in it",
      "Start DSA + core-subject prep by 3rd year (earlier is better)",
      "Do at least one internship before final year",
      "Apply on-campus AND off-campus; don't rely on one channel",
      "Mock interviews with peers; refine resume for each role" ] },
    higher: { label: "Higher Studies", steps: [
      "Decide M.Tech (GATE) vs MS abroad (GRE/IELTS) vs MBA (CAT/GMAT) early",
      "Maintain a strong CGPA — it matters for admits and scholarships",
      "For MS: build research/projects and approach professors",
      "Prepare for the entrance exam ~1 year in advance",
      "Shortlist universities, note deadlines, arrange LORs and SOP" ] },
    entrepreneur: { label: "Entrepreneurship / Startup", steps: [
      "Find a real problem you understand; validate with real users",
      "Build a small MVP fast and get feedback",
      "Use your college's incubation cell / E-Cell",
      "Explore Startup India, MSME, and state startup grants",
      "Learn basics of business model, marketing and unit economics" ] },
    government: { label: "Government / PSU Jobs", steps: [
      "Most core PSUs recruit through GATE — start GATE prep by 3rd year",
      "Track UPSC ESE/IES (for eligible branches) and SSC JE",
      "Watch state PSC and PSU notifications for your branch",
      "Keep documents and eligibility (age, marks) in order",
      "Balance a placement backup while preparing" ] },
    international: { label: "International Career", steps: [
      "Build globally-relevant, in-demand skills (cloud, AI, full-stack)",
      "A strong English + communication level is essential",
      "Contribute to open source to build a visible global profile",
      "Target remote-first companies and international internships",
      "For relocation, research visas (e.g. work permits, MS→job routes)" ] }
  };

  function esc(s){ return String(s == null ? "" : s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function chips(arr, alt){ if(!arr||!arr.length) return ""; return '<div class="chips">'+arr.map(function(x){return '<span class="chip'+(alt?' alt':'')+'">'+esc(x)+'</span>';}).join("")+'</div>'; }
  function list(arr){ if(!arr||!arr.length) return ""; return '<ul>'+arr.map(function(x){return '<li>'+esc(x)+'</li>';}).join("")+'</ul>'; }
  function bySlug(arr, slug){ arr=arr||[]; for(var i=0;i<arr.length;i++){ if(arr[i].slug===slug) return arr[i]; } return null; }

  // ---- Resource links -----------------------------------------------------
  // Known platforms -> their real URL (specific keys BEFORE generic ones).
  var LINKS = {
    "the odin project":"https://www.theodinproject.com/","odin project":"https://www.theodinproject.com/",
    "full stack open":"https://fullstackopen.com/","fullstackopen":"https://fullstackopen.com/",
    "javascript.info":"https://javascript.info/","freecodecamp":"https://www.freecodecamp.org/learn/",
    "frontend mentor":"https://www.frontendmentor.io/","the net ninja":"https://www.youtube.com/@NetNinja",
    "programming with mosh":"https://www.youtube.com/@programmingwithmosh","traversy":"https://www.youtube.com/@TraversyMedia",
    "corey schafer":"https://www.youtube.com/@coreyms","fireship":"https://www.youtube.com/@Fireship",
    "techworld with nana":"https://www.youtube.com/@TechWorldwithNana","tech world with nana":"https://www.youtube.com/@TechWorldwithNana",
    "statquest":"https://www.youtube.com/@statquest","3blue1brown":"https://www.youtube.com/@3blue1brown",
    "sentdex":"https://www.youtube.com/@sentdex","mdn":"https://developer.mozilla.org/",
    "w3schools":"https://www.w3schools.com/","geeksforgeeks":"https://www.geeksforgeeks.org/",
    "codecademy":"https://www.codecademy.com/","cs50":"https://cs50.harvard.edu/x/",
    "fast.ai":"https://course.fast.ai/","khan academy":"https://www.khanacademy.org/",
    "nptel":"https://nptel.ac.in/","leetcode":"https://leetcode.com/","hackerrank":"https://www.hackerrank.com/",
    "codewars":"https://www.codewars.com/","codeforces":"https://codeforces.com/",
    "kaggle":"https://www.kaggle.com/learn","tryhackme":"https://tryhackme.com/",
    "hackthebox":"https://www.hackthebox.com/","hack the box":"https://www.hackthebox.com/",
    "owasp":"https://owasp.org/www-project-top-ten/","professor messer":"https://www.professormesser.com/",
    "aws skill builder":"https://skillbuilder.aws/","aws":"https://aws.amazon.com/training/",
    "microsoft learn":"https://learn.microsoft.com/training/","azure":"https://learn.microsoft.com/training/azure/",
    "google cloud":"https://cloud.google.com/learn","kodekloud":"https://kodekloud.com/",
    "docker":"https://docs.docker.com/get-started/","kubernetes":"https://kubernetes.io/docs/tutorials/",
    "terraform":"https://developer.hashicorp.com/terraform/tutorials","flutter":"https://docs.flutter.dev/get-started",
    "firebase":"https://firebase.google.com/docs","react native":"https://reactnative.dev/docs/getting-started",
    "android":"https://developer.android.com/courses","google codelabs":"https://codelabs.developers.google.com/",
    "figma":"https://www.figma.com/resources/learn-design/","refactoring ui":"https://www.refactoringui.com/",
    "laws of ux":"https://lawsofux.com/","nielsen norman":"https://www.nngroup.com/articles/",
    "google ux":"https://www.coursera.org/professional-certificates/google-ux-design",
    "dbt":"https://learn.getdbt.com/","data engineering zoomcamp":"https://github.com/DataTalksClub/data-engineering-zoomcamp",
    "datacamp":"https://www.datacamp.com/","mode":"https://mode.com/sql-tutorial/",
    "unity learn":"https://learn.unity.com/","unreal":"https://dev.epicgames.com/community/unreal-engine/learning",
    "godot":"https://docs.godotengine.org/","blender":"https://www.blender.org/support/tutorials/",
    "gamedev.tv":"https://www.gamedev.tv/","alchemy":"https://university.alchemy.com/",
    "cyfrin":"https://updraft.cyfrin.io/","solidity":"https://docs.soliditylang.org/",
    "coursera":"https://www.coursera.org/","edx":"https://www.edx.org/","udemy":"https://www.udemy.com/",
    "udacity":"https://www.udacity.com/","github":"https://github.com/","roadmap.sh":"https://roadmap.sh/"
  };
  function resourceURL(text, kind){
    var lower=String(text).toLowerCase();
    for(var key in LINKS){ if(lower.indexOf(key)!==-1) return LINKS[key]; }
    if(kind==="youtube") return "https://www.youtube.com/results?search_query="+encodeURIComponent(text);
    return "https://www.google.com/search?q="+encodeURIComponent(text);
  }
  function resourceLink(text, kind){
    return '<a href="'+resourceURL(text,kind)+'" target="_blank" rel="noopener noreferrer">'+esc(text)+'</a>';
  }
  function linkList(arr, kind){ if(!arr||!arr.length) return ""; return '<ul>'+arr.map(function(x){return '<li>'+resourceLink(x,kind)+'</li>';}).join("")+'</ul>'; }

  // ---- Progress tracker (saved in the browser) ----------------------------
  var PKEY = "pa-progress";
  function loadProg(){ try { return JSON.parse(localStorage.getItem(PKEY) || "{}") || {}; } catch (e) { return {}; } }
  function saveProg(p){ try { localStorage.setItem(PKEY, JSON.stringify(p)); } catch (e) {} }
  var PROG = loadProg();
  function checklist(section, arr){
    if(!arr || !arr.length) return "";
    var done = 0;
    var items = arr.map(function(x){
      var k = section + "::" + x, on = !!PROG[k]; if(on) done++;
      return '<li class="'+(on?"on":"")+'"><label><input type="checkbox" data-k="'+esc(k)+'"'+(on?" checked":"")+'> <span>'+esc(x)+'</span></label></li>';
    }).join("");
    return '<div class="chk-bar"><span class="chk-count">'+done+'</span> / '+arr.length+' done</div><ul class="checklist">'+items+'</ul>';
  }

  var NUM = 0;
  function block(title, inner){ NUM++; return '<div class="rm-block reveal"><h3><span class="rm-num">'+NUM+'</span>'+esc(title)+'</h3>'+inner+'</div>'; }

  // ---- Populate selects ---------------------------------------------------
  function opt(v,l){ return '<option value="'+esc(v)+'">'+esc(l)+'</option>'; }

  function fillBranches(){
    var sel=document.getElementById("sel-branch");
    var b=(window.BRANCHES||[]).slice().sort(function(a,c){return a.name.localeCompare(c.name);});
    sel.innerHTML='<option value="">Select branch…</option>'+b.map(function(x){return opt(x.slug,x.name);}).join("");
  }
  function fillStates(){
    var sel=document.getElementById("sel-state");
    var s=(window.STATES||[]).map(function(x,i){return {i:i,name:x.name};}).sort(function(a,c){return a.name.localeCompare(c.name);});
    sel.innerHTML='<option value="">Select state…</option>'+s.map(function(x){return opt(x.i,x.name);}).join("");
  }
  function fillDomains(branchSlug){
    var sel=document.getElementById("sel-domain");
    var all=window.DOMAINS_DATA||[];
    var br=bySlug(window.BRANCHES,branchSlug);
    var html='<option value="">Any / general</option>';
    if(br && br.topDomains && br.topDomains.length){
      var rec=br.topDomains.map(function(sl){return bySlug(all,sl);}).filter(Boolean);
      if(rec.length){ html+='<optgroup label="Recommended for '+esc(br.name)+'">'+rec.map(function(d){return opt(d.slug,d.name);}).join("")+'</optgroup>'; }
      var recSet={}; br.topDomains.forEach(function(s){recSet[s]=1;});
      var others=all.filter(function(d){return !recSet[d.slug];}).sort(function(a,c){return a.name.localeCompare(c.name);});
      html+='<optgroup label="Other domains">'+others.map(function(d){return opt(d.slug,d.name);}).join("")+'</optgroup>';
    } else {
      html+=all.slice().sort(function(a,c){return a.name.localeCompare(c.name);}).map(function(d){return opt(d.slug,d.name);}).join("");
    }
    sel.innerHTML=html;
  }

  // ---- Build the roadmap --------------------------------------------------
  function build(){
    var branch=bySlug(window.BRANCHES, document.getElementById("sel-branch").value);
    var year=parseInt(document.getElementById("sel-year").value,10);
    var domain=bySlug(window.DOMAINS_DATA, document.getElementById("sel-domain").value);
    var stIdx=document.getElementById("sel-state").value;
    var state=(stIdx!=="" && window.STATES)?window.STATES[parseInt(stIdx,10)]:null;
    var goalKey=document.getElementById("sel-goal").value;
    var goal=GOALS[goalKey]||GOALS.placement;
    var out=document.getElementById("rm-output");

    if(!branch){ out.innerHTML='<div class="empty-hint">Please select your <strong>branch</strong> to generate a roadmap.</div>'; return; }

    NUM=0;
    var html="";

    // 1. Overview
    var yrLabel = year>=1&&year<=4 ? (["","1st","2nd","3rd","Final"][year]+" year") : "diploma / other";
    html+=block("Overview",
      '<p>'+esc(branch.summary||branch.name)+'</p>'+
      '<p><strong>Your profile:</strong> '+esc(branch.name)+' · '+esc(yrLabel)+
      (domain?(' · aiming for <strong>'+esc(domain.name)+'</strong>'):'')+
      (state?(' · '+esc(state.name)):'')+' · goal: '+esc(goal.label)+'.</p>'+
      (domain?'':'<p class="disc">Tip: pick a <strong>target domain</strong> above to get domain-specific skills, projects and salary guidance.</p>'));

    // 2. Learning Path
    var path=[].concat(branch.coreSkills||[]);
    if(domain){ path=path.concat(["→ Specialise in "+domain.name].concat(domain.skills||[])); }
    html+=block("Learning Path", '<p>Build in this rough order — fundamentals first, then specialise.</p>'+list(path.slice(0,16)));

    // 3. Skills Required
    var skInner='<p><strong>Branch core skills</strong></p>'+chips(branch.coreSkills)+
      '<p><strong>Tools</strong></p>'+chips(branch.tools,true);
    if(domain){ skInner+='<p><strong>'+esc(domain.name)+' skills</strong></p>'+chips(domain.skills)+
      '<p><strong>'+esc(domain.name)+' tools</strong></p>'+chips(domain.tools,true); }
    html+=block("Skills Required", skInner);

    // 4. Semester Plan
    var sems=[]; (window.YEARS||[]).forEach(function(y){ (y.semesters||[]).forEach(function(s){ sems.push({y:y.year,foc:y.focus,s:s}); }); });
    var nowSet={}; if(year>=1&&year<=4){ nowSet[year*2-1]=1; nowSet[year*2]=1; }
    var semHtml=sems.map(function(o){
      var s=o.s, isNow=nowSet[s.sem];
      return '<div class="sem'+(isNow?' now':'')+'"><h5>Semester '+s.sem+' <span class="muted" style="font-weight:600;font-size:.78rem">(Year '+o.y+')</span>'+(isNow?'<span class="tag-now">You are here</span>':'')+'</h5>'+
        '<p><span class="lbl">Skills:</span> '+esc((s.skills||[]).join(", "))+'</p>'+
        ((s.projects&&s.projects.length)?'<p><span class="lbl">Projects:</span> '+esc(s.projects.join(", "))+'</p>':'')+
        ((s.certs&&s.certs.length)?'<p><span class="lbl">Certs:</span> '+esc(s.certs.join(", "))+'</p>':'')+
        ((s.soft&&s.soft.length)?'<p><span class="lbl">Career:</span> '+esc(s.soft.join(", "))+'</p>':'')+
        (s.milestone?'<p class="disc">'+esc(s.milestone)+'</p>':'')+'</div>';
    }).join("");
    html+=block("Semester-by-Semester Plan", (year>=1&&year<=4?'<p>Your current semesters are highlighted. Catch up on anything from earlier semesters you skipped.</p>':'')+'<div class="sem-grid">'+semHtml+'</div>');

    // 5. Projects
    if(domain && domain.projects){
      var p=domain.projects;
      html+=block("Projects to Build ("+esc(domain.name)+")",
        '<div class="cols">'+
        '<div class="col"><h5>Beginner</h5>'+list(p.beginner)+'</div>'+
        '<div class="col"><h5>Intermediate</h5>'+list(p.intermediate)+'</div>'+
        '<div class="col"><h5>Advanced</h5>'+list(p.advanced)+'</div>'+
        '</div>'+(domain.page?'<p style="margin-top:12px">Full week-by-week plan: <a href="'+esc(domain.page)+'">'+esc(domain.name)+' roadmap →</a></p>':''));
    } else {
      html+=block("Projects to Build", '<p>Pick a target domain above to get 18 tailored project ideas (beginner → advanced). In general: start small, finish things, and put every project on GitHub with a README.</p>');
    }

    // 6. Certifications (clickable)
    var higher = (branch.higherStudies||[]).map(function(h){return "Higher study option: "+h;});
    html+=block("Certifications & Credentials",
      '<p>Free and well-known options first — a certificate only matters if you can back it with a project. Links open the provider.</p>'+
      (domain&&domain.certs&&domain.certs.length ? ('<p><strong>Certifications & courses</strong></p>'+linkList(domain.certs)) : '')+
      '<p><strong>Higher-study options</strong></p>'+list(higher));

    // 6b. Learning Resources — every item is a clickable link
    var rsrc = (domain && window.RESOURCES) ? window.RESOURCES[domain.slug] : null;
    if(rsrc){
      html+=block("Learning Resources ("+esc(domain.name)+")",
        '<p>Click any resource to open it. Free and well-known first — prefer building over binge-watching.</p>'+
        '<div class="res-grid">'+
        '<div class="col"><h5>Books</h5>'+linkList(rsrc.books,"book")+'</div>'+
        '<div class="col"><h5>Courses</h5>'+linkList(rsrc.courses,"course")+'</div>'+
        '<div class="col"><h5>YouTube</h5>'+linkList(rsrc.youtube,"youtube")+'</div>'+
        '<div class="col"><h5>Practice</h5>'+linkList(rsrc.practice,"practice")+'</div>'+
        '</div>'+
        '<p class="res-universal">Universal (any field): '+
          '<a href="https://roadmap.sh/" target="_blank" rel="noopener noreferrer">roadmap.sh</a> · '+
          '<a href="https://www.freecodecamp.org/learn/" target="_blank" rel="noopener noreferrer">freeCodeCamp</a> · '+
          '<a href="https://education.github.com/pack" target="_blank" rel="noopener noreferrer">GitHub Student Pack</a> · '+
          '<a href="https://www.coursera.org/" target="_blank" rel="noopener noreferrer">Coursera</a> · '+
          '<a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">YouTube</a>'+
        '</p>');
    }

    // 7. Internships
    html+=block("Internship Roadmap", checklist("Internship", INTERNSHIP_STEPS));

    // 8. Placements
    var empl = state && state.notableEmployers ? '<p><strong>Employers with presence in '+esc(state.name)+':</strong></p>'+chips(state.notableEmployers,true) : '';
    html+=block("Placement Roadmap",
      '<p><strong>Typical selection process</strong></p>'+list(PLACEMENT_PROCESS)+empl+
      (domain?'<p style="margin-top:10px"><strong>Indicative starting salary ('+esc(domain.name)+'):</strong> ₹'+esc((domain.salaryINR||"").replace(/^₹/,''))+' — broad range, varies by company, city and skill.</p>':''));

    // 9-12 Checklists (interactive — progress saved in your browser)
    html+=block("Resume Checklist", checklist("Resume", RESUME));
    html+=block("GitHub Checklist", checklist("GitHub", GITHUB));
    html+=block("LinkedIn Checklist", checklist("LinkedIn", LINKEDIN));
    html+=block("Interview Preparation", checklist("Interview", INTERVIEW));

    // 13. Salary
    html+=block("Salary Expectations",
      (domain?'<div class="salary-big">₹'+esc((domain.salaryINR||"").replace(/^₹/,''))+'</div><p>Indicative starting range in India for '+esc(domain.name)+' roles.</p>':'<p>Select a domain for an indicative salary range.</p>')+
      '<p class="disc">Salary is an outcome of skill, projects and interview performance — not a guarantee. Ranges vary widely by city, company tier and role.</p>');

    // 14. Future Trends
    html+=block("Future Trends", '<p>Across engineering, these are rising fast — worth blending into your plan:</p>'+
      list(["AI & Generative AI woven into every domain","Cloud-native and DevOps everywhere","Data literacy (SQL, analytics) as a baseline skill","Automation and IoT in core branches","Sustainability, EVs and renewable energy","Cybersecurity demand growing across sectors"]));

    // 15. Common Mistakes
    html+=block("Common Mistakes to Avoid", list(MISTAKES));

    // 16. State Opportunities
    if(state){
      html+=block("Opportunities in "+esc(state.name),
        '<div class="two-col">'+
        '<div><p><strong>Notable colleges</strong></p>'+chips(state.topColleges,true)+
        '<p><strong>Key industries</strong></p>'+chips(state.keyIndustries)+'</div>'+
        '<div><p><strong>Tech / industrial hubs</strong></p>'+chips(state.techHubs,true)+
        '<p><strong>Government routes</strong></p>'+chips(state.govOpportunities)+'</div>'+
        '</div>'+
        (state.startupEcosystem?'<p style="margin-top:10px"><strong>Startup ecosystem:</strong> '+esc(state.startupEcosystem)+'</p>':''));
    }

    // 17. Goal-specific + Higher studies
    html+=block("Path for your goal — "+esc(goal.label), checklist("Goal-"+goalKey, goal.steps)+
      (branch.govExams&&(goalKey==="government")?'<p style="margin-top:8px"><strong>Relevant exams/PSUs for '+esc(branch.name)+':</strong></p>'+chips(branch.govExams,true):''));

    // 18. Personalised Next Steps
    var next=[];
    if(year<=1){ next=["Pick ONE programming language and go deep this semester","Set up GitHub + LinkedIn now","Explore 2–3 domains to find what excites you","Start light aptitude practice"]; }
    else if(year===2){ next=["Commit to a target domain","Build your first 2 real projects and put them on GitHub","Begin DSA consistently","Join a hackathon or coding contest"]; }
    else if(year===3){ next=["Ship 2–3 strong domain projects","Land a summer internship","Polish resume, GitHub, LinkedIn","Ramp up DSA + core-subject placement prep"]; }
    else if(year===4){ next=["Grind DSA + mock interviews","Apply on- and off-campus aggressively","Finish a standout capstone project","Finalise: job vs higher studies vs startup"]; }
    else { next=["Map your current skills to a target domain","Fast-track projects to prove ability","Fix resume/GitHub/LinkedIn","Apply widely and prepare for interviews"]; }
    if(domain&&domain.page){ next.push("Follow the full "+domain.name+" roadmap: open its page from Projects above"); }
    html+=block("Your Personalised Next Steps", '<p>Start here — this week. Tick items off as you go; your progress is saved on this device.</p>'+checklist("NextSteps", next));

    out.innerHTML=html;
    // The site's scroll-reveal observer only watches elements present at page
    // load, so dynamically-inserted .reveal blocks would stay at opacity:0.
    // Force them visible immediately.
    var rev=out.querySelectorAll(".reveal");
    for(var r=0;r<rev.length;r++){ rev[r].classList.add("in"); }
    // Save the selection to the URL so this exact roadmap can be shared/bookmarked.
    updateURL(branch, year, domain, state, goalKey);
    document.getElementById("btn-print").style.display="";
    document.getElementById("btn-copy").style.display="";
    out.scrollIntoView({behavior:"smooth",block:"start"});
  }

  // ---- Shareable URL state ------------------------------------------------
  function updateURL(branch, year, domain, state, goalKey){
    var p=new URLSearchParams();
    p.set("b", branch.slug);
    p.set("y", String(year));
    if(domain) p.set("d", domain.slug);
    if(state && state.code) p.set("s", state.code);
    p.set("g", goalKey);
    try { history.replaceState(null, "", location.pathname + "?" + p.toString()); } catch(e) {}
  }
  function applyURL(){
    var p=new URLSearchParams(location.search);
    if(!p.get("b")) return false;
    var bsel=document.getElementById("sel-branch");
    if(!bySlug(window.BRANCHES, p.get("b"))) return false;
    bsel.value=p.get("b"); fillDomains(bsel.value);
    if(p.get("y")) document.getElementById("sel-year").value=p.get("y");
    if(p.get("d")){ var d=document.getElementById("sel-domain"); if(bySlug(window.DOMAINS_DATA,p.get("d"))) d.value=p.get("d"); }
    if(p.get("s")){
      var idx=-1; (window.STATES||[]).forEach(function(st,i){ if(st.code===p.get("s")) idx=i; });
      if(idx>=0) document.getElementById("sel-state").value=String(idx);
    }
    if(p.get("g") && GOALS[p.get("g")]) document.getElementById("sel-goal").value=p.get("g");
    return true;
  }

  // ---- Wire up ------------------------------------------------------------
  function init(){
    if(!window.BRANCHES||!window.STATES||!window.DOMAINS_DATA||!window.YEARS){
      var out=document.getElementById("rm-output");
      if(out) out.innerHTML='<div class="empty-hint">Roadmap data is still loading — please refresh in a moment.</div>';
      return;
    }
    fillBranches(); fillStates(); fillDomains("");
    document.getElementById("sel-branch").addEventListener("change",function(){ fillDomains(this.value); });
    document.getElementById("btn-build").addEventListener("click",build);
    document.getElementById("btn-print").addEventListener("click",function(){ window.print(); });

    // Copy shareable link
    document.getElementById("btn-copy").addEventListener("click",function(){
      var btn=this, orig=btn.textContent;
      function done(){ btn.textContent="✓ Link copied"; setTimeout(function(){ btn.textContent=orig; },1800); }
      try {
        if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(location.href).then(done, fallback); }
        else fallback();
      } catch(e){ fallback(); }
      function fallback(){ var t=document.createElement("textarea"); t.value=location.href; document.body.appendChild(t); t.select();
        try{ document.execCommand("copy"); }catch(e){} document.body.removeChild(t); done(); }
    });

    // Delegated: persist checklist ticks + update the "x / y done" counter
    document.getElementById("rm-output").addEventListener("change",function(e){
      var cb=e.target; if(!cb || cb.tagName!=="INPUT" || cb.getAttribute("data-k")==null) return;
      var k=cb.getAttribute("data-k");
      if(cb.checked) PROG[k]=1; else delete PROG[k];
      saveProg(PROG);
      var li=cb.closest("li"); if(li) li.classList.toggle("on", cb.checked);
      var ul=cb.closest("ul"); var bar=ul && ul.previousElementSibling;
      if(bar && bar.className==="chk-bar"){ var c=bar.querySelector(".chk-count"); if(c) c.textContent=ul.querySelectorAll("input:checked").length; }
    });

    // Auto-generate from a shared/bookmarked link
    if(applyURL()) build();
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init); else init();
})();
