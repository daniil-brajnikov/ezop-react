declare namespace StyleScssModule {
  export interface IStyleScss {
    main: string;
    mappings: string;
    names: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    value: string;
    version: string;
  }
}

declare const StyleScssModule: StyleScssModule.IStyleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StyleScssModule.IStyleScss;
};

export = StyleScssModule;
