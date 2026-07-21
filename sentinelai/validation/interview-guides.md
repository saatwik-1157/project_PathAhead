# SentinelAI — Stakeholder Interview Guides

Phase-1 validation interviews. Aim: one conversation per stakeholder type;
30 minutes each. Take notes, and with permission record; a one-page summary of
each interview becomes submission evidence and shapes the requirements freeze.

**Ground rules for every interview**

- Ask about *their current reality* before pitching anything. The pitch comes
  in the last 10 minutes.
- Hunt for reasons the idea *won't* work — a named objection you can design
  around is worth more than polite encouragement.
- Close every interview with: "Who else should we talk to?" and "Could we
  come back to you with a prototype?"

---

## 1. Police officer / control-room staff

Getting the meeting: approach through your college (faculty letter), a campus
security liaison, or a community-policing outreach program.

1. Walk me through what happens today from the moment a street emergency is
   reported to a unit reaching the spot. Where does time get lost?
2. What fraction of emergency calls turn out to be false or unverifiable?
   How much effort do they consume?
3. When you get a call, what information do you wish you had that you
   usually don't? (location precision, live visuals, severity?)
4. Have you worked with CCTV command centres? What do they actually help
   with, and where do they fall short?
5. If a pole could send you a *verified* alert with GPS and a live feed —
   what would make you trust it? What false-alarm rate would be tolerable?
6. Who in the department would have to approve integrating alerts like this
   into the control room? What does that process look like?
7. Where would you deploy the first 10 nodes in this city, and why?

## 2. Ambulance / 108 (EMRI) operations staff

1. What's the typical sequence from call received to ambulance dispatched?
   What's the slowest step?
2. How often do callers struggle to describe the location? What happens then?
3. Does knowing incident severity in advance change what you dispatch?
4. Would an automated, sensor-verified crash alert with exact coordinates be
   usable in your current dispatch software, or would it need a human
   confirmation call first?
5. What would make you distrust an automated alert source?

## 3. Municipal / Smart City official

1. Who owns the streetlight infrastructure here, and who pays for its power
   and maintenance? (This decides who our real customer is.)
2. Is there an existing smart-pole / CCTV / command-centre project in this
   city? What happened to it — what worked, what stalled?
3. How does the city procure new safety technology — tender, pilot MoU,
   Smart City SPV budget? What's the smallest first step a startup can take?
4. What would make a proposal like ours die on someone's desk? (Privacy
   objections, vendor lock-in fears, maintenance burden?)
5. If a campus pilot showed a <5% false-alarm rate, what evidence would you
   need on top of that to consider 50 poles on city roads?

## 4. Potential users (students / women commuters) — mini-interviews

Five minutes each, after they take the survey. Ask only:

1. Tell me about the last time you felt unsafe on the street. What did you
   do?
2. (Show the concept in one sentence.) Would this have changed anything in
   that moment? Be honest — "no" is a useful answer.
3. The pole has a camera watching the street all the time. How do you feel
   about that trade-off?

---

## Recording the outcome

For each interview write a half-page summary: **who** (role, not name if they
prefer), **top 3 things we learned**, **objections raised**, **what we'll
change in the design**, **follow-up agreed**. Collect these in
`validation/interview-notes/` — they are attachable evidence and directly
feed the Phase-1 "requirements freeze" deliverable in the execution plan.
