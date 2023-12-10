<script>
    import KakuroBoardView from '$lib/KakuroBoardView.svelte';
    import BoardSubmission from '$lib/BoardSubmission.svelte';
    import BoardBrowser from "$lib/BoardBrowser.svelte";
    import {onMount} from "svelte";
    import {XmlToBoard, loadSave} from "$lib/KakuroBoard.js";
    import BoardSave from "$lib/BoardSave.svelte";
    import BoardLoad from "$lib/BoardLoad.svelte";
    import SaveBrowser from "$lib/SaveBrowser.svelte";
    import ReviewSubmission from "$lib/ReviewSubmission.svelte";
    import {download_board} from "$lib/boardLoader.js";
    import Device from "svelte-device-info";


    let showingHints = true;
    let pencilMarking = false;
    let complete = false;

    let activeBoard;
    let activeBoardId = -1;

    let board_list;
    let save_list;
    let reviewedBoardId = -1;

    let user;
    onMount(() => {
        user = sessionStorage.getItem('username');
        const board_data = download_board(54);
        if (board_data)
            activeBoard=XmlToBoard(board_data);
            activeBoardId = 54;
    });
    let sidebarActive = false;
    $: overlay = sidebarActive;

    let widthToGenerate;
    let heightToGenerate;

    async function generateNewBoard() {
        await activeBoard.generateRandom(
            Math.min(40, Math.max(3, widthToGenerate)),
            Math.min(40, Math.max(3, heightToGenerate)),
            ()=> {
                activeBoard = activeBoard
            }, 1);
        activeBoard=activeBoard;
        activeBoardId=-1;
        complete = false;
    }
    async function limitInput(input, maxValue) {
        console.log(maxValue)
        if (input.value > maxValue) {
            input.value = maxValue;
        }
    }

    let reviewDialog;
</script>

<title> Main Page of kakuro-webgame </title>

<style>
    .main {
        position: relative;

        z-index: 0;
        top: 0;
        left: 0;
    }
    aside {
        position: fixed;
        left: 0;
        top: 1vh;
        transition: all .5s;
        height: 100vh;
        width: var(--inactive-width);

        padding-top: 20px;
        border: 1px solid #ddd;
        background-color: #efefef;
        z-index: 2;
    }
    .sidebarActive {
        left: 0;
        width: var(--active-width);
    }

    .overlay {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.5);
        z-index: 1;
        cursor: pointer;

    }

    .sidebar-button {
        position: relative;
        top: 1vh;
        left: 1vw;
        width: var(--button-width);
        height: var(--button-width);
        padding: 0.01vw 0.01vw;
    }


</style>



