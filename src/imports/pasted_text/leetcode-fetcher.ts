## LEETCODE REAL-TIME DATA — SMART DISPLAY WITH AUTO-UPDATE

### LeetCode Profile:
Username: Prashant_Saini__
Profile URL: https://leetcode.com/u/Prashant_Saini__/

---

### REQUIREMENT 1 — FETCH REAL-TIME DATA FROM LEETCODE

Do NOT hardcode any LeetCode numbers anywhere.
Fetch live data every time the portfolio loads.

Use LeetCode's public GraphQL API:

async function fetchLeetCodeData() {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
        profile {
          ranking
        }
        userCalendar {
          streak
          totalActiveDays
        }
      }
      userContestRanking(username: $username) {
        rating
        globalRanking
        attendedContestsCount
        topPercentage
      }
    }
  `;

  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com'
      },
      body: JSON.stringify({
        query,
        variables: { username: 'Prashant_Saini__' }
      })
    });

    const data = await response.json();
    const stats = data.data.matchedUser.submitStats.acSubmissionNum;
    const profile = data.data.matchedUser.profile;
    const contest = data.data.userContestRanking;
    const calendar = data.data.matchedUser.userCalendar;

    return {
      total: stats.find(s => s.difficulty === 'All')?.count || 0,
      easy:  stats.find(s => s.difficulty === 'Easy')?.count || 0,
      medium:stats.find(s => s.difficulty === 'Medium')?.count || 0,
      hard:  stats.find(s => s.difficulty === 'Hard')?.count || 0,
      ranking: profile.ranking,
      contestRating: contest?.rating || 0,
      globalRank: contest?.globalRanking || 0,
      contestsAttended: contest?.attendedContestsCount || 0,
      topPercentage: contest?.topPercentage || 0,
      streak: calendar?.streak || 0,
      totalActiveDays: calendar?.totalActiveDays || 0
    };

  } catch (error) {
    console.error('LeetCode API fetch failed:', error);
    return null;
  }
}

---

### REQUIREMENT 2 — SMART "ROUNDED DOWN + PLUS" DISPLAY

This is the core display logic.
Never show the exact number of problems solved.
Instead, round DOWN to the nearest 5, then show "+ " after it.

Formula:
const roundedDisplay = Math.floor(total / 5) * 5;
const display = `${roundedDisplay}+`;

Examples:
- 186 solved → show "185+"
- 190 solved → show "190+"
- 191 solved → show "190+"
- 194 solved → show "190+"
- 195 solved → show "195+"
- 201 solved → show "200+"
- 249 solved → show "245+"

Implementation:
function getSmartDisplay(total) {
  const rounded = Math.floor(total / 5) * 5;
  return `${rounded}+`;
}

// Usage:
const smartTotal = getSmartDisplay(data.total);
// Display smartTotal in the UI — e.g. "185+"

Apply this same rounding logic to Easy, Medium, Hard 
breakdown counts as well:
- Easy: getSmartDisplay(data.easy)
- Medium: getSmartDisplay(data.medium)
- Hard: getSmartDisplay(data.hard)

---

### REQUIREMENT 3 — AUTO-UPDATE EVERY 5 MINUTES

The LeetCode section must automatically re-fetch 
and update without the user refreshing the page.

Implementation:
// Initial fetch on page load
async function initLeetCode() {
  showLeetCodeSkeleton(); // show loading state
  const data = await fetchLeetCodeData();
  if (data) {
    updateLeetCodeUI(data);
    storeLeetCodeCache(data); // save to localStorage
  } else {
    loadLeetCodeFromCache(); // fallback to last known data
  }
}

// Auto-refresh every 5 minutes (300000ms)
setInterval(async () => {
  const data = await fetchLeetCodeData();
  if (data) {
    updateLeetCodeUI(data);
    storeLeetCodeCache(data);
    showUpdatePulse(); // brief visual flash to show update
  }
}, 300000);

// Cache functions
function storeLeetCodeCache(data) {
  localStorage.setItem('leetcode_cache', JSON.stringify({
    data,
    timestamp: Date.now()
  }));
}

function loadLeetCodeFromCache() {
  const cached = localStorage.getItem('leetcode_cache');
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    updateLeetCodeUI(data);
    showCacheNotice(timestamp); // show "Last updated X mins ago"
  }
}

// Call on page load
initLeetCode();

---

### REQUIREMENT 4 — UPDATE PULSE ANIMATION

When data refreshes automatically, show a brief 
visual indicator so user knows it updated:

function showUpdatePulse() {
  const card = document.querySelector('.card-leetcode');
  card.classList.add('just-updated');
  setTimeout(() => card.classList.remove('just-updated'), 1000);
}

.card-leetcode.just-updated {
  animation: update-pulse 1s ease-out;
}

@keyframes update-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); }
  50%  { box-shadow: 0 0 0 12px rgba(249, 115, 22, 0.1); }
  100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
}

---

### REQUIREMENT 5 — DISPLAY UI LAYOUT

After fetching and processing, display in the 
LeetCode Arena card:

## TOP SECTION:
Large display number:
  <span class="lc-total">[smartTotal]</span>
  problems solved

Style:
.lc-total {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #F97316, #FB923C, #FBBF24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

Subtext: "problems solved" in muted white, small

## DIFFICULTY RINGS (3 SVG circles side by side):

Easy ring   — color #10B981 (green)  — shows getSmartDisplay(easy)
Medium ring — color #F59E0B (yellow) — shows getSmartDisplay(medium)  
Hard ring   — color #EF4444 (red)    — shows getSmartDisplay(hard)

Each ring:
<div class="diff-ring">
  <svg viewBox="0 0 36 36" width="75" height="75">
    <circle cx="18" cy="18" r="14"
      fill="none" 
      stroke="rgba(255,255,255,0.06)" 
      stroke-width="3"/>
    <circle cx="18" cy="18" r="14"
      fill="none" 
      stroke="[COLOR]" 
      stroke-width="3"
      stroke-dasharray="[PERCENT] 100"
      stroke-dashoffset="25"
      stroke-linecap="round"
      class="ring-progress"
      style="transition: stroke-dasharray 1.5s ease 0.5s"/>
  </svg>
  <div class="ring-label">
    <span class="ring-count">[smartCount]</span>
    <span class="ring-diff">Easy / Medium / Hard</span>
  </div>
</div>

Ring percent formula:
const easyPercent = (easy / total) * 100;
const mediumPercent = (medium / total) * 100;
const hardPercent = (hard / total) * 100;

## STATS ROW (below rings):

Display as small pill badges:
- 🏆 Rank: #[ranking]
- ⚡ Rating: [contestRating]  
- 🌍 Global: #[globalRank]
- 📅 Streak: [streak] days
- 🎯 Top: [topPercentage]%

.lc-stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  background: rgba(249, 115, 22, 0.08);
  border: 1px solid rgba(249, 115, 22, 0.2);
  color: #FB923C;
  margin: 3px;
}

## LAST UPDATED INDICATOR:
Small text bottom-right of card:
"🔄 Live · updates every 5 min"
or when using cache:
"📦 Cached · updated [X] min ago"

.lc-live-badge {
  font-size: 0.62rem;
  color: rgba(255,255,255,0.3);
  margin-top: 12px;
  text-align: right;
}

---

### REQUIREMENT 6 — SKELETON LOADER

Show while data is loading:

function showLeetCodeSkeleton() {
  document.querySelector('.lc-total').innerHTML = `
    <div class="skeleton" style="width:100px; height:48px;"></div>
  `;
  // Replace all live values with skeleton bars
}

.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.04) 0%,
    rgba(255,255,255,0.09) 50%,
    rgba(255,255,255,0.04) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

---

### REQUIREMENT 7 — ERROR FALLBACK

If API fails AND no cache exists:

function showLeetCodeError() {
  document.querySelector('.lc-total').textContent = '---';
  document.querySelector('.lc-live-badge').textContent = 
    '⚠️ Could not load data';
}

If API fails BUT cache exists:
- Load cached data silently
- Show "📦 Cached data" badge

---

### SUMMARY OF DISPLAY LOGIC:

Real solved count → Display shown:
185 → "185+"
186 → "185+"  ← current case
187 → "185+"
188 → "185+"
189 → "185+"
190 → "190+"  ← auto-updates when this threshold crossed
191 → "190+"
195 → "195+"
200 → "200+"

This makes the number always look 
impressive and updates automatically 
as problems are solved on LeetCode.

---

### KEEP UNCHANGED
- Card layout and glassmorphism design
- Certificate Vault and GitHub Stats cards
- All CSS variables and color palette
- All other sections outside Deep Dive