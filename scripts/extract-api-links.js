const fs = require('fs');
const path = require('path');
const { createFolder } = require('../handlers');

// create the output directory
createFolder(path.join(__dirname, 'out'));

const routesPath = path.join(__dirname, '../routes/api'); // Replace with your routes folder path
const baseUrl = '/api'; // Replace with your base URL
const excludeFiles = [
  'index.js',
  // 'auth.js',
];

function extractRoutes(dataDesigner) {
  let routeFiles = fs.readdirSync(routesPath);
  routeFiles = routeFiles.filter(e => !excludeFiles.includes(e));

  console.log(routeFiles);

  const routes = routeFiles.reduce((acc, file) => {
    const filePath = path.join(routesPath, file);
    const routeContent = fs.readFileSync(filePath, 'utf-8');
    const routePaths = extractRoutePaths(routeContent, file, dataDesigner);

    return [...acc, ...routePaths];
  }, []);

  const links = routes.map(route => `${dataDesigner ? '' : baseUrl}${route}`);
  return links;
}

function extractRoutePaths(content, file, dataDesigner) {
  const regex = /(app|router)\.[get|post|put|delete]+\((['"](([\w/:-]+)['"])|(\n.+?['"]([\w/:-]+)['"]))/g;
  const matches = content.replace(/\/\/.+|\/\*.+\*\//g, '').match(regex);

  if (matches) {
    return matches.map(match => {
      const method = match.match(/get|post|put|delete/)?.[0];
      if (!method) return null;
      const fileName = file.replace(path.extname(file), '');
      const routePath = match.replace(/(app|router)\.[get|post|put|delete]+\(((['"])|(\n.+?['"]))/, `/${fileName}`).replace(/'/g, '');
      return dataDesigner ? dataDesigner(routePath, method?.toUpperCase()) : `${routePath} {${method?.toUpperCase()}}`;
    }).filter(e => e);
  }

  return [];
}

// Usage
const links = extractRoutes();
const refs = extractRoutes((path, method) => `<span class="method method-${method}">${method}</span> <b>/api${path}</b>`);

const routesLog = path.join(__dirname, 'out/routes.log');
const routesHtmlLog = path.join(__dirname, 'out/routes-html.log');

fs.writeFileSync(routesLog, links.join('\n'));
fs.writeFileSync(routesHtmlLog, refs.join('\n\n- '));

console.log(refs, links);
