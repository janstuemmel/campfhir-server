module.exports = (req, res) => {
  res.send(JSON.stringify(res.provider.get()))
};
