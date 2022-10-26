//toggle menu list
let $ = document;
let menuIcon = $.querySelector('.menu-ico');
let lists = $.querySelector('.lists');
let activeLists = $.querySelector('.lists.active');
let listHeightContainer = lists.style.height;

let listsArray = ['today', 'tomorrow', 'important'];

let todosArray = [{
    name: 'today',
    todo: 'check color contrast',
    complete: false
}, {
    name: 'today',
    todo: 'Programming',
    complete: false
}, {
    name: 'today',
    todo: 'go to bank',
    complete: false
}];

function toggleMenuList() {
    if (lists.classList.contains('active')) {
        hideMenuList();
    } else {
        lists.classList.add('active');
        lists.style.height = lists.scrollHeight + "px";
    }
}

function hideMenuList() {
    lists.classList.remove('active');
    lists.style.height = listHeightContainer;
}

menuIcon.addEventListener('click', toggleMenuList);

//select item of menu list
let menuList = $.querySelector('.list');
let menuTitle = $.querySelector('.title');



menuList.addEventListener('click', (e) => {
    if (e.target.tagName === "LI") {
        selectItem(e.target);
        localStorage.setItem('lastList', menuTitle.innerHTML);
    }
})

function selectItem(item) {
    menuTitle.innerHTML = item.innerHTML;

    let getTodo = JSON.parse(localStorage.getItem('todos'));
    todosArray = getTodo;
    setTodosLocal(todosArray);
    todosGenerator(todosArray);

    hideMenuList();
}


//add item to menu list
let addListBtn = $.querySelector('.btn-light');

addListBtn.addEventListener('click', insertItems)

function insertItems() {
    menuList.insertAdjacentHTML("beforeend", ` <input type="text" class="input-list" minlength="1" maxlength="30">`);
    lists.style.height = lists.scrollHeight + "px";
    let inputList = $.querySelector('.input-list');
    inputList.focus();

    inputList.addEventListener('keydown', (e) => {
        if (e.code === "Enter") {
            inputList.blur();
        }
    })

    inputList.addEventListener('blur', (e) => {
        addItem(e.target);
        localStorage.setItem('lastList', menuTitle.innerHTML);
    })
}

function addItem(input) {
    if (input.value === "") {
        let lastListHeight = lists.style.height.slice(0, -2);
        let itemHeight = input.scrollHeight + 10;
        let newListHeight = Number(lastListHeight) - itemHeight;
        lists.style.height = newListHeight + 'px';
        input.remove();
    } else {
        //lcl
        listsArray.push(input.value);
        setListsLocal(listsArray);
        //end
        listsGenerator(listsArray);
        let lastItem = $.querySelector('.item:last-child');
        selectItem(lastItem);
        input.remove();
    }
}

function listsGenerator(listsArray) {
    menuList.innerHTML = '';
    listsArray.forEach(list => {
        menuList.insertAdjacentHTML("beforeend", `<li class="item" title="Left-click => Select | Right-click => Delete">${list}</li>
        `);
    })
}

// let itemsArray = $.querySelectorAll('.item');

// itemsArray.forEach(item => {
//     listsArray.push(item.innerHTML);
// })

function setListsLocal(listsArray) {
    localStorage.setItem('lists', JSON.stringify(listsArray));
}

//disactive right-click on title

menuTitle.addEventListener('contextmenu', (e) => {
    e.preventDefault();
})

//remove item of menu list
menuList.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (e.target.tagName === "LI") {

        let lastListHeight = lists.style.height.slice(0, -2);
        let itemHeight = e.target.scrollHeight + 10;
        let newListHeight = Number(lastListHeight) - itemHeight;
        lists.style.height = newListHeight + 'px';

        if (menuTitle.innerHTML === e.target.innerHTML) {
            menuTitle.innerHTML = '';
        }

        localStorage.setItem('lastList', menuTitle.innerHTML);

        let getListsLocal = JSON.parse(localStorage.getItem('lists'));
        listsArray = getListsLocal;

        let listIndex = listsArray.findIndex(list => {
            return list === e.target.innerHTML;
        })
        listsArray.splice(listIndex, 1);

        setListsLocal(listsArray);
        listsGenerator(listsArray);

        removeListsTodos(e.target.innerHTML);
    }
})

function removeListsTodos(value) {
    let getTodo = JSON.parse(localStorage.getItem('todos'));
    todosArray = getTodo;

    let newTodosArray = todosArray.filter(todo => {
        if (todo.name != value) {
            return todo;
        }
    })

    setTodosLocal(newTodosArray);
    todosGenerator(todosArray);
}

//complete & remove todos
let todoList = $.querySelector('.todo-list');

todoList.addEventListener('click', (e) => {
    completeTodo(e);
    removeTodo(e);
})

function completeTodo(e) {
    if (e.target.classList.contains('todo')) {
        let getTodo = JSON.parse(localStorage.getItem('todos'));
        todosArray = getTodo;

        todosArray.forEach(todo => {
            if (todo.todo === e.target.innerHTML) {
                todo.complete = !todo.complete;
            }
        })

        setTodosLocal(todosArray);
        todosGenerator(todosArray);
    }
}

function removeTodo(e) {
    if (e.target.classList.contains('fa-trash-o')) {
        let getTodo = JSON.parse(localStorage.getItem('todos'));
        todosArray = getTodo;

        let todoIndex = todosArray.findIndex(todo => {
            return todo.todo === e.target.previousElementSibling.innerHTML;
        })
        todosArray.splice(todoIndex, 1);

        setTodosLocal(todosArray);
        todosGenerator(todosArray);
    }
}

//edit todo

