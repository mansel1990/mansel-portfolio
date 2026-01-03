export interface CaseStudy {
  id: string;
  title: string;
  role: string;
  duration: string;
  tags: string[];
  challenge: string;
  solution: string;
  impact: {
    metric: string;
    value: string;
    description: string;
  }[];
  accentColor: "cyan" | "purple" | "emerald";
}

export const caseStudies: CaseStudy[] = [
  {
    id: "hcl-admin-portal",
    title: "Enterprise Admin Portal Optimization",
    role: "Senior Software Engineer",
    duration: "HCL Technologies (2017-2019)",
    tags: ["React", "Java", "ExtJS", "Performance"],
    challenge:
      "Legacy enterprise admin portal was causing inefficiencies during peak seasons, with slow data migration processes and outdated ExtJS codebase limiting scalability and user experience.",
    solution:
      "Developed high-performance features for the admin portal with focus on efficiency optimization. Designed and implemented a single-click solution for migrating Excel data into applications. Led POC for upgrading legacy ExtJS pages to modern ReactJS framework.",
    impact: [
      {
        metric: "Cost Savings",
        value: "$1M",
        description: "Annual savings during peak seasons",
      },
      {
        metric: "Data Migration",
        value: "1-Click",
        description: "Excel to app migration",
      },
      {
        metric: "Tech Upgrade",
        value: "ExtJS→React",
        description: "Successful POC delivery",
      },
    ],
    accentColor: "cyan",
  },
  {
    id: "revcomm-csv-processing",
    title: "High-Performance CSV Data Processing",
    role: "Senior Frontend Engineer",
    duration: "Revcomm Inc. (2023-2024)",
    tags: ["TypeScript", "React", "Performance", "Data Processing"],
    challenge:
      "International merchants needed to process massive CSV files with tens of thousands of rows, but existing solutions were slow and unreliable, hindering merchant acquisition and user satisfaction.",
    solution:
      "Engineered a unique high-performance feature capable of processing CSV files with over 30,000 data rows in under 1 second using advanced optimization techniques. Led a team of 4 developers to establish reliable release schedules and project predictability.",
    impact: [
      {
        metric: "Processing Speed",
        value: "<1 sec",
        description: "30,000+ rows processed",
      },
      {
        metric: "Merchant Growth",
        value: "New Sign-ups",
        description: "Key role in attracting merchants",
      },
      {
        metric: "Team Leadership",
        value: "4 Developers",
        description: "Established release schedule",
      },
    ],
    accentColor: "purple",
  },
  {
    id: "state-street-framework",
    title: "Reusable React Framework for Financial Services",
    role: "Tech Lead",
    duration: "State Street (2019-2022)",
    tags: ["React", "Java", "Architecture", "Framework"],
    challenge:
      "Multiple teams at State Street were building React applications from scratch without standardization, leading to inconsistent code quality, duplicated effort, and lack of best practices across projects.",
    solution:
      "Architected and developed a comprehensive reusable React framework for UI management and project bootstrapping. Provided technical leadership by guiding multiple teams on React best practices and architectural considerations. Developed RESTful APIs in Java with rigorous code reviews.",
    impact: [
      {
        metric: "Framework Adoption",
        value: "6 Projects",
        description: "Adopted the framework",
      },
      {
        metric: "Team Leadership",
        value: "Multiple Teams",
        description: "Guided on best practices",
      },
      {
        metric: "Code Quality",
        value: "Rigorous Reviews",
        description: "Java & React standards",
      },
    ],
    accentColor: "emerald",
  },
];
