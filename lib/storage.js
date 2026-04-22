const ENTRIES_KEY = 'retirement_diary_entries';
const FACE_KEY = 'retirement_face_data';
const PARAMS_KEY = 'retirement_economic_params';

export function saveEntry(entry) {
  const entries = getEntries();
  const newEntry = {
    ...entry,
    id: Date.now(),
    timestamp: new Date().toISOString(),
  };
  entries.push(newEntry);

  // 90日以内のエントリのみ保持
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  const filtered = entries.filter((e) => new Date(e.timestamp) > cutoff);

  try {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Storage full:', e);
  }
  return newEntry;
}

export function getEntries() {
  try {
    return JSON.parse(localStorage.getItem(ENTRIES_KEY) || '[]');
  } catch {
    return [];
  }
}

export function deleteEntry(id) {
  const entries = getEntries().filter((e) => e.id !== id);
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export function saveFaceData(dataUrl) {
  try {
    localStorage.setItem(FACE_KEY, dataUrl);
  } catch (e) {
    console.error('Face data save failed:', e);
  }
}

export function getFaceData() {
  return localStorage.getItem(FACE_KEY);
}

export function clearFaceData() {
  localStorage.removeItem(FACE_KEY);
}

export function saveEconomicParams(params) {
  localStorage.setItem(PARAMS_KEY, JSON.stringify(params));
}

export function getEconomicParams() {
  try {
    return JSON.parse(localStorage.getItem(PARAMS_KEY) || '{}');
  } catch {
    return {};
  }
}
