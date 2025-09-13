import ImageUploader from './components/ImageUploader'
import './index.css'

function App() {
  
  return (
    <div className='bg-[#1d2733] min-h-screen flex items-center justify-center p-4'>
      <div className="w-full max-w-2xl bg-[#2a3443] rounded-xl shadow-2xl p-4">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">SnapAlter</h1>
          <p className="text-gray-400 mt-2">Añade fechas a tus imágenes fácilmente</p>
        </header>
        <ImageUploader />
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>@Iberson-AndSil</p>
        </footer>
      </div>
    </div>
  )
}

export default App