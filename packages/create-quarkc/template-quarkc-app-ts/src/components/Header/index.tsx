import { QuarkElement, Fragment, property, customElement, state,  createRef } from "quarkc";
import style from "./index.css?inline"

@customElement({ tag: "app-header", style })
export default class Header extends QuarkElement {

	@state()
	version = '1.0.0'

	@state()
	menus = [{
		name: 'home',
		link: '/'
	},{
		name: 'component',
		link: '/docs'
	}]

  componentDidMount(): void {}
  
  render() {
    return (
			<header class="header sticky">
				<div>
					<div class="container">
						<div class="left-bar">
							<a href="/">
								<img src="https://quark-design.hellobike.com/assets/quark-logo.f9a6a307.png" alt="" />
							</a>
							<span href="/">
								{ this.version }
							</span>
							<div id="docsearch"></div>
						</div>

						<div class="toper-bar">
							<div class="menu-group">
								{
									this.menus.map((item) => 
									<div class="nav-item menu">
										<a href={item.link}>
											{item.name}
										</a>
								</div>
									)
								}
							</div>
							<div class="social-links">
								<a href="https://github.com/hellof2e/quark-design/discussions" class="github-link" target="_blank">
									<svg t="1679995277175" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5433" width="200" height="200">
										<path d="M860.16 430.08c0-223.744-192-402.944-431.616-402.944C191.488 27.136 0 209.408 0 430.08c0 73.728 22.528 143.872 57.344 201.216l-41.472 140.8c-9.728 35.328 9.728 51.2 41.472 41.472l134.144-44.544c67.072 41.472 146.944 64 233.472 64 243.2 3.072 435.2-179.2 435.2-402.944z m-214.528-54.272c28.672 0 54.272 25.6 54.272 54.272s-25.6 54.272-54.272 54.272-54.272-25.6-54.272-54.272 25.6-54.272 54.272-54.272zM214.016 484.352c-28.672 0-54.272-25.6-54.272-54.272s25.6-54.272 54.272-54.272 54.272 25.6 54.272 54.272-22.016 54.272-54.272 54.272z m163.328-54.272c0-28.672 25.6-54.272 54.272-54.272s54.272 25.6 54.272 54.272-25.6 54.272-54.272 54.272-54.272-22.528-54.272-54.272z m0 0" p-id="5434"></path>
										<path d="M965.632 794.624c35.328-60.928 57.344-128 57.344-201.216 0-112.128-48.128-210.944-124.928-284.672 12.8 38.4 18.944 79.872 18.944 124.928v35.328c18.944 38.4 28.672 82.944 28.672 128 0 57.344-15.872 112.128-44.544 159.744l-18.944 28.672 9.728 35.328 15.872 54.272-51.2-15.872-35.328-12.8-31.744 18.944c-57.344 35.328-124.928 54.272-192 54.272-51.2 0-99.328-9.728-140.8-28.672H437.76c-54.272 0-108.544-9.728-156.672-25.6 79.872 79.872 192 131.072 320 131.072 86.528 0 166.4-25.6 233.472-64l143.872 48.128c28.672 9.728 44.544-6.144 35.328-35.328l-48.128-150.528z m0 0" p-id="5435"></path>
									</svg>
								</a>
								<a href="https://github.com/hellof2e/You-Dont-Need-React-Or-Vue" class="github-link" target="_blank">
									<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
								</a>
							</div>
						</div>
					</div>
				</div>
  		</header>
    );
  }
}