import React, { useState } from 'react'
import { createPortal } from 'react-dom'

const CustomIframe = ({
  children,
  ...props
}) => {
  const [contentRef, setContentRef] = useState(null)

  const mountNode =
    contentRef?.contentWindow?.document?.body

  return (
    <iframe {...props} ref={setContentRef} style={{ width: '100%', height: '100%' }} >
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  )
}

export default CustomIframe;