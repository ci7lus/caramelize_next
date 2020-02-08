import Head from "next/head"
import { useRouter } from "next/router"
import { SITE_NAME, SITE_AUTHOR_TWITTER_ID } from "../../lib/config"

export const Header = ({ title, description, amp }: { title?: string; description?: string; amp?: boolean } = {}) => {
    const router = useRouter()

    const displayTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
    const displayDescription = description ? description : `${SITE_NAME}`

    return (
        <header>
            <Head>
                <title>{displayTitle}</title>
                <meta name="og:type" content={router.pathname === "/" ? "website" : "article"} />
                <meta name="og:title" content={displayTitle} />
                <meta name="og:site_name" content={SITE_NAME} />
                {description && (
                    <>
                        <meta name="description" content={displayDescription} />
                        <meta name="og:description" content={displayDescription} />
                    </>
                )}
                {SITE_AUTHOR_TWITTER_ID && (
                    <>
                        <meta name="twitter:site" content={`@${SITE_AUTHOR_TWITTER_ID}`} />
                        <meta name="twitter:card" content="summary" />
                    </>
                )}
                {amp === true && (
                    <script
                        async
                        key="amp-timeago"
                        custom-element="amp-timeago"
                        src="https://cdn.ampproject.org/v0/amp-timeago-0.1.js"
                    />
                )}
            </Head>
        </header>
    )
}
