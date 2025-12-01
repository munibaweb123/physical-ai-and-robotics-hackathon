# Annexe C : Dépannage

Cette annexe offre des conseils de dépannage complets et des solutions courantes pour les problèmes fréquemment rencontrés lors du développement ROS 2 sur les environnements Linux (Ubuntu) et, moins couramment mais toujours pertinents, Windows. Le développement en robotique est intrinsèquement complexe, impliquant des configurations logicielles complexes, des interactions matérielles et un traitement en temps réel. Les problèmes sont inévitables, mais avec une approche systématique et une connaissance des pièges courants, la plupart peuvent être résolus efficacement. Ce guide couvre les erreurs courantes, fournit des étapes concrètes pour le diagnostic et offre des solutions pour vous aider à surmonter les obstacles techniques efficacement, assurant une expérience d'apprentissage et de développement plus fluide.

### Philosophie générale du dépannage ROS 2

Avant de plonger dans des problèmes spécifiques, adoptez une approche structurée du dépannage :

1.  **Vérifiez les bases :** Le robot est-il allumé ? Tous les câbles sont-ils connectés de manière sécurisée ? Les paramètres réseau sont-ils corrects (adresses IP, règles de pare-feu) ?
2.  **Vérifiez l'environnement ROS 2 :** Votre environnement ROS 2 est-il correctement sourcé (`source /opt/ros/<distro>/setup.bash` et `source ~/ros2_ws/install/setup.bash`) ?
3.  **Utilisez les outils ROS 2 :** Exploitez `ros2 run`, `ros2 topic list`, `ros2 node list`, `ros2 param list`, `ros2 interface show`, `ros2 log` pour inspecter le système en cours d'exécution.
4.  **Examinez les journaux :** Vérifiez toujours la sortie du terminal et `ros2 log` pour les messages d'erreur, les avertissements et les messages d'information.
5.  **Isolez le problème :** Essayez de réduire le problème à un nœud, un paquet, un capteur ou une commande spécifique.
6.  **Consultez la documentation et la communauté :** La documentation officielle de ROS 2, ROS Answers et les forums communautaires sont des ressources inestimables.

### Problèmes courants et solutions sur Linux (Ubuntu)

Ubuntu est l'environnement de développement principal pour ROS 2, mais même ici, des problèmes peuvent survenir.

#### 1. Commande `ros2` non trouvée / Environnement non sourcé

*   **Problème :** Après avoir ouvert un nouveau terminal, les commandes `ros2` ne fonctionnent pas.
*   **Diagnostic :** `echo $ROS_DISTRO` devrait afficher votre distribution ROS (par exemple, `humble`). Si vide, l'environnement n'est pas sourcé.
*   **Solution :** Assurez-vous de sourcer votre environnement ROS 2 dans chaque nouveau terminal ou ajoutez-le à votre fichier `~/.bashrc` (ou `~/.zshrc`) :
    ```bash
    source /opt/ros/<ros2_distro>/setup.bash
    # Si vous avez un espace de travail, sourcez-le également :
    # source ~/ros2_ws/install/setup.bash
    ```
    Après avoir modifié `~/.bashrc`, exécutez `source ~/.bashrc`.

#### 2. Paquet non trouvé / Échec de la construction

*   **Problème :** `ros2 run <package> <executable>` échoue, ou `colcon build` rencontre des erreurs.
*   **Diagnostic :** Vérifiez si le paquet est dans votre espace de travail et correctement sourcé. Pour les erreurs de construction, lisez attentivement la sortie de `colcon build`, en particulier les premières lignes d'erreur.
*   **Solution :**
    *   Assurez-vous que votre espace de travail ROS 2 est sourcé *après* l'installation principale de ROS 2.
    *   Vérifiez que les dépendances du paquet sont installées (`rosdep install --from-paths src --ignore-src -r -y`).
    *   Vérifiez `package.xml` pour les dépendances et types de construction corrects.
    *   Pour les paquets Python, assurez-vous que `setup.py` (ou `setup.cfg`) est correctement configuré.
    *   Nettoyez votre espace de construction : `rm -rf install log build && colcon build`.

#### 3. Problèmes de compatibilité RMW (ROS Middleware)

*   **Problème :** Les nœuds ne peuvent pas communiquer, ou vous voyez des avertissements/erreurs liés à `RMW` (par exemple, "Échec de la création du publisher").
*   **Diagnostic :** Différentes installations de ROS 2 peuvent par défaut utiliser différentes implémentations RMW (par exemple, Fast DDS, Cyclone DDS). Tous les nœuds d'un système devraient idéalement utiliser le même RMW ou être compatibles.
*   **Solution :** Définissez explicitement l'implémentation RMW à l'aide d'une variable d'environnement :
    ```bash
    export RMW_IMPLEMENTATION=rmw_fastrtps_cpp # Ou rmw_cyclonedds_cpp
    ```
    Ajoutez cela à votre `~/.bashrc` si c'est un problème persistant.

#### 4. Problèmes de permissions (par exemple, règles `udev`, ports série)

