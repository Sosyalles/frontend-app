import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook } from 'react-icons/fa';

interface SocialMediaSectionProps {
  socialLinks: {
    instagram: string | null;
    twitter: string | null;
    linkedin: string | null;
    facebook: string | null;
  };
  onChange: (name: string, value: string | null) => void;
}

const socialMediaConfig = [
  {
    name: 'instagram',
    label: 'Instagram',
    icon: <FaInstagram />,
    color: 'text-pink-500',
    value: (links: SocialMediaSectionProps['socialLinks']) => links.instagram
  },
  {
    name: 'twitter',
    label: 'Twitter',
    icon: <FaTwitter />,
    color: 'text-blue-400',
    value: (links: SocialMediaSectionProps['socialLinks']) => links.twitter
  },
  {
    name: 'linkedin',
    label: 'LinkedIn',
    icon: <FaLinkedin />,
    color: 'text-blue-600',
    value: (links: SocialMediaSectionProps['socialLinks']) => links.linkedin
  },
  {
    name: 'facebook',
    label: 'Facebook',
    icon: <FaFacebook />,
    color: 'text-blue-500',
    value: (links: SocialMediaSectionProps['socialLinks']) => links.facebook
  }
];

export function SocialMediaSection({
  socialLinks,
  onChange
}: SocialMediaSectionProps) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
        Sosyal Medya Hesapları
      </h3>
      <div className="space-y-4">
        {socialMediaConfig.map(({ name, label, icon, color, value }) => (
          <div key={name} className="flex items-center space-x-4">
            <div className={`w-8 h-8 flex items-center justify-center ${color}`}>
              {icon}
            </div>
            <input
              type="text"
              name={name}
              value={value(socialLinks) || ''}
              onChange={(e) => onChange(name, e.target.value)}
              placeholder={`${label} profiliniz`}
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-orange-500 transition-colors duration-200"
            />
          </div>
        ))}
      </div>
    </div>
  );
} 