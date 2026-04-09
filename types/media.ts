export interface PhotoAlbum {
  _id: string;
  title: string;
  category: string;
  photos: string[]; // Array of image URLs
  coverPhoto: string;
  createdAt: Date;
}

export interface VideoItem {
  _id: string;
  title: string;
  youtubeUrl: string;
  category: string;
  thumbnailUrl?: string;
}
