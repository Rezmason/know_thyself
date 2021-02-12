import { exec } from "child_process";
import { writeFileSync } from "fs";

export default function({ graphPath, filenamesOnly }) {
  return {
    generateBundle(bundleOptions, bundle) {
      const moduleIds = Array.from(this.moduleIds).filter(
        moduleId => !moduleId.startsWith("\0")
      );

      const sourcePaths = [];
      const nodePaths = [];

      for (const moduleId of moduleIds) {
        if (moduleId.startsWith("/")) {
          sourcePaths.push(moduleId);
        } else {
          nodePaths.push(moduleId);
        }
      }

      const sourceDirPath = sourcePaths.reduce((dirPath, path) => {
        while (path.indexOf(dirPath) !== 0) {
          dirPath = dirPath.substring(0, dirPath.length - 1);
        }
        return dirPath;
      });

      const moduleIdsToPaths = new Map();

      for (const path of nodePaths) {
        moduleIdsToPaths.set(path, path);
      }

      for (const path of sourcePaths) {
        const name = filenamesOnly ? path.split("/").pop().split(".").shift() : path.replace(sourceDirPath, "");
        moduleIdsToPaths.set(path, name);
      }

      // const mainModuleId = Object.values(bundle).pop().facadeModuleId;
      // const mainModulePath = moduleIdsToPaths.get(mainModuleId);

      const modules = moduleIds.map(moduleId => ({
        path: moduleIdsToPaths.get(moduleId),
        dependencies: this.getModuleInfo(moduleId)
          .importedIds.map(moduleId => moduleIdsToPaths.get(moduleId))
          .filter(moduleId => moduleId != null)
      }));

      const lines = [];
      lines.push("digraph G {");
      lines.push("graph [overlap=false splines=true rankdir=LR ranksep=2 K=100];");
      lines.push("node [shape=box style=rounded];");
      lines.push("edge [weight=10 len=10];");
      for (const {path, dependencies} of modules) {
        lines.push(`${path} [label=${path}]`);
        for (const dependency of dependencies) {
          lines.push(`"${path}" -> "${dependency}"`);
        };
      }
      lines.push("}");

      const dot = lines.join("\n");
      writeFileSync(`${graphPath}.gv`, dot);

      const cmd = "dot";
      exec(
        `command -v ${cmd} && cat ${graphPath}.gv | ${cmd} -Tsvg > ${graphPath}.svg `,
        (err, stdout, stderr) => {
          if (err) {
            console.log(`Error calling ${cmd}.`);
          }
        }
      );
      // exec(`command -v gv2gml && cat ${graphPath}.gv | gv2gml -o${graphPath}.gml`, (err, stdout, stderr) => {
      //   if (err) {
      //     console.log(`Error calling ${gv2gml}.`);
      //   }
      // });
    }
  };
}
