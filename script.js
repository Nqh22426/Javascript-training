const regUsername = document.getElementById("reg-username");
const regPassword = document.getElementById("reg-password");
const regBtn = document.getElementById("reg-btn");

regBtn.addEventListener("click", function(){
    const username = regUsername.value.trim();
    const password = regPassword.value;

    if (!username || !password){
        alert("Please type both field of Username and Password!");
        return;
    }

    const validatePass = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;

    if(!validatePass.test(password)){
        alert("Please ensure your password contain 8 characters with at least 1 capital, 1 special, 1 number");
        return;
    }

    alert("Register Successfully!");
    
    regUsername.value = "";
    regPassword.value = "";
});