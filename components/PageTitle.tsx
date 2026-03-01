import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PageTitle({ children }: Props) {
  return (
    <h1 className="text-[32px] font-semibold leading-[1.15] text-gray-900 lg:text-[40px]" style={{ letterSpacing: '-0.04em' }}>
      {children}
    </h1>
  )
}
