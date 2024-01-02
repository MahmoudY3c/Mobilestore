const fs = require('fs');
const path = require('path');

const controllersPath = path.join(__dirname, '../controllers/category');
const routePath = path.join(__dirname, '../routes/api');
const routeName = 'categories.js';
const routeDir = path.resolve(routePath, routeName);

const files = fs.readdirSync(controllersPath);


const createRouteTemplate = body => {
  let temp = `
const { Router } = require('express');
const router = Router();
`;

  const paths = body.map(e => ({ controllerPath: e.controllerPath, controller: e.controller }));
  paths.forEach(p => {
    const { controllerPath, controller } = p;
    temp += `const { ${controller} } = require('${controllerPath}');\n`;
  });

  temp += '\n';

  body.forEach(b => {
    const { method, route, controller } = b;
    temp += `router.${method}(\n  '${route}', \n  ${controller},\n); \n\n`;
  });

  temp += '\nmodule.exports = router;\n\n';

  return temp;
};

const keywords = [
  { checker: filename => /send|get/i.test(filename) && /byid/i.test(filename), route: '/:id', method: 'get' },
  { checker: filename => /send|get/i.test(filename), route: '/', method: 'get' },
  { checker: filename => /create/i.test(filename), route: '/', method: 'post' },
  { checker: filename => /delete/i.test(filename), route: '/', method: 'delete' },
  { checker: filename => /edit|update/i.test(filename), route: '/', method: 'put' },
];

const data = [];

files.forEach(file => {
  const { route, method } = keywords.find(e => e.checker(file)) || {};
  if (route && method) {
    const relativePath = path.relative(routePath, path.join(controllersPath, file));
    data.push({ route, method, controller: file.replace(path.extname(file), ''), controllerPath: relativePath.replace(/\\/g, '/') });
  }
});

const contents = createRouteTemplate(data);

fs.writeFileSync(routeDir, contents);
console.log(contents);


