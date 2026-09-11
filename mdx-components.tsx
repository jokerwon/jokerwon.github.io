import type { ComponentProps } from 'react'
import type { MDXComponents } from 'mdx/types'

const components: MDXComponents = {
  wrapper: ({ children }: ComponentProps<'div'>) => (
    <div className="markdown-body mx-auto max-w-210 px-10 pt-20 pb-52 max-[700px]:px-5 max-[700px]:pt-12 max-[700px]:pb-32">{children}</div>
  ),
}

export function useMDXComponents(): MDXComponents {
  return components
}
