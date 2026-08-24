// ==================================================
// API CONFIGURATION
// ==================================================

// Empty string is intentional.
//
// Local:
// http://127.0.0.1:8000
//
// Render:
// https://your-app.onrender.com
//
// Because frontend and backend are served
// by the same FastAPI application,
// relative URLs work on both.

const API_URL = "";


// ==================================================
// DOM ELEMENTS
// ==================================================


// -------------------------
// Authentication
// -------------------------

const authSection =
    document.getElementById("auth-section");


// -------------------------
// Login
// -------------------------

const loginSection =
    document.getElementById("login-section");

const loginForm =
    document.getElementById("login-form");

const loginMessage =
    document.getElementById("login-message");


// -------------------------
// Register
// -------------------------

const registerSection =
    document.getElementById("register-section");

const registerForm =
    document.getElementById("register-form");

const registerMessage =
    document.getElementById("register-message");


// -------------------------
// Login/Register buttons
// -------------------------

const showRegisterBtn =
    document.getElementById("show-register");

const showLoginBtn =
    document.getElementById("show-login");


// -------------------------
// Dashboard
// -------------------------

const dashboardSection =
    document.getElementById("dashboard-section");

const logoutBtn =
    document.getElementById("logout-btn");


// -------------------------
// Post
// -------------------------

const postForm =
    document.getElementById("post-form");

const postMessage =
    document.getElementById("post-message");

const postsContainer =
    document.getElementById("posts");


// ==================================================
// INITIAL PAGE LOAD
// ==================================================

const savedToken =
    localStorage.getItem("access_token");


if (savedToken) {

    showDashboard();

} else {

    showLogin();

}


// ==================================================
// SHOW LOGIN
// ==================================================

function showLogin() {

    authSection.style.display = "block";

    loginSection.style.display = "block";

    registerSection.style.display = "none";

    dashboardSection.style.display = "none";

}


// ==================================================
// SHOW REGISTER
// ==================================================

function showRegisterPage() {

    authSection.style.display = "block";

    loginSection.style.display = "none";

    registerSection.style.display = "block";

    dashboardSection.style.display = "none";

}


// ==================================================
// SHOW DASHBOARD
// ==================================================

function showDashboard() {

    authSection.style.display = "none";

    dashboardSection.style.display = "block";

    getPosts();

}


// ==================================================
// LOGIN → REGISTER
// ==================================================

showRegisterBtn.addEventListener(
    "click",
    function () {

        loginMessage.textContent = "";

        registerMessage.textContent = "";

        showRegisterPage();

    }
);


// ==================================================
// REGISTER → LOGIN
// ==================================================

showLoginBtn.addEventListener(
    "click",
    function () {

        loginMessage.textContent = "";

        registerMessage.textContent = "";

        showLogin();

    }
);


// ==================================================
// REGISTER USER
// ==================================================

registerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            document
                .getElementById("register-email")
                .value
                .trim();


        const password =
            document
                .getElementById("register-password")
                .value;


        // -------------------------------
        // Validation
        // -------------------------------

        if (!email || !password) {

            registerMessage.textContent =
                "Email and password are required.";

            return;

        }


        // -------------------------------
        // UserCreate schema
        // -------------------------------

        const userData = {

            email: email,

            password: password

        };


        try {

            registerMessage.textContent =
                "Creating account...";


            const response =
                await fetch(
                    `${API_URL}/users/`,
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                userData
                            )

                    }
                );


            const data =
                await response.json();


            console.log(
                "Register response:",
                data
            );


            // -------------------------------
            // Error
            // -------------------------------

            if (!response.ok) {

                registerMessage.textContent =
                    data.detail ||
                    "Registration failed.";

                return;

            }


            // -------------------------------
            // Success
            // -------------------------------

            registerMessage.textContent =
                "Account created successfully!";


            registerForm.reset();


            // Go to Login

            setTimeout(
                function () {

                    showLogin();

                    loginMessage.textContent =
                        "Registration successful. Please login.";

                },
                1000
            );

        }


        catch (error) {

            console.error(
                "Registration error:",
                error
            );


            registerMessage.textContent =
                "Server error. Please try again.";

        }

    }
);


