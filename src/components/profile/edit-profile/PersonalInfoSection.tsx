interface PersonalInfoSectionProps {
  fullName: string;
  email: string;
  location: string;
  bio: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function PersonalInfoSection({
  fullName,
  email,
  location,
  bio,
  onChange
}: PersonalInfoSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Ad Soyad
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={fullName}
          onChange={onChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-orange-500 transition-colors duration-200"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          E-posta
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={onChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-orange-500 transition-colors duration-200"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Konum
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={location}
          onChange={onChange}
          placeholder="Şehir, Ülke"
          className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-orange-500 transition-colors duration-200"
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Hakkımda
        </label>
        <textarea
          id="bio"
          name="bio"
          value={bio}
          onChange={onChange}
          rows={4}
          className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-orange-500 transition-colors duration-200"
        />
      </div>
    </div>
  );
} 