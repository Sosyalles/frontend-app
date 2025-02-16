import { useDropzone } from 'react-dropzone';
import { useTheme } from '../../../contexts/ThemeContext';

interface ProfilePhotosSectionProps {
  profileImages: File[];
  onImagesChange: (images: File[]) => void;
  setShowError: (error: string | null) => void;
}

export function ProfilePhotosSection({
  profileImages,
  onImagesChange,
  setShowError
}: ProfilePhotosSectionProps) {
  const { isDark } = useTheme();

  const onDrop = (acceptedFiles: File[]) => {
    if (profileImages.length + acceptedFiles.length > 5) {
      setShowError('En fazla 5 fotoğraf yükleyebilirsiniz');
      return;
    }

    // Dosya boyutu ve format kontrolü
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setShowError('Her fotoğraf en fazla 5MB boyutunda olabilir');
        return false;
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setShowError('Sadece JPG, PNG ve WEBP formatları desteklenmektedir');
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      const newImages = [...profileImages];
      validFiles.forEach(file => {
        if (newImages.length < 5) {
          newImages.push(file);
        }
      });
      onImagesChange(newImages);
      setShowError(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: 5 - profileImages.length,
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true
  });

  const removeImage = (index: number) => {
    onImagesChange(profileImages.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
        Profil Fotoğrafları
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {profileImages.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={URL.createObjectURL(image)}
              alt={`Profil ${index + 1}`}
              className="w-full h-40 object-cover rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
              aria-label="Fotoğrafı Kaldır"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {profileImages.length < 5 && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200
              ${isDragActive ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-orange-500 dark:hover:border-orange-500'}
              ${isDark ? 'dark:bg-gray-700/50' : 'bg-gray-50'}`}
          >
            <input {...getInputProps()} />
            <svg className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              {isDragActive ? 'Fotoğrafı Buraya Bırak' : 'Fotoğraf Yükle'}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {5 - profileImages.length} fotoğraf daha ekleyebilirsiniz
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Fotoğraf Yükleme Kuralları:
        </h3>
        <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <li>• En fazla 5 fotoğraf yükleyebilirsiniz</li>
          <li>• Her fotoğraf en fazla 5MB boyutunda olabilir</li>
          <li>• Desteklenen formatlar: JPG, PNG, WEBP</li>
          <li>• Önerilen boyut: 1080x1080 piksel</li>
        </ul>
      </div>
    </div>
  );
} 