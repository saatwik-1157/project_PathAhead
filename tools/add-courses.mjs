/* ============================================================
   Adds non-engineering courses to the Career Builder.

   The builder only knew the 35 B.Tech branches, so a student
   doing B.Com, MBBS, BA or BBA had nothing to pick. This adds
   the courses actually offered across Indian colleges and
   groups everything by stream, and adds the career domains
   those courses lead to.

   Run once:  node tools/add-courses.mjs
   ============================================================ */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const BR = path.join(ROOT, "career-data", "branches.js");
const DM = path.join(ROOT, "career-data", "domains.js");

/* ---------- helpers so each entry stays readable ---------- */
const course = (stream, group, slug, name, summary, subjects, skills, tools, topDomains, higher, exams) => ({
  slug, name, group, stream, summary,
  coreSubjects: subjects, coreSkills: skills, tools,
  topDomains, higherStudies: higher, govExams: exams,
});

const dom = (slug, name, roles, skills, tools, certs, beginner, intermediate, advanced, salaryINR) => ({
  slug, name, roles, skills, tools, certs,
  projects: { beginner, intermediate, advanced },
  salaryINR, page: null,
});

/* ============================================================
   NEW CAREER DOMAINS
   ============================================================ */
const NEW_DOMAINS = [
  dom("clinical-medicine", "Clinical Medicine (Doctor)",
    ["Resident Doctor", "General Physician", "Medical Officer", "Specialist (post-MD)"],
    ["Clinical examination", "Diagnostic reasoning", "Patient communication", "Emergency response", "Medical ethics", "Record keeping"],
    ["Stethoscope and diagnostic kit", "Hospital EMR systems", "UpToDate", "PubMed"],
    ["BLS and ACLS", "NEET PG preparation", "Indian Medical Register"],
    ["Maintain a clinical case diary", "Shadow an OPD for a week", "Learn to record a full patient history"],
    ["Present a case in ward rounds", "Community health survey in a village", "Assist in minor procedures under supervision"],
    ["Publish a case report", "Run a health awareness camp", "Clinical audit in a department"],
    "₹6-12 LPA after MBBS, considerably higher after MD/MS"),

  dom("dentistry", "Dentistry",
    ["Dental Surgeon", "Orthodontist (post-MDS)", "Clinic Owner", "Dental Consultant"],
    ["Oral diagnosis", "Restorative procedures", "Manual dexterity", "Patient counselling", "Radiograph reading"],
    ["Dental chair units", "Intraoral scanners", "Digital X-ray", "CAD-CAM for prosthetics"],
    ["BDS internship", "NEET MDS preparation", "Dental Council of India registration"],
    ["Master dental anatomy models", "Observe restorations in clinic", "Learn sterilisation protocol"],
    ["Complete supervised fillings and extractions", "Dental camp in a school", "Case documentation with photographs"],
    ["Manage a full prosthetic case", "Set up a small practice plan", "Publish a clinical case series"],
    "₹4-8 LPA initially, higher with specialisation or private practice"),

  dom("ayush-medicine", "AYUSH Medicine (Ayurveda, Homeopathy, Unani)",
    ["AYUSH Medical Officer", "Consultant", "Wellness Centre Practitioner", "Researcher"],
    ["Classical text knowledge", "Diagnosis by traditional methods", "Herbal formulation", "Patient counselling", "Integrative care"],
    ["Panchakarma equipment", "Dispensary tools", "Clinical record systems"],
    ["AYUSH council registration", "Panchakarma certification", "Yoga instructor certification"],
    ["Study classical texts alongside the syllabus", "Maintain a herb identification notebook"],
    ["Internship in a government AYUSH hospital", "Community wellness camp"],
    ["Research on a classical formulation", "Set up an integrative wellness practice"],
    "₹3-7 LPA, more in private practice or wellness chains"),

  dom("pharmacy", "Pharmacy & Pharmaceuticals",
    ["Pharmacist", "Drug Inspector", "Clinical Research Associate", "Production Executive", "Medical Representative"],
    ["Pharmacology", "Formulation", "Quality control", "Regulatory knowledge", "Dispensing accuracy", "GMP practices"],
    ["HPLC", "Dissolution apparatus", "LIMS", "SAP for pharma", "MS Excel"],
    ["GPAT", "Drug Inspector exam", "Clinical research certification", "Regulatory affairs course"],
    ["Learn top 100 drugs and their uses", "Prepare simple formulations in the lab"],
    ["Industrial training in a pharma plant", "Quality control project on a tablet batch"],
    ["Clinical trial documentation project", "Regulatory dossier preparation"],
    "₹3-8 LPA, higher in clinical research and regulatory affairs"),

  dom("nursing", "Nursing & Patient Care",
    ["Staff Nurse", "ICU Nurse", "Nurse Educator", "Nursing Superintendent", "Nurse abroad (NCLEX/OET)"],
    ["Patient assessment", "Medication administration", "Infection control", "Critical care", "Empathy and communication"],
    ["Monitors and ventilators", "Hospital EMR", "Infusion pumps"],
    ["BLS and ACLS", "NCLEX-RN for abroad", "OET or IELTS", "Critical care nursing certificate"],
    ["Master vital signs and charting", "Learn injection and IV technique on models"],
    ["Ward posting across departments", "Community nursing survey"],
    ["ICU posting with supervision", "Prepare for NCLEX or a specialty certification"],
    "₹3-6 LPA in India, substantially higher abroad"),

  dom("physiotherapy", "Physiotherapy & Rehabilitation",
    ["Physiotherapist", "Sports Physio", "Rehabilitation Specialist", "Clinic Owner"],
    ["Musculoskeletal assessment", "Exercise prescription", "Manual therapy", "Patient motivation", "Anatomy knowledge"],
    ["Electrotherapy units", "Goniometer", "Therapeutic exercise equipment"],
    ["Dry needling certification", "Sports physiotherapy course", "Manual therapy certification"],
    ["Master surface anatomy", "Observe an OPD rehabilitation session"],
    ["Supervised patient handling", "Design a rehab plan for a common injury"],
    ["Work with a sports team", "Set up a small practice or home-visit service"],
    "₹3-6 LPA, higher in sports and private practice"),

  dom("allied-health", "Allied Health (Lab, Radiology, Optometry)",
    ["Medical Lab Technologist", "Radiographer", "Optometrist", "Dialysis Technologist", "Audiologist"],
    ["Sample handling", "Equipment operation", "Accuracy and record keeping", "Safety protocol", "Report interpretation"],
    ["Analysers", "X-ray, CT and MRI consoles", "Autorefractor", "LIMS"],
    ["Radiation safety certification", "Specialised equipment training", "Quality control certification"],
    ["Learn sample collection and labelling", "Shadow a diagnostic lab shift"],
    ["Internship in a hospital diagnostic department", "Quality control log for a month"],
    ["Specialise in one modality", "Train juniors on protocol"],
    "₹2.5-6 LPA, higher with specialisation"),

  dom("veterinary", "Veterinary Science & Animal Husbandry",
    ["Veterinary Officer", "Livestock Consultant", "Pet Clinic Practitioner", "Dairy Farm Manager"],
    ["Animal handling", "Surgery basics", "Disease diagnosis", "Livestock nutrition", "Public health awareness"],
    ["Veterinary surgical kit", "Ultrasound", "Farm management software"],
    ["Veterinary Council registration", "Artificial insemination training", "Poultry management course"],
    ["Farm visits and animal handling practice", "Learn common cattle and pet ailments"],
    ["Internship at a veterinary hospital", "Vaccination camp in a village"],
    ["Manage a dairy or poultry unit", "Set up a small pet practice"],
    "₹4-8 LPA, government posts add strong security"),

  dom("chartered-accountancy", "Chartered Accountancy & Audit",
    ["Chartered Accountant", "Auditor", "Tax Consultant", "Finance Controller", "CFO (long term)"],
    ["Accounting standards", "Auditing", "Direct and indirect tax", "Financial reporting", "Analytical rigour", "Ethics"],
    ["Tally", "SAP FICO", "MS Excel (advanced)", "Zoho Books", "Income Tax and GST portals"],
    ["CA Foundation, Intermediate and Final", "DISA", "IFRS certification"],
    ["Master double-entry and journal entries", "File a mock ITR", "Excel formulas and pivot tables"],
    ["Articleship at a CA firm", "Complete a statutory audit under supervision", "GST return filing for a small business"],
    ["Lead an audit assignment", "Handle a tax assessment", "Financial modelling for a real company"],
    "₹7-12 LPA at qualification, much higher with experience"),

  dom("banking-finance", "Banking, Insurance & Financial Services",
    ["Probationary Officer", "Relationship Manager", "Credit Analyst", "Insurance Underwriter", "Branch Manager"],
    ["Financial analysis", "Credit appraisal", "Customer relationship", "Regulatory compliance", "Sales ability"],
    ["Core banking systems", "MS Excel", "CIBIL and credit bureaus", "CRM tools"],
    ["IBPS PO and SBI PO", "NISM certifications", "JAIIB and CAIIB", "Insurance IC-38"],
    ["Learn to read a bank balance sheet", "Track markets daily for a month"],
    ["Bank internship", "Credit appraisal case study", "Mutual fund comparison report"],
    ["Build a loan portfolio analysis", "Clear a banking exam", "Investment advisory simulation"],
    "₹4-10 LPA, strong growth and job security in PSU banks"),

  dom("investment-markets", "Investment Banking & Capital Markets",
    ["Equity Research Analyst", "Investment Banking Analyst", "Portfolio Manager", "Risk Analyst"],
    ["Valuation", "Financial modelling", "Market analysis", "Excel mastery", "Report writing", "Attention to detail"],
    ["Excel", "Bloomberg Terminal", "Screener.in", "Power BI", "Python for finance"],
    ["CFA Level 1", "NISM Research Analyst", "Financial modelling certification", "FRM"],
    ["Build a DCF model for a listed company", "Track a virtual portfolio"],
    ["Write an equity research report", "Comparable company analysis", "Internship at a broking firm"],
    ["Full valuation of an IPO", "Sector thesis with recommendation", "Clear CFA Level 1"],
    "₹6-15 LPA, among the highest ceilings in commerce"),

  dom("marketing-brand", "Marketing, Advertising & Brand",
    ["Marketing Executive", "Brand Manager", "Digital Marketer", "Social Media Manager", "Growth Manager"],
    ["Consumer insight", "Campaign planning", "Copywriting", "Analytics", "Creativity", "Storytelling"],
    ["Google Analytics", "Meta Ads Manager", "Canva", "HubSpot", "SEMrush", "Google Ads"],
    ["Google Digital Garage", "Meta Blueprint", "HubSpot Content Marketing", "Google Ads certification"],
    ["Run a campaign for a college event", "Grow one social account for 30 days"],
    ["Manage marketing for a local business", "Run a small paid ad campaign", "SEO audit of a website"],
    ["Full go-to-market plan for a product", "Measurable growth case study with numbers"],
    "₹3.5-9 LPA, performance-linked growth is fast"),

  dom("human-resources", "Human Resources & People Management",
    ["HR Executive", "Talent Acquisition Specialist", "HR Business Partner", "L&D Manager"],
    ["Recruitment", "Employee relations", "Labour law basics", "Communication", "Empathy", "Data-driven decisions"],
    ["Naukri and LinkedIn Recruiter", "Darwinbox or Zoho People", "MS Excel", "Applicant tracking systems"],
    ["SHRM-CP", "HR analytics course", "Labour law certification"],
    ["Conduct mock interviews", "Map the hiring process of one company"],
    ["Campus recruitment coordination", "Design an onboarding plan", "HR internship"],
    ["Run an end-to-end hiring cycle", "Employee engagement survey with analysis"],
    "₹3.5-8 LPA, higher in HR analytics and business partnering"),

  dom("operations-supply-chain", "Operations, Supply Chain & Logistics",
    ["Operations Executive", "Supply Chain Analyst", "Logistics Manager", "Procurement Specialist"],
    ["Process optimisation", "Inventory planning", "Vendor management", "Data analysis", "Negotiation"],
    ["SAP MM", "Excel and Power BI", "Tally", "ERP systems"],
    ["Six Sigma Green Belt", "CSCP", "Lean management certification"],
    ["Map the supply chain of one everyday product", "Learn inventory formulas"],
    ["Warehouse or plant internship", "Process improvement study with before and after data"],
    ["End-to-end cost reduction project", "Demand forecasting model"],
    "₹4-9 LPA, strong demand from e-commerce and manufacturing"),

  dom("entrepreneurship", "Entrepreneurship & Startups",
    ["Founder", "Co-founder", "Business Development Lead", "Startup Generalist"],
    ["Customer discovery", "Unit economics", "Sales", "Resilience", "Product thinking", "Fundraising basics"],
    ["Notion", "Excel", "Canva", "Shopify or WordPress", "Razorpay", "Google Workspace"],
    ["NPTEL Entrepreneurship", "Y Combinator Startup School", "Incubator programmes at your college"],
    ["Interview 20 potential customers", "Sell something small and real", "Build a landing page"],
    ["Launch an MVP with paying users", "Run a college-level venture", "Apply to a student incubator"],
    ["Reach sustained revenue", "Raise a small round or a grant", "Build a founding team"],
    "Highly variable — no salary floor, no ceiling"),

  dom("law-litigation", "Law & Litigation",
    ["Advocate", "Litigation Associate", "Public Prosecutor", "Judicial Services (post-exam)"],
    ["Legal research", "Drafting", "Oral advocacy", "Statutory interpretation", "Client counselling"],
    ["SCC Online", "Manupatra", "Bar Council resources", "Case management tools"],
    ["All India Bar Examination", "Judicial services coaching", "Moot court achievements"],
    ["Read landmark judgments", "Observe district court proceedings", "Join moot court society"],
    ["Internship with an advocate", "Draft a plaint and a written statement", "Participate in a national moot"],
    ["Handle a matter under a senior", "Prepare for judicial services", "Publish a legal article"],
    "₹3-8 LPA starting in litigation, grows sharply with reputation"),

  dom("corporate-law", "Corporate & Commercial Law",
    ["Legal Associate", "Company Secretary", "Compliance Officer", "In-house Counsel"],
    ["Contract drafting", "Company law", "Due diligence", "Compliance tracking", "Negotiation"],
    ["SCC Online", "MCA portal", "Contract lifecycle tools", "MS Word (advanced)"],
    ["Company Secretary (CS)", "Diploma in corporate law", "Contract drafting certification"],
    ["Read and summarise real contracts", "Learn the Companies Act structure"],
    ["Internship at a law firm or company secretariat", "Draft an NDA and a service agreement"],
    ["Complete a due diligence exercise", "Handle statutory filings for a company"],
    "₹5-12 LPA in firms, higher in tier-one practices"),

  dom("civil-services", "Civil Services & Government",
    ["IAS, IPS, IFS officer", "State Civil Services Officer", "Section Officer", "Policy Analyst"],
    ["Wide reading", "Analytical writing", "Current affairs", "Decision making", "Public administration"],
    ["NCERT textbooks", "The Hindu", "PIB", "Test series platforms"],
    ["UPSC Civil Services", "State PSC exams", "SSC CGL"],
    ["Read NCERTs and a newspaper daily", "Start an answer-writing habit"],
    ["Complete one full syllabus revision", "Join a test series", "Write weekly essays"],
    ["Clear prelims", "Mains answer writing at speed", "Interview preparation"],
    "Pay scale as per government norms; the draw is responsibility and stability"),

  dom("teaching-education", "Teaching & Education",
    ["School Teacher", "Lecturer (post-NET)", "Academic Coordinator", "EdTech Content Developer", "Tutor"],
    ["Subject mastery", "Lesson planning", "Classroom management", "Assessment design", "Patience and clarity"],
    ["Google Classroom", "Canva", "PowerPoint", "Learning management systems"],
    ["B.Ed", "CTET or state TET", "UGC NET for lectureship", "Digital pedagogy course"],
    ["Teach a topic to juniors", "Prepare a lesson plan and deliver it"],
    ["Teaching practice in a school", "Build a question bank", "Record a teaching video and review it"],
    ["Clear CTET or NET", "Design a full unit with assessment", "Mentor a batch through an exam"],
    "₹2.5-7 LPA in schools, higher in colleges and EdTech"),

  dom("journalism-media", "Journalism & Mass Communication",
    ["Reporter", "Content Writer", "News Anchor", "Editor", "Public Relations Executive"],
    ["Reporting", "Writing clarity", "Interviewing", "Fact checking", "Media ethics", "Speed under deadline"],
    ["Adobe Premiere Pro", "Audacity", "WordPress", "Canva", "Social platforms"],
    ["Diploma in journalism", "Digital media certification", "Fact-checking course"],
    ["Write for the college magazine", "Report one local story properly", "Start a blog"],
    ["Internship at a newspaper or channel", "Produce a short documentary", "Build a writing portfolio"],
    ["Publish investigative work", "Anchor or produce a full segment", "Freelance for national outlets"],
    "₹3-7 LPA, wide range depending on outlet and specialisation"),

  dom("fashion-design", "Fashion & Textile Design",
    ["Fashion Designer", "Textile Designer", "Stylist", "Merchandiser", "Boutique Owner"],
    ["Sketching", "Garment construction", "Fabric knowledge", "Trend forecasting", "Colour theory"],
    ["Adobe Illustrator", "CLO 3D", "Sewing machines", "Pattern-making tools"],
    ["NIFT or NID entrance", "Pattern making certification", "Digital fashion illustration course"],
    ["Build a sketchbook", "Learn basic stitching and draping"],
    ["Design a small capsule collection", "Internship with a designer or export house"],
    ["Show a full collection", "Launch a small label", "Build a lookbook portfolio"],
    "₹3-7 LPA in industry, variable when independent"),

  dom("interior-design", "Interior & Spatial Design",
    ["Interior Designer", "Space Planner", "Set Designer", "Design Consultant"],
    ["Space planning", "Material knowledge", "3D visualisation", "Client handling", "Budgeting"],
    ["AutoCAD", "SketchUp", "3ds Max", "V-Ray", "Photoshop"],
    ["AutoCAD certification", "SketchUp and V-Ray course", "Vastu and building norms basics"],
    ["Redesign your own room to scale", "Learn to read floor plans"],
    ["Design a full apartment layout", "Internship with a design studio", "Material sourcing exercise"],
    ["Execute a real client project", "Build a rendered portfolio", "Site supervision experience"],
    "₹3-8 LPA, strong independent practice potential"),

  dom("animation-vfx", "Animation, VFX & Multimedia",
    ["2D/3D Animator", "VFX Artist", "Motion Graphics Designer", "Game Artist"],
    ["Drawing fundamentals", "Animation principles", "Rigging", "Compositing", "Storytelling"],
    ["Blender", "Maya", "After Effects", "Nuke", "Photoshop", "Unreal Engine"],
    ["Blender certification", "Animation mentor courses", "Adobe certified professional"],
    ["Master bouncing ball and walk cycle", "Learn Blender basics"],
    ["Produce a 30-second animated short", "Composite a VFX shot", "Build a demo reel"],
    ["Complete a professional-quality demo reel", "Freelance for a studio", "Contribute to a game or film"],
    "₹3-8 LPA, higher for skilled VFX and 3D artists"),

  dom("architecture-design", "Architecture",
    ["Architect", "Design Architect", "Site Architect", "Urban Designer"],
    ["Design thinking", "Technical drawing", "Structural awareness", "Building codes", "Model making", "Client presentation"],
    ["AutoCAD", "Revit", "SketchUp", "Rhino", "Lumion", "Adobe Suite"],
    ["Council of Architecture registration", "Revit and BIM certification", "Green building (IGBC/LEED)"],
    ["Daily sketching habit", "Measure and draw an existing building"],
    ["Design a residence to full drawings", "Internship at an architecture firm", "Physical model of a design"],
    ["Complete a working drawing set", "Site execution experience", "Competition entry"],
    "₹3-7 LPA initially, grows substantially with licence and practice"),

  dom("urban-planning", "Urban & Regional Planning",
    ["Urban Planner", "Transport Planner", "GIS Analyst", "Smart City Consultant"],
    ["Land use planning", "GIS analysis", "Policy understanding", "Survey design", "Data interpretation"],
    ["QGIS and ArcGIS", "AutoCAD", "Excel", "SPSS"],
    ["ITPI membership", "GIS certification", "Urban policy courses"],
    ["Map your own neighbourhood in QGIS", "Study one city's master plan"],
    ["Traffic or land use survey with analysis", "Internship with a planning body"],
    ["Prepare a sector plan", "Contribute to a smart city proposal"],
    "₹4-9 LPA, government and consultancy both hire"),

  dom("agriculture-agribusiness", "Agriculture & Agribusiness",
    ["Agriculture Officer", "Agronomist", "Agri-business Manager", "Farm Manager", "Agri-startup Founder"],
    ["Crop science", "Soil health", "Pest management", "Farm economics", "Extension and communication"],
    ["Soil testing kits", "GIS for agriculture", "Farm management software", "Drones for crop survey"],
    ["ICAR NET", "IBPS AFO", "FPO management course", "Organic certification"],
    ["Maintain a crop diary for a season", "Soil testing of local farms"],
    ["Field internship on a working farm", "Study one crop's economics end to end"],
    ["Advise a farmer group", "Launch an agri service or clear the AFO exam"],
    "₹3.5-8 LPA, government agriculture posts are highly sought"),

  dom("food-technology", "Food Technology & Nutrition",
    ["Food Technologist", "Quality Assurance Officer", "Dietitian", "Product Development Executive"],
    ["Food chemistry", "Processing techniques", "Quality standards", "Nutrition science", "Hygiene protocol"],
    ["Lab analysers", "FSSAI standards", "HACCP documentation", "Diet planning software"],
    ["FSSAI FoSTaC", "HACCP certification", "Registered Dietitian (RD)"],
    ["Analyse the label of ten packaged foods", "Basic food testing in the lab"],
    ["Internship in a food processing unit", "Develop and test one product recipe"],
    ["Full product development with shelf-life study", "Set up a QA system"],
    "₹3-7 LPA, dietetics grows well in private practice"),

  dom("hotel-management", "Hotel Management & Hospitality",
    ["Hotel Manager", "F&B Manager", "Chef", "Front Office Manager", "Event Manager"],
    ["Guest service", "Kitchen operations", "Team leadership", "Cost control", "Grace under pressure"],
    ["Property management systems", "POS systems", "Excel", "Kitchen equipment"],
    ["NCHMCT certification", "Food safety certification", "Sommelier or barista courses"],
    ["Learn kitchen basics and hygiene", "Front office simulation"],
    ["Industrial training at a hotel", "Manage a college event end to end"],
    ["Run a department during a busy season", "Cruise or international placement"],
    "₹3-6 LPA initially, strong global mobility"),

  dom("travel-tourism-aviation", "Travel, Tourism & Aviation",
    ["Cabin Crew", "Airport Operations Executive", "Travel Consultant", "Tour Manager", "Ground Staff"],
    ["Customer service", "Geography and destinations", "Safety procedures", "Languages", "Crisis handling"],
    ["Amadeus and Galileo GDS", "Booking platforms", "Excel"],
    ["IATA certification", "Cabin crew training", "Airport ground handling course"],
    ["Learn IATA airport codes", "Plan detailed itineraries for practice"],
    ["Internship with a travel agency or airline", "Handle a real group booking"],
    ["Clear cabin crew selection", "Manage a full tour operation"],
    "₹3-7 LPA, cabin crew higher with international carriers"),

  dom("psychology-counselling", "Psychology & Counselling",
    ["Counselling Psychologist", "Clinical Psychologist (post-M.Phil)", "School Counsellor", "HR Psychologist", "Researcher"],
    ["Active listening", "Assessment", "Empathy", "Research methods", "Ethical practice", "Report writing"],
    ["Psychometric tests", "SPSS", "Case recording formats"],
    ["M.A. or M.Sc Psychology", "RCI registration for clinical practice", "Counselling skills certification"],
    ["Learn major theories well", "Practise active listening deliberately"],
    ["Internship at a clinic or NGO", "Administer and interpret a psychometric test", "Small research study"],
    ["Supervised counselling hours", "Publish a research paper", "Specialise in a therapy approach"],
    "₹3-7 LPA, clinical practice pays considerably more after RCI"),

  dom("social-work-development", "Social Work & Development Sector",
    ["Social Worker", "Project Officer", "CSR Executive", "NGO Programme Manager", "Community Organiser"],
    ["Community mobilisation", "Programme design", "Report writing", "Empathy", "Field research", "Grant writing"],
    ["Excel", "Survey tools like KoboToolbox", "Reporting templates"],
    ["MSW", "Project management certification", "Monitoring and evaluation course"],
    ["Volunteer regularly with one organisation", "Document a community issue"],
    ["Field internship with an NGO", "Conduct a baseline survey", "Write a project proposal"],
    ["Manage a funded project", "Impact assessment study"],
    "₹3-6 LPA in NGOs, higher in CSR and international development"),

  dom("forensic-science", "Forensic Science & Criminology",
    ["Forensic Scientist", "Crime Scene Investigator", "Document Examiner", "Cyber Forensics Analyst"],
    ["Evidence handling", "Laboratory analysis", "Documentation", "Attention to detail", "Court testimony"],
    ["Microscopes", "GC-MS", "Fingerprint kits", "Cyber forensics tools like Autopsy"],
    ["Forensic science certification", "Cyber forensics course", "State FSL recruitment prep"],
    ["Learn chain-of-custody procedure", "Fingerprint classification practice"],
    ["Internship at a forensic laboratory", "Mock crime scene documentation"],
    ["Specialise in one branch", "Contribute to a real case under supervision"],
    "₹3-7 LPA, government FSL posts are competitive and secure"),

  dom("pure-sciences-research", "Pure Sciences & Research",
    ["Research Scholar", "Scientist (post-PhD)", "Lab Analyst", "Science Communicator", "Lecturer"],
    ["Experimental design", "Mathematical rigour", "Scientific writing", "Data analysis", "Persistence"],
    ["MATLAB", "Python", "Origin", "LaTeX", "Laboratory instruments"],
    ["CSIR-UGC NET", "GATE for science", "JAM for M.Sc", "Summer research fellowships"],
    ["Read one research paper a week", "Master lab techniques from the syllabus"],
    ["Summer research internship at an IIT or IISc", "Present at a student conference"],
    ["Publish a paper", "Clear NET or GATE", "Secure a PhD position"],
    "₹4-9 LPA in industry R&D; academia follows UGC scales"),

  dom("defence-services", "Defence & Uniformed Services",
    ["Army, Navy or Air Force Officer", "Merchant Navy Officer", "Paramilitary Officer"],
    ["Physical fitness", "Leadership", "Discipline", "Situational judgement", "Team command"],
    ["Fitness tracking", "SSB preparation material", "Current affairs sources"],
    ["NDA and CDS", "AFCAT", "SSB interview preparation", "Merchant Navy DNS or B.Sc Nautical"],
    ["Build a daily fitness routine", "Follow defence current affairs"],
    ["Clear a written exam", "Attend SSB and learn from the experience"],
    ["Clear SSB and medicals", "Complete academy training"],
    "Government pay scales with allowances, housing and pension"),

  dom("sports-fitness", "Sports, Fitness & Physical Education",
    ["Physical Education Teacher", "Fitness Trainer", "Sports Coach", "Strength and Conditioning Specialist", "Sports Manager"],
    ["Training design", "Anatomy and physiology", "Motivation", "Injury prevention", "Nutrition basics"],
    ["Fitness assessment tools", "Training apps", "Video analysis software"],
    ["ACSM or ACE certification", "NIS coaching diploma", "B.P.Ed", "First aid certification"],
    ["Train consistently and log it", "Learn the fundamentals of one sport deeply"],
    ["Coach a school team", "Design programmes for five real clients"],
    ["Get certified and build a client base", "Work with a competitive team"],
    "₹2.5-7 LPA, personal training and sports science pay more"),

  dom("performing-arts", "Performing & Fine Arts",
    ["Musician", "Dancer", "Theatre Artist", "Art Teacher", "Independent Artist"],
    ["Technique and practice discipline", "Stage presence", "Improvisation", "Collaboration", "Self-promotion"],
    ["Instruments", "DAWs like Ableton or FL Studio", "Recording equipment", "Portfolio platforms"],
    ["Graded music or dance examinations", "Diploma from a recognised institution", "Workshops with practising artists"],
    ["Daily practice routine", "Perform at college events"],
    ["Build a performance portfolio", "Record and publish your work", "Collaborate with other artists"],
    ["Ticketed performances", "Teach or run a studio", "Commissioned work"],
    "Highly variable — teaching and commissions provide the steady base"),

  dom("actuarial-statistics", "Actuarial Science & Statistics",
    ["Actuarial Analyst", "Statistician", "Risk Analyst", "Data Analyst"],
    ["Probability", "Statistical modelling", "Financial mathematics", "R and Python", "Precision"],
    ["R", "Python", "Excel (advanced)", "SAS", "SPSS"],
    ["IAI actuarial exams", "CT and CS series", "Statistics certifications"],
    ["Master probability from the syllabus", "Solve past actuarial papers"],
    ["Clear the first two actuarial papers", "Statistical project on a real dataset"],
    ["Clear four or more papers", "Internship at an insurance or consulting firm"],
    "₹5-12 LPA, rises sharply with each exam cleared"),

  dom("hospital-healthcare-management", "Hospital & Healthcare Management",
    ["Hospital Administrator", "Healthcare Operations Manager", "Medical Records Officer", "Health Insurance Executive"],
    ["Operations management", "Healthcare regulations", "Team coordination", "Budgeting", "Patient experience"],
    ["Hospital information systems", "Excel", "NABH documentation"],
    ["MHA or MBA in hospital management", "NABH certification", "Healthcare quality course"],
    ["Understand how a hospital department runs", "Map a patient journey"],
    ["Internship in hospital administration", "Process improvement study in one department"],
    ["Lead a quality accreditation exercise", "Manage a department"],
    "₹4-9 LPA, grows well in corporate hospital chains"),
];

