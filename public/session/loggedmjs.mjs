// public/dim/modulo.mjs
export default async function handler(req, res) {
    const { params } = req;
    res.setHeader('Content-Type', 'text/html')
    res.end(`
        <link rel="stylesheet" href="https://alzira.alapont.com/labs/componentesweb/weblin/css/metro.css">
        <article><h1>LOGGED?</h1>Session: ${JSON.stringify(req.session)}
        ${JSON.stringify(req.session)=='{}'?'<hr>NOT LOGGED!':'<hr><a href="/session/logout" role="button">logout</a>'}        
        <hr><a href="/" role="button">volver</a>
    `);
    /*
    // OR render JSON:
    res.type('application/json')
    res.send({ message: `...Hello from .mjs file with params: ${params['*'].split('/').slice(1)}` });
    */ 
}