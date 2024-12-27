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
function applyTheme(color) {
  if (themeColors[color]) {
    document.documentElement.style.setProperty(
      "--secondary-background",
      themeColors[color].secondaryBackground
    );
    document.documentElement.style.setProperty(
      "--background-gradient",
      themeColors[color].backgroundGradient
    );
  } else {
    console.warn(`Theme color '${color}' not defined. Using default theme.`);
  }
}

// 📝 Typing Effect
function startTypingEffect(texts) {
  let index = 0;
  let charIndex = 0;
  let currentText = "";
  let isDeleting = false;

  function typeEffect() {
    const textElement = document.getElementById("changing-text");

    if (!textElement) {
      console.error("Element with ID 'changing-text' not found.");
      return;
    }

    if (!isDeleting && charIndex < texts[index].length) {
      currentText += texts[index][charIndex++];
    } else if (isDeleting && charIndex > 0) {
      currentText = currentText.slice(0, -1);
      charIndex--;
    }

    textElement.textContent = currentText;

    if (charIndex === texts[index].length && !isDeleting) {
      isDeleting = true;
      setTimeout(typeEffect, 1000);
      return;
    }

    if (charIndex === 0 && isDeleting) {
      isDeleting = false;
      index = (index + 1) % texts.length;
    }

    setTimeout(typeEffect, isDeleting ? 100 : 150);
  }

  typeEffect();
}

// 📝 Fetch and Display Profile Data
fetch("data.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch data.json");
    }
    return response.json();
  })
  .then((data) => {
    const urlParams = new URLSearchParams(window.location.search);
    const profileParam = urlParams.get("profile");

    if (!profileParam) {
      document.body.innerHTML = "<h1>Profile Not Found</h1>";
      return;
    }

    // Find profile by name
    const profile = data.profiles.find(
      (p) => p.name.trim().replace(/\s+/g, "-").toLowerCase() === profileParam
    );

    if (profile) {
      if (profile.typingTexts) {
        startTypingEffect(profile.typingTexts);
      }
      // console.log("Profile found:", profile);
      if (profile.color) {
        applyTheme(profile.color);
      }
    } else {
      console.warn("Profile not found.");
      document.getElementById("changing-text").textContent =
        "Profile Not Found";
    }

    if (profile) {
      if (profile) {
        document.querySelector("title").textContent = profile.name;
        document.querySelector(".header-text h1 span").textContent =
          profile.name;
        document.querySelector(".about-col1 img").src = profile.avatar;
        document.querySelector(".banner img").src = profile.banner;

        populateAboutSection(profile);
        populateServicesSection(profile.interests);
        populatePortfolioSection(profile.posts);
        populateSocialLinks(profile.socialLinks);
        populateCopyright(profile.name);
      } else {
        document.body.innerHTML = "<h1>Profile Not Found</h1>";
      }

      populateAboutSection(profile);
      populateServicesSection(profile.interests);
      populatePortfolioSection(profile.posts);
      populateSocialLinks(profile.socialLinks);
      populateCopyright(profile.name);
    } else {
      document.body.innerHTML = "<h1>Profile Not Found</h1>";
    }
  })
  .catch((error) => {
    console.error("Error loading data:", error);
    document.body.innerHTML = "<h1>Error Loading Profile</h1>";
  });

// 📝 Populate About Section
function populateAboutSection(aboutData) {
  document.getElementById("about-description").textContent =
    aboutData.description;

  // Skills
  const skillsList = document.getElementById("skills-list");
  skillsList.innerHTML = ""; // Clear previous entries
  aboutData.skills.forEach((skill) => {
    const skillItem = document.createElement("div");
    skillItem.className = "skill-item";
    skillItem.innerHTML = `
      <h3>${skill.title}</h3>
      <div class="tech-stack">
        ${skill.techStack
          .map((tech) => `<span class="tech-badge">${tech}</span>`)
          .join("")}
      </div>
    `;
    skillsList.appendChild(skillItem);
  });

  // Projects
  const projectsList = document.getElementById("projects-list");
  projectsList.innerHTML = "";
  aboutData.projects.forEach((project) => {
    const projectItem = document.createElement("div");
    projectItem.className = "project-item";
    projectItem.innerHTML = `
      <div class="project-header">
        <h3>${project.name}</h3>
        <a href="${project.link}" class="project-link" target="_blank">View Project</a>
      </div>
      <p>${project.description}</p>
    `;
    projectsList.appendChild(projectItem);
  });

  // Education
  const educationList = document.getElementById("education-list");
  educationList.innerHTML = "";
  aboutData.education.forEach((education) => {
    const educationItem = document.createElement("div");
    educationItem.className = "education-item";
    educationItem.innerHTML = `
      <h3>${education.year}</h3>
      <p>${education.details}</p>
    `;
    educationList.appendChild(educationItem);
  });
}

