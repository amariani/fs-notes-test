const express = require("express");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3001;

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(cors());
app.use(express.json());
app.use(requestLogger);

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
  {
    id: 4,
    content: "My note",
    date: new Date().toISOString(),
    important: true,
  },
];

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((n) => n.id === id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "Content Missing",
    });
  }

  const newNote = {
    id: generateId(),
    content: body.content,
    important: body.important || false,
    date: new Date(),
  };
  notes = notes.concat(newNote);
  response.json(newNote);
});

app.put("/api/notes/:id", (request, response) => {
  const body = request.body;
  const id = Number(request.params.id);
  const note = notes.find((n) => n.id === id);
  if (note) {
    const modifiedNote = {
      ...note,
      important: body.important,
    };
    notes = notes.map((n) => (n.id !== id ? n : modifiedNote));
    response.json(modifiedNote);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((n) => n.id !== id);

  response.status(204).end();
});
app.use(unknownEndpoint);

app.listen(PORT);
console.log(`Server running on port ${PORT}`);
