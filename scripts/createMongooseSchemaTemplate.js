const fs = require('fs');
const path = require('path');

const routesPath = path.join(__dirname, 'routes/apiRoutes'); // Replace with your routes folder path
const baseUrl = 'http://localhost/api'; // Replace with your base URL

function extractRoutes(dataDesigner) {
  const routeFiles = fs.readdirSync(routesPath);

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
  const regex = /router\.[get|post|put|delete]+\(['"]([\w/:-]+)['"]/g;
  const matches = content.replace(/\/\/.+|\/\*.+\*\//g, '').match(regex);

  if (matches) {
    return matches.map(match => {
      const method = match.match(/get|post|put|delete/)[0];
      const fileName = file.replace(path.extname(file), '');
      const routePath = match.replace(/router\.[get|post|put|delete]+\(['"]/, `/${fileName}`).replace(/'/g, '');
      return dataDesigner ? dataDesigner(routePath, method.toUpperCase()) : `${routePath} {${method.toUpperCase()}}`;
    });
  }

  return [];
}

// Usage
const links = extractRoutes();
const refs = extractRoutes((path, method) => `<span class="method method-${method}">${method}</span> <b>/api${path}</b>`);
fs.writeFileSync('routes.log', links.join('\n'));
fs.writeFileSync('routes2.log', refs.join('\n\n- '));
console.log(links);
