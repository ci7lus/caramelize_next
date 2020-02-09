import { NextPage } from "next"
import Link from "next/link"
import ErrorPage from "next/error"
import { getPosts } from "../../lib/scrapbox/api"
import { Post } from "../../lib/scrapbox/types"
import { SCRAPBOX_BLOG_TAG } from "../../lib/config"
import { Header } from "../components/header"
import { formatString } from "../constants"
import dayjs from "dayjs"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClock } from "@fortawesome/free-solid-svg-icons/faClock"
import { faHistory } from "@fortawesome/free-solid-svg-icons/faHistory"

export const unstable_getStaticProps = async () => {
    const page = 0
    const posts = await getPosts(SCRAPBOX_BLOG_TAG)

    return {
        props: {
            posts,
            page,
        },
        revalidate: 10,
    }
}

type Props = {
    posts: Omit<Post, "content">[]
    page: number
}

const Index: NextPage<Props> = ({ posts, page }) => {
    if (!posts) {
        return <ErrorPage statusCode={404} />
    }
    return (
        <>
            <Header />
            <div className="container mx-auto w-full max-w-screen-md p-4">
                <h1 className="border-b border-l-4 border-gray-400 pl-2 py-1 font-bold">最近の投稿 ({page + 1}ページ目)</h1>
                <div className="mx-auto">
                    {posts.map((post, key) => (
                        <div className="md:max-w-full md:flex py-4 px-2" key={key}>
                            <Link href="/posts/[slug]" as={`/posts/${post.title}`}>
                                <div
                                    className="h-48 md:h-auto md:w-1/4 flex-none bg-cover text-center overflow-hidden bg-gray-600 rounded-t lg:rounded-t-none lg:rounded-l"
                                    style={{
                                        backgroundImage: post.image ? `url("${post.image}")` : "",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                ></div>
                            </Link>
                            <div className="bg-gray-700 p-4 flex flex-col justify-between leading-normal rounded-b lg:rounded-b-none lg:rounded-r md:w-3/4">
                                <div className="mb-4">
                                    <div className="pb-2">
                                        {post.tags.map((tag, tagK) => (
                                            <Link href="/tags/[slug]" as={`/tags/${tag}`} key={tagK}>
                                                <a className="inline-block bg-gray-600 p-3 py-1 text-xs font-semibold text-gray-300 mr-2 rounded">
                                                    #{tag}
                                                </a>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="text-gray-100 font-bold text-xl mb-2 truncate">
                                        <Link href="/posts/[slug]" as={`/posts/${post.title}`}>
                                            <a>{post.title}</a>
                                        </Link>
                                    </div>
                                    <p className="text-gray-200 truncate text-sm">{post.description}</p>
                                    <p className="text-gray-200 pt-2">
                                        <span className="pr-2">
                                            <FontAwesomeIcon icon={faClock} />
                                        </span>
                                        {dayjs(post.createdAt).format(formatString)}
                                        <span className="px-2">
                                            <FontAwesomeIcon icon={faHistory} />
                                        </span>
                                        {dayjs(post.updatedAt).format(formatString)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center">
                    <Link href="/[slug]" as={`p${page === 0 ? page : page - 1}`}>
                        <button
                            className={`bg-gray-600 hover:bg-gray-500 text-gray-200 font-bold py-2 px-4 rounded-l ${page ===
                                0 && "cursor-not-allowed bg-gray-500 hover:bg-gray-500"}`}
                        >
                            Prev
                        </button>
                    </Link>
                    <Link href="/[slug]" as={`p${posts.length === 0 ? page : page + 1}`}>
                        <button className={`bg-gray-600 hover:bg-gray-500 text-gray-200 font-bold py-2 px-4 rounded-r`}>
                            Next
                        </button>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Index
