// public/dim/reloadmodule.mjs
import { invalidateModule } from '../cache.mjs';
export async function handler(req, res) {
    const module= req.url.split('?')[1];
    console.log('in_invalidate',req.url.split('?')[1])
    const fileUrl = new URL(`file://${module}`);
    //console.log('in_invalidate2 ',req.url.split('?')[1])
    res.send('ok. invalidating '+req.url.split('?')[1])
    invalidateModule(req.url.split('?')[1]);
}
