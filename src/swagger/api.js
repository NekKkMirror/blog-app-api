const auth = (req, res) => {
	res.json([
		{
			version: 1,
			path: '/api/v1/auth'
		}
	]);
};

const blog = (req, res) => {
	res.json([
		{
			version: 1,
			path: '/api/v1/blog'
		}
	]);
};

module.exports = { blog, auth };
