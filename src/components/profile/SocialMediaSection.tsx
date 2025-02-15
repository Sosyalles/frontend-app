import React from 'react';
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook } from 'react-icons/fa';

interface SocialMediaSectionProps {
  socialLinks: {
    instagramUsername: string | null;
    twitterUsername: string | null;
    linkedInProfile: string | null;
    facebookProfile: string | null;
  };
  onChange: (name: string, value: string | null) => void;
}

const socialMediaConfig = [
  {
    name: 'instagramUsername',
    label: 'Instagram',
    icon: <FaInstagram />,
    color: 'text-pink-500',
    value: (links: SocialMediaSectionProps['socialLinks']) => links.instagramUsername
  },
  {
    name: 'twitterUsername',
    label: 'Twitter',
    icon: <FaTwitter />,
    color: 'text-blue-400',
    value: (links: SocialMediaSectionProps['socialLinks']) => links.twitterUsername
  },
  {
    name: 'linkedInProfile',
    label: 'LinkedIn',
    icon: <FaLinkedin />,
    color: 'text-blue-600',
    value: (links: SocialMediaSectionProps['socialLinks']) => links.linkedInProfile
  },
  {
    name: 'facebookProfile',
    label: 'Facebook',
    icon: <FaFacebook />,
    color: 'text-blue-500',
    value: (links: SocialMediaSectionProps['socialLinks']) => links.facebookProfile
  }
];

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({ socialLinks, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Social Media Links</h3>
      <div className="grid grid-cols-1 gap-4">
        {socialMediaConfig.map((platform) => (
          <div key={platform.name} className="flex items-center space-x-4">
            <div className={`text-xl ${platform.color}`}>{platform.icon}</div>
            <div className="flex-grow">
              <input
                type="text"
                placeholder={`${platform.label} username`}
                value={platform.value(socialLinks) || ''}
                onChange={(e) => onChange(platform.name, e.target.value || null)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaSection; 