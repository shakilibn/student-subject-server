const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const { reset } = require("nodemon");

const password = "taskShakil";

const uri =
  "mongodb+srv://taskShakil:taskShakil@cluster0.llhcr.mongodb.net/studentSubject?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("its working");
});

client.connect((err) => {
  const studentCollection = client.db("studentSubject").collection("students");
  const subjectCollection = client.db("studentSubject").collection("subjects");

  //api for add student
  app.post("/addStudent", (req, res) => {
    const studentInfo = req.body;
    studentCollection.insertOne(studentInfo).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  //api for add subject
  app.post("/addSubject", (req, res) => {
    const subjectInfo = req.body;
    subjectCollection.insertOne(subjectInfo).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  //api for get subjects
  app.get("/subjects", (req, res) => {
    subjectCollection.find().toArray((err, documents) => {
      res.send(documents);
    });
  });

  //api for student list
  app.get("/studentList", (req, res) => {
    studentCollection.find().toArray((err, documents) => {
      res.send(documents);
    });
  });

  //api for delete student from list
  app.delete("/delete", (req, res) => {
    const id = ObjectId(req.query.id);
    studentCollection.deleteOne({ _id: id }).then((result) => {
      res.send(result.deletedCount > 0);
    });
  });

  //api for filter subject wise
  app.get("/subjectList", (req, res) => {
    const subject = req.query.subject;
    studentCollection.find({ subject: subject }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  console.log("database connected");
});

app.listen(3300);
