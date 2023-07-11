import { QuarkElement, customElement, state,  createRef, } from "quarkc"
import style from "./index.less?inline"

@customElement({ tag: "app-not-found", style })
class AppNotFound extends QuarkElement {
  handleGoBack = () => {
    history.go(-1)
  }

  render() {
    return (
      <>
        404 Page Not Found
        <a href="/"> Click to go back</a>
      </>
    )
  }
}