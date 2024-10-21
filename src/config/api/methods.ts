const methodColors: Record<string, string> = {
	GET: "\x1b[32m",
	POST: "\x1b[36m",
	PUT: "\x1b[33m",
	DELETE: "\x1b[31m",
};

const colors: Record<string, string> = {
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	orange: "\x1b[36m",
	red: "\x1b[31m",
	white: "\x1b[37m",
};

export const formatMethodColor = (method: string): string => {
	const color = methodColors[method] || colors.white;
	return `${color}${method.padEnd(8)}\x1b[0m`;
};

export const formatStatusCodeColor = (statusCode: number): string => {
	const color =
		statusCode >= 200 && statusCode < 300
			? colors.green
			: statusCode >= 300 && statusCode < 400
			? colors.yellow
			: statusCode >= 400 && statusCode < 500
			? colors.orange
			: colors.red;
	return `${color}${statusCode}\x1b[0m`;
};

export const formatTimeColor = (time: any): string => {
	const timeNumber = parseInt(time, 10);
	const color =
		timeNumber < 1000
			? colors.green
			: timeNumber < 5000
			? colors.yellow
			: timeNumber < 10000
			? colors.orange
			: colors.red;
	return `${color}${time}\x1b[0m`;
};