/* ============================================================
   NEW COURSES
   ============================================================ */
const C = [];

/* ---------- Medical & Health Sciences ---------- */
const med = (s, n, sum, subj, dm, hi, ex) =>
  C.push(course("Medical & Health Sciences", "Medicine & Allied", s, n, sum, subj,
    ["Clinical reasoning", "Patient communication", "Attention to detail", "Stamina and composure", "Ethical judgement"],
    ["Diagnostic equipment", "Hospital information systems", "PubMed", "Medical reference apps"],
    dm, hi, ex));

med("mbbs", "MBBS (Medicine & Surgery)", "Five and a half year programme, including internship, that qualifies you as a doctor.",
  ["Anatomy", "Physiology", "Biochemistry", "Pathology", "Pharmacology", "Microbiology", "Medicine", "Surgery", "Obstetrics & Gynaecology", "Community Medicine"],
  ["clinical-medicine", "hospital-healthcare-management", "pure-sciences-research"], ["MD", "MS", "DNB", "MPH", "MBA in healthcare"], ["NEET PG", "INI-CET", "UPSC CMS", "State health services"]);

med("bds", "BDS (Dental Surgery)", "Five year dental programme covering oral health, surgery and prosthetics.",
  ["Dental Anatomy", "Oral Pathology", "Periodontics", "Orthodontics", "Prosthodontics", "Oral Surgery", "Conservative Dentistry"],
  ["dentistry", "hospital-healthcare-management"], ["MDS", "MPH", "Fellowships in implantology"], ["NEET MDS", "State dental services"]);

