import { useDropzone } from 'react-dropzone';
import { useTheme } from '../../../contexts/ThemeContext';
import { userProfileService } from '../../../services';

interface ProfilePhotosSectionProps {
  profileImages: File[];
  existingPhotoUrls?: string[];
  onImagesChange: (images: { existingUrls: string[], newFiles: File[] }) => void;
  setShowError: (error: string | null) => void;
}

export function ProfilePhotosSection({
  profileImages,
  existingPhotoUrls = [],
  onImagesChange,
  setShowError
}: ProfilePhotosSectionProps) {
  const { isDark } = useTheme();

  const onDrop = (acceptedFiles: File[]) => {
    const totalPhotosCount = profileImages.length + existingPhotoUrls.length;
    
    if (totalPhotosCount + acceptedFiles.length > 5) {
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
      onImagesChange({
        existingUrls: existingPhotoUrls,
        newFiles: [...profileImages, ...validFiles].slice(0, 5 - existingPhotoUrls.length)
      });
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
    maxFiles: 5 - (profileImages.length + existingPhotoUrls.length),
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true
  });

  const removeImage = async (index: number, isExisting: boolean = false) => {
    try {
      if (isExisting) {
        // Remove from existing photo URLs
        const photoToDelete = existingPhotoUrls[index];
        
        // Call API to delete the photo
        await userProfileService.deleteProfilePhotos([photoToDelete]);
        
        // Remove the photo from existing URLs
        const newExistingUrls = existingPhotoUrls.filter((_, i) => i !== index);
        
        // Update the parent component's state
        onImagesChange({
          existingUrls: newExistingUrls,
          newFiles: profileImages
        });
      } else {
        // Remove from local profile images
        const newProfileImages = profileImages.filter((_, i) => i !== index);
        onImagesChange({
          existingUrls: existingPhotoUrls,
          newFiles: newProfileImages
        });
      }
    } catch (error) {
      // Handle error
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Fotoğraf silinirken bir hata oluştu';
      setShowError(errorMessage);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
        Profil Fotoğrafları
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {/* Render existing photo URLs */}
        {existingPhotoUrls.map((url, index) => (
          <div key={`existing-${index}`} className="relative group overflow-hidden rounded-lg">
            <div className="relative w-full h-40 overflow-hidden">
              <img
                src={url}
                alt={`Mevcut Profil ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 origin-center"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <button
              onClick={() => removeImage(index, true)}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
              aria-label="Fotoğrafı Kaldır"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {/* Render local profile images */}
        {profileImages.map((image, index) => (
          <div key={`local-${index}`} className="relative group overflow-hidden rounded-lg">
            <div className="relative w-full h-40 overflow-hidden">
              <img
                src={URL.createObjectURL(image)}
                alt={`Profil ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 origin-center"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
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

        {/* Add new photo button */}
        {profileImages.length + existingPhotoUrls.length < 5 && (
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
              {5 - (profileImages.length + existingPhotoUrls.length)} fotoğraf daha ekleyebilirsiniz
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