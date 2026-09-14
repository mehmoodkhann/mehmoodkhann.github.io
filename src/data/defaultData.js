// Truthful source content. Missing personal assets and credentials stay empty.
// Browser edits are migrated only when they match known untouched defaults.

export const defaultEducation = [
  {
    id: "e1",
    degree: "BS Computer Science",
    institution:
      "Quaid-e-Awam University of Engineering, Science and Technology (QUEST), Nawabshah",
    period: "Expected graduation: 2027",
    description: "",
  },
];

export const defaultExpertise = [
  {
    id: "llm-apps",
    title: "RAG & language models",
    description:
      "Retrieval pipelines that connect document context to a language model.",
    items: ["RAG", "NLP", "LangChain", "Gemini API"],
  },
  {
    id: "ai-infra",
    title: "Backend engineering",
    description: "The API and processing layers behind an AI application.",
    items: ["Python", "FastAPI", "REST APIs", "PyMuPDF"],
  },
  {
    id: "vector-data",
    title: "Vector search & data",
    description: "Text representations and storage for semantic retrieval.",
    items: ["Hugging Face embeddings", "Qdrant Cloud", "SQL"],
  },
  {
    id: "frontend",
    title: "Application interfaces",
    description:
      "Interfaces for document uploads and conversational interaction.",
    items: ["React.js", "JavaScript", "Tailwind CSS"],
  },
  {
    id: "programming",
    title: "Software foundations",
    description:
      "Programming and computer science foundations from coursework and projects.",
    items: ["Python", "C", "C++", "SQL"],
  },
  {
    id: "agentic-ai",
    title: "Agentic workflows",
    description:
      "Currently learning how state, tools, and orchestration fit together.",
    items: ["LangGraph", "AI agents", "Agentic AI"],
  },
];

export const defaultJourney = [
  {
    id: "j1",
    title: "BS Computer Science",
    period: "In progress",
    description:
      "Studying programming, data structures, and software engineering at QUEST, Nawabshah.",
  },
  {
    id: "j2",
    title: "Programming Foundations",
    period: "",
    description:
      "Built a solid base in C, C++, and general-purpose programming before specializing.",
  },
  {
    id: "j3",
    title: "Software Development",
    period: "",
    description:
      "Moved into full application development, including frontend work with React and JavaScript.",
  },
  {
    id: "j4",
    title: "Python & AI Foundations",
    period: "",
    description:
      "Focused on Python and started exploring machine learning and AI fundamentals.",
  },
  {
    id: "j5",
    title: "NLP",
    period: "",
    description:
      "Went deeper into natural language processing — text representation, embeddings, and language understanding.",
  },
  {
    id: "j6",
    title: "RAG, Embeddings & Vector Databases",
    period: "",
    description:
      "Building RAG workflows that connect document chunks, Hugging Face embeddings, vector storage in Qdrant, and semantic retrieval.",
  },
  {
    id: "j7",
    title: "LLM Applications",
    period: "",
    description:
      "Built full applications around large language models — from backend pipelines to user-facing interfaces.",
  },
  {
    id: "j8",
    title: "Agentic AI",
    period: "Currently exploring",
    description:
      "Exploring LangGraph, tool use, and stateful agent workflows as the next stage of my learning.",
  },
  {
    id: "j9",
    title: "AI Systems Engineering",
    period: "Ongoing goal",
    description:
      "Working toward being able to design and ship complete, production-grade AI systems end to end.",
  },
];

export const defaultMessages = [];

export const defaultProfile = {
  name: "Mehmood Khan",
  role: "AI Engineer & Intelligent Systems Builder",
  tagline:
    "I build document assistants and AI applications, connecting retrieval, language models, and useful interfaces.",
  status: "BS Computer Science student",
  location: "Nawabshah, Sindh, Pakistan",
  email: "mehmoodkhan@quest.edu.pk",
  github: "https://github.com/mehmoodkhann",
  linkedin: "https://www.linkedin.com/in/mehmood-khan-5799352a6/",
  resumeUrl: "/assets/resume/resume.pdf",
  photoUrl: "/assets/profile/profile.jpg",
  aboutShort:
    "I am a BS Computer Science student at QUEST, Nawabshah, graduating in 2027. I build AI applications around NLP, retrieval-augmented generation, and language models, from document processing to the interface people use.",
  aboutLong: [
    "My work starts with the information a system needs to answer a question. In the Intelligent Research Paper Assistant, I connect PDF processing, Hugging Face embeddings, Qdrant retrieval, and Gemini generation through a FastAPI backend and React interface.",
    "I focus on clear responsibilities between components: prepare the data, retrieve useful context, and make the answer understandable. I am currently learning LangGraph and agentic workflows, alongside the computer science foundations behind reliable software.",
    "My long-term goal is to build useful AI products with a strong engineering team. The next steps are better retrieval evaluation, more reliable backends, and continued practice turning a working idea into a complete application.",
  ],
  heroHeadline: "Turning complex knowledge into practical AI systems.",
  specializations: "NLP · RAG · LLM Applications · Agentic AI",
};

