import App from "next/app"
import Link from "next/link"
import "../styles/global.css"
import { Header } from "../components/header"
import { SITE_NAME } from "../../lib/config"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart } from "@fortawesome/free-solid-svg-icons/faHeart"

class app extends App {
    render() {
        const { Component, pageProps } = this.props
        return (
            <div className="w-full root">
                <div style={{ minHeight: "100vh" }} className="z-10 w-full flex flex-col overflow-auto">
                    <Header />
                    <div className="bg-gray-900 text-gray-200">
                        <div className="container mx-auto flex justify-between max-w-screen-md">
                            <Link href="/">
                                <a>
                                    <div className="flex items-center justify-start mx-4 my-3">
                                        <img src="/caramelize.svg" width="100" />
                                    </div>
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div className="flex-1 bg-gray-800 text-gray-200">
                        <Component {...pageProps} />
                    </div>
                    <div className="bg-gray-900">
                        <div className="container mx-auto max-w-screen-md">
                            <div className="flex justify-end text-xs p-4 text-gray-200">
                                &copy; 2020 {SITE_NAME}, made with
                                <span className="pl-1">
                                    <FontAwesomeIcon icon={faHeart} />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default app
