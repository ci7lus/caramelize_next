import React from "react"
import { NextPage } from "next"
import { getPost, getPosts } from "../../../lib/scrapbox/api"
import { Post } from "../../../lib/scrapbox/types"
import { PageType, LineNodeType } from "@progfay/scrapbox-parser"
import Link from "next/link"
import { SCRAPBOX_PROJECT, SCRAPBOX_BLOG_TAG } from "../../../lib/config"
import { Header } from "../../components/header"
import dayjs from "dayjs"
import { formatString } from "../../constants"
import ErrorPage from "next/error"

export const unstable_getStaticProps = async ({ params: { slug } }: { params: { slug: string } }) => {
    const post = await getPost(slug)
    return {
        props: {
            post,
        },
        revalidate: 10,
    }
}

type Props = {
    post: Post | null
}

const RenderPost: NextPage<Props> = ({ post }) => {
    if (!post) {
        return <ErrorPage statusCode={404} />
    }
    return (
        <>
            <Header title={post.title} />
            <div className="container mx-auto max-w-screen-md p-4">
                <h1 className="border-b border-l-4 border-gray-400 pl-2 py-1 mb-1">
                    <p className="font-bold text-xl">{post.title}</p>
                </h1>
                <p className="text-right mb-2 text-sm">
                    <span>posted at: {dayjs(post.createdAt).format(formatString)}, </span>
                    <span>updated at: {dayjs(post.updatedAt).format(formatString)}</span>
                </p>
                <div className="content leading-relaxed">{contentRender(post.content)}</div>
                <div className="flex items-center justify-center py-4">
                    <p className="mr-4">Author:</p>
                    <img className="w-10 h-10 mr-4 bg-gray-600 rounded" src={post.user.photo} />
                    <div className="text-sm">
                        <p className="text-gray-300 leading-none">{post.user.displayName}</p>
                        <p className="text-gray-500">@{post.user.name}</p>
                    </div>
                </div>
                <div className="bg-gray-700 p-1" />
                <div className="flex items-center justify-center p-4 text-center text-sm">
                    <p>
                        Generated from
                        <br />
                        <a
                            className="text-blue-500"
                            href={`https://scrapbox.io/${SCRAPBOX_PROJECT}/${post.title}`}
                            target="_blank"
                        >
                            {post.title}
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}

export const nodeRender = (node: LineNodeType, key: string | number) => {
    switch (node.type) {
        case "blank":
            return <p key={key}></p>
        case "code":
            return (
                <code key={key} className="text-sm bg-gray-700">
                    {node.text}
                </code>
            )
        case "decoration":
            const decorationTags: string[] = []
            node.decos.map(deco => {
                switch (deco) {
                    case "/":
                        decorationTags.push("italic")
                        break
                    case "-":
                        decorationTags.push("line-through")
                        break
                    default:
                        if (deco.includes("*")) {
                            decorationTags.push("font-bold")
                            const size = parseInt(deco.replace("*-", ""))
                            if (!Number.isNaN(size)) {
                                if (size === 1) {
                                } else if (2 <= size && size <= 3) {
                                    decorationTags.push("text-lg")
                                } else if (size <= 4) {
                                    decorationTags.push("text-xl")
                                } else if (size <= 5) {
                                    decorationTags.push("text-2xl")
                                } else if (size <= 6) {
                                    decorationTags.push("text-3xl")
                                } else if (size <= 7) {
                                    decorationTags.push("text-4xl")
                                } else if (size <= 8) {
                                    decorationTags.push("text-5xl")
                                } else {
                                    decorationTags.push("text-6xl")
                                }
                            }
                        }
                }
            })
            return (
                <span className={decorationTags.join(" ")} key={key}>
                    {node.nodes.map((childNode, k) => nodeRender(childNode, k))}
                </span>
            )
        case "hashTag":
            return (
                <Link key={key} href="/tags/[slug]" as={`/tags/${node.href}`}>
                    <a className="inline-block bg-gray-600 p-2 py-1 text-xs font-semibold text-gray-300 mr-2 rounded">
                        #{node.href}
                    </a>
                </Link>
            )
        case "link":
            return (
                <a className="text-blue-500" key={key} href={node.href} target="_blank">
                    {node.content.length === 0 ? node.href : node.content}
                </a>
            )
        case "icon":
            if (node.path.includes("[")) {
                return <img className="icon" key={key} />
            }
            switch (node.pathType) {
                case "relative":
                    return (
                        <img
                            className="icon"
                            src={`https://scrapbox.io/api/pages/${SCRAPBOX_PROJECT}/${encodeURIComponent(node.path)}/icon`}
                            key={key}
                        />
                    )
                case "root":
                    return <img className="icon" src={`https://scrapbox.io/api/pages${node.path}/icon`} key={key} />
                default:
                    return <img className="icon" key={key} />
            }
        case "image":
            return (
                <div key={key}>
                    <img src={node.src}></img>
                </div>
            )
        case "plain":
            return <span key={key}>{node.text}</span>
        case "quote":
            return (
                <p key={key} className="border-l-4 pl-2 border-gray-600 bg-gray-900">
                    {node.nodes.map((childNode, k) => nodeRender(childNode, k))}
                </p>
            )
        case "strong":
            return <b key={key}>{node.nodes.map((childNode, k) => nodeRender(childNode, k))}</b>
        default:
            return (
                <p className="text-gray-600 text-sm" key={key}>
                    not supported ({node!.type})
                </p>
            )
    }
}

export const contentRender = (content: PageType) => {
    return content.map((line, l) => {
        switch (line.type) {
            case "title":
                return
            case "line":
                if (line.nodes.length === 0) {
                    return <br key={`line-${l}`} />
                }
                return (
                    <div className={`pl-${line.indent * 4}`} key={`line-${l}`}>
                        {line.nodes.map((node, k) => nodeRender(node, k))}
                    </div>
                )
            default:
                break
        }
    })
}

export default RenderPost
