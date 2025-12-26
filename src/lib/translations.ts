export const translations = {
  // Navigation
  nav: {
    home: "Accueil",
    farmers: "Agriculteurs",
    plantations: "Plantations",
    employees: "Employés",
    map: "Carte",
  },

  // Common
  common: {
    add: "Ajouter",
    edit: "Modifier",
    delete: "Supprimer",
    save: "Enregistrer",
    cancel: "Annuler",
    close: "Fermer",
    search: "Rechercher",
    filter: "Filtrer",
    loading: "Chargement...",
    noData: "Aucune donnée disponible",
    actions: "Actions",
    details: "Détails",
    back: "Retour",
    viewDetails: "Voir les détails",
    viewOnMap: "Voir sur la carte",
    all: "Tous",
  },

  // Home Page
  home: {
    title: "Système de Gestion Agricole",
    subtitle: "Gérez vos agriculteurs, plantations et employés en un seul endroit",
    statistics: "Statistiques",
    totalFarmers: "Total Agriculteurs",
    totalPlantations: "Total Plantations",
    totalEmployees: "Total Employés",
    totalArea: "Superficie Totale",
    quickActions: "Actions Rapides",
    addFarmer: "Ajouter un Agriculteur",
    addPlantation: "Ajouter une Plantation",
    addEmployee: "Ajouter un Employé",
    viewMap: "Voir la Carte",
    features: "Fonctionnalités",
    featureManageFarmers: "Gérer les Agriculteurs",
    featureManageFarmersDesc: "Enregistrez et gérez les informations des agriculteurs avec photos et codes QR",
    featureTrackPlantations: "Suivre les Plantations",
    featureTrackPlantationsDesc: "Suivez les plantations avec emplacements GPS et contours de polygones",
    featureEmployees: "Gestion des Employés",
    featureEmployeesDesc: "Gérez les employés et leurs affectations aux plantations",
    featureInteractiveMap: "Carte Interactive",
    featureInteractiveMapDesc: "Visualisez toutes les plantations sur une carte interactive avec détails",
  },

  // Farmers Page
  farmers: {
    title: "Agriculteurs",
    addFarmer: "Ajouter un Agriculteur",
    editFarmer: "Modifier l'Agriculteur",
    farmerDetails: "Détails de l'Agriculteur",
    firstName: "Prénom",
    lastName: "Nom",
    photo: "Photo",
    profession: "Profession",
    city: "Ville",
    nationality: "Nationalité",
    idCardType: "Type de Pièce d'Identité",
    idCardNumber: "Numéro de Pièce d'Identité",
    createdAt: "Créé le",
    plantations: "Plantations",
    qrCode: "Code QR",
    qrCodeDesc: "Scannez pour accéder au profil de l'agriculteur",
    confirmDelete: "Êtes-vous sûr de vouloir supprimer cet agriculteur ?",
    photoUpload: "Télécharger une photo",
    photoUploadDesc: "Cliquez pour télécharger ou glissez-déposez",
  },

  // Plantations Page
  plantations: {
    title: "Plantations",
    addPlantation: "Ajouter une Plantation",
    editPlantation: "Modifier la Plantation",
    plantationDetails: "Détails de la Plantation",
    name: "Nom",
    farmer: "Agriculteur",
    crops: "Cultures",
    area: "Superficie",
    city: "Ville",
    location: "Localisation",
    latitude: "Latitude",
    longitude: "Longitude",
    polygon: "Polygone",
    employees: "Employés",
    filterByCity: "Filtrer par ville",
    selectFarmer: "Sélectionner un agriculteur",
    cropsPlaceholder: "Ex: Blé, Maïs, Tomates",
    cropsDesc: "Séparez les cultures par des virgules",
    polygonPoints: "Points du Polygone",
    addPolygonPoint: "Ajouter un Point",
    removePoint: "Retirer",
    selectEmployees: "Sélectionner les Employés",
    confirmDelete: "Êtes-vous sûr de vouloir supprimer cette plantation ?",
  },

  // Employees Page
  employees: {
    title: "Employés",
    addEmployee: "Ajouter un Employé",
    editEmployee: "Modifier l'Employé",
    employeeDetails: "Détails de l'Employé",
    firstName: "Prénom",
    lastName: "Nom",
    position: "Poste",
    city: "Ville",
    assignedPlantations: "Plantations Assignées",
    confirmDelete: "Êtes-vous sûr de vouloir supprimer cet employé ?",
  },

  // Map Page
  map: {
    title: "Carte des Plantations",
    filters: "Filtres",
    filterByCity: "Filtrer par Ville",
    statistics: "Statistiques",
    totalPlantations: "Total Plantations",
    totalArea: "Superficie Totale",
    cities: "Villes",
    selectedPlantation: "Plantation Sélectionnée",
    farmer: "Agriculteur",
    crops: "Cultures",
    area: "Superficie",
    employees: "Employés",
    noSelection: "Cliquez sur un marqueur pour voir les détails",
  },

  // Form Validation
  validation: {
    required: "Ce champ est requis",
    invalidEmail: "Email invalide",
    invalidNumber: "Nombre invalide",
    minLength: "Longueur minimale non respectée",
    maxLength: "Longueur maximale dépassée",
  },

  // Toasts/Messages
  messages: {
    farmerAdded: "Agriculteur ajouté avec succès",
    farmerUpdated: "Agriculteur modifié avec succès",
    farmerDeleted: "Agriculteur supprimé avec succès",
    plantationAdded: "Plantation ajoutée avec succès",
    plantationUpdated: "Plantation modifiée avec succès",
    plantationDeleted: "Plantation supprimée avec succès",
    employeeAdded: "Employé ajouté avec succès",
    employeeUpdated: "Employé modifié avec succès",
    employeeDeleted: "Employé supprimé avec succès",
    error: "Une erreur s'est produite",
  },

  // Units
  units: {
    hectares: "ha",
    employees: "employés",
  },
} as const;

export default translations;
