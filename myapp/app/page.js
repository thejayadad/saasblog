import UploadForm from "@/components/Forms/UploadForm";
import { getAllAlbums } from "@/lib/data";
import Image from "next/image";

export default async function Home() {
  const albums = await getAllAlbums()
  return (
    <main>
      <h2 className="text-center">Memory Album</h2>
      {
        albums.map((album) => (
          <div key={album.id}>
            <span>{album.title}</span>
            <Image
              src={album.secure_url}
              height={200}
              width={300}
              alt={album.title}
            />
          </div>
        ))
      }
    </main>
  );
}
