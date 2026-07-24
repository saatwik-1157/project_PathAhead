# -*- coding: utf-8 -*-
"""
PathAhead roadmap generator
============================
Generates a consistent "learn from scratch" roadmap page + print-ready PDF
source for every tech career domain, plus a hub page linking them all.

Run:  python build_roadmaps.py
Then render PDFs with the accompanying render_pdfs.sh (Chrome headless).

Output:
  <root>/<slug>-roadmap.html      -> live website page (uses site css/js)
  <root>/roadmaps.html            -> hub page listing all roadmaps
  <root>/roadmaps/<slug>_print.html -> standalone print source for the PDF
"""

import os
import re
import json

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BUILD = os.path.join(ROOT, "roadmaps")

# ----------------------------------------------------------------------
# Learning resources — reuse career-data/resources.js as the single source
# of truth, and turn each item into a real clickable link (same resolver as
# the Career Builder). Known platforms -> real URL; else a smart search.
# ----------------------------------------------------------------------
def load_resources():
    try:
        txt = open(os.path.join(ROOT, "career-data", "resources.js"), encoding="utf-8").read()
        txt = txt[txt.index("{"):txt.rindex("}") + 1]
        txt = re.sub(r'\b(books|courses|youtube|practice)\s*:', r'"\1":', txt)
        return json.loads(txt)
    except Exception as e:
        print("WARN: could not parse resources.js:", e)
        return {}

RES = load_resources()
# generator page-slug -> resources.js slug (only cybersecurity differs)
RESOURCE_SLUG = {"cybersecurity": "cyber-security"}

LINKS = {
    "the odin project": "https://www.theodinproject.com/", "odin project": "https://www.theodinproject.com/",
    "full stack open": "https://fullstackopen.com/", "fullstackopen": "https://fullstackopen.com/",
    "javascript.info": "https://javascript.info/", "freecodecamp": "https://www.freecodecamp.org/learn/",
    "frontend mentor": "https://www.frontendmentor.io/", "the net ninja": "https://www.youtube.com/@NetNinja",
    "programming with mosh": "https://www.youtube.com/@programmingwithmosh", "traversy": "https://www.youtube.com/@TraversyMedia",
    "corey schafer": "https://www.youtube.com/@coreyms", "fireship": "https://www.youtube.com/@Fireship",
    "techworld with nana": "https://www.youtube.com/@TechWorldwithNana", "tech world with nana": "https://www.youtube.com/@TechWorldwithNana",
    "statquest": "https://www.youtube.com/@statquest", "3blue1brown": "https://www.youtube.com/@3blue1brown",
    "sentdex": "https://www.youtube.com/@sentdex", "mdn": "https://developer.mozilla.org/",
    "w3schools": "https://www.w3schools.com/", "geeksforgeeks": "https://www.geeksforgeeks.org/",
    "codecademy": "https://www.codecademy.com/", "cs50": "https://cs50.harvard.edu/x/",
    "fast.ai": "https://course.fast.ai/", "khan academy": "https://www.khanacademy.org/",
    "nptel": "https://nptel.ac.in/", "leetcode": "https://leetcode.com/", "hackerrank": "https://www.hackerrank.com/",
    "codewars": "https://www.codewars.com/", "codeforces": "https://codeforces.com/",
    "kaggle": "https://www.kaggle.com/learn", "tryhackme": "https://tryhackme.com/",
    "hackthebox": "https://www.hackthebox.com/", "hack the box": "https://www.hackthebox.com/",
    "owasp": "https://owasp.org/www-project-top-ten/", "professor messer": "https://www.professormesser.com/",
    "aws skill builder": "https://skillbuilder.aws/", "aws": "https://aws.amazon.com/training/",
    "microsoft learn": "https://learn.microsoft.com/training/", "azure": "https://learn.microsoft.com/training/azure/",
    "google cloud": "https://cloud.google.com/learn", "kodekloud": "https://kodekloud.com/",
    "docker": "https://docs.docker.com/get-started/", "kubernetes": "https://kubernetes.io/docs/tutorials/",
    "terraform": "https://developer.hashicorp.com/terraform/tutorials", "flutter": "https://docs.flutter.dev/get-started",
    "firebase": "https://firebase.google.com/docs", "react native": "https://reactnative.dev/docs/getting-started",
    "android": "https://developer.android.com/courses", "google codelabs": "https://codelabs.developers.google.com/",
    "figma": "https://www.figma.com/resources/learn-design/", "refactoring ui": "https://www.refactoringui.com/",
    "laws of ux": "https://lawsofux.com/", "nielsen norman": "https://www.nngroup.com/articles/",
    "google ux": "https://www.coursera.org/professional-certificates/google-ux-design",
    "dbt": "https://learn.getdbt.com/", "data engineering zoomcamp": "https://github.com/DataTalksClub/data-engineering-zoomcamp",
    "datacamp": "https://www.datacamp.com/", "mode": "https://mode.com/sql-tutorial/",
    "unity learn": "https://learn.unity.com/", "unreal": "https://dev.epicgames.com/community/unreal-engine/learning",
    "godot": "https://docs.godotengine.org/", "blender": "https://www.blender.org/support/tutorials/",
    "gamedev.tv": "https://www.gamedev.tv/", "alchemy": "https://university.alchemy.com/",
    "cyfrin": "https://updraft.cyfrin.io/", "solidity": "https://docs.soliditylang.org/",
    "coursera": "https://www.coursera.org/", "edx": "https://www.edx.org/", "udemy": "https://www.udemy.com/",
    "udacity": "https://www.udacity.com/", "github": "https://github.com/", "roadmap.sh": "https://roadmap.sh/",
}

def _res_url(text, kind):
    import urllib.parse as up
    low = text.lower()
    for key, url in LINKS.items():
        if key in low:
            return url
    if kind == "youtube":
        return "https://www.youtube.com/results?search_query=" + up.quote(text)
    return "https://www.google.com/search?q=" + up.quote(text)

def _res_links(arr, kind):
    if not arr:
        return ""
    lis = "".join('<li><a href="%s" target="_blank" rel="noopener noreferrer">%s</a></li>' % (_res_url(x, kind), x) for x in arr)
    return "<ul>" + lis + "</ul>"

UNIVERSAL = ('<p class="res-universal">Universal (any field): '
    '<a href="https://roadmap.sh/" target="_blank" rel="noopener noreferrer">roadmap.sh</a> · '
    '<a href="https://www.freecodecamp.org/learn/" target="_blank" rel="noopener noreferrer">freeCodeCamp</a> · '
    '<a href="https://education.github.com/pack" target="_blank" rel="noopener noreferrer">GitHub Student Pack</a> · '
    '<a href="https://www.coursera.org/" target="_blank" rel="noopener noreferrer">Coursera</a></p>')

def resources_section_web(page_slug):
    r = RES.get(RESOURCE_SLUG.get(page_slug, page_slug))
    if not r:
        return ""
    def col(t, arr, kind):
        return '<div class="col"><h5>%s</h5>%s</div>' % (t, _res_links(arr, kind))
    return ('<section class="section">\n    <div class="container">\n'
        '      <div class="section-head"><span class="eyebrow reveal">Learn It</span>'
        '<h2 class="h-xl reveal reveal-d1">Learning resources</h2>'
        '<p class="lead reveal reveal-d2">Click any resource to open it — free and well-known first, then build something with it.</p></div>\n'
        '      <div class="res-grid reveal">'
        + col("Books", r.get("books"), "book") + col("Courses", r.get("courses"), "course")
        + col("YouTube", r.get("youtube"), "youtube") + col("Practice", r.get("practice"), "practice")
        + '</div>' + UNIVERSAL + '\n    </div>\n  </section>')

def resources_block_print(page_slug):
    r = RES.get(RESOURCE_SLUG.get(page_slug, page_slug))
    if not r:
        return ""
    def col(t, arr, kind):
        return '<div class="rcol"><span class="k">%s</span>%s</div>' % (t, _res_links(arr, kind))
    return ('<div class="section" style="margin-top:16px"><div class="sec-kick">Learn It</div>'
        '<h2 class="sec">Learning resources</h2><div class="rule"></div>'
        '<p class="lead">Every item links to the real source (clickable in this PDF).</p>'
        '<div class="res-print">'
        + col("Books", r.get("books"), "book") + col("Courses", r.get("courses"), "course")
        + col("YouTube", r.get("youtube"), "youtube") + col("Practice", r.get("practice"), "practice")
        + '</div></div>')

# ----------------------------------------------------------------------
# DATA — every domain's curriculum. AI/ML already has a hand-built page,
# so it is listed in the hub but not regenerated here.
# Each phase: (num, name, weeks_label, goal, [ (week_label, title, desc, is_project), ... ])
# ----------------------------------------------------------------------

