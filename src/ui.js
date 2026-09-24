import { el, clearContainer, qs, ap } from "./dom.js";
import { Todo, Project } from "./todo.js";
import * as prom from "./projectManager.js";
import { updateProjects, loadProjects } from "./localStorage.js";

// ============================================================================
// [01] Initial Application Shell Architecture
// Creates the primary structural layout (Sidebar + Main Pane) using helper 
// abstraction `el()` and mounts the root container directly to `document.body`.
// ============================================================================
export function landingPage() {
  const container = el("div", "container");
  const leftSidePane = el("div", "leftSidePane");
  const rightSidePane = el("div", "rightSidePane");
  const todoTop = el("div", "todoTop");
  const todoBottom = el("div", "todoBottom");
  const todoSection = el("div", "todoSection", "");
  const todosFooter = el("div", "todosFooter");
  const logoAndTitleDiv = el("div", "logoAndTitleDiv");
  const projectsContainerDiv = el("div", "projectsContainerDiv");
  const projectsDiv = el("div", "projectsDiv");
  const addProjectBtn = el("button", "addProjectBtn", "+ New Project");
  const newTodoBtn = el("button", "newTodoBtn", "+ New Todo");
  const delProjectBtn = el("button", "delProjectBtn", "🗑️Delete Project");
  const buttonContainer = el("div", "buttonContainer");

  // Hierarchy Assembly
  ap(buttonContainer, newTodoBtn, delProjectBtn);
  ap(todosFooter, buttonContainer);
  ap(projectsContainerDiv, addProjectBtn, projectsDiv);
  ap(leftSidePane, logoAndTitleDiv, projectsContainerDiv);
  ap(todoBottom, todoSection, todosFooter);
  ap(rightSidePane, todoTop, todoBottom);
  ap(container, leftSidePane, rightSidePane);

  document.body.append(container);
}

// ============================================================================
// [02] Master UI Orchestrator / Bootstrapper
// Defines the exact startup lifecycle sequence: build layout, load projects,
// load initial active todos, mount modal dialogs, and bind all event listeners.
// ============================================================================
export default function renderUi() {
  landingPage();
  renderLeftPane();
  renderRightPane();
  createProjectModal();
  createTodoModal();
  restOfTheUi();
}

// ============================================================================
// [03] Project List View Sync
// Queries current in-memory projects from projectManager and populates the sidebar.
// ============================================================================
function renderLeftPane() {
  const projectsArray = prom.getProjects();
  projectsArray.forEach((project) => {
    projectCard(project);
  });
}

// ============================================================================
// [04] Project Component Factory & Dataset Binding
// Uses HTML5 `data-*` attributes (`data-id`) to link DOM nodes to their data model,
// and highlights the currently active project with `.activeProjectDiv`.
// ============================================================================
function projectCard(project) {
  const projectCard = el("div", "projectDiv", `${project.projectName}`, {
    "data-id": project.id,
  });

  if (project.id === prom.getActiveProjectId()) {
    projectCard.classList.add("activeProjectDiv");
  }

  const projectsDiv = qs(".projectsDiv");
  ap(projectsDiv, projectCard);
}

// ============================================================================
// [05] Todo Card Component Factory & Component-Level State Restoration
// Builds each todo card, restores checkbox & strikethrough visual state from
// `element.isDone`, applies priority classes, and binds individual deletion.
// ============================================================================
function TodoCard(element) {
  const todoCard = el("div", "todoCard", "", {
    "data-id": element.id,
  });

  const isDoneCheckDiv = el("div", "isDoneCheckDiv");
  const isDoneCheck = el("input", "isDoneCheckDiv", "", { type: "checkbox" });

  const titleAndCheckDiv = el("div", "titleAndCheckDiv");
  const titleDiv = el(
    "span",
    "todoTitleDiv",
    `${element.title} - ${element.description}`,
  );

  // Restore persistent checkbox & strikethrough state on render
  if (element.isDone) {
    isDoneCheck.checked = true;
    titleDiv.classList.add("strikethrough");
  }
  ap(isDoneCheckDiv, isDoneCheck);

  const dueAndDeleteDiv = el("div", "dueAndDeleteDiv");
  const dueDiv = el("div", "dueDiv", element.due);
  const deletebtn = el("button", "deleteTodobtn", "Delete");

  // Priority Visual Categorization
  if (element.priority === "high") {
    todoCard.classList.add("highPriorityTodo");
  } else if (element.priority === "medium") {
    todoCard.classList.add("mediumPriorityTodo");
  } else {
    todoCard.classList.add("lowPriorityTodo");
  }

  const todoSection = qs(".todoSection");
  ap(titleAndCheckDiv, isDoneCheckDiv, titleDiv);
  ap(dueAndDeleteDiv, dueDiv, deletebtn);
  ap(todoCard, titleAndCheckDiv, dueAndDeleteDiv);
  ap(todoSection, todoCard);

  // Todo Deletion with Immediate Model & Storage Persistence
  deletebtn.addEventListener("click", () => {
    const todoId = todoCard.dataset.id;
    const activeProject = prom.getActiveProject();
    activeProject.removeTodo(todoId);
    prom.save();
    clearContainer(todoSection);
    renderRightPane();
  });
}

