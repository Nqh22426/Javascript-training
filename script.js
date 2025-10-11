let count = 0;

const container = document.querySelector(".container");
const countDisplay = document.querySelector(".count");
const resetBtn = document.getElementById("reset-btn");

// 
document.addEventListener("click", function(){
    count++;
    countDisplay.textContent = count;
});

// Reset đếm
resetBtn.addEventListener("click", function(event){
    event.stopPropagation();
    count = 0;

    countDisplay.textContent = count;
});