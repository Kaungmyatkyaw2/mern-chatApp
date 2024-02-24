import { AvatarGroup } from "@mui/material";
import { User } from "../../types/user.types";
import UserAvatar from "./UserAvatar";

const GroupAvatar = ({ members }: { members: User[] }) => {
  return (
    <AvatarGroup max={2} spacing={"small"}>
      {members.map((el) => (
        <UserAvatar key={el._id} name={el.name} height={45} width={45} />
      ))}
    </AvatarGroup>
  );
};

export default GroupAvatar;