med("bams", "BAMS (Ayurveda)", "Five and a half year Ayurvedic medicine degree with classical and modern components.",
  ["Ayurvedic Samhita", "Dravyaguna", "Rasashastra", "Kayachikitsa", "Panchakarma", "Anatomy", "Physiology"],
  ["ayush-medicine", "hospital-healthcare-management"], ["MD Ayurveda", "MPH", "MBA in hospital management"], ["AYUSH NEET PG", "State AYUSH services"]);

med("bhms", "BHMS (Homeopathy)", "Five and a half year homeopathic medicine degree including internship.",
  ["Organon of Medicine", "Materia Medica", "Repertory", "Anatomy", "Physiology", "Practice of Medicine"],
  ["ayush-medicine"], ["MD Homeopathy", "MPH"], ["AYUSH NEET PG", "State AYUSH services"]);

med("bpt", "BPT (Physiotherapy)", "Four and a half year programme in movement science and rehabilitation.",
  ["Anatomy", "Exercise Therapy", "Electrotherapy", "Orthopaedics", "Neurology", "Cardiopulmonary Physiotherapy", "Sports Physiotherapy"],
  ["physiotherapy", "sports-fitness"], ["MPT", "MSc Sports Science", "Manual therapy fellowships"], ["State health services", "AIIMS and PGI recruitment"]);

