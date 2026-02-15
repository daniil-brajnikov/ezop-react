declare namespace StyleScssModule {
  export interface IStyleScss {
    main: string;
    table: string;
    td: string;
    th: string;
    value: string;
  }
}

declare const StyleScssModule: StyleScssModule.IStyleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StyleScssModule.IStyleScss;
};

export = StyleScssModule;