// ==================================================
// LOGIN
// ==================================================

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            document
                .getElementById("login-email")
                .value
                .trim();


        const password =
            document
                .getElementById("login-password")
                .value;


        /*
            Backend uses:

            OAuth2PasswordRequestForm

            Therefore it expects:

            username
            password

            Your backend searches:

            User.email == username
        */


        const formData =
            new URLSearchParams();


        formData.append(
            "username",
            email
        );


        formData.append(
            "password",
            password
        );


        try {

            loginMessage.textContent =
                "Logging in...";


            const response =
                await fetch(
                    `${API_URL}/login`,
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/x-www-form-urlencoded"

                        },

                        body:
                            formData

                    }
                );


            const data =
                await response.json();


            console.log(
                "Login response:",
                data
            );


            // -------------------------------
            // Login failed
            // -------------------------------

            if (!response.ok) {

                loginMessage.textContent =
                    data.detail ||
                    "Invalid credentials.";

                return;

            }


            // -------------------------------
            // Save JWT
            // -------------------------------

            localStorage.setItem(
                "access_token",
                data.access_token
            );


            loginForm.reset();


            // -------------------------------
            // Dashboard
            // -------------------------------

            showDashboard();

        }


        catch (error) {

            console.error(
                "Login error:",
                error
            );


            loginMessage.textContent =
                "Server error. Please try again.";

        }

    }
);


// ==================================================
// LOGOUT
// ==================================================

logoutBtn.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "access_token"
        );


        postsContainer.innerHTML = "";


        postForm.reset();


        showLogin();


        loginMessage.textContent =
            "Logged out successfully.";

    }
);


// ==================================================
// GET POSTS
// ==================================================