med("bpharm", "B.Pharm (Pharmacy)", "Four year degree in drug science, formulation and pharmaceutical practice.",
  ["Pharmaceutics", "Pharmacology", "Pharmaceutical Chemistry", "Pharmacognosy", "Pharmaceutical Analysis", "Pharmacy Practice"],
  ["pharmacy", "clinical-medicine", "pure-sciences-research"], ["M.Pharm", "MBA in pharma management", "PharmD", "MS abroad"], ["GPAT", "Drug Inspector", "NIPER JEE"]);

med("bsc-nursing", "B.Sc Nursing", "Four year professional nursing degree with extensive clinical postings.",
  ["Anatomy & Physiology", "Medical Surgical Nursing", "Community Health Nursing", "Child Health Nursing", "Mental Health Nursing", "Midwifery"],
  ["nursing", "hospital-healthcare-management"], ["M.Sc Nursing", "Nurse Practitioner programmes", "NCLEX for abroad"], ["AIIMS NORCET", "State nursing recruitment", "Military Nursing Service"]);

med("bmlt", "BMLT (Medical Lab Technology)", "Diagnostic laboratory science covering pathology, biochemistry and microbiology testing.",
  ["Clinical Biochemistry", "Haematology", "Microbiology", "Histopathology", "Blood Banking", "Immunology"],
  ["allied-health", "pure-sciences-research"], ["M.Sc MLT", "Specialised diagnostics"], ["State health recruitment", "AIIMS technician exams"]);

