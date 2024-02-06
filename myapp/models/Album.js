import { Schema, model, models } from 'mongoose'

const AlbumSchema = new Schema({
    title: String,
    public_id: String,
    secure_url: String,
}, {timestamps: true})

const Album = models.albums || model('albums', AlbumSchema)

export default Album