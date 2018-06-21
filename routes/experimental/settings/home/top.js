const Router = require('koa-router');
const router = new Router();
router
	.get('/', async (ctx, next) => {
		const {data, db} = ctx;
		data.type = 'top';
		const homeSettings = await db.SettingModel.findOnly({type: 'home'});
		data.ads = [];
		for(const tid of homeSettings.ads) {
			const thread = await db.ThreadModel.findOne({tid});
			if(thread) {
				await thread.extendFirstPost().then(p => p.extendUser());
				if(thread.lm) {
					await thread.extendLastPost().then(p => p.extendUser());
				} else {
					thread.firstPost = thread.lastPost;
				}
				data.ads.push(thread);
			}
		}
		ctx.template = 'experimental/settings/home.pug';
		await next();
	})
	.patch('/', async (ctx, next) => {
		const {db, body} = ctx;
		const {ads, operation} = body;
		const homeSettings = await db.SettingModel.findOnly({type: 'home'});
		if(operation === 'modifyOrder') {
			await homeSettings.update({ads});
		}
		await next();
	});
module.exports = router;