async function getPosts() {

    const token =
        localStorage.getItem(
            "access_token"
        );


    if (!token) {

        showLogin();

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/posts/`,
                {
                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        console.log(
            "Posts response:",
            data
        );


        // -------------------------------
        // Unauthorized
        // -------------------------------

        if (response.status === 401) {

            localStorage.removeItem(
                "access_token"
            );


            showLogin();


            loginMessage.textContent =
                "Session expired. Please login.";

            return;

        }


        // -------------------------------
        // Other error
        // -------------------------------

        if (!response.ok) {

            postsContainer.innerHTML =
                `<p>${data.detail || "Unable to load posts."}</p>`;

            return;

        }


        // -------------------------------
        // Display
        // -------------------------------

        displayPosts(data);

    }


    catch (error) {

        console.error(
            "Get posts error:",
            error
        );


        postsContainer.innerHTML =
            "<p>Unable to connect to server.</p>";

    }

}


// ==================================================
// DISPLAY POSTS
// ==================================================

function displayPosts(posts) {

    postsContainer.innerHTML = "";


    if (
        !Array.isArray(posts) ||
        posts.length === 0
    ) {

        postsContainer.innerHTML =
            "<p>No posts available.</p>";

        return;

    }


    posts.forEach(
        function (item) {

            /*
                Backend:

                PostOut:

                {
                    Post: PostRes,
                    votes: int
                }
            */


            const post =
                item.Post;


            const votes =
                item.votes;


            const postElement =
                document.createElement("article");


            postElement.innerHTML = `

                <h3>
                    ${escapeHTML(post.title)}
                </h3>


                <p>
                    ${escapeHTML(post.content)}
                </p>


                <p>
                    <strong>
                        Votes:
                    </strong>

                    ${votes}
                </p>


                <p>
                    <small>
                        Post ID: ${post.id}
                    </small>
                </p>


                <button
                    type="button"
                    onclick="votePost(${post.id}, 1)"
                >
                    👍 Like
                </button>


                <button
                    type="button"
                    onclick="votePost(${post.id}, -1)"
                >
                    👎 Dislike
                </button>


                <button
                    type="button"
                    onclick="editPost(
                        ${post.id},
                        '${escapeForJS(post.title)}',
                        '${escapeForJS(post.content)}',
                        ${post.published}
                    )"
                >
                    ✏️ Edit
                </button>


                <button
                    type="button"
                    onclick="deletePost(${post.id})"
                >
                    🗑️ Delete
                </button>


                <hr>

            `;


            postsContainer.appendChild(
                postElement
            );

        }
    );

}


// ==================================================
// CREATE POST
// ==================================================

postForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const token =
            localStorage.getItem(
                "access_token"
            );


        if (!token) {

            showLogin();

            return;

        }


        const title =
            document
                .getElementById("title")
                .value
                .trim();


        const content =
            document
                .getElementById("content")
                .value
                .trim();


        const published =
            document
                .getElementById("published")
                .value === "true";


        // -------------------------------
        // CreatePost schema
        // -------------------------------

        const postData = {

            title: title,

            content: content,

            published: published

        };


        try {

            postMessage.textContent =
                "Creating post...";


            const response =
                await fetch(
                    `${API_URL}/posts/`,
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body:
                            JSON.stringify(
                                postData
                            )

                    }
                );


            const data =
                await response.json();


            console.log(
                "Create post response:",
                data
            );


            if (response.status === 401) {

                localStorage.removeItem(
                    "access_token"
                );


                showLogin();

                return;

            }


            if (!response.ok) {

                postMessage.textContent =
                    data.detail ||
                    "Unable to create post.";

                return;

            }


            // -------------------------------
            // Success
            // -------------------------------

            postMessage.textContent =
                "Post created successfully!";


            postForm.reset();


            getPosts();

        }


        catch (error) {

            console.error(
                "Create post error:",
                error
            );


            postMessage.textContent =
                "Server error. Please try again.";

        }

    }
);


// ==================================================
// UPDATE POST
// ==================================================

async function editPost(
    postId,
    oldTitle,
    oldContent,
    oldPublished
) {

    const token =
        localStorage.getItem(
            "access_token"
        );


    if (!token) {

        showLogin();

        return;

    }


    const newTitle =
        prompt(
            "Enter new title:",
            oldTitle
        );


    if (newTitle === null) {

        return;

    }


    const newContent =
        prompt(
            "Enter new content:",
            oldContent
        );


    if (newContent === null) {

        return;

    }


    const postData = {

        title: newTitle.trim(),

        content: newContent.trim(),

        published: oldPublished

    };


    try {

        const response =
            await fetch(
                `${API_URL}/posts/${postId}`,
                {
                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify(
                            postData
                        )

                }
            );


        const data =
            await response.json();


        console.log(
            "Update response:",
            data
        );


        if (response.status === 401) {

            localStorage.removeItem(
                "access_token"
            );


            showLogin();

            return;

        }


        if (!response.ok) {

            alert(
                data.detail ||
                "Unable to update post."
            );

            return;

        }


        alert(
            "Post updated successfully!"
        );


        getPosts();

    }


    catch (error) {

        console.error(
            "Update error:",
            error
        );


        alert(
            "Server error. Please try again."
        );

    }

}


// ==================================================
// DELETE POST
// ==================================================

async function deletePost(postId) {

    const token =
        localStorage.getItem(
            "access_token"
        );


    if (!token) {

        showLogin();

        return;

    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this post?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/posts/${postId}`,
                {
                    method: "DELETE",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        // -------------------------------
        // Unauthorized
        // -------------------------------

        if (response.status === 401) {

            localStorage.removeItem(
                "access_token"
            );


            showLogin();

            return;

        }


        // -------------------------------
        // Delete failed
        // -------------------------------

        if (!response.ok) {

            let data = {};

            try {

                data =
                    await response.json();

            }

            catch (error) {

                // 204 has no response body

            }


            alert(
                data.detail ||
                "Unable to delete post."
            );


            return;

        }


        // -------------------------------
        // Success
        // -------------------------------

        alert(
            "Post deleted successfully!"
        );


        getPosts();

    }


    catch (error) {

        console.error(
            "Delete error:",
            error
        );


        alert(
            "Server error. Please try again."
        );

    }

}


// ==================================================
// LIKE / DISLIKE
// ==================================================

async function votePost(
    postId,
    direction
) {

    const token =
        localStorage.getItem(
            "access_token"
        );


    if (!token) {

        showLogin();

        return;

    }


    /*
        Vote schema:

        {
            post_id: int,
            dir: 1 or -1
        }

        1  = Like
        -1 = Dislike
    */


    const voteData = {

        post_id: postId,

        dir: direction

    };


    try {

        const response =
            await fetch(
                `${API_URL}/vote/`,
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify(
                            voteData
                        )

                }
            );


        const data =
            await response.json();


        console.log(
            "Vote response:",
            data
        );


        if (response.status === 401) {

            localStorage.removeItem(
                "access_token"
            );


            showLogin();

            return;

        }


        if (!response.ok) {

            alert(
                data.detail ||
                "Vote failed."
            );

            return;

        }


        getPosts();

    }


    catch (error) {

        console.error(
            "Vote error:",
            error
        );


        alert(
            "Server error. Please try again."
        );

    }

}


// ==================================================
// ESCAPE HTML
// ==================================================

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value ?? "";


    return div.innerHTML;

}


// ==================================================
// ESCAPE STRING FOR INLINE JS
// ==================================================

function escapeForJS(value) {

    return String(value ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r");

}