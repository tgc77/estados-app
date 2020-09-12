const dbconfig = {
  dbconn: process.env.MONGODB_CONNECTON,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
};

module.exports = dbconfig;
