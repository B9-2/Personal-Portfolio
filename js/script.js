const sunIcon = `
<svg viewBox="0 0 24 24" aria-hidden="true">
  <circle cx="12" cy="12" r="4" fill="currentColor"></circle>
</svg>
`;
const moonIcon = `
<svg viewBox="0 0 24 24" aria-hidden="true">
  <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3A8.5 8.5 0 1 0 21 14.5Z" fill="currentColor"></path>
</svg>
`;
const toggleBtn = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
function setTheme(theme) {
  if (theme === 'light') {
    document.body.classList.remove('dark');
    toggleBtn.innerHTML = moonIcon;
    localStorage.setItem('theme', 'light');
  } else {
    document.body.classList.add('dark');
    toggleBtn.innerHTML = sunIcon;
    localStorage.setItem('theme', 'dark');
  }
}
setTheme(savedTheme === 'light' ? 'light' : 'dark');
toggleBtn.addEventListener('click', () => {
  if (document.body.classList.contains('dark')) {
    setTheme('light');
  } else {
    setTheme('dark');
  }
});
const searchInput = document.getElementById('projectSearch');
const filterProjects = document.getElementById('filterProjects');
const sortProjects = document.getElementById('sortProjects');
const projectList = document.getElementById('projectList');
const emptyMessage = document.getElementById('emptyMessage');
if (projectList) {
  const originalProjects = Array.from(projectList.querySelectorAll('.project-card'));
  function updateProjects() {
    const searchValue = searchInput.value.toLowerCase().trim();
    const selectedCategory = filterProjects.value;
    const sortValue = sortProjects.value;
    let projects = [...originalProjects];
    projects = projects.filter((project) => {
      const title = project.dataset.title.toLowerCase();
      const text = project.textContent.toLowerCase();
      const category = project.dataset.category;
      const matchesSearch = title.includes(searchValue) || text.includes(searchValue);
      const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    if (sortValue === 'az') {
      projects.sort((a, b) => a.dataset.title.localeCompare(b.dataset.title));
    } else if (sortValue === 'za') {
      projects.sort((a, b) => b.dataset.title.localeCompare(a.dataset.title));
    }
    projectList.innerHTML = '';
    projects.forEach((project) => {
      projectList.appendChild(project);
    });
    emptyMessage.style.display = projects.length === 0 ? 'block' : 'none';
  }
  searchInput.addEventListener('input', updateProjects);
  filterProjects.addEventListener('change', updateProjects);
  sortProjects.addEventListener('change', updateProjects);
  updateProjects();
}
async function loadRepositories() {
  const repoStatus = document.getElementById('repoStatus');
  const repoList = document.getElementById('repoList');
  if (!repoList) return;
  repoStatus.textContent = 'Loading repositories...';
  try {
    const response = await fetch('https://api.github.com/users/B9-2/repos');
    let repos = await response.json();
    repos = repos.filter(repo => ![
      '202260760-Abdulrahim-assignment2',
      '202260760-Abdulrahim-assignment3',
      '202260760-Abdulrahim-assignment4'
    ].includes(repo.name));
    repoStatus.textContent = '';
    repos.slice(0, 6).forEach((repo) => {
      const repoCard = document.createElement('article');
      repoCard.className = 'glass repo-card';
      repoCard.innerHTML = `
        <div class="repo-top">
          <span>⚡</span>
          <span>${repo.language || 'Code'}</span>
        </div>
        <h3>
          <a href="${repo.html_url}" target="_blank">
            ${repo.name}
          </a>
        </h3>
        <p class="repo-description">
          ${repo.description || 'No description available.'}
        </p>
        <div class="repo-meta">
          <span>⭐ ${repo.stargazers_count}</span>
          <span>${repo.visibility}</span>
        </div>
      `;
      repoList.appendChild(repoCard);
    });
  } catch (error) {
    repoStatus.textContent = 'Could not load repositories.';
  }
}
loadRepositories();
const scrollBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollBtn.style.display = 'flex';
  } else {
    scrollBtn.style.display = 'none';
  }
});
scrollBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});