// ============================================================================
// [06] Main Todo Canvas Renderer (Guard Clause & Empty State)
// Checks whether a valid project is active; if active, renders all of its todos;
// otherwise clears the canvas cleanly.
// ============================================================================
function renderRightPane() {
  const currentActiveProjectId = prom.getActiveProjectId();
  const currentActiveProject = prom.getActiveProject();

  if (currentActiveProjectId !== "na" && currentActiveProject) {
    currentActiveProject.todos.forEach((element) => TodoCard(element));
  } else if (currentActiveProjectId === "na") {
    const todoSection = qs(".todoSection");
    clearContainer(todoSection);
  }
}

// ============================================================================
// [07] HTML5 <dialog> Project Creation Modal
// Constructs the modal once and attaches it directly to `document.body`.
// Returns the dialog instance so `.showModal()` can be called on demand.
// ============================================================================
function createProjectModal() {
  const projectModal = el("dialog", "projectModal");
  const projectModalDiv = el("div", "projectModalDiv");
  const projectInfoForm = el("form", "projectInfoForm");

  const titleLabel = el("label", "titleLabel", "Project Name:", {
    For: "titleInput",
  });
  const titleInput = el("input", "projectTitle", "", {
    name: "titleInput",
    id: "titleInput",
    type: "text",
  });

  const descriptionLabel = el("label", "descriptionLabel", "Description :", {
    For: "description",
  });
  const descriptionInput = el("input", "descriptionInput", "", {
    name: "description",
    id: "description",
    type: "text",
  });

  const projectInfoFormDiv = el("div", "projectInfoFormDiv");
  const btnsDiv = el("div", "btnsDiv");
  const projCancelBtn = el("button", "projCancelBtn", "Cancel");
  const projSubmitBtn = el("button", "projSubmitBtn", "Submit", {
    type: "submit",
    value: "submit",
  });

  ap(projectInfoForm, titleLabel, titleInput, descriptionLabel, descriptionInput);
  ap(projectInfoFormDiv, projectInfoForm);
  ap(btnsDiv, projSubmitBtn, projCancelBtn);
  ap(projectModalDiv, projectInfoFormDiv, btnsDiv);
  ap(projectModal, projectModalDiv);

  document.body.append(projectModal);
  return projectModal;
}

const projectModal = createProjectModal();

