// public/dim/modulo.mjs
export default async function handler(req, res) {
    const { params } = req;
    res.setHeader('Content-Type', 'text/html');
    console.log('parms',req.params)
    res.end(`
        <link rel="stylesheet" href="/cdn/pico.classless.pink.min.css">
        <article><h1>MJS</h1>...Hello from .mjs file with params: ${JSON.stringify(params)}`);
    /*
    // OR render JSON:
    res.type('application/json')
    res.send({ message: `...Hello from .mjs file with params: ${params['*'].split('/').slice(1)}` });
    */ 
}