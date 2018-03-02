/**
 * API error code
 *
 * @typedef {string} ApiErrorCode
 * @enum {string}
 */
const ApiErrorCode = {
  internalError: 'internal_error',
  invalidInviteCode: 'invalid_invite_code',
  duplicateUserName: 'duplicate_user_name',
  emptyUserName: 'empty_user_name',
  weakPassword: 'weak_password'
};

export default ApiErrorCode;
