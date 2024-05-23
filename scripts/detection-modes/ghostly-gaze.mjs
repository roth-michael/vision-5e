import { DetectionModeDarkvision } from "./darkvision.mjs";
import { isGhost } from "./light-perception.mjs";

/**
 * The detection mode for Ghostly Gaze.
 */
export class DetectionModeGhostlyGaze extends DetectionModeDarkvision {
    constructor() {
        super({
            id: "ghostlyGaze",
            label: "VISION5E.GhostlyGaze",
            walls: false
        });
    }

    /** @override */
    static getDetectionFilter(revealed) {
        if (revealed) return false;
        return this._detectionFilter ??= GlowOverlayFilter.create({
            glowColor: [1, 0.4, 1, 1]
        });
    }

    /** @override */
    _canDetect(visionSource, target) {
        const source = visionSource.object;
        return !(source instanceof Token && (source.document.hasStatusEffect(CONFIG.specialStatusEffects.BLIND)
            || source.document.hasStatusEffect(CONFIG.specialStatusEffects.PETRIFIED)
            || (source.document.hasStatusEffect(CONFIG.specialStatusEffects.UNCONSCIOUS) && !game.settings.get("vision-5e", "unconsciousRetainsVision"))
            || source.document.hasStatusEffect(CONFIG.specialStatusEffects.SLEEP)))
            && !(target instanceof Token && (target.document.hasStatusEffect(CONFIG.specialStatusEffects.INVISIBLE)
                || target.document.hasStatusEffect(CONFIG.specialStatusEffects.ETHEREAL) && !isGhost(target.actor)
                && !(source instanceof Token && source.document.hasStatusEffect(CONFIG.specialStatusEffects.ETHEREAL))));
    }
}
