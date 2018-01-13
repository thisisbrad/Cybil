const Item = require('../models/mongoose/Item');

async function getAll() {
  return Item.find({}).sort({ createdAt: -1 });
}

async function getOne(id) {
  return Item.findById({ _id: id }).sort({ createdAt: -1 });
}

async function create(data) {
  const item = new Item(data);
  return item.save();
}

async function update(id, data) {
  const item = await getOne(id);

  if (!item) throw new Error('Could not find the requested item');

  Object.keys(data).forEach(key => {
    item[key] = data[key];
  });

  return item.save();
}

async function remove(query) {
  const result = await Item.remove(query);
  return result.result.n;
}

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove
};
