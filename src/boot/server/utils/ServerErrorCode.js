/**
 * Server error code
 *
 * @typedef {string} ServerErrorCode
 * @enum {string}
 */
const ServerErrorCode = {
  internalError: 'internal_error',
  duplicateUserName: 'duplicate_user_name',
  invalidInviteCode: 'invalid_invite_code'
};

export default ServerErrorCode;
