import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PhotoAlbumIcon from "@mui/icons-material/PhotoAlbum";
import { Box } from "@mui/material";
import ProfileThumbnail from "../../components/Profile/ProfileThumbnail";
import { FirebaseAuthContext } from "../../contexts/currentAuthUserContext";
import { logOut } from "../../utils/firebase";

export default function ProfileIndex() {
  const [t] = useTranslation();
  const { user } = useContext(FirebaseAuthContext);

  return (
    <Box
      component={"div"}
      sx={{
        paddingX: {
          xs: "2rem",
          sm: "4rem",
          md: "6rem",
          lg: "8rem",
        },
        paddingY: "3rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div className="grid max-w-max max-h-max gap-2 md:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-center content-center items-center">
        {
          <Link className="inline-block" to="/profile/info">
            <ProfileThumbnail
              title={t("profile.account.title")}
              description={t("profile.account.description")}
              icon={<AccountCircleIcon />}
            />
          </Link>
        }
        {
          <Link className="inline-block" to="/profile/notifications">
            <ProfileThumbnail
              title={t("profile.notifications.title")}
              description={t("profile.notifications.text")}
              icon={<NotificationsIcon />}
            />
          </Link>
        }
        {/* CLIENT ONLY THUMBNAILS */}
        {user.role === "customer" && (
          <Link className="inline-block" to="/profile/order-history">
            <ProfileThumbnail
              title={t("profile.order_history")}
              description={t("profile.order_history_text")}
              icon={<HistoryIcon />}
            />
          </Link>
        )}
        {/* SELLER ONLY THUMBNAILS */}
        {user.role === "seller" && (
          <Link className="inline-block" to="/profile/products">
            <ProfileThumbnail
              title={t("profile.products")}
              description={t("profile.products_text")}
              icon={<PhotoAlbumIcon />}
            />
          </Link>
        )}
        {/* ADMIN ONLY THUMBNAILS */}
        {/* {user.role === admin' && ( */}
        {/*   <Link className="inline-block" to="/artists/add"> */}
        {/*     <ProfileThumbnail */}
        {/*       title={t('profile.new-seller')} */}
        {/*       description={t('profile.new-seller-text')} */}
        {/*       icon={<PersonAddIcon />} */}
        {/*     /> */}
        {/*   </Link> */}
        {/* )} */}
        {/* {tokenLevel === 'admin' && ( */}
        {/*   <Link className="inline-block" to="/dashboard"> */}
        {/*     <ProfileThumbnail */}
        {/*       title={t('profile.dashboard')} */}
        {/*       description={t('profile.dashboard_text')} */}
        {/*       icon={<DashboardIcon />} */}
        {/*     /> */}
        {/*   </Link> */}
        {/* )} */}
        {/* {tokenLevel === 'admin' && ( */}
        {/*   <Link className="inline-block" to="/requests"> */}
        {/*     <ProfileThumbnail */}
        {/*       title={t('profile.requests-2')} */}
        {/*       description={t('profile.requests-2-text')} */}
        {/*       icon={<NewReleasesIcon />} */}
        {/*     /> */}
        {/*   </Link> */}
        {/* )} */}
        <Link
          className="inline-block"
          to="/login"
          onClick={() => {
            logOut();
          }}
        >
          <ProfileThumbnail
            title={t("profile.logout")}
            description={t("profile.logout_text")}
            icon={<LogoutIcon />}
          />
        </Link>
      </div>
    </Box>
  );
}
