const { exec } = require('node:child_process')
const fs = require('node:fs/promises') // For file operations
const path = require('node:path') // For handling file paths
require('dotenv').config() // Load .env variables

const apiBase = process.env.NEXT_PUBLIC_API_BASE // Retrieve NEXT_PUBLIC_API_BASE from .env

if (!apiBase) {
  console.error('Error: NEXT_PUBLIC_API_BASE is not defined in .env')
  process.exit(1)
}

const remoteUrl = `${apiBase}/openapi.json`
const outputFilePath = path.join(process.cwd(), 'types/openapi.d.ts')
console.info(`✨ Generating Typescript from: ${remoteUrl}`)
const command = `npx openapi-typescript ${remoteUrl} -o ${outputFilePath}`

exec(command, async (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing command: ${error.message}`)
    return
  }
  if (stderr) {
    console.error(`Error: ${stderr}`)
    return
  }

  console.info(stdout)

  try {
    // Read the generated file contents
    const contents = await fs.readFile(outputFilePath, 'utf8')

    // Prepend the custom comments
    const prefixedContents = `/* eslint-disable */\n/* prettier-ignore-start */\n${contents}\n/* prettier-ignore-end */`

    // Write the updated contents back to the file
    await fs.writeFile(outputFilePath, prefixedContents, 'utf8')

    console.info(`✨ Successfully updated file: ${outputFilePath}`)
  }
  catch (fileError) {
    console.error(`Error updating the file: ${fileError.message}`)
  }
})
