import session from '../../sessions.mjs';
import fs from 'fs';

export default async function handler(req, res) {
	console.log('inlogout')
	await session(req, res);  // Asegúrate de invocar el middleware de sesión para cargar la sesión existente
	console.log(JSON.stringify(req.session))

    // Asegúrate de que destroy exista en la sesión
    if (req.session && JSON.stringify(req.session)!='{}') {
		let fname= req.session.id;
        req.session=null;
		fs.unlink(fname+'.json',()=>{});

		// Redirige solo después de que la sesión haya sido destruida
		res.writeHead(302, { Location: '/session/logged' });
		res.end();
		console.log('Logout successful');
    } else {
        // Manejar si no hay sesión que destruir
        res.writeHead(302, { Location: '/' });
        res.end();
        console.log('No session to destroy',req.session);
    }
}

/*export default async function handler(req, res) {
	req.session.destroy(err=>{
		console.log('LOGOUT!')
		if (err) {
            res.statusCode=500
			res.end({ error: 'Logout failed' });
            return;
        }
		res.redirect('/');
        res.end({ message: 'Logout successful' });
	})
	res.redirect('/');
}
*/


	/*
async function handler(ctx) {
	// codigo GET de /session
	console.log(' sess',ctx.sessions)
	const token = ctx.req.headers.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
	const receivedToken= ctx.req.headers['authorization']?.split(' ')[1] || token;
	const users=  Object.entries(ctx.sessions).find(r=>r[1]==receivedToken)
	let user;
	if (users) user= users[0];
	if (user) {
		console.log(' logout user ',user)
		delete ctx.sessions[user];
		console.log(ctx.sessions)
		console.log('Sesion cerrada correctamente');	
		ctx.headers['Content-Type'] = 'text/html';
		ctx.body=('Sesion cerrada correctamente');
		return		
	}
	ctx.headers['Content-Type'] = 'text/html';
	console.log('Usuario sin sesion');
	ctx.body=('Usuario sin sesion');
	return
}

module.exports= handler;*/