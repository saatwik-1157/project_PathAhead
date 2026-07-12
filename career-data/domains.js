window.DOMAINS_DATA = [
  {
    slug: "software-development",
    name: "Software Development",
    roles: ["Software Engineer", "Backend Developer", "Full Stack Developer", "Application Developer"],
    skills: ["Programming fundamentals", "Data structures and algorithms", "Version control with Git", "Object-oriented design", "Databases and SQL", "REST APIs", "Testing and debugging", "System design basics"],
    tools: ["VS Code", "Git and GitHub", "Docker", "Postman", "Linux", "PostgreSQL"],
    certs: ["freeCodeCamp", "CS50 by Harvard", "NPTEL", "Oracle Java certification"],
    projects: {
      beginner: ["Command line to-do app", "Calculator with unit tests", "Contact book with file storage", "Simple REST API for notes", "URL shortener", "Bank account simulation"],
      intermediate: ["Blog backend with authentication", "Library management system", "Chat application with sockets", "E-commerce cart API", "Expense tracker with database", "Task scheduler service"],
      advanced: ["Distributed job queue", "Microservices with API gateway", "Real time collaborative editor", "Payment processing service", "Full text search engine", "CI pipeline automation tool"]
    },
    salaryINR: "4-12 LPA",
    page: null
  },
  {
    slug: "web-development",
    name: "Web Development",
    roles: ["Frontend Developer", "Full Stack Developer", "Web Developer", "MERN Stack Developer"],
    skills: ["HTML and CSS", "JavaScript fundamentals", "Responsive design", "React or Vue", "Node and Express", "Databases and MongoDB", "Authentication and security", "Deployment and hosting"],
    tools: ["VS Code", "Git and GitHub", "React", "Node.js", "Tailwind CSS", "Vercel"],
    certs: ["freeCodeCamp", "The Odin Project", "Meta Front End Developer certificate", "MDN Web Docs"],
    projects: {
      beginner: ["Personal portfolio site", "Landing page with animations", "To-do list web app", "Weather app using an API", "Recipe finder", "Quiz app"],
      intermediate: ["Blog with CMS", "E-commerce storefront", "Real time chat app", "Kanban board", "Movie discovery app", "Job board with filters"],
      advanced: ["Full stack social network", "Multi vendor marketplace", "Collaborative whiteboard", "Video streaming platform", "SaaS dashboard with billing", "Progressive web app with offline mode"]
    },
    salaryINR: "3-10 LPA",
    page: "web-development-roadmap.html"
  },
  {
    slug: "ai-ml",
    name: "AI and Machine Learning",
    roles: ["Machine Learning Engineer", "AI Engineer", "ML Research Assistant", "NLP Engineer"],
    skills: ["Python programming", "Linear algebra and statistics", "Data preprocessing", "Supervised learning", "Neural networks", "Deep learning frameworks", "Model evaluation", "Deployment of models"],
    tools: ["Python", "NumPy and Pandas", "scikit-learn", "TensorFlow", "PyTorch", "Jupyter", "Hugging Face"],
    certs: ["Andrew Ng Machine Learning course", "fast.ai", "Google Machine Learning Crash Course", "NPTEL"],
    projects: {
      beginner: ["House price prediction", "Handwritten digit classifier", "Spam email detector", "Iris flower classification", "Movie rating regression", "Sentiment analysis on reviews"],
      intermediate: ["Image classifier with CNN", "Recommendation system", "Chatbot with intent detection", "Stock trend predictor", "Face detection app", "Text summarizer"],
      advanced: ["Object detection pipeline", "Fine tuned language model", "Neural machine translation", "Generative image model", "Speech recognition system", "End to end MLOps pipeline"]
    },
    salaryINR: "5-15 LPA",
    page: "ai-ml-roadmap.html"
  },
  {
    slug: "data-science",
    name: "Data Science",
    roles: ["Data Scientist", "Data Analyst", "Business Analyst", "Analytics Engineer"],
    skills: ["Python or R", "Statistics and probability", "Data cleaning", "Exploratory data analysis", "Data visualization", "SQL for analytics", "Machine learning basics", "Storytelling with data"],
    tools: ["Python", "Pandas", "Jupyter", "SQL", "Tableau", "Power BI", "Excel"],
    certs: ["Google Data Analytics certificate", "Kaggle Learn", "IBM Data Science certificate", "NPTEL"],
    projects: {
      beginner: ["Sales data dashboard", "COVID data exploration", "Survey response analysis", "Netflix data study", "Customer age analysis", "Weather trend visualization"],
      intermediate: ["Customer churn analysis", "A B test evaluation", "Market basket analysis", "Time series sales forecast", "Credit risk scoring", "Social media sentiment dashboard"],
      advanced: ["End to end analytics platform", "Real time streaming dashboard", "Fraud detection model", "Demand forecasting system", "Customer segmentation engine", "Automated reporting pipeline"]
    },
    salaryINR: "4-12 LPA",
    page: "data-science-roadmap.html"
  },
  {
    slug: "cyber-security",
    name: "Cyber Security",
    roles: ["Security Analyst", "Penetration Tester", "SOC Analyst", "Security Engineer"],
    skills: ["Networking fundamentals", "Operating system internals", "Linux command line", "Cryptography basics", "Web application security", "Vulnerability assessment", "Incident response", "Security tooling"],
    tools: ["Kali Linux", "Wireshark", "Nmap", "Burp Suite", "Metasploit", "Splunk"],
    certs: ["CompTIA Security Plus", "TryHackMe", "Google Cybersecurity certificate", "NPTEL"],
    projects: {
      beginner: ["Home network security audit", "Password strength checker", "Port scanner script", "Phishing awareness page", "File encryption tool", "Log analysis exercise"],
      intermediate: ["Vulnerability scan report", "Capture the flag writeups", "Web app penetration test", "Intrusion detection setup", "Firewall rule configuration", "Secure login system"],
      advanced: ["Full network pentest lab", "SIEM dashboard build", "Malware analysis sandbox", "Red team simulation", "Cloud security assessment", "Automated threat hunting tool"]
    },
    salaryINR: "4-12 LPA",
    page: "cyber-security-roadmap.html"
  },
  {
    slug: "cloud-devops",
    name: "Cloud and DevOps",
    roles: ["DevOps Engineer", "Cloud Engineer", "Site Reliability Engineer", "Platform Engineer"],
    skills: ["Linux administration", "Networking basics", "Scripting with Bash and Python", "Containers with Docker", "Orchestration with Kubernetes", "CI CD pipelines", "Infrastructure as code", "Monitoring and logging"],
    tools: ["Docker", "Kubernetes", "Jenkins", "Terraform", "AWS", "Ansible", "Prometheus"],
    certs: ["AWS Certified Cloud Practitioner", "Docker and Kubernetes courses", "Microsoft Azure Fundamentals", "NPTEL"],
    projects: {
      beginner: ["Dockerize a web app", "Static site on cloud storage", "Simple CI pipeline", "Bash backup script", "Nginx reverse proxy setup", "Basic monitoring dashboard"],
      intermediate: ["Kubernetes cluster deployment", "Terraform infrastructure setup", "Automated deployment pipeline", "Log aggregation stack", "Auto scaling web service", "Blue green deployment"],
      advanced: ["Multi cloud infrastructure", "GitOps workflow", "Service mesh deployment", "Disaster recovery automation", "Cost optimization pipeline", "Full observability platform"]
    },
    salaryINR: "5-14 LPA",
    page: "cloud-devops-roadmap.html"
  },
  {
    slug: "mobile-development",
    name: "Mobile Development",
    roles: ["Android Developer", "iOS Developer", "Flutter Developer", "Mobile App Engineer"],
    skills: ["Programming fundamentals", "UI layout and design", "State management", "REST API integration", "Local storage", "Navigation patterns", "App lifecycle", "Publishing to app stores"],
    tools: ["Android Studio", "Flutter", "Kotlin", "Firebase", "Xcode", "Git"],
    certs: ["Google Android Basics", "freeCodeCamp", "Flutter official codelabs", "Meta Mobile Developer certificate"],
    projects: {
      beginner: ["Unit converter app", "Notes app", "Stopwatch and timer", "Tip calculator", "Simple weather app", "Flashcards app"],
      intermediate: ["Expense tracker app", "News reader app", "Chat app with Firebase", "Fitness tracker", "Recipe app with API", "To-do app with reminders"],
      advanced: ["Food delivery app", "Ride booking app", "Social media app", "Offline first note sync", "Music streaming app", "Real time multiplayer game"]
    },
    salaryINR: "3-10 LPA",
    page: "mobile-development-roadmap.html"
  },
  {
    slug: "ui-ux-design",
    name: "UI and UX Design",
    roles: ["UX Designer", "UI Designer", "Product Designer", "Interaction Designer"],
    skills: ["Design fundamentals", "Color and typography", "User research", "Wireframing", "Prototyping", "Visual design", "Usability testing", "Design systems"],
    tools: ["Figma", "Adobe XD", "Sketch", "Canva", "Miro", "InVision"],
    certs: ["Google UX Design certificate", "freeCodeCamp", "Interaction Design Foundation courses", "Figma learn resources"],
    projects: {
      beginner: ["Redesign a landing page", "Mobile app wireframes", "Icon set design", "Color palette exploration", "Simple onboarding flow", "Button and form component set"],
      intermediate: ["Full app prototype", "E-commerce checkout flow", "Design system starter", "Usability test report", "Dashboard interface design", "Dark mode redesign"],
      advanced: ["End to end product design case study", "Complete design system", "Accessibility focused redesign", "Multi platform design kit", "User research and persona study", "Interactive prototype with micro interactions"]
    },
    salaryINR: "3-10 LPA",
    page: "ui-ux-design-roadmap.html"
  },
  {
    slug: "data-engineering",
    name: "Data Engineering",
    roles: ["Data Engineer", "ETL Developer", "Analytics Engineer", "Big Data Engineer"],
    skills: ["SQL and databases", "Python programming", "Data modeling", "ETL and ELT pipelines", "Batch processing", "Streaming data", "Data warehousing", "Workflow orchestration"],
    tools: ["Python", "SQL", "Apache Spark", "Apache Airflow", "Kafka", "Snowflake", "dbt"],
    certs: ["Google Data Engineering courses", "AWS Certified Data Engineer", "DataCamp", "NPTEL"],
    projects: {
      beginner: ["CSV to database loader", "Simple ETL script", "API data ingestion", "Data cleaning pipeline", "Scheduled report generator", "Currency exchange fetcher"],
      intermediate: ["Batch pipeline with Airflow", "Data warehouse schema design", "Web scraping pipeline", "Incremental data load job", "Data quality checker", "Analytics dashboard pipeline"],
      advanced: ["Real time streaming pipeline", "Lakehouse architecture", "End to end ELT with dbt", "Change data capture system", "Distributed processing job", "Automated data platform"]
    },
    salaryINR: "5-14 LPA",
    page: "data-engineering-roadmap.html"
  },
  {
    slug: "embedded-iot",
    name: "Embedded Systems and IoT",
    roles: ["Embedded Systems Engineer", "IoT Developer", "Firmware Engineer", "Hardware Engineer"],
    skills: ["C programming", "Microcontroller basics", "Digital electronics", "Sensors and actuators", "Communication protocols", "Real time systems", "Embedded C and RTOS", "IoT connectivity"],
    tools: ["Arduino", "Raspberry Pi", "ESP32", "STM32", "Arduino IDE", "PlatformIO"],
    certs: ["NPTEL", "Arduino official tutorials", "Coursera Embedded Systems courses", "edX IoT courses"],
    projects: {
      beginner: ["LED blink patterns", "Temperature monitor", "Ultrasonic distance meter", "Automatic night light", "Buzzer alarm system", "Soil moisture sensor"],
      intermediate: ["Smart home light control", "Weather station with display", "Bluetooth controlled robot", "RFID access system", "Gas leak detector", "Heart rate monitor"],
      advanced: ["IoT connected dashboard", "Gesture controlled device", "Home automation hub", "GPS tracking system", "Industrial sensor network", "Voice controlled assistant"]
    },
    salaryINR: "3-9 LPA",
    page: null
  },
  {
    slug: "vlsi-semiconductor",
    name: "VLSI and Semiconductor",
    roles: ["VLSI Design Engineer", "Physical Design Engineer", "Verification Engineer", "ASIC Design Engineer"],
    skills: ["Digital electronics", "Verilog and VHDL", "Logic design", "CMOS fundamentals", "RTL design", "Functional verification", "Timing analysis", "Physical design flow"],
    tools: ["Verilog", "SystemVerilog", "Cadence tools", "Synopsys tools", "ModelSim", "Xilinx Vivado"],
    certs: ["NPTEL VLSI courses", "Coursera VLSI CAD", "edX Digital Design courses", "Maven Silicon resources"],
    projects: {
      beginner: ["4 bit adder in Verilog", "Traffic light controller", "Multiplexer design", "Simple ALU design", "Counter and register design", "Seven segment decoder"],
      intermediate: ["FSM based vending machine", "UART transmitter and receiver", "FIFO buffer design", "Pipelined processor unit", "SPI controller", "Memory controller"],
      advanced: ["RISC processor design", "AXI protocol implementation", "Full verification environment", "Physical design of a block", "Cache controller design", "Low power design project"]
    },
    salaryINR: "4-12 LPA",
    page: null
  },
  {
    slug: "electric-vehicles",
    name: "Electric Vehicles",
    roles: ["EV Systems Engineer", "Battery Engineer", "Powertrain Engineer", "EV Design Engineer"],
    skills: ["Electrical fundamentals", "Power electronics", "Battery technology", "Electric motors", "Battery management systems", "Vehicle dynamics", "Charging systems", "Embedded control"],
    tools: ["MATLAB", "Simulink", "ANSYS", "Arduino", "CAN analyzer", "Altium Designer"],
    certs: ["NPTEL EV courses", "Coursera Electric Vehicle courses", "edX Battery courses", "ARAI resources"],
    projects: {
      beginner: ["Battery voltage monitor", "Simple motor speed control", "Solar charging demo", "DC motor driver circuit", "EV cost calculator", "Charge indicator display"],
      intermediate: ["BMS prototype", "Regenerative braking model", "Motor controller design", "Charging station simulation", "Range estimation model", "Throttle control system"],
      advanced: ["Full EV powertrain model", "Smart charging system", "Battery pack thermal model", "Vehicle CAN network", "Fast charging controller", "EV telemetry dashboard"]
    },
    salaryINR: "4-11 LPA",
    page: null
  },
  {
    slug: "robotics-automation",
    name: "Robotics and Automation",
    roles: ["Robotics Engineer", "Automation Engineer", "Control Systems Engineer", "Mechatronics Engineer"],
    skills: ["Programming with Python and C", "Electronics and sensors", "Control systems", "Kinematics", "Robot operating system", "Computer vision basics", "Motion planning", "Actuator control"],
    tools: ["ROS", "Arduino", "Raspberry Pi", "MATLAB", "Gazebo", "OpenCV"],
    certs: ["NPTEL Robotics courses", "Coursera Robotics specialization", "ROS official tutorials", "edX Control Systems courses"],
    projects: {
      beginner: ["Line following robot", "Obstacle avoiding robot", "Robotic arm with servos", "Bluetooth controlled car", "Light seeking robot", "Simple gripper mechanism"],
      intermediate: ["Maze solving robot", "Gesture controlled arm", "Self balancing robot", "Object sorting system", "Wall following robot", "PID motor control"],
      advanced: ["Autonomous navigation robot", "Vision guided pick and place", "Swarm robotics demo", "SLAM mapping robot", "Six axis robotic arm control", "Warehouse automation prototype"]
    },
    salaryINR: "4-11 LPA",
    page: null
  },
  {
    slug: "mechanical-design",
    name: "Mechanical Design",
    roles: ["Design Engineer", "CAD Engineer", "Product Design Engineer", "Mechanical Analyst"],
    skills: ["Engineering drawing", "CAD modeling", "Geometric dimensioning", "Materials and manufacturing", "Finite element analysis", "Design for manufacturing", "Simulation basics", "Prototyping"],
    tools: ["SolidWorks", "AutoCAD", "CATIA", "Fusion 360", "ANSYS", "Creo"],
    certs: ["NPTEL Machine Design courses", "SolidWorks tutorials", "Coursera CAD courses", "Autodesk Fusion learning"],
    projects: {
      beginner: ["Model a bolt and nut", "Gear assembly model", "Simple bracket design", "Bottle 3D model", "Piston assembly", "Basic enclosure design"],
      intermediate: ["Gearbox assembly", "Bicycle frame model", "FEA of a beam", "Sheet metal enclosure", "Cam and follower mechanism", "Assembly with motion study"],
      advanced: ["Full engine assembly model", "Structural analysis project", "Design of a machine element", "Injection mould design", "Drone frame with analysis", "Optimized lightweight component"]
    },
    salaryINR: "3-8 LPA",
    page: null
  },
  {
    slug: "structural-civil",
    name: "Structural and Civil Engineering",
    roles: ["Structural Engineer", "Site Engineer", "Civil Design Engineer", "Construction Engineer"],
    skills: ["Engineering mechanics", "Structural analysis", "Concrete technology", "Design codes", "Surveying", "Estimation and costing", "Reinforced concrete design", "Steel structure design"],
    tools: ["AutoCAD", "STAAD Pro", "Revit", "ETABS", "Primavera", "MS Project"],
    certs: ["NPTEL Structural Engineering courses", "Autodesk Revit learning", "Coursera Construction courses", "IIT design code resources"],
    projects: {
      beginner: ["Building plan in AutoCAD", "Beam load calculation", "Material estimation sheet", "Simple truss analysis", "Site survey exercise", "Concrete mix design study"],
      intermediate: ["RCC beam and column design", "Multi storey frame analysis", "Bridge load study", "BOQ preparation", "Staircase design", "Retaining wall design"],
      advanced: ["Complete building design", "Seismic analysis of a structure", "Steel warehouse design", "Bridge design project", "Construction schedule with Primavera", "Structural health monitoring study"]
    },
    salaryINR: "3-7 LPA",
    page: null
  },
  {
    slug: "chemical-process",
    name: "Chemical and Process Engineering",
    roles: ["Process Engineer", "Production Engineer", "Process Design Engineer", "Quality Engineer"],
    skills: ["Chemical process principles", "Mass and energy balances", "Thermodynamics", "Fluid mechanics", "Heat transfer", "Reaction engineering", "Process simulation", "Process safety"],
    tools: ["Aspen Plus", "MATLAB", "DWSIM", "AutoCAD", "HYSYS", "Excel"],
    certs: ["NPTEL Chemical Engineering courses", "Coursera Process courses", "AIChE resources", "edX Chemical Engineering courses"],
    projects: {
      beginner: ["Mass balance of a mixer", "Distillation column study", "Heat exchanger calculation", "Reaction rate analysis", "pH control demo", "Pump sizing exercise"],
      intermediate: ["Process flow diagram design", "Reactor design project", "Distillation simulation", "Heat integration study", "Fluid flow analysis", "Batch process modeling"],
      advanced: ["Full plant simulation", "Process optimization study", "Safety and hazard analysis", "Separation process design", "Energy efficiency project", "Scale up study of a process"]
    },
    salaryINR: "3-8 LPA",
    page: null
  },
  {
    slug: "biomedical-bioinformatics",
    name: "Biomedical and Bioinformatics",
    roles: ["Biomedical Engineer", "Bioinformatics Analyst", "Medical Device Engineer", "Computational Biologist"],
    skills: ["Biology fundamentals", "Programming with Python", "Statistics", "Signal processing", "Genomics basics", "Data analysis", "Medical instrumentation", "Machine learning for biology"],
    tools: ["Python", "R", "Biopython", "MATLAB", "Bioconductor", "Jupyter"],
    certs: ["NPTEL Biomedical courses", "Coursera Bioinformatics specialization", "Rosalind problems", "edX Biology courses"],
    projects: {
      beginner: ["DNA sequence analyzer", "ECG signal plotting", "Heart rate calculator", "Protein sequence stats", "Simple health data study", "Blood group predictor logic"],
      intermediate: ["Gene expression analysis", "Medical image filtering", "Sequence alignment tool", "Disease dataset analysis", "EEG signal classification", "Health monitoring dashboard"],
      advanced: ["Genome variant analysis pipeline", "Medical image classifier", "Drug target analysis", "Wearable health analytics", "Protein structure study", "Clinical data prediction model"]
    },
    salaryINR: "3-9 LPA",
    page: null
  },
  {
    slug: "product-management",
    name: "Product Management",
    roles: ["Associate Product Manager", "Product Analyst", "Product Owner", "Business Analyst"],
    skills: ["Product thinking", "User research", "Market analysis", "Roadmapping", "Prioritization", "Data analysis", "Agile methodology", "Stakeholder communication"],
    tools: ["Jira", "Figma", "Notion", "Trello", "Google Analytics", "Excel"],
    certs: ["Google Project Management certificate", "Coursera Product Management courses", "Product School resources", "Scrum foundational courses"],
    projects: {
      beginner: ["Product teardown writeup", "User survey and analysis", "Feature prioritization matrix", "Simple product roadmap", "Competitor comparison", "User persona document"],
      intermediate: ["Product requirement document", "A B test plan", "Go to market plan", "Metrics dashboard mockup", "User journey map", "Feature launch case study"],
      advanced: ["End to end product case study", "Full product strategy document", "Market entry analysis", "Pricing strategy study", "Product analytics deep dive", "MVP definition and pitch"]
    },
    salaryINR: "6-16 LPA",
    page: null
  },
  {
    slug: "core-electrical",
    name: "Core Electrical Engineering",
    roles: ["Electrical Engineer", "Power Systems Engineer", "Design Engineer", "Maintenance Engineer"],
    skills: ["Circuit theory", "Electrical machines", "Power systems", "Control systems", "Power electronics", "Electrical measurements", "Switchgear and protection", "Renewable energy basics"],
    tools: ["MATLAB", "Simulink", "AutoCAD Electrical", "PSpice", "ETAP", "Multisim"],
    certs: ["NPTEL Electrical courses", "Coursera Power Systems courses", "edX Circuits courses", "GATE preparation resources"],
    projects: {
      beginner: ["Circuit simulation lab", "Transformer study", "Simple motor control", "Home wiring diagram", "Rectifier circuit design", "Power factor demo"],
      intermediate: ["Load flow analysis", "Motor speed control", "Solar panel setup study", "Power quality analysis", "Relay protection scheme", "Inverter design"],
      advanced: ["Smart grid model", "Power system stability study", "Renewable integration project", "Fault analysis project", "Substation design study", "Energy management system"]
    },
    salaryINR: "3-8 LPA",
    page: null
  },
  {
    slug: "core-mechanical",
    name: "Core Mechanical Engineering",
    roles: ["Mechanical Engineer", "Production Engineer", "Maintenance Engineer", "Manufacturing Engineer"],
    skills: ["Engineering mechanics", "Thermodynamics", "Fluid mechanics", "Manufacturing processes", "Machine design", "Heat transfer", "CAD modeling", "Industrial engineering"],
    tools: ["AutoCAD", "SolidWorks", "ANSYS", "MATLAB", "Creo", "Fusion 360"],
    certs: ["NPTEL Mechanical courses", "Coursera Manufacturing courses", "GATE preparation resources", "SolidWorks tutorials"],
    projects: {
      beginner: ["Thermodynamic cycle study", "Simple gear design", "Fluid flow experiment", "Material testing report", "Heat exchanger calculation", "Basic CAD assembly"],
      intermediate: ["Engine component design", "Pump performance analysis", "Manufacturing process plan", "Vibration analysis study", "HVAC load calculation", "Conveyor system design"],
      advanced: ["Complete machine design project", "Thermal system optimization", "Automated production line study", "Turbine design analysis", "Robotics integration study", "Energy audit of a system"]
    },
    salaryINR: "3-7 LPA",
    page: null
  },
  {
    slug: "core-civil",
    name: "Core Civil Engineering",
    roles: ["Civil Engineer", "Site Engineer", "Project Engineer", "Surveyor"],
    skills: ["Engineering mechanics", "Surveying", "Building materials", "Fluid mechanics", "Geotechnical engineering", "Transportation engineering", "Environmental engineering", "Construction management"],
    tools: ["AutoCAD", "STAAD Pro", "Revit", "Total Station", "Primavera", "MS Project"],
    certs: ["NPTEL Civil courses", "Autodesk Revit learning", "Coursera Construction courses", "GATE preparation resources"],
    projects: {
      beginner: ["Land survey exercise", "Building plan drafting", "Material testing report", "Concrete mix study", "Estimation of a room", "Soil test analysis"],
      intermediate: ["Road alignment design", "Water supply layout", "Foundation design study", "Drainage system plan", "Quantity estimation project", "Traffic study report"],
      advanced: ["Township planning project", "Highway design project", "Wastewater treatment design", "Dam or canal study", "Green building design", "Construction project schedule"]
    },
    salaryINR: "3-7 LPA",
    page: null
  },
  {
    slug: "testing-qa",
    name: "Testing and Quality Assurance",
    roles: ["QA Engineer", "Test Automation Engineer", "SDET", "Manual Test Engineer"],
    skills: ["Software testing fundamentals", "Test case design", "Manual testing", "Bug tracking", "Automation basics", "Selenium or Playwright", "API testing", "CI integration"],
    tools: ["Selenium", "Playwright", "Postman", "JIRA", "TestNG", "Cypress"],
    certs: ["ISTQB Foundation", "freeCodeCamp", "Test Automation University", "Coursera Software Testing courses"],
    projects: {
      beginner: ["Write test cases for a login page", "Bug report documentation", "Manual test of a to-do app", "Test plan for a form", "Boundary value analysis exercise", "Checklist based test suite"],
      intermediate: ["Selenium test automation", "API test collection", "Cross browser test suite", "Data driven test framework", "Regression test suite", "Performance test of an API"],
      advanced: ["Full automation framework", "CI integrated test pipeline", "End to end testing suite", "Load and stress testing project", "Mobile app automation", "BDD test framework"]
    },
    salaryINR: "3-9 LPA",
    page: null
  },
  {
    slug: "blockchain-web3",
    name: "Blockchain and Web3",
    roles: ["Blockchain Developer", "Smart Contract Developer", "Web3 Developer", "Solidity Developer"],
    skills: ["Blockchain fundamentals", "Cryptography basics", "Solidity", "Smart contracts", "Ethereum and the EVM", "ethers.js or web3.js", "DApp development", "Security and auditing"],
    tools: ["Solidity", "Hardhat", "Remix", "MetaMask", "ethers.js", "IPFS"],
    certs: ["freeCodeCamp", "Alchemy University", "Cyfrin Updraft", "Coursera Blockchain Specialization"],
    projects: {
      beginner: ["A simple token on a testnet", "Wallet connect demo page", "Read data from a public blockchain", "Basic Solidity storage contract", "Voting smart contract", "Send test ETH between wallets"],
      intermediate: ["ERC-20 token with a frontend", "NFT minting DApp", "Crowdfunding smart contract", "Decentralised to-do list", "Multi-sig wallet", "Staking contract demo"],
      advanced: ["Full DeFi lending demo", "NFT marketplace", "DAO with governance voting", "Audited and tested contract suite", "Cross-chain bridge demo", "On-chain game or prediction market"]
    },
    salaryINR: "5-14 LPA",
    page: null
  },
  {
    slug: "game-development",
    name: "Game Development",
    roles: ["Game Developer", "Unity Developer", "Gameplay Programmer", "Game Designer"],
    skills: ["Programming (C# or C++)", "Game loops and physics", "Unity or Unreal basics", "2D game development", "3D game development", "Animation and assets", "Game UI and audio", "Performance optimization"],
    tools: ["Unity", "Unreal Engine", "Godot", "Blender", "C#", "Visual Studio"],
    certs: ["Unity Learn", "freeCodeCamp", "CS50 Introduction to Game Development", "GameDev.tv courses"],
    projects: {
      beginner: ["Flappy-bird style 2D game", "Pong clone", "Simple platformer", "Whack-a-mole", "Memory card game", "2D top-down shooter"],
      intermediate: ["Endless runner with score", "Tower defense game", "2D RPG with inventory", "Physics puzzle game", "Local multiplayer game", "Simple 3D collectathon"],
      advanced: ["3D first-person prototype", "Procedurally generated levels", "Multiplayer networked game", "Mobile game published to a store", "Game with save/load + AI enemies", "Polished vertical-slice demo"]
    },
    salaryINR: "3-10 LPA",
    page: null
  },
  {
    slug: "ar-vr",
    name: "AR / VR and Immersive Tech",
    roles: ["AR/VR Developer", "Unity XR Developer", "Immersive Experience Developer", "3D Interaction Designer"],
    skills: ["3D fundamentals", "Unity or Unreal", "C# scripting", "AR foundations (ARCore/ARKit)", "VR interactions", "3D modelling basics", "Spatial UX", "Optimization for headsets"],
    tools: ["Unity", "Unreal Engine", "ARCore", "ARKit", "Blender", "Meta XR SDK"],
    certs: ["Unity Learn XR", "Coursera AR/VR courses", "Meta Spark tutorials", "freeCodeCamp"],
    projects: {
      beginner: ["Place a 3D object in AR", "AR business card", "360-degree photo viewer in VR", "Simple VR scene to look around", "AR face filter", "Marker-based AR demo"],
      intermediate: ["AR measuring-tape app", "VR room with grab interactions", "AR product preview in a room", "VR gallery walkthrough", "Hand-tracking demo", "AR navigation arrows"],
      advanced: ["Multiplayer VR experience", "AR game with world tracking", "VR training simulation", "Mixed-reality passthrough app", "Physics-based VR interactions", "Published headset or mobile AR app"]
    },
    salaryINR: "4-12 LPA",
    page: null
  }
];
