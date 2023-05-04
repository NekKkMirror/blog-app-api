import { server } from '../dependencies/index.dependencies';

const statusCodes = server.statusCode;

export function checkPermission(
  requstUser,
  resourceUserId
): {
  permissionError: boolean,
  permissionStatus?: number,
  permissionMsg?: string

} {
  if (requstUser.userRole === 'admin') {
    return {
      permissionError: false
    };
  }

  if (requstUser.userId === resourceUserId.toString()) {
    return {
      permissionError: false
    };
  }

  return {
    permissionError: true,
    permissionStatus: statusCodes.FORBIDDEN,
    permissionMsg: 'Unauthorized to access this route'
  };
}

