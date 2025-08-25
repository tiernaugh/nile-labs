# Advisory Panel Review - Session 1
*Reviewing Nile Labs Context Brief & PRD*

## Panel Discussion

### **Karri Saarinen (Linear)** 🎯
**On Minimal Friction & MVP:**
"You're on the right track with 'platform serves experiments,' but I'm worried about a few things:

1. **The database model is already too complex.** Collaborators, forks, categories, tags - that's 4 ways to organize before you've proven people will even add ONE experiment. At Linear, we shipped without tags for 2 years. Start with: experiments, users, done.

2. **30 seconds to add an idea is still too long.** Make it 5 seconds. Title + one-line description. Everything else optional. You can always add fields once people are hooked.

3. **Why PostgreSQL for an MVP?** You're expecting <1000 experiments. A JSON file would work. Every technical decision should hurt a little - if it doesn't, you're overbuilding.

**Open Question:** What's the absolute minimum that proves people will make innovation visible? Ship that. Nothing more."

---

### **Linus Lee (Notion)** 🧪
**On Experimentation Culture:**
"Love the 'build shit' energy, but there's a contradiction:

1. **You say 'no fear of failure' but then have an 'Archived' status.** Kill it. Experiments are either 'Active' or 'Findings.' Every experiment produces findings. Netflix doesn't have failed experiments, they have 'learnings.'

2. **The fork feature is GENIUS.** That's how you get viral spread internally. But make the lineage beautiful - like a git commit graph. People should want to fork just to be part of the tree.

3. **Pre-population is critical.** But don't just add examples - add YOUR OWN real experiments. Even half-baked ones. Leadership vulnerability is the unlock.

**Open Question:** How do you make adding an experiment feel like play, not work? Right now it still feels like a form."

---

### **Julie Zhuo (Sundial/Meta)** 👥
**On Team Psychology & Adoption:**
"The social dynamics are everything here:

1. **'Leadership goes first' - YES, but HOW?** Don't just add experiments. Add embarrassing ones. Add failed ones. The CEO should post 'I tried to automate coffee ordering and broke the kitchen iPad.'

2. **The 30-day grace period for ideas is solving the wrong problem.** People aren't worried about IP theft, they're worried about judgment. How about: anonymous mode for first 48 hours? Let people test the waters.

3. **You're missing the biggest motivator: recognition.** Where's the 'Experiment of the Month'? Where's the Slack integration that celebrates when someone forks your idea? Make heroes of experimenters.

**Open Question:** What would make someone check this voluntarily on Monday morning instead of Instagram?"

---

### **Des Traynor (Intercom)** 💰
**On Business Value & Stakeholder Management:**
"Lloyd's concerns are valid and you're not addressing them:

1. **Every experiment needs a 'So What?' field.** Not hypothesis - that's academic. But 'How might this make/save money?' Even if speculative. Practice connecting innovation to value from day one.

2. **The category list is too internal.** Where's 'New Revenue Stream'? 'Cost Reduction'? 'Client Retention'? Speak Lloyd's language.

3. **Add a 'Graduate to Production' status.** Show clear wins. 'This experiment became a £50k client project.' That's how you justify Labs' existence.

**Open Question:** How do you measure ROI on innovation visibility? You need this answer before month 3."

---

### **Amelia Wattenberger (GitHub)** 📊
**On Making Work Visible:**
"The gallery concept is perfect, but you're thinking too much like a database:

1. **Where's the visual homepage?** Not a list - a GALAXY of experiments. Size = activity. Color = status. Lines = forks. Make it mesmerizing. People should screenshot it.

2. **Experiments need media.** A title and description is boring. Where's the sketch upload? The 30-second Loom? The prototype link? Make it Instagram for innovation.

3. **Progress visualization is missing.** Not status - PROGRESS. Show the journey. Commit history, update timeline, evolution. Make the process as interesting as the outcome.

**Open Question:** What would make someone proud to share their Labs profile in their email signature?"

---

### **Tom Occhino (Vercel)** 🔧
**On Technical Architecture:**
"The tech stack is fine, but you're missing key platform decisions:

1. **Why no API from day one?** If this succeeds, people will want to integrate. Slack bots, CLI tools, browser extensions. Design for extensibility even if you don't build it.

2. **T3 + Drizzle is solid, but why not Prisma?** Drizzle is less mature. For an experiment about experimentation, use boring technology. Save innovation for the features.

3. **Where's the export strategy?** When (not if) this dies, how do people get their data? Design the graceful shutdown from day one. It reduces adoption anxiety.

**Open Question:** What happens when someone wants to run their own instance for their team?"

---

### **Brian Chesky (Airbnb)** 🎨
**On Design-Led Innovation:**
"This feels like it was designed by committee, not conviction:

1. **What's the ONE magical moment?** At Airbnb, it's seeing your space live. At Labs, is it: Publishing your first experiment? Getting your first fork? Seeing the galaxy view? Pick one and make it incredible.

2. **You're overthinking permissions.** At early Airbnb, everything was public. Trust your team. You can add privacy when someone abuses it, not before.

3. **Where's the ritual?** Every Friday at 4pm, everyone adds one experiment they saw that week. Make it a cultural moment, not a tool.

**Open Question:** If you could only ship ONE feature, which would prove the hypothesis?"

---

### **Caitlin Kalinowski (OpenAI)** 🤖
**On AI & Emerging Tech:**
"You cut the AI brief generator, but that might be a mistake:

1. **The blank canvas problem is REAL.** But don't generate briefs - generate provocations. 'What if we used GPT-4 to...' Give people starts, not structures.

2. **Where's the AI analysis of patterns?** What experiments succeed? What gets forked? AI should surface insights: 'Teams that experiment with X tend to...'

3. **Consider AI as collaborator listing.** 'Collaborators: Tom, Sarah, GPT-4.' Normalize AI as team member from day one.

**Open Question:** How might AI make experimentation 10x easier without making it feel automated?"

---

## Consolidated Open Questions

### Must Answer Before Building:
1. **What's the ONE feature that proves people will make innovation visible?**
2. **How do we make this feel like play, not work?**
3. **What would make someone check this voluntarily?**
4. **How do we measure success in week 1 vs month 3?**

### Technical Decisions to Revisit:
1. **Is PostgreSQL overkill for MVP?**
2. **Should we use Drizzle or stick with Prisma?**
3. **Do we need an API from day one?**
4. **What's the data export/migration story?**

### Cultural/Adoption Questions:
1. **How does leadership model vulnerability?**
2. **Where's the recognition/celebration mechanism?**
3. **How do we connect experiments to business value?**
4. **What's the weekly ritual around Labs?**

### Feature Priority Questions:
1. **Visual galaxy homepage vs basic CRUD?**
2. **Media uploads vs text only?**
3. **Anonymous mode vs full transparency?**
4. **AI provocations vs no AI?**

---

## Key Tensions to Resolve

1. **Simple vs Valuable**: How minimal can we go while still proving the concept?
2. **Open vs Safe**: How do we balance transparency with psychological safety?
3. **Tool vs Culture**: Is this a platform problem or a behavior problem?
4. **Innovation vs Value**: How do we stay playful while speaking to business concerns?

---

## Recommended Next Steps

1. **Pick ONE core insight from each advisor to act on**
2. **Run a 'fake door' test - mockup the galaxy view and see if people engage**
3. **Write experiments yourself for a week before building anything**
4. **Define the ONE metric that matters for week 1**
5. **Consider starting with a Slack bot instead of a web app**

---

*"The best experiment is the one that proves you wrong the fastest." - Linus Lee*