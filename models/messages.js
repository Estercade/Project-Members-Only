const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.connectionString
});

async function createNewMessage(message, date, user_id) {
    await pool.query("INSERT INTO messages (message, date, user_id) VALUES (($1), ($2), ($3))", [message, date, user_id]);
}

async function getAllMessages() {
    const { rows } = await pool.query("SELECT messages.message, messages.id AS message_id, messages.date, users.id AS user_id, users.username FROM messages JOIN users ON messages.user_id = users.id");
    return rows;
}

async function deleteMessageById(message_id) {
    await pool.query("DELETE FROM messages WHERE id = $1", [message_id]);
}

module.exports = {
    createNewMessage,
    getAllMessages,
    deleteMessageById
}