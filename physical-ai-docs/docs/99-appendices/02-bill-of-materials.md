# Appendix B: Hardware BOM

This appendix provides a comprehensive Bill of Materials (BOM) for an economy Jetson Student Kit, designed to offer an accessible and cost-effective entry point into physical AI and humanoid robotics. While the course covers advanced platforms and complex humanoid concepts, building a hands-on, functional robot with affordable components is crucial for practical learning and experimentation. This BOM lists all necessary hardware components for constructing a basic yet capable physical AI platform, suitable for educational purposes and prototyping fundamental robotics principles. It focuses on balancing performance with budget, making it an ideal choice for students and hobbyists looking to get started without significant financial outlay.

### Philosophy of the Economy Jetson Student Kit

The design philosophy behind this kit is to maximize learning outcomes per dollar spent. It prioritizes components that are:

*   **Affordable:** Sourced from common online retailers or electronics suppliers to keep costs low.
*   **Accessible:** Components that are relatively easy to acquire and assemble, suitable for those with basic electronics knowledge.
*   **Modular:** Components that can be easily swapped, upgraded, or integrated into different robotic configurations.
*   **ROS 2 Compatible:** Hardware that integrates well with the ROS 2 ecosystem, allowing for seamless software development.
*   **Capable:** Sufficiently powerful to run basic AI inference tasks, sensor processing, and motor control.

### Core Components of the Jetson Student Kit

#### 1. Compute Module: NVIDIA Jetson Orin Nano Developer Kit

This is the brain of your robot, providing the necessary computational power for AI and robotics applications. The Orin Nano offers significant AI performance at the edge.

*   **NVIDIA Jetson Orin Nano Developer Kit (8GB/4GB):** The developer kit includes the Jetson Orin Nano module, a carrier board with various I/O (USB, Ethernet, HDMI, MIPI CSI camera connectors), and a power supply. The 8GB version is recommended for slightly more complex AI models, but the 4GB version is also highly capable for basic tasks. *Approximate Cost: $199 - $499*

#### 2. Mobile Base and Actuation

A basic mobile base allows your robot to move and navigate. For an economy kit, a simple wheeled differential drive platform is often the most practical.

*   **Chassis:** A simple acrylic or aluminum chassis kit for a two-wheel drive robot. Many affordable options are available online. *Approximate Cost: $30 - $70*
*   **DC Geared Motors (x2):** Two 6V or 12V DC geared motors with encoders. Encoders are crucial for odometry (measuring distance traveled and orientation) and precise motor control. *Approximate Cost: $20 - $40 per motor*
*   **Motor Driver:** A dual H-bridge motor driver (e.g., L298N module or a more modern DRV8833/DRV8871-based driver). This allows the Jetson to control the speed and direction of the DC motors. *Approximate Cost: $10 - $20*
*   **Wheels (x2) and Caster Wheel (x1):** Appropriate wheels for your chosen chassis and a free-rolling caster wheel for stability. *Approximate Cost: $15 - $30*

#### 3. Power System

Reliable power delivery is essential for mobile robots. Careful consideration of battery capacity and voltage is crucial.

*   **LiPo Battery (e.g., 3S 11.1V, 3000-5000mAh):** Lithium Polymer batteries offer a good balance of energy density and discharge rate. A 3S (3-cell in series) battery provides 11.1V nominal, suitable for many motor drivers and a common voltage for robotics. Choose a capacity that provides sufficient runtime for your experiments. *Approximate Cost: $30 - $60*
*   **Battery Charger:** A compatible LiPo balance charger is absolutely critical for safe charging and maintaining battery health. **WARNING:** LiPo batteries can be dangerous if mishandled. Always follow safety guidelines. *Approximate Cost: $20 - $50*
*   **DC-DC Buck Converter (Step-Down):** A buck converter (e.g., LM2596 module or similar) to step down the battery voltage (e.g., 11.1V) to 5V for powering the Jetson Orin Nano, and potentially other 3.3V/5V sensors. *Approximate Cost: $5 - $15*
*   **Power Distribution Board (Optional but Recommended):** A simple board to neatly distribute power from the battery to the buck converter, motor driver, and other components. *Approximate Cost: $10 - $20*

#### 4. Basic Sensing

Even an economy kit can incorporate essential sensors for basic perception and interaction.

*   **USB Camera:** A low-cost USB webcam (e.g., Logitech C920 or similar) for visual perception. This will allow for basic object detection, line following, or visual odometry. *Approximate Cost: $20 - $50*
*   **Ultrasonic Distance Sensor (e.g., HC-SR04 x2):** These inexpensive sensors provide basic obstacle detection, crucial for avoiding collisions. *Approximate Cost: $5 - $10 per sensor*
*   **IMU (e.g., MPU6050/MPU9250 Breakout Board):** An Inertial Measurement Unit provides acceleration and angular velocity data, useful for estimating robot orientation and detecting movements. *Approximate Cost: $10 - $20*

#### 5. Miscellaneous Hardware

*   **Jumper Wires (Male-Male, Male-Female, Female-Female):** Essential for connecting all components without soldering initially. *Approximate Cost: $10 - $20*
*   **Breadboard:** For prototyping sensor connections and small circuits. *Approximate Cost: $5 - $10*
*   **USB Hub (Powered, Optional):** If you plan to connect multiple USB devices (camera, keyboard, mouse) to your Jetson.
*   **SD Card (64GB+):** For flashing the JetPack OS onto the Jetson module if it's not the developer kit version.
*   **Basic Tools:** Screwdriver set, wire strippers, multimeter, heat shrink tubing (if soldering). *Approximate Cost: Variable*

### Total Estimated Cost (Excluding Tools & Shipping)

Roughly **$400 - $800**, depending on the specific component choices, sales, and whether you opt for the 4GB or 8GB Jetson Orin Nano Developer Kit.

This economy kit provides a solid foundation for learning about mobile robotics, sensor integration, basic navigation, and deploying AI models at the edge. It serves as an excellent platform to apply the concepts taught in this course before venturing into more complex and expensive humanoid platforms.