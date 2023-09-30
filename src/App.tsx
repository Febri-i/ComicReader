import { useState } from 'react'
import SelectFile from './SelectFile'
import ComicReader from './ComicReader'

function App() {
  const [images, setImages] = useState<string[]>([]);
  return (
    <div className='w-screen h-screen overflow-hidden bg-gray-950 flex'>

      {(!images.length) && <SelectFile readComic={(images) => setImages(images)} />}
      {images.length && <ComicReader images={images} />}
    </div>
  )
}

export default App
