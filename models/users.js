const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.connectionString
});

async function getAllUsers() {
    const { rows } = await pool.query("SELECT * FROM users");
    return rows;
}

async function createUser(username, fullname, password, membership) {
    await pool.query("INSERT INTO users (username, fullname, password, membership) VALUES (($1), ($2), ($3), ($4))", [username, fullname, password, membership]);
}

async function findUserByUsername(username) {
    const { rows } = await pool.query("SELECT * FROM users WHERE username = ($1)", [username]);
    return rows[0];
}

async function findUserById(user_id) {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = ($1)", [user_id]);
    return rows[0];
}

async function upgradeToMember(user_id) {
    await pool.query("UPDATE users SET membership = 'member' WHERE id = ($1)", [user_id]);
}

async function upgradeToAdmin(user_id) {
    await pool.query("UPDATE users SET membership = 'administrator' WHERE id = ($1)", [user_id]);
}

module.exports = {
    getAllUsers,
    createUser,
    findUserByUsername,
    findUserById,
    upgradeToMember,
    upgradeToAdmin
}