const db = require("../config/knex");

/**
 * Verifica si un registro existe en una tabla específica y columna específica.
 * @param {string} table - Nombre de la tabla.
 * @param {string} column - Nombre de la columna.
 * @param {any} value - Valor a verificar.
 * @returns {Promise<boolean>} - Devuelve true si existe, false en caso contrario.
 */
async function recordExists(table, column, value) {
  const record = await db(table).where(column, value).first();
  return !!record; // Retorna true si el registro existe, false en caso contrario
}

module.exports = {
  recordExists,
};
