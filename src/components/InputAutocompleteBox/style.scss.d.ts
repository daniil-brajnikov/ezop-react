declare namespace StyleScssModule {
  export interface IStyleScss {
    editIcon: string;
    error: string;
    header: string;
    idle: string;
    main: string;
    mappings: string;
    name: string;
    nameEdit: string;
    names: string;
    rightBlock: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    success: string;
    version: string;
  }
}

declare const StyleScssModule: StyleScssModule.IStyleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StyleScssModule.IStyleScss;
};

export = StyleScssModule;
