const { User } = require('./model')

async function findOne(query) {
  return User.findOne(query)
}

async function save(user) {
  return new User(user).save()
}

module.exports = {
  findOne,
  save,
}
