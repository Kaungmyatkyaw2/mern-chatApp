import { AvatarGroup } from "@mui/material";
import { User } from "../../types/user.types";
import UserAvatar from "./UserAvatar";

const GroupAvatar = ({
  members,
  onClick,
}: {
  members: User[];
  onClick?: any;
}) => {
  return (
    <AvatarGroup onClick={onClick} max={2} spacing={"small"}>
      {members.map((el) => (
        <UserAvatar key={el._id} user={el} height={45} width={45} />
      ))}
    </AvatarGroup>
  );
};

export default GroupAvatar;
