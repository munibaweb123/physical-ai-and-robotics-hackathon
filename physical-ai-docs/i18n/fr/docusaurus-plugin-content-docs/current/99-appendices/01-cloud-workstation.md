# Annexe A : Configuration du Laboratoire Cloud

Cette annexe fournit des guides détaillés pour configurer un environnement de laboratoire robuste basé sur le cloud, en se concentrant spécifiquement sur les instances AWS g5.2xlarge. Dans le domaine de l'IA Physique et de la Robotique Humanoïde, les limitations matérielles locales peuvent souvent devenir un goulot d'étranglement pour l'entraînement de grands modèles, l'exécution de simulations complexes ou l'expérimentation avec des données sensorielles de haute fidélité. Les stations de travail basées sur le cloud offrent une alternative évolutive et puissante, fournissant un accès à la pointe des GPU et des ressources computationnelles abondantes à la demande. Ces instructions vous aideront à configurer une station de travail distante puissante qui peut s'intégrer parfaitement à votre flux de développement local, vous permettant de relever des projets d'IA et de robotique plus exigeants sans investissement matériel initial significatif.

### Pourquoi Choisir un Environnement de Laboratoire Cloud ?

Les laboratoires cloud offrent plusieurs avantages convaincants pour le développement de l'IA Physique :

*   **Évolutivité :** Augmentez ou réduisez facilement vos ressources computationnelles en fonction des besoins du projet, d'une instance GPU unique pour le développement à plusieurs instances GPU pour l'entraînement distribué.
*   **Rentabilité :** Les modèles de paiement à l'utilisation signifient que vous ne payez que pour les ressources que vous consommez, évitant ainsi de gros investissements initiaux dans du matériel qui pourrait devenir obsolète.
*   **Accessibilité :** Accédez à votre puissant environnement de développement depuis n'importe où avec une connexion Internet, favorisant des arrangements de travail flexibles.
*   **Environnements Préconfigurés :** De nombreux fournisseurs cloud offrent des images préconstruites avec des frameworks populaires d'IA et de robotique (CUDA, cuDNN, TensorFlow, PyTorch, ROS), réduisant considérablement le temps de configuration.
*   **Collaboration :** Les environnements cloud facilitent une collaboration plus facile entre les membres de l'équipe, car tout le monde peut travailler sur la même infrastructure puissante avec des configurations cohérentes.

### Instance AWS g5.2xlarge : Un Choix Recommandé

L'instance AWS g5.2xlarge est un excellent choix pour un laboratoire d'IA physique basé sur le cloud en raison de son équilibre entre capacités GPU puissantes et rentabilité. Elle propose :

*   **GPU :** Un GPU NVIDIA A10G Tensor Core, offrant une accélération significative pour l'entraînement en apprentissage profond, l'inférence et les simulations intensives en calcul.
*   **vCPUs :** 8 vCPUs, fournissant une puissance de traitement suffisante pour les tâches générales et l'orchestration des données.
*   **Mémoire :** 32 GiB de RAM, adaptée aux modèles et ensembles de données d'IA de taille moyenne à grande.
*   **Performance Réseau :** Jusqu'à 10 Gigabits de bande passante réseau, assurant un transfert rapide des données vers et depuis le stockage.
*   **Stockage :** Stockage soutenu par EBS, qui peut être configuré pour des SSD haute performance pour répondre aux exigences d'E/S.

### Guide de Configuration Étape par Étape

#### 1. Configuration du Compte AWS et Sélection de la Région

Si vous n'en avez pas, créez un compte AWS. Assurez-vous de sélectionner une région qui offre des instances g5 et qui est géographiquement proche de vous ou de vos sources de données pour minimiser la latence.

#### 2. Lancement d'une Instance EC2

