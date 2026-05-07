import { STATUS_CODES } from 'nhb-toolbox/constants';
import type { ValidArray } from 'nhb-toolbox/types';
import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import configs from '@/configs';
import { User } from '@/modules/user/user.model';
import type { TUserRole } from '@/types';
import { verifyToken } from '@/utilities/authUtilities';
import catchAsync from '@/utilities/catchAsync';

/**
 * * Middleware to check if the user is authorized to access the route.
 * @param requiredRoles User role/roles (comma separated) required to access the route.
 */
const authorizeUser = (...requiredRoles: ValidArray<TUserRole>) => {
	return catchAsync(async (req, _res, next) => {
		const token = req.headers.authorization?.split(' ')[1];

		// * Verify and decode token
		const decoded = verifyToken(configs.accessSecret, token);

		// * Get fresh user from DB
		const user = await User.findOne({ email: decoded.email });

		if (!user) {
			throw new ErrorWithStatus(
				'Not Found Error',
				`User with email ${decoded.email} not found or has been deleted!`,
				STATUS_CODES.NOT_FOUND,
				'auth'
			);
		}

		if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
			throw new ErrorWithStatus(
				'Authorization Error',
				"You're not authorized!",
				STATUS_CODES.UNAUTHORIZED,
				'auth'
			);
		}

		req.user = decoded;

		next();
	});
};

export default authorizeUser;
