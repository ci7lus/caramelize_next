module.exports = {
    target: "experimental-serverless-trace",
    env: {
        SCRAPBOX_PROJECT: process.env.SCRAPBOX_PROJECT,
        SCRAPBOX_BLOG_TAG: process.env.SCRAPBOX_BLOG_TAG,
        SITE_NAME: process.env.SITE_NAME,
        SITE_AUTHOR_TWITTER_ID: process.env.SITE_AUTHOR_TWITTER_ID || null,
        SITE_ROOT: process.env.SITE_ROOT || null,
    },
}
