import { Avatar, AvatarProps } from "@mui/material";
import { User } from "../../types/user.types";

interface Props extends AvatarProps {
  width?: number;
  height?: number;
  isForGroup?: boolean;
  user: User | undefined | null;
}

function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function stringAvatar(name: string, sx: Object) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      ...sx,
    },
    children: `${name.substring(0, 2)}`,
  };
}
const UserAvatar = ({ user, width = 55, height = 55, ...props }: Props) => {
  return (
    <Avatar
      {...props}
      {...stringAvatar(user?.name || "", { width, height })}
      src={user?.picture}
    />
  );
};

export default UserAvatar;
