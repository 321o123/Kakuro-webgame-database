<script>

    let username = '';
    let password = '';
    let confirmPassword = '';
    let error = '';

    function isAlphaNumeric(str) {
        let code, i, len;

        for (i = 0, len = str.length; i < len; i++) {
            code = str.charCodeAt(i);
            if (!(code > 47 && code < 58) && // numeric (0-9)
                !(code > 64 && code < 91) && // upper alpha (A-Z)
                !(code > 96 && code < 123)) { // lower alpha (a-z)
                return false;
            }
        }
        return true;
    }

    async function handleSubmit() {
        if (password !== confirmPassword) {
            error = "Passwords don't match!";
        } else if (username.length<3 || !isAlphaNumeric(username)) {
            error = "Username must be alphanumeric and be at least length 3";
        }
        else if (username.length<3 || !isAlphaNumeric(username)) {
            error = "Username must be alphanumeric and be at least length 3";
        }
        else {
            const response = await fetch('/api/register', {
                method: 'POST',
                body: JSON.stringify({ username: username, password: password }),
                headers: {
                    'content-type': 'application/json'
                }
            });
            if (response.ok)
            {
                let jsonResponse = await response.json();
                sessionStorage.setItem('token', jsonResponse.token);
                sessionStorage.setItem('username', jsonResponse.username);
                sessionStorage.setItem('userId', jsonResponse.userId);
                username = '';
                password = '';
                confirmPassword = '';
                error = '';
                location.replace("/");
            }
            else
            {
                error = (await response.json()).error;
            }

        }
    }
</script>

<h1>User Registration</h1>

{#if error}
    <p style="color: red;">{error}</p>
{/if}

<form on:submit|preventDefault={handleSubmit}>
    <div>
        <label for="username">Username:</label>
        <input type="text" id="username" bind:value={username} />
    </div>
    <div>
        <label for="password">Password:</label>
        <input type="password" id="password" bind:value={password} />
    </div>
    <div>
        <label for="confirmPassword">Confirm Password:</label>
        <input type="password" id="confirmPassword" bind:value={confirmPassword} />
    </div>
    <div>
        <button type="submit">Register</button>
    </div>
</form>
