const getAvatar = (name: string | undefined) =>
  process.env.REACT_AVATAR_API + (name || "");

export default getAvatar;
