import $ from "transform-ts"

export const scrapboxProject = $.string.transformOrThrow(process.env.SCRAPBOX_PROJECT)

export const scrapboxBlogTag = $.string.transformOrThrow(process.env.SCRAPBOX_BLOG_TAG)

export const SITE_NAME = process.env.SITE_NAME || "Caramelize"

export const SITE_AUTHOR_TWITTER_ID = process.env.SITE_AUTHOR_TWITTER_ID || null

export const SITE_ROOT = process.env.SITE_ROOT || null
