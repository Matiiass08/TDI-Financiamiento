import { type ButtonHTMLAttributes } from 'react'

export function IconButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = '', ...rest } = props
  return <button className={`icon-btn ${className}`} {...rest} />
}