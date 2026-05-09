import type { CorsOptions } from 'cors';

// const allowedOrigins = [
// 	/^http:\/\/localhost:\d+$/,
// 	/^http:\/\/127\.0\.0\.1:\d+$/,
// 	/^http:\/\/192\.168\.0\.\d+:\d+$/,
// 	/^https:\/\/nazmul-hassan-.*\.vercel\.app$/,
// 	'https://memento-notes.vercel.app',
// ];

export const corsOptions: CorsOptions = {
	// origin: (origin, callback) => {
	// 	if (
	// 		!origin ||
	// 		allowedOrigins.some((pattern) =>
	// 			isString(pattern) ? pattern === origin : pattern.test(origin)
	// 		)
	// 	) {
	// 		callback(null, true);
	// 	} else {
	// 		callback(new Error('Not Allowed by CORS!'));
	// 	}
	// },
	// // origin: '*',
	// credentials: true,

	origin: true,
	credentials: true,
};
