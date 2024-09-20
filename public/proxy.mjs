// public/dim/reloadmodule.mjs
import fetch from 'node-fetch';
export default async function handler(req, res) {
    const url= req.url.split('?')[1];
    console.log('proxy',url)
    const response = await fetch(url);
    const html = await response.text(); // HTML string
    res.setHeader('Content-type','text/html')
    res.end(html);
}