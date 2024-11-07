const exprerss = require('express');
const { Command } = require('commander');
const fs = require('fs');

const app = exprerss();
const program = new Command();

program
  .requiredOption('-h, --host <host>', 'server host')
  .requiredOption('-p, --port <port>', 'server port')
  .requiredOption('-c, --cache <cache>', 'path to cache directory');

program.parse(process.argv);

const options = program.opts();

if (!fs.existsSync(options.cache)) {
  console.error(`Error: Cache directory "${options.cache}" does not exist.`);
  process.exit(1);
}
app.get('/', (req, res) => {
  res.send('Сервер працює!');
});

app.listen(options.port, options.host, () => {
  console.log(`Server running at http://${options.host}:${options.port}/`);
});