<script lang="ts">
    import { onMount } from "svelte";
    import { isAuthenticated, authenticate, register, logout } from "$lib/apiBridge";
    import { ApiError } from "$lib/apiBridge";

    let authenticated = $state(false);

    let action = $state("login");

    let errorMessage = $state("");

    onMount(() => {
        if (isAuthenticated()) {
            authenticated = true;
        } else {
            authenticated = false;
        }
    });

    async function handleSubmit(e) {
        e.preventDefault(); // Prevent default form submission
        console.log("Form submitted");
        const formData = new FormData(e.target);
        const username = formData.get("username");
        const password = formData.get("password");

        console.log("Action:", action);
        console.log("Username:", username);
        console.log("Password:", password);
        if (action === "login") {
            try {
                const success = await authenticate(username, password);
                authenticated = success;
            }
            catch (error) {
                console.error(error);
                if(error instanceof ApiError){
                    errorMessage = error.message;
                } else {
                    errorMessage = "An unknown error occurred.";
                }
            }
        } else if (action === "register") {
            try {
                const success = await register(username, password);
                authenticated = success;
            } catch (error) {
                console.error(error);
                if(error instanceof ApiError){
                    errorMessage = error.message;
                } else {
                    errorMessage = "An unknown error occurred.";
                }
            }
        }
    }

    async function handleLogout() {
        authenticated = false;
        await logout();
    }

</script>

{#if !authenticated}
    <form onsubmit="{handleSubmit}">
        <label>
            Username:
            <input type="text" name="username" required />
        </label>
        <label>
            Password:
            <input type="password" name="password" required />
        </label>
        <button type="submit" onclick="{() => action="login"}">Login</button>
        <button type="submit" onclick="{() => action="register"}">Register</button>
        {#if errorMessage}
            <p id="error">{errorMessage}</p>
        {/if}
    </form>
{:else}
    <button id="logoutButton" onclick="{() => { authenticated = false; }}">Logout</button>
    <slot />
{/if}

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        max-width: 400px;
        margin: 2rem auto;
        padding: 2rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.69);
        background-color: rgba(218, 251, 129, 0.25);
    }

    label {
        display: flex;
        flex-direction: column;
        font-size: 1rem;
        font-weight: 500;
        color: #000000;
    }

    input {
        padding: 0.75rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
        transition: border-color 0.3s;
    }

    input:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    button {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        font-weight: bold;
        color: white;
        background-color: #007bff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.2s;
    }

    button:hover {
        background-color: #0056b3;
    }

    button:active {
        transform: scale(0.98);
    }

    #error {
        color: red;
        font-size: 0.9rem;
        margin-top: 1rem;
        text-align: center;
        font-weight: bold;
        background-color: #f8d7da;
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid #f5c6cb;
        color: #721c24;
        margin-bottom: 1rem;
    }

    #logoutButton {
        position: fixed;
        top: 10px;
        right: 10px;
        background-color: #ff0000;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        transition: background-color 0.3s;
    }

</style>