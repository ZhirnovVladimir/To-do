function dataToJson(data) {
    return JSON.stringify(data);
}

function setTodoItem(key, data) {
    localStorage.setItem(key, data);
}

function saveDataToLocalStorage(key, data) {
    const jsonData = dataToJson(data); // Преобразование данных в JSON
    setTodoItem(key, jsonData); // Сохранение данных в LocalStorage
}

function getLocalStorage(name) {
    let currentStorage = JSON.parse(localStorage.getItem(name))
    if (currentStorage == null) {
        return []
    }
    else {
        return currentStorage
    }
}

function getId(storagePage) {
    let currentStorage = getLocalStorage(storagePage)
    if (currentStorage == null || currentStorage.length < 1) {
        return 1
    }
    else {
        let digit = []
        for (let tasks of currentStorage) {
            digit.push(tasks.Id)
        }
        return digit.at(-1) + 1
    }
}

function removeItemStorage(itemId, storagePage) {
    let storage = getLocalStorage(storagePage)
    let newStorage = []
    for (let item of storage) {
        if (item.Id !== itemId) {
            newStorage.push(item)
        }
    }

    saveDataToLocalStorage(storagePage, newStorage)

}

function doneItemStorage(itemId, storagePage) {
    let storage = getLocalStorage(storagePage)
    let newStorage = []
    for (let item of storage) {
        if (item.Id == itemId) {
            item.done = item.done == true ? false : true
            newStorage.push(item)
        }
        else {
            newStorage.push(item)
        }
    }

    saveDataToLocalStorage(storagePage, newStorage)

}


function createAppTitle(title) {
    let appTitle = document.createElement('h2')
    appTitle.textContent = title
    return appTitle
}

function createTodoItemForm() {
    let form = document.createElement('form')
    let input = document.createElement('input')
    let buttonWraper = document.createElement('div')
    let button = document.createElement('button')

    form.classList.add('input-group', 'mb-3')
    input.classList.add('form-control')
    input.placeholder = 'Введите название нового дела'
    buttonWraper.classList.add('input-group-append')
    button.classList.add('btn', 'btn-primary')
    button.setAttribute("disabled", "")
    button.textContent = 'Добавить дело'

    input.addEventListener('input', function () { //Если в поле для ввода что-то введено - кнопка активируется
        if (input.value.length > 0) {
            button.removeAttribute("disabled")
        }
        else {
            button.setAttribute("disabled", "")
        }
    })


    buttonWraper.append(button)
    form.append(input)
    form.append(buttonWraper)

    return {
        form,
        input,
        button
    }
}

function createTodoList() {
    let list = document.createElement('ul')
    list.classList.add('list-group')
    return list
}

function createTodoItem(name, storagePage) {
    let item = document.createElement('li')
    let buttonGroup = document.createElement('div')
    let doneButton = document.createElement('button')
    let deleteButton = document.createElement('button')

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center')
    item.textContent = name

    buttonGroup.classList.add('btn-group', 'btn-group-sm')

    doneButton.classList.add('btn', 'btn-success')
    doneButton.textContent = 'Готово'

    deleteButton.classList.add('btn', 'btn-danger')
    deleteButton.textContent = 'Удалить'

    buttonGroup.append(doneButton)
    buttonGroup.append(deleteButton)
    item.append(buttonGroup)

    let itemId = getId(storagePage)


    return {
        item,
        doneButton,
        deleteButton,
        itemId
    }
}


function createTodoApp(container, title = 'Список дел', storagePage) {

    let todoAppTitle = createAppTitle(title)
    let todoItemForm = createTodoItemForm()
    let todoList = createTodoList()

    container.append(todoAppTitle)
    container.append(todoItemForm.form)
    container.append(todoList)

    let todoArrStorage = getLocalStorage(storagePage)

    if (todoArrStorage !== null) {
        for (let task of todoArrStorage) {
            let todoItem = createTodoItem(task.name, storagePage)
            todoList.append(todoItem.item)
            task.done == true ? todoItem.item.classList.add('list-group-item-success') : todoItem.item.classList.remove('list-group-item-success')
            todoItem.doneButton.addEventListener('click', function () {
                todoItem.item.classList.toggle('list-group-item-success')
                doneItemStorage(task.Id, storagePage)

            })

            todoItem.deleteButton.addEventListener('click', function () {
                if (confirm('Вы уверены?')) {
                    todoItem.item.remove()
                    removeItemStorage(task.Id, storagePage)
                }
            })
        }
    }

    else {
        todoArrStorage = []
    }

    todoItemForm.form.addEventListener('submit', function (e) {
        e.preventDefault() //Страница не будет перезагружаться после отправки формы
        todoItemForm.button.setAttribute("disabled", "")


        /* if (!todoItemForm.input.value) { //Если ничего не введено, то ничего не происходит
             return                         //
         } Уже не требуется, т.к. кнопка неавктивна, если поле пустое*/

        let todoItem = createTodoItem(todoItemForm.input.value, storagePage)
        let todoObj = { "Id": todoItem.itemId, "name": todoItemForm.input.value, "done": false }
        todoArrStorage.push(todoObj)
        saveDataToLocalStorage(storagePage, todoArrStorage)

        todoItem.doneButton.addEventListener('click', function () {
            todoItem.item.classList.toggle('list-group-item-success')
            doneItemStorage(todoItem.itemId, storagePage)
        })

        todoItem.deleteButton.addEventListener('click', function () {
            if (confirm('Вы уверены?')) {
                todoItem.item.remove()
                //console.log(todoItem.itemId) //Id созданного item
                removeItemStorage(todoItem.itemId, storagePage)
                todoArrStorage = getLocalStorage(storagePage)
            }

        })


        todoList.append(todoItem.item)
        todoItemForm.input.value = '' //обнуляем строку с введенным значением, после добавления

    })
}


window.createTodoApp = createTodoApp


