export function updateProjects(projectss) {
  localStorage.setItem("projects", JSON.stringify(projectss));
}

export function loadProjects() {
  const projects = JSON.parse(localStorage.getItem("projects"));
  return projects;
}