<script>
    import {createEventDispatcher} from "svelte";

    export let parentDialog;
    export let boardId;
    let scoreSelect;
    let reviewArea;
    const dispatch = createEventDispatcher();

    async function submitReview() {
        if (!scoreSelect.value)
            alert("Cannot submit a review without a score")
        let result = await fetch("/api/send-review",
            {
                method: 'POST',
                body: JSON.stringify({
                    user_id: sessionStorage.getItem('userId'),
                    board_id: boardId,
                    rating: parseInt(scoreSelect.value),
                    text: reviewArea.value,
                    token: sessionStorage.getItem('token')}),
                headers: {
                    'content-type': 'application/json'
                }
            });
        if (result.ok) {
            alert("OK");
            dispatch("reviewed");
            parentDialog.close();
        }
        else
            alert("BAD\n" + await result.text())
    }
</script>

<div>
    <select bind:this={scoreSelect}>
        <option value="">--Choose a score--</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
    </select>
</div>

<div>
    <textarea bind:this={reviewArea} style:min-width="40vh" style:min-height="10vw" placeholder="Describe yourself here..."/>
</div>

<div>
    <button on:click={submitReview}>Submit</button>
    <button on:click={()=>parentDialog.close()}>Cancel</button>
</div>