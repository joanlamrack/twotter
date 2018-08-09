const request = require("request-promise");

let client_id = process.env.client_id;
let client_secret = process.env.client_secret;

let getOptions = (url, token) => {
	return {
		url: url,
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: "application/vnd.github.nightshade-preview+json",
			"User-Agent": "Request-Promise"
		},
		json: true
	};
};

class GithubAPIController {
	constructor() {}

	static getAuthKey(req, res) {
		res.redirect(
			`https://github.com/login/oauth/authorize?scope=user%20repo&client_id=${client_id}&redirect_uri=http://localhost:3000/api`
		);
	}

	static tradeForAccessToken(req, res) {
		request
			.post({
				url: `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${
					req.query.code
				}`,
				headers: {
					accept: "application/json",
					"User-Agent": "Request-Promise"
				},
				json: true
			})
			.then(response => {
				console.log(response);
				res.status(200).json({
					token: response.access_token
				});
			})
			.catch(err => {
				res.status(400).json({
					message: err.message
				});
			});
	}

	static getOwnUserInfo(req, res) {
		console.log(req.headers)
		request(getOptions("https://api.github.com/user/repos", req.headers.token))
			.then(data => {
				res.status(200).json({
					message: "repo found",
					data: data
				});
			})
			.catch(err => {
				res.status(400).json({
					message: err
				});
			});
	}

	static searchRepobyName(req, res) {
		request(
			getOptions(
				`https://api.github.com/search/repositories?q="${req.params.repo_name}"`, req.headers.token
			)
		)
			.then(data => {
				res.status(200).json({
					message: `result for repo name with ${req.params.repo_name}`,
					data: data
				});
			})
			.catch(err => {
				res.status(400).json({
					message: err
				});
			});
	}

	static createRepo(req, res) {
		let options = getOptions("https://api.github.com/user/repos", req.headers.token);
		//add body
		options.body = { name: req.params.repo_name };
		request
			.post(options)
			.then(data => {
				res.status(201).json({
					message: "repo created",
					data: data
				});
			})
			.catch(err => {
				res.status(400).json({
					message: err
				});
			});
	}
}

module.exports = GithubAPIController;
