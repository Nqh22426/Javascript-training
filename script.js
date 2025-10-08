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

        let span = document.createElement("span");
        span.innerHTML = "delete";
        li.appendChild(span);
    }

    inputBox.value = "";
})

taskList.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("completed");
    }
    else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
    }
})