'use client'
import React from 'react'
import { useFormStatus } from 'react-dom'


const SubmitButton = () => {
    const { pending } = useFormStatus()

  return (
   <>
    <button type="submit" aria-disabled={pending}>
        UpLoad Photo
    </button>
   </>
  )
}

export default SubmitButton