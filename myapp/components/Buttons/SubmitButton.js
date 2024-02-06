'use client'
import React from 'react'
import { useFormStatus } from 'react-dom'


const SubmitButton = ({ value, ...props }) => {
    const { pending } = useFormStatus()

  return (
   <>
   <button 
   type='submit'
   disabled={pending} {...props}>
      { pending ? 'Loading...' : value }
    </button>
   </>
  )
}

export default SubmitButton