export default async function handler(req, res) {
    const logged= (req.session?.id) ?1:0;
    res.end( logged.toString() );
}