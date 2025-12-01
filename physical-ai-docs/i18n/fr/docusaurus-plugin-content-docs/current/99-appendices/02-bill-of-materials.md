# Annexe B : Liste de Matériel (BOM)

Cette annexe fournit une liste de matériel complète pour un kit étudiant Jetson économique, conçu pour offrir un point d'entrée accessible et rentable dans l'IA physique et la robotique humanoïde. Bien que le cours couvre des plateformes avancées et des concepts humanoïdes complexes, construire un robot fonctionnel et pratique avec des composants abordables est crucial pour l'apprentissage pratique et l'expérimentation. Cette BOM répertorie tous les composants matériels nécessaires pour construire une plateforme d'IA physique basique mais performante, adaptée à des fins éducatives et à la création de prototypes de principes fondamentaux de la robotique. Elle se concentre sur l'équilibre entre performance et budget, ce qui en fait un choix idéal pour les étudiants et les amateurs souhaitant commencer sans dépense financière significative.

### Philosophie du Kit Étudiant Jetson Économique

La philosophie de conception de ce kit est de maximiser les résultats d'apprentissage par dollar dépensé. Il privilégie les composants qui sont :

*   **Abordables :** Provenant de détaillants en ligne courants ou de fournisseurs d'électronique pour maintenir les coûts bas.
*   **Accessibles :** Composants relativement faciles à acquérir et à assembler, adaptés à ceux ayant des connaissances de base en électronique.
*   **Modulaires :** Composants pouvant être facilement échangés, améliorés ou intégrés dans différentes configurations robotiques.
*   **Compatibles ROS 2 :** Matériel qui s'intègre bien avec l'écosystème ROS 2, permettant un développement logiciel fluide.
*   **Performants :** Suffisamment puissants pour exécuter des tâches d'inférence IA basiques, de traitement de capteurs et de contrôle de moteurs.

### Composants Principaux du Kit Étudiant Jetson

#### 1. Module de Calcul : Kit de Développement NVIDIA Jetson Orin Nano

C'est le cerveau de votre robot, fournissant la puissance de calcul nécessaire pour les applications d'IA et de robotique. L'Orin Nano offre une performance IA significative en périphérie.

*   **Kit de Développement NVIDIA Jetson Orin Nano (8GB/4GB) :** Le kit de développement comprend le module Jetson Orin Nano, une carte porteuse avec divers I/O (USB, Ethernet, HDMI, connecteurs de caméra MIPI CSI), et une alimentation. La version 8GB est recommandée pour des modèles IA légèrement plus complexes, mais la version 4GB est également très capable pour des tâches basiques. *Coût Approximatif : 199 $ - 499 $*

#### 2. Base Mobile et Actionnement

Une base mobile basique permet à votre robot de se déplacer et de naviguer. Pour un kit économique, une simple plateforme à roues à entraînement différentiel est souvent la plus pratique.

*   **Châssis :** Un kit de châssis simple en acrylique ou aluminium pour un robot à deux roues motrices. De nombreuses options abordables sont disponibles en ligne. *Coût Approximatif : 30 $ - 70 $*
*   **Moteurs à Engrenages DC (x2) :** Deux moteurs à engrenages DC de 6V ou 12V avec encodeurs. Les encodeurs sont cruciaux pour l'odométrie (mesurer la distance parcourue et l'orientation) et le contrôle précis des moteurs. *Coût Approximatif : 20 $ - 40 $ par moteur*
*   **Pilote de Moteur :** Un pilote de moteur à double pont en H (par exemple, module L298N ou un pilote plus moderne basé sur DRV8833/DRV8871). Cela permet au Jetson de contrôler la vitesse et la direction des moteurs DC. *Coût Approximatif : 10 $ - 20 $*
*   **Roues (x2) et Roue Pivotante (x1) :** Roues appropriées pour votre châssis choisi et une roue pivotante pour la stabilité. *Coût Approximatif : 15 $ - 30 $*

#### 3. Système d'Alimentation

