import { Link } from 'react-router-dom';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

import ProfileThumbnail from '../../components/Profile/ProfileThumbnail';

export default function ProfileIndex() {
    return (
        <div className="p-8 flex items-center justify-center">
            <div className="grid max-w-max max-h-max gap-2 md:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-center content-center items-center">
                <Link className="inline-block" to="/profile/info">
                    <ProfileThumbnail
                        title="Info"
                        description="Check profile info."
                        icon={<AccountCircleIcon />}
                    />
                </Link>
                <Link className="inline-block" to="/profile/orderHistory">
                    <ProfileThumbnail
                        title="Order History"
                        description="Check your order history"
                        icon={<AccountCircleIcon />}
                    />
                </Link>
                <Link className="inline-block" to="/profile/info">
                    <ProfileThumbnail
                        title="Info"
                        description="Check profile info."
                        icon={<AccountCircleIcon />}
                    />
                </Link>
                <Link className="inline-block" to="/profile/orderHistory">
                    <ProfileThumbnail
                        title="Order History"
                        description="Check your order history"
                        icon={<AccountCircleIcon />}
                    />
                </Link>
                <Link className="inline-block" to="/profile/info">
                    <ProfileThumbnail
                        title="Info"
                        description="Check profile info."
                        icon={<AccountCircleIcon />}
                    />
                </Link>
                <Link className="inline-block" to="/login">
                    <ProfileThumbnail
                        title="Sair"
                        description="Sair da conta"
                        icon={<LogoutIcon />}
                    />
                </Link>
            </div>
        </div>
    );
}
