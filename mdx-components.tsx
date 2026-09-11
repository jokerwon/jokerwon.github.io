import type { ComponentProps } from 'react'
import type { MDXComponents } from 'mdx/types'

function mergeClassName(defaultClassName: string, className?: string): string {
  return className ? `${defaultClassName} ${className}` : defaultClassName
}

const components: MDXComponents = {
  wrapper: ({ children }: ComponentProps<'div'>) => (
    <div className="mx-auto max-w-190 py-20 text-[17px] leading-[1.9] max-[700px]:py-12 [&>:first-child]:mt-0">{children}</div>
  ),
  h1: ({ className, ...props }: ComponentProps<'h1'>) => (
    <h1 {...props} className={mergeClassName('mb-12 border-b border-border pb-8 font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-title [&+h2]:mt-12 [&+h2]:border-t-0 [&+h2]:pt-0', className)} />
  ),
  h2: ({ className, ...props }: ComponentProps<'h2'>) => (
    <h2 {...props} className={mergeClassName('mt-20 mb-6 border-t border-border pt-8 font-serif text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.35] text-title', className)} />
  ),
  h3: ({ className, ...props }: ComponentProps<'h3'>) => (
    <h3 {...props} className={mergeClassName('mt-12 mb-4 font-serif text-2xl font-semibold leading-[1.45] text-title', className)} />
  ),
  h4: ({ className, ...props }: ComponentProps<'h4'>) => (
    <h4 {...props} className={mergeClassName('mt-8 mb-3 text-[1.1rem] font-semibold text-title', className)} />
  ),
  p: ({ className, ...props }: ComponentProps<'p'>) => (
    <p {...props} className={mergeClassName('my-5', className)} />
  ),
  ul: ({ className, ...props }: ComponentProps<'ul'>) => (
    <ul {...props} className={mergeClassName('my-5 list-disc pl-6', className)} />
  ),
  ol: ({ className, ...props }: ComponentProps<'ol'>) => (
    <ol {...props} className={mergeClassName('my-5 list-decimal pl-6', className)} />
  ),
  li: ({ className, ...props }: ComponentProps<'li'>) => (
    <li {...props} className={mergeClassName('my-2 pl-1', className)} />
  ),
  blockquote: ({ className, ...props }: ComponentProps<'blockquote'>) => (
    <blockquote {...props} className={mergeClassName('my-8 border-l-[3px] border-accent py-1 pl-6 text-muted', className)} />
  ),
  a: ({ className, ...props }: ComponentProps<'a'>) => (
    <a {...props} className={mergeClassName('break-words text-primary underline decoration-1 underline-offset-4 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent', className)} />
  ),
  strong: ({ className, ...props }: ComponentProps<'strong'>) => (
    <strong {...props} className={mergeClassName('font-semibold text-title', className)} />
  ),
  hr: ({ className, ...props }: ComponentProps<'hr'>) => (
    <hr {...props} className={mergeClassName('my-16 border-0 border-t border-border', className)} />
  ),
  code: ({ className, ...props }: ComponentProps<'code'>) => (
    <code {...props} className={mergeClassName('rounded-[3px] bg-surface px-[0.35em] py-[0.15em] font-mono text-[0.88em]', className)} />
  ),
  pre: ({ className, ...props }: ComponentProps<'pre'>) => (
    <pre {...props} className={mergeClassName('my-8 overflow-x-auto border border-border bg-surface p-5 leading-[1.65] [&_code]:bg-transparent [&_code]:p-0', className)} />
  ),
  table: ({ className, ...props }: ComponentProps<'table'>) => (
    <table {...props} className={mergeClassName('my-8 block w-full overflow-x-auto border-collapse text-[0.92em] [font-variant-numeric:tabular-nums]', className)} />
  ),
  th: ({ className, ...props }: ComponentProps<'th'>) => (
    <th {...props} className={mergeClassName('min-w-32 border-b border-border-strong px-4 py-3 text-left align-top font-semibold text-title', className)} />
  ),
  td: ({ className, ...props }: ComponentProps<'td'>) => (
    <td {...props} className={mergeClassName('min-w-32 border-b border-border px-4 py-3 text-left align-top', className)} />
  ),
  img: ({ className, ...props }: ComponentProps<'img'>) => (
    <img {...props} className={mergeClassName('mx-auto my-10 block h-auto max-w-full', className)} />
  ),
}

export function useMDXComponents(): MDXComponents {
  return components
}
