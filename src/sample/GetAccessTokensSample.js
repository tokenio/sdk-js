/**
 * Get access tokens.
 *
 * @param {Member} grantor - grantor member
 * @param {Object} granteeMemberId - member ID of the grantee
 * @return {Object} result - access token
 */
export default async (grantor, granteeMemberId) => {
    return await grantor.getActiveAccessToken(granteeMemberId);
};
