import Index from "./index"
import { getPosts } from "../../lib/scrapbox/api"
import { scrapboxBlogTag } from "../../lib/config"

export const unstable_getStaticProps = async ({ params: { slug } }: { params: { slug: string } }) => {
    let page = 0

    const parsed = parseInt(slug.replace("p", ""))
    if (!Number.isNaN(parsed) && slug.startsWith("p")) {
        page = parsed

        const posts = await getPosts(scrapboxBlogTag, page)

        return {
            props: { posts, page },
            revalidate: 10,
        }
    } else {
        return {
            props: { posts: null },
            revalidate: 10,
        }
    }
}

export default Index
