declare namespace JSX {
  interface IntrinsicElements {
    'sv-liquid-glass': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        styles?: string
        contrast?: 'light' | 'dark' | 'light-contrast' | 'dark-contrast'
      },
      HTMLElement
    >
  }
}
