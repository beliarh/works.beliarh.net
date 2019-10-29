const express = require('express');
const proxy = require('http-proxy-middleware');
const Bundler = require('parcel-bundler');

const app = express();
const port = Number(process.env.PORT || 1234);

const bundler = new Bundler(['src/*.html', 'src/admin/*.html'], {
  outDir: 'public_html',
});

console.log(`Server running at http://localhost:${port}`);

app.use(
  '**/*.php',
  proxy({
    target: 'http://127.0.0.1:3000',
  })
);

app.use(bundler.middleware());

app.get('/', (req, res) => {
  res.redirect('/index.php');
});

app.get('/admin/', (req, res) => {
  const demo = req.query.demo !== undefined;

  res.redirect(`/admin/index.php${demo ? '?demo' : ''}`);
});

app.listen(port);