Une alimentation fiable est essentielle pour les robots mobiles. Une attention particulière à la capacité et à la tension de la batterie est cruciale.

*   **Batterie LiPo (par exemple, 3S 11.1V, 3000-5000mAh) :** Les batteries Lithium Polymère offrent un bon équilibre entre densité énergétique et taux de décharge. Une batterie 3S (3 cellules en série) fournit 11.1V nominal, adaptée à de nombreux pilotes de moteur et une tension courante pour la robotique. Choisissez une capacité qui offre une autonomie suffisante pour vos expériences. *Coût Approximatif : 30 $ - 60 $*
*   **Chargeur de Batterie :** Un chargeur d'équilibrage LiPo compatible est absolument critique pour une charge sécurisée et le maintien de la santé de la batterie. **AVERTISSEMENT :** Les batteries LiPo peuvent être dangereuses si elles sont mal manipulées. Suivez toujours les consignes de sécurité. *Coût Approximatif : 20 $ - 50 $*
*   **Convertisseur DC-DC Buck (Abaisseur) :** Un convertisseur buck (par exemple, module LM2596 ou similaire) pour abaisser la tension de la batterie (par exemple, 11.1V) à 5V pour alimenter le Jetson Orin Nano, et potentiellement d'autres capteurs 3.3V/5V. *Coût Approximatif : 5 $ - 15 $*
*   **Carte de Distribution d'Alimentation (Optionnelle mais Recommandée) :** Une carte simple pour distribuer proprement l'alimentation de la batterie au convertisseur buck, au pilote de moteur, et à d'autres composants. *Coût Approximatif : 10 $ - 20 $*

#### 4. Capteurs de Base

Même un kit économique peut incorporer des capteurs essentiels pour la perception et l'interaction basiques.

*   **Caméra USB :** Une webcam USB à bas coût (par exemple, Logitech C920 ou similaire) pour la perception visuelle. Cela permettra la détection d'objets basique, le suivi de ligne ou l'odométrie visuelle. *Coût Approximatif : 20 $ - 50 $*
*   **Capteur de Distance Ultrasonique (par exemple, HC-SR04 x2) :** Ces capteurs peu coûteux fournissent une détection d'obstacles basique, cruciale pour éviter les collisions. *Coût Approximatif : 5 $ - 10 $ par capteur*
*   **IMU (par exemple, Carte de Développement MPU6050/MPU9250) :** Une Unité de Mesure Inertielle fournit des données d'accélération et de vitesse angulaire, utiles pour estimer l'orientation du robot et détecter les mouvements. *Coût Approximatif : 10 $ - 20 $*

#### 5. Matériel Divers

*   **Fils de Liaison (Mâle-Mâle, Mâle-Femelle, Femelle-Femelle) :** Essentiels pour connecter tous les composants sans soudure initialement. *Coût Approximatif : 10 $ - 20 $*
*   **Plaque de Montage :** Pour prototyper les connexions de capteurs et les petits circuits. *Coût Approximatif : 5 $ - 10 $*
*   **Hub USB (Alimenté, Optionnel) :** Si vous prévoyez de connecter plusieurs appareils USB (caméra, clavier, souris) à votre Jetson.
*   **Carte SD (64GB+) :** Pour flasher le système d'exploitation JetPack sur le module Jetson si ce n'est pas la version kit de développement.
*   **Outils de Base :** Ensemble de tournevis, dénudeurs de fils, multimètre, gaine thermorétractable (si soudure). *Coût Approximatif : Variable*

### Coût Total Estimé (Hors Outils & Expédition)

Environ **400 $ - 800 $**, selon les choix spécifiques de composants, les promotions, et si vous optez pour le Kit de Développement Jetson Orin Nano 4GB ou 8GB.

Ce kit économique fournit une base solide pour apprendre sur la robotique mobile, l'intégration de capteurs, la navigation basique, et le déploiement de modèles IA en périphérie. Il sert de plateforme excellente pour appliquer les concepts enseignés dans ce cours avant de se lancer dans des plateformes humanoïdes plus complexes et coûteuses.