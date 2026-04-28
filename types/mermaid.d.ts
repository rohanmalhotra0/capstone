// Local type shim for mermaid. The installed package's bundled .d.ts /
// .mjs aren't always present in this sandbox install — declare the
// surface we use so TS can compile.
declare module "mermaid" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type AnyConfig = Record<string, any>;

  export interface MermaidAPI {
    initialize(config: AnyConfig): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(id: string, txt: string, container?: any): Promise<{ svg: string; bindFunctions?: (el: Element) => void }>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parse(text: string, opts?: AnyConfig): Promise<any> | any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }

  const mermaid: MermaidAPI;
  export default mermaid;
}