export const defaultProjects = [
  {
    id: "research-paper-assistant",
    title: "Intelligent Research Paper Assistant",
    role: "AI/NLP & RAG Developer",
    summary:
      "Ask focused questions about research papers, with answers generated from retrieved document context.",
    coverImage: "/assets/projects/research-paper-assistant/cover.png",
    screenshots: [
      "/assets/projects/research-paper-assistant/screenshots/screenshot-1.png",
      "/assets/projects/research-paper-assistant/screenshots/screenshot-2.png",
      "/assets/projects/research-paper-assistant/screenshots/screenshot-3.png",
    ],
    architectureDiagram: "",
    githubUrl: "",
    liveUrl: "",
    videoUrl: "",
    featured: true,
    technologies: [
      "Python",
      "FastAPI",
      "React.js",
      "LangChain",
      "RAG",
      "Google Gemini API",
      "Hugging Face Embeddings",
      "Qdrant Cloud",
      "PyMuPDF",
      "REST APIs",
      "Tailwind CSS",
    ],
    pipeline: [
      "PDF",
      "Document loading / PyMuPDF",
      "Preprocessing",
      "Chunking",
      "Hugging Face embeddings",
      "Qdrant Cloud",
      "Semantic retrieval",
      "Retrieved context",
      "Google Gemini",
      "Grounded answer",
    ],
    caseStudy: {
      overview:
        "An AI application for asking natural-language questions about research papers. A React interface connects to a FastAPI backend that processes uploaded PDFs and uses retrieval-augmented generation to supply document context to Google Gemini.",
      problem:
        "Research papers contain dense descriptions of methods, findings, and definitions. Finding a specific explanation can mean searching across many pages; a language model without the paper cannot reliably answer questions about its contents.",
      solution:
        "Make the paper available to the model through retrieval. The backend loads and preprocesses its text, splits it into chunks, creates Hugging Face embeddings, and stores the vectors in Qdrant Cloud. At question time, retrieved context is passed through the RAG pipeline to Gemini.",
      architectureSteps: [
        {
          step: "Load and preprocess",
          detail:
            "PyMuPDF and the document-processing layer extract and prepare text from the uploaded PDF.",
        },
        {
          step: "Chunk and embed",
          detail:
            "The chunking layer splits text for retrieval. A Hugging Face embedding model produces the vector representations.",
        },
        {
          step: "Store and retrieve",
          detail:
            "Qdrant Cloud stores the vectors; the retriever obtains document context for the question.",
        },
        {
          step: "Generate and respond",
          detail:
            "The RAG pipeline combines the question, context, and prompt. Google Gemini generates the response delivered through the chat API.",
        },
      ],
      whyTheseTools: [
        {
          tool: "Qdrant",
          reason:
            "Vector database used for storing embeddings and running fast semantic retrieval over document chunks.",
        },
        {
          tool: "Hugging Face Embeddings",
          reason:
            "Used to generate dense vector representations of both document chunks and user queries.",
        },
        {
          tool: "Google Gemini",
          reason:
            "The LLM used to generate the final natural-language answer from retrieved context.",
        },
        {
          tool: "FastAPI",
          reason:
            "Provides the backend REST API that ties document processing, retrieval, and generation together.",
        },
        {
          tool: "React",
          reason:
            "Provides the interface for uploading papers and asking questions.",
        },
      ],
      engineeringDecisions:
        "The system separates loading, preprocessing, chunking, embeddings, retrieval, and generation into backend modules. This gives each stage a clear responsibility and makes it possible to investigate problems without treating the entire application as one prompt.",
      challenges:
        "The main engineering concerns are preserving useful text through PDF processing, choosing chunks that retain context, and handling failures across retrieval and generation. The supplied module structure separates these responsibilities; specific tuning choices and their measured effects still need source-level verification.",
      results: null,
      value:
        "The application gives a reader a conversational way to explore a paper, ask focused questions, and work with retrieved document context. Upload, deletion, and reset controls support managing the documents used by the assistant. Answers still need to be checked against the original paper.",
      evidence:
        "Architecture and capabilities are based on the supplied project brief. No latency, retrieval-quality, or production-usage measurements have been supplied.",
      implementation: [
        {
          files: [
            "loader.py",
            "preprocessing.py",
            "document_processor.py",
            "chunking.py",
          ],
          title: "Document preparation",
          detail:
            "Document loading, preprocessing, orchestration, and chunking are separated within the ingestion layer.",
        },
        {
          files: ["embedding.py", "vector_store.py", "retriever.py"],
          title: "Embeddings and retrieval",
          detail:
            "The retrieval layer covers Hugging Face embeddings, vector storage in Qdrant, and context retrieval.",
        },
        {
          files: ["rag_pipeline.py", "llm.py", "prompts.py", "chat.py"],
          title: "RAG and conversation",
          detail:
            "These modules connect retrieved context, prompt construction, Gemini interaction, and chat.",
        },
        {
          files: ["schemas.py", "config.py"],
          title: "API contracts and configuration",
          detail:
            "Dedicated modules organize schemas and application configuration.",
        },
        {
          files: ["logger.py", "handlers.py", "exceptions.py"],
          title: "Operational support",
          detail:
            "Logging, handlers, and exception definitions support diagnosing and handling application errors.",
        },
      ],
      limitations:
        "Retrieval can miss relevant passages, and generated answers can be incomplete or incorrect. PDF extraction quality also affects the context available to the model. Answers need checking against the paper; retrieval quality, latency and deployment scale have not been measured in the supplied material.",
    },
    category: "Document intelligence",
    contribution:
      "AI application development across the document processing pipeline, FastAPI backend, and React interface.",
    capabilities: [
      "PDF upload and document processing",
      "Chunking and Hugging Face embeddings",
      "Vector storage and retrieval in Qdrant Cloud",
      "RAG-based chat with Google Gemini",
      "Document deletion and reset functionality",
      "Logging and structured error handling",
    ],
    coverAlt:
      "Research paper workflow: PDF preparation, Hugging Face embeddings, Qdrant retrieval and Gemini generation.",
  },
  {
    id: "knowledge-assistant",
    title: "Intelligent Knowledge Assistant",
    role: "AI/NLP & RAG Developer",
    summary:
      "A practical AI/RAG project for exploring document knowledge through natural-language questions.",
    coverImage: "/assets/projects/knowledge-assistant/cover.png",
    screenshots: [],
    architectureDiagram: "",
    githubUrl: "",
    liveUrl: "",
    videoUrl: "",
    featured: true,
    technologies: [
      "Python",
      "FastAPI",
      "React.js",
      "LangChain",
      "RAG",
      "Google Gemini API",
      "Hugging Face Embeddings",
      "Qdrant Cloud",
      "PyMuPDF",
      "REST APIs",
      "Tailwind CSS",
    ],
    pipeline: ["Documents", "Retrieval", "Question answering"],
    caseStudy: {
      overview:
        "The supplied portfolio describes an Intelligent Knowledge Assistant for interacting with document content through a RAG workflow.",
      problem:
        "Useful knowledge is often spread across documents. Keyword search can locate a phrase without directly answering a question.",
      solution:
        "The project is described as applying document ingestion, retrieval, and conversational querying to this problem.",
      value:
        "Its intended value is a question-led way to explore document knowledge.",
      evidence:
        "Project overview based on the existing portfolio description. Application source was not supplied, so supported file formats, retrieval settings, and implementation details remain unverified.",
      results: null,
      limitations:
        "Application source was not supplied. Supported formats, retrieval settings, model configuration, deployment behavior and detailed implementation remain unverified.",
    },
    category: "Knowledge assistants",
    contribution:
      "AI/RAG application development, as described in the supplied portfolio.",
    capabilities: [
      "Document ingestion, as described in the portfolio",
      "Retrieval-based knowledge interaction",
      "Conversational querying",
    ],
    coverAlt:
      "Conceptual RAG workflow connecting documents and questions through retrieval to an answer.",
  },
  {
    id: "network-traffic-monitor",
    title: "Network Traffic Monitoring System",
    role: "Developer",
    summary:
      "A Python desktop tool that brings network activity, connection checks, and report exports into one interface.",
    coverImage: "/assets/projects/network-traffic-monitor/cover.png",
    screenshots: [],
    architectureDiagram: "",
    githubUrl: "",
    liveUrl: "",
    videoUrl: "",
    featured: true,
    technologies: [
      "Python",
      "Tkinter",
      "psutil",
      "Speedtest",
      "Networking",
      "CSV",
      "ReportLab",
    ],
    pipeline: [
      "Interface Scan",
      "Live Metrics (psutil)",
      "Speed Test",
      "Dashboard Render",
      "CSV / PDF Export",
    ],
    caseStudy: {
      overview:
        "A desktop tool for monitoring the health and throughput of a machine's network connection in real time, built with a Tkinter GUI rather than a web stack.",
      problem:
        "Diagnosing network issues or simply understanding current bandwidth usage usually means digging through OS-level tools that aren't built for continuous, readable monitoring.",
      solution:
        "A real-time dashboard that polls network interface statistics, upload/download rates, and periodic speed tests, and can export session data to CSV or a PDF report.",
      architectureSteps: [
        {
          step: "Interface Scan",
          detail:
            "Available network interfaces are detected and listed for the user to select.",
        },
        {
          step: "Live Metrics",
          detail:
            "psutil is polled at a fixed interval to read bytes sent/received and packet counts per interface.",
        },
        {
          step: "Speed Test",
          detail:
            "The speedtest library periodically measures upload/download throughput and latency.",
        },
        {
          step: "Dashboard Render",
          detail:
            "Tkinter renders the collected metrics into a live-updating dashboard view.",
        },
        {
          step: "Export",
          detail:
            "Session statistics can be exported as CSV for raw data or as a formatted PDF report via ReportLab.",
        },
      ],
      whyTheseTools: [
        {
          tool: "psutil",
          reason:
            "Cross-platform access to system and network interface statistics.",
        },
        {
          tool: "Speedtest",
          reason:
            "Measures real upload/download throughput and latency against public test servers.",
        },
        {
          tool: "Tkinter",
          reason:
            "Lightweight built-in GUI toolkit, sufficient for a real-time monitoring dashboard without extra dependencies.",
        },
        {
          tool: "ReportLab",
          reason: "Generates PDF reports from collected session data.",
        },
      ],
      engineeringDecisions: "",
      challenges: "",
      results: null,
      value:
        "A single desktop view of interface traffic and connection information, with export capabilities described in the supplied portfolio.",
      evidence:
        "Project overview based on the supplied portfolio. The application source and measured performance were not included.",
    },
    category: "Python application",
    contribution:
      "Python desktop application development, as described in the supplied portfolio.",
    coverAlt:
      "Network monitoring data flow: psutil and Speedtest to a Tkinter interface, CSV and PDF reports.",
  },
];

