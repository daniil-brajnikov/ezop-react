declare namespace StyleScssModule {
  export interface IStyleScss {
    apply: string;
    assistantMessage: string;
    close: string;
    composer: string;
    error: string;
    header: string;
    launcher: string;
    messages: string;
    panel: string;
    typing: string;
    userMessage: string;
    welcome: string;
    widget: string;
  }
}

declare const StyleScssModule: StyleScssModule.IStyleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StyleScssModule.IStyleScss;
};

export = StyleScssModule;