DOMAINS = [
  {
    "slug": "web-development",
    "name": "Full-Stack Web Developer",
    "accent": "Full-Stack Web Developer",
    "h1_pre": "Become a ", "h1_post": " from scratch",
    "meta": "A complete 22-week roadmap to become a full-stack web developer from scratch — HTML, CSS, JavaScript, React, Node, databases, and deployment.",
    "lead": "No degree needed to start. Go from a blank page to shipping full-stack apps in about five months — built around real projects you can show employers.",
    "stats": [("22", "weeks · ~10–12 hrs/wk"), ("5", "portfolio projects"), ("4", "phases · zero to deploy"), ("₹0", "free resources only")],
    "rule_title": "Learn → build it → deploy it",
    "rule_lead": "Reading docs without building is wasted time. Every concept below ships as something live on the internet. Put every project on GitHub and deploy it free.",
    "phases": [
      (0, "Foundations", "Weeks 1–4", "Structure and style the web — HTML, CSS, and Git.", [
        ("Week 1", "HTML fundamentals", "Semantic tags, forms, links, images, accessibility.", False),
        ("Week 2", "CSS & layout", "The box model, Flexbox, and CSS Grid.", False),
        ("Week 3", "Responsive design", "Media queries, variables, transitions, mobile-first.", False),
        ("Week 4", "Git & tooling", "Git, GitHub, VS Code; deploy a static site free.", False),
      ]),
      (1, "JavaScript", "Weeks 5–9", "Make pages interactive with real JavaScript.", [
        ("Week 5", "JS basics", "Variables, functions, arrays, objects, loops.", False),
        ("Week 6", "DOM & events", "Manipulate the page, handle clicks and input.", False),
        ("Week 7", "Async & APIs", "Promises, fetch, JSON, calling real APIs.", False),
        ("Week 8", "Modern JS", "ES6+, modules, npm, array methods.", False),
        ("Week 9 · Project ▶", "Interactive app", "Build a weather or to-do app using an API.", True),
      ]),
      (2, "Frontend with React", "Weeks 10–15", "Build modern single-page apps with React.", [
        ("Week 10", "React basics", "Components, JSX, props, rendering.", False),
        ("Week 11", "State & hooks", "useState, useEffect, lifting state.", False),
        ("Week 12", "Routing & forms", "React Router, controlled inputs, validation.", False),
        ("Week 13", "Data fetching", "Call APIs, handle loading and error states.", False),
        ("Week 14", "Styling & UI", "Tailwind or a component library.", False),
        ("Week 15 · Project ▶", "React SPA", "Ship a movie or product browser app.", True),
      ]),
      (3, "Backend & Full-Stack", "Weeks 16–22", "Add a server, a database, and deploy the whole thing.", [
        ("Week 16", "Node & Express", "Servers, routes, building REST APIs.", False),
        ("Week 17", "Databases", "SQL vs NoSQL; MongoDB or PostgreSQL.", False),
        ("Week 18", "CRUD & auth", "JWT, sessions, password hashing.", False),
        ("Week 19", "Full-stack wiring", "Connect the React front end to your API.", False),
        ("Week 20", "Deployment", "Vercel/Render, env vars, basic CI.", False),
        ("Week 21", "Testing & polish", "Error handling, validation, cleanup.", False),
        ("Week 22 · Capstone ▶", "Full-stack app", "Ship a complete deployed MERN/PERN app.", True),
      ]),
    ],
    "projects": [
      ("Start here", "1 · Personal Portfolio Site", "Pure HTML/CSS/JS. Your first live site — deploy it on GitHub Pages."),
      ("JavaScript", "2 · Interactive App", "A weather or to-do app that fetches live data from a public API."),
      ("React", "3 · React Single-Page App", "A movie or product browser with routing, search, and API data."),
      ("In demand", "4 · Full-Stack CRUD App", "A notes or blog app with login, a database, and REST API."),
      ("Capstone", "5 · Deployed Full-Stack App", "A complete MERN/PERN app, live on the internet with auth."),
    ],
    "steps": [
      ("Install VS Code", "Download the free editor and the Live Server extension. That's your whole setup."),
      ("Get a GitHub account", "github.com — host your code and deploy sites free with GitHub Pages."),
      ("Build one HTML page", "Make a simple 'About Me' page today. That's step one — you've started."),
    ],
    "resources": "freeCodeCamp, The Odin Project, MDN Web Docs, JavaScript.info, Full Stack Open",
    "note": "",
  },

  {
    "slug": "data-science",
    "name": "Data Scientist / Analyst",
    "accent": "Data Scientist",
    "h1_pre": "Become a ", "h1_post": " from scratch",
    "meta": "A 20-week roadmap to become a data scientist or analyst from scratch — Python, statistics, SQL, visualization, machine learning, and dashboards.",
    "lead": "Turn raw numbers into decisions. Go from zero to job-ready analytics in about five months — built around real datasets and portfolio-worthy reports.",
    "stats": [("20", "weeks · ~10–12 hrs/wk"), ("5", "portfolio projects"), ("4", "phases · data to insight"), ("₹0", "free resources only")],
    "rule_title": "Analyze → visualize → explain",
    "rule_lead": "Anyone can run a chart. The skill is explaining what it means. Every project below ends in a clear insight you could present to a manager.",
    "phases": [
      (0, "Foundations", "Weeks 1–4", "The core toolkit: Python, stats, and SQL.", [
        ("Week 1", "Python basics", "Variables, loops, functions, working with files.", False),
        ("Week 2", "pandas & NumPy", "DataFrames, cleaning, filtering, groupby.", False),
        ("Week 3", "Statistics", "Descriptive stats, distributions, probability.", False),
        ("Week 4", "SQL", "SELECT, joins, aggregation, grouping.", False),
      ]),
      (1, "Analysis & Visualization", "Weeks 5–9", "Explore data and tell its story with charts.", [
        ("Week 5", "EDA", "Explore, clean, and handle missing data.", False),
        ("Week 6", "Visualization", "matplotlib and seaborn for clear charts.", False),
        ("Week 7", "Dashboards", "Plotly, Power BI, or Tableau basics.", False),
        ("Week 8", "Data storytelling", "Turning findings into a clear narrative.", False),
        ("Week 9 · Project ▶", "Analytics report", "A full EDA writeup on a real dataset.", True),
      ]),
      (2, "Statistics & ML", "Weeks 10–15", "Test hypotheses and build predictive models.", [
        ("Week 10", "Hypothesis testing", "A/B tests, p-values, significance.", False),
        ("Week 11", "Regression", "Linear and logistic regression.", False),
        ("Week 12", "Classification", "Decision trees and random forests.", False),
        ("Week 13", "Clustering", "K-means and customer segmentation.", False),
        ("Week 14", "Model evaluation", "Metrics, cross-validation, avoiding overfit.", False),
        ("Week 15 · Project ▶", "Predictive model", "Predict churn or price and evaluate it.", True),
      ]),
      (3, "Tools & Delivery", "Weeks 16–20", "The workflow that makes you hireable.", [
        ("Week 16", "Advanced SQL", "Window functions, CTEs, subqueries.", False),
        ("Week 17", "Spreadsheet mastery", "Pivot tables, lookups, dashboards in Excel/Sheets.", False),
        ("Week 18", "Git & notebooks", "Reproducible, version-controlled analysis.", False),
        ("Week 19", "Communicating results", "Reports and decks for non-technical people.", False),
        ("Week 20 · Capstone ▶", "End-to-end analysis", "A full case study from raw data to recommendation.", True),
      ]),
    ],
    "projects": [
      ("Start here", "1 · Exploratory Data Analysis", "Pick any Kaggle dataset. Clean it, chart it, find 3 insights."),
      ("Dashboards", "2 · Interactive Dashboard", "Sales, sports, or COVID data in Power BI / Tableau / Plotly."),
      ("Statistics", "3 · A/B Test Analysis", "Analyze an experiment and state whether the result is significant."),
      ("In demand", "4 · Predictive Model", "Predict churn or house prices; explain accuracy and drivers."),
      ("Capstone", "5 · End-to-End Case Study", "Raw data → analysis → model → written recommendation."),
    ],
    "steps": [
      ("Open Google Colab", "colab.research.google.com — free, browser-based, every library ready."),
      ("Get a Kaggle account", "kaggle.com — thousands of free datasets and community notebooks."),
      ("Do one EDA", "Load a dataset, run .describe(), plot 3 charts. You've started."),
    ],
    "resources": "Kaggle Learn, freeCodeCamp, Khan Academy, Mode SQL Tutorial, StatQuest (YouTube)",
    "note": "",
  },

  {
    "slug": "cybersecurity",
    "name": "Cybersecurity Analyst",
    "accent": "Cybersecurity Analyst",
    "h1_pre": "Become a ", "h1_post": " from scratch",
    "meta": "A 22-week roadmap to break into cybersecurity from scratch — networking, Linux, security fundamentals, ethical hacking, defense, and certifications.",
    "lead": "One of the fastest-growing, highest-paid tech fields. Go from zero to job-ready in about five months — with hands-on labs, CTFs, and cert prep.",
    "stats": [("22", "weeks · ~10–12 hrs/wk"), ("5", "hands-on projects"), ("4", "phases · to job-ready"), ("₹0", "free labs & tools")],
    "rule_title": "Learn → practice in a lab → document it",
    "rule_lead": "Security is a hands-on craft. Everything below is practiced in your own legal lab (TryHackMe, HackTheBox). Only ever test systems you own or are authorized to test.",
    "phases": [
      (0, "Foundations", "Weeks 1–5", "How computers, networks, and systems actually work.", [
        ("Week 1", "Networking", "TCP/IP, DNS, HTTP, ports, packets.", False),
        ("Week 2", "Linux basics", "Command line, permissions, bash.", False),
        ("Week 3", "Windows & systems", "Processes, Active Directory basics.", False),
        ("Week 4", "Security fundamentals", "CIA triad, threats, attack surface.", False),
        ("Week 5", "Cryptography basics", "Hashing, encryption, certificates.", False),
      ]),
      (1, "Offensive Basics", "Weeks 6–11", "Think like an attacker — ethically and legally.", [
        ("Week 6", "Recon & scanning", "Nmap, footprinting, enumeration.", False),
        ("Week 7", "Web vulnerabilities", "The OWASP Top 10 hands-on.", False),
        ("Week 8", "Exploitation basics", "Metasploit and common payloads.", False),
        ("Week 9", "Password attacks", "Hashcat, John the Ripper, wordlists.", False),
        ("Week 10", "Network attacks", "Sniffing, MITM, wireless basics.", False),
        ("Week 11 · Project ▶", "Lab writeup", "Compromise a vulnerable VM and document it.", True),
      ]),
      (2, "Defensive & Tooling", "Weeks 12–17", "Detect, respond, and defend — the blue team.", [
        ("Week 12", "Blue team & SIEM", "Log analysis, Splunk/ELK basics.", False),
        ("Week 13", "Firewalls & IDS/IPS", "Network defense fundamentals.", False),
        ("Week 14", "Incident response", "Detect, contain, eradicate, recover.", False),
        ("Week 15", "Malware analysis", "Safe static analysis basics.", False),
        ("Week 16", "Security scripting", "Python for automation and tooling.", False),
        ("Week 17 · Project ▶", "Home SOC lab", "Set up log monitoring and catch an attack.", True),
      ]),
      (3, "Practice & Certs", "Weeks 18–22", "Build proof and prepare for your first cert.", [
        ("Week 18", "Guided rooms", "TryHackMe / HackTheBox learning paths.", False),
        ("Week 19", "Capture The Flag", "CTF challenges to sharpen skills.", False),
        ("Week 20", "Cert prep", "Study for CompTIA Security+.", False),
        ("Week 21", "Reporting", "Professional vulnerability reports.", False),
        ("Week 22 · Capstone ▶", "Pentest report", "A full assessment writeup on a lab network.", True),
      ]),
    ],
    "projects": [
      ("Start here", "1 · Home Lab Setup", "VirtualBox + Kali + a vulnerable VM. Your legal practice range."),
      ("Offensive", "2 · Vulnerability Writeup", "Exploit a TryHackMe box and document every step."),
      ("Practice", "3 · CTF Walkthroughs", "Solve Capture-The-Flag challenges and publish your solutions."),
      ("In demand", "4 · Home SOC / Monitoring", "Collect logs, build alerts, and detect a simulated attack."),
      ("Capstone", "5 · Full Pentest Report", "A professional penetration-test report on your lab network."),
    ],
    "steps": [
      ("Install VirtualBox + Kali", "Free virtualization + the standard security Linux distro."),
      ("Get a TryHackMe account", "tryhackme.com — guided, legal, beginner-friendly hacking labs."),
      ("Finish one room", "Complete the 'Intro to Cyber Security' path today. You've started."),
    ],
    "resources": "TryHackMe, HackTheBox, freeCodeCamp, Professor Messer, OWASP",
    "note": "Legal & ethical use only. Everything here is for authorized testing, your own lab, or educational platforms. Never attack systems you do not own or have explicit written permission to test — unauthorized access is a crime.",
  },

  {
    "slug": "cloud-devops",
    "name": "Cloud / DevOps Engineer",
    "accent": "Cloud / DevOps Engineer",
    "h1_pre": "Become a ", "h1_post": " from scratch",
    "meta": "A 22-week roadmap to become a cloud / DevOps engineer from scratch — Linux, Git, Docker, CI/CD, AWS, Kubernetes, Terraform, and monitoring.",
    "lead": "The engineers who ship and run software at scale. Go from zero to job-ready in about five months — with real pipelines, containers, and cloud deployments.",
    "stats": [("22", "weeks · ~10–12 hrs/wk"), ("5", "hands-on projects"), ("4", "phases · to production"), ("₹0", "free tiers only")],
    "rule_title": "Automate → containerize → deploy",
    "rule_lead": "DevOps is learned by building pipelines, not reading about them. Everything below runs on free cloud tiers and ends in something deployed and automated.",
    "phases": [
      (0, "Foundations", "Weeks 1–5", "The Linux, Git, and scripting base everything sits on.", [
        ("Week 1", "Linux & CLI", "Shell, files, permissions, processes.", False),
        ("Week 2", "Networking basics", "DNS, HTTP, ports, load balancing.", False),
        ("Week 3", "Git workflows", "Branches, PRs, merge strategies.", False),
        ("Week 4", "Scripting", "Bash and Python for automation.", False),
        ("Week 5", "Programming refresher", "Enough code to build tooling.", False),
      ]),
      (1, "Containers & CI/CD", "Weeks 6–11", "Package apps and ship them automatically.", [
        ("Week 6", "Docker", "Images, containers, Dockerfiles.", False),
        ("Week 7", "Docker Compose", "Multi-service local environments.", False),
        ("Week 8", "CI/CD concepts", "Pipelines with GitHub Actions.", False),
        ("Week 9", "Build & deploy", "Automated test-and-deploy workflows.", False),
        ("Week 10", "Registries", "Push and pull container images.", False),
        ("Week 11 · Project ▶", "Containerized pipeline", "Dockerize an app and auto-deploy it.", True),
      ]),
      (2, "Cloud & Orchestration", "Weeks 12–17", "Run workloads on AWS and Kubernetes.", [
        ("Week 12", "Cloud fundamentals", "AWS core: EC2, S3, IAM.", False),
        ("Week 13", "Cloud networking", "VPCs, subnets, security groups.", False),
        ("Week 14", "Kubernetes basics", "Pods, deployments, services.", False),
        ("Week 15", "K8s scaling", "Replicas, autoscaling, config.", False),
        ("Week 16", "Infrastructure as Code", "Terraform to define infrastructure.", False),
        ("Week 17 · Project ▶", "Deploy to Kubernetes", "Run your app on a K8s cluster.", True),
      ]),
      (3, "Monitoring & SRE", "Weeks 18–22", "Keep production healthy and secure.", [
        ("Week 18", "Monitoring", "Prometheus and Grafana dashboards.", False),
        ("Week 19", "Logging", "Centralized logs with the ELK stack.", False),
        ("Week 20", "Security & secrets", "Secrets management, least privilege.", False),
        ("Week 21", "Cert prep", "AWS Cloud Practitioner study.", False),
        ("Week 22 · Capstone ▶", "Full platform", "CI/CD + IaC + K8s + monitoring, end to end.", True),
      ]),
    ],
    "projects": [
      ("Start here", "1 · Dockerize an App", "Take any app and package it into a container that runs anywhere."),
      ("CI/CD", "2 · CI/CD Pipeline", "GitHub Actions that test and deploy on every push."),
      ("Cloud", "3 · Deploy to AWS", "Host an app on EC2/S3 with proper IAM and networking."),
      ("In demand", "4 · Kubernetes Deployment", "Run a multi-service app on a cluster with scaling."),
      ("Capstone", "5 · IaC + K8s + Monitoring", "A fully automated, monitored platform defined in Terraform."),
    ],
    "steps": [
      ("Install Docker Desktop", "Free — your local container playground."),
      ("Open an AWS free-tier account", "aws.amazon.com/free — enough to learn the core services."),
      ("Run one container", "docker run hello-world, then containerize a small app. Started."),
    ],
    "resources": "KodeKloud, freeCodeCamp, AWS Skill Builder, TechWorld with Nana (YouTube), Docker docs",
    "note": "",
  },

  {
    "slug": "mobile-development",
    "name": "Mobile App Developer",
    "accent": "Mobile App Developer",
    "h1_pre": "Become a ", "h1_post": " from scratch",
    "meta": "A 22-week roadmap to become a mobile app developer from scratch — Flutter, Dart, UI, state management, Firebase, APIs, and publishing to the Play Store.",
    "lead": "Build apps people carry in their pocket. Go from zero to a published app in about five months — using Flutter to ship for Android and iOS from one codebase.",
    "stats": [("22", "weeks · ~10–12 hrs/wk"), ("5", "portfolio apps"), ("4", "phases · to Play Store"), ("₹0", "free tools only")],
    "rule_title": "Learn → build an app → ship it",
    "rule_lead": "You learn mobile by shipping apps, not watching them. Every phase below ends in a working app on your own phone — and the last one goes live on the Play Store.",
    "phases": [
      (0, "Foundations", "Weeks 1–4", "Programming and the mobile mindset.", [
        ("Week 1", "Programming basics", "Dart fundamentals: variables, functions, classes.", False),
        ("Week 2", "Mobile UI concepts", "Screens, navigation, touch, responsiveness.", False),
        ("Week 3", "Git & tooling", "Flutter SDK, Android Studio, emulator setup.", False),
        ("Week 4", "First app", "A simple single-screen app you run yourself.", False),
      ]),
      (1, "Flutter Core", "Weeks 5–11", "Build real, multi-screen apps with Flutter.", [
        ("Week 5", "Widgets", "The building blocks of every Flutter UI.", False),
        ("Week 6", "Layouts & styling", "Rows, columns, themes, responsive design.", False),
        ("Week 7", "State management", "setState and Provider.", False),
        ("Week 8", "Navigation", "Routes, passing data between screens.", False),
        ("Week 9", "Forms & input", "Text fields, validation, user input.", False),
        ("Week 10", "Local storage", "Persist data on the device.", False),
        ("Week 11 · Project ▶", "Multi-screen app", "A notes or expense-tracker app.", True),
      ]),
      (2, "Data & Backend", "Weeks 12–17", "Connect apps to APIs and a real backend.", [
        ("Week 12", "REST APIs", "Fetch live data over the network.", False),
        ("Week 13", "JSON & models", "Parse data into typed objects.", False),
        ("Week 14", "Firebase auth", "Sign-up, login, user sessions.", False),
        ("Week 15", "Firestore", "A cloud database for your app.", False),
        ("Week 16", "Push notifications", "Re-engage users with messages.", False),
        ("Week 17 · Project ▶", "App with backend", "A social or chat app backed by Firebase.", True),
      ]),
      (3, "Polish & Ship", "Weeks 18–22", "Make it feel great and publish it.", [
        ("Week 18", "Animations & UX", "Smooth transitions and micro-interactions.", False),
        ("Week 19", "Testing & debugging", "Find and fix issues before release.", False),
        ("Week 20", "Build & assets", "App icons, splash screens, release builds.", False),
        ("Week 21", "Publishing", "Get an app onto the Google Play Store.", False),
        ("Week 22 · Capstone ▶", "Production app", "A polished, published app people can install.", True),
      ]),
    ],
    "projects": [
      ("Start here", "1 · Calculator / Weather App", "Your first real app — layout, logic, and a live API."),
      ("Flutter", "2 · Multi-Screen App", "A notes or expense tracker with navigation and storage."),
      ("APIs", "3 · API-Driven App", "A news or movies app pulling live data."),
      ("In demand", "4 · Firebase App with Auth", "Login, a cloud database, and real-time updates."),
      ("Capstone", "5 · Published Play Store App", "A complete app, live and installable by anyone."),
    ],
    "steps": [
      ("Install Flutter + Android Studio", "Free — the full mobile toolchain and an emulator."),
      ("Run the demo app", "flutter create then flutter run to see it on the emulator."),
      ("Change one thing", "Edit the text and hot-reload it. You're building apps now."),
    ],
    "resources": "Flutter docs, freeCodeCamp, The Net Ninja (YouTube), Google Codelabs, Firebase docs",
    "note": "",
  },

  {
    "slug": "ui-ux-design",
    "name": "UI/UX Designer",
    "accent": "UI/UX Designer",
    "h1_pre": "Become a ", "h1_post": " from scratch",
    "meta": "A 20-week roadmap to become a UI/UX designer from scratch — design principles, Figma, wireframing, prototyping, user research, and a portfolio.",
    "lead": "Design products people love to use — no coding required to start. Go from zero to a portfolio in about five months, built around real design case studies.",
    "stats": [("20", "weeks · ~10–12 hrs/wk"), ("5", "portfolio pieces"), ("4", "phases · to portfolio"), ("₹0", "free tools only")],
    "rule_title": "Study → design → get feedback",
    "rule_lead": "Design improves through critique, not isolation. Every project below is something you design in Figma, test with real people, and refine. No coding needed.",
    "phases": [
      (0, "Design Foundations", "Weeks 1–4", "The visual and UX principles behind good design.", [
        ("Week 1", "Design principles", "Hierarchy, contrast, alignment, balance.", False),
        ("Week 2", "Color & typography", "Palettes, type scales, readability.", False),
        ("Week 3", "Layout & spacing", "Grids, whitespace, visual rhythm.", False),
        ("Week 4", "UX fundamentals", "User-centered thinking, information architecture.", False),
      ]),
      (1, "Tools & Process", "Weeks 5–10", "Master Figma and the end-to-end design flow.", [
        ("Week 5", "Figma basics", "Frames, shapes, components, auto-layout.", False),
        ("Week 6", "Wireframing", "Low-fidelity structure before visuals.", False),
        ("Week 7", "Prototyping", "Clickable flows and interactions.", False),
        ("Week 8", "Design systems", "Reusable components and design tokens.", False),
        ("Week 9", "User research", "Interviews, surveys, personas.", False),
        ("Week 10 · Project ▶", "App redesign", "Redesign a real app and justify every choice.", True),
      ]),
      (2, "Applied Design", "Weeks 11–16", "Design for real platforms and real users.", [
        ("Week 11", "Mobile patterns", "Native iOS/Android conventions.", False),
        ("Week 12", "Responsive web", "Designing across screen sizes.", False),
        ("Week 13", "Usability testing", "Watch real users, find friction.", False),
        ("Week 14", "Accessibility", "Contrast, sizing, inclusive design.", False),
        ("Week 15", "Developer handoff", "Specs, assets, and clean delivery.", False),
        ("Week 16 · Project ▶", "Full product design", "An end-to-end product from research to UI.", True),
      ]),
      (3, "Portfolio & Career", "Weeks 17–20", "Package your work to land the job.", [
        ("Week 17", "Case study writing", "Tell the story: problem, process, outcome.", False),
        ("Week 18", "Portfolio site", "Present 3 strong pieces cleanly.", False),
        ("Week 19", "Critique & iteration", "Refine based on real feedback.", False),
        ("Week 20 · Capstone ▶", "Polished portfolio", "Three complete case studies, ready to share.", True),
      ]),
    ],
    "projects": [
      ("Start here", "1 · Redesign an App Screen", "Pick an app you use and redesign one screen — explain why."),
      ("Figma", "2 · Mobile App Prototype", "A clickable multi-screen prototype in Figma."),
      ("Systems", "3 · Design System / UI Kit", "Reusable components, colors, and type — like a pro team."),
      ("In demand", "4 · End-to-End Case Study", "Research → wireframes → UI → usability test, documented."),
      ("Capstone", "5 · Portfolio with 3 Case Studies", "A published portfolio that gets you interviews."),
    ],
    "steps": [
      ("Create a Figma account", "figma.com — the industry-standard design tool, free to start."),
      ("Pick an app to redesign", "Choose an app you find frustrating — that's your first project."),
      ("Draw one frame", "Recreate one screen in Figma today. You're designing now."),
    ],
    "resources": "Figma (Learn), Refactoring UI, Laws of UX, Nielsen Norman Group, Google UX Design (Coursera)",
    "note": "",
  },

  {
    "slug": "data-engineering",
    "name": "Data Engineer",
    "accent": "Data Engineer",
    "h1_pre": "Become a ", "h1_post": " from scratch",
    "meta": "A 24-week roadmap to become a data engineer from scratch — Python, SQL, ETL pipelines, Airflow, Spark, data warehouses, dbt, and cloud platforms.",
    "lead": "Build the pipelines that power every dashboard and ML model. Go from zero to job-ready in about six months, with real pipelines and a data platform capstone.",
    "stats": [("24", "weeks · ~10–12 hrs/wk"), ("5", "hands-on projects"), ("4", "phases · to production"), ("₹0", "free tiers only")],
    "rule_title": "Ingest → transform → serve",
    "rule_lead": "Data engineering is plumbing at scale — you learn it by moving real data. Every project below builds a pipeline that ingests, transforms, and serves data reliably.",
    "phases": [
      (0, "Foundations", "Weeks 1–5", "Python, SQL, and databases — deeply.", [
        ("Week 1", "Python for data", "Scripting, files, APIs, virtualenvs.", False),
        ("Week 2", "SQL deep dive", "Joins, aggregation, window functions.", False),
        ("Week 3", "Database design", "Relational modeling, normalization, indexes.", False),
        ("Week 4", "Linux & CLI", "Shell, cron, file handling.", False),
        ("Week 5", "Git & environments", "Version control and reproducible setups.", False),
      ]),
      (1, "Pipelines & ETL", "Weeks 6–11", "Move and clean data on a schedule.", [
        ("Week 6", "ETL/ELT concepts", "Extract, transform, load patterns.", False),
        ("Week 7", "Batch processing", "pandas and data transformation at scale.", False),
        ("Week 8", "Orchestration", "Scheduling pipelines with Airflow.", False),
        ("Week 9", "Ingestion", "Pull from APIs, files, and databases.", False),
        ("Week 10", "Data quality", "Validation, tests, and monitoring.", False),
        ("Week 11 · Project ▶", "ETL pipeline", "API → clean → load into a database.", True),
      ]),
      (2, "Big Data & Warehouses", "Weeks 12–18", "Store and process data at real scale.", [
        ("Week 12", "Data warehouses", "Snowflake or BigQuery fundamentals.", False),
        ("Week 13", "Dimensional modeling", "Star schemas, facts and dimensions.", False),
        ("Week 14", "Apache Spark", "Distributed processing basics.", False),
        ("Week 15", "Scaling", "Partitioning, parallelism, big datasets.", False),
        ("Week 16", "Streaming", "Real-time data with Kafka.", False),
        ("Week 17", "dbt", "Version-controlled SQL transformations.", False),
        ("Week 18 · Project ▶", "Warehouse + dbt", "Model a warehouse and transform with dbt.", True),
      ]),
      (3, "Cloud & Scale", "Weeks 19–24", "Run pipelines in production, in the cloud.", [
        ("Week 19", "Cloud data platforms", "AWS or GCP data services.", False),
        ("Week 20", "Docker for data", "Containerize pipelines.", False),
        ("Week 21", "Infrastructure basics", "IaC and deployment for data.", False),
        ("Week 22", "Production orchestration", "Monitoring and alerting on pipelines.", False),
        ("Week 23", "Performance & cost", "Tuning queries and controlling spend.", False),
        ("Week 24 · Capstone ▶", "Data platform", "An end-to-end ingest-to-serve platform.", True),
      ]),
    ],
    "projects": [
      ("Start here", "1 · ETL Script", "Pull from a public API, clean it, load it into Postgres."),
      ("Orchestration", "2 · Airflow Pipeline", "A scheduled pipeline that runs and monitors itself."),
      ("Warehouse", "3 · Warehouse + dbt", "Model data in a warehouse and transform it with dbt."),
      ("In demand", "4 · Streaming Pipeline", "Ingest real-time events with Kafka."),
      ("Capstone", "5 · End-to-End Data Platform", "Ingestion → warehouse → transformation → serving layer."),
    ],
    "steps": [
      ("Install Python + PostgreSQL", "Free — your local data engineering workbench."),
      ("Write one SQL query", "Load sample data and query it. The core skill starts here."),
      ("Build one ETL script", "Pull from a public API and save it to a table today."),
    ],
    "resources": "Data Engineering Zoomcamp, dbt Learn, DataCamp, freeCodeCamp, Mode SQL Tutorial",
    "note": "",
  },
]

