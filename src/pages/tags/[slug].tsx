import { NextPage } from "next"
import ErrorPage from "next/error"

const RenderTag: NextPage<{}> = ({}) => {
    return <ErrorPage statusCode={404} title="Not implemented yet" />
}

export default RenderTag
