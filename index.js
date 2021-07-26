require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const Note = require("./models/note");

const PORT = process.env.PORT;

app.use(express.static("build"));
app.use(express.json());

const errorHandler = (error, request, response, next) => {
  console.error("===========================================");
  console.error("Error:", JSON.stringify(error.message));
  console.error("===========================================");

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);

app.use(cors());

let notes = [];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({})
    .then((res) => {
      notes = [...res];
      response.json(res);
    })
    .catch((e) => {
      console.error(`Error: `, e);
      response.json([]);
    });
});

app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/notes", (request, response, next) => {
  const { content, important } = request.body;

  if (!content) {
    return response.status(400).json({
      error: "Content Missing",
    });
  }

  const newNote = new Note({
    content: content,
    important: important || false,
    date: new Date(),
  });

  newNote
    .save()
    .then((savedNote) => savedNote.toJSON())
    .then((savedAndFormattedNote) => response.json(savedAndFormattedNote))
    .catch((e) => next(e));
});

app.put("/api/notes/:id", (request, response, next) => {
  const body = request.body;
  const id = request.params.id;

  const modifiedNote = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(id, modifiedNote, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

app.delete("/api/notes/:id", (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(PORT);
console.log(`Server running on port ${PORT}`);