med("bsc-radiology", "B.Sc Radiology & Imaging Technology", "Imaging technology covering X-ray, CT, MRI and ultrasound.",
  ["Radiographic Techniques", "Radiation Physics", "Cross-sectional Anatomy", "CT and MRI Technology", "Radiation Safety"],
  ["allied-health", "hospital-healthcare-management"], ["M.Sc Radiology", "Specialised modality training"], ["AIIMS technician exams", "State health recruitment"]);

med("boptom", "B.Optom (Optometry)", "Eye care, vision testing and optical dispensing.",
  ["Ocular Anatomy", "Optics", "Contact Lens", "Low Vision", "Binocular Vision", "Clinical Optometry"],
  ["allied-health"], ["M.Optom", "Fellowships in optometry"], ["State health services", "Hospital recruitment"]);

med("bvsc", "BVSc & AH (Veterinary Science)", "Five and a half year veterinary medicine and animal husbandry degree.",
  ["Veterinary Anatomy", "Animal Nutrition", "Veterinary Medicine", "Surgery", "Livestock Production", "Dairy Science"],
  ["veterinary", "agriculture-agribusiness"], ["MVSc", "PhD", "MBA in agribusiness"], ["ICAR NET", "State veterinary services", "UPSC"]);

/* ---------- Commerce & Management ---------- */
const com = (s, n, sum, subj, dm, hi, ex) =>
  C.push(course("Commerce & Management", "Commerce & Business", s, n, sum, subj,
    ["Numerical ability", "Analytical thinking", "Communication", "Business awareness", "Excel proficiency"],
    ["MS Excel", "Tally", "SAP", "Power BI", "Google Workspace"],
    dm, hi, ex));

com("bcom", "B.Com (General)", "Three year commerce degree covering accounting, taxation, economics and business law.",
  ["Financial Accounting", "Corporate Accounting", "Business Law", "Income Tax", "Cost Accounting", "Auditing", "Economics"],
  ["chartered-accountancy", "banking-finance", "investment-markets", "operations-supply-chain", "civil-services"],
  ["M.Com", "MBA", "CA", "CS", "CMA", "CFA"], ["IBPS PO", "SSC CGL", "RBI Grade B", "UPSC"]);

com("bcom-honours", "B.Com (Honours)", "Specialised commerce degree with deeper focus on accounting and finance.",
  ["Advanced Accounting", "Financial Management", "Corporate Law", "Taxation", "Business Statistics", "Investment Analysis"],
  ["chartered-accountancy", "investment-markets", "banking-finance", "actuarial-statistics"],
  ["M.Com", "MBA", "CA", "CFA", "MS Finance abroad"], ["RBI Grade B", "SEBI Grade A", "IBPS PO", "UPSC"]);

com("bba", "BBA (Business Administration)", "Three year management degree covering all core business functions.",
  ["Principles of Management", "Marketing Management", "Financial Management", "Human Resource Management", "Operations", "Business Analytics"],
  ["marketing-brand", "human-resources", "operations-supply-chain", "entrepreneurship", "banking-finance"],
  ["MBA", "PGDM", "MS in Management abroad"], ["CAT and MBA entrances", "IBPS PO", "SSC CGL"]);

com("bms", "BMS (Management Studies)", "Management degree with strong practical and case-based orientation.",
  ["Business Strategy", "Marketing", "Finance", "Organisational Behaviour", "Business Research", "Entrepreneurship"],
  ["marketing-brand", "entrepreneurship", "human-resources", "operations-supply-chain"],
  ["MBA", "PGDM", "Specialised masters"], ["CAT", "XAT", "NMAT"]);

com("bba-analytics", "BBA in Business Analytics", "Management degree combined with data analysis and decision science.",
  ["Business Statistics", "Data Visualisation", "Predictive Analytics", "Marketing Analytics", "Database Management", "Financial Analytics"],
  ["data-science", "marketing-brand", "operations-supply-chain", "investment-markets"],
  ["MBA in Analytics", "M.Sc Data Science", "MS abroad"], ["CAT", "Analytics certifications"]);

com("bbi", "B.Com Banking & Insurance", "Commerce degree specialising in banking operations and insurance.",
  ["Banking Operations", "Insurance Principles", "Risk Management", "Financial Markets", "Accounting", "Business Law"],
  ["banking-finance", "investment-markets", "actuarial-statistics"], ["MBA Finance", "M.Com", "CAIIB"], ["IBPS PO", "SBI PO", "LIC AAO", "RBI Grade B"]);

com("ca-integrated", "Chartered Accountancy (CA)", "Professional accountancy qualification taken alongside or instead of a degree.",
  ["Accounting", "Auditing", "Direct Tax", "Indirect Tax (GST)", "Corporate Law", "Financial Management", "Strategic Management"],
  ["chartered-accountancy", "investment-markets", "banking-finance"], ["CFA", "DISA", "MBA", "LLB"], ["CA Foundation", "CA Intermediate", "CA Final"]);

com("cs-professional", "Company Secretary (CS)", "Professional qualification in corporate governance and compliance.",
  ["Company Law", "Securities Law", "Corporate Governance", "Tax Law", "Economic and Commercial Laws", "Compliance Management"],
  ["corporate-law", "chartered-accountancy", "banking-finance"], ["LLB", "MBA", "CA"], ["CSEET", "CS Executive", "CS Professional"]);

com("cma", "Cost & Management Accountancy (CMA)", "Professional qualification focused on costing, budgeting and management accounting.",
  ["Cost Accounting", "Management Accounting", "Financial Management", "Direct Taxation", "Operations Management", "Strategic Cost Management"],
  ["chartered-accountancy", "operations-supply-chain", "banking-finance"], ["MBA", "CA", "CFA"], ["CMA Foundation", "CMA Intermediate", "CMA Final"]);

/* ---------- Science ---------- */
const sci = (s, n, sum, subj, dm, hi, ex) =>
  C.push(course("Science (B.Sc)", "Pure & Applied Science", s, n, sum, subj,
    ["Analytical thinking", "Laboratory technique", "Mathematical reasoning", "Scientific writing", "Precision"],
    ["Laboratory instruments", "Python or R", "Excel", "Origin or MATLAB"],
    dm, hi, ex));

sci("bsc-physics", "B.Sc Physics", "Study of matter, energy and the laws governing the physical universe.",
  ["Mechanics", "Electromagnetism", "Quantum Mechanics", "Thermodynamics", "Optics", "Mathematical Physics", "Solid State Physics"],
  ["pure-sciences-research", "data-science", "teaching-education", "civil-services"],
  ["M.Sc Physics", "Integrated PhD at IISc or IISER", "MS abroad"], ["JAM", "CSIR-UGC NET", "GATE Physics", "BARC OCES"]);

