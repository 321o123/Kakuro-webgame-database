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

<style>
    nav {
        z-index: 99;
        position: fixed;
        top: 0;
        left: 0;
        background-color: #EEE;
        width: 100%;
        font-size: 2.5vh;
        height: 3vh;
    }
</style>

<nav>
    <a href="/">Home</a>
    {#if user}
        <button style:height="2.5vh" style:width="6em" style:font-size="60%" style:overflow="hidden"  on:click={logout}>Logout</button>
    {:else}
        <a href="/login">Login</a>
        <a href="/register">Register</a>
    {/if}
    {user?'Active user: ' + user:'Not logged in'}
</nav>

<div style:min-height="3vh"/>

<slot></slot>