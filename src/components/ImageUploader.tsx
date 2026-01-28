import { useState, useRef, useCallback } from 'react'
import { uploadImage, validateImageFile } from '../utils/imageUpload'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  className?: string
}

export function ImageUploader({ value, onChange, className = '' }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    setError(null)
    
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error || 'Неверный файл')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Симулируем прогресс
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90))
    }, 200)

    try {
      const url = await uploadImage(file)
      setUploadProgress(100)
      onChange(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки')
    } finally {
      clearInterval(progressInterval)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleRemove = () => {
    onChange('')
    setError(null)
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className={className}>
      <label className="block text-cream-300 text-sm mb-2">Изображение</label>
      
      {value ? (
        // Превью загруженного изображения
        <div className="relative">
          <div className="aspect-video bg-navy-800 overflow-hidden rounded">
            <img 
              src={value} 
              alt="Preview" 
              className="w-full h-full object-cover"
              onError={() => setError('Не удалось загрузить изображение')}
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
            title="Удалить"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        // Зона загрузки
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded cursor-pointer transition-all
            ${isDragging 
              ? 'border-terracotta-500 bg-terracotta-500/10' 
              : 'border-navy-700 hover:border-navy-600 bg-navy-800/50'
            }
            ${isUploading ? 'pointer-events-none' : ''}
          `}
        >
          <div className="p-8 text-center">
            {isUploading ? (
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto border-4 border-navy-700 border-t-terracotta-500 rounded-full animate-spin" />
                <p className="text-cream-400 text-sm">Загрузка... {uploadProgress}%</p>
                <div className="w-full h-2 bg-navy-700 rounded overflow-hidden">
                  <div 
                    className="h-full bg-terracotta-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <>
                <svg className="w-12 h-12 mx-auto mb-4 text-cream-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-cream-300 mb-2">
                  Перетащите изображение сюда
                </p>
                <p className="text-cream-500 text-sm">
                  или нажмите для выбора файла
                </p>
                <p className="text-cream-600 text-xs mt-2">
                  JPG, PNG, GIF, WebP до 10MB
                </p>
              </>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      )}

      {/* URL input как альтернатива */}
      <div className="mt-3">
        <div className="flex items-center gap-2 text-cream-500 text-xs mb-2">
          <div className="flex-1 h-px bg-navy-700" />
          <span>или вставьте ссылку</span>
          <div className="flex-1 h-px bg-navy-700" />
        </div>
        <input
          type="url"
          value={value}
          onChange={handleUrlChange}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-2 bg-navy-800 border border-navy-700 text-cream-100 text-sm focus:border-terracotta-500 focus:outline-none rounded"
        />
      </div>

      {error && (
        <p className="mt-2 text-red-400 text-sm">{error}</p>
      )}
    </div>
  )
}
