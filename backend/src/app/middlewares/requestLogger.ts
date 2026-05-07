import type { RequestHandler } from 'express';
import { Chronos, roundNumber } from 'nhb-toolbox';
import { Stylog } from 'nhb-toolbox/stylog';
import configs from '@/configs';

/** * Logs incoming HTTP requests in a structured and readable format. */
export const requestLogger: RequestHandler = (req, res, next): void => {
	const now = new Chronos();

	const time =
		configs.NODE_ENV === 'development'
			? now.format(`ddd, mmm DD, YYYY HH:mm:ss:mss [${now.timeZoneName}]`)
			: now.formatUTC('ddd, mmm DD, YYYY HH:mm:ss:mss [GMT]');

	const method = req.method;
	const url = req.originalUrl;
	const ip = req.ip ?? 'unknown';

	const start = process.hrtime.bigint();

	res.on('finish', () => {
		const end = process.hrtime.bigint();
		const durationMs = roundNumber(Number(end - start) / 1_000_000);

		const durationColor =
			durationMs > 1000 ? Stylog.error : durationMs > 500 ? Stylog.yellow : Stylog.teal;

		const statusColor =
			res.statusCode >= 500
				? Stylog.bgYellow.whitesmoke
				: res.statusCode >= 400
					? Stylog.bgError.whitesmoke
					: res.statusCode >= 300
						? Stylog.bgCyan.whitesmoke
						: Stylog.bgTeal.whitesmoke;

		console.info(
			`🕒 ${Stylog.yellow.toANSI(time)}\n` +
				`📡 ${Stylog.cyan.bold.toANSI(method)} ${Stylog.cyan.toANSI(url)} → ` +
				`${statusColor.bold.toANSI(` ${Stylog.white.toANSI(res.statusCode ?? 500)} `)} ` +
				`🌍 IP: ${Stylog.gray.toANSI(ip)} → ` +
				`⏱️ ${durationColor.toANSI(durationMs + 'ms')}`
		);
	});

	next();
};
