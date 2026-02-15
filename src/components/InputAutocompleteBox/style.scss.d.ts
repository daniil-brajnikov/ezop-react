declare namespace StyleScssModule {
  export interface IStyleScss {
    editIcon: string;
    error: string;
    header: string;
    idle: string;
    main: string;
    name: string;
    nameEdit: string;
    rightBlock: string;
    success: string;
  }
}

declare const StyleScssModule: StyleScssModule.IStyleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StyleScssModule.IStyleScss;
};

export = StyleScssModule;
