import { User, Post, Business, Leader, Notification } from './types';

export const currentUser: User = {
  id: 'current_user_1',
  name: 'Jaswant Jaat',
  username: 'jaswant_jaat',
  avatar: 'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?auto=format&fit=crop&w=400&h=400&q=80',
  isVerified: true,
  verificationType: 'Elite',
  membershipLevel: 'Founder Board',
  bio: 'Venture Capitalist | Apne samaj ke AgriTech aur real-estate startups ko support karne me dedicated. Haryana se roots hain, building global systems.',
  location: 'New Delhi & London',
  followersCount: 1420,
  followingCount: 382,
  invitesRemaining: 3,
  invitesSent: [
    { email: 'digvijay.ahlawat@gmail.com', date: '2026-06-15', status: 'Joined' },
    { email: 'ananya.chaudhary@outlook.com', date: '2026-07-02', status: 'Pending' },
  ],
  postsCount: 12,
};

export const mockLeaders: Leader[] = [
  {
    id: 'leader_1',
    name: 'Chaudhary Charan Singh',
    role: 'Former Prime Minister of India & Kisaan Leader',
    avatar: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&h=400&q=80', // Representative elegant portrait
    bio: 'Kisaano ke masiha aur voice of rural empowerment, jinhone land reforms se desh ko badla.',
    achievement: 'Aise agrarian policies banaye jisse Northern India ke crore-o kisaano ka socio-economic status sudhra.',
    category: 'Public Service',
    isVerified: true,
    username: 'charan_singh',
    followersCount: 8240,
  },
  {
    id: 'leader_2',
    name: 'Maharaja Surajmal',
    role: 'Bharatpur ke Legendary Monarch',
    avatar: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=400&h=400&q=80', // Historical fort theme representative
    bio: 'Jaat samaj ke Plato maane jaane waale Maharaja Surajmal, apni buddhi aur strategic military genius ke liye amar hain.',
    achievement: 'Lohagarh Fort banwaya jo kabhi jeeta nahi gaya. Britishers ki saari forces yahan haar gayi thi.',
    category: 'Defense',
    isVerified: true,
    username: 'maharajasurajmal_heritage',
    followersCount: 12500,
  },
  {
    id: 'leader_3',
    name: 'Vikram Singh Chaudhary',
    role: 'Co-Founder & Chief Architect, Ceres Robotics',
    avatar: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&w=400&h=400&q=80',
    bio: 'Stanford Alumnus. Precision farming aur automatic tractors se kisaani ko modern bana rahe hain.',
    achievement: 'Forbes 30 Under 30 (Enterprise Tech) me shamil. Autonomous agritech ke liye $45M raise kiya.',
    category: 'Business',
    isVerified: true,
    username: 'vikram_ceres',
    followersCount: 3950,
  },
  {
    id: 'leader_4',
    name: 'Anjali Tomar',
    role: 'World Wrestling Championship Gold Medalist',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&w=400&h=400&q=80',
    bio: 'Elite freestyle athlete jo apne parivarik akhada legacy ko Olympic stage tak lekar gayi hain.',
    achievement: 'Paris Elite Grand Prix me Gold jeeta aur Olympic Trials ki silver medalist hain.',
    category: 'Sports',
    isVerified: true,
    username: 'anjali_wrestler',
    followersCount: 5120,
  },
];

