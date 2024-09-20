async function handler(ctx) {
	const token = ctx.req.headers.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
	const receivedToken= ctx.req.headers['authorization']?.split(' ')[1] || token;
	const users=  Object.entries(ctx.sessions).find(r=>r[1]==receivedToken)
	let user;
	if (users) user= users[0];
	if (user) {
		ctx.body= `${user}<hr>${JSON.stringify(ctx.sessions)}<hr>`
		return;
	}
	ctx.headers['Content-Type'] = 'text/html';
	console.log('Usuario sin sesion');
	ctx.body=('Usuario sin sesion');
	return
}
module.exports= handler;