# Career outcomes per domain (indicative India starting ranges, 2026).
OUTCOMES = {
  "web-development": {
    "titles": ["Frontend Developer", "Full-Stack Developer", "Backend Developer", "Web Developer"],
    "salary": "₹4–10 LPA", "suits": "You like building things people can see and use, and enjoy fast, visible feedback."},
  "data-science": {
    "titles": ["Data Analyst", "Data Scientist", "Business Analyst", "BI Analyst"],
    "salary": "₹4–12 LPA", "suits": "You enjoy finding patterns in messy data and explaining what they mean to non-technical people."},
  "cybersecurity": {
    "titles": ["Security Analyst", "SOC Analyst", "Penetration Tester", "Security Engineer"],
    "salary": "₹5–12 LPA", "suits": "You're curious about how systems break, and you enjoy methodical problem-solving."},
  "cloud-devops": {
    "titles": ["DevOps Engineer", "Cloud Engineer", "Site Reliability Engineer", "Platform Engineer"],
    "salary": "₹6–14 LPA", "suits": "You like automation and infrastructure, and take satisfaction in systems that just keep running."},
  "mobile-development": {
    "titles": ["Mobile App Developer", "Flutter Developer", "Android Developer", "iOS Developer"],
    "salary": "₹4–10 LPA", "suits": "You want to build apps people carry everywhere and see your work on real phones."},
  "ui-ux-design": {
    "titles": ["UI Designer", "UX Designer", "Product Designer", "UX Researcher"],
    "salary": "₹4–9 LPA", "suits": "You care how things look and feel, and like solving problems for people — no coding required."},
  "data-engineering": {
    "titles": ["Data Engineer", "Analytics Engineer", "ETL Developer", "Big Data Engineer"],
    "salary": "₹6–14 LPA", "suits": "You like building robust systems — the plumbing that powers every dashboard and AI model."},
}

