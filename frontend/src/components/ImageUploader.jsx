import { useState } from 'react'

function ImageUploader({ apiBaseUrl, onRecommendation }) {
  const [previewUrl, setPreviewUrl] = useState('')
  const [status, setStatus] = useState('Upload an image to analyze.')
  const safePreviewUrl = previewUrl.startsWith('blob:') ? previewUrl : ''

  const uploadImage = async (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setPreviewUrl(URL.createObjectURL(file))
    setStatus('Analyzing uploaded image...')

    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch(`${apiBaseUrl}/api/analyze/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      setStatus('Could not analyze image.')
      return
    }

    const data = await response.json()
    onRecommendation(data)
    setStatus('Analysis complete.')
  }

  return (
    <div className="space-y-4">
      <label className="block rounded-xl border border-dashed border-slate-300 p-6 text-center">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Choose an image file
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={uploadImage}
          className="mx-auto block text-sm"
        />
      </label>

      {safePreviewUrl ? (
        <img
          src={safePreviewUrl}
          alt="Uploaded preview"
          className="max-h-56 w-full rounded-xl object-cover"
        />
      ) : null}

      <p className="text-sm text-slate-600">{status}</p>
    </div>
  )
}

export default ImageUploader
