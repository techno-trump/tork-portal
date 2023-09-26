import webpack from "webpack-stream";
import webPackConfig from '../webpack.prod.js';

export const js = () => {
	return app.gulp.src(".", { allowEmpty: true })
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "JS",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(webpack({
			config: webPackConfig
		}))
		.pipe(app.gulp.dest(app.path.build.root));
}