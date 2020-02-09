import fs from "fs"
import { promisify } from "util"
import { CACHE_PATH } from "./config"

export const readFile = promisify(fs.readFile)
export const writeFile = promisify(fs.writeFile)
export const exists = promisify(fs.exists)
export const mkdir = promisify(fs.mkdir)
export const stat = promisify(fs.stat)

export const initCache = async () => {
    const isExists = await exists(CACHE_PATH)
    if (!isExists) {
        await mkdir(CACHE_PATH)
    }
}
