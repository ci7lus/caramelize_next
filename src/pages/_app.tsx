import App from "next/app"
import "../styles/global.css"
import { Header } from "../components/header"
import { Footer } from "../components/footer"

class app extends App {
    render() {
        const { Component, pageProps } = this.props
        return (
            <div className="w-full root">
                <div style={{ minHeight: "100vh" }} className="z-10 w-full flex flex-col overflow-auto">
                    <Header />
                    <div className="flex-1 bg-gray-100">
                        <Component {...pageProps} />
                    </div>
                    <Footer />
                </div>
            </div>
        )
    }
}

export default app
