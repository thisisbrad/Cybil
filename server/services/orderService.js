const Models = require('../models/sequelize');
const config = require('../config');

const log = config.logger;

let client = null;
let models = null;

async function inTransaction(work) {
  // Grab the current transaction
  const transaction = await client.transaction();

  try {
    // wait for it to finish and if it does,
    // commit the transaction
    await work(transaction);
    return transaction.commit();
  } catch (err) {
    // if the transaction fails rollback
    log.fatal(err);
    transaction.rollback();
    throw err;
  }
}

async function create(user, items, transaction) {
  const { id, email } = user;
  const order = await models.Order.create(
    {
      userId: id,
      status: 'Not Shipped',
      email
    },
    { transaction }
  );

  return Promise.all(
    items.map(async item => {
      const { sku, quantity, price, name } = item;
      const orderItem = await models.OrderItem.create({
        sku,
        quantity,
        price,
        name
      });
      return order.addOrderItem(orderItem, { transaction });
    })
  );
}

module.exports = _client => {
  models = Models(_client);
  client = _client;
  return { create, inTransaction };
};
