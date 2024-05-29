const express = require("express");
const Joi = require("joi");
const { type } = require("joi/lib/types/object");
const app = express();

app.use(express.json());

const genres = [
	{ id: 1, type: "Hip-Hop" },
	{ id: 2, type: "Amapiano" },
	{ id: 3, type: "Pop" },
	{ id: 4, type: "Gospel" },
];

//opening main page
app.get("/", (req, res) => {
	res.send("Welcome to the Homepage");
});

//GET all genres
app.get("/api/genres", (req, res) => {
	res.status(200).send(genres);
});

//GET individual genre
app.get("/api/genres/:type", (req, res) => {
	const locatedGenre = findGenre(req.params.type);
	if (!locatedGenre)
		return res
			.status(400)
			.send("Unfound Resource");

	res.status(200).send(locatedGenre);
});

//Adding new genre

app.post("/api/genres/", (req, res) => {
	const genreExists = findGenre(req.body.type);

	if (genreExists) {
		return res
			.status(400)
			.send("Genre already exists");
	}

	const { error } = validateGenre(req.body);
	if (error) {
		const { message } = error.details[0];

		return res.status(400).send(message);
	}

	const newGenre = {
		id: crypto.randomUUID(),
		type: req.body.type,
	};
	genres.push(newGenre);

	res.status(200).send(newGenre);
});

//Edit existing genre

app.put("/api/genres/:type", (req, res) => {
	const genreExists = findGenre(req.params.type);
	if (!genreExists)
		return res
			.status(400)
			.send("Unlocated Resource");

	const { error } = validateGenre(req.body);
	if (error) {
		const { message } = error.details[0];

		return res.status(400).send(message);
	}

	genreExists.type = req.body.type;
	res.send(genreExists);
});

app.delete("/api/genres/:type", (req, res) => {
	const genreExists = findGenre(req.params.type);
	if (!genreExists)
		return res
			.status(400)
			.send("Unlocated Resource");
	const genreIndex = genres.indexOf(genreExists);
	genres.splice(genreIndex, 1);
	res.send(
		`${JSON.stringify(
			genreExists.type,
		)}, has been Deleted `,
	);
});

app.listen(8080, () => {
	console.log(`Listening on port ${8080}`);
});

function validateGenre(genre) {
	const schema = {
		type: Joi.string().min(3).required(),
	};

	return Joi.validate(genre, schema);
}

function findGenre(type) {
	return genres.find(
		(c) =>
			c.type.toLowerCase() === type.toLowerCase(),
	);
}
