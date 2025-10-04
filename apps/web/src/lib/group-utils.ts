export function cleanGroupName(name: string, externalId: string) {
  let cleaned = name;
  
  // Remove externalId FIRST (case-insensitive)
  const externalIdRegex = new RegExp(externalId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  cleaned = cleaned.replace(externalIdRegex, '');
  
  // Remove CO2-MASTER (case-insensitive, with or without separator)
  cleaned = cleaned.replace(/co2[-\s]?master/gi, '');
  
  // Remove packCHAMPION (case-insensitive, with or without separator)
  cleaned = cleaned.replace(/pack[-\s]?champion/gi, '');
  
  // Remove PC (case-insensitive, as whole word or with separator)
  cleaned = cleaned.replace(/\bpc\b[-\s]?/gi, '');
  cleaned = cleaned.replace(/[-\s]?\bpc\b/gi, '');
  
  // Clean up multiple spaces and trim
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // Remove leading/trailing separators
  cleaned = cleaned.replace(/^[-\s]+|[-\s]+$/g, '');
  
  return cleaned;
}

export function getGroupBadges(name: string): Array<{ label: string; color: string }> {
  const badges: Array<{ label: string; color: string }> = [];
  
  // Check for CO2-MASTER
  if (/co2[-\s]?master/gi.test(name)) {
    badges.push({ label: 'CO2-MASTER', color: 'bg-green-100 text-green-800' });
  }
  
  // Check for packCHAMPION
  if (/pack[-\s]?champion/gi.test(name)) {
    badges.push({ label: 'packCHAMPION', color: 'bg-blue-100 text-blue-800' });
  }
  
  return badges;
}
