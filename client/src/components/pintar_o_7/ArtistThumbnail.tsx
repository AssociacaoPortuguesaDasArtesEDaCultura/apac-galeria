import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { Seller } from '../../types/user';

type ArtistThumbnailProps = {
    artist: Seller;
};

export default function ArtistThumbnail(props: ArtistThumbnailProps) {
    const seller: Seller = props.artist;
    const names = seller.name.split(' ');

    const otherNames = names.slice(0, -1).join(' ');

    return (
        <div>
            <Typography variant="subtitle1">{otherNames}</Typography>
            <Typography variant="h2" fontWeight="bold">
                {names.at(-1)}
            </Typography>
            <Link to={`/artists/${seller.id}`} state={seller}>
                <Box component="div" className="w-full aspect-square">
                    <img
                        className="w-full h-full aspect-square object-cover"
                        src={seller.profilePicture}
                    />
                </Box>
            </Link>
            <Typography sx={{ marginTop: 0 }}> {seller.about} </Typography>
        </div>
    );
}
