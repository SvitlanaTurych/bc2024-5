const express = require('express');
const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const program = new Command();
const multer = require ('multer');
const mmmm = multer()
program
  .requiredOption('-h, --host <host>', 'server host')
  .requiredOption('-p, --port <port>', 'server port')
  .requiredOption('-c, --cache <path>', 'cache directory');

program.parse(process.argv);
const options = program.opts();

const app = express();
app.use(express.json());


app.get('/notes/:name', (req, res) => {
  const notePath = path.join(options.cache, `${req.params.name}.txt`);
  if (!fs.existsSync(notePath)) {
    return res.status(404).send('Not found');
  }
  const noteText = fs.readFileSync(notePath, 'utf-8');
  res.send(noteText);
});

app.put('/notes/:name', (req, res) => {
  const notePath = path.join(options.cache, `${req.params.name}.txt`);
  if (!fs.existsSync(notePath)) {
    return res.status(404).send('Not found');
  }
  fs.writeFileSync(notePath, req.body.text);
  res.sendStatus(200);
});

app.delete('/notes/:name', (req, res) => {
  const notePath = path.join(options.cache, `${req.params.name}.txt`);
  if (!fs.existsSync(notePath)) {
    return res.status(404).send('Not found');
  }
  fs.unlinkSync(notePath);
  res.sendStatus(200);
});

app.get('/notes', (req, res) => {
  const files = fs.readdirSync(options.cache);
  const notes = files.map(file => {
    const name = path.basename(file);
    const text = fs.readFileSync(path.join(options.cache, file), 'utf-8');
    return { name, text };
  });
  res.status(200).json(notes);
});


app.listen(options.port, options.host, () => {
  console.log(`Server running at http://${options.host}:${options.port}/`);
});