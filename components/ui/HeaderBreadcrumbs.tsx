import React from "react"
import isString from "lodash/isString"
// next
import Link from "next/link"
// components
import Breadcrumbs from "./Breadcrumbs"

// ----------------------------------------------------------------------

interface HeaderBreadcrumbsProps {
  links?: {
    href?: string
    icon?: React.ReactNode
    name: string
  }[]
  action?: React.ReactNode
  heading: string
  moreLink?: string | string[]
}

export default function HeaderBreadcrumbs({
  links,
  action,
  heading,
  moreLink = "" || [],
  ...other
}: HeaderBreadcrumbsProps) {
  return (
    <div className='mb-5'>
      <div className='flex items-center '>
        <div className='grow'>
          <h4 className='mb-2 text-2xl font-bold'>{heading}</h4>
          {links && <Breadcrumbs links={links} {...other} />}
        </div>

        {action && <div className='shrink-0'>{action}</div>}
      </div>

      <div className='mt-1'>
        {isString(moreLink) ? (
          <Link href={moreLink} target='_blank'>
            <h2 className='text-sm'>{moreLink}</h2>
          </Link>
        ) : (
          moreLink.map(href => (
            <Link key={href} href={href} className='text-sm' target='_blank'>
              {href}
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
