module.exports = (req, res, next) => {
	if (!req.user || !req.isAuthenticated()) {
		res.status(400).send("Unauthorized")
		return
	}
	next()
}