<aside class:sidebarActive style:--active-width={Device.isMobile?"100vw":"35vw"} style:--inactive-width={Device.isMobile?"2em":"4vw"}>

    <button style:--button-width={Device.isMobile?"2em":"2vw"}  class="sidebar-button" title="Show sidebar" on:click={()=> sidebarActive = !sidebarActive} >
        <svg width={Device.isMobile?"1em":"1vw"} height={Device.isMobile?"1em":"1vw"} style="text-align: left; vertical-align: top" viewBox="0 0 100 100">
            <line x1="5" y1="10" x2="95" y2="10" stroke="#111" stroke-width="10" stroke-linecap="round"/>
            <line x1="5" y1="50" x2="95" y2="50" stroke="#111" stroke-width="10" stroke-linecap="round"/>
            <line x1="5" y1="90" x2="95" y2="90" stroke="#111" stroke-width="10" stroke-linecap="round"/>
        </svg>
    </button>

    <div style="height: 90vh;overflow-y: scroll;overflow-x: hidden;display: {sidebarActive?'block':'none'}">
        <br/>
        <h1 style="
        text-anchor: middle;
        left:45%;
        justify-content: center;
        position: relative;
        text-align: center;
        top: 1vh;padding: 0;display: inline;
         line-height: 0">Boards</h1>


    <BoardBrowser visible={sidebarActive}
          on:loaded={
              (e)=>{
                activeBoard=XmlToBoard(e.detail.board_data);
                complete=false;
                activeBoardId= e.detail.board_id;
              }
          } bind:this={board_list}/>
    {#if user}
    <hr style:position="relative" style:top="3vh"/>
    <h1 style="
        text-anchor: middle;
        left:45%;
        justify-content: center;
        position: relative;
        text-align: center;
        top: 3vh;padding: 0;display: inline;
         line-height: 0">Saves</h1>

    <SaveBrowser on:loaded={(e)=>{
        activeBoard=XmlToBoard(e.detail.board_data);
        activeBoardId= e.detail.board_id;
        loadSave(e.detail.save_data, activeBoard);
        complete = activeBoard.checkSolutionAll();
        activeBoard=activeBoard;
    }} visible={sidebarActive} bind:this={save_list} on:review={(e)=>{
        reviewedBoardId = e.detail.board_id;
        reviewDialog.showModal();
    }}/>
    {/if}
    </div>
</aside>

<div title="Hide Sidebar" on:keydown={()=>sidebarActive=false} on:click={()=>sidebarActive=false} tabindex="-1" role="button" class:overlay />


<div style="padding-left: {Device.isMobile?'2em':'4vw'}; display: flex; align-content: center; margin: auto">

<div style=""  style:pointer-events={sidebarActive?"none":"auto" } style:font-size="2vh" >
    <div>
    <label>
        Width (max 40 min 3)
        <input style:height="3vh" style:width="5vw" style:font-size="100%"  tabindex={sidebarActive?"-1":"0"} bind:value={widthToGenerate} type="number" min="3" max="40"/>
    </label>
    <label>
        Height (max 40 min 3)
        <input style:height="3vh" style:width="5vw" style:font-size="100%" tabindex={sidebarActive?"-1":"0"} bind:value={heightToGenerate} type="number" min="3" max="40"/>
    </label>

    <button style:height="3vh" style:width="8em" style:font-size="100%" style:overflow="hidden" tabindex={sidebarActive?"-1":"0"} on:click={generateNewBoard}>
        Generate
    </button>
    </div>

    <div>
        <label>
            <input style:height="2vh" style:width="2vw" style:font-size="100%" tabindex={sidebarActive?"-1":"0"} type="checkbox" bind:checked={showingHints}>
            Show hint tooltips
        </label>
    </div>
    <div style="display: flex; margin: auto;">
        <label>
            <input style:height="2vh" style:width="2vw" style:font-size="100%" tabindex={sidebarActive?"-1":"0"} type="checkbox" bind:checked={pencilMarking}>
            Input pencil marks (alt/shift/ctrl)
        </label>
    </div>

    <div>
    {#if user}
        <BoardSubmission tabNavigable={sidebarActive} board={activeBoard} on:submitted={(e)=>{
            board_list.getBoards();
            activeBoardId = (e.detail.newBoardId);
            }}/>
        <BoardSave on:saved={save_list.getBoards()} tabNavigable={sidebarActive} board={activeBoard} board_id={activeBoardId}/>
        <BoardLoad tabNavigable={sidebarActive} board_id={activeBoardId} on:loaded={(e)=>{
            loadSave(e.detail.game_data, activeBoard);
            complete = activeBoard.checkSolutionAll();
            activeBoard=activeBoard;}}/>
    {/if}
    </div>
    <div class="main">
        <KakuroBoardView tabNavigable={sidebarActive} bind:board={activeBoard}
                showTooltipHints={showingHints} bind:inputtingHints={pencilMarking} bind:complete/>
            <span> {@html complete?"You did it!":"<br/>"} </span>
    </div>



</div>

<dialog bind:this={reviewDialog}>
    <ReviewSubmission on:reviewed={board_list.getBoards()} boardId={reviewedBoardId} parentDialog={reviewDialog}></ReviewSubmission>
</dialog>
</div>



