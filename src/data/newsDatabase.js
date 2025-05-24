const newsArticles = [
  {
    id: 1,
    mainTitle: "AI Healthcare Revolution: New Breakthrough in Medical Diagnosis",
    mainSource: "TechHealth Today",
    publishedAt: "2024-12-15T10:30:00Z",
    imageUrl: "https://picsum.photos/800/400?random=1",
    summaries: [
      {
        source: "TechHealth Today",
        summary: "Revolutionary AI system demonstrates 95% accuracy in early disease detection, potentially saving millions of lives through faster diagnosis and treatment recommendations.",
        url: "https://example.com/ai-healthcare-1"
      },
      {
        source: "Medical News Daily",
        summary: "New artificial intelligence platform integrates with hospital systems to provide real-time diagnostic support, reducing human error and improving patient outcomes significantly.",
        url: "https://example.com/ai-healthcare-2"
      }
    ]
  },
  {
    id: 2,
    mainTitle: "Tesla Stock Surges Following Autonomous Vehicle Announcement",
    mainSource: "Financial Times",
    publishedAt: "2024-12-14T14:20:00Z",
    imageUrl: "https://picsum.photos/800/400?random=2",
    summaries: [
      {
        source: "Financial Times",
        summary: "Tesla shares jumped 12% after announcing full self-driving capability will be available nationwide by Q2 2025, marking a significant milestone in autonomous transportation.",
        url: "https://example.com/tesla-stock-1"
      },
      {
        source: "Bloomberg Markets",
        summary: "Investors show strong confidence in Tesla's autonomous driving technology as the company reports successful completion of 10 million miles of autonomous testing.",
        url: "https://example.com/tesla-stock-2"
      }
    ]
  },
  {
    id: 3,
    mainTitle: "Cryptocurrency Market Reaches New Heights with Bitcoin at $75,000",
    mainSource: "CryptoNews",
    publishedAt: "2024-12-13T09:15:00Z",
    imageUrl: "https://picsum.photos/800/400?random=3",
    summaries: [
      {
        source: "CryptoNews",
        summary: "Bitcoin reaches unprecedented $75,000 milestone as institutional adoption accelerates and major corporations add cryptocurrency to their treasury reserves.",
        url: "https://example.com/crypto-1"
      },
      {
        source: "Digital Finance Weekly",
        summary: "The cryptocurrency surge reflects growing mainstream acceptance, with major banks now offering crypto trading services to retail and institutional clients.",
        url: "https://example.com/crypto-2"
      }
    ]
  },
  {
    id: 4,
    mainTitle: "Climate Change Summit Announces Historic Global Agreement",
    mainSource: "Environmental Times",
    publishedAt: "2024-12-12T16:45:00Z",
    imageUrl: "https://picsum.photos/800/400?random=4",
    summaries: [
      {
        source: "Environmental Times",
        summary: "World leaders reach unprecedented consensus on carbon reduction targets, committing to 50% emissions cut by 2030 with binding international agreements.",
        url: "https://example.com/climate-1"
      },
      {
        source: "Green Planet News",
        summary: "The historic climate agreement includes $500 billion in funding for renewable energy projects and support for developing nations' green transition.",
        url: "https://example.com/climate-2"
      }
    ]
  },
  {
    id: 5,
    mainTitle: "React 19 Released with Revolutionary Performance Improvements",
    mainSource: "Dev Weekly",
    publishedAt: "2024-12-11T11:20:00Z",
    imageUrl: "https://picsum.photos/800/400?random=5",
    summaries: [
      {
        source: "Dev Weekly",
        summary: "React 19 introduces automatic batching, concurrent features, and server components, delivering up to 40% performance improvements in real-world applications.",
        url: "https://example.com/react-1"
      },
      {
        source: "Frontend Focus",
        summary: "The new React release simplifies state management and introduces built-in data fetching capabilities, reducing the need for external libraries significantly.",
        url: "https://example.com/react-2"
      }
    ]
  }
];

export default newsArticles;

// Future API integration (Aastik will give)
//export const fetchNewsFromAPI = async (searchQuery) => {
//  const response = await fetch(`https://newsGenius.com/search?q=${searchQuery}`);
//  return await response.json();
//};
