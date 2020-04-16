const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const id = uuid();
  const newProject = {id, title, url, techs, likes: 0 }
  repositories.push(newProject);

  return response.json(newProject);
});


app.put("/repositories/:id", (request, response) => {

  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex( repo => repo.id === id );
  
  if(repositoryIndex < 0){
    return response.status(400).json({ error: "Project not found." })
  }
  
  const { likes } = repositories.find( repo => repo.id === id );

  const newRepository = {id, title, url, techs, likes};

  repositories[repositoryIndex] = newRepository;

  return response.json(newRepository);

});


app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repo => repo.id === id );

  if(repositoryIndex < 0){
    return response.status(400).json({ error: "Project not found." });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});



app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);
  const repository = repositories.find(repo => repo.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({ error: "Project not found." });
  }

  repository.likes = repository.likes + 1;

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});


module.exports = app;
