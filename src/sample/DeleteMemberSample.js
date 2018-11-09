/**
 * Deletes a member.
 *
 * @param {Member} member - member that will be deleted
 */

export default async member => {
    await member.deleteMember();
};