# AI/ML is already a hand-built page; list it in the hub.
HUB_EXTRA = {
  "slug": "ai-ml", "file": "ai-ml-roadmap.html", "name": "AI / ML Engineer",
  "blurb": "Python, math, machine learning, deep learning, LLMs, and deployment.",
  "weeks": "24 weeks", "projects": "5 projects",
}

# ----------------------------------------------------------------------
# WEBSITE PAGE TEMPLATE (uses site css/js — nav & footer auto-injected)
# ----------------------------------------------------------------------
PAGE_STYLE = """  <style>
    .roadmap-phase{border:1px solid var(--border);border-radius:18px;padding:26px 24px;margin-bottom:22px;background:var(--surface)}
    .roadmap-phase .phase-top{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:6px}
    .phase-num{width:44px;height:44px;flex:0 0 44px;border-radius:12px;display:grid;place-items:center;font-weight:800;color:#fff;background:linear-gradient(135deg,var(--primary),#7c3aed)}
    .phase-dates{font-weight:600;color:var(--muted);font-size:.92rem}
    .phase-goal{color:var(--muted);margin:2px 0 18px}
    .week-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px}
    .week{border:1px solid var(--border);border-radius:12px;padding:14px 16px;background:var(--bg)}
    .week h4{margin:0 0 6px;font-size:.98rem}
    .week .wk-date{font-size:.78rem;font-weight:700;color:var(--primary);letter-spacing:.02em;text-transform:uppercase}
    .week p{margin:6px 0 0;font-size:.88rem;color:var(--muted);line-height:1.5}
    .week.is-project{border-color:var(--primary);box-shadow:0 0 0 1px var(--primary) inset}
    .stat-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px;margin-top:8px}
    .stat-box{border:1px solid var(--border);border-radius:14px;padding:18px;text-align:center;background:var(--surface)}
    .stat-box .n{font-size:1.9rem;font-weight:900;color:var(--primary);line-height:1}
    .stat-box .l{color:var(--muted);font-size:.85rem;margin-top:6px}
    .proj-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
    .proj{border:1px solid var(--border);border-radius:14px;padding:18px 18px 16px;background:var(--surface)}
    .proj .tag{display:inline-block;font-size:.72rem;font-weight:700;color:var(--primary);background:var(--primary-soft);padding:3px 10px;border-radius:999px;margin-bottom:8px}
    .proj h4{margin:0 0 6px;font-size:1.02rem}
    .proj p{margin:0;color:var(--muted);font-size:.9rem;line-height:1.55}
    .note-band{border-left:4px solid var(--primary);background:var(--primary-soft);padding:14px 18px;border-radius:0 12px 12px 0;margin:8px auto 0;max-width:820px;font-size:.9rem;color:var(--text)}
    .disclaimer{font-size:.82rem;color:var(--muted);max-width:760px;margin:14px auto 0;text-align:center}
    .res-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:18px}
    .res-grid .col h5{margin:0 0 8px;font-size:.95rem;color:var(--primary)}
    .res-grid .col ul{padding-left:18px;margin:0}
    .res-grid .col ul li{margin:6px 0;font-size:.9rem;line-height:1.5}
    .res-grid a{color:var(--primary);text-decoration:none;border-bottom:1px solid transparent}
    .res-grid a:hover{border-bottom-color:currentColor}
    .res-universal{font-size:.85rem;color:var(--muted);margin-top:18px;border-top:1px solid var(--border);padding-top:14px}
    .res-universal a{color:var(--primary);text-decoration:none}.res-universal a:hover{text-decoration:underline}
    .hero-actions{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:26px}
    .outcomes{display:grid;grid-template-columns:1.4fr 1fr;gap:18px;align-items:stretch}
    .oc-card{border:1px solid var(--border);border-radius:16px;padding:22px 24px;background:var(--surface)}
    .oc-card h4{margin:0 0 4px;font-size:1rem}
    .chips{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 16px}
    .chip{background:var(--primary-soft);color:var(--primary);font-weight:600;font-size:.85rem;padding:6px 13px;border-radius:999px}
    .oc-suits{color:var(--muted);font-size:.92rem;margin:0}
    .oc-salary{border:1px solid var(--border);border-radius:16px;padding:22px 24px;background:linear-gradient(135deg,var(--primary-soft),var(--surface));text-align:center;display:flex;flex-direction:column;justify-content:center}
    .oc-salary .n{font-size:2rem;font-weight:900;color:var(--primary);line-height:1}
    .oc-salary .l{color:var(--muted);font-size:.85rem;margin-top:8px}
    .oc-note{font-size:.8rem;color:var(--muted);max-width:820px;margin:16px auto 0;text-align:center}
    @media(max-width:640px){.outcomes{grid-template-columns:1fr}}
  </style>"""

