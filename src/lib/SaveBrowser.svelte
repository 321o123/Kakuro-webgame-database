<script>
    import {createEventDispatcher, onMount} from "svelte";
    import tippy from "tippy.js";
    import {download_board, download_save} from "./boardLoader.js";


    let saves = [];
    let order = 'DESC';
    let page = 0;
    let count = 10;
    let key = 'date';
    let save_count;
    const dispatch = createEventDispatcher();

    let regenerate_list=false;

    export async function getBoards() {
        const response = await fetch('/api/show-saves',{
            method: 'POST',
            body: JSON.stringify({
                user_id: sessionStorage.getItem('userId'),
                offset: page*count,
                count: count,
                key: key,
                order: order,
                token: sessionStorage.getItem('token')
            }),
            headers: {
                'content-type': 'application/json'
            }
        });
        if (response.ok)
        {
            saves = await response.json();
            save_count = parseInt(response.headers.get("count"));
        }
        regenerate_list = !regenerate_list;
    }

    onMount(()=>{
        getBoards();
    });

    function tooltip(node) {
        if (node.scrollWidth <= node.offsetWidth) return;

        const tooltip = tippy(node, {content: node.innerText});

        // noinspection JSUnusedGlobalSymbols
        return {
            update(options) {
                tooltip.setProps(options);
            },
            destroy() {
                tooltip.destroy();
            }
        };
    }

    export let visible = true;

    async function loadSave(boardId) {
        let board_data = await download_board(boardId);
        let save_data = await download_save(boardId);
        if (board_data) {
            dispatch("loaded", {board_data: board_data, save_data: save_data, board_id: boardId});
        }
    }
</script>

<svelte:window on:resize={()=>regenerate_list=!regenerate_list}/>



<style>
    table{
        position: relative;
        top: 4vh;
        padding-top: 1vh;
        max-width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        width: 100%;
    }
    th, td{
        border: 1px solid #dddddd;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .score_cell{
        max-width: 5vw;
        min-width: 5vw;
    }
    .date_cell{
        max-width: 7vw;
        min-width: 7vw;
    }
    .load_cell{
        max-width: 4vw;
        min-width: 3vw;
        text-overflow: unset;
    }
    .page_button{
        position: relative;
        top: 5vh;
        translate: 45%;
        justify-content: center;
    }

</style>
<div style:display={visible?"block":"none"} style="display: block; width: fit-content; justify-content: center" >

<table>
    <tr>
        <th use:tooltip class="score_cell">Completed</th>
        <th use:tooltip>Name</th>
        <th use:tooltip class="date_cell">Creation Date</th>

    </tr>
    {#key regenerate_list}
    {#each saves as save}
        <tr>
            <td class="score_cell" use:tooltip>
                <svg width="1em" height="1em" viewBox="0 0 100 100">
                    {#if !save.completed}
                    <circle cx="50%" cy="50%" r="40%" fill="none" stroke="gray" stroke-width="15%"/>
                    {:else}
                    <circle cx="50%" cy="50%" r="40%" fill="green" stroke="green" stroke-width="15%"/>
                    <polyline transform="translate(0, -5)" stroke="white" stroke-width="15%" fill="none" points="17.4,55 49,85  73.4,25.3"/>
                    {/if}
                </svg>
                {#if save.completed}
                <button on:click={()=>dispatch("review", {board_id: save.board_id})}> Review </button>
                {/if}
            </td>
            <td use:tooltip>{save.name}</td>
            <td class="date_cell" use:tooltip>{new Date(save.creation_time).toLocaleString()}</td>
            <td on:click={()=>loadSave(save.board_id)} class="load_cell"><button>Load</button></td>
        </tr>
    {/each}
    {/key}

</table>
<div class="page_button">
    <button disabled={page<=0} on:click={()=>{page--;getBoards()}}>
        &lt
    </button>
    {page+1}
    <button disabled={page+1>=save_count/count} on:click={()=>{page++;getBoards()}}>
        &gt
    </button>
</div>

</div>