export const mockBusinesses: Business[] = [
  {
    id: 'biz_1',
    name: 'Lohagarh Infrastructure & Realty',
    ownerName: 'Dushyant Sheoran',
    ownerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=400&q=80',
    isOwnerVerified: true,
    category: 'Real Estate',
    description: 'Delhi NCR, Gurgaon, aur Noida me high-end residential towers aur premium commercial properties ka development.',
    location: 'Gurgaon, India',
    rating: 4.9,
    contactEmail: 'contact@lohagarhinfra.com',
    website: 'https://lohagarhinfra.com',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&h=300&q=80',
    isFeatured: true,
    networkSize: 240,
    foundedYear: 2012,
  },
  {
    id: 'biz_2',
    name: 'Kshatriya Crop Sciences',
    ownerName: 'Dr. Devendra Malik',
    ownerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80',
    isOwnerVerified: true,
    category: 'Agriculture Tech',
    description: 'Next-generation bio-organic fertilizers aur satellite-based crop monitoring systems high-yield farming ke liye.',
    location: 'Chandigarh, India',
    rating: 4.8,
    contactEmail: 'info@kshatriyacrop.com',
    website: 'https://kshatriyacrop.com',
    logoUrl: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=300&h=300&q=80',
    isFeatured: true,
    networkSize: 185,
    foundedYear: 2018,
  },
  {
    id: 'biz_3',
    name: 'Sehwag & Partners Corporate Law',
    ownerName: 'Justice (Retd.) Yashpal Sehwag',
    ownerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=400&q=80',
    isOwnerVerified: true,
    category: 'Legal & Consulting',
    description: 'Samaj ke bade businesses aur families ke liye exclusive legal advice, corporate dispute resolutions aur wealth safety systems.',
    location: 'New Delhi, India',
    rating: 5.0,
    contactEmail: 'yashpal@sehwaglaw.com',
    website: 'https://sehwaglaw.com',
    logoUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=300&h=300&q=80',
    isFeatured: false,
    networkSize: 95,
    foundedYear: 2005,
  },
  {
    id: 'biz_4',
    name: 'Surajmal Capital & Wealth Management',
    ownerName: 'Jaswant Jaat',
    ownerAvatar: 'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?auto=format&fit=crop&w=400&h=400&q=80',
    isOwnerVerified: true,
    category: 'Finance',
    description: 'Private equity investment aur family wealth management, land acquisitions aur Jaat entrepreneurs ke liye venture funding.',
    location: 'New Delhi, India',
    rating: 4.9,
    contactEmail: 'ranbir@surajmalcapital.com',
    website: 'https://surajmalcapital.com',
    logoUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=300&h=300&q=80',
    isFeatured: true,
    networkSize: 310,
    foundedYear: 2015,
  },
  {
    id: 'biz_5',
    name: 'Ahlawat Global Logistics',
    ownerName: 'Abhimanyu Ahlawat',
    ownerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&h=400&q=80',
    isOwnerVerified: true,
    category: 'Logistics & Infrastructure',
    description: 'Bulk logistics, supply chain management, cold-storage facilities aur transport networks. Farm se industries tak direct connectivity.',
    location: 'Rohtak, Haryana',
    rating: 4.7,
    contactEmail: 'abhimanyu@ahlawatlogistics.com',
    website: 'https://ahlawatlogistics.com',
    logoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=300&h=300&q=80',
    isFeatured: false,
    networkSize: 140,
    foundedYear: 2010,
  },
];

