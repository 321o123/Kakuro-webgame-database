export async function download_board(boardId) {
    const response = await fetch('/api/get-board?'+new URLSearchParams({
        board_id: boardId,
    }), {
        method: 'GET'
    });
    if (response.ok)
    {
        let r_json = await response.json();
        return (r_json)[0]['board_data'];
    }
    return false;
}

export async function download_save(boardId) {
    const response = await fetch('/api/load-game', {
        method: 'POST',
        body: JSON.stringify({
            user_id: sessionStorage.getItem('userId'),
            board_id: boardId,
            token: sessionStorage.getItem('token')
        }),
        headers: {
            'content-type': 'application/json'
        }
    });
    if (!response.ok)
    {
        return false;
    }
    let r_json = await response.json();

    return r_json.save_data;
}
