import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'generate:resources',
  alias: ['g:res'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      patching,
      template: { generate },
      print: { info },
    } = toolbox

    const name = parameters.first

    await generate({
      template: 'router.ts.ejs',
      target: `./src/api/${name}/router.ts`,
      props: { name },
    })

    await generate({
      template: 'controller.ts.ejs',
      target: `./src/api/${name}/${name}.controller.ts`,
      props: { name },
    })

    await generate({
      template: 'service.ts.ejs',
      target: `./src/api/${name}/${name}.service.ts`,
      props: { name },
    })

    info(`insert import directory on router.ts`)
    await patching.patch('./src/api/router.ts', {
      after: "import express from 'express';",
      insert: `\nimport ${name} from './${name}/router'`,
    })

    info(`make route /${name}`)
    await patching.patch('./src/api/router.ts', {
      after: '    private routers () {',
      insert: `\n        this.router.use('/${name}', ${name});`,
    })

    info(`Generated api resources router services controllers ${name}`)
  },
}
