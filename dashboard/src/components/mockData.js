// mockData.js
export const mockProjects = [
    {
      id: 'proj_1',
      name: 'Project 1',
      template: 'default',
      projects: 'projects', // This seems to be a category
      context: 'My new project description goes here',
      url: 'https://example.com/project1',
    },
    {
      id: 'proj_2',
      name: 'Project 2',
      template: 'custom',
      projects: 'projects',
      context: 'Another project description',
      url: 'https://example.com/project2',
    },
    {
      id: 'proj_3',
      name: 'Project 3',
      template: 'default',
      projects: 'projects',
      context: 'Third project description',
      url: 'https://example.com/project3',
    }
  ];
  
  export const mockFragments = [
    {
      id: 'frag_1',
      projectId: 'proj_1', // This links fragments to projects
      name: 'Fragment 1',
      template: 'default',
      category: 'projects',
      context: 'This fragment explores the basics of quantum computing and its applications in modern technology.',
      url: 'https://example.com/fragment1',
    },
    {
      id: 'frag_2',
      projectId: 'proj_1',
      name: 'Fragment 2',
      template: 'custom',
      category: 'projects',
      context: 'A deep dive into machine learning algorithms and their use cases in data analysis.',
      url: 'https://example.com/fragment2',
    },
    {
      id: 'frag_3',
      projectId: 'proj_1',
      name: 'Fragment 3',
      template: 'default',
      category: 'projects',
      context: 'An overview of blockchain technology and its impact on financial systems.',
      url: 'https://example.com/fragment3',
    },
    {
      id: 'frag_4',
      projectId: 'proj_2',
      name: 'Fragment 4',
      template: 'custom',
      category: 'projects',
      context: 'Exploring the role of artificial intelligence in healthcare diagnostics.',
      url: 'https://example.com/fragment4',
    },
    {
      id: 'frag_5',
      projectId: 'proj_2',
      name: 'Fragment 5',
      template: 'default',
      category: 'projects',
      context: 'A study on renewable energy sources and their potential to replace fossil fuels.',
      url: 'https://example.com/fragment5',
    },
    {
      id: 'frag_6',
      projectId: 'proj_3',
      name: 'Fragment 6',
      template: 'custom',
      category: 'projects',
      context: 'The evolution of cybersecurity measures in the era of IoT and cloud computing.',
      url: 'https://example.com/fragment6',
    },
  ];