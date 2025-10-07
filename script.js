const inputBox = document.getElementById('input-box')
const addBtn = document.getElementById('add-btn')
const taskList = document.getElementById('task-list')

addBtn.addEventListener('click', function(){
    const text = inputBox.value.trim();
    if (text === ''){
        alert("Please type your work!");
        Return;
    }
    else{
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        taskList.appendChild(li);

    }

    inputBox.value = "";
})
