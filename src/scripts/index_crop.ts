import * as fs from "node:fs";

fs.readdir("static/crops", ((err, versions) => {
  const indexes: string[] = [];
  for (const version of versions) {
    // check if version is a directory
    if (!fs.lstatSync(`static/crops/${version}`).isDirectory()) continue;
    const index: string[] = [];
    fs.readdirSync(`static/crops/${version}`).forEach(file => {
      index.push(file);
    });
    fs.writeFileSync(`static/crops/${version}.json`, JSON.stringify(index, null, 2));
    indexes.push(version);
  }
  fs.writeFileSync(`static/crops/versions.json`, JSON.stringify(indexes, null, 2));
}));