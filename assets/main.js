const addBun = document.getElementById("add-btn");
const todoBtn = document.getElementById("todo-btn");
const table = document.querySelector("table");
const search = document.getElementById("search");
let mode = "add";

const headTh = ["ID", "TODO Description", "User ID", "Status", "Actions"];

async function getData() {
  if (
    localStorage.getItem("todos") === null ||
    JSON.parse(localStorage.getItem("todos")).length === 0
  ) {
    await fetch("https://dummyjson.com/todos")
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("todos", JSON.stringify(data.todos));
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    renderTable(JSON.parse(localStorage.getItem("todos")));
  }
}
getData();

setTimeout(() => {
  getData();
}, 1000);

// delete todo
function deleteTodo(id) {
  console.log("id", id);
  let todos = JSON.parse(localStorage.getItem("todos"));
  // todos = [...todos.slice(0, id), ...todos.slice(id + 1)];
  todos = todos.filter((_, index) => index !== id);
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTable(todos);
}

// edit todo

function editTodo(id) {
  mode = "update";
  addBun.style.backgroundColor = "green";
  addBun.innerHTML = "Update";
  const todos = JSON.parse(localStorage.getItem("todos"));
  todoBtn.value = todos[id].todo;
  scrollTo({
    top: 0,
    behavior: "smooth",
  });
  todoBtn.addEventListener("keyup", () => {
    todos[id] = {
      ...todos[id],
      todo: todoBtn.value,
    };
    localStorage.setItem("todos", JSON.stringify(todos));
  });
}

search.addEventListener("keyup", searchTodo);
function searchTodo() {
  const todos = JSON.parse(localStorage.getItem("todos"));
  const searchValue = search.value;
  const filteredTodos = todos.filter((todo) =>
    todo.todo.toLowerCase().includes(searchValue.toLowerCase())
  );
  renderTable(filteredTodos);
}

// task completed
function taskCompleted(e, id) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos[id].completed = !todos[id].completed;
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTable(todos);
}

// submit form
function submitForm(e) {
  e.preventDefault();
  const todos = JSON.parse(localStorage.getItem("todos"));
  if (mode === "add") {
    const todo = todoBtn.value;
    todoBtn.value = "";
    console.log(todo);
    todos?.push({
      id: todos.length + 1,
      todo,
      userId: Math.floor(Math.random() * 100),
      completed: false,
    });
    localStorage.setItem("todos", JSON.stringify(todos));
  } else {
    mode = "add";
    todoBtn.value = "";
    addBun.style.backgroundColor = "red";
    addBun.innerHTML = "Add";
  }
  renderTable(todos);
}

function renderTable(todos) {
  document.querySelector("table").innerHTML = `
      <thead>
        <tr>
          ${headTh.map((th) => `<th>${th}</th>`).join("")} 
        </tr>
      </thead>
      <tbody>
        ${todos
          ?.map(
            (todo, _idx) => `
          <tr>
            <td>${_idx + 1}</td>
            <td>${todo.todo}</td>
            <td>${todo.userId}</td>
            <td  onclick="taskCompleted(event , ${_idx})"   >${
              todo.completed ? "Completed" : "Pending"
            }</td>
            <td>
              <button onClick=editTodo(${_idx}) class='delete-btn'>Edit</button>
              <button onClick=deleteTodo(${_idx}) class='success-btn'>Delete</button>
            </td>
          </tr>
        `
          )
          .join("")}    
      </tbody>
      <tfoot>
        <tr>
          <td colspan="5">Total Tasks : ${todos?.length} </td>
        </tr>
      </tfoot>
      `;
}
