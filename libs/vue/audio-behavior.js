/**
 * Comportamiento de Audio Modular
 * @param {Ref} targetRef - Referencia al elemento (opcional para audio)
 * @param {Actor} actor - Instancia del Actor
 * @param {Object} soundMap - Mapa de señales a URLs de audio
 */
export function useAudioBehavior(targetRef, actor, soundMap) {
    const audioCache = {};

    // Precarga de audios para evitar latencia
    Object.entries(soundMap).forEach(([signal, url]) => {
        audioCache[signal] = new Audio(url);
        audioCache[signal].preload = 'auto';
    });

    // Suscripción automática a las señales del Actor
    Object.keys(soundMap).forEach(signal => {
        actor.on(signal, () => {
            const sound = audioCache[signal];
            if (sound) {
                sound.currentTime = 0; // Reinicia si el sonido ya estaba sonando
                sound.volume = 0.4;    // Volumen moderado para UI
                sound.play().catch(e => {
                    // El navegador bloquea audio si no hay interacción previa
                    console.warn(`[AudioBehavior] Play blocked for signal: ${signal}`);
                });
            }
        });
    });
}