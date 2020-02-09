import { SCRAPBOX_PROJECT, SCRAPBOX_BLOG_TAG, ENABLE_CACHE, CACHE_PATH } from "../config"
import fetch from "node-fetch"
import { ScrapboxError, ScrapboxPage, Post, ScrapboxSearchResult } from "./types"
import { parse } from "@progfay/scrapbox-parser"
import querystring from "querystring"
import moment from "moment"
import "moment-timezone"
import crypto from "crypto"
import { readFile, writeFile, initCache, stat } from "../fsUtils"

export const getPageMeta = async (projectName: string, pageName: string) => {
    const url = `https://scrapbox.io/api/pages/${projectName}/${encodeURIComponent(pageName)}`
    let hash: string = ""
    let cachePath: string = ""
    if (ENABLE_CACHE) {
        hash = crypto
            .createHash("sha256")
            .update(url)
            .digest("hex")
        cachePath = `${CACHE_PATH}/${hash}`
        try {
            const statOf = await stat(cachePath)
            if (1 <= moment(statOf.birthtime).diff(1, "days")) {
                const body = await readFile(cachePath)
                return JSON.parse(body.toString()) as ScrapboxPage
            }
        } catch (error) {}
    }
    const res = await fetch(url)
    if (res.status !== 200) {
        const body: ScrapboxError = await res.json()
        if (body.statusCode === 404) {
            return null
        } else {
            throw new Error(body.statusCode.toString())
        }
    }
    const body: ScrapboxPage = await res.json()
    if (ENABLE_CACHE) {
        try {
            await initCache()
            await writeFile(cachePath, JSON.stringify(body))
            console.log(cachePath, "cache generated")
        } catch (error) {}
    }
    return body
}

export const getPost = async (slug: string) => {
    const meta = await getPageMeta(SCRAPBOX_PROJECT, slug)
    if (meta === null) {
        return null
    }
    const text = meta.lines.map(line => line.text).join(" \n")
    if (!text.includes(SCRAPBOX_BLOG_TAG)) {
        return null
    }
    const parsed = parse(text)
    const tags = meta.links.filter(link => text.includes(`#${link}`)).filter(tag => tag.toLowerCase() !== "blog")
    const data: Post = {
        title: meta.title,
        description: meta.descriptions.join(" "),
        image: meta.image,
        content: parsed,
        user: meta.user,
        tags,
        createdAt: moment(meta.created * 1000)
            .tz("Asia/Tokyo")
            .format(),
        updatedAt: moment(meta.updated * 1000)
            .tz("Asia/Tokyo")
            .format(),
    }
    return data
}

export const getPostsMaster = async (skip: number, limit: number, sort: "updated", q: string) => {
    const cachePath = `${CACHE_PATH}/master`
    if (ENABLE_CACHE) {
        try {
            const statOf = await stat(cachePath)
            if (1 <= moment(statOf.birthtime).diff(1, "days")) {
                const body = await readFile(cachePath)
                return JSON.parse(body.toString()) as ScrapboxSearchResult
            }
        } catch (error) {}
    }
    const qs = querystring.stringify({
        skip,
        limit,
        sort,
        q,
    })

    let url: string = `https://scrapbox.io/api/pages/${SCRAPBOX_PROJECT}/search/query?${qs}`

    const res = await fetch(url)
    if (res.status !== 200) {
        const body: ScrapboxError = await res.json()
        throw new Error(res.status.toString())
    }
    const body: ScrapboxSearchResult = await res.json()
    if (ENABLE_CACHE) {
        try {
            await initCache()
            await writeFile(cachePath, JSON.stringify(body))
            console.log(cachePath, "cache generated")
        } catch (error) {}
    }
    return body
}

export const getPosts = async (query: string, page: number = 0, limit: number = 10) => {
    // 現時点で skip が無視されてしまうので擬似的な　skip の実装
    if (100 < page * limit) {
        return []
    }
    const body = await getPostsMaster(0, 100, "updated", query)

    if (body.count < page * limit) {
        return []
    }

    return body.pages.slice(page * limit, page * limit + limit).map(page => {
        const tags =
            page.snipet.length !== 0
                ? page.snipet[0]
                      .replace(/\<(\/|).+?\>/g, "")
                      .replace(/#/g, "")
                      .split(" ")
                      .filter(tag => tag.toLowerCase() !== "blog")
                : []
        const p: Omit<Post, "content"> = {
            title: page.title,
            description: page.descriptions.join(" ").slice(0, 100),
            image: page.image,
            user: page.user,
            tags,
            createdAt: moment(page.created * 1000)
                .tz("Asia/Tokyo")
                .format(),
            updatedAt: moment(page.updated * 1000)
                .tz("Asia/Tokyo")
                .format(),
        }
        return p
    })
}
