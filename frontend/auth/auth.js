/* ============================
   SHOW / HIDE PASSWORD
============================ */

function togglePassword(id) {
    const input = document.getElementById(id);
    if (!input) return;

    input.type = input.type === "password" ? "text" : "password";
}

/* ============================
   SIGNUP PASSWORD VALIDATION
============================ */

function validatePassword() {
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");

    if (!password || !confirmPassword) return true;

    if (password.value !== confirmPassword.value) {
        alert("Passwords do not match!");
        return false;
    }
    return true;
}

/* ============================
   LOGIN USER (DEMO MODE)
============================ */

function loginUser() {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const errorMsg = document.getElementById("errorMsg");

    if (!email || !password) return false;

    // Dummy users (temporary – frontend only)
    const users = [
        { email: "test@gmail.com", password: "123456" },
        { email: "admin@gmail.com", password: "admin123" }
    ];

    const userFound = users.find(
        user => user.email === email.value && user.password === password.value
    );

    if (!userFound) {
        if (errorMsg) {
            errorMsg.textContent = "❌ User not found or incorrect password";
        } else {
            alert("User not found or incorrect password");
        }
        return false;
    }

    // Login success
    window.location.href = "../dashboard/dashboard.html";
    return false;
}

/* ============================
   GENDER CHANGE → MENSTRUATION
============================ */

function handleGenderChange() {
    const gender = document.getElementById("gender");
    const menstruationSection = document.getElementById("menstruationSection");

    if (!gender || !menstruationSection) return;

    if (gender.value === "female") {
        menstruationSection.style.display = "block";
    } else {
        menstruationSection.style.display = "none";
    }
}
if (smoking === "Heavy") lungDamage += 8;


function handleGenderChange() {
    const gender = document.getElementById("gender");
    const section = document.getElementById("menstruationSection");

    if (!gender || !section) {
        console.log("Gender or Menstruation section not found");
        return;
    }

    console.log("Selected gender:", gender.value);

    if (gender.value === "female") {
        section.style.display = "block";
    } else {
        section.style.display = "none";
    }
}

function loginUser() {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const errorMsg = document.getElementById("errorMsg");

    if (!email || !password) return false;

    // Dummy users (temporary – frontend only)
    const users = [
        { email: "test@gmail.com", password: "123456" },
        { email: "admin@gmail.com", password: "admin123" }
    ];

    const userFound = users.find(
        user => user.email === email.value && user.password === password.value
    );

    if (!userFound) {
        if (errorMsg) {
            errorMsg.textContent = "❌ User not found or incorrect password";
        } else {
            alert("User not found or incorrect password");
        }
        return false;
    }

    // Login success
    window.location.href = "../dashboard/dashboard.html";
    return false;
}