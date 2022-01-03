let sec = document.querySelector("section");
let addbtn = document.querySelector("form button");
//click 新增
addbtn.addEventListener("click", (e) => {
  e.preventDefault();
  let form = e.target.parentElement;
  let todo = form.children[0].value;
  let mon = form.children[1].value;
  let day = form.children[2].value;
  //check validity
  if (!form.reportValidity()) {
    return;
  }
  //check blank
  if (todo.trim() === "") {
    alert("Please write something");
    return;
  }

  //create div、p
  let n_div = document.createElement("div");
  let n_todo = document.createElement("p");
  let n_date = document.createElement("p");
  n_div.classList.add("n_div");
  n_todo.classList.add("n_todo");
  n_date.classList.add("n_date");
  n_todo.innerText = todo;
  n_date.innerText = `${mon}/${day}`;
  n_div.appendChild(n_todo);
  n_div.appendChild(n_date);
  sec.appendChild(n_div);
  //create check button
  let ck_btn = document.createElement("button");
  ck_btn.classList.add("ck_btn");
  ck_btn.innerHTML = '<i class="fas fa-check"></i>';
  n_div.appendChild(ck_btn);
  //create garbage button
  let gb_btn = document.createElement("button");
  gb_btn.classList.add("gb_btn");
  gb_btn.innerHTML = '<i class="fas fa-trash"></i>';
  n_div.appendChild(gb_btn);
  //n_div animation
  n_div.style.animation = "scaleUp 0.3s forwards";

  //check button click
  ck_btn.addEventListener("click", ck_click);

  //garbage button click
  gb_btn.addEventListener("click", gb_click);

  //clear input
  form.children[0].value = "";
  //setting localstorage
  let todo_ob = {
    todo: todo,
    todo_class: n_div.classList.value,
    mon: mon,
    day: day,
  };
  let local_todo = JSON.parse(localStorage.getItem("todoList"));
  if (local_todo === null) {
    localStorage.setItem("todoList", JSON.stringify([todo_ob]));
  } else {
    local_todo.push(todo_ob);
    localStorage.setItem("todoList", JSON.stringify(local_todo));
  }
});

load_todoList();
//Load localstorage
function load_todoList() {
  let local_todo = JSON.parse(localStorage.getItem("todoList"));
  if (local_todo !== null) {
    local_todo.forEach((todo_ob, i) => {
      //create div、p
      let n_div = document.createElement("div");
      let n_todo = document.createElement("p");
      let n_date = document.createElement("p");
      n_div.classList.value = todo_ob.todo_class;
      n_todo.classList.add("n_todo");
      n_date.classList.add("n_date");
      n_todo.innerText = todo_ob.todo;
      n_date.innerText = `${todo_ob.mon}/${todo_ob.day}`;
      n_div.appendChild(n_todo);
      n_div.appendChild(n_date);
      //create check button
      let ck_btn = document.createElement("button");
      ck_btn.classList.add("ck_btn");
      ck_btn.innerHTML = '<i class="fas fa-check"></i>';
      n_div.appendChild(ck_btn);
      //create garbage button
      let gb_btn = document.createElement("button");
      gb_btn.classList.add("gb_btn");
      gb_btn.innerHTML = '<i class="fas fa-trash"></i>';
      n_div.appendChild(gb_btn);

      //check button click
      ck_btn.addEventListener("click", ck_click);

      // garbage button click
      gb_btn.addEventListener("click", gb_click);

      //n_div animation
      setTimeout(function () {
        n_div.style.animation = "scaleUp 0.3s forwards";
        sec.appendChild(n_div);
      }, 100 * (i + 1));
    });
  }
}

function ck_click(e) {
  let n_div = e.target.parentElement;
  let n_todo = n_div.children[0];
  n_div.classList.toggle("checked");
  //update class to localstorage
  let local_todo = JSON.parse(localStorage.getItem("todoList"));
  local_todo.forEach(function (v, i) {
    if (v.todo === n_todo.innerText) {
      v.todo_class = n_div.classList.value;
    }
  });
  localStorage.setItem("todoList", JSON.stringify(local_todo));
}

function gb_click(e) {
  let n_div = e.target.parentElement;
  //delete from localstorage
  let n_todo = n_div.children[0];
  let local_todo = JSON.parse(localStorage.getItem("todoList"));
  local_todo.forEach(function (v, i) {
    if (v.todo === n_todo.innerText) {
      local_todo.splice(i, 1);
      localStorage.setItem("todoList", JSON.stringify(local_todo));
    }
  });
  n_div.style.animation = "scaleDown 0.3s forwards";
  n_div.addEventListener("animationend", () => {
    n_div.remove();
  });
}

//merge 2 divided array
function merge(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;
  //compare mon and day, push to result
  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].mon) < Number(arr2[j].mon)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].mon) > Number(arr2[j].mon)) {
      result.push(arr2[j]);
      j++;
    } else {
      if (Number(arr1[i].day) < Number(arr2[j].day)) {
        result.push(arr1[i]);
        i++;
      } else {
        result.push(arr2[j]);
        j++;
      }
    }
  }
  //push remainning element
  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }
  return result;
}
//mergesort
function mergeSort(arr) {
  if (arr === null) return;
  if (arr.length <= 1) {
    return arr;
  }
  let middle = Math.floor(arr.length / 2);
  //   console.log(`middle: ${middle}`);
  let left_arr = arr.slice(0, middle);
  //   console.log(left_arr);
  let right_arr = arr.slice(middle);
  //   console.log(right_arr);
  return merge(mergeSort(left_arr), mergeSort(right_arr));
}

//sort button click
let s_btn = document.querySelector("div.sort button");
s_btn.addEventListener("click", (e) => {
  let local_todo = JSON.parse(localStorage.getItem("todoList"));
  let sort_todo = mergeSort(local_todo);
  localStorage.setItem("todoList", JSON.stringify(sort_todo));
  while (sec.firstChild) {
    sec.firstChild.remove();
  }
  load_todoList();
});
// console.log(JSON.parse(localStorage.getItem("todoList")));
