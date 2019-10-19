const urlPartKinds = [
  // 'href',
  // 'host',
  { name: 'protocol',     delimiter: '',   default: true },
  { name: 'hostname',     delimiter: '//', default: true },
  { name: 'port',         delimiter: ':',  default: false },
  { name: 'pathname',     delimiter: '/',  default: false },
  { name: 'hash',         delimiter: '',   default: false },
  { name: 'searchParams', delimiter: '&',  default: false },
  // 'password',
  // 'search',
  // 'username'
];

export default urlPartKinds;