def esc(s):
    return s  # content is authored safe

def render_phases_web(phases):
    out = []
    for num, name, wl, goal, weeks in phases:
        cards = []
        for wlabel, title, desc, isproj in weeks:
            cls = "week is-project" if isproj else "week"
            cards.append(
                '<div class="%s"><span class="wk-date">%s</span><h4>%s</h4><p>%s</p></div>'
                % (cls, wlabel, title, desc))
        out.append(
            '<div class="roadmap-phase reveal">'
            '<div class="phase-top"><span class="phase-num">%d</span>'
            '<div><h3 style="margin:0">%s</h3><span class="phase-dates">%s</span></div></div>'
            '<p class="phase-goal">%s</p>'
            '<div class="week-grid">%s</div></div>'
            % (num, name, wl, goal, "".join(cards)))
    return "\n      ".join(out)

def render_projects_web(projects):
    cards = []
    for tag, title, desc in projects:
        cards.append('<div class="proj"><span class="tag">%s</span><h4>%s</h4><p>%s</p></div>'
                     % (tag, title, desc))
    return "".join(cards)

STEP_ICONS = [
    '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 1.5 5 1.5 5 1.5c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 8.5c0 3.5 3 5.5 6 5.5a4.8 4.8 0 0 0-1 3.5V22"/>',
    '<polyline points="20 6 9 17 4 12"/>',
]