// 📝 Populate Interests
function populateServicesSection(interestsData) {
  const interestsList = document.getElementById("interests-list");
  interestsList.innerHTML = "";
  interestsData.forEach((interest) => {
    const interestItem = document.createElement("div");
    interestItem.className = "interest-item";
    interestItem.innerHTML = `
      <h3>${interest.title}</h3>
      <p>${interest.description}</p>
    `;
    interestsList.appendChild(interestItem);
  });
}

// 📝 Populate Portfolio
function populatePortfolioSection(portfolioData) {
  const portfolioList = document.getElementById("portfolio-list");
  portfolioList.innerHTML = "";

  portfolioData.forEach((project) => {
    // console.log(project);
    let iconUrl = "";

    if (project.type === "linkedin") {
      iconUrl = "https://img.icons8.com/color/48/000000/linkedin.png";
    } else if (project.type === "X") {
      iconUrl =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/X_logo.jpg/768px-X_logo.jpg";
    } else {
      iconUrl =
        "https://play-lh.googleusercontent.com/NhWlAT4TbjIjirMZfl77W2B8Y1P0gpSNTui6aQYUXJNMhbe8OrUhnfjtccRF3eNFkRo";
    }

    const projectItem = document.createElement("div");
    projectItem.className = "work";

    projectItem.innerHTML = `
      <div class="image-container">
        <a href="${project.url}" target="_blank">
          <img src="${project.image}" alt="${project.title}" />
        </a>
        <div class="icon-container">
          <img src="${iconUrl}" alt="${project.title} icon" class="icon" />
        </div>
      </div>
      <div class="layer">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <a href="${project.url}" target="_blank">
          <i class="fa-solid fa-link"></i>
        </a>
      </div>
    `;

    portfolioList.appendChild(projectItem);
  });
}

// 📝 Populate Social Links
function populateSocialLinks(socialLinks) {
  const socialIcons = document.getElementById("social-icons");
  socialIcons.innerHTML = "";

  const icons = {
    linkedin: "fa-brands fa-linkedin",
    twitter: "fa-brands fa-twitter",
    instagram: "fa-brands fa-instagram",
    facebook: "fa-brands fa-facebook",
    github: "fa-brands fa-github",
    hashnode: "fa-brands fa-hashnode",
  };

  Object.entries(socialLinks).forEach(([key, href]) => {
    if (href) {
      const link = document.createElement("a");
      link.href = href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.innerHTML = `<i class="${icons[key]}"></i>`;
      socialIcons.appendChild(link);
    }
  });
}

// 📝 Populate Copyright
function populateCopyright(name) {
  document.getElementById("copyright-name").textContent = name;
}

var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");

function opentab(tabname) {
  for (tablink of tablinks) {
    tablink.classList.remove("active-link");
  }
  for (tabcontent of tabcontents) {
    tabcontent.classList.remove("active-tab");
  }
  event.currentTarget.classList.add("active-link");
  document.getElementById(tabname).classList.add("active-tab");
}

// // 📝 Typing Effect
// const texts = [
//   "Web Developer",
//   "UI/UX Designer",
//   "App Developer",
//   "Content Creator",
//   "Video Editor",
// ];
// let index = 0;
// let charIndex = 0;
// let currentText = "";
// let isDeleting = false;

// function typeEffect() {
//   const textElement = document.getElementById("changing-text");

//   if (!isDeleting && charIndex < texts[index].length) {
//     currentText += texts[index][charIndex++];
//   } else if (isDeleting && charIndex > 0) {
//     currentText = currentText.slice(0, -1);
//     charIndex--;
//   }

//   textElement.textContent = currentText;

//   if (charIndex === texts[index].length && !isDeleting) {
//     isDeleting = true;
//     setTimeout(typeEffect, 1000);
//     return;
//   }

//   if (charIndex === 0 && isDeleting) {
//     isDeleting = false;
//     index = (index + 1) % texts.length;
//   }

//   setTimeout(typeEffect, isDeleting ? 100 : 150);
// }
// typeEffect();

// 📝 Side Menu Functions
const sidemenu = document.getElementById("sidemenu");
function openmenu() {
  sidemenu.style.right = "0";
}
function closemenu() {
  sidemenu.style.right = "-200px";
}
