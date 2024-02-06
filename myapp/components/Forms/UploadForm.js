'use client'
import React, { useState } from 'react'
import { useRef } from 'react'
import PhotoCard from '../Card/PhotoCard'
import SubmitButton from '../Buttons/SubmitButton'
import { uploadPhoto } from '@/lib/action'

const UploadForm = () => {
    const formRef = useRef()
    const [files, setFiles] = useState([]);

    async function handleInputFiles(e){
        const files = e.target.files;
        const newFiles = [...files].filter(file => {
            if(file.size < 1024*1024 && file.type.startsWith('image/')){
              return file;
            }
          })
          setFiles(prev => [...newFiles, ...prev])
        }

    async function handleDeleteFile(index){
        const newFiles = files.filter((_, i) => i !== index)
        setFiles(newFiles)
        }
    
        async function handleUpload (){
            const formData = new FormData();

            files.forEach(file => {
              formData.append('files', file)
            })

            const res = await uploadPhoto(formData)
        }

    

  return (
    <>
    <form action={handleUpload} ref={formRef}>
        <div>
            <input type='file' accept='image/*' multiple onChange={handleInputFiles}/>
            <div>
                {
                    files.map((file, index) => (
                        <PhotoCard key={index} url={URL.createObjectURL(file)} 
                        onClick={() => handleDeleteFile(index)}
                        />
                      
                    ))
                }
            </div>
        </div>
        <SubmitButton value="Upload" />
    </form>
    </>
  )
}

export default UploadForm