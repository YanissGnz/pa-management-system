import React from "react"
// next
import NextLink from "next/link"

function LinkItem({ link }: LinkItemProps) {
  const { href = "", name, icon } = link
  return (
    <div className='flex items-center gap-3'>
      <NextLink href={href} passHref className='hover:underline'>
        <h2 key={name} className='flex items-center text-xs leading-loose'>
          {icon && <div>{icon}</div>}
          {name}
        </h2>
      </NextLink>
      <div className='h-1 w-1 rounded-full bg-gray-600 dark:bg-gray-400' />
    </div>
  )
}

interface BreadcrumbsProps {
  activeLast?: boolean
  links: {
    href?: string
    icon?: React.ReactNode
    name: string
  }[]
}

export default function Breadcrumbs({ links, activeLast = false, ...other }: BreadcrumbsProps) {
  const currentLink = links[links.length - 1].name

  const listDefault = links.map((link) => <LinkItem key={link.name} link={link} />)

  const listActiveLast = links.map((link) => (
    <div key={link.name}>
      {link.name !== currentLink ? (
        <LinkItem link={link} />
      ) : (
        <h2 className='max-w-xs cursor-default overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-600 dark:text-gray-400'>
          {currentLink}
        </h2>
      )}
    </div>
  ))

  return (
    <nav aria-label='breadcrumb' className='m-0' {...other}>
      <ol className='flex flex-wrap items-center gap-x-3'>
        {activeLast ? listDefault : listActiveLast}
      </ol>
    </nav>
  )
}

// ----------------------------------------------------------------------

interface LinkItemProps {
  link: {
    href?: string
    icon?: React.ReactNode
    name: string
  }
}
