<script>
    import {objectToXml} from "./KakuroBoard.js";

    let name = '';
    export let board;
    async function submitBoard() {
        let serialized = objectToXml(board);
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
        alert("OK");
    }
</script>
<div>
    <label>
        Name your board
        <input bind:value={name}/>
    </label>
</div>
<div>
    <button on:click={submitBoard}>
        Submit
    </button>
</div>
