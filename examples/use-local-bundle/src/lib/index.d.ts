import { QuarkElement } from "quarkc";
declare global {
    interface HTMLElementTagNameMap {
        "my-component": MyComponent;
    }
}
declare class MyComponent extends QuarkElement {
    count: number;
    text: string;
    add: () => void;
    componentDidMount(): void;
    render(): any;
}
export default MyComponent;
