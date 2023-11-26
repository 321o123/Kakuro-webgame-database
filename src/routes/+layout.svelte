<script>
    import { onMount } from 'svelte';

    let user = '';
    onMount(() => {
        user = sessionStorage.getItem('username');
    });
    const logout = (()=> {
        sessionStorage.clear();
        location.reload();
    });
</script>

<nav>
    <a href="/">Main</a>
    <a href="/login">Login</a>
    <a href="/register">Register</a>
    <button  on:click={logout}>Logout</button>
    {user?'Active user: ' + user:'Not logged in'}
</nav>

<slot></slot>
