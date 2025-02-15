interface NotificationPreferencesSectionProps {
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyRecommendations: boolean;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function NotificationPreferencesSection({
  preferences,
  onChange
}: NotificationPreferencesSectionProps) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
        Bildirim Tercihleri
      </h3>
      <div className="space-y-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="emailNotifications"
            checked={preferences.emailNotifications}
            onChange={onChange}
            className="rounded border-gray-300 dark:border-gray-600 text-orange-500 focus:ring-orange-500 transition-colors duration-200"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            E-posta bildirimleri
          </span>
        </label>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="pushNotifications"
            checked={preferences.pushNotifications}
            onChange={onChange}
            className="rounded border-gray-300 dark:border-gray-600 text-orange-500 focus:ring-orange-500 transition-colors duration-200"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Anlık bildirimler
          </span>
        </label>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="weeklyRecommendations"
            checked={preferences.weeklyRecommendations}
            onChange={onChange}
            className="rounded border-gray-300 dark:border-gray-600 text-orange-500 focus:ring-orange-500 transition-colors duration-200"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Haftalık öneriler
          </span>
        </label>
      </div>
    </div>
  );
} 