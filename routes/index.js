const express = require("express");
const router = express.Router();
let GithubController = require("../controllers/githubAPIcontroller");


router.get("/", GithubController.getAuthKey);

router.get("/api", GithubController.tradeForAccessToken);

router.get("/api/me", GithubController.getOwnUserInfo);

router.get(
	"/api/search-repo-name/:repo_name",
	GithubController.searchRepobyName
);

router.post("/api/me/create-repo/:repo_name", GithubController.createRepo);

module.exports = router;