def render_steps_web(steps):
    cards = []
    for i, (title, desc) in enumerate(steps):
        orange = " is-orange" if i == 1 else ""
        icon = STEP_ICONS[i % len(STEP_ICONS)]
        cards.append(
            '<div class="card reveal%s"><div class="card-icon%s">'
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">%s</svg></div>'
            '<h3>%d. %s</h3><p>%s</p></div>'
            % (" reveal-d%d" % i if i else "", orange, icon, i + 1, title, desc))
    return "".join(cards)

def build_page(d):
    note_html = ('<div class="note-band reveal"><strong>Important:</strong> %s</div>' % d["note"]) if d["note"] else ""
    tmpl = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>%%NAME%% Roadmap — PathAhead | Learn from Scratch</title>
  <meta name="description" content="%%META%%" />
  <meta name="theme-color" content="#2563EB" />
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="PathAhead" />
  <meta property="og:title" content="%%NAME%% Roadmap — PathAhead" />
  <meta property="og:description" content="%%META%%" />
  <meta property="og:image" content="https://saatwik-1157.github.io/project_PathAhead/assets/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="https://saatwik-1157.github.io/project_PathAhead/assets/og-image.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <script>try{var t=localStorage.getItem('pathahead-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.setAttribute('data-theme','dark');}catch(e){}</script>
  <link rel="stylesheet" href="css/styles.css" />
%%STYLE%%
</head>
<body>

  <section class="page-hero">
    <div class="hero-bg"></div>
    <div class="container">
      <span class="eyebrow reveal">Free Roadmap</span>
      <h1 class="h-xl reveal reveal-d1">%%H1PRE%%<span class="text-accent">%%ACCENT%%</span>%%H1POST%%</h1>
      <p class="lead reveal reveal-d2">%%LEAD%%</p>
      <div class="stat-row reveal reveal-d2" style="margin-top:26px">%%STATS%%</div>
      <div class="hero-actions reveal reveal-d2">
        <a href="%%PDF%%" class="btn btn-primary btn-lg" download>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download PDF
        </a>
        <a href="roadmaps.html" class="btn btn-outline btn-lg">All roadmaps</a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow reveal">The one rule</span>
        <h2 class="h-xl reveal reveal-d1">%%RULETITLE%%</h2>
        <p class="lead reveal reveal-d2">%%RULELEAD%%</p>
      </div>
      %%NOTE%%
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow reveal">Where This Leads</span>
        <h2 class="h-xl reveal reveal-d1">Career outcomes</h2>
      </div>
      <div class="outcomes reveal">
        <div class="oc-card">
          <h4>Roles you can apply for</h4>
          <div class="chips">%%CHIPS%%</div>
          <p class="oc-suits"><strong>Who it suits:</strong> %%SUITS%%</p>
        </div>
        <div class="oc-salary">
          <div class="n">%%SALARY%%</div>
          <div class="l">typical starting range in India</div>
        </div>
      </div>
      <p class="oc-note">Indicative 2026 starting ranges in India — actual pay varies widely by city, company, and skill. Salary is an outcome of skill and a strong project portfolio, not a guarantee.</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow reveal">The Roadmap</span>
        <h2 class="h-xl reveal reveal-d1">Four phases, step by step</h2>
      </div>
      %%PHASES%%
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow reveal">Build a Portfolio</span>
        <h2 class="h-xl reveal reveal-d1">Five projects that get you hired</h2>
        <p class="lead reveal reveal-d2">Projects beat certificates. Do them in order — each builds on the last. Put every one on GitHub with a clear README.</p>
      </div>
      <div class="proj-list reveal">%%PROJECTS%%</div>
    </div>
  </section>

  %%RESOURCES_SECTION%%

  <section class="section section-alt">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow reveal">Do This Today</span>
        <h2 class="h-xl reveal reveal-d1">Your first step (takes 30 minutes)</h2>
      </div>
      <div class="cards cols-3">%%STEPS%%</div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="cta-band reveal">
        <h2 class="h-xl">Not sure which path is right for you?</h2>
        <p>PathAhead helps you choose the career that fits you — with guidance built for Intermediate students. Explore every roadmap in one place.</p>
        <div class="cta-actions">
          <a href="roadmaps.html" class="btn btn-primary btn-lg">See All Roadmaps</a>
          <a href="for-students.html#register" class="btn btn-outline btn-lg" style="background:transparent;color:#fff;border-color:rgba(255,255,255,.4)">Register Your Interest</a>
        </div>
      </div>
      <p class="disclaimer">This roadmap is a free educational resource. Timelines are a guide — everyone learns at a different pace. Referenced resources (%%RESOURCES%%) are for learning only and are not affiliated with PathAhead.</p>
    </div>
  </section>

  <script src="js/config.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
