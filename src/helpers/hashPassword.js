export const hashPassword = async function (password) {
    const salt = await bcrypt.genSaltSync(+env.SALT_WORK_FACTOR);
    const hash = await bcrypt.hashSync(password, salt);
    return hash;
}