*   **Problème :** Le matériel du robot (par exemple, convertisseurs USB-série pour microcontrôleurs, caméra) n'est pas détecté ou génère des erreurs "permission denied".
*   **Diagnostic :** Vérifiez `ls /dev/tty*` pour les appareils série ou `ls /dev/video*` pour les caméras. `dmesg | grep tty` peut montrer des informations de connexion de l'appareil. Si un appareil existe mais que vous ne pouvez pas y accéder, c'est probablement un problème de permission.
*   **Solution :** Ajoutez votre utilisateur aux groupes appropriés (par exemple, `dialout` pour série, `video` pour caméras) :
    ```bash
    sudo usermod -a -G dialout $USER
    sudo usermod -a -G video $USER
    # Puis déconnectez-vous et reconnectez-vous (ou redémarrez) pour que les changements prennent effet.
    ```
    Pour les appareils USB personnalisés, vous devrez peut-être écrire des règles `udev`.

#### 5. Performance / Lag de la simulation Gazebo

*   **Problème :** Gazebo fonctionne très lentement, surtout avec des modèles de robots complexes ou de nombreux objets.
*   **Diagnostic :** Vérifiez vos pilotes GPU (NVIDIA recommandé), assurez-vous que Gazebo utilise un backend de rendu accéléré par le matériel, et examinez vos modèles de monde/robot pour une complexité inutile.
*   **Solution :**
    *   **Pilotes NVIDIA :** Assurez-vous que les derniers pilotes NVIDIA stables sont installés et fonctionnent.
    *   **Simplifiez les modèles :** Réduisez le nombre de polygones des maillages, utilisez des géométries de collision plus simples et retirez les détails visuels inutiles pour les objets qui n'en ont pas besoin.
    *   **Réduisez le taux de physique :** Ajustez le `max_step_size` et `update_rate` dans votre fichier `.world`.
    *   **Désactivez les capteurs inutiles :** Si non nécessaires pour le test actuel, désactivez les capteurs à haute fréquence.
    *   **Exécutez Gazebo sans interface graphique (Headless) :** Pour l'entraînement ou les tests automatisés, exécutez Gazebo en mode headless pour de meilleures performances.

### Problèmes courants et solutions sur Windows (moins courant pour ROS 2)

Bien que ROS 2 prenne en charge Windows, il est moins courant pour le développement robotique à grande échelle, et vous pourriez rencontrer des problèmes plus uniques.

#### 1. Défis d'installation

*   **Problème :** Difficulté à installer ROS 2, ses dépendances, ou à rencontrer des erreurs de compilation.
*   **Diagnostic :** Les environnements Windows peuvent avoir des limites de longueur de chemin plus strictes et une gestion différente des bibliothèques par rapport à Linux. Assurez-vous que toutes les conditions préalables sont remplies, en particulier les versions de Python, Visual Studio et CMake.
*   **Solution :**
    *   **Suivez les documents officiels précisément :** Respectez strictement le guide d'installation officiel de ROS 2 sur Windows.
    *   **Utilisez Chocolatey :** De nombreuses dépendances peuvent être installées via Chocolatey, un gestionnaire de paquets pour Windows.
    *   **Invite de commande pour développeurs :** Utilisez toujours "x64 Native Tools Command Prompt for VS" (ou similaire) pour vous assurer que tous les outils de construction nécessaires et les variables d'environnement sont correctement définis.
    *   **Longueur de chemin :** Installez ROS 2 dans un chemin court (par exemple, `C:\ros2`).

#### 2. Problèmes de réseau / pare-feu

*   **Problème :** Les nœuds ROS 2 ne peuvent pas communiquer entre différentes machines ou même localement.
*   **Diagnostic :** Le pare-feu Windows peut bloquer agressivement le trafic réseau. DDS (la couche de communication sous-jacente pour ROS 2) repose sur les ports UDP/TCP.
*   **Solution :**
    *   **Désactivez le pare-feu (temporairement) :** Pour les tests, désactivez temporairement le pare-feu Windows pour voir si cela résout le problème. Réactivez-le et ajoutez des règles spécifiques pour les applications ROS 2 et les ports DDS.
    *   **Profils réseau :** Assurez-vous que votre profil réseau est défini sur "Privé" plutôt que "Public" pour des règles de pare-feu plus souples au sein de votre réseau local.
    *   **RMW_IMPLEMENTATION :** Définissez explicitement `RMW_IMPLEMENTATION` (comme décrit pour Linux) pour assurer la cohérence.

#### 3. Différences de performance

*   **Problème :** Les applications ou simulations ROS 2 fonctionnent plus lentement sur Windows par rapport à Linux sur du matériel similaire.
*   **Diagnostic :** Windows a généralement une surcharge plus élevée pour les appels système et la gestion des processus, et l'optimisation des pilotes graphiques pour les outils robotiques peut être moins mature.
*   **Solution :** Optimisez votre code, simplifiez les modèles et assurez-vous que les processus en arrière-plan sont minimisés. Pour les tâches critiques sensibles aux performances, envisagez d'utiliser un environnement Linux (double démarrage ou WSL2). WSL2 (Windows Subsystem for Linux 2) peut offrir un bon équilibre, vous permettant d'exécuter un noyau Linux complet et des applications ROS 2 avec des performances quasi natives tout en utilisant Windows comme votre système d'exploitation hôte.

En comprenant ces scénarios de dépannage courants et en appliquant des étapes de diagnostic systématiques, vous pouvez résoudre efficacement la plupart des problèmes rencontrés dans votre parcours de développement en IA physique et robotique humanoïde.