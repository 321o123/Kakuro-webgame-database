<script>
    import {boardToXmlSave} from "./KakuroBoard.js";
    import {createEventDispatcher} from "svelte";


    const dispatch = createEventDispatcher();
    export let board_id;
    export let tabNavigable = true;
    async function loadGame() {
        if (board_id===-1)
        {
            alert("Can only load games on submitted boards");
            return;
        }
        const response = await fetch('/api/load-game', {
            method: 'POST',
            body: JSON.stringify({
                user_id: sessionStorage.getItem('userId'),
                board_id: board_id,
                token: sessionStorage.getItem('token')
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
        let r_json = await response.json();

        dispatch("loaded", {game_data: r_json.save_data});

    }
</script>

<div>
    <button style:height="3vh" style:width="10em" style:font-size="100%" style:overflow="hidden" style:margin-bottom="1vh" tabindex={tabNavigable?"-1":"0"} on:click={loadGame}>
        Load game
    </button>
</div>
