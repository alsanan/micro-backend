// public/dim/modulo.mjs
export default async function handler(req, res) {
    const { params } = req;
    res.setHeader('Content-Type','text/html')
    res.end(`
        <link rel="stylesheet" href="https://alzira.alapont.com/labs/componentesweb/weblin/css/metro.css">
        <article><h1>DELETE!</h1>...Hello from .mjs file with params: ${JSON.stringify(req.body)}`);
}