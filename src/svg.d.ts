/// <reference types="vite/client" />

// URL import (e.g., import url from './icon.svg')
declare module '*.svg' {
  const src: string
  export default src
}

// Component import (vite-plugin-svgr: import Icon from './icon.svg?component')
declare module '*.svg?component' {
  import { ComponentType } from 'preact'
  const Component: ComponentType<preact.JSX.SVGAttributes<SVGSVGElement>>
  export default Component
}
