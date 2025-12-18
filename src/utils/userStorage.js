const STORAGE_KEY = 'zaid_brain_gym_data_v1';

export const loadData = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : { profiles: {}, activeProfileId: null };
    } catch (e) {
        console.error("Error loading data", e);
        return { profiles: {}, activeProfileId: null };
    }
};

export const saveData = (data) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Error saving data", e);
    }
};

export const createProfile = (name) => {
    const data = loadData();
    const id = name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
    const newProfile = {
        id,
        name,
        xp: 0,
        day: 1,
        highScores: {},
        stats: {
            totalGames: 0,
            loginStreak: 0,
            lastLogin: new Date().toISOString()
        },
        gameProgress: {} // Store specific game states like levels
    };
    data.profiles[id] = newProfile;
    data.activeProfileId = id;
    saveData(data);
    return newProfile;
};

export const getActiveProfile = () => {
    const data = loadData();
    if (!data.activeProfileId) return null;
    return data.profiles[data.activeProfileId];
};

export const updateProfile = (updates) => {
    const data = loadData();
    if (!data.activeProfileId || !data.profiles[data.activeProfileId]) return;

    // Deep merge for specific nested objects if needed, or simple spread
    const current = data.profiles[data.activeProfileId];
    data.profiles[data.activeProfileId] = { ...current, ...updates };

    // Special handling for high scores to merge not overwrite
    if (updates.highScores) {
        data.profiles[data.activeProfileId].highScores = {
            ...current.highScores,
            ...updates.highScores
        };
    }

    // Special handling for game progress
    if (updates.gameProgress) {
        data.profiles[data.activeProfileId].gameProgress = {
            ...current.gameProgress,
            ...updates.gameProgress
        };
    }

    saveData(data);
    return data.profiles[data.activeProfileId];
};

export const switchProfile = (profileId) => {
    const data = loadData();
    if (data.profiles[profileId]) {
        data.activeProfileId = profileId;
        saveData(data);
        return data.profiles[profileId];
    }
    return null;
};
