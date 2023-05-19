export interface UserItemInterface {
  title: string;
  rank: string;
  imageSrc: string | null;
  description: string;
}

export interface CollectionInterface {
  name: string;
  items: UserItemInterface[];
}

export interface UserInfoInterface {
  avatarSrc: string | null;
  login: string;
  _id: number;
  collections: CollectionInterface[];
}
