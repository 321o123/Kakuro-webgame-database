<script>
    import {createEventDispatcher, onMount} from "svelte";
    import tippy from "tippy.js";
    import {download_board} from "./boardLoader.js";


    let boards = [];
    let order = 'DESC';
    let page = 0;
    let count = 10;
    let key = 'score';
    let board_count;
    const dispatch = createEventDispatcher();

    let regenerate_list=false;

    export async function getBoards() {
        const response = await fetch('/api/show-boards?'+new URLSearchParams({
                order: order,
                offset: page*count,
                count: count,
                key: key
            }), {
            method: 'GET'
        });
        if (response.ok)
        {
            boards = await response.json();
            board_count = parseInt(response.headers.get("count"));
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

    async function loadBoard(boardId) {
        let ret = await download_board(boardId);
        if (ret) {
            dispatch("loaded", {board_data: ret, board_id: boardId});
        }
    }
</script>

<svelte:window on:resize={()=>regenerate_list=!regenerate_list}/>



<style>
    table{
        position: relative;
        top: 2vh;
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
    }
    .page_button{
        position: relative;
        top: 3vh;
        translate: 45%;
        justify-content: center;
    }

</style>
<div style:display={visible?"block":"none"} style="display: block; width: fit-content; justify-content: center" >

<table>
    <tr>
        <th use:tooltip class="score_cell">Author</th>
        <th use:tooltip>Name</th>
        <th use:tooltip class="score_cell">Average Score</th>
        <th use:tooltip class="date_cell">Creation Date</th>

    </tr>
    {#key regenerate_list !== visible}
    {#each boards as board}
        <tr>
            <td class="score_cell" use:tooltip>{board.username}</td>
            <td use:tooltip>{board.name}</td>
            <td class="score_cell" use:tooltip>{board.score?(parseFloat(board.score).toFixed(1)):'N\\A'}</td>
            <td class="date_cell" use:tooltip>{new Date(board.creation_date).toLocaleString()}</td>
            <td on:click={()=>loadBoard(board.board_id)} class="load_cell"><button>Load</button></td>
        </tr>
    {/each}
    {/key}

</table>
<div class="page_button">
    <button disabled={page<=0} on:click={()=>{page--;getBoards()}}>
        &lt
    </button>
    {page+1}
    <button disabled={page+1>=board_count/count} on:click={()=>{page++;getBoards()}}>
        &gt
    </button>
</div>

</div>