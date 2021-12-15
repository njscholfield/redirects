export async function onRequestPost(context) {
    const data = await context.request.json();

    const results = await Promise.all(data.map(async obj => {
        try {
            const res = await fetch(obj.testURL);
            if(res.ok) {
                return { oldURL: obj.oldURL, status: true };
            } else {
                return { oldURL: obj.oldURL, status: '' };
            }
        } catch {
            return { oldURL: obj.oldURL, status: 'ERROR' };
        }
    }));

    return new Response(JSON.stringify(results));
}