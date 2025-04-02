export interface MusicTrack {
    id: string;
    path: string;
    mood: string[];
    tempo: 'slow' | 'medium' | 'fast';
    intensity: 'low' | 'medium' | 'high';
}
export declare class BackgroundMusicSelector {
    private musicLibrary;
    constructor(musicLibrary: MusicTrack[]);
    selectTrackForContent(content: string, mood: string[], preferredTempo?: string): MusicTrack;
    private calculateTrackScore;
    private analyzeContentIntensity;
    private getDefaultTrack;
}
