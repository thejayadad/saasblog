'use server'
import path from 'path'
import fs from 'fs/promises'
import { v4 as uuidv4 } from 'uuid';
import os from 'os'
import cloudinary from 'cloudinary'
import Album from '@/models/Album';
import { revalidatePath } from 'next/cache';
import connectDB from './database';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
  });

async function savePhotosToLocal(formData){
    const files = formData.getAll('files')
    const titles = formData.getAll('title')
    console.log("title " + titles)
    console.log(files)
    const multipleBuffersPromise = files.map((file, index) => ( // Add index parameter
        file.arrayBuffer()
            .then(data => {
                const buffer = Buffer.from(data)
                const name = uuidv4()
                const ext = file.type.split("/")[1]
                const title = titles[index]; 
                // console.log({name, ext})
                // const uploadDir = path.join(process.cwd(), "public", `/${name}.${ext}`)
                const tempdir = os.tmpdir();
                const uploadDir = path.join(tempdir, `/${name}.${ext}`) 
        
                fs.writeFile(uploadDir, buffer)
        
                return { filepath: uploadDir, filename: file.name, title: title };

            })
    ))
    return await Promise.all(multipleBuffersPromise)

}
async function uploadPhotosToCloudinary(newFiles){
    const multiplePhotosPromise = newFiles.map(file => (
        cloudinary.v2.uploader.upload(file.filepath)
      ))
    
      return await Promise.all(multiplePhotosPromise)

}



export async function uploadPhoto(formData){
    connectDB()
    try {
        const newFiles = await savePhotosToLocal(formData)
        const photos = await uploadPhotosToCloudinary(newFiles)
        const titles = formData.getAll('title')
        newFiles.map(file => fs.unlink(file.filepath))

        const newAlbums = photos.map((photo, index) => { // Add index parameter
            const newAlbum = new Album({
                public_id: photo.public_id, secure_url: photo.secure_url, 
                title: newFiles[index].title // Use title from corresponding file
            });
            console.log("photo title " + newFiles[index].title);

            return newAlbum;
        });
        await Album.insertMany(newAlbums)

        revalidatePath("/")
        return { msg: 'Upload Success!' }
    } catch (error) {
        console.log("Error " + error)
        return {errMsg: error.message}
    }
}