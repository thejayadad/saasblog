'use server'
import Album from "@/models/Album"
import connectDB from "./database"

export async function getAllAlbums(){
    connectDB()
    try {
        const album = await Album.find({})
        console.log("Album " + album)
        return album
    } catch (error) {
        console.log("Error " + error) 
        return { errMsg: error.message }

    }
}