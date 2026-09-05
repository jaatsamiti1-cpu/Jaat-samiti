export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isVerified: boolean;
  verificationType?: 'Royal' | 'Business' | 'Elite' | 'Legend';
  membershipLevel: 'Gold Club' | 'Elite Patron' | 'Founder Board' | 'Standard';
  bio: string;
  location: string;
  followersCount: number;
  followingCount: number;
  invitesRemaining: number;
  invitesSent: Array<{ email: string; date: string; status: 'Pending' | 'Joined' }>;
  postsCount: number;
}

export interface Comment {
  id: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  isVerified: boolean;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  author: Partial<User>;
  content: string;
  media: string[]; // Carousel support
  isVideo?: boolean; // Indicates if the post contains video content
  likes: number;
  hasLiked: boolean;
  comments: Comment[];
  shareCount: number;
  timestamp: string;
  category: 'heritage' | 'general' | 'achievement' | 'business';
  location?: string;
}

export interface Business {
  id: string;
  name: string;
  ownerName: string;
  ownerAvatar: string;
  isOwnerVerified: boolean;
  category: 'Technology' | 'Real Estate' | 'Legal & Consulting' | 'Agriculture Tech' | 'Sports Mentorship' | 'Logistics & Infrastructure' | 'Finance';
  description: string;
  location: string;
  rating: number;
  contactEmail: string;
  website: string;
  logoUrl: string;
  isFeatured: boolean;
  networkSize: number;
  foundedYear: number;
}

export interface Leader {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  achievement: string;
  category: 'Sports' | 'Business' | 'Agriculture' | 'Public Service' | 'Defense';
  isVerified: boolean;
  username?: string;
  followersCount?: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isEncrypted: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'invite_accept' | 'verification_approve' | 'business_match';
  senderName: string;
  senderAvatar: string;
  message: string;
  timestamp: string;
  read: boolean;
  postId?: string;
}
