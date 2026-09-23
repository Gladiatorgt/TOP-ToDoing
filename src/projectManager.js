import { Todo, Project } from "./todo.js";
import { updateProjects, loadProjects } from "./localStorage.js";

let projects = [];
const defaultProject = new Project("defaultProject");
const defaultTodo = new Todo(
  "DefaultTodo",
  "Its a demo todo",
  "2026-09-20",
  "low",
  false,
);
defaultProject.addTodo(defaultTodo);
projects.push(defaultProject);

const saved = loadProjects(); // returns null on first launch!

if (!saved) {
  // 1. First time: Initialize your defaults & save them
  projects = [defaultProject];
  updateProjects(projects);
} else {
  // 2. Returning user: Use the saved data
  projects = saved.map((rawProj) => {
    const proj = new Project(rawProj.projectName);
    proj.id = rawProj.id; // preserve original id!

    rawProj.todos.forEach((rawTodo) => {
      const todo = new Todo(
        rawTodo.title,
        rawTodo.description,
        rawTodo.due,
        rawTodo.priority,
        rawTodo.isDone,
      );
      todo.id = rawTodo.id; // preserve original id!
      proj.addTodo(todo);
    });

    return proj;
  });
}

//💠
export function save() {
  updateProjects(projects);
}

export function addProject(projectObject) {
  projects.push(projectObject);
  updateProjects(projects); // or save()
  if (activeProjectId == "na") {
    activeProjectId = projectObject.id;
  }
}

export function removeProject(projectObject) {
  const poID = projectObject.id;
  projects = projects.filter((projObject) => projObject.id !== poID);
  // activeProjectId = "";
  updateProjects(projects);
  if (projects.length != 0) {
    activeProjectId = projects[0].id;
  } else {
    activeProjectId = "na";
  }
}

let activeProjectId = projects.length > 0 ? projects[0].id : "na";

export function toggleActiveProject(projectID) {
  activeProjectId = projectID;
}

export function getActiveProject() {
  return projects.find((p) => p.id === activeProjectId);
}

export function getProjects() {
  return projects;
}

export function getActiveProjectId() {
  return activeProjectId;
}
