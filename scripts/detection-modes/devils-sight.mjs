import { isGhost } from "./light-perception.mjs";

/**
 * The detection mode for Devil's Sight.
 */
export class DetectionModeDevilsSight extends DetectionMode {
    priority = 2000;

    constructor() {
        super({
            id: "devilsSight",
            label: "VISION5E.DevilsSight",
            type: DetectionMode.DETECTION_TYPES.SIGHT,
            walls: true,
            angle: true
        });
    }

    /** @override */
    static getDetectionFilter(basic) {
        if (basic) return;
        return this._detectionFilter ??= OutlineOverlayFilter.create({
            outlineColor: [1, 1, 1, 1],
            knockout: true
        });
    }

    /** @override */
    _canDetect(visionSource, target) {
        const source = visionSource.object;
        return !(source instanceof Token && (source.document.hasStatusEffect(CONFIG.specialStatusEffects.BLIND)
            || source.document.hasStatusEffect(CONFIG.specialStatusEffects.PETRIFIED)
            || (source.document.hasStatusEffect(CONFIG.specialStatusEffects.UNCONSCIOUS) && !game.settings.get("vision-5e", "unconsciousRetainsVision"))
            || source.document.hasStatusEffect(CONFIG.specialStatusEffects.SLEEP)
            || source.document.hasStatusEffect(CONFIG.specialStatusEffects.BURROW)))
            && !(target instanceof Token && (target.document.hasStatusEffect(CONFIG.specialStatusEffects.INVISIBLE)
                || target.document.hasStatusEffect(CONFIG.specialStatusEffects.BURROW)
                || target.document.hasStatusEffect(CONFIG.specialStatusEffects.ETHEREAL) && !isGhost(target.actor)
                && !(source instanceof Token && source.document.hasStatusEffect(CONFIG.specialStatusEffects.ETHEREAL))));
    }
}