export const mockPosts: Post[] = [
  {
    id: 'post_4',
    author: {
      name: 'Jaswant Jaat, Nihal Jaat & Nitesh Jaat',
      username: 'samiti_founders',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80',
      isVerified: true,
      verificationType: 'Royal',
    },
    content: '🦁 Jaat Samiti ki shandar video update! Humare gaon aur samaj ke modern high-tech farming aur tractor power ki ek exclusive cinematic glimpse. Premium technology ke saath is baar hum pure desh me farming systems ko coordinate kar rahe hain. Video dekhein aur is revolution se judey! 🚩🚩',
    media: [
      'https://assets.mixkit.co/videos/preview/mixkit-agriculture-tractor-spraying-crops-in-a-field-41584-large.mp4'
    ],
    isVideo: true,
    likes: 1240,
    hasLiked: false,
    comments: [
      {
        id: 'c6',
        authorName: 'Jaswant Jaat',
        authorUsername: 'jaswant_jaat',
        authorAvatar: 'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?auto=format&fit=crop&w=150&h=150&q=80',
        isVerified: true,
        content: 'Bohot hi dhasu cinematic video hai! Jaat Samiti ko hum hamesha support karenge.',
        timestamp: '10 mins ago'
      }
    ],
    shareCount: 412,
    timestamp: '30 mins ago',
    category: 'achievement',
    location: 'Jaat Samiti HQ, Rohtak'
  },
  {
    id: 'post_1',
    author: {
      name: 'MaharajaSurajmal_Heritage',
      username: 'surajmal_foundation',
      avatar: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=150&h=150&q=80',
      isVerified: true,
      verificationType: 'Legend',
    },
    content: '🛡️ Apni Dharohar: Bharatpur ka Lohagarh Fort hamari strategic defensive genius ka sabse bada saboot hai. Earthen walls se bana ye killa 1805 me British cannons ke heavy balls ko absorb kar leta tha, jisse dushman kabhi isse fatah nahi kar paaye. Apne is proud heritage se seekhein aur strong banein.',
    media: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1616781446702-f8c6eb53e7f4?auto=format&fit=crop&w=1000&q=80'
    ],
    likes: 384,
    hasLiked: false,
    comments: [
      {
        id: 'c1',
        authorName: 'Major General Yashvir Tomar',
        authorUsername: 'yashvir_tomar',
        authorAvatar: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=150&h=150&q=80',
        isVerified: true,
        content: 'Bohot bada garv hai! Mitti ki diwaro ki physics engineering is world-class.',
        timestamp: '2 hours ago',
      },
      {
        id: 'c2',
        authorName: 'Neha Lamba',
        authorUsername: 'nehalamba',
        authorAvatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&w=150&h=150&q=80',
        isVerified: false,
        content: 'Bohot hi informative! Hamein samaj ke bachon ko yahan heritage walks par lekar jaana chahiye.',
        timestamp: '1 hour ago',
      }
    ],
    shareCount: 112,
    timestamp: '4 hours ago',
    category: 'heritage',
    location: 'Lohagarh Fort, Bharatpur',
  },
  {
    id: 'post_2',
    author: {
      name: 'Vikram Singh Chaudhary',
      username: 'vikram_ceres',
      avatar: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&w=150&h=150&q=80',
      isVerified: true,
      verificationType: 'Business',
    },
    content: '🌾 Ceres Robotics ke liye bohot bada din! Aaj humne Punjab, Haryana aur Western UP ke kisaano ke liye autonomous electric soil maintenance drones launch kiye hain. Hamari mitti se jo pavitra rishta hai use hum modern technology se aur strong karenge, taaki paani ki 40% bachat ho sake.',
    media: [
      'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1000&q=80'
    ],
    likes: 512,
    hasLiked: true,
    comments: [
      {
        id: 'c3',
        authorName: 'Jaswant Jaat',
        authorUsername: 'jaswant_jaat',
        authorAvatar: 'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?auto=format&fit=crop&w=150&h=150&q=80',
        isVerified: true,
        content: 'Gazab innovation Vikram! Surajmal Capital ko khushi hai ki humne aapki Series-B back ki thi. Desh bhar me ise scale karenge.',
        timestamp: '3 hours ago',
      }
    ],
    shareCount: 84,
    timestamp: '6 hours ago',
    category: 'business',
    location: 'Chandigarh Tech Park',
  },
  {
    id: 'post_3',
    author: {
      name: 'Anjali Tomar',
      username: 'anjali_wrestler',
      avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&w=150&h=150&q=80',
      isVerified: true,
      verificationType: 'Elite',
    },
    content: '🏆 CHAMPION OF CHAMPIONS. Aaj Olympic Trials ke podium par khade hokar apne roots ko represent karne ka moka mila. Akhade ki mitti ka jo discipline dada-dadi ne sikhaya wahi meri sabse badi taqat hai. Training chahe kitni bhi modern ho, mitti ka grind hi sab kuch hai. Support ke liye saare Jaat Connect bhaichare ko dil se dhanyawad! 🥇',
    media: [
      'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1000&q=80'
    ],
    likes: 894,
    hasLiked: false,
    comments: [
      {
        id: 'c4',
        authorName: 'Devender Malik',
        authorUsername: 'devender_crop',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80',
        isVerified: true,
        content: 'Beti tune pure samaj ka sir uncha kar diya! Aane waali peedhiyo ke liye inspiration ho tum.',
        timestamp: '5 hours ago',
      },
      {
        id: 'c5',
        authorName: 'Ranbir Hooda',
        authorUsername: 'hooda_elite',
        authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80',
        isVerified: true,
        content: 'Gajab performance, dhasu mitti ka jigra.',
        timestamp: '4 hours ago',
      }
    ],
    shareCount: 231,
    timestamp: '8 hours ago',
    category: 'achievement',
    location: 'Paris Elite Arena',
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    type: 'like',
    senderName: 'Justice Yashpal Sehwag',
    senderAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&h=100&q=80',
    message: 'ne aapke agrarian investment wale post ko pasand kiya.',
    timestamp: '23m ago',
    read: false,
    postId: 'post_2',
  },
  {
    id: 'notif_2',
    type: 'invite_accept',
    senderName: 'Digvijay Ahlawat',
    senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80',
    message: 'ne aapka private invite accept kiya aur Elite Patron ban gaye.',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: 'notif_3',
    type: 'comment',
    senderName: 'Anjali Tomar',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100&q=80',
    message: 'ne aapke sports article pe comment kiya.',
    timestamp: '1 day ago',
    read: true,
    postId: 'post_3',
  },
];

