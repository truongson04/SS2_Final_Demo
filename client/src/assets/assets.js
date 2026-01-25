export const dummyData = [
  {
    _id: "baongo123",
    title: "Backend Developer Resume",

    updatedAt: "2026-01-24T00:00:00Z",

    contact: {
      location: "Hanoi, Vietnam",
      phone: "0902091204",
      email: "baongo0912@gmail.com",
    },

    objective:
      "To gain practical experience as an aspiring Web Developer, sharpen problem-solving skills, and eventually evolve into a Software Engineer capable of designing scalable system architectures and delivering business value.",

    education: {
      major: "Information Technology",
      university: "Hanoi University",
      startDate: "2022-08",
      endDate: "Present",
    },

    awards: [
      {
        title: "Third Prize - Figma Design Contest",
        organization: "Faculty of Information Technology, Hanoi University",
      },
    ],

    skills: {
      technical: {
        backend: [
          "Spring Boot",
          "Spring Security",
          "Spring Data JPA (Hibernate)",
          "Spring Web (MVC)",
          "Spring WebSocket (STOMP/SockJS)",
        ],
        javaWebFundamentals: ["Servlet API", "JSP", "JDBC"],
        frontend: [
          "Thymeleaf",
          "Bootstrap 5",
          "JavaScript (ES6+)",
          "Fetch API",
        ],
        databaseAndTools: ["MySQL", "Git", "Maven"],
      },
      languages: [
        {
          name: "English",
          level: "TOEIC 750",
        },
      ],
      softSkills: ["Problem-solving", "Proactive", "Self-learning"],
    },

    projects: [
      {
        name: "Recruitment Platform",
        type: "Personal Project",
        role: "Backend Developer",
        teamSize: 2,
        startDate: "2024-05",
        endDate: "2025-12",
        description:
          "A full-stack SaaS job portal with integrated payment systems, analytics, and real-time notifications.",
        keyContributions: [
          "Implemented security using Spring Security with RBAC and configured Session Management",
          "Designed Event-Driven Architecture using Spring Events combined with @Async",
          "Integrated PayOS gateway and ensured data consistency using @Transactional",
          "Built a scheduler system using @Scheduled to update job statuses automatically",
          "Developed real-time notifications using WebSocket (STOMP) and email system with JavaMailSender",
          "Centralized error handling using @RestControllerAdvice",
          "Optimized Search & Filter using JPA Projections, Pagination, and DTO pattern",
        ],
        links: {
          sourceCode: "baongo-cv",
          liveDemo: "https://baongocv.info",
        },
      },
    ],
  },
];
