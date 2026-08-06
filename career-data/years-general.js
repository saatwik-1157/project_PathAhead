/* ============================================================
   PathAhead — semester plan for non-technical courses.

   window.YEARS is written for engineering: semester 3 tells you
   to learn data structures and build a CRUD application. Shown
   to an MBBS, B.Com or BA student that is not just unhelpful,
   it reads as though nobody checked. This is the same shape,
   for courses where the work is clinical, commercial, legal,
   creative or academic rather than code.

   builder.js picks between the two by stream.
   ============================================================ */
window.YEARS_GENERAL = [
  {
    year: 1,
    focus: "Foundations and finding your feet",
    placement: "Placement is not the goal yet. Build the habits and fundamentals that everything later depends on.",
    semesters: [
      {
        sem: 1,
        skills: [
          "Master the core subjects of your first semester rather than memorising for marks",
          "Learn to read long texts and take structured notes",
          "Basic computer skills: word processing, spreadsheets, presentations",
          "Written and spoken communication"
        ],
        projects: [
          "Summarise one full unit of a subject in your own words",
          "Present a topic to your class or study group"
        ],
        certs: [],
        soft: [
          "Create a professional email address and a LinkedIn account",
          "Start reading a newspaper daily — it compounds for years"
        ],
        milestone: "Finish semester one with your fundamentals genuinely understood, not just passed."
      },
      {
        sem: 2,
        skills: [
          "Deepen the subject that interests you most",
          "Spreadsheet skills — formulas, charts, basic analysis",
          "Learn to research properly and cite sources",
          "Public speaking through class seminars"
        ],
        projects: [
          "A small survey or field study with findings written up",
          "A well-researched assignment you would be happy to show someone"
        ],
        certs: ["An introductory online course in your field"],
        soft: [
          "Join one club or society and stay with it",
          "Speak to two seniors about what their field is actually like"
        ],
        milestone: "Know which direction inside your course interests you, and why."
      }
    ]
  },
  {
    year: 2,
    focus: "Depth, and your first real exposure",
    placement: "Start building evidence of ability — practical exposure, not just marks.",
    semesters: [
      {
        sem: 3,
        skills: [
          "Core professional subjects in real depth",
          "Practical or laboratory technique specific to your course",
          "Data literacy — read a table or chart and say what it means",
          "Professional writing: reports, case notes, proposals"
        ],
        projects: [
          "A case study or field project in your discipline",
          "Document one practical exercise thoroughly enough to hand to someone else"
        ],
        certs: ["A recognised certification relevant to your field"],
        soft: ["Build a habit of asking questions in class", "Start a portfolio or logbook of your work"],
        milestone: "One piece of practical work you are genuinely proud of."
      },
      {
        sem: 4,
        skills: [
          "Specialise slightly — go deeper in your chosen area",
          "Analytical tools your field uses",
          "Time management across academics and outside work",
          "Teamwork on a real deliverable"
        ],
        projects: [
          "A group project with a defined outcome and your clear contribution",
          "A competition, moot, exhibition, camp or presentation outside class"
        ],
        certs: ["A second certification, or begin a professional exam syllabus"],
        soft: ["Apply for a summer internship or field placement", "Build your LinkedIn properly"],
        milestone: "Secure a summer internship, field posting or apprenticeship."
      }
    ]
  },
  {
    year: 3,
    focus: "Professional exposure and specialisation",
    placement: "This is the year that decides your first role. Depth plus proof.",
    semesters: [
      {
        sem: 5,
        skills: [
          "Advanced subjects in your specialisation",
          "Practical competence at close to professional standard",
          "Client, patient or stakeholder communication",
          "Preparation for the entrance or professional exam your path needs"
        ],
        projects: [
          "A substantial project, dissertation or case series",
          "Real supervised work — clinic, court, firm, farm, studio or classroom"
        ],
        certs: ["A specialisation certification recognised by employers in your field"],
        soft: ["A one-page CV that fits your field's conventions", "Mock interviews with a senior or teacher"],
        milestone: "A portfolio, logbook or record that shows real practical work."
      },
      {
        sem: 6,
        skills: [
          "Consolidate your specialisation",
          "Independent problem solving without step-by-step guidance",
          "Whatever software or instruments your profession uses daily",
          "Exam technique if you are sitting a competitive or licensing exam"
        ],
        projects: [
          "Lead a project end to end",
          "Publish, exhibit, present or submit your work somewhere real"
        ],
        certs: ["Complete the main professional certification for your path"],
        soft: ["Apply widely for internships and placements", "Build a professional reference or two"],
        milestone: "A serious internship, or a cleared stage of your professional exam."
      }
    ]
  },
  {
    year: 4,
    focus: "Placement, licensing or higher study",
    placement: "Convert everything into an offer, a licence, or a postgraduate seat.",
    semesters: [
      {
        sem: 7,
        skills: [
          "Interview and viva preparation in your subject",
          "Professional standards, ethics and regulation of your field",
          "Present your work clearly to people who are assessing you",
          "Entrance exam preparation if you are going for higher study"
        ],
        projects: [
          "Final year project, thesis or dissertation at full effort",
          "One flagship piece of work that represents you"
        ],
        certs: ["Any licence or registration your profession requires"],
        soft: ["Apply to every relevant recruiter and institution", "Rehearse your answers out loud"],
        milestone: "Applications submitted, or entrance exam form filled and preparation on track."
      },
      {
        sem: 8,
        skills: [
          "Close remaining gaps between you and the role you want",
          "Onboarding readiness — the practical things a new joiner must know",
          "Negotiation and professional conduct",
          "Plan for continuing education after graduation"
        ],
        projects: [
          "Complete and submit your final project properly",
          "Tidy your portfolio, logbook or record for handover"
        ],
        certs: ["Finish any pending certification before you graduate"],
        soft: ["Convert internships into offers", "Thank the people who helped you — it matters"],
        milestone: "An offer in hand, a licence secured, or a postgraduate seat confirmed."
      }
    ]
  }
];