export const mockHeritageMilestones = [
  {
    id: 'milestone_1',
    title: 'Lohagarh Fort: Jo Kabhi Haara Nahi',
    year: '1733 AD',
    description: 'Lohagarh Fort India ka aisa killa hai jise British forces kabhi nahi jeet payin. Maharaja Surajmal ke strategic dimaag se bana ye killa mitti ki dhasu walls se cannon balls ko be-asar kar deta tha.',
    image: 'https://images.unsplash.com/photo-1627581534960-9dfd4a2fa3ea?auto=format&fit=crop&w=800&q=80',
    legacy: 'Strategic defense, dimaag ki takat aur independence ka sabse bada symbol.',
  },
  {
    id: 'milestone_2',
    title: 'Maharaja Surajmal ka Empire',
    year: '1756 AD - 1763 AD',
    description: 'Maharaja Surajmal ne poore samaj ko ek karke Rajasthan, Haryana, Western UP aur Delhi tak apna empire failaya. Unka raaj imandari, wisdom aur khushhaali ke liye jaana jata tha.',
    image: 'https://images.unsplash.com/photo-1616781446702-f8c6eb53e7f4?auto=format&fit=crop&w=800&q=80',
    legacy: 'Golden era of governance, fair legal system aur aapsi bhaichara.',
  },
  {
    id: 'milestone_3',
    title: 'Green Revolution me Bada Yogdaan',
    year: '1960s',
    description: 'Zameer aur zameen se jude hamare kisaano ne desh ki Green Revolution ko lead kiya. Apni kadi mehnat se inhone Northern India ko desh ka sabse bada Anna Bhandar bana diya.',
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=800&q=80',
    legacy: 'Economic self-reliance, hardwork aur modern agritech ki shuruaat.',
  },
  {
    id: 'milestone_4',
    title: 'Olympic Wrestling aur Akhada Power',
    year: 'Modern Era',
    description: 'Haryana aur Western UP ke wrestlers, boxers aur athletes ka pure world me dabdaba hai. Hamare mitti ke akhado ne global champions diye hain jo mitti se uthkar sona jeet te hain.',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80',
    legacy: 'Physical premium strength, Mitti ki Kushti ko global stage par chamkana.',
  }
];

export const initialChatMessages = [
  { id: '1', senderId: 'leader_3', receiverId: 'current_user_1', content: 'Jaswant bhai, kya aap agle Tuesday ko Gurgaon Business Conclave me aa rahe ho? Boards ke samne satellite metrics present karne hain.', timestamp: '10:14 AM', isEncrypted: true },
  { id: '2', senderId: 'current_user_1', receiverId: 'leader_3', content: 'Haan Vikram bhai, bilkul! Maine Ceres Robotics ke liye prime space allot kar diya hai. Board excited hai UP corridor expansion ke liye. VIP Lounge me milte hain.', timestamp: '10:18 AM', isEncrypted: true },
  { id: '3', senderId: 'leader_3', receiverId: 'current_user_1', content: 'Bahut badiya. Safe encrypted channel active hai yahan. Main data deck bhej raha hu.', timestamp: '10:19 AM', isEncrypted: true },
];