sci("bsc-chemistry", "B.Sc Chemistry", "Study of substances, their properties, reactions and applications.",
  ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Analytical Chemistry", "Spectroscopy", "Biochemistry"],
  ["pure-sciences-research", "pharmacy", "food-technology", "forensic-science"],
  ["M.Sc Chemistry", "PhD", "M.Pharm", "MS abroad"], ["JAM", "CSIR-UGC NET", "GATE Chemistry", "BARC"]);

sci("bsc-mathematics", "B.Sc Mathematics", "Study of structure, quantity, patterns and logical reasoning.",
  ["Real Analysis", "Linear Algebra", "Abstract Algebra", "Differential Equations", "Probability & Statistics", "Numerical Methods"],
  ["actuarial-statistics", "data-science", "pure-sciences-research", "teaching-education", "investment-markets"],
  ["M.Sc Mathematics", "M.Sc Statistics", "MCA", "Integrated PhD"], ["JAM", "CSIR-UGC NET", "ISI admission test", "Actuarial exams"]);

sci("bsc-biology", "B.Sc Biology / Zoology / Botany", "Study of living organisms, their structure, function and ecology.",
  ["Cell Biology", "Genetics", "Ecology", "Physiology", "Evolution", "Molecular Biology", "Taxonomy"],
  ["pure-sciences-research", "teaching-education", "agriculture-agribusiness", "allied-health"],
  ["M.Sc", "PhD", "M.Sc Biotechnology", "MPH"], ["JAM", "CSIR-UGC NET", "ICAR NET", "GAT-B"]);

sci("bsc-biotechnology", "B.Sc Biotechnology", "Applying biological systems to develop products and technologies.",
  ["Molecular Biology", "Genetic Engineering", "Microbiology", "Bioprocess Technology", "Immunology", "Bioinformatics"],
  ["biomedical-bioinformatics", "pure-sciences-research", "pharmacy", "food-technology"],
  ["M.Sc Biotechnology", "M.Tech Biotech", "PhD", "MS abroad"], ["GAT-B", "CSIR-UGC NET", "ICMR JRF", "DBT JRF"]);

sci("bsc-microbiology", "B.Sc Microbiology", "Study of microorganisms and their role in health, industry and environment.",
  ["General Microbiology", "Medical Microbiology", "Industrial Microbiology", "Immunology", "Virology", "Food Microbiology"],
  ["allied-health", "pure-sciences-research", "food-technology", "pharmacy"],
  ["M.Sc Microbiology", "PhD", "M.Sc Clinical Research"], ["CSIR-UGC NET", "ICMR JRF", "GAT-B"]);

sci("bsc-statistics", "B.Sc Statistics", "Collection, analysis and interpretation of data for decision making.",
  ["Probability Theory", "Statistical Inference", "Regression Analysis", "Sampling Techniques", "Design of Experiments", "Time Series"],
  ["data-science", "actuarial-statistics", "investment-markets", "pure-sciences-research"],
  ["M.Sc Statistics", "M.Stat at ISI", "M.Sc Data Science", "MBA"], ["ISI admission test", "JAM", "CSIR-UGC NET", "IAI exams"]);

sci("bsc-computer-science", "B.Sc Computer Science", "Computing fundamentals, programming and software development.",
  ["Programming", "Data Structures", "Database Systems", "Operating Systems", "Computer Networks", "Web Technologies"],
  ["software-development", "web-development", "data-science", "cyber-security", "cloud-devops"],
  ["MCA", "M.Sc Computer Science", "M.Tech", "MS abroad"], ["NIMCET", "GATE CS", "CSIR-UGC NET"]);

sci("bsc-forensic", "B.Sc Forensic Science", "Scientific analysis of evidence for criminal and legal investigation.",
  ["Forensic Chemistry", "Forensic Biology", "Fingerprint Science", "Questioned Documents", "Toxicology", "Criminal Law basics"],
  ["forensic-science", "cyber-security", "pure-sciences-research"], ["M.Sc Forensic Science", "PhD", "Cyber forensics specialisation"], ["State FSL recruitment", "CBI and NIA technical posts"]);

sci("bsc-environmental", "B.Sc Environmental Science", "Study of environmental systems, pollution and sustainability.",
  ["Ecology", "Environmental Chemistry", "Pollution Control", "Environmental Impact Assessment", "Climate Science", "Waste Management"],
  ["pure-sciences-research", "urban-planning", "agriculture-agribusiness"], ["M.Sc Environmental Science", "M.Tech Environmental Engineering", "MPH"], ["CSIR-UGC NET", "State pollution control board exams", "IFS"]);

sci("bsc-nutrition", "B.Sc Nutrition & Dietetics", "Science of food, nutrition and therapeutic diet planning.",
  ["Human Nutrition", "Clinical Dietetics", "Food Science", "Community Nutrition", "Biochemistry", "Diet Therapy"],
  ["food-technology", "allied-health", "sports-fitness"], ["M.Sc Dietetics", "Registered Dietitian", "MPH"], ["Hospital recruitment", "State health services"]);

sci("bsc-agriculture", "B.Sc Agriculture", "Four year professional degree in crop science, soil and farm management.",
  ["Agronomy", "Soil Science", "Plant Pathology", "Horticulture", "Agricultural Economics", "Entomology", "Extension Education"],
  ["agriculture-agribusiness", "food-technology", "entrepreneurship"], ["M.Sc Agriculture", "MBA Agribusiness", "PhD"], ["ICAR NET", "IBPS AFO", "State agriculture officer exams"]);

/* ---------- Computer Applications ---------- */
C.push(course("Computer Applications", "Computing", "bca", "BCA (Computer Applications)",
  "Three year applied computing degree focused on software development and IT skills.",
  ["Programming in C and Java", "Data Structures", "Database Management", "Web Development", "Software Engineering", "Computer Networks", "Operating Systems"],
  ["Programming", "Problem solving", "Debugging", "Database design", "Version control"],
  ["VS Code", "Git", "MySQL", "Java", "Python", "Linux"],
  ["software-development", "web-development", "data-science", "cyber-security", "cloud-devops", "mobile-development", "testing-qa"],
  ["MCA", "M.Sc Computer Science", "MBA in IT", "MS abroad"], ["NIMCET", "GATE CS (after MCA)", "State MCA entrances"]));

C.push(course("Computer Applications", "Computing", "bca-data-science", "BCA in Data Science / AI",
  "Computing degree specialising in data analysis and machine learning.",
  ["Python Programming", "Statistics", "Machine Learning", "Data Visualisation", "Database Systems", "Big Data Basics"],
  ["Python", "Statistical reasoning", "Data cleaning", "Model evaluation", "Storytelling with data"],
  ["Python", "Pandas", "scikit-learn", "Power BI", "SQL", "Jupyter"],
  ["data-science", "ai-ml", "data-engineering", "software-development"],
  ["M.Sc Data Science", "MCA", "MS abroad"], ["NIMCET", "Analytics certifications"]));

/* ---------- Arts & Humanities ---------- */
const arts = (s, n, sum, subj, dm, hi, ex) =>
  C.push(course("Arts & Humanities", "Humanities & Social Science", s, n, sum, subj,
    ["Critical reading", "Written argument", "Research", "Communication", "Contextual thinking"],
    ["Reference databases", "MS Word", "Citation tools", "Survey tools"],
    dm, hi, ex));

arts("ba-english", "BA English Literature", "Study of literature, language and critical theory.",
  ["British Literature", "Indian Writing in English", "Literary Criticism", "Linguistics", "World Literature", "Academic Writing"],
  ["journalism-media", "teaching-education", "civil-services", "marketing-brand"],
  ["MA English", "MA Journalism", "B.Ed", "MBA"], ["UPSC", "UGC NET English", "State PSC", "SSC CGL"]);

arts("ba-economics", "BA / B.Sc Economics", "Study of production, distribution and economic decision making.",
  ["Microeconomics", "Macroeconomics", "Econometrics", "Indian Economy", "Statistics", "Development Economics", "Public Finance"],
  ["banking-finance", "investment-markets", "civil-services", "data-science", "pure-sciences-research"],
  ["MA Economics", "M.Sc Economics at DSE or ISI", "MBA", "MS abroad"], ["RBI Grade B", "UPSC", "UGC NET Economics", "IES"]);

