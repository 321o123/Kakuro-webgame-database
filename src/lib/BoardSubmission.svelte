<script>
    import {boardToXml} from "./KakuroBoard.js";
    import {createEventDispatcher} from "svelte";

    let name = '';
    const dispatch = createEventDispatcher();
    export let board;
    export let tabNavigable = true;
    async function submitBoard() {
        let serialized = boardToXml(board);
        const response = await fetch('/api/save-board', {
            method: 'POST',
            body: JSON.stringify({
                user_id: sessionStorage.getItem('userId'),
                xml: serialized,
                name: name,
                token: sessionStorage.getItem('token')}),
            headers: {
                'content-type': 'application/json'
            }
        });
        if (!response.ok)
        {
            alert("BAD");
            return;
        }
        let newBoardId = (await response.json()).board_id;
        alert("OK");
        dispatch("submitted", {newBoardId: newBoardId});
    }
</script>
<div>
    <label>
        Name your board
        <input style:height="3vh" style:width="10vw" style:font-size="100%" style:overflow="hidden" tabindex={tabNavigable?"-1":"0"} bind:value={name}/>
    </label>
</div>
<div>
    <button style:height="3vh" style:width="6em" style:font-size="100%" style:overflow="hidden" style:margin-bottom="1vh" tabindex={tabNavigable?"-1":"0"} on:click={submitBoard}>
        Submit
    </button>
</div>

