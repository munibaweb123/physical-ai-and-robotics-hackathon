# Appendix A: Cloud Lab Setup

This appendix provides detailed guides for setting up a robust cloud-based lab environment, specifically focusing on AWS g5.2xlarge instances. In the realm of Physical AI and Humanoid Robotics, local hardware limitations can often become a bottleneck for training large models, running complex simulations, or experimenting with high-fidelity sensory data. Cloud-based workstations offer a scalable and powerful alternative, providing access to cutting-edge GPUs and ample computational resources on demand. These instructions will help you configure a powerful remote workstation that can seamlessly integrate with your local development flow, enabling you to tackle more demanding AI and robotics projects without significant upfront hardware investment.

### Why Choose a Cloud Lab Environment?

Cloud labs offer several compelling advantages for Physical AI development:

*   **Scalability:** Easily scale up or down your computational resources based on project needs, from a single GPU instance for development to multiple GPU instances for distributed training.
*   **Cost-Effectiveness:** Pay-as-you-go models mean you only pay for the resources you consume, avoiding large initial investments in hardware that might become obsolete.
*   **Accessibility:** Access your powerful development environment from anywhere with an internet connection, fostering flexible work arrangements.
*   **Pre-configured Environments:** Many cloud providers offer pre-built images with popular AI and robotics frameworks (CUDA, cuDNN, TensorFlow, PyTorch, ROS), significantly reducing setup time.
*   **Collaboration:** Cloud environments facilitate easier collaboration among team members, as everyone can work on the same powerful infrastructure with consistent configurations.

### AWS g5.2xlarge Instance: A Recommended Choice

The AWS g5.2xlarge instance is an excellent choice for a cloud-based physical AI lab due to its balance of powerful GPU capabilities and cost-effectiveness. It features:

*   **GPU:** One NVIDIA A10G Tensor Core GPU, offering significant acceleration for deep learning training, inference, and compute-intensive simulations.
*   **vCPUs:** 8 virtual CPUs, providing ample processing power for general tasks and data orchestration.
*   **Memory:** 32 GiB of RAM, suitable for medium to large-scale AI models and datasets.
*   **Network Performance:** Up to 10 Gigabit of network bandwidth, ensuring fast data transfer to and from storage.
*   **Storage:** EBS-backed storage, which can be configured for high-performance SSDs to meet I/O demands.

### Step-by-Step Setup Guide

#### 1. AWS Account Setup and Region Selection

If you don't have one, create an AWS account. Ensure you select a region that offers g5 instances and is geographically close to you or your data sources to minimize latency.

#### 2. Launching an EC2 Instance

1.  **Navigate to EC2 Dashboard:** In the AWS Management Console, search for "EC2" and select it.
2.  **Launch Instance:** Click "Launch instances".
3.  **Choose an Amazon Machine Image (AMI):** Search for an NVIDIA Deep Learning AMI or Ubuntu Server AMI. NVIDIA provides AMIs pre-configured with CUDA, cuDNN, and common deep learning frameworks, which can save significant setup time. If choosing a standard Ubuntu AMI, you'll need to manually install NVIDIA drivers, CUDA, and other tools.
4.  **Choose an Instance Type:** Select `g5.2xlarge`.
5.  **Configure Instance Details:**
    *   **Network:** Create a new VPC or use an existing one. Ensure it has a public IP address for internet access.
    *   **Storage:** Add sufficient storage, preferably an SSD (gp3 or io2) with at least 100-200 GB for your OS, tools, and datasets.
    *   **Security Group:** Create a new security group. Allow SSH access (port 22) from your IP address. If you plan to run a graphical desktop environment or specific services, open relevant ports (e.g., VNC ports, custom application ports).
6.  **Review and Launch:** Review your configuration and launch the instance. You will be prompted to create a new key pair or use an existing one. Download the `.pem` file and keep it secure; you'll need it to SSH into your instance.

#### 3. Connecting to Your Instance via SSH

1.  **Change Key Pair Permissions:** On your local machine, open a terminal and run `chmod 400 your-key-pair.pem` to set appropriate permissions for your key file.
2.  **SSH Command:** Connect to your instance using the public IP address or DNS name:
    ```bash
    ssh -i your-key-pair.pem ubuntu@<your-instance-public-ip>
    ```
    (Replace `ubuntu` with `ec2-user` if you chose an Amazon Linux AMI.)

#### 4. Post-Launch Setup (if using a basic Ubuntu AMI)

If you opted for a standard Ubuntu AMI instead of an NVIDIA Deep Learning AMI, you'll need to install NVIDIA drivers and CUDA. (If using an NVIDIA AMI, these steps are largely pre-configured, though updates might be needed.)

1.  **Update System:**
    ```bash
    sudo apt update && sudo apt upgrade -y
    ```
2.  **Install NVIDIA Drivers:** Follow NVIDIA's official documentation for installing drivers on Ubuntu. This typically involves adding NVIDIA repositories and installing `nvidia-driver-XXX`.
3.  **Install CUDA Toolkit:** Download and install the CUDA Toolkit from NVIDIA's website. Ensure the version is compatible with your installed drivers and desired AI frameworks.
4.  **Install cuDNN:** cuDNN (CUDA Deep Neural Network library) is essential for accelerating deep learning. Install it according to NVIDIA's instructions.
5.  **Install AI Frameworks:** Install TensorFlow, PyTorch, and other necessary libraries. Using Miniconda or Anaconda is highly recommended for managing Python environments and dependencies.
    ```bash
    wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
    bash Miniconda3-latest-Linux-x86_64.sh
    source ~/.bashrc
    conda create -n robotics python=3.10
    conda activate robotics
    pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118 # Example for PyTorch
    ```

#### 5. Installing ROS 2 and Other Robotics Tools

Follow the official ROS 2 documentation for installing your chosen distribution (e.g., Humble, Iron) on Ubuntu 22.04. This typically involves adding ROS repositories, installing core packages, and setting up your environment.

*   **ROS 2 Installation:**
    ```bash
    sudo apt install software-properties-common
    sudo add-apt-repository universe
    sudo apt update && sudo apt install curl -y
    sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(. /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null
    sudo apt update
    sudo apt upgrade -y
    sudo apt install ros-humble-desktop -y # Or your desired distribution
    ```
*   **Development Tools:** Install `colcon-common-extensions`, `git`, `build-essential`, `cmake`, and other tools required for compiling ROS 2 workspaces.

### Remote Desktop (Optional)

For a graphical interface, you can set up a remote desktop environment using VNC or NoMachine. This allows you to interact with your cloud instance's desktop as if it were local.

*   **Install Desktop Environment:**
    ```bash
    sudo apt install ubuntu-desktop # Or xfce4 for a lighter environment
    ```
*   **Install and Configure VNC Server:** Install `tightvncserver` or `x11vnc` and configure it to start on boot. Remember to open the VNC port (e.g., 5901) in your AWS security group.

By following these steps, you will establish a powerful and flexible cloud lab environment on AWS, ready to accelerate your Physical AI and Humanoid Robotics development.