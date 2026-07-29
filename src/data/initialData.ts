import { Post, Category, Comment, Subscriber, AdConfig, SiteSettings, ContactMessage } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Technology',
    slug: 'technology',
    description: 'Latest innovations, gadgets, enterprise software, and tech industry news.',
    color: '#3B82F6', // Blue
    icon: 'Cpu',
    postCount: 5,
  },
  {
    id: 'cat-2',
    name: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    description: 'LLMs, generative AI models, machine learning algorithms, and AI ethics.',
    color: '#8B5CF6', // Purple
    icon: 'Sparkles',
    postCount: 4,
  },
  {
    id: 'cat-3',
    name: 'Cyber Security',
    slug: 'cyber-security',
    description: 'Threat intelligence, data privacy, vulnerabilities, and security best practices.',
    color: '#EF4444', // Red
    icon: 'ShieldAlert',
    postCount: 3,
  },
  {
    id: 'cat-4',
    name: 'Web Development',
    slug: 'web-development',
    description: 'Modern frontend frameworks, backend architecture, APIs, and DevOps.',
    color: '#10B981', // Emerald
    icon: 'Code',
    postCount: 4,
  },
  {
    id: 'cat-5',
    name: 'Science & Future',
    slug: 'science-future',
    description: 'Quantum computing, space exploration, renewable energy, and biotechnology.',
    color: '#F59E0B', // Amber
    icon: 'Rocket',
    postCount: 3,
  },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    title: 'The Future of AI Agents in Enterprise Software: What to Expect in 2026',
    slug: 'future-of-ai-agents-in-enterprise-software-2026',
    excerpt: 'Explore how autonomous multi-agent orchestration systems are transforming corporate workflows, automating decision matrices, and reshaping software development.',
    content: `
      <p>Artificial Intelligence has evolved rapidly from simple prompt-based chatbots to highly autonomous multi-agent orchestration engines. In 2026, enterprise organizations are moving beyond isolated generative AI models to deploy unified AI agent teams capable of complex task execution, cross-system workflow automation, and real-time decision synthesis.</p>

      <h2>The Shift from Reactive Chatbots to Proactive Autonomous Agents</h2>
      <p>Early generative AI implementations focused primarily on document summaries and basic query resolution. Today's autonomous AI agents operate with persistent memory, tool-calling capabilities, and self-correcting execution loops. They connect directly to standard enterprise databases, cloud platforms, and internal APIs to complete multi-step goals without continuous human intervention.</p>

      <blockquote>
        "The real competitive advantage in modern enterprise technology lies in pairing specialized domain models with secure agentic workflows."
      </blockquote>

      <h2>Key Pillars of Modern AI Agent Architecture</h2>
      <ul>
        <li><strong>Tool Integration & Tool Use:</strong> Agents dynamically construct database queries, trigger webhooks, and invoke REST APIs based on real-time task needs.</li>
        <li><strong>Role-Based Security & Audit Trails:</strong> Enterprise deployments enforce strict granular access control (RBAC) to ensure agents only process authorized data.</li>
        <li><strong>Contextual Long-Term Memory:</strong> Leveraging vector search and hybrid retrieval augmented generation (RAG) to maintain organizational context over extended projects.</li>
      </ul>

      <h2>Overcoming Implementation Challenges</h2>
      <p>While the potential ROI of AI automation is immense, engineering teams must navigate key challenges including rate limits, context window management, and hallucination guardrails. Leading cloud infrastructure platforms now incorporate server-side proxy layers and strict validation pipelines to guarantee deterministic performance.</p>

      <h2>Conclusion</h2>
      <p>Organizations that adopt robust, secure AI agent infrastructure today will lead their industries in operational speed, code quality, and customer satisfaction. The future of enterprise software is collaborative, intelligent, and agent-driven.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    categoryId: 'cat-2',
    categoryName: 'Artificial Intelligence',
    tags: ['AI', 'Enterprise', 'Automation', 'Machine Learning', 'Future Tech'],
    author: {
      id: 'auth-1',
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'Chief Tech Editor',
      bio: 'Senior technology journalist and systems architect with over 12 years of experience covering AI, cloud engineering, and web infrastructure.',
    },
    status: 'published',
    featured: true,
    trending: true,
    viewsCount: 14250,
    readTimeMinutes: 5,
    seoTitle: 'Future of AI Agents in Enterprise 2026 | Tech News & Analysis',
    metaDescription: 'Detailed deep-dive into autonomous AI agent architecture, enterprise automation, security, and multi-agent workflow strategies for 2026.',
    publishedAt: '2026-07-28T10:30:00.000Z',
    updatedAt: '2026-07-28T10:30:00.000Z',
    commentsCount: 3,
  },
  {
    id: 'post-2',
    title: 'Zero-Trust Architecture: Safeguarding Cloud-Native Infrastructure Against Modern Cyber Threats',
    slug: 'zero-trust-architecture-safeguarding-cloud-native-infrastructure',
    excerpt: 'Discover why explicit verification, least-privilege access, and continuous identity inspection are essential for securing modern Kubernetes and serverless deployments.',
    content: `
      <p>As organizations migrate mission-critical applications to distributed cloud environments, traditional perimeter-based security models are no longer effective. The proliferation of remote work, multi-cloud setups, and microservices mandates a robust Zero-Trust security posture.</p>

      <h2>Core Principles of Zero Trust</h2>
      <p>Zero Trust operates under a single fundamental premise: <em>Never Trust, Always Verify</em>. Regardless of whether a request originates inside or outside the network boundary, every interaction must be authenticated, authorized, and encrypted before access is granted.</p>

      <h3>1. Continuous Authentication & Authorization</h3>
      <p>Static IP whitelisting and session tokens are replaced with short-lived mTLS certificates, identity-aware proxies, and adaptive multi-factor authentication (MFA).</p>

      <h3>2. Least-Privilege Access Control</h3>
      <p>Users and microservices receive minimum required permissions strictly scoped to specific resources, mitigating lateral movement during potential security breaches.</p>

      <h2>Practical Implementation with Cloud-Native Tools</h2>
      <p>Implementing Zero Trust across Kubernetes clusters involves service meshes like Istio or Linkerd for automatic mTLS encryption, along with Open Policy Agent (OPA) for centralized policy enforcement.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    categoryId: 'cat-3',
    categoryName: 'Cyber Security',
    tags: ['Security', 'Zero Trust', 'Cloud Security', 'DevOps', 'CyberCrime'],
    author: {
      id: 'auth-2',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      role: 'Cybersecurity Analyst',
      bio: 'Ethical hacker, CISSP, and cloud security strategist sharing actionable insights on network protection and incident response.',
    },
    status: 'published',
    featured: true,
    trending: true,
    viewsCount: 9810,
    readTimeMinutes: 6,
    seoTitle: 'Zero-Trust Cloud Architecture Security Guide | Tech Blog',
    metaDescription: 'Comprehensive guide to implementing Zero-Trust network security, mTLS, and identity management in cloud-native containerized platforms.',
    publishedAt: '2026-07-27T14:15:00.000Z',
    updatedAt: '2026-07-27T14:15:00.000Z',
    commentsCount: 2,
  },
  {
    id: 'post-3',
    title: 'Building Hyper-Fast Web Apps with Vite 6, React 19, and Tailwind CSS v4',
    slug: 'building-hyper-fast-web-apps-vite-react-19-tailwind-v4',
    excerpt: 'Learn how to harness server components, native CSS engine optimizations, and Vite module bundler features to achieve 100/100 Lighthouse performance scores.',
    content: `
      <p>Frontend web performance directly impacts search engine ranking, user retention, and conversion rates. With the release of React 19 and Tailwind CSS v4, web developers have access to unprecedented speed, reduced bundle sizes, and streamlined CSS processing.</p>

      <h2>What Makes React 19 Game-Changing?</h2>
      <p>React 19 introduces native compiler optimizations that eliminate the manual boilerplate of <code>useMemo</code> and <code>useCallback</code>, while streamlining asset loading and server action execution.</p>

      <h2>Tailwind CSS v4 Oxide Engine</h2>
      <p>Tailwind CSS v4 introduces a ground-up rewrite in Rust, offering up to 10x faster build speeds and direct single-line CSS imports with <code>@import "tailwindcss";</code> without cumbersome PostCSS setups.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    categoryId: 'cat-4',
    categoryName: 'Web Development',
    tags: ['React', 'TailwindCSS', 'Vite', 'Frontend', 'Performance'],
    author: {
      id: 'auth-1',
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'Chief Tech Editor',
    },
    status: 'published',
    featured: false,
    trending: true,
    viewsCount: 18400,
    readTimeMinutes: 4,
    seoTitle: 'React 19 & Tailwind CSS v4 Performance Guide | Web Dev',
    metaDescription: 'Step-by-step tutorial on building ultra-fast React 19 applications using Vite and Tailwind CSS v4 with optimized Core Web Vitals.',
    publishedAt: '2026-07-26T09:00:00.000Z',
    updatedAt: '2026-07-26T09:00:00.000Z',
    commentsCount: 5,
  },
  {
    id: 'post-4',
    title: 'Quantum Computing Milestones: Breaking New Frontiers in Cryptography and Material Science',
    slug: 'quantum-computing-milestones-cryptography-material-science',
    excerpt: 'An in-depth look at 1000+ qubit logical systems, error mitigation breakthroughs, and post-quantum encryption standards preparing for Q-Day.',
    content: `
      <p>Quantum computing research has hit critical milestones in logical qubit stability and fault tolerance. Researchers around the globe are demonstrating real-world applications in molecular simulation, logistics optimization, and financial risk modeling.</p>

      <h2>The Race for Post-Quantum Cryptography (PQC)</h2>
      <p>With quantum hardware approaching thresholds capable of running Shor's algorithm, cybersecurity standards bodies have finalized lattice-based post-quantum cryptographic standards to protect sensitive legacy data.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
    categoryId: 'cat-5',
    categoryName: 'Science & Future',
    tags: ['Quantum', 'Physics', 'Encryption', 'Science', 'Innovation'],
    author: {
      id: 'auth-3',
      name: 'Dr. Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      role: 'Senior Physics Contributor',
    },
    status: 'published',
    featured: false,
    trending: false,
    viewsCount: 6540,
    readTimeMinutes: 7,
    seoTitle: 'Quantum Computing Breakthroughs & PQC Security | ApexPulse Science',
    metaDescription: 'Analysis of fault-tolerant quantum computing, post-quantum encryption standards, and breakthroughs in material science.',
    publishedAt: '2026-07-25T16:45:00.000Z',
    updatedAt: '2026-07-25T16:45:00.000Z',
    commentsCount: 1,
  },
  {
    id: 'post-5',
    title: 'Next-Gen Mobile Hardware: ARM v9 Architecture and Neural Processing Units Examined',
    slug: 'next-gen-mobile-hardware-arm-v9-npu-architecture',
    excerpt: 'Analyzing the performance-per-watt gains, hardware-level ray tracing, and on-device AI acceleration in the latest smartphone chips.',
    content: `
      <p>Modern mobile System-on-Chips (SoCs) are turning smartphones into localized generative AI powerhouses. Dedicated NPUs (Neural Processing Units) now execute billions of operations per second directly on battery power without hitting remote cloud servers.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    categoryId: 'cat-1',
    categoryName: 'Technology',
    tags: ['Hardware', 'ARM', 'NPU', 'Smartphones', 'Processors'],
    author: {
      id: 'auth-1',
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'Chief Tech Editor',
    },
    status: 'published',
    featured: false,
    trending: true,
    viewsCount: 11200,
    readTimeMinutes: 5,
    seoTitle: 'ARM v9 Mobile Hardware & NPU Chip Breakdown | Tech News',
    metaDescription: 'Technical deep dive into ARM v9 mobile architecture, dedicated NPUs, and hardware-accelerated on-device AI computing.',
    publishedAt: '2026-07-24T11:20:00.000Z',
    updatedAt: '2026-07-24T11:20:00.000Z',
    commentsCount: 4,
  },
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comm-1',
    postId: 'post-1',
    authorName: 'David Miller',
    authorEmail: 'david.m@example.com',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    content: 'Great overview! The distinction between standard prompt bots and tool-calling multi-agent teams is spot on. We recently integrated agentic RAG for our customer support system.',
    createdAt: '2026-07-28T12:00:00.000Z',
    status: 'approved',
    parentId: null,
    replies: [
      {
        id: 'comm-2',
        postId: 'post-1',
        authorName: 'Alex Rivera',
        authorEmail: 'alex@alexpulse.com',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
        content: 'Thanks David! Awesome to hear you are already using agentic RAG in production. How are you handling context window budgeting?',
        createdAt: '2026-07-28T14:30:00.000Z',
        status: 'approved',
        parentId: 'comm-1',
      },
    ],
  },
  {
    id: 'comm-3',
    postId: 'post-2',
    authorName: 'Elena Rostova',
    authorEmail: 'elena.r@secorg.io',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    content: 'Zero Trust is non-negotiable now. Excellent coverage on mTLS service mesh routing in Kubernetes.',
    createdAt: '2026-07-27T18:10:00.000Z',
    status: 'approved',
    parentId: null,
  },
];

export const INITIAL_SUBSCRIBERS: Subscriber[] = [
  {
    id: 'sub-1',
    email: 'Ps1629305@gmail.com',
    name: 'Admin Subscriber',
    status: 'active',
    subscribedAt: '2026-07-20T08:00:00.000Z',
  },
  {
    id: 'sub-2',
    email: 'reader.john@techworld.com',
    name: 'John Doe',
    status: 'active',
    subscribedAt: '2026-07-22T10:15:00.000Z',
  },
];

export const INITIAL_ADS_CONFIG: AdConfig = {
  enabled: false,
  googleAdSenseClientId: '',
  headerBanner: {
    enabled: false,
    slotId: '',
  },
  inArticleTop: {
    enabled: false,
    slotId: '',
  },
  inArticleBottom: {
    enabled: false,
    slotId: '',
  },
  sidebarBanner: {
    enabled: false,
    slotId: '',
  },
  footerBanner: {
    enabled: false,
    slotId: '',
  },
  showAdLabels: false,
};

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'OG News',
  tagline: 'Your Daily Hub for Tech Breakthroughs, AI & World News',
  siteUrl: 'https://ognews.com',
  logoText: 'OG News',
  adminEmail: 'Ps1629305@gmail.com',
  defaultAuthorName: 'Alex Rivera',
  defaultAuthorBio: 'Senior Technology Journalist & Systems Architect',
  socialLinks: {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
  },
  cookieConsentText: 'We use essential cookies and similar technologies to enhance your browsing experience and analyze traffic.',
  allowComments: true,
  requireCommentApproval: true,
  postsPerPage: 6,
};

export const INITIAL_CONTACT_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Sarah Connor',
    email: 'sarah@skynet-research.org',
    subject: 'Partnership & Guest Post Inquiry',
    message: 'Hello ApexPulse team, we would love to submit a technical guest article on AI safety and enterprise container security. Let us know your editorial guidelines.',
    createdAt: '2026-07-28T09:15:00.000Z',
    read: false,
  },
];
