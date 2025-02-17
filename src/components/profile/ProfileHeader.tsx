import { UserResponseDTO } from '../../types/dtos/user.dto';

interface ProfileHeaderProps {
    user: UserResponseDTO;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
    return (
        <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                {user.profilePhoto ? (
                    <img
                        src={user.profilePhoto}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                )}
            </div>
            <div>
                <h1 className="text-2xl font-bold">{`${user.firstName} ${user.lastName}`}</h1>
                <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
            </div>
        </div>
    );
}; 