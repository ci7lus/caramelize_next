import $ from "transform-ts"
import path from "path"

export const SCRAPBOX_PROJECT = $.string.transformOrThrow(process.env.SCRAPBOX_PROJECT)

export const SCRAPBOX_BLOG_TAG = $.string.transformOrThrow(process.env.SCRAPBOX_BLOG_TAG)

export const SITE_NAME = process.env.SITE_NAME || "Caramelize"

export const SITE_AUTHOR_TWITTER_ID = process.env.SITE_AUTHOR_TWITTER_ID || null

export const SITE_ROOT = process.env.SITE_ROOT || null

export const ENABLE_CACHE = process.env.ENABLE_CACHE === "true"

export const CACHE_PATH = path.resolve(".cache")
