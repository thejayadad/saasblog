'use server'
import path from 'path'
import fs from 'fs/promises'
import { v4 as uuidv4 } from 'uuid';
import os from 'os'


async function savePhotosToLocal(formData){
    const files = formData.getAll('files')
    console.log(files)
    const multipleBuffersPromise = files.map(file => (
        file.arrayBuffer()
            .then(data => {
                const buffer = Buffer.from(data)
                const name = uuidv4()
                const ext = file.type.split("/")[1]
                // console.log({name, ext})
                // const uploadDir = path.join(process.cwd(), "public", `/${name}.${ext}`)
                const tempdir = os.tmpdir();
                const uploadDir = path.join(tempdir, `/${name}.${ext}`) // work in Vercel
        
                fs.writeFile(uploadDir, buffer)
        
                return { filepath: uploadDir, filename: file.name }

            })
    ))
}

export async function uploadPhoto(formData){
    try {
        
        const newFiles = await savePhotosToLocal(formData)
    } catch (error) {
        console.log("Error " + error)
        return {errMsg: error.message}
    }
}