"""
    stats_html = "".join(
        '<div class="stat-box"><div class="n">%s</div><div class="l">%s</div></div>' % (n, l)
        for n, l in d["stats"])
    oc = OUTCOMES[d["slug"]]
    chips_html = "".join('<span class="chip">%s</span>' % t for t in oc["titles"])
    repl = {
        "%%NAME%%": d["name"], "%%META%%": d["meta"], "%%STYLE%%": PAGE_STYLE,
        "%%H1PRE%%": d["h1_pre"], "%%ACCENT%%": d["accent"], "%%H1POST%%": d["h1_post"],
        "%%LEAD%%": d["lead"], "%%STATS%%": stats_html,
        "%%PDF%%": "roadmaps/%s-roadmap.pdf" % d["slug"],
        "%%CHIPS%%": chips_html, "%%SUITS%%": oc["suits"], "%%SALARY%%": oc["salary"],
        "%%RULETITLE%%": d["rule_title"], "%%RULELEAD%%": d["rule_lead"], "%%NOTE%%": note_html,
        "%%PHASES%%": render_phases_web(d["phases"]),
        "%%PROJECTS%%": render_projects_web(d["projects"]),
        "%%RESOURCES_SECTION%%": resources_section_web(d["slug"]),
        "%%STEPS%%": render_steps_web(d["steps"]),
        "%%RESOURCES%%": d["resources"],
    }
    for k, v in repl.items():
        tmpl = tmpl.replace(k, v)
    return tmpl

# ----------------------------------------------------------------------
# PRINT PAGE TEMPLATE (standalone, self-contained CSS -> Chrome -> PDF)
# ----------------------------------------------------------------------
PRINT_CSS = """  @page { size: A4; margin: 16mm 15mm; }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color:#1e293b; font-size:10.5pt; line-height:1.5; margin:0; }
  h1,h2,h3,h4 { color:#0f172a; margin:0; }
  .cover { height:247mm; display:flex; flex-direction:column; justify-content:center; background:linear-gradient(135deg,#2563eb 0%,#7c3aed 100%); color:#fff; border-radius:14px; padding:0 20mm; break-after:page; }
  .cover .kicker { font-size:12pt; font-weight:700; letter-spacing:.12em; text-transform:uppercase; opacity:.85; }
  .cover h1 { color:#fff; font-size:34pt; font-weight:900; line-height:1.08; margin:14px 0 18px; }
  .cover p { font-size:12.5pt; max-width:150mm; opacity:.95; line-height:1.5; }
  .cover .stats { display:flex; gap:26px; margin-top:36px; flex-wrap:wrap; }
  .cover .stat .n { font-size:28pt; font-weight:900; line-height:1; }
  .cover .stat .l { font-size:9.5pt; opacity:.9; margin-top:4px; }
  .cover .foot { margin-top:42px; font-size:10pt; opacity:.8; }
  .sec-kick { font-size:9pt; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#2563eb; }
  h2.sec { font-size:19pt; font-weight:800; margin:4px 0 4px; }
  .rule { height:3px; width:54px; background:#2563eb; border-radius:2px; margin:8px 0 14px; }
  .lead { color:#475569; font-size:10.5pt; margin-bottom:16px; }
  .phase { border:1px solid #e2e8f0; border-radius:12px; padding:15px 17px; margin-bottom:13px; break-inside:avoid; }
  .phase-head { display:flex; align-items:center; gap:12px; margin-bottom:9px; }
  .pnum { width:32px; height:32px; flex:0 0 32px; border-radius:9px; color:#fff; font-weight:800; display:flex; align-items:center; justify-content:center; font-size:12pt; background:linear-gradient(135deg,#2563eb,#7c3aed); }
  .phase-head h3 { font-size:12.5pt; } .phase-head .dates { font-size:8.5pt; color:#64748b; font-weight:600; }
  .goal { color:#64748b; font-size:9pt; margin:0 0 11px; }
  .weeks { display:grid; grid-template-columns:1fr 1fr; gap:7px; }
  .wk { border:1px solid #e8edf3; border-radius:8px; padding:7px 10px; background:#f8fafc; }
  .wk.proj { border-color:#2563eb; background:#eff4ff; }
  .wk .d { font-size:7pt; font-weight:700; text-transform:uppercase; letter-spacing:.03em; color:#2563eb; }
  .wk h4 { font-size:9pt; margin:2px 0 2px; } .wk p { font-size:8pt; color:#64748b; margin:0; line-height:1.35; }
  .projects { display:grid; grid-template-columns:1fr 1fr; gap:9px; }
  .proj { border:1px solid #e2e8f0; border-radius:10px; padding:11px 13px; break-inside:avoid; }
  .proj .tag { display:inline-block; font-size:7pt; font-weight:700; color:#2563eb; background:#eef2ff; padding:2px 8px; border-radius:999px; margin-bottom:5px; }
  .proj h4 { font-size:10pt; margin:0 0 3px; } .proj p { font-size:8.5pt; color:#475569; margin:0; line-height:1.4; }
  .steps { display:grid; grid-template-columns:1fr 1fr 1fr; gap:11px; margin-top:8px; }
  .step { border:1px solid #e2e8f0; border-radius:10px; padding:13px; break-inside:avoid; }
  .step .n { width:24px; height:24px; border-radius:50%; background:#2563eb; color:#fff; font-weight:800; display:flex; align-items:center; justify-content:center; font-size:9.5pt; margin-bottom:7px; }
  .step h4 { font-size:9.5pt; margin:0 0 3px; } .step p { font-size:8.3pt; color:#64748b; margin:0; line-height:1.4; }
  .callout { border-left:4px solid #2563eb; background:#f8fafc; padding:11px 15px; border-radius:0 8px 8px 0; margin:13px 0; font-size:9.5pt; }
  .note-print { border-left:4px solid #d97706; background:#fffbeb; padding:11px 15px; border-radius:0 8px 8px 0; margin:13px 0; font-size:9pt; color:#7c2d12; }
  .res-print { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .rcol { border:1px solid #e2e8f0; border-radius:10px; padding:10px 13px; break-inside:avoid; }
  .rcol .k { font-size:7.5pt; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:#2563eb; display:block; margin-bottom:4px; }
  .rcol ul { padding-left:15px; margin:0; } .rcol ul li { font-size:8.3pt; margin:3px 0; line-height:1.35; }
  .rcol a { color:#2563eb; text-decoration:none; }
  .pc-outcomes { display:grid; grid-template-columns:1.6fr 1fr; gap:10px; margin:14px 0; break-inside:avoid; }
  .pc-roles, .pc-salary { border:1px solid #e2e8f0; border-radius:10px; padding:11px 14px; background:#f8fafc; font-size:9pt; }
  .pc-roles .k, .pc-salary .k { font-size:7.5pt; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:#2563eb; display:block; margin-bottom:3px; }
  .pc-salary { background:linear-gradient(135deg,#eef2ff,#f8fafc); text-align:center; }
  .pc-salary .v { font-size:15pt; font-weight:900; color:#2563eb; }
  .footer { margin-top:20px; padding-top:11px; border-top:1px solid #e2e8f0; font-size:8pt; color:#94a3b8; }
  .spacer { break-after:page; }"""

def render_phases_print(phases):
    out = []
    for num, name, wl, goal, weeks in phases:
        cards = []
        for wlabel, title, desc, isproj in weeks:
            cls = "wk proj" if isproj else "wk"
            cards.append('<div class="%s"><div class="d">%s</div><h4>%s</h4><p>%s</p></div>'
                         % (cls, wlabel, title, desc))
        out.append(
            '<div class="phase"><div class="phase-head"><span class="pnum">%d</span>'
            '<div><h3>%s</h3><span class="dates">%s</span></div></div>'
            '<p class="goal">%s</p><div class="weeks">%s</div></div>'
            % (num, name, wl, goal, "".join(cards)))
    return "\n".join(out)

def render_projects_print(projects):
    return "".join(
        '<div class="proj"><span class="tag">%s</span><h4>%s</h4><p>%s</p></div>' % (t, ti, de)
        for t, ti, de in projects)

def render_steps_print(steps):
    return "".join(
        '<div class="step"><div class="n">%d</div><h4>%s</h4><p>%s</p></div>' % (i + 1, ti, de)
        for i, (ti, de) in enumerate(steps))

def build_print(d):
    note_html = ('<div class="note-print"><strong>Legal &amp; ethical use only.</strong> %s</div>' % d["note"]) if d["note"] else ""
    stats = "".join('<div class="stat"><div class="n">%s</div><div class="l">%s</div></div>' % (n, l) for n, l in d["stats"])
    tmpl = """<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>%%NAME%% Roadmap</title>
<style>
%%CSS%%
</style></head><body>
  <div class="cover">
    <div class="kicker">PathAhead · Free Roadmap</div>
    <h1>Become a<br>%%NAME%%<br>from Scratch</h1>
    <p>%%LEAD%%</p>
    <div class="stats">%%STATS%%</div>
    <div class="foot">A free PathAhead learning resource · adjust the pace to your life — the order matters more than the dates.</div>
  </div>

  <div class="section">
    <div class="sec-kick">The One Rule</div>
    <h2 class="sec">%%RULETITLE%%</h2><div class="rule"></div>
    <p class="lead">%%RULELEAD%%</p>
    %%NOTE%%
  </div>

  <div class="section">
    <div class="sec-kick">The Roadmap</div>
    <h2 class="sec">Four phases, step by step</h2><div class="rule"></div>
    %%PHASES%%
  </div>

  <div class="spacer"></div>

  <div class="section">
    <div class="sec-kick">Build a Portfolio</div>
    <h2 class="sec">Five projects that get you hired</h2><div class="rule"></div>
    <p class="lead">Projects beat certificates. Do them in order — each builds on the last. Put every one on GitHub with a clear README: problem → approach → result.</p>
    <div class="projects">%%PROJECTS%%</div>
    <div class="pc-outcomes">
      <div class="pc-roles"><span class="k">Roles you can apply for</span>%%ROLES%%</div>
      <div class="pc-salary"><span class="k">Typical starting salary · India</span><span class="v">%%SALARY%%</span></div>
    </div>
  </div>

  %%RESOURCES_PRINT%%

  <div class="section" style="margin-top:20px">
    <div class="sec-kick">Do This Today</div>
    <h2 class="sec">Your first step (takes 30 minutes)</h2><div class="rule"></div>
    <div class="steps">%%STEPS%%</div>
    <div class="callout"><strong>Job-ready checklist:</strong> 3–5 solid projects on GitHub (≥1 deployed or documented) · can explain your work in an interview · comfortable with the core tools of the field · a portfolio or profile recruiters can find.</div>
    <div class="footer">PathAhead — India's premium career guidance platform. This roadmap is a free educational resource; timelines are a guide and everyone learns at a different pace. Referenced third-party resources (%%RESOURCES%%) are for learning only and are not affiliated with PathAhead.</div>
  </div>
</body></html>
"""
    oc = OUTCOMES[d["slug"]]
    roles = " · ".join(oc["titles"])
    repl = {
        "%%NAME%%": d["name"], "%%CSS%%": PRINT_CSS, "%%LEAD%%": d["lead"], "%%STATS%%": stats,
        "%%RULETITLE%%": d["rule_title"], "%%RULELEAD%%": d["rule_lead"], "%%NOTE%%": note_html,
        "%%PHASES%%": render_phases_print(d["phases"]),
        "%%PROJECTS%%": render_projects_print(d["projects"]),
        "%%RESOURCES_PRINT%%": resources_block_print(d["slug"]),
        "%%STEPS%%": render_steps_print(d["steps"]), "%%RESOURCES%%": d["resources"],
        "%%ROLES%%": roles, "%%SALARY%%": oc["salary"],
    }
    for k, v in repl.items():
        tmpl = tmpl.replace(k, v)
    return tmpl

# ----------------------------------------------------------------------
# HUB PAGE
# ----------------------------------------------------------------------
def build_hub(domains):
    def card(href, pdf, badge, name, blurb, weeks, projs):
        return (
            '<div class="rm-card reveal"><div class="rm-badge">%s</div>'
            '<h3>%s</h3><p>%s</p><div class="rm-meta"><span>%s</span><span>%s</span></div>'
            '<div class="rm-links"><a class="rm-go" href="%s">View roadmap →</a>'
            '<a class="rm-pdf" href="%s" download>PDF ↓</a></div></div>'
            % (badge, name, blurb, weeks, projs, href, pdf))
    cards = []
    # AI/ML first (hand-built page)
    cards.append(card(HUB_EXTRA["file"], "ai-ml-roadmap/AI-ML-Engineer-Roadmap.pdf", "Popular",
                      HUB_EXTRA["name"], HUB_EXTRA["blurb"], HUB_EXTRA["weeks"], HUB_EXTRA["projects"]))
    for d in domains:
        weeks = d["stats"][0][0] + " weeks"
        projs = d["stats"][1][0] + " projects"
        blurb = d["meta"].split("—", 1)[1].strip() if "—" in d["meta"] else d["meta"]
        blurb = blurb.rstrip(".") + "."
        cards.append(card(d["slug"] + "-roadmap.html", "roadmaps/%s-roadmap.pdf" % d["slug"],
                          "Free", d["name"], blurb, weeks, projs))
    cards_html = "\n        ".join(cards)
    return """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Career Roadmaps — PathAhead | Learn Any Tech Career from Scratch</title>
  <meta name="description" content="Free, step-by-step roadmaps to learn any tech career from scratch — AI/ML, web development, data science, cybersecurity, cloud/DevOps, mobile, UI/UX, and data engineering." />
  <meta name="theme-color" content="#2563EB" />
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="PathAhead" />
  <meta property="og:title" content="Career Roadmaps — PathAhead" />
  <meta property="og:description" content="Free step-by-step roadmaps to learn any tech career from scratch." />
  <meta property="og:image" content="https://saatwik-1157.github.io/project_PathAhead/assets/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="https://saatwik-1157.github.io/project_PathAhead/assets/og-image.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <script>try{var t=localStorage.getItem('pathahead-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.setAttribute('data-theme','dark');}catch(e){}</script>
  <link rel="stylesheet" href="css/styles.css" />
  <style>
    .rm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px}
    .rm-card{position:relative;display:flex;flex-direction:column;border:1px solid var(--border);border-radius:16px;padding:24px 22px 20px;background:var(--surface);color:inherit;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}
    .rm-card:hover{transform:translateY(-4px);box-shadow:0 14px 34px rgba(37,99,235,.14);border-color:var(--primary)}
    .rm-badge{position:absolute;top:16px;right:16px;font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--primary);background:var(--primary-soft);padding:3px 10px;border-radius:999px}
    .rm-card h3{margin:4px 0 8px;font-size:1.18rem;max-width:80%}
    .rm-card p{margin:0 0 16px;color:var(--muted);font-size:.92rem;line-height:1.55}
    .rm-meta{display:flex;gap:14px;font-size:.8rem;font-weight:600;color:var(--text);margin-bottom:16px}
    .rm-meta span{background:var(--bg);border:1px solid var(--border);border-radius:999px;padding:4px 12px}
    .rm-links{display:flex;gap:16px;align-items:center;margin-top:auto}
    .rm-go{font-weight:700;color:var(--primary);font-size:.92rem;text-decoration:none}
    .rm-go:hover{text-decoration:underline}
    .rm-pdf{font-weight:700;color:var(--muted);font-size:.9rem;text-decoration:none}
    .rm-pdf:hover{color:var(--primary)}
  </style>
</head>
<body>

  <section class="page-hero">
    <div class="hero-bg"></div>
    <div class="container">
      <span class="eyebrow reveal">Free Career Roadmaps</span>
      <h1 class="h-xl reveal reveal-d1">Learn any <span class="text-accent">tech career</span> from scratch</h1>
      <p class="lead reveal reveal-d2">Pick a path and follow a clear, week-by-week plan — from zero experience to job-ready, built around real projects. Every roadmap is free, and downloadable as a PDF.</p>
      <div class="hero-actions reveal reveal-d2" style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:26px">
        <a href="career-roadmap.html" class="btn btn-primary btn-lg">Build a personalised roadmap →</a>
      </div>
      <p class="lead reveal reveal-d2" style="font-size:.92rem;margin-top:12px">Not sure which to pick? Use the <strong>Career Builder</strong> — choose your branch, year, domain and state for a plan tailored to you.</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow reveal">Choose Your Path</span>
        <h2 class="h-xl reveal reveal-d1">Eight roadmaps, one place to start</h2>
      </div>
      <div class="rm-grid reveal">
        %%CARDS%%
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <div class="cta-band reveal">
        <h2 class="h-xl">Still deciding which path fits you?</h2>
        <p>That's exactly what PathAhead is for. Get personalised career guidance built for Intermediate students.</p>
        <div class="cta-actions">
          <a href="for-students.html#register" class="btn btn-primary btn-lg">Register Your Interest</a>
          <a href="programs.html" class="btn btn-outline btn-lg" style="background:transparent;color:#fff;border-color:rgba(255,255,255,.4)">Explore Programs</a>
        </div>
      </div>
    </div>
  </section>

  <script src="js/config.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
""".replace("%%CARDS%%", cards_html)

# ----------------------------------------------------------------------
# WRITE FILES
# ----------------------------------------------------------------------
def main():
    os.makedirs(BUILD, exist_ok=True)
    written = []
    for d in DOMAINS:
        page = build_page(d)
        with open(os.path.join(ROOT, d["slug"] + "-roadmap.html"), "w", encoding="utf-8") as f:
            f.write(page)
        pr = build_print(d)
        with open(os.path.join(BUILD, d["slug"] + "_print.html"), "w", encoding="utf-8") as f:
            f.write(pr)
        written.append(d["slug"])
    hub = build_hub(DOMAINS)
    with open(os.path.join(ROOT, "roadmaps.html"), "w", encoding="utf-8") as f:
        f.write(hub)
    print("Generated pages for:", ", ".join(written))
    print("Generated hub: roadmaps.html")
    print("Print sources in:", BUILD)

if __name__ == "__main__":
    main()
