const inputBox = document.getElementById("input-box");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");

addBtn.addEventListener("click", function(){
    if(inputBox.value === ""){
        alert("Please type your task!");
        return;
    }
    else{
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        taskList.appendChild(li);
    }

    inputBox.value = "";
})