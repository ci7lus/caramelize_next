import { scrapboxProject, scrapboxBlogTag } from "../config"
import fetch from "node-fetch"
import { ScrapboxError, ScrapboxPage, Post, ScrapboxSearchResult } from "./types"
import { parse } from "@progfay/scrapbox-parser"
import querystring from "querystring"
import moment from "moment"
import "moment-timezone"

export const getPageMeta = async (projectName: string, pageName: string) => {
    const res = await fetch(`https://scrapbox.io/api/pages/${projectName}/${encodeURIComponent(pageName)}`)
    if (res.status !== 200) {
        const body: ScrapboxError = await res.json()
        if (body.statusCode === 404) {
            return null
        } else {
            throw new Error(body.statusCode.toString())
        }
    }
    const body: ScrapboxPage = await res.json()
    return body
}

export const getPost = async (slug: string) => {
    const meta = await getPageMeta(scrapboxProject, slug)
    if (meta === null) {
        return null
    }
    const text = meta.lines.map(line => line.text).join(" \n")
    if (!text.includes(scrapboxBlogTag)) {
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

export const getPosts = async (query: string, page: number = 0, limit: number = 10) => {
    // 現時点で skip が無視されてしまうので擬似的な　skip の実装
    if (100 < page * limit) {
        return []
    }
    const qs = querystring.stringify({
        skip: 0,
        limit: 100, // すみません
        sort: "updated",
        q: query,
    })

    let url: string = `https://scrapbox.io/api/pages/${scrapboxProject}/search/query?${qs}`

    const res = await fetch(url)
    if (res.status !== 200) {
        const body: ScrapboxError = await res.json()
        throw new Error(body.statusCode.toString())
    }
    const body: ScrapboxSearchResult = await res.json()

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