1.  **Naviguer vers le Tableau de Bord EC2 :** Dans la Console de Gestion AWS, recherchez "EC2" et sélectionnez-le.
2.  **Lancer une Instance :** Cliquez sur "Lancer des instances".
3.  **Choisir une Image Machine Amazon (AMI) :** Recherchez une AMI NVIDIA Deep Learning ou une AMI Ubuntu Server. NVIDIA fournit des AMI préconfigurées avec CUDA, cuDNN et des frameworks d'apprentissage profond courants, ce qui peut faire gagner beaucoup de temps de configuration. Si vous choisissez une AMI Ubuntu standard, vous devrez installer manuellement les pilotes NVIDIA, CUDA et d'autres outils.
4.  **Choisir un Type d'Instance :** Sélectionnez `g5.2xlarge`.
5.  **Configurer les Détails de l'Instance :**
    *   **Réseau :** Créez un nouveau VPC ou utilisez-en un existant. Assurez-vous qu'il dispose d'une adresse IP publique pour l'accès Internet.
    *   **Stockage :** Ajoutez un stockage suffisant, de préférence un SSD (gp3 ou io2) avec au moins 100-200 Go pour votre OS, vos outils et vos ensembles de données.
    *   **Groupe de Sécurité :** Créez un nouveau groupe de sécurité. Autorisez l'accès SSH (port 22) depuis votre adresse IP. Si vous prévoyez d'exécuter un environnement de bureau graphique ou des services spécifiques, ouvrez les ports pertinents (par exemple, ports VNC, ports d'application personnalisés).
6.  **Revoir et Lancer :** Passez en revue votre configuration et lancez l'instance. Vous serez invité à créer une nouvelle paire de clés ou à en utiliser une existante. Téléchargez le fichier `.pem` et gardez-le en sécurité ; vous en aurez besoin pour vous connecter en SSH à votre instance.

#### 3. Connexion à Votre Instance via SSH

1.  **Changer les Permissions de la Paire de Clés :** Sur votre machine locale, ouvrez un terminal et exécutez `chmod 400 your-key-pair.pem` pour définir les permissions appropriées pour votre fichier de clé.
2.  **Commande SSH :** Connectez-vous à votre instance en utilisant l'adresse IP publique ou le nom DNS :
    ```bash
    ssh -i your-key-pair.pem ubuntu@<your-instance-public-ip>
    ```
    (Remplacez `ubuntu` par `ec2-user` si vous avez choisi une AMI Amazon Linux.)

#### 4. Configuration Post-Lancement (si vous utilisez une AMI Ubuntu de base)

Si vous avez opté pour une AMI Ubuntu standard au lieu d'une AMI NVIDIA Deep Learning, vous devrez installer les pilotes NVIDIA et CUDA. (Si vous utilisez une AMI NVIDIA, ces étapes sont en grande partie préconfigurées, bien que des mises à jour puissent être nécessaires.)

1.  **Mettre à Jour le Système :**
    ```bash
    sudo apt update && sudo apt upgrade -y
    ```
2.  **Installer les Pilotes NVIDIA :** Suivez la documentation officielle de NVIDIA pour installer les pilotes sur Ubuntu. Cela implique généralement d'ajouter les dépôts NVIDIA et d'installer `nvidia-driver-XXX`.
3.  **Installer le Kit d'Outils CUDA :** Téléchargez et installez le Kit d'Outils CUDA depuis le site de NVIDIA. Assurez-vous que la version est compatible avec vos pilotes installés et les frameworks d'IA souhaités.
4.  **Installer cuDNN :** cuDNN (CUDA Deep Neural Network library) est essentiel pour accélérer l'apprentissage profond. Installez-le selon les instructions de NVIDIA.
5.  **Installer les Frameworks d'IA :** Installez TensorFlow, PyTorch et d'autres bibliothèques nécessaires. L'utilisation de Miniconda ou Anaconda est fortement recommandée pour gérer les environnements Python et les dépendances.
    ```bash
    wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
    bash Miniconda3-latest-Linux-x86_64.sh
    source ~/.bashrc
    conda create -n robotics python=3.10
    conda activate robotics
    pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118 # Exemple pour PyTorch
    ```

#### 5. Installation de ROS 2 et d'Autres Outils de Robotique

Suivez la documentation officielle de ROS 2 pour installer votre distribution choisie (par exemple, Humble, Iron) sur Ubuntu 22.04. Cela implique généralement d'ajouter les dépôts ROS, d'installer les packages de base et de configurer votre environnement.

*   **Installation de ROS 2 :**
    ```bash
    sudo apt install software-properties-common
    sudo add-apt-repository universe
    sudo apt update && sudo apt install curl -y
    sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(. /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null
    sudo apt update
    sudo apt upgrade -y
    sudo apt install ros-humble-desktop -y # Ou votre distribution souhaitée
    ```
*   **Outils de Développement :** Installez `colcon-common-extensions`, `git`, `build-essential`, `cmake`, et d'autres outils nécessaires pour compiler des espaces de travail ROS 2.

### Bureau à Distance (Optionnel)

Pour une interface graphique, vous pouvez configurer un environnement de bureau à distance en utilisant VNC ou NoMachine. Cela vous permet d'interagir avec le bureau de votre instance cloud comme s'il était local.

*   **Installer l'Environnement de Bureau :**
    ```bash
    sudo apt install ubuntu-desktop # Ou xfce4 pour un environnement plus léger
    ```
*   **Installer et Configurer le Serveur VNC :** Installez `tightvncserver` ou `x11vnc` et configurez-le pour démarrer au démarrage. N'oubliez pas d'ouvrir le port VNC (par exemple, 5901) dans votre groupe de sécurité AWS.

En suivant ces étapes, vous établirez un environnement de laboratoire cloud puissant et flexible sur AWS, prêt à accélérer votre développement en IA Physique et Robotique Humanoïde.