todoList.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (e.target.classList.contains('todo')) {
        editTodo(e);
    }
})

function editTodo(e) {
    let input = $.createElement('input');
    input.setAttribute('type', "text");
    input.setAttribute('class', "input-todo");
    input.value = e.target.innerHTML;
    e.target.replaceWith(input);
    input.focus();
    input.addEventListener('keydown', (e) => {
        if (e.code === "Enter") {
            input.blur();
        }
    })
    let todoInnerHTML = e.target.innerHTML;
    input.addEventListener('blur', (e) => {

        let getTodo = JSON.parse(localStorage.getItem('todos'));
        todosArray = getTodo;

        todosArray.forEach(todo => {
            if (todo.todo === todoInnerHTML) {
                todo.todo = input.value;
            }
        })

        setTodosLocal(todosArray);
        todosGenerator(todosArray);
    })
}

//add todo
let addTodoBtn = $.querySelector('.btn-dark');

addTodoBtn.addEventListener('click', () => {
    todoList.insertAdjacentHTML("beforeend", `<li class="todo-item">
    <span class="cir"></span>
    <input type="text" class="input-todo">
    <i class="fa fa-trash-o"></i>
</li>`);
    let inputTodo = $.querySelector('.input-todo');
    inputTodo.focus();
    inputTodo.addEventListener('keydown', (e) => {
        if (e.code === "Enter") {
            inputTodo.blur();
        }
    })
    inputTodo.addEventListener('blur', addTodo);
})

function addTodo(e) {
    if (e.target.value === "") {
        e.target.parentElement.remove();
    } else {
        e.target.parentElement.remove();

        let newTodo = {
            name: menuTitle.innerHTML,
            todo: e.target.value,
            complete: false
        }
        todosArray.push(newTodo);
        setTodosLocal(todosArray);
        todosGenerator(todosArray);
    }
}

function todosGenerator(todosArray) {
    todoList.innerHTML = '';
    let todoClasses = null;
    let cirClasses = null;
    todosArray.forEach(todo => {
        if (todo.name === menuTitle.innerHTML) {
            if (todo.complete) {
                todoClasses = 'todo complete';
                cirClasses = 'cir complete'
            } else {
                todoClasses = 'todo';
                cirClasses = 'cir';
            }

            todoList.insertAdjacentHTML('beforeend', ` <li class="todo-item">
        <span class="${cirClasses}"></span>
        <div class="${todoClasses}" title="Right-click => Edit">${todo.todo}</div>
        <i class="fa fa-trash-o"></i>
    </li>`);
        }
    })
}

// let todoArray = $.querySelectorAll('.todo');

// todoArray.forEach(todo => {
//     let newTodo = {
//         name: menuTitle.innerHTML,
//         todo: todo.innerHTML,
//         complete: false
//     }
//     todosArray.push(newTodo);
// })

function setTodosLocal(todosArray) {
    localStorage.setItem('todos', JSON.stringify(todosArray));
}

window.addEventListener('load', () => {
    setMenuTitle();
    setMenuLists();
    setTodos();
    reloadTheme();
});

function setMenuTitle() {
    let lastSelectedList = localStorage.getItem('lastList');

    if (lastSelectedList) {
        menuTitle.innerHTML = lastSelectedList;
    }
}

function setMenuLists() {
    let getListsLocal = JSON.parse(localStorage.getItem('lists'));

    if (getListsLocal) {
        listsArray = getListsLocal;
    } else {
        setListsLocal(listsArray);
    }

    listsGenerator(listsArray);
}

function setTodos() {
    let getTodosLocal = JSON.parse(localStorage.getItem('todos'));

    if (getTodosLocal) {
        todosArray = getTodosLocal;
    } else {
        setTodosLocal(todosArray);
    }

    todosGenerator(todosArray);
}

function reloadTheme() {
    let lastTheme = localStorage.getItem('lastTheme');
    changeTheme(lastTheme);
}

/////////////

let colorsArray = [
    ['1', '#fff', '#af7eeb', '#8894b7', '#d1a4ff', '#e3e9ff'],
    ['2', '#fff', '#f4978e', '#6d6875', '#ffb4a2', '#ffdab9'],
    ['3', '#fff', '#9a8c98', '#4a4e69', '#c9ada7', '#f2e9e4'],
    ['4', '#fff', '#f4acb7', '#9d8189', '#ffe5d9', '#d8e2dc'],
    ['5', '#fff', '#588157', '#3a5a40', '#a3b18a', '#cbd6b9'],
    ['6', '#fff', '#468faf', '#2c7da0', '#89c2d9', '#a9d6e5'],
];

let colorsBtn = $.querySelectorAll('.color');
let colorsText = $.getElementById('text');
let colorContainer = $.getElementById('color-container');
let arrow = $.querySelector('.arrow');

colorsBtn.forEach(colorBtn => {
    colorBtn.addEventListener('click', (e) => {
        changeTheme(e.target.dataset.num);
        localStorage.setItem('lastTheme', e.target.dataset.num);
    });
})

function changeTheme(colorNum) {
    colorsArray.forEach(color => {
        if (colorNum === color[0]) {
            document.documentElement.style.setProperty('--white-color', color[1]);
            document.documentElement.style.setProperty('--primary-color', color[2]);
            document.documentElement.style.setProperty('--second-color', color[3]);
            document.documentElement.style.setProperty('--third-color', color[4]);
            document.documentElement.style.setProperty('--bg-color', color[5]);
        }
    })
    colorContainer.classList.remove('active');
    arrow.classList.remove('active');
}

colorsText.addEventListener('click', () => {
    colorContainer.classList.toggle('active');
    arrow.classList.toggle('active');
})