// ============================================================================
// [08] HTML5 <dialog> Todo Creation Modal & Native Input Types
// Utilizes native HTML5 form features: `type="date"` for native date picker,
// `<select>` for strict priority options, and `required` for input validation.
// ============================================================================
function createTodoModal() {
  const todoModal = el("dialog", "todoModal");
  const todoInfoForm = el("form", "todoInfoForm");

  // Title
  const titleLabel = el("label", "", "Title:", { For: "todoTitle" });
  const titleInput = el("input", "todoTitleInput", "", {
    name: "todoTitle",
    id: "todoTitle",
    type: "text",
    required: "",
  });

  // Description
  const descriptionLabel = el("label", "", "Description:", {
    For: "todoDescription",
  });
  const descriptionInput = el("input", "todoDescriptionInput", "", {
    name: "todoDescription",
    id: "todoDescription",
    type: "text",
  });

  // Due Date
  const dueLabel = el("label", "", "Due Date:", { For: "todoDue" });
  const dueInput = el("input", "todoDueInput", "", {
    name: "todoDue",
    id: "todoDue",
    type: "date",
  });

  // Priority Dropdown
  const priorityLabel = el("label", "", "Priority:", { For: "todoPriority" });
  const prioritySelect = el("select", "todoPrioritySelect", "", {
    name: "todoPriority",
    id: "todoPriority",
  });
  const lowOption = el("option", "", "Low", { value: "low" });
  const medOption = el("option", "", "Medium", { value: "medium" });
  const highOption = el("option", "", "High", { value: "high" });
  ap(prioritySelect, lowOption, medOption, highOption);

  // Action Buttons
  const todoInfoFormDiv = el("div", "todoInfoFormDiv");
  const btnsDiv = el("div", "btnsDiv");
  const todoCancelBtn = el("button", "todoCancelBtn", "Cancel", {
    type: "button",
  });
  const todoSubmitBtn = el("button", "todoSubmitBtn", "Add Todo", {
    type: "submit",
  });

  ap(
    todoInfoForm,
    titleLabel,
    titleInput,
    descriptionLabel,
    descriptionInput,
    dueLabel,
    dueInput,
    priorityLabel,
    prioritySelect,
  );
  ap(todoInfoFormDiv, todoInfoForm);
  ap(btnsDiv, todoSubmitBtn, todoCancelBtn);
  ap(todoModal, todoInfoFormDiv, btnsDiv);

  document.body.append(todoModal);
  return todoModal;
}

const todoModal = createTodoModal();

