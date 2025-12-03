// api/load.js
export default async function handler(req, res) {
    // Check User-Agent
    const userAgent = req.headers['user-agent'] || '';

    // If browser, show 404
    if (userAgent.includes('Mozilla') && !userAgent.includes('Roblox')) {
        res.status(404).send(`<!DOCTYPE html>
<html>
<head>
<style>
body {background:#000;color:#666;text-align:center;padding:50px;}
</style>
</head>
<body>
<h1>404</h1>
<p>Page not found</p>
</body>
</html>`);
        return;
    }

    // --- PLACEHOLDER: REPLACE THIS WITH YOUR LUA SCRIPT ---
    const luaScript = `-- PLACE YOUR LUA SCRIPT HERE`;

    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(luaScript);
}
