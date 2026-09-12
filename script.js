// ==========================================
// CONFIGURATION: Set your Medium Username here
// ==========================================
const MEDIUM_USERNAME = "dhruti2020"; // <-- Replace with your Medium username (e.g. without the @)

// Update Hero & Footer links to your Medium profile
const mediumProfileUrl = `https://medium.com/@${MEDIUM_USERNAME}`;
const heroMediumLink = document.getElementById("hero-medium-link");
const mediumBtn = document.getElementById("medium-profile-btn");

if (heroMediumLink) heroMediumLink.href = mediumProfileUrl;
if (mediumBtn) mediumBtn.href = mediumProfileUrl;

// Fetch Medium Posts via RSS to JSON
async function fetchMediumPosts() {
  const container = document.getElementById("blog-container");
  const rssUrl = `https://medium.com/feed/@${MEDIUM_USERNAME}`;
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status === "ok" && data.items && data.items.length > 0) {
      container.innerHTML = ""; // Clear loading state

      // Take top 3 articles
      const posts = data.items.slice(0, 3);

      posts.forEach((post) => {
        // Strip HTML tags for clean snippet description
        const cleanSnippet = post.description
          .replace(/<[^>]+>/g, "")
          .substring(0, 120) + "...";

        const pubDate = new Date(post.pubDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        const articleCard = document.createElement("div");
        articleCard.classList.add("blog-card");
        articleCard.innerHTML = `
          <div>
            <span class="tag">Article</span>
            <h4><a href="${post.link}" target="_blank" rel="noopener noreferrer">${post.title}</a></h4>
            <p>${cleanSnippet}</p>
          </div>
          <div class="meta">
            <span><i class="far fa-calendar-alt"></i> ${pubDate}</span>
          </div>
        `;
        container.appendChild(articleCard);
      });
    } else {
      showFallbackBlogs(container);
    }
  } catch (error) {
    console.error("Error fetching Medium articles:", error);
    showFallbackBlogs(container);
  }
}

// Fallback if username isn't published yet or Medium returns empty
function showFallbackBlogs(container) {
  container.innerHTML = `
    <div class="blog-card">
      <span class="tag">Cyber Security</span>
      <h4><a href="#">Deepfake Detection: Navigating Synthetic Realities</a></h4>
      <p>An introduction to detecting deepfake media using computer vision and forensic analysis.</p>
      <div class="meta"><i class="far fa-calendar-alt"></i> Coming Soon</div>
    </div>
    <div class="blog-card">
      <span class="tag">Network Defense</span>
      <h4><a href="#">Understanding ARP Spoofing & Layer 2 Defenses</a></h4>
      <p>Analysis of network vulnerabilities at the data link layer and key mitigation strategies.</p>
      <div class="meta"><i class="far fa-calendar-alt"></i> Coming Soon</div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", fetchMediumPosts);