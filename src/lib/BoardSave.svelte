<script>
    import {boardToXmlSave} from "./KakuroBoard.js";
    import {createEventDispatcher} from "svelte";


    const dispatch = createEventDispatcher();
    export let board;
    export let board_id;
    export let tabNavigable = true;
    async function saveBoard() {
        let serialized = boardToXmlSave(board);
        if (board_id===-1)
        {
            alert("Can only save games on submitted boards");
            return;
        }
        const response = await fetch('/api/save-game', {
            method: 'POST',
            body: JSON.stringify({
                user_id: sessionStorage.getItem('userId'),
                board_id: board_id,
                token: sessionStorage.getItem('token'),
                xml: serialized,
                }),
            headers: {
                'content-type': 'application/json'
            }
        });
        if (!response.ok)
        {
            alert("BAD\n"+await response.text());
            return;
        }
        alert("OK");
        dispatch("saved")

    }
</script>

<div>
    <button style:height="3vh" style:width="9em" style:font-size="100%" style:overflow="hidden" style:margin-bottom="1vh" tabindex={tabNavigable?"-1":"0"} on:click={saveBoard}>
        Save game
    </button>
</div>
