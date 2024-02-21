import { useSelector } from "react-redux";
import { getUser } from "../store/slices/auth.slice";
import { Conversation } from "../types/conversations.types";
import { User } from "../types/user.types";

const useGetMember = (
  conversation: Conversation | undefined
): User | undefined => {
  const user = useSelector(getUser);

  if (conversation) {
    const otherUser = !conversation.isGroup
      ? conversation.members.find((el) => el._id !== user?._id)
      : undefined;

    return otherUser;
  }

  return undefined;
};

export default useGetMember;
