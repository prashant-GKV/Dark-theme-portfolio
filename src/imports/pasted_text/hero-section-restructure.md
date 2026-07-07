## HERO SECTION RESTRUCTURE

### 1. REMOVE COMPLETELY
- Delete the entire "Who I am" standalone section from the portfolio.
- Remove the "Who I am" heading entirely — it should not appear anywhere.

---

### 2. MOVE BIO TO HERO (Front of Portfolio)

Integrate the following bio text directly into the Hero section 
(the very first thing visible on page load):

Bio content:
"I got into tech because I wanted to build things that actually work — 
not just look good in a demo. That curiosity turned into five internships, 
nine certifications, and 185+ problems torn apart on LeetCode."

"I've shipped full-stack apps, trained ML models, and wired up AI pipelines. 
Right now I'm deep into cloud infrastructure and LLM applications."

"If you're working on something hard and need someone who'll show up 
ready — let's talk."

---

### 3. HIGHLIGHT IMPORTANT WORDS IN BIO

Wrap these specific keywords in a gradient highlight span:
- "five internships"         → cyan-to-purple gradient text
- "nine certifications"      → cyan-to-purple gradient text  
- "185+ problems"            → emerald-to-cyan gradient text
- "full-stack apps"          → purple-to-blue gradient text
- "ML models"                → pink-to-purple gradient text
- "AI pipelines"             → cyan-to-emerald gradient text
- "cloud infrastructure"     → blue-to-cyan gradient text
- "LLM applications"         → purple-to-pink gradient text
- "let's talk."              → bright cyan, bold, underline on hover, 
                               cursor pointer, glow effect

CSS for gradient highlight:
.highlight {
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
}

Each keyword group should have a slightly different gradient to 
create visual variety. Keywords should feel like they glow softly 
against the dark background.

---

### 4. ANIMATED ROLE/TITLE — TYPEWRITER EFFECT

In the Hero section, below the name "Prashant Saini", add an 
animated title line that cycles through roles with a typewriter effect.

Roles to cycle through (in this order):
1. "Full Stack Developer"
2. "AI Engineer"  
3. "ML Engineer"
4. "Cloud Infrastructure Engineer"
5. "LLM Application Builder"
6. "Problem Solver"

Animation behavior:
- Type each role character by character (typing speed: 80ms per character)
- Pause for 1800ms after fully typed
- Delete character by character (deleting speed: 40ms per character)  
- Pause 400ms before typing the next role
- Loop infinitely through all roles
- Show a blinking cursor "|" at the end while typing and deleting

Styling:
- Font: Space Grotesk or Syne, font-weight: 700
- Font size: clamp(1.4rem, 3vw, 2rem)
- Color: gradient text — linear-gradient(90deg, #06B6D4, #6D28D9)
- Blinking cursor: animate opacity 0 → 1, 0.6s step-end infinite
- Wrap in a line like: "I'm a " + [animated role] 
  OR just the role alone with a prefix label above it

Example JS implementation:
const roles = [
  "Full Stack Developer",
  "AI Engineer",
  "ML Engineer", 
  "Cloud Infrastructure Engineer",
  "LLM Application Builder",
  "Problem Solver"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeRole() {
  const current = roles[roleIndex];
  const displayed = isDeleting 
    ? current.substring(0, charIndex--) 
    : current.substring(0, charIndex++);
  
  document.getElementById('typed-role').textContent = displayed;

  let speed = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === current.length + 1) {
    speed = 1800; // pause after full word
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    speed = 400; // pause before next word
  }

  setTimeout(typeRole, speed);
}

typeRole(); // call on page load

---

### 5. HERO LAYOUT — HORIZONTAL (Side by Side)

Restructure Hero into two columns using Flexbox:

LEFT COLUMN (40%):
- Profile photo with glassmorphism card + animated glow border
- Name: "Prashant Saini" with gradient text + glow
- Location: "Moradabad, India" in muted cyan, small font
- Social icons row below

RIGHT COLUMN (60%):
- "I'm a " label in muted color, small caps
- Animated typewriter role directly below (Section 4 above)
- Bio paragraphs with highlighted keywords (Section 3 above)
- CTA buttons: "View My Work" + "Let's Connect"

Layout CSS:
.hero-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 60px;
  min-height: 100vh;
  padding: 80px 10%;
}

@media (max-width: 768px) {
  .hero-container {
    flex-direction: column;
    padding: 60px 6%;
    gap: 40px;
  }
}

---

### 6. BIO TEXT REVEAL ANIMATION

Animate the bio paragraphs on page load:
- Each paragraph fades in and slides up: 
  opacity: 0 → 1, translateY(20px) → translateY(0)
- Stagger delay: paragraph 1 at 0.4s, paragraph 2 at 0.7s, 
  paragraph 3 at 1.0s
- Duration: 0.6s ease-out each

---

### KEEP UNCHANGED
- All other sections (Skills Globe, Tech Stack, Projects, 
  GitHub Stats, LeetCode Stats, Contact)
- All existing colors, glassmorphism styles, and CSS variables
- All existing animations outside of Hero