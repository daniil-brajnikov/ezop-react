declare namespace StyleScssModule {
  export interface IStyleScss {
    accent: string;
    logo: string;
    logoText: string;
    main: string;
    mappings: string;
    names: string;
    rightBlock: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const StyleScssModule: StyleScssModule.IStyleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StyleScssModule.IStyleScss;
};

export = StyleScssModule;
