const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function checkRepositoryExists(req, res, next){
    const { id } = req.params;

    const findRepositoryIndex = repositories.findIndex( repo => repo.id === id );

    if(findRepositoryIndex < 0){
      return res.status(400).json({ error: "Project not found." })
    }

    return next();
}






app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const newProject = {id: uuid(), title, url, techs, likes: 0 }
  repositories.push(newProject);

  return response.json(newProject);
});


app.put("/repositories/:id", checkRepositoryExists, (request, response) => {

  const { id } = request.params;
  const { title, url, techs } = request.body;

  const findRepositoryIndex = repositories.findIndex( repo => repo.id === id );

  const newRepository = {id, title, url, techs, likes: repositories[findRepositoryIndex].likes};

  repositories[findRepositoryIndex] = newRepository;

  return response.json(newRepository);

});


app.delete("/repositories/:id", checkRepositoryExists, (request, response) => {
  const { id } = request.params;

  const findRepositoryIndex = repositories.findIndex( repo => repo.id === id );

  repositories.splice(findRepositoryIndex, 1);

  return response.status(204).send();
});



app.post("/repositories/:id/like", checkRepositoryExists, (request, response) => {
  const { id } = request.params;

  const findRepositoryIndex = repositories.findIndex(repo => 
    repo.id === id
  );

  repositories[findRepositoryIndex].likes++;

  return response.json(repositories[findRepositoryIndex]);
});


module.exports = app;
