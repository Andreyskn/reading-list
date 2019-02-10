const r = require.context('../data/', false, /\.json$/);

export default r(r.keys()[0]);
