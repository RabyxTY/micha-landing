// Загрузка изображений через ImgBB (бесплатный сервис)
// API ключ можно получить на https://api.imgbb.com/

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || ''

export async function uploadImage(file: File): Promise<string> {
  if (!IMGBB_API_KEY) {
    throw new Error('ImgBB API ключ не настроен. Добавьте VITE_IMGBB_API_KEY в .env файл.')
  }

  const formData = new FormData()
  formData.append('image', file)
  formData.append('key', IMGBB_API_KEY)

  try {
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Ошибка загрузки изображения')
    }

    const data = await response.json()
    
    if (data.success) {
      return data.data.url
    } else {
      throw new Error(data.error?.message || 'Ошибка загрузки')
    }
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Поддерживаются только JPG, PNG, GIF и WebP' }
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Максимальный размер файла — 10MB' }
  }

  return { valid: true }
}