export const defaultServices = [
  {
    id: "rag-apps",
    title: "RAG application development",
    problem: "Your documents hold useful answers, but finding them takes time.",
    solution:
      "I can build a focused document-querying application using retrieval, a vector database, and an LLM.",
    value: "Give your team a more direct way to explore its information.",
    items: ["RAG", "LangChain", "Qdrant"],
  },
  {
    id: "document-intelligence",
    title: "Document intelligence",
    problem: "PDF content is difficult to reuse inside an application.",
    solution:
      "I can develop document upload, text extraction, preprocessing, and chunking workflows.",
    value:
      "Turn static documents into a foundation for search and AI features.",
    items: ["Python", "PyMuPDF", "Embeddings"],
  },
  {
    id: "ai-backend",
    title: "AI application & API development",
    problem:
      "A model API needs a backend and interface before people can use it.",
    solution:
      "I can connect an LLM workflow to FastAPI endpoints and a React application, including configuration and error handling.",
    value: "Move from an AI idea to a usable application prototype.",
    items: ["FastAPI", "Gemini API", "React"],
  },
];

export const defaultSettings = {
  siteTitle: "Mehmood Khan | AI Engineer & Intelligent Systems Builder",
  siteDescription:
    "Mehmood Khan builds NLP, RAG and LLM applications with Python, FastAPI, Hugging Face embeddings, Qdrant and React. BS CS student at QUEST, graduating 2027.",
  apiBaseUrl: "",
};

