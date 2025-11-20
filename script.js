/* Getting elements */
const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("Alert");
const listItems = document.getElementById("list-items");
const addUpdate = document.getElementById("AddUpdateClick");

/* Local storage setup */
let todo = JSON.parse(localStorage.getItem("todo-list")) || [];

/* Save to LS */
function setLocalStorage() {
  localStorage.setItem("todo-list", JSON.stringify(todo));
}

/* CREATE */
function CreateToDoItems() {
  if (todoValue.value === "") {
    todoAlert.innerText = "Please enter your todo text!";
    todoValue.focus();
    return;
  }

  let IsPresent = todo.some((t) => t.item == todoValue.value);
  if (IsPresent) {
    setAlertMessage("This item already present in the list!");
    return;
  }

  let li = document.createElement("li");
  li.innerHTML = `
    <div title="Double Click to Complete" ondblclick="CompletedToDoItems(this)">
      ${todoValue.value}
    </div>
    <div>
      <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="pencil.png" />
      <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="delete.png" />
    </div>
  `;

  listItems.appendChild(li);

  todo.push({ item: todoValue.value, status: false });
  setLocalStorage();

  todoValue.value = "";
  setAlertMessage("Todo item Created Successfully!");
}

/* READ existing items */
function ReadToDoItems() {
  listItems.innerHTML = "";
  todo.forEach((element) => {
    let li = document.createElement("li");

    let style = element.status ? "style='text-decoration: line-through'" : "";

    li.innerHTML = `
      <div ${style} title="Double Click to Complete" ondblclick="CompletedToDoItems(this)">
        ${element.item}
        ${element.status ? '<img class="todo-controls" src="check-mark.png" />' : ""}
      </div>
      <div>
        ${element.status ? "" : '<img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="pencil.png" />'}
        <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="delete.png" />
      </div>
    `;

    listItems.appendChild(li);
  });
}
ReadToDoItems();

/* UPDATE */
let updateText;
function UpdateToDoItems(e) {
  let div = e.parentElement.parentElement.querySelector("div");
  if (div.style.textDecoration === "") {
    todoValue.value = div.innerText.trim();
    updateText = div;

    addUpdate.setAttribute("onclick", "UpdateOnSelectionItems()");
    addUpdate.setAttribute("src", "refresh.png");
    todoValue.focus();
  }
}

function UpdateOnSelectionItems() {
  let IsPresent = todo.some((t) => t.item == todoValue.value);
  if (IsPresent) {
    setAlertMessage("This item already present in the list!");
    return;
  }

  todo.forEach((element) => {
    if (element.item == updateText.innerText.trim()) {
      element.item = todoValue.value;
    }
  });
  setLocalStorage();

  updateText.innerText = todoValue.value;
  addUpdate.setAttribute("onclick", "CreateToDoItems()");
  addUpdate.setAttribute("src", "plus.png");
  todoValue.value = "";

  setAlertMessage("Todo item Updated Successfully!");
}

/* DELETE */
function DeleteToDoItems(e) {
  let deleteValue = e.parentElement.parentElement.querySelector("div").innerText.trim();

  if (confirm(`Are you sure you want to delete "${deleteValue}"?`)) {
    e.parentElement.parentElement.classList.add("deleted-item");

    todo = todo.filter((item) => item.item !== deleteValue);
    setLocalStorage();

    setTimeout(() => {
      e.parentElement.parentElement.remove();
    }, 500);
  }
}

/* COMPLETE */
function CompletedToDoItems(e) {
  let div = e.parentElement.querySelector("div");

  if (div.style.textDecoration === "") {
    div.style.textDecoration = "line-through";

    let check = document.createElement("img");
    check.src = "check-mark.png";
    check.className = "todo-controls";
    div.appendChild(check);

    let text = div.innerText.trim();
    todo.forEach((t) => {
      if (t.item == text) t.status = true;
    });
    setLocalStorage();

    let editButton = e.parentElement.querySelector("img.edit");
    if (editButton) editButton.remove();

    setAlertMessage("Todo item Completed Successfully!");
  }
}

/* ALERT MESSAGE */
function setAlertMessage(message) {
  todoAlert.classList.remove("toggleMe");
  todoAlert.innerText = message;

  setTimeout(() => {
    todoAlert.classList.add("toggleMe");
  }, 1000);
}
