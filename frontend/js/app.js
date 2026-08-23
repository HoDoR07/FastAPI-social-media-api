// ==========================================
// API CONFIGURATION
// ==========================================

const API_URL = "http://127.0.0.1:8000";


// ==========================================
// HELPER FUNCTIONS
// ==========================================

function getToken() {
    return localStorage.getItem("access_token");
}


function logout() {
    localStorage.removeItem("access_token");
    window.location.href = "login.html";
}


function showMessage(element, message, success = false) {
    if (!element) return;

    element.textContent = message;
    element.style.color = success ? "green" : "red";
}


// ==========================================
// REGISTER
// ==========================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message = document.getElementById("message");


        // Check password
        if (password !== confirmPassword) {

            showMessage(
                message,
                "Passwords do not match."
            );

            return;
        }


        try {

            const response = await fetch(
                `${API_URL}/users/`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                let errorMessage = "Registration failed.";

                if (Array.isArray(data.detail)) {

                    errorMessage = data.detail
                        .map(error => error.msg)
                        .join(", ");

                } else if (data.detail) {

                    errorMessage = data.detail;

                }


                showMessage(
                    message,
                    errorMessage
                );

                return;
            }


            showMessage(
                message,
                "Account created successfully!",
                true
            );


            registerForm.reset();


            setTimeout(() => {

                window.location.href = "login.html";

            }, 1000);


        } catch (error) {

            console.error("Register Error:", error);

            showMessage(
                message,
                "Unable to connect to the server."
            );

        }

    });

}


// ==========================================
// LOGIN
// ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const message =
            document.getElementById("message");


        try {

            /*
                FastAPI OAuth2PasswordRequestForm
                expects form data:

                username
                password
            */

            const formData = new URLSearchParams();

            formData.append("username", email);
            formData.append("password", password);


            const response = await fetch(
                `${API_URL}/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },

                    body: formData
                }
            );


            const data = await response.json();


            if (!response.ok) {

                showMessage(
                    message,
                    data.detail || "Invalid credentials."
                );

                return;
            }


            // Save JWT
            localStorage.setItem(
                "access_token",
                data.access_token
            );


            showMessage(
                message,
                "Login successful!",
                true
            );


            setTimeout(() => {

                window.location.href = "posts.html";

            }, 500);


        } catch (error) {

            console.error("Login Error:", error);

            showMessage(
                message,
                "Unable to connect to the server."
            );

        }

    });

}


// ==========================================
// POSTS PAGE
// ==========================================

const postsList = document.getElementById("postsList");

if (postsList) {

    const token = getToken();

    if (!token) {

        window.location.href = "login.html";

    } else {

        loadPosts();

    }

}


// ==========================================
// GET POSTS
// ==========================================

async function loadPosts() {

    const token = getToken();

    if (!token) {

        window.location.href = "login.html";
        return;

    }


    try {

        const response = await fetch(
            `${API_URL}/posts/`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const data = await response.json();


        if (!response.ok) {

            if (
                response.status === 401 ||
                response.status === 403
            ) {

                logout();
                return;

            }

            throw new Error(
                data.detail || "Failed to load posts."
            );

        }


        displayPosts(data);


    } catch (error) {

        console.error("Load Posts Error:", error);

        if (postsList) {

            postsList.innerHTML = `
                <p>
                    Failed to load posts.
                </p>
            `;

        }

    }

}


// ==========================================
// DISPLAY POSTS
// ==========================================

function displayPosts(posts) {

    if (!postsList) return;


    postsList.innerHTML = "";


    if (!posts || posts.length === 0) {

        postsList.innerHTML = `
            <p>
                No posts available.
            </p>
        `;

        return;
    }


    posts.forEach(item => {

        const post = item.Post;
        const votes = item.votes;


        const postCard =
            document.createElement("article");


        postCard.className = "post-card";


        postCard.innerHTML = `

            <h2>
                ${escapeHTML(post.title)}
            </h2>

            <p>
                ${escapeHTML(post.content)}
            </p>

            <p>
                <small>
                    Posted by:
                    ${escapeHTML(post.owner.email)}
                </small>
            </p>

            <div>

                <button
                    class="vote-btn"
                    onclick="votePost(${post.id}, 1)"
                >
                    👍
                </button>

                <span class="vote-count">
                    ${votes}
                </span>

                <button
                    class="vote-btn"
                    onclick="votePost(${post.id}, -1)"
                >
                    👎
                </button>

            </div>

        `;


        postsList.appendChild(postCard);

    });

}


// ==========================================
// CREATE POST
// ==========================================

const createPostForm =
    document.getElementById("createPostForm");


if (createPostForm) {

    createPostForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const token = getToken();


            if (!token) {

                window.location.href = "login.html";
                return;

            }


            const title =
                document.getElementById("postTitle")
                    .value
                    .trim();


            const content =
                document.getElementById("postContent")
                    .value
                    .trim();


            const published =
                document.getElementById("published").checked;


            const message =
                document.getElementById(
                    "createPostMessage"
                );


            try {

                const response = await fetch(
                    `${API_URL}/posts/`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body: JSON.stringify({

                            title: title,

                            content: content,

                            published: published

                        })

                    }
                );


                const data = await response.json();


                if (!response.ok) {

                    showMessage(
                        message,
                        data.detail ||
                        "Failed to create post."
                    );

                    return;

                }


                showMessage(
                    message,
                    "Post created successfully!",
                    true
                );


                createPostForm.reset();


                // Reload posts
                await loadPosts();


            } catch (error) {

                console.error(
                    "Create Post Error:",
                    error
                );


                showMessage(
                    message,
                    "Unable to connect to the server."
                );

            }

        }
    );

}


// ==========================================
// VOTE
// ==========================================

async function votePost(postId, direction) {

    const token = getToken();


    if (!token) {

        window.location.href = "login.html";
        return;

    }


    /*
        IMPORTANT:

        Like     = 1
        Dislike  = -1

        Pydantic schema:

        dir: Literal[1, -1]
    */


    direction = Number(direction);
    postId = Number(postId);


    if (direction !== 1 && direction !== -1) {

        console.error(
            "Invalid vote direction:",
            direction
        );

        return;

    }


    try {

        console.log("Sending vote:", {
            post_id: postId,
            dir: direction
        });


        const response = await fetch(
            `${API_URL}/vote/`,
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${token}`

                },

                body: JSON.stringify({

                    post_id: postId,

                    dir: direction

                })

            }
        );


        const data = await response.json();


        console.log("Vote Response:", data);


        if (!response.ok) {

            console.error(
                "Vote Error:",
                data
            );


            if (
                response.status === 401 ||
                response.status === 403
            ) {

                logout();
                return;

            }


            let errorMessage =
                "Vote failed.";


            if (Array.isArray(data.detail)) {

                errorMessage = data.detail
                    .map(error => error.msg)
                    .join(", ");

            } else if (data.detail) {

                errorMessage = data.detail;

            }


            alert(errorMessage);

            return;

        }


        // Refresh posts
        await loadPosts();


    } catch (error) {

        console.error(
            "Vote Request Error:",
            error
        );


        alert(
            "Unable to connect to the server."
        );

    }

}


// ==========================================
// LOGOUT
// ==========================================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            logout();

        }
    );

}


// ==========================================
// REFRESH POSTS
// ==========================================

const refreshPosts =
    document.getElementById("refreshPosts");


if (refreshPosts) {

    refreshPosts.addEventListener(
        "click",
        function () {

            loadPosts();

        }
    );

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

}