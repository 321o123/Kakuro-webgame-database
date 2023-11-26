<script>
    import KakuroBoardView from '$lib/KakuroBoardView.svelte';
    import BoardSubmission from '$lib/BoardSubmission.svelte';
    import {onMount} from "svelte";

    let showingHints = true;
    let pencilMarking = false;
    let complete = false;

    let activeBoard;

    let user;
    onMount(() => {
        user = sessionStorage.getItem('username');
    });
</script>

<main>
    <p>
        <label>
            <input type="checkbox" bind:checked={showingHints}>
            Show hint tooltips
        </label>
    </p>
    <p>
        <label>
            <input type="checkbox" bind:checked={pencilMarking}>
            Input pencil marks
        </label>
    </p>

    <KakuroBoardView bind:board={activeBoard}
            showTooltipHints={showingHints} bind:inputtingHints={pencilMarking} bind:complete/>
    <span> {@html complete?"You did it!":"<br/>"} </span>

    {#if user}
        <BoardSubmission board={activeBoard}/>
    {/if}
</main>

<style>
    main {
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }
</style>
