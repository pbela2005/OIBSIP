// ================================
// PASSWORD HASHING
// ================================

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        data
    );

    const hashArray = Array.from(
        new Uint8Array(hashBuffer)
    );

    return hashArray
        .map(byte =>
            byte.toString(16).padStart(2, "0")
        )
        .join("");
}


// ================================
// GET USERS
// ================================

function getUsers() {
    return JSON.parse(
        localStorage.getItem("registeredUsers")
    ) || [];
}


// ================================
// SAVE USERS
// ================================

function saveUsers(users) {
    localStorage.setItem(
        "registeredUsers",
        JSON.stringify(users)
    );
}


// ================================
// REGISTER USER
// ================================

const registerForm =
    document.getElementById("register-form");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const username =
                document.getElementById(
                    "register-username"
                ).value.trim();

            const email =
                document.getElementById(
                    "register-email"
                ).value.trim().toLowerCase();

            const password =
                document.getElementById(
                    "register-password"
                ).value;

            const errorMessage =
                document.getElementById(
                    "register-error"
                );

            const successMessage =
                document.getElementById(
                    "register-success"
                );

            errorMessage.textContent = "";
            successMessage.textContent = "";


            // Validation

            if (!username || !email || !password) {

                errorMessage.textContent =
                    "Please fill in all fields.";

                return;
            }

            if (password.length < 8) {

                errorMessage.textContent =
                    "Password must contain at least 8 characters.";

                return;
            }

            if (!/[0-9]/.test(password)) {

                errorMessage.textContent =
                    "Password must contain at least one number.";

                return;
            }


            const users = getUsers();


            // Duplicate user check

            const existingUser =
                users.find(user =>
                    user.email === email ||
                    user.username.toLowerCase() ===
                    username.toLowerCase()
                );

            if (existingUser) {

                errorMessage.textContent =
                    "Username or email already exists.";

                return;
            }


            // Hash password

            const passwordHash =
                await hashPassword(password);


            // Create new user

            const newUser = {
                username: username,
                email: email,
                passwordHash: passwordHash
            };

            users.push(newUser);

            saveUsers(users);


            successMessage.textContent =
                "Registration successful! Redirecting...";

            registerForm.reset();


            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);

        }
    );
}


// ================================
// LOGIN
// ================================

const loginForm =
    document.getElementById("login-form");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const email =
                document.getElementById(
                    "login-email"
                ).value.trim().toLowerCase();

            const password =
                document.getElementById(
                    "login-password"
                ).value;

            const errorMessage =
                document.getElementById(
                    "login-error"
                );

            errorMessage.textContent = "";


            const users = getUsers();

            const user =
                users.find(
                    registeredUser =>
                        registeredUser.email === email
                );


            if (!user) {

                errorMessage.textContent =
                    "Invalid email or password.";

                return;
            }


            const enteredPasswordHash =
                await hashPassword(password);


            if (
                enteredPasswordHash !==
                user.passwordHash
            ) {

                errorMessage.textContent =
                    "Invalid email or password.";

                return;
            }


            // Create session

            sessionStorage.setItem(
                "loggedInUser",
                JSON.stringify({
                    username: user.username,
                    email: user.email
                })
            );


            // Go to dashboard

            window.location.href =
                "dashboard.html";

        }
    );
}


// ================================
// PROTECTED DASHBOARD
// ================================

const userName =
    document.getElementById("user-name");

if (userName) {

    const loggedInUser =
        JSON.parse(
            sessionStorage.getItem(
                "loggedInUser"
            )
        );


    if (!loggedInUser) {

        window.location.href =
            "index.html";

    } else {

        document.getElementById(
            "user-name"
        ).textContent =
            loggedInUser.username;


        document.getElementById(
            "user-email"
        ).textContent =
            loggedInUser.email;
    }
}


// ================================
// LOGOUT
// ================================

const logoutButton =
    document.getElementById("logout-btn");

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function() {

            sessionStorage.removeItem(
                "loggedInUser"
            );

            window.location.href =
                "index.html";

        }
    );
}