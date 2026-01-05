import { allFixtures } from './fixtures';
import { localStorageService } from './localStorage';

export const loadFixtures = () => {
  const {
    companySettings,
    banks,
    transporters,
    vehicles,
    planters,
    weighings,
    credits,
    bulletins,
  } = allFixtures;

  // Save all fixture data to localStorage
  localStorageService.saveCompanySettings(companySettings);
  localStorageService.saveBanks(banks);
  localStorageService.saveTransporters(transporters);
  localStorageService.saveVehicles(vehicles);
  localStorageService.savePlanters(planters);
  localStorageService.saveWeighings(weighings);
  localStorageService.saveCredits(credits);
  localStorageService.saveBulletins(bulletins);
};

export const clearAllData = () => {
  localStorageService.saveFarmers([]);
  localStorageService.savePlantations([]);
  localStorageService.saveEmployees([]);
  localStorageService.savePlanters([]);
  localStorageService.saveWeighings([]);
  localStorageService.saveCredits([]);
  localStorageService.saveTransporters([]);
  localStorageService.saveVehicles([]);
  localStorageService.saveBanks([]);
  localStorageService.saveBulletins([]);
  localStorageService.saveCompanySettings(null);
  localStorageService.saveMandataries([]);
};
