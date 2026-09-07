module.exports = {
  query: require('./pool').query,
  users: require('./users.db'),
  googleIdentities: require('./googleIdentities.db'),
  templates: require('./templates.db'),
  userCvs: require('./userCvs.db'),
  reviews: require('./reviews.db'),
  orders: require('./orders.db'),
  activityLog: require('./activityLog.db'),
};
