// public/dim/modulo.mjs
export default async function handler(req, res) {
    const { params } = req;
    //console.log(caramba)
    p.isj=123
    res.send({ message: `...Hello from .mjs file with params: ${params['*'].split('/').slice(1)}` });
}
