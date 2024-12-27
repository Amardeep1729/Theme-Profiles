const themeColors = {
  brown: {
    secondaryBackground: "rgb(255,208,160)",
    backgroundGradient:
      "linear-gradient(90deg, rgba(255,208,160,1) 0%, rgba(159,113,67,1) 34%, rgba(63,30,1,1) 65%)",
  },
  blue: {
    secondaryBackground: "rgb(158,176,255)",
    backgroundGradient:
      "linear-gradient(90deg, rgba(158,176,255,1) 0%, rgba(74,98,254,1) 30%, rgba(0,8,255,1) 70%)",
  },
  purple: {
    secondaryBackground: "rgb(204,169,255)",
    backgroundGradient:
      "linear-gradient(90deg, rgba(204,169,255,1) 0%, rgba(147,67,226,1) 23%, rgba(76,0,133,1) 75%)",
  },
  orange: {
    secondaryBackground: "rgb(255,175,127)",
    backgroundGradient:
      "linear-gradient(90deg, rgba(255,175,127,1) 0%, rgba(255,158,57,1) 27%, rgba(255,86,0,1) 75%)",
  },
  yellow: {
    secondaryBackground: " rgb(255,252,131)",
    backgroundGradient:
      "linear-gradient(90deg, rgba(255,252,131,1) 0%, rgba(255,247,66,1) 40%, rgba(248,255,0,1) 76%)",
  },
  pink: {
    secondaryBackground: "rgb(255,179,217)",
    backgroundGradient:
      "linear-gradient(90deg, rgba(255,179,217,1) 0%, rgba(255,29,165,1) 31%, rgba(207,8,171,1) 73%)",
  },
  red: {
    secondaryBackground: "rgb(255,4,4)",
    backgroundGradient:
      "linear-gradient(90deg, rgba(255,4,4,1) 0%, rgba(255,90,60,1) 33%, rgba(255,160,160,1) 74%)",
  },
  green: {
    secondaryBackground: "rgb(173,224,124)",
    backgroundGradient:
      "linear-gradient(90deg, rgba(173,224,124,0.8820320364473915) 17%, rgba(53,196,14,0.741976014038428) 48%, rgba(0,93,22,0.741976014038428) 72%)",
  },
  cyan: {
    secondaryBackground: " rgb(103,228,232)",
    backgroundGradient:
      "linear-gradient(90deg, rgba(103,228,232,0.8820320364473915) 17%, rgba(9,77,121,0.9100432409291842) 45%, rgba(52,0,255,0.741976014038428) 87%)",
  },
  base: {
    secondaryBackground: "rgb(205, 150, 31)",
    backgroundGradient:
      "linear-gradient(90deg,rgba(205, 150, 31, 1) 0%,rgba(207, 199, 47, 1) 50%,rgba(200, 121, 52, 1) 100%)",
  },
};

// 📝 Apply Theme Based on Profile Color
function applyTheme(card, color) {
  if (themeColors[color]) {
    card.style.setProperty(
      "--secondary-background",
      themeColors[color].secondaryBackground
    );
    card.style.setProperty(
      "--background-gradient",
      themeColors[color].backgroundGradient
    );
  } else {
    console.warn(`Theme color '${color}' not defined. Using default theme.`);
  }
}

// Fetch profile data from data.json
async function fetchProfileData() {
  const response = await fetch("data.json");
  const data = await response.json();
  return data.profiles;
}

function createProfileCard(profile) {
  const card = document.createElement("div");
  card.className = "card";

  if (profile.color) {
    applyTheme(card, profile.color);
  }

  // URL profile name
  const profileUrl = `portfolio.html?profile=${encodeURIComponent(
    profile.name.trim().replace(/\s+/g, "-").toLowerCase()
  )}`;

  card.innerHTML = `
        <div class="card-content">
            <div class="profile-header">
                <img src="${profile.avatar}" alt="${
    profile.name
  }" class="profile-image">
                <h2 class="profile-name">${profile.name}</h2>
                <p class="profile-title">${profile.title}</p>
                <div class="social-links">
                    ${Object.entries(profile.socialLinks)
                      .slice(0, 3)
                      .map(
                        ([key, href]) => `  
                        <a href="${href}" class="social-link" target="_blank" rel="noopener noreferrer">
                            <i class="fa-brands fa-${key}"></i>
                        </a>
                    `
                      )
                      .join("")}
                </div>
                <button class="contact-button" onclick="window.location.href='${profileUrl}'">
                    <i class="fa-solid fa-eye" style="margin-right: 0.5rem;"></i>
                    Visit
                </button>
            </div>
            <p class="profile-description">${profile.bio}</p>
            <h3 class="section-title">Tech Stack</h3>
            <div class="tech-stack">
                ${profile["top-skills"]
                  .map(
                    (skill) => `  
                    <span class="tech-badge">${skill}</span>
                `
                  )
                  .join("")}
            </div>
        </div>
    `;

  return card;
}

// Render all profile cards
async function renderProfileCards() {
  const cardContainer = document.getElementById("card-container");
  const profileData = await fetchProfileData();

  profileData.forEach((profile) => {
    const card = createProfileCard(profile);
    cardContainer.appendChild(card);
  });

  lucide.createIcons();
}

document.addEventListener("DOMContentLoaded", renderProfileCards);
