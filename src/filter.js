'use strict';
//Filesystem module 
const fs = require('fs');
//Fetch module
const fetch = require('node-fetch');
//Readline module
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});
//Gets the user's URL and validates it
const filterfy = readline.question(`Please insert the full URL of the desired repository: `, (repo) => {
	let inputURL = repo.substr(0, 18);
	if(inputURL === `https://github.com`) {
		let validUserURL = repo.substr(19, );
		let gitRepo = `https://api.github.com/repos/${validUserURL}/issues?=page=1&per_page=100`;
	//Uses the user's URL to fetch the info from the API and turns it into a JS object array
		async function getGitInfo() {
			let gitInfo;
			let fetchResponse = await fetch(gitRepo);
			gitInfo = await fetchResponse.text();
			let makeJsonObject = JSON.parse(gitInfo);
		//Filtering the content of the array. 
			let issues = "title― body― state― number― assignee― labels― milestone\n";
			makeJsonObject.filter(function(finalData) {
			//Makes sure we get the correct data for the Assignee login and Milestone Title.
				let assigneeLogin = finalData.assignee;
				if(assigneeLogin != null && "login" in assigneeLogin) assigneeLogin = assigneeLogin.login;
				let milestoneTitle = finalData.milestone;
				if(milestoneTitle != null && "title" in milestoneTitle) milestoneTitle = milestoneTitle.title;
			//Organizes the array into readable CSV content content.
				issues += finalData.title.replace(/"/g, "'");
				issues += "―" + finalData.body.replace(/(\r\n|\n|\r)/gm, "").replace(/"/g, "'")
				issues += "―" + finalData.state;
				issues += "―" + finalData.number;
				issues += "―" + assigneeLogin;
				issues += "―" + JSON.stringify(finalData.labels); //Turns the "labels" vector into a JS string/object.
				issues += "―" + milestoneTitle;
				issues += "\n"
			});
	//If the operation was succesful, this will download the CSV file.
			fs.writeFile("../issues.csv", issues, function(err) {
				if(err) {
					return console.log(err);
				}
				console.log("Your issues have been saved!", 'You can find your file in the Filterfy folder.', 'Bye!');
			});
		}
		getGitInfo();
	}
	//In case the user's URL doesn't match the expected parameters.
	else {
		console.log('Please insert a valid URL for a GitHub repository')
	}
	readline.close();
});
filterfy;