arts("ba-political-science", "BA Political Science", "Study of government, political theory and international relations.",
  ["Political Theory", "Indian Government and Politics", "International Relations", "Public Administration", "Comparative Politics"],
  ["civil-services", "journalism-media", "law-litigation", "social-work-development"],
  ["MA Political Science", "MA International Relations", "LLB", "MPP"], ["UPSC", "State PSC", "UGC NET"]);

arts("ba-psychology", "BA / B.Sc Psychology", "Scientific study of behaviour and mental processes.",
  ["General Psychology", "Developmental Psychology", "Abnormal Psychology", "Social Psychology", "Research Methods", "Psychological Testing"],
  ["psychology-counselling", "human-resources", "social-work-development", "teaching-education"],
  ["MA or M.Sc Psychology", "M.Phil Clinical Psychology", "PhD", "MBA HR"], ["UGC NET Psychology", "RCI registration route", "CUET PG"]);

arts("ba-history", "BA History", "Study of the past, sources and historical interpretation.",
  ["Ancient India", "Medieval India", "Modern India", "World History", "Historiography", "Archaeology basics"],
  ["civil-services", "teaching-education", "journalism-media"], ["MA History", "MA Archaeology", "B.Ed", "PhD"], ["UPSC", "UGC NET History", "ASI recruitment"]);

arts("ba-sociology", "BA Sociology", "Study of society, social behaviour and institutions.",
  ["Sociological Theory", "Indian Society", "Social Research Methods", "Rural and Urban Sociology", "Gender Studies"],
  ["social-work-development", "civil-services", "human-resources", "journalism-media"],
  ["MA Sociology", "MSW", "PhD"], ["UPSC", "UGC NET Sociology", "State PSC"]);

arts("ba-public-admin", "BA Public Administration", "Study of governance, policy and administrative systems.",
  ["Administrative Theory", "Indian Administration", "Public Policy", "Financial Administration", "Local Governance"],
  ["civil-services", "social-work-development", "human-resources"], ["MA Public Administration", "MPP", "MBA"], ["UPSC", "State PSC", "SSC CGL"]);

arts("bsw", "BSW (Social Work)", "Professional degree in community development and social welfare practice.",
  ["Social Case Work", "Group Work", "Community Organisation", "Social Welfare Administration", "Field Work", "Social Policy"],
  ["social-work-development", "psychology-counselling", "civil-services"], ["MSW", "MA Development Studies", "PhD"], ["UPSC", "State welfare department exams", "NGO sector recruitment"]);

/* ---------- Law ---------- */
const law = (s, n, sum, subj, dm) =>
  C.push(course("Law", "Legal Studies", s, n, sum, subj,
    ["Legal research", "Argumentation", "Drafting", "Critical reading", "Public speaking"],
    ["SCC Online", "Manupatra", "MS Word", "Case management tools"],
    dm, ["LLM", "MBA", "Judicial services preparation", "LLM abroad"],
    ["CLAT PG", "AIBE", "Judicial Services", "UPSC"]));

law("ba-llb", "BA LLB (5 year integrated)", "Integrated law degree combining humanities with legal education.",
  ["Constitutional Law", "Contract Law", "Criminal Law", "Torts", "Property Law", "Corporate Law", "Moot Court"],
  ["law-litigation", "corporate-law", "civil-services"]);

law("bba-llb", "BBA LLB (5 year integrated)", "Integrated law degree with a business and management foundation.",
  ["Business Law", "Constitutional Law", "Corporate Law", "Taxation Law", "Contract Law", "Mergers and Acquisitions"],
  ["corporate-law", "law-litigation", "chartered-accountancy"]);

law("llb", "LLB (3 year)", "Three year law degree taken after any bachelor's degree.",
  ["Constitutional Law", "Criminal Procedure", "Civil Procedure", "Evidence Law", "Jurisprudence", "Professional Ethics"],
  ["law-litigation", "corporate-law", "civil-services"]);

/* ---------- Design ---------- */
const des = (s, n, sum, subj, tools, dm) =>
  C.push(course("Design & Fine Arts", "Design", s, n, sum, subj,
    ["Visual thinking", "Sketching", "User empathy", "Iteration", "Presentation"],
    tools, dm, ["M.Des", "MFA", "MBA in Design Management", "MS abroad"],
    ["NID DAT", "NIFT entrance", "UCEED and CEED", "Portfolio-based admissions"]));

des("bdes-product", "B.Des Product / Industrial Design", "Designing physical products for manufacture and human use.",
  ["Design Process", "Materials and Manufacturing", "Ergonomics", "Product Sketching", "CAD Modelling", "Design Research"],
  ["SolidWorks", "Fusion 360", "Rhino", "KeyShot", "Adobe Suite"],
  ["mechanical-design", "ui-ux-design", "entrepreneurship"]);

des("bdes-communication", "B.Des Communication / Graphic Design", "Visual communication through typography, branding and digital media.",
  ["Typography", "Branding", "Layout Design", "Illustration", "Motion Graphics", "Design History"],
  ["Adobe Illustrator", "Photoshop", "InDesign", "Figma", "After Effects"],
  ["ui-ux-design", "marketing-brand", "animation-vfx"]);

des("bdes-fashion", "B.Des Fashion Design", "Garment design, textiles and fashion communication.",
  ["Fashion Illustration", "Pattern Making", "Garment Construction", "Textile Science", "Fashion Marketing", "Trend Analysis"],
  ["Adobe Illustrator", "CLO 3D", "Sewing and draping tools"],
  ["fashion-design", "marketing-brand", "entrepreneurship"]);

des("bdes-interior", "B.Des Interior Design", "Design of interior spaces for function, comfort and aesthetics.",
  ["Space Planning", "Materials and Finishes", "Furniture Design", "Lighting Design", "Working Drawings", "Estimation"],
  ["AutoCAD", "SketchUp", "3ds Max", "V-Ray", "Photoshop"],
  ["interior-design", "architecture-design", "entrepreneurship"]);

des("bdes-animation", "B.Des Animation & VFX", "Animation, visual effects and digital storytelling.",
  ["Animation Principles", "3D Modelling", "Rigging", "Compositing", "Storyboarding", "Sound Design"],
  ["Blender", "Maya", "After Effects", "Nuke", "Unreal Engine"],
  ["animation-vfx", "game-development", "ui-ux-design"]);

des("bfa", "BFA (Fine Arts)", "Four year degree in painting, sculpture and applied arts.",
  ["Drawing", "Painting", "Sculpture", "Art History", "Printmaking", "Applied Art"],
  ["Traditional media", "Adobe Photoshop", "Digital drawing tablets"],
  ["performing-arts", "animation-vfx", "teaching-education"]);

/* ---------- Architecture ---------- */
C.push(course("Architecture & Planning", "Built Environment", "barch", "B.Arch (Architecture)",
  "Five year professional degree in building design, licensed by the Council of Architecture.",
  ["Architectural Design", "Building Construction", "Structures", "History of Architecture", "Building Services", "Working Drawings", "Professional Practice"],
  ["Design thinking", "Technical drawing", "Spatial reasoning", "Model making", "Client communication"],
  ["AutoCAD", "Revit", "SketchUp", "Rhino", "Lumion", "Adobe Suite"],
  ["architecture-design", "urban-planning", "interior-design", "structural-civil"],
  ["M.Arch", "M.Plan", "MBA in construction management", "MS abroad"],
  ["NATA", "JEE Main Paper 2", "GATE Architecture", "Council of Architecture registration"]));

C.push(course("Architecture & Planning", "Built Environment", "bplan", "B.Plan (Urban Planning)",
  "Four year degree in planning cities, transport systems and regional development.",
  ["Urban Planning Theory", "GIS and Remote Sensing", "Transport Planning", "Housing", "Environmental Planning", "Planning Legislation"],
  ["Spatial analysis", "Policy reading", "Survey design", "Data interpretation", "Report writing"],
  ["QGIS", "ArcGIS", "AutoCAD", "Excel", "SPSS"],
  ["urban-planning", "architecture-design", "civil-services"],
  ["M.Plan", "M.Tech Transport Planning", "MS abroad"],
  ["NATA", "GATE Architecture and Planning", "State planning services"]));

