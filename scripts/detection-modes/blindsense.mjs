import { PingDetectionFilter } from "./filters/ping.mjs";

/**
 * The detection mode for Blindsense.
 */
export class DetectionModeBlindsense extends DetectionMode {
    sourceType = "sight";
    wallDirectionMode = PointSourcePolygon.WALL_DIRECTION_MODES.NORMAL;
    useThreshold = true;
    imprecise = true;
    priority = 499;

    constructor(data = {}, options = {}) {
        super(foundry.utils.mergeObject({
            id: "blindsense",
            label: "VISION5E.Blindsense",
            type: DetectionMode.DETECTION_TYPES.OTHER,
            walls: true,
            angle: false
        }, data), options);
    }

    /** @override */
    static getDetectionFilter() {
        return this._detectionFilter ??= PingDetectionFilter.create({
            color: [1, 1, 1],
            alpha: 0.75
        });
    }

    /** @override */
    _canDetect(visionSource, target) {
        if (!(target instanceof Token)) return false;
        const actor = target.actor;
        if (!actor || actor.type !== "character" && actor.type !== "npc") return false;
        const source = visionSource.object;
        if (source instanceof Token && (source.document.hasStatusEffect(CONFIG.specialStatusEffects.DEAF)
            || source.document.hasStatusEffect(CONFIG.specialStatusEffects.PETRIFIED)
            || (source.document.hasStatusEffect(CONFIG.specialStatusEffects.UNCONSCIOUS) && !game.settings.get("vision-5e", "unconsciousRetainsVision"))
            || source.document.hasStatusEffect(CONFIG.specialStatusEffects.SLEEP)
            || source.document.hasStatusEffect(CONFIG.specialStatusEffects.BURROW))) return false;
        if (target.document.hasStatusEffect(CONFIG.specialStatusEffects.BURROW)
            || target.document.hasStatusEffect(CONFIG.specialStatusEffects.ETHEREAL)
            && !(source instanceof Token && source.document.hasStatusEffect(CONFIG.specialStatusEffects.ETHEREAL))) return false;
        return true;
    }
}
