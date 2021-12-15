export async function onRequestPost(context) {
    const data = await context.request.json();

    const results = await Promise.all(data.map(async obj => {
        if(!obj.oldURL) return { oldURL: obj.oldURL, valid: false };
        try {
            const res = await fetch(obj.testURL);
            if(res.ok) {
                return { oldURL: obj.oldURL, valid: true };
            } else {
                return { oldURL: obj.oldURL, valid: false };
            }
        } catch {
            return { oldURL: obj.oldURL, valid: false };
        }
    }));

    return new Response(JSON.stringify(results));
}