/* ---------- Media & Communication ---------- */
C.push(course("Media & Communication", "Media", "bjmc", "BJMC (Journalism & Mass Communication)",
  "Three year degree in reporting, media production and communication.",
  ["Reporting and Editing", "Media Laws and Ethics", "Radio and TV Production", "Advertising", "Public Relations", "Digital Media"],
  ["Writing", "Interviewing", "Fact checking", "Camera and editing basics", "Deadline discipline"],
  ["Adobe Premiere Pro", "Audacity", "Canva", "WordPress", "Social platforms"],
  ["journalism-media", "marketing-brand", "civil-services"],
  ["MA Journalism", "MA Mass Communication", "MBA in Media Management"],
  ["IIMC entrance", "UGC NET Mass Communication", "UPSC"]));

/* ---------- Hospitality & Tourism ---------- */
C.push(course("Hospitality & Tourism", "Service Industry", "bhm", "BHM (Hotel Management)",
  "Four year degree covering hotel operations, culinary arts and hospitality service.",
  ["Food Production", "Food and Beverage Service", "Front Office Operations", "Housekeeping", "Hotel Accounting", "Hospitality Law"],
  ["Guest service", "Kitchen skills", "Team coordination", "Composure under pressure", "Cost awareness"],
  ["Property management systems", "POS systems", "Excel", "Professional kitchen equipment"],
  ["hotel-management", "travel-tourism-aviation", "entrepreneurship"],
  ["MBA in Hospitality", "M.Sc Hospitality", "Culinary specialisation abroad"],
  ["NCHMCT JEE", "IHM placements", "Cruise line recruitment"]));

C.push(course("Hospitality & Tourism", "Service Industry", "bba-aviation", "BBA Aviation / Airport Management",
  "Management degree focused on airline and airport operations.",
  ["Airline Operations", "Airport Management", "Aviation Safety", "Air Cargo", "Customer Service", "Aviation Law"],
  ["Customer service", "Safety awareness", "Coordination", "Communication", "Composure"],
  ["Amadeus GDS", "Airport operations software", "Excel"],
  ["travel-tourism-aviation", "operations-supply-chain", "hotel-management"],
  ["MBA Aviation", "Cabin crew training", "Pilot training (CPL)"],
  ["Airline recruitment drives", "AAI Junior Executive", "IATA certification"]));

C.push(course("Hospitality & Tourism", "Service Industry", "ba-tourism", "BA Travel & Tourism Management",
  "Degree in tourism operations, destination management and travel services.",
  ["Tourism Geography", "Travel Agency Operations", "Destination Management", "Tourism Marketing", "Ticketing and Fares"],
  ["Itinerary planning", "Customer service", "Geography knowledge", "Negotiation", "Languages"],
  ["Amadeus and Galileo", "Booking platforms", "Excel"],
  ["travel-tourism-aviation", "hotel-management", "marketing-brand"],
  ["MBA Tourism", "M.Sc Tourism", "IATA diploma"],
  ["IITTM entrance", "State tourism board recruitment"]));

/* ---------- Education ---------- */
C.push(course("Education", "Teaching", "bed", "B.Ed (Education)",
  "Two year professional teaching degree taken after graduation.",
  ["Pedagogy", "Educational Psychology", "Curriculum Development", "Assessment and Evaluation", "Inclusive Education", "Teaching Practice"],
  ["Lesson planning", "Classroom management", "Clarity of explanation", "Patience", "Assessment design"],
  ["Google Classroom", "Canva", "PowerPoint", "Learning management systems"],
  ["teaching-education", "psychology-counselling", "social-work-development"],
  ["M.Ed", "MA Education", "PhD in Education"],
  ["CTET", "State TET", "KVS and NVS recruitment", "UGC NET Education"]));

C.push(course("Education", "Teaching", "bped", "B.P.Ed (Physical Education)",
  "Professional degree in physical education, sports science and coaching.",
  ["Anatomy and Physiology", "Sports Training", "Sports Psychology", "Health Education", "Officiating and Coaching", "Yoga"],
  ["Training design", "Coaching", "Fitness assessment", "Motivation", "First aid"],
  ["Fitness assessment tools", "Video analysis", "Training apps"],
  ["sports-fitness", "teaching-education", "physiotherapy"],
  ["M.P.Ed", "NIS Diploma in coaching", "M.Sc Sports Science"],
  ["CTET for PE posts", "SAI recruitment", "State sports authority exams"]));

/* ---------- Performing Arts ---------- */
C.push(course("Design & Fine Arts", "Performing Arts", "bpa", "BPA (Performing Arts — Music, Dance, Theatre)",
  "Degree in classical or contemporary performance practice.",
  ["Practical Performance", "Theory of the art form", "History and Aesthetics", "Composition", "Stagecraft", "Ensemble Work"],
  ["Technique", "Practice discipline", "Stage presence", "Improvisation", "Collaboration"],
  ["Instruments", "Recording equipment", "DAWs like Ableton", "Portfolio platforms"],
  ["performing-arts", "teaching-education", "animation-vfx"],
  ["MPA", "MA in the discipline", "Diploma from a gharana or academy"],
  ["University auditions", "Cultural ministry scholarships", "Doordarshan and AIR grading"]));

/* ---------- Defence & Maritime ---------- */
C.push(course("Defence & Maritime", "Uniformed Services", "bsc-nautical", "B.Sc Nautical Science / Merchant Navy",
  "Training for deck officer roles aboard merchant ships.",
  ["Navigation", "Ship Stability", "Marine Meteorology", "Cargo Handling", "Maritime Law", "Ship Safety"],
  ["Navigation skill", "Physical fitness", "Discipline", "Situational awareness", "Teamwork at sea"],
  ["ECDIS", "Radar and ARPA", "GMDSS equipment", "Simulators"],
  ["defence-services", "operations-supply-chain"],
  ["Mates and Masters certificates of competency", "MBA in Shipping"],
  ["IMU CET", "DG Shipping approved courses", "Company sponsorships"]));

C.push(course("Defence & Maritime", "Uniformed Services", "nda-route", "NDA / Defence Entry (after 12th)",
  "Entry into the Army, Navy or Air Force through the National Defence Academy.",
  ["Mathematics", "General Ability", "Physics and Chemistry", "Current Affairs", "Physical Training", "Leadership Development"],
  ["Physical fitness", "Leadership", "Discipline", "Quick decision making", "Teamwork"],
  ["Fitness tracking", "SSB preparation material", "Current affairs sources"],
  ["defence-services", "sports-fitness", "civil-services"],
  ["Degree awarded through the academy", "Technical specialisations", "Defence Services Staff College later"],
  ["NDA written exam", "SSB interview", "CDS after graduation", "AFCAT"]));

/* ============================================================
   WRITE THE FILES
   ============================================================ */
const g = {};
new Function("window", fs.readFileSync(BR, "utf8"))(g);
const branches = g.BRANCHES;
branches.forEach((b) => { if (!b.stream) b.stream = "Engineering (B.Tech / B.E.)"; });

const existing = new Set(branches.map((b) => b.slug));
const added = C.filter((c) => !existing.has(c.slug));
const all = branches.concat(added);

fs.writeFileSync(BR, "window.BRANCHES = " + JSON.stringify(all, null, 2) + ";\n", "utf8");

const g2 = {};
new Function("window", fs.readFileSync(DM, "utf8"))(g2);
const domains = g2.DOMAINS_DATA;
const haveD = new Set(domains.map((d) => d.slug));
const addedD = NEW_DOMAINS.filter((d) => !haveD.has(d.slug));
fs.writeFileSync(DM, "window.DOMAINS_DATA = " + JSON.stringify(domains.concat(addedD), null, 2) + ";\n", "utf8");

const streams = {};
all.forEach((b) => { streams[b.stream] = (streams[b.stream] || 0) + 1; });
console.log(`courses: ${branches.length} → ${all.length} (+${added.length})`);
console.log(`domains: ${domains.length} → ${domains.length + addedD.length} (+${addedD.length})`);
console.log("\nstreams:");
Object.entries(streams).sort((a, b) => b[1] - a[1]).forEach(([s, n]) => console.log(`  ${String(n).padStart(3)}  ${s}`));

// every topDomains reference must resolve, or the builder shows a blank plan
const domSet = new Set(domains.concat(addedD).map((d) => d.slug));
const broken = [];
all.forEach((b) => (b.topDomains || []).forEach((t) => { if (!domSet.has(t)) broken.push(`${b.slug} → ${t}`); }));
if (broken.length) { console.error("\nUNRESOLVED topDomains:\n  " + broken.join("\n  ")); process.exit(1); }
console.log("\nevery topDomains reference resolves");