export const defaultSkills = [
  {
    id: "s1",
    category: "AI & Machine Learning",
    name: "Artificial Intelligence",
    level: "Working Knowledge",
  },
  {
    id: "s2",
    category: "AI & Machine Learning",
    name: "Machine Learning",
    level: "Working Knowledge",
  },
  {
    id: "s3",
    category: "AI & Machine Learning",
    name: "NLP",
    level: "Working Knowledge",
  },
  {
    id: "s4",
    category: "AI & Machine Learning",
    name: "Generative AI",
    level: "Working Knowledge",
  },
  {
    id: "s5",
    category: "RAG & LLM Engineering",
    name: "Retrieval-Augmented Generation",
    level: "Applied",
  },
  {
    id: "s6",
    category: "RAG & LLM Engineering",
    name: "LLM Applications",
    level: "Applied",
  },
  {
    id: "s7",
    category: "RAG & LLM Engineering",
    name: "Embeddings",
    level: "Applied",
  },
  {
    id: "s8",
    category: "RAG & LLM Engineering",
    name: "Semantic Search",
    level: "Applied",
  },
  {
    id: "s9",
    category: "RAG & LLM Engineering",
    name: "Prompt Engineering",
    level: "Applied",
  },
  {
    id: "s10",
    category: "Agentic AI",
    name: "LangGraph",
    level: "Currently Learning",
  },
  {
    id: "s11",
    category: "Agentic AI",
    name: "AI Agents",
    level: "Currently Learning",
  },
  {
    id: "s12",
    category: "Agentic AI",
    name: "Agentic Workflows",
    level: "Currently Learning",
  },
  {
    id: "s13",
    category: "Backend",
    name: "Python",
    level: "Core",
  },
  {
    id: "s14",
    category: "Backend",
    name: "FastAPI",
    level: "Applied",
  },
  {
    id: "s15",
    category: "Backend",
    name: "REST APIs",
    level: "Applied",
  },
  {
    id: "s16",
    category: "Vector & Data",
    name: "Qdrant",
    level: "Applied",
  },
  {
    id: "s17",
    category: "Vector & Data",
    name: "SQL",
    level: "Core",
  },
  {
    id: "s18",
    category: "Vector & Data",
    name: "Vector Databases",
    level: "Applied",
  },
  {
    id: "s19",
    category: "Frontend",
    name: "React.js",
    level: "Core",
  },
  {
    id: "s20",
    category: "Frontend",
    name: "JavaScript",
    level: "Core",
  },
  {
    id: "s21",
    category: "Frontend",
    name: "Tailwind CSS",
    level: "Core",
  },
  {
    id: "s22",
    category: "RAG & LLM Engineering",
    name: "LangChain",
    level: "Applied",
  },
  {
    id: "s23",
    category: "RAG & LLM Engineering",
    name: "Hugging Face embeddings",
    level: "Applied",
  },
  {
    id: "s24",
    category: "Backend",
    name: "PyMuPDF",
    level: "Applied",
  },
  {
    id: "programming-0",
    category: "Programming",
    name: "Python",
    level: "Core",
  },
  {
    id: "programming-1",
    category: "Programming",
    name: "C",
    level: "Working Knowledge",
  },
  {
    id: "programming-2",
    category: "Programming",
    name: "C++",
    level: "Working Knowledge",
  },
  {
    id: "programming-3",
    category: "Programming",
    name: "C#",
    level: "Working Knowledge",
  },
  {
    id: "programming-4",
    category: "Programming",
    name: "SQL",
    level: "Working Knowledge",
  },
  {
    id: "programming-5",
    category: "Programming",
    name: "Kotlin",
    level: "Working Knowledge",
  },
];

export const skillLevelOrder = [
  "Core",
  "Applied",
  "Working Knowledge",
  "Currently Learning",
  "Exploring",
];

export const defaultCertifications = [
  {
    id: "cert_mtu7qjzg_qai43",
    name: "CSET 2025",
    issuer: "Computer Science Department Quest Nawabshah",
    issueDate: "2025-04-23",
    credentialId: "",
    credentialUrl: "",
    image: "/assets/certifications/cset-2025.jpg",
    skills: [],
  },
];
