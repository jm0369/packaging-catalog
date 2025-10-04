export function cleanGroupName(name: string, externalId: string) {
  let cleaned = name;
  
  // Remove externalId FIRST (case-insensitive)
  const externalIdRegex = new RegExp(externalId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  cleaned = cleaned.replace(externalIdRegex, '');
  
  // Remove CO2-MASTER (case-insensitive, with or without separator, also matches CO21MASTER)
  cleaned = cleaned.replace(/co2[-\s1]?master/gi, '');
  
  // Remove packCHAMPION (case-insensitive, with or without separator)
  cleaned = cleaned.replace(/pack[-\s]?champion/gi, '');
  
  // Remove BRIEFBOX (case-insensitive, with or without separator)
  cleaned = cleaned.replace(/brief[-\s]?box/gi, '');
  
  // Remove FIXBOX (case-insensitive, with or without separator)
  cleaned = cleaned.replace(/fix[-\s]?box/gi, '');
  
  // Remove UNIVERSALVERPACKUNG (case-insensitive, with or without separator)
  cleaned = cleaned.replace(/universal[-\s]?verpackung/gi, '');
  
  // Remove UNIVERSALVERSANDBOX (case-insensitive, with or without separator)
  cleaned = cleaned.replace(/universal[-\s]?versand[-\s]?box/gi, '');
  
  // Remove ORDNERVERPACKUNG (case-insensitive, with or without separator)
  cleaned = cleaned.replace(/ordner[-\s]?verpackung/gi, '');
  
  // Remove MAILBOX (case-insensitive, with or without separator)
  cleaned = cleaned.replace(/mail[-\s]?box/gi, '');
  
  // Remove CARGO (case-insensitive, with or without separator)
  cleaned = cleaned.replace(/\bcargo\b[-\s]?/gi, '');
  cleaned = cleaned.replace(/[-\s]?\bcargo\b/gi, '');
  
  // Remove EXTRA (case-insensitive, with or without separator)
  cleaned = cleaned.replace(/\bextra\b[-\s]?/gi, '');
  cleaned = cleaned.replace(/[-\s]?\bextra\b/gi, '');
  
  // Remove PACK (case-insensitive, with or without separator)
  cleaned = cleaned.replace(/\bpack\b[-\s]?/gi, '');
  cleaned = cleaned.replace(/[-\s]?\bpack\b/gi, '');
  
  // Remove PC (case-insensitive, as whole word or with separator)
  cleaned = cleaned.replace(/\bpc\b[-\s]?/gi, '');
  cleaned = cleaned.replace(/[-\s]?\bpc\b/gi, '');
  
  // Clean up multiple spaces and trim
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // Remove leading/trailing separators
  cleaned = cleaned.replace(/^[-\s]+|[-\s]+$/g, '');
  
  return cleaned;
}

export function getGroupBadges(name: string, articles?: Array<{ title: string }>): Array<{ label: string; color: string }> {
  const badges: Array<{ label: string; color: string }> = [];
  
  // Check for CO2-MASTER (also matches CO21MASTER)
  if (/co2[-\s1]?master/gi.test(name)) {
    badges.push({ label: 'CO2-MASTER', color: 'bg-green-100 text-green-800' });
  }
  
  // Check for packCHAMPION
  if (/pack[-\s]?champion/gi.test(name)) {
    badges.push({ label: 'packCHAMPION', color: 'bg-blue-100 text-blue-800' });
  }
  
  // Check for BRIEFBOX
  if (/brief[-\s]?box/gi.test(name)) {
    badges.push({ label: 'BRIEFBOX', color: 'bg-purple-100 text-purple-800' });
  }
  
  // Check for FIXBOX
  if (/fix[-\s]?box/gi.test(name)) {
    badges.push({ label: 'FIXBOX', color: 'bg-lime-100 text-lime-800' });
  }
  
  // Check for UNIVERSALVERPACKUNG or UNIVERSALVERSANDBOX
  if (/universal[-\s]?verpackung/gi.test(name) || /universal[-\s]?versand[-\s]?box/gi.test(name)) {
    badges.push({ label: 'UNIVERSALVERPACKUNG', color: 'bg-orange-100 text-orange-800' });
  }
  
  // Check for ORDNERVERPACKUNG
  if (/ordner[-\s]?verpackung/gi.test(name)) {
    badges.push({ label: 'ORDNERVERPACKUNG', color: 'bg-yellow-100 text-yellow-800' });
  }
  
  // Check for MAILBOX
  if (/mail[-\s]?box/gi.test(name)) {
    badges.push({ label: 'MAILBOX', color: 'bg-pink-100 text-pink-800' });
  }
  
  // Check for CARGO
  if (/\bcargo\b/gi.test(name)) {
    badges.push({ label: 'CARGO', color: 'bg-indigo-100 text-indigo-800' });
  }
  
  // Check for EXTRA
  if (/\bextra\b/gi.test(name)) {
    badges.push({ label: 'EXTRA', color: 'bg-red-100 text-red-800' });
  }
  
  // Check for PACK
  if (/\bpack\b/gi.test(name)) {
    badges.push({ label: 'PACK', color: 'bg-teal-100 text-teal-800' });
  }
  
  // Check for DHL in articles
  if (articles && articles.some(article => /\bdhl\b/gi.test(article.title))) {
    badges.push({ label: 'DHL', color: 'bg-yellow-200 text-yellow-900' });
  }
  
  return badges;
}
