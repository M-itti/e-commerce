module.exports = [
  {
    description: 'both username and password are missing',
    payload: { username: '', password: '' },
    expectedStatus: 400,
    expectedText: 'Username and password are required\n',
  },
  {
    description: 'username is missing',
    payload: { username: '', password: 'validPassword' },
    expectedStatus: 400,
    expectedText: 'Username and password are required\n',
  },
  {
    description: 'password is missing',
    payload: { username: 'validUsername', password: '' },
    expectedStatus: 400,
    expectedText: 'Username and password are required\n',
  },
  {
    description: 'username is null',
    payload: { username: null, password: 'validPassword' },
    expectedStatus: 400,
    expectedText: 'Username and password are required\n',
  },
  {
    description: 'password is null',
    payload: { username: 'validUsername', password: null },
    expectedStatus: 400,
    expectedText: 'Username and password are required\n',
  },
  {
    description: 'username is a number',
    payload: { username: 12345, password: 'validPassword' },
    expectedStatus: 400,
    expectedText: 'Username and password are required\n',
  },
  {
    description: 'password is a number',
    payload: { username: 'validUsername', password: 12345 },
    expectedStatus: 400,
    expectedText: 'Username and password are required\n',
  },
]
