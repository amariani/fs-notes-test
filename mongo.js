const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://mclain:${password}@fs-phonebookcluster0.gio9v.mongodb.net/notes-db?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

// const notasToAdd = [
//   {
//     content: "Prueba",
//     date: "2021-07-19T09:55:22.480Z",
//     important: false,
//     id: 1,
//   },
//   {
//     content: "Worked",
//     date: "2021-07-19T09:56:39.525Z",
//     important: false,
//     id: 2,
//   },
//   {
//     content: "jejeje",
//     date: "2021-07-19T09:56:44.471Z",
//     important: true,
//     id: 3,
//   },
//   {
//     content: "asda",
//     date: "2021-07-19T10:30:05.646Z",
//     important: false,
//     id: 4,
//   },
//   {
//     content: "Test with service",
//     date: "2021-07-19T10:32:00.877Z",
//     important: false,
//     id: 5,
//   },
//   {
//     content: "enhanced service",
//     date: "2021-07-19T10:36:24.803Z",
//     important: false,
//     id: 6,
//   },
// ];

// const notePromises = notasToAdd.map((nota) => {
//   const noteDocument = new Note({
//     content: nota.content,
//     date: nota.date,
//     important: nota.important,
//   });

//   return noteDocument.save();
// });

// Promise.all(notePromises).then(() => {
//   console.log(`All notes (${notasToAdd.length}) were successfully saved.`);
//   mongoose.connection.close();
// });

Note.find({}).then((res) => {
  console.log(`res`, res);
  mongoose.connection.close();
});
