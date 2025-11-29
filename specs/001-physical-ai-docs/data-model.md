# Information Architecture (Data Model)

## Sidebar Structure (`sidebars.js`)

The documentation is organized into a sequential learning path.

```javascript
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Section 0: Introduction',
      items: ['intro/why-physical-ai', 'intro/core-objectives'],
    },
    {
      type: 'category',
      label: 'Section 1: Hardware Setup',
      items: [
        'hardware/requirements', // Workstation vs Edge
        'hardware/edge-kit',     // Jetson setup
        'hardware/robot-lab',    // Robot options
        'hardware/cloud-vs-local' // Cost analysis
      ],
    },
    {
      type: 'category',
      label: 'Section 2: Foundations',
      items: ['modules/week1-2-foundations'],
    },
    {
      type: 'category',
      label: 'Section 3: ROS 2 Fundamentals',
      items: ['modules/week3-5-ros2'],
    },
    {
      type: 'category',
      label: 'Section 4: Robot Simulation',
      items: ['modules/week6-7-simulation'],
    },
    {
      type: 'category',
      label: 'Section 5: NVIDIA Isaac Platform',
      items: ['modules/week8-10-isaac'],
    },
    {
      type: 'category',
      label: 'Section 6: Humanoid Development',
      items: ['modules/week11-12-humanoid'],
    },
    {
      type: 'category',
      label: 'Section 7: Conversational Robotics',
      items: ['modules/week13-conversational'],
    },
    {
      type: 'category',
      label: 'Section 8: Assessments',
      items: ['assessments/projects'],
    },
  ],
};
```

## Key Page Schemas

### Hardware Page
- **Title**: String
- **Type**: "Training" | "Inference" | "Robot"
- **Specs**:
  - GPU: String
  - CPU: String
  - RAM: String
- **Admonitions**: Warning/Danger blocks

### Module Page
- **Title**: String (Week X-Y)
- **Learning Outcomes**: List<String>
- **Topics**: List<String>
- **Exercises**: List<String>
- **Diagrams**: Mermaid Code
