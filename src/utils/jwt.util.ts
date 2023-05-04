import { server } from '../dependencies/index.dependencies';

const jwt = server.jwt;

export const createJwt = ({ payload }) =>
	jwt.sign(payload, String(process.env.JWT_SECRET));

export const isValidToken = (token: string) => {
	return jwt.verify(token, String(process.env.JWT_SECRET));
};

export const attachCookieToResponse = ({ res, user, refreshToken }) => {
	const accessTokenJWT = createJwt({ payload: { user } });
	const refreshTokenJWT = createJwt({ payload: { user, refreshToken } });

	const oneDay: number = 1000 * 60 * 60 * 24;
	const longerExp: number = 1000 * 60 * 60 * 24 * 30;

	res.cookie('accessToken', accessTokenJWT, {
		httpOnly: false,
		secure: true,
		signed: true,
		expires: new Date(Date.now() + oneDay),
		sameSite: 'none'
	});

	res.cookie('refreshToken', refreshTokenJWT, {
		httpOnly: false,
		secure: true,
		signed: true,
		expires: new Date(Date.now() + longerExp),
		sameSite: 'none'
	});
};
