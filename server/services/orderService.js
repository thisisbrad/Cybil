const Models = require('../models/sequelize');

let client = null;
let models = null;

async function inTransaction(work) {
  // Grab the current transaction
  const transaction = await client.transaction();

  try {
    // wait for it to finish and if it does,
    // commit the transaction
    console.log('TRYING');
    await work(transaction);
    return transaction.commit();
  } catch (err) {
    // if the transaction fails rollback
    console.log('BUT FAILED 💔');
    console.error('ERROR:', err);
    transaction.rollback();
    throw err;
  }
}

async function create(user, items, transaction) {
  const { id, email } = user;
  const order = models.Order.create(
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
      const orderItem = models.OrderItem.create({
        sku,
        quantity,
        price,
        name
      });
      // order is coming back as a promise, not the model
      console.log('DEBUG:', order);
      return order.addOrderItem(orderItem, { transaction });
    })
  );
}

module.exports = _client => {
  models = Models(_client);
  client = _client;
  return { create, inTransaction };
};