// ============================================================================
// [09] Main User Interactions & Event Wiring Controller
// Coordinates form submissions, deletions, switching projects, external APIs,
// and delegated checkbox changes.
// ============================================================================
function restOfTheUi() {
  // --------------------------------------------------------------------------
  // [10] Project Modal Open Trigger
  // --------------------------------------------------------------------------
  const addProjectBtn = qs(".addProjectBtn");
  addProjectBtn.addEventListener("click", () => {
    projectModal.showModal();
  });

  // --------------------------------------------------------------------------
  // [11] FormData API for Declarative Form Value Extraction
  // Extracts input values using `new FormData(form)` by field `name`, validates,
  // updates the project store, resets the form, and refreshes the sidebar.
  // --------------------------------------------------------------------------
  const projSubmitBtn = qs(".projSubmitBtn");
  projSubmitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const projForm = qs(".projectInfoForm");
    const fd = new FormData(projForm);
    const name = fd.get("titleInput");
    const description = fd.get("description");

    if (name !== "") {
      const newProject = new Project(name, description);
      if (prom.getActiveProjectId() === "na") renderRightPane();
      prom.addProject(newProject);
    }

    projectModal.close();
    projForm.reset();

    const leftprojects = qs(".projectsDiv");
    clearContainer(leftprojects);
    renderLeftPane();
  });

  const projCancelBtn = qs(".projCancelBtn");
  projCancelBtn.addEventListener("click", () => {
    const projForm = qs(".projectInfoForm");
    projectModal.close();
    projForm.reset();
  });

  // --------------------------------------------------------------------------
  // [12] Destructive Project Deletion with Native `window.confirm` Guard
  // Deletes active project, re-evaluates active project ID fallback, and either
  // switches view to the new active project or displays the empty state message.
  // --------------------------------------------------------------------------
  const delProjectBtn = qs(".delProjectBtn");
  delProjectBtn.addEventListener("click", () => {
    const confirmation = window.confirm("Sure to delete this project?");
    if (confirmation) {
      const currentActiveProject = prom.getActiveProject();
      prom.removeProject(currentActiveProject);

      const activeProjectId = prom.getActiveProjectId();
      const x = qs(".projectsDiv");
      const y = qs(".todoSection");
      clearContainer(x);
      clearContainer(y);

      if (activeProjectId !== "na") {
        renderLeftPane();
        renderRightPane();
      } else {
        const text = el("h1", "noProjectsText", "No projects, add One..");
        ap(y, text);
      }
    }
  });

  // --------------------------------------------------------------------------
  // [13] Todo Creation Trigger & Handling
  // --------------------------------------------------------------------------
  const addTodoBtn = qs(".newTodoBtn");
  addTodoBtn.addEventListener("click", () => {
    todoModal.showModal();
  });

  const todoSubmitBtn = qs(".todoSubmitBtn");
  const todoCancelBtn = qs(".todoCancelBtn");

  todoSubmitBtn.addEventListener("click", () => {
    const todoTitleInput = todoModal.querySelector(".todoTitleInput").value;
    if (todoTitleInput === "") {
      todoModal.close();
    } else {
      const todoDescriptionInput = todoModal.querySelector(".todoDescriptionInput").value;
      const todoDueInput = todoModal.querySelector(".todoDueInput").value;
      const todoPrioritySelect = todoModal.querySelector(".todoPrioritySelect").value;

      const newTodo = new Todo(
        todoTitleInput,
        todoDescriptionInput,
        todoDueInput,
        todoPrioritySelect,
      );

      const currentActiveProject = prom.getActiveProject();
      currentActiveProject.addTodo(newTodo);
      prom.save();

      const todoSection = qs(".todoSection");
      clearContainer(todoSection);
      renderRightPane();
      todoModal.close();

      const todoInfoForm = qs(".todoInfoForm");
      todoInfoForm.reset();
    }
  });

  todoCancelBtn.addEventListener("click", () => {
    const todoInfoForm = qs(".todoInfoForm");
    todoInfoForm.reset();
    todoModal.close();
  });

  // --------------------------------------------------------------------------
  // [14] Event Delegation for Dynamic Project Switching
  // Listens on parent `.projectsDiv` and uses `e.target.closest('.projectDiv')`
  // to dynamically route clicks on any current or future project elements.
  // --------------------------------------------------------------------------
  const projectsDiv = qs(".projectsDiv");
  projectsDiv.addEventListener("click", (e) => {
    const newActiveProjectDiv = e.target.closest(".projectDiv");
    if (!newActiveProjectDiv) return;

    const newActiveProjectId = newActiveProjectDiv.dataset.id;
    const projects = prom.getProjects();

    if (projects.length !== 0) {
      const currActiveProject = qs(".activeProjectDiv");
      if (currActiveProject) {
        currActiveProject.classList.remove("activeProjectDiv");
      }
    }

    prom.toggleActiveProject(newActiveProjectId);
    newActiveProjectDiv.classList.add("activeProjectDiv");

    clearContainer(projectsDiv);
    const todoSection = qs(".todoSection");
    clearContainer(todoSection);

    renderLeftPane();
    renderRightPane();
  });

  // --------------------------------------------------------------------------
  // [15] Asynchronous Web API Integration (`async/await` + `fetch`)
  // Fetches third-party "Quote of the Day" using API Ninja, parses JSON stream,
  // and mounts the formatted quote into the top header asynchronously.
  // --------------------------------------------------------------------------
  async function quotefns() {
    const apiKey = process.env.API_NINJA_KEY || "";

    if (!apiKey) {
      console.warn("API Ninja key is missing. Quote request skipped.");
      return "";
    }

    const quotePromise = await fetch(
      "https://api.api-ninjas.com/v2/quoteoftheday",
      {
        headers: {
          "X-Api-Key": apiKey,
        },
      },
    );

    if (!quotePromise.ok) {
      console.error("Quote fetch failed:", quotePromise.status);
      return "";
    }

    const quoteData = await quotePromise.json();
    const quote = `"${quoteData[0].quote}" - ${quoteData[0].author}`;
    return quote;
  }

  const todoTopp = qs(".todoTop");
  quotefns().then((quote) => {
    if (quote) todoTopp.textContent = quote;
  });

  // --------------------------------------------------------------------------
  // [16] Delegated Checkbox State Synchronization & Downward DOM Traversal
  // Listens for 'change' events on `.todoSection`, traverses UP to find the card
  // via `.closest()`, traverses DOWN via `.querySelector()` to target the sibling title,
  // toggles model boolean, saves to storage, and toggles `.strikethrough`.
  // --------------------------------------------------------------------------
  const todoSection = qs(".todoSection");
  todoSection.addEventListener("change", (e) => {
    const todoCard = e.target.closest(".todoCard");
    if (!todoCard) return;

    const titleText = todoCard.querySelector(".todoTitleDiv");
    const todoCardId = todoCard.dataset.id;
    const currProj = prom.getActiveProject();

    currProj.todos.forEach((todo) => {
      if (todo.id === todoCardId) {
        todo.toggleIsDone();
        prom.save();
      }
      titleText.classList.toggle("strikethrough", todo.isDone);
    });
  });
}