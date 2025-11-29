# Data Model: Sidebar & Frontmatter Updates

## Sidebar Structure (`sidebars.ts`)

Updated to reflect the Module-based grouping while keeping the file-based order.

```typescript
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    // ... Intro & Hardware sections unchanged ...
    {
      type: 'category',
      label: 'Foundations',
      items: ['modules/week1-2-foundations'],
    },
    {
      type: 'category',
      label: 'Module 1: ROS 2 System',
      items: ['modules/week3-5-ros2'],
    },
    {
      type: 'category',
      label: 'Module 2: Digital Twin',
      items: ['modules/week6-7-simulation'],
    },
    {
      type: 'category',
      label: 'Module 3: Isaac & Humanoids',
      items: [
        'modules/week8-10-isaac',
        'modules/week11-12-humanoid'
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Vision-Language-Action',
      items: ['modules/week13-conversational'],
    },
    // ... Assessments unchanged ...
  ],
};
```

## Page Frontmatter Updates

### `week3-5-ros2.md`
```yaml
title: "Module 1: The Robotic Nervous System"
sidebar_label: "Module 1: ROS 2"
description: "Building the nervous system of a robot using ROS 2 nodes and topics."
```

### `week6-7-simulation.md`
```yaml
title: "Module 2: The Digital Twin"
sidebar_label: "Module 2: Simulation"
description: "Simulating physics and sensors in Gazebo and Unity."
```

### `week8-10-isaac.md`
```yaml
title: "Module 3: The AI-Robot Brain"
sidebar_label: "Module 3: Isaac Platform"
description: "Advanced perception with NVIDIA Isaac Sim and ROS."
```

### `week13-conversational.md`
```yaml
title: "Module 4: Vision-Language-Action"
sidebar_label: "Module 4: VLA"
description: "Integrating LLMs and Whisper for conversational robotics."
```
