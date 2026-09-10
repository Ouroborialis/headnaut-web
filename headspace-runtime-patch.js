(function () {
  "use strict";

  if (typeof gdjs === "undefined") return;

  const HUD_ID = "headSpaceHud";
  const HUD_PAUSE_BUTTON_ID = "headSpaceHudPauseButton";
  const BRAND_ID = "headSpaceBrandBadge";
  const TOUCH_HINT_ID = "headSpaceTouchHint";
  const PAUSE_OVERLAY_ID = "headSpacePauseOverlay";
  const COMPLETION_FILTER_KEY = "__headSpaceCompletionFilter";
  const BEST_TIMES_KEY = "head-space-best-times-v1";
  const CUSTOM_PLAYER_KEY = "head-space-custom-player-v1";
  const CUSTOM_PLAYER_LIBRARY_KEY = "head-space-custom-player-library-v1";
  const CUSTOM_PLAYER_ACTIVE_KEY = "head-space-custom-player-active-v1";
  const CUSTOM_PLAYER_CREATOR_ID = "headSpaceCustomPlayerCreator";
  const PAUSE_MENU_BUTTON_WIDTH_PX = 380;
  const PAUSE_MENU_BUTTON_MAX_WIDTH_VW = 78;
  const PAUSE_MENU_BUTTON_HEIGHT_PX = 64;
  const PAUSE_MENU_BUTTON_MARGIN_Y_PX = 4;
  const PAUSE_MENU_BUTTON_FONT_SIZE_PX = 25;
  const PAUSE_MENU_BUTTON_WIDE_FONT_SIZE_PX = 22;

  const PLAYABLE_LEVEL_MIN = 1;
  const PLAYABLE_LEVEL_MAX = 12;
  const BOSS_LEVEL_MIN = 4;
  const BOSS_LEVEL_MAX = 12;
  const CustomBossSettings = Object.freeze({
    name: "CustomBossSettings",
    controller: "custom",
  });
  const NativeBossSettings = Object.freeze({
    name: "NativeBossSettings",
    controller: "native",
  });
  const LifelikeBossSettings = Object.freeze({
    name: "LifelikeBossSettings",
    controller: "lifelike",
  });
  const ACTIVE_BOSS_SETTINGS = LifelikeBossSettings;
  window.headSpaceBossSettings = Object.freeze({
    CustomBossSettings,
    NativeBossSettings,
    LifelikeBossSettings,
    activeName: ACTIVE_BOSS_SETTINGS.name,
  });
  const LEVEL_SELECT_MAP_LEVEL = 0.5;
  const LEVEL_SELECT_CAMERA_LAYERS = ["", "Texture"];
  const LEVEL_SELECT_SUN_X = 660;
  const LEVEL_SELECT_SUN_Y = 390;
  const LEVEL_SELECT_HOME_OFFSET_Y = 38;
  const LEVEL_SELECT_BLUE_GLOW_COLOR = "70;150;255";
  const COMPLETION_FILTER_LAYER_NAMES = [
    "Background",
    "Stars1",
    "Star2",
    "",
    "Lighting",
    "Texture",
    "Background Stars",
  ];
  const COMPLETION_FREEZE_OBJECT_NAMES = [
    "Player",
    "Enemy",
    "SmartEnemy",
    "EmittedMaterial",
    "Asteroid",
    "PlayerImage",
    "PlayerHelmet",
    "EnemyImage",
    "SmartEnemyImage",
    "EmittedMaterialImage",
    "PropulsionJet",
    "InternalFloaties",
    "InternalFloatiesORB",
  ];

  const PLANET_NAMES = [
    "Planet_1",
    "Planet_2",
    "Planet_3",
    "Planet_4",
    "Planet_5",
    "Planet_6",
    "Planet_7",
    "Planet_8",
  ];
  const GAMEPLAY_BACKGROUND_OBJECT_NAMES = [
    "Background",
    "Background2",
    "BackRandomTest",
    "Background3",
    "Background4",
    "SPbackground",
    "Background5",
    "BackgroundFIT1",
    "BackgroundFIT2",
    "BackgroundFIT3",
    "BackgroundFIT4_HOME",
    "Background_UNTILED_1",
    "Background_UNTILED_2",
    "Background_UNTILED_3",
    "Background_UNTILED_4",
    "Background_UNTILED_5",
    "Background_UNTILED_6",
    "Background_UNTILED_7",
    "Background_UNTILED_8",
    "Background_UNTILED_10",
    "Background_UNTILED_11",
    "Background_UNTILED_12",
    "Background_UNTILED_13",
    "Background_UNTILED_14",
    "Background_UNTILED_15",
  ];

  const ORBIT_TARGET_NAMES = ["Player", "Enemy", "SmartEnemy", "EmittedMaterial", "Asteroid"];
  const LEVEL_SELECT_STRIP_OBJECTS = [
    "Player",
    "Enemy",
    "SmartEnemy",
    "PlayerImage",
    "PlayerHelmet",
    "EnemyImage",
    "SmartEnemyImage",
    "SmartEnemyPointer",
    "EmittedMaterial",
    "EmittedMaterialImage",
    "PropulsionJet",
    "InternalFloaties",
    "InternalFloatiesORB",
  ];
  const HOME_MENU_ONLY_OBJECT_NAMES = [
    "Title_Text",
    "CHARACTER_Label",
    "HELMET_Label",
    "CharLeft",
    "CharRight",
    "HelmLeft",
    "HelmRight",
    "PreviewCharacter",
    "PreviewHelmet",
    "LevelSelectScreen",
    "Button_Text",
  ];
  const PAUSE_DUPLICATION_GUARD_OBJECTS = [
    "Player",
    "Enemy",
    "SmartEnemy",
    "Walls",
    "PlayerImage",
    "PlayerHelmet",
    "EnemyImage",
    "SmartEnemyImage",
    "SmartEnemyPointer",
    "Message1",
    "Message2",
    "Message3",
    "Light1",
    "Light2",
    "Light3",
    "Light4",
    ...PLANET_NAMES,
  ];
  const LEGACY_TUTORIAL_TEXTS = new Set([
    "Digest all stressors to win level",
    "Become bigger than your stressors",
    "Use mouse wheel to zoom",
    "Watch out for moving stressors",
    "This stressor can run away",
    "But now it can also chase!",
  ]);

  const MAX_EMITTED_MATERIAL = 180;
  const MAX_ORB_PARTICLES = 220;
  const EMITTED_MAX_AGE_SECONDS = 8;
  const MIN_EMITTED_WIDTH = 6;
  const PLAYER_ORB_RECOIL_BONUS_SPEED = 5;
  const PLAYER_ORB_RECOIL_HIGH_SPEED_BONUS = 55;
  const PLAYER_ORB_RECOIL_HIGH_SPEED_THRESHOLD = 200;
  const OVERLAY_BUTTON_WIDTH = 172;
  const OVERLAY_BUTTON_HEIGHT = 54;
  const OVERLAY_BUTTON_TEXT_MAX_SIZE = 64;
  const OVERLAY_BUTTON_TEXT_MIN_SIZE = 20;
  const BUTTON_TEXT_DEFAULT_SIZE = 58;
  const LEVEL_OVER_WIN_STACK_CENTER_Y_RATIO = 0.16;
  const LEVEL_OVER_BOTTOM_PADDING_RATIO = 0.07;
  const LEVEL_OVER_BOTTOM_PADDING_MIN = 42;
  const HEADNAUT_DOM_FONT_FAMILY = "HeadnautAchron";
  const LEVEL_OVER_BUTTON_FONT = "Achron.otf";
  const HOME_MENU_TITLE_SIZE = 118;
  const HOME_MENU_LABEL_SIZE = 34;
  const HOME_MENU_ARROW_SIZE = 58;
  const HOME_MENU_PREVIEW_SIZE = 132;
  // Native character and helmet artwork is authored as matching 140x140
  // layers. Gameplay must use the same 1:1 composite as the home screen: the
  // selected helmet sits on top of the character frame and precisely covers
  // its baked-in grey shell. Player stays the collision authority.
  const NATIVE_HELMET_COVER_SCALE = 1.01;
  const CUSTOM_PLAYER_HELMET_FILL_SCALE = 1.18;
  const HOME_MENU_ARROW_OFFSET_X = 154;
  const HOME_MENU_ACTION_BUTTON_OFFSET_RATIO = 0.18;
  const HOME_MENU_PLAY_Y_RATIO = 0.34;
  const HOME_MENU_BACKGROUND_ASPECT = 1600 / 1280;
  const HOME_MENU_BACKGROUND_OVERSCAN = 1.25;
  const HOME_MENU_STAR_OPACITY_NEAR = 150;
  const HOME_MENU_STAR_OPACITY_FAR = 105;
  const LEVEL_BACKGROUND_RESOURCES = [
    "multiplayer-level-04.png", "multiplayer-level-10.jpg", "multiplayer-level-02.png",
    "multiplayer-level-08.png", "multiplayer-level-06.png", "multiplayer-level-12.jpg",
    "multiplayer-level-01.png", "multiplayer-level-09.png", "multiplayer-level-05.png",
    "multiplayer-level-11.jpg", "multiplayer-level-03.png", "multiplayer-level-07.png",
  ];
  const BUTTON_TEXT_PADDING_X_RATIO = 0.02;
  const BUTTON_TEXT_PADDING_Y_RATIO = 0.02;
  const BUTTON_TEXT_VISUAL_OFFSET_X = 0;
  const BUTTON_TEXT_VISUAL_OFFSET_Y = 0;
  const ABSORB_NEGATIVE_FLASH_FREQUENCY_HZ = 11;
  const ABSORB_NEGATIVE_FLASH_HOLD_SECONDS = 0.12;
  const ABSORB_NEGATIVE_FLASH_SHRINK_EPSILON = 0.35;
  const ABSORB_NEGATIVE_FLASH_FILTER_KEY = "__headSpaceAbsorbNegativeFilter";
  const PLAYER_PRELAUNCH_NEGATIVE_FILTER_KEY = "__headSpacePlayerPrelaunchNegativeFilter";
  const MAIN_MENU_BUTTON_TEXT_VISUAL_OFFSET_Y = -3;
  const LEVEL_OVER_BUTTON_TEXT_VISUAL_OFFSET_Y = -2;
  const BUTTON_GLOW_EFFECT_NAME = "HeadSpaceGlow";
  const BUTTON_GLOW_COLOR = "78;206;255";
  const BUTTON_GLOW_THICKNESS = 4;
  const BUTTON_GLOW_PADDING = 12;
  const BUTTON_GLOW_ALPHA = 1;
  const BUTTON_HOVER_GLOW_COLOR = "146;235;255";
  const BUTTON_HOVER_GLOW_THICKNESS = 8;
  const BUTTON_HOVER_GLOW_PADDING = 20;
  const BUTTON_HOVER_GLOW_ALPHA = 0.3;
  const ENEMY_RESTITUTION = 0.15;
  const ENEMY_LINEAR_DAMPING = 0.2;
  const BOSS_RESTITUTION = 1;
  const BOSS_LINEAR_DAMPING = 0;
  const BOSS_ANGULAR_DAMPING = 12;
  const SMART_ENEMY_LINEAR_DAMPING = 0.32;
  const SMART_ENEMY_STEER_FORCE = 2300;
  const SMART_ENEMY_EVADE_FORCE = 2900;
  const SMART_ENEMY_MAX_SPEED = 360;
  const SMART_ENEMY_SENSE_RADIUS = 960;
  const SMART_ENEMY_ABSORB_RATIO = 0.985;
  const SMART_ENEMY_THREAT_RATIO = 1.03;
  const SMART_ENEMY_PLAYER_HUNT_RATIO = 1.12;
  const PLAYER_INTENDED_MAX_SPEED = 400;
  const BOSS_REFERENCE_MAX_SPEED = 300;
  const PLAYER_PROPULSION_SPEED_DELTA = 45;
  const LIFELIKE_BOSS_LEVEL_SETTINGS = Object.freeze({
    4: Object.freeze({ maxSpeed: 185, acceleration: 285, turnRate: 2.45, aggression: 0.76, reactionSeconds: 0.24 }),
    5: Object.freeze({ maxSpeed: 200, acceleration: 320, turnRate: 2.72, aggression: 0.86, reactionSeconds: 0.2 }),
    6: Object.freeze({ maxSpeed: 200, acceleration: 310, turnRate: 2.62, aggression: 0.84, reactionSeconds: 0.21 }),
    7: Object.freeze({ maxSpeed: 218, acceleration: 345, turnRate: 2.88, aggression: 0.9, reactionSeconds: 0.17 }),
    8: Object.freeze({ maxSpeed: 224, acceleration: 360, turnRate: 3.02, aggression: 0.93, reactionSeconds: 0.15 }),
    9: Object.freeze({ maxSpeed: 230, acceleration: 375, turnRate: 3.12, aggression: 0.95, reactionSeconds: 0.14 }),
    10: Object.freeze({ maxSpeed: 236, acceleration: 390, turnRate: 3.24, aggression: 0.98, reactionSeconds: 0.12 }),
    11: Object.freeze({ maxSpeed: 242, acceleration: 410, turnRate: 3.38, aggression: 1, reactionSeconds: 0.1 }),
    12: Object.freeze({ maxSpeed: 220, acceleration: 350, turnRate: 2.96, aggression: 0.92, reactionSeconds: 0.15 }),
  });
  const LIFELIKE_BOSS_TARGET_LOCK_MIN_SECONDS = 1;
  const LIFELIKE_BOSS_TARGET_LOCK_MAX_SECONDS = 3;
  const LIFELIKE_BOSS_HAZARD_LOOKAHEAD_SECONDS = 1.15;
  const LIFELIKE_BOSS_OBSTACLE_ROUTE_PADDING = 74;
  const LIFELIKE_BOSS_WALL_LOOKAHEAD_CLEARANCE = 132;
  const LIFELIKE_BOSS_WALL_ESCAPE_DELAY_SECONDS = 0.42;
  const LIFELIKE_BOSS_WALL_ESCAPE_DURATION_SECONDS = 1.2;
  const LIFELIKE_BOSS_HAZARD_HOLD_SECONDS = 0.65;
  const LIFELIKE_BOSS_MIN_MOVING_SPEED_FACTOR = 0.58;
  const LIFELIKE_BOSS_PROJECTILE_PADDING = 92;
  const LIFELIKE_BOSS_THREAT_PADDING = 46;
  const LIFELIKE_BOSS_PLAYER_EVADE_DISTANCE_FACTOR = 3.4;
  const LIFELIKE_BOSS_PLAYER_EVADE_MIN_DISTANCE = 360;
  const LIFELIKE_BOSS_SEARCH_RADIUS_FACTOR = 0.28;
  const BOSS_EDIBLE_CLUSTER_RADIUS = 320;
  const BOSS_EDIBLE_CLUSTER_BONUS = 118;
  const BOSS_CENTER_ROUTE_BONUS = 76;
  const BOSS_PLAYER_WALL_TRAP_BONUS = 108;
  const BOSS_PLAYER_APPROACH_BONUS = 78;
  const BOSS_EDIBLE_TARGET_SIZE_BONUS = 148;
  const BOSS_EDIBLE_FINISH_BONUS = 92;
  const BOSS_POST_ABSORB_CHAIN_RADIUS = 380;
  const BOSS_POST_ABSORB_CHAIN_BONUS = 146;
  const BOSS_POST_ABSORB_PLAYER_BONUS = 192;
  const BOSS_PLAYER_ATTACK_MARGIN_BONUS = 178;
  const BOSS_PLAYER_DIRECT_KILL_BONUS = 212;
  const BOSS_GROWTH_TARGET_PLAYER_DISTANCE_BONUS = 214;
  const BOSS_GROWTH_TARGET_ESCAPE_DIRECTION_BONUS = 142;
  const BOSS_GROWTH_PLAYER_EVADE_SCALE = 0.18;
  const BOSS_GROWTH_PLAYER_PANIC_DISTANCE_RATIO = 1.2;
  const BOSS_GROWTH_SEARCH_FORCE_SCALE = 1.55;
  const BOSS_GROWTH_PURSUIT_FORCE_SCALE = 1.34;
  const BOSS_UNDERSIZED_GROWTH_TARGET_BONUS = 220;
  const BOSS_UNDERSIZED_GROWTH_SIZE_BONUS = 130;
  const BOSS_UNDERSIZED_GROWTH_PROGRESS_BONUS = 170;
  const BOSS_UNDERSIZED_GROWTH_THREAT_BASE_WEIGHT = 0.64;
  const LEVEL_FIVE_GROWTH_THREAT_COMMIT_BONUS = 0.78;
  const BOSS_UNDERSIZED_GROWTH_DRIVE_SPEED_FACTOR = 0.88;
  const BOSS_UNDERSIZED_GROWTH_DRIVE_BLEND = 0.4;
  const BOSS_GROWTH_TARGET_LOCK_SECONDS = 2.8;
  const BOSS_GROWTH_TARGET_LOCK_CLOSE_SECONDS = 1.9;
  const BOSS_GROWTH_TARGET_SWITCH_SCORE_MARGIN = 210;
  const BOSS_GROWTH_TARGET_LOCK_DISTANCE_BONUS = 360;
  const BOSS_GROWTH_TARGET_HOVER_WEIGHT = 0.018;
  const BOSS_GROWTH_TARGET_MOBILITY_WEIGHT = 0.055;
  const BOSS_GROWTH_TARGET_PURSUIT_SCALE = 1.72;
  const BOSS_PLAYER_ATTACK_FORCE_SCALE = 1.28;
  const BOSS_PLAYER_ATTACK_PURSUIT_WEIGHT = 1.56;
  const BOSS_PLAYER_ATTACK_SPEED_FACTOR = 0.94;
  const BOSS_PREY_PURSUIT_SPEED_FACTOR = 0.9;
  const BOSS_COMMITTED_CHASE_BLEND = 0.5;
  const BOSS_FINAL_PURSUIT_BLEND = 0.62;
  const BOSS_TARGET_LOCK_SECONDS = 1.12;
  const BOSS_TARGET_LOCK_DISTANCE_BONUS = 220;
  const BOSS_ESCAPE_THREAT_HOLD_SECONDS = 1.15;
  const BOSS_ESCAPE_THREAT_RELEASE_DISTANCE_SCALE = 1.38;
  const BOSS_ABSORB_COMMIT_DISTANCE_RATIO = 0.56;
  const BOSS_ABSORB_COMMIT_AVOIDANCE_SCALE = 0.2;
  const BOSS_ABSORB_COMMIT_SIDESTEP_SCALE = 0.14;
  const BOSS_ABSORB_COMMIT_PANIC_DISTANCE_RATIO = 0.82;
  // The authored Absorbus transfer formula needs a small geometric overlap.
  // Physics2 correctly stops two circular fixtures at edge contact, so bridge
  // only that final contact slop into the authored transfer routine. This is a
  // gameplay-wide boss rule, not a level-specific collision-size exception.
  const BOSS_CONTACT_ABSORB_OVERLAP = 1.5;
  const BOSS_LARGE_ENEMY_HARD_REJECT_PENALTY = 170;
  const BOSS_LARGE_ENEMY_TARGET_THREAT_RADIUS_MIN = 360;
  const BOSS_LARGE_ENEMY_TARGET_THREAT_RADIUS_SIZE_SCALE = 4.2;
  const BOSS_LARGE_ENEMY_EMERGENCY_DISTANCE_RATIO = 1.18;
  const BOSS_LARGE_ENEMY_EMERGENCY_FORCE_MULTIPLIER = 3.3;
  const BOSS_LARGE_ENEMY_EMERGENCY_SIDESTEP_SCALE = 0.55;
  const BOSS_LARGE_ENEMY_EMERGENCY_TIME_TO_CONTACT_SECONDS = 1.05;
  const BOSS_LARGE_ENEMY_EMERGENCY_TURN_BLEND = 0.78;
  const BOSS_LARGE_ENEMY_EMERGENCY_SPEED_FACTOR = 0.9;
  const BOSS_LARGE_ENEMY_MIN_AWAY_SPEED_FACTOR = 0.68;
  const BOSS_LARGE_ENEMY_SAFETY_PADDING = 18;
  const BOSS_LARGE_ENEMY_SAFETY_LOOKAHEAD = 118;
  const BOSS_LARGE_ENEMY_ABSORB_COMMIT_UNSAFE_DISTANCE_RATIO = 1.22;
  const BOSS_MOTION_RECOVERY_SPEED_RATIO = 0.46;
  const BOSS_HOVER_ESCAPE_SPEED_RATIO = 0.12;
  const BOSS_ROUTE_GUIDANCE_FORCE_MULTIPLIER = 1.28;
  const BOSS_ROUTE_GUIDANCE_TANGENT_MULTIPLIER = 1.14;
  const BOSS_ROUTE_GUIDANCE_SUPPRESS_THRESHOLD = 0.72;
  const BOSS_START_SIZE_ADVANTAGE_PX = 2;
  const BOSS_SPEED_RAMP_START_FACTOR = 0.5;
  const BOSS_FORCE_RAMP_START_FACTOR = 0.42;
  const LEVEL_FOUR_TARGET_ENEMY_COUNT = 12;
  const LEVEL_FOUR_EXTRA_ENEMY_SIZE_RATIOS = [0.46, 0.54, 0.62, 0.7];
  const LEVEL_FOUR_BOSS_NEIGHBOR_SIZE_RATIO = 0.72;
  const LEVEL_FOUR_RELOCATED_LARGE_ENEMY_SIZE_RATIO = 1.18;
  const LEVEL_SIX_TARGET_ENEMY_COUNT = 34;
  // Consecutive spiral slots alternate small, large, and medium enemies.
  const LEVEL_SIX_EXTRA_ENEMY_SIZE_RATIOS = [0.36, 1.04, 0.64, 0.44, 1.18, 0.76, 0.52, 1.32, 0.9];
  const LEVEL_FOUR_TOP_EDGE_BAIT_DEPTH = 210;
  const LEVEL_FOUR_TOP_RIGHT_BAIT_WIDTH = 260;
  const LEVEL_FOUR_TOP_RIGHT_BAIT_DEPTH = 260;
  const LEVEL_FOUR_BOSS_UNSTICK_TRIGGER_SECONDS = 0.25;
  const LEVEL_FOUR_BOSS_UNSTICK_DURATION_SECONDS = 1.9;
  const LEVEL_FOUR_BOSS_UNSTICK_SPEED_RATIO = 0.4;
  const LEVEL_FOUR_BOSS_MOTION_RECOVERY_SPEED_RATIO = 0.52;
  const LEVEL_FOUR_BOSS_POCKET_FACTOR = 0.4;
  const BOSS_HEAD_START_SECONDS = 5;
  const BOSS_ACTIVATION_DELAY_SECONDS = 5;
  const LEVEL_FOUR_BOSS_SPEED_RAMP_SECONDS = 12;
  const LEVEL_FOUR_BOSS_SIZE_OFFSET = 36;
  const LEVEL_FOUR_ABSORB_RATIO = 0.985;
  const LEVEL_FOUR_THREAT_RATIO = 1.04;
  const LEVEL_FOUR_PLAYER_PANIC_PADDING = 54;
  const LEVEL_FOUR_PLAYER_PANIC_SIZE_FACTOR = 1.45;
  const LEVEL_FOUR_PLAYER_ATTACK_SCORE_SCALE = 0.18;
  const LEVEL_FOUR_HARD_ESCAPE_SPEED_FACTOR = 0.68;
  const LEVEL_FOUR_HARD_ESCAPE_BLEND = 0.24;
  const LEVEL_FOUR_BOSS_SPEED_OFFSET = 90;
  const LEVEL_FOUR_BOSS_STEER_SCALE = 0.34;
  const LEVEL_FOUR_BOSS_EVADE_SCALE = 0.3;
  const LEVEL_FOUR_NATIVE_BOSS_FORCE_SMOOTH_BLEND = 0.28;
  const LEVEL_FOUR_NATIVE_BOSS_FORCE_THREAT_BLEND = 0.38;
  const LEVEL_FOUR_NATIVE_BOSS_FORCE_RESET_SECONDS = 0.36;
  const BOSS_NATIVE_FORCE_SMOOTH_BLEND = 0.24;
  const BOSS_NATIVE_FORCE_THREAT_BLEND = 0.34;
  const BOSS_HEADSTART_AVOIDANCE_SPEED_SCALE = 0.56;
  const BOSS_HEADSTART_AVOIDANCE_CLOSE_SPEED_BONUS = 0.14;
  const BOSS_HEADSTART_AVOIDANCE_MIN_SPEED = 58;
  const BOSS_HEADSTART_AVOIDANCE_MAX_SPEED = 122;
  const BOSS_HEADSTART_AVOIDANCE_SAFE_GAP = 170;
  const BOSS_HEADSTART_AVOIDANCE_ARENA_PADDING = 36;
  const BOSS_HEADSTART_AVOIDANCE_BLEND = 0.24;
  const BOSS_WALL_CONTACT_TOUCH_CLEARANCE = 20;
  const BOSS_WALL_CONTACT_CLEARANCE = 92;
  const BOSS_WALL_CONTACT_GRACE_SECONDS = 0.55;
  const BOSS_WALL_CONTACT_RELEASE_SPEED_FACTOR = 0.84;
  const BOSS_WALL_CONTACT_RELEASE_BLEND = 0.64;
  const BOSS_WALL_CONTACT_RELEASE_CENTER_WEIGHT = 0.68;
  const BOSS_WALL_CONTACT_RELEASE_NUDGE_MAX = 18;
  const LEVEL_FIVE_BOSS_SIZE_OFFSET = 26;
  const LEVEL_FIVE_BOSS_SPEED_OFFSET = 50;
  const LEVEL_FIVE_BOSS_SPEED_RAMP_SECONDS = 3.5;
  const LEVEL_FIVE_BOSS_SPEED_RAMP_START_FACTOR = 0.92;
  const LEVEL_FIVE_BOSS_FORCE_RAMP_START_FACTOR = 0.88;
  const LEVEL_FIVE_PREY_PURSUIT_SPEED_FACTOR = 1;
  const LEVEL_FIVE_PLAYER_ATTACK_SPEED_FACTOR = 1;
  const LEVEL_FIVE_FINAL_PURSUIT_BLEND = 0.76;
  const LEVEL_FIVE_PLAYER_ATTACK_FORCE_FACTOR = 1.18;
  const LEVEL_FIVE_PREY_PURSUIT_FORCE_FACTOR = 1.14;
  const LEVEL_FIVE_REACHABLE_PREY_RADIUS = 680;
  const LEVEL_FIVE_REACHABLE_PREY_SIZE_DISTANCE_BONUS = 1.05;
  const LEVEL_FIVE_REACHABLE_PREY_THREAT_DISTANCE_PENALTY = 0.62;
  const LEVEL_FIVE_REACHABLE_PREY_SWITCH_DISTANCE_MARGIN = 90;
  const LEVEL_FIVE_WALL_AVOIDANCE_INWARD_WEIGHT = 1.05;
  const LEVEL_FIVE_WALL_AVOIDANCE_EDGE_WEIGHT = 1.35;
  const LEVEL_FIVE_WALL_AVOIDANCE_TANGENT_WEIGHT = 0.92;
  const LEVEL_FIVE_WALL_AVOIDANCE_SPEED_FACTOR = 0.82;
  const LEVEL_FIVE_LARGE_ENEMY_REDUCTION_COUNT = 8;
  const LEVEL_FIVE_LARGE_ENEMY_SCALE = 0.45;
  const LEVEL_FIVE_EXTRA_SMALL_ENEMY_COUNT = 4;
  const LEVEL_FIVE_EXTRA_SMALL_ENEMY_SIZE_RATIOS = [0.38, 0.44, 0.5, 0.56];
  const LEVEL_FIVE_BOSS_ENEMY_CLEARANCE = 340;
  const LEVEL_FIVE_ENEMY_ENEMY_CLEARANCE = 64;
  const LEVEL_FIVE_PLAYER_FEED_ENEMY_COUNT = 4;
  const LEVEL_FIVE_PLAYER_FEED_MAX_RATIO = 0.72;
  const LEVEL_FIVE_PLAYER_FEED_EDGE_GAP = 92;
  const LEVEL_FIVE_PLAYER_FEED_MIN_EDGE_GAP = 42;
  const LEVEL_FIVE_PLAYER_FEED_ENEMY_CLEARANCE = 42;
  const LEVEL_FIVE_PLAYER_FEED_BOSS_CLEARANCE = 360;
  const LEVEL_FIVE_PLAYER_FEED_ANGLES = [-0.62, 0.48, 1.28, -1.42, 2.38, -2.58];
  const LEVEL_FIVE_SLOT_SOFT_CLEARANCE = -18;
  const LEVEL_FIVE_ENEMY_LAYOUT_FRACTIONS = [
    [0.14, 0.2],
    [0.86, 0.8],
    [0.86, 0.2],
    [0.14, 0.8],
    [0.5, 0.14],
    [0.5, 0.86],
    [0.22, 0.5],
    [0.78, 0.5],
    [0.28, 0.32],
    [0.72, 0.68],
    [0.72, 0.32],
    [0.28, 0.68],
    [0.38, 0.22],
    [0.62, 0.78],
    [0.62, 0.22],
    [0.38, 0.78],
    [0.16, 0.36],
    [0.84, 0.64],
    [0.84, 0.36],
    [0.16, 0.64],
    [0.34, 0.48],
    [0.66, 0.52],
    [0.44, 0.34],
    [0.56, 0.66],
    [0.56, 0.34],
    [0.44, 0.66],
    [0.3, 0.16],
    [0.7, 0.84],
    [0.7, 0.16],
    [0.3, 0.84],
  ];
  const LEVEL_SIX_WALL_ESCAPE_BUFFER = 240;
  const LEVEL_SIX_WALL_TRAP_EDGE_FACTOR = 0.56;
  const LEVEL_SIX_WALL_TRAP_CORNER_FACTOR = 0.22;
  const LEVEL_SIX_WALL_TRAP_SPEED_RATIO = 0.54;
  const LEVEL_SIX_BOSS_UNSTICK_TRIGGER_SECONDS = 0.18;
  const LEVEL_SIX_BOSS_UNSTICK_DURATION_SECONDS = 1.5;
  const LEVEL_SIX_BOSS_UNSTICK_SPEED_RATIO = 0.42;
  const LEVEL_SIX_BOSS_SIZE_OFFSET = 12;
  const LEVEL_SIX_BOSS_SPEED_OFFSET = 50;
  const LEVEL_SEVEN_BOSS_SIZE_OFFSET = 16;
  const LEVEL_SEVEN_HEADSTART_FIGURE_EIGHT_WIDTH = 76;
  const LEVEL_SEVEN_HEADSTART_FIGURE_EIGHT_HEIGHT = 44;
  const LEVEL_SEVEN_HEADSTART_FIGURE_EIGHT_ANGULAR_SPEED = 1.35;
  const LEVEL_SEVEN_HEADSTART_FIGURE_EIGHT_SPEED_FACTOR = 0.72;
  const LEVEL_SEVEN_HEADSTART_COLLISION_PADDING = 34;
  const LEVEL_SEVEN_HEADSTART_COLLISION_LOOKAHEAD = 96;
  const LEVEL_SEVEN_WALL_RELEASE_GRACE_SECONDS = 0.28;
  const LEVEL_SEVEN_WALL_CONTACT_START_CLEARANCE = 64;
  const LEVEL_SEVEN_WALL_AVOIDANCE_BASE_WEIGHT = 1.2;
  const LEVEL_SEVEN_WALL_AVOIDANCE_EDGE_WEIGHT = 1.7;
  const LEVEL_SIX_PLAYER_PLANET_GAP = 104;
  const LEVEL_SIX_BOSS_PLANET_GAP = 118;
  const LEVEL_SIX_PLANET_START_CLEARANCE = 42;
  const LEVEL_SIX_PRIMARY_PLANET_PHYSICS_BASE_RADIUS = 435;
  const LEVEL_SIX_PRIMARY_PLANET_VISUAL_RADIUS_RATIO = 435 / 512;
  const LEVEL_SIX_PRIMARY_PLANET_COLLISION_PADDING = -6;
  const LEVEL_SIX_PRIMARY_PLANET_RESTITUTION = 0.62;
  const LEVEL_SIX_BOSS_PLANET_ROUTE_BUFFER = 170;
  const LEVEL_SIX_BOSS_PLANET_ROUTE_CLEARANCE = 38;
  const LEVEL_SIX_BOSS_PLANET_CONTACT_CLEARANCE = 24;
  const LEVEL_SIX_BOSS_PLANET_RELEASE_SPEED_FACTOR = 0.74;
  const LEVEL_SIX_BOSS_PLANET_RELEASE_BLEND = 0.52;
  const LEVEL_SIX_BOSS_PLANET_RELEASE_NUDGE_MAX = 16;
  const LEVEL_SIX_BOTTOM_START_MARGIN_RATIO = 0.13;
  const LEVEL_SIX_ENEMY_SPIRAL_ANGULAR_SPEED = 0.58;
  const LEVEL_SIX_ENEMY_SPIRAL_POSITION_SPRING = 22;
  const LEVEL_SIX_ENEMY_SPIRAL_DAMPING = 7.2;
  const LEVEL_SIX_ENEMY_SPIRAL_TANGENTIAL_GAIN = 15;
  const LEVEL_SIX_ENEMY_SPIRAL_MAX_FORCE = 9200;
  const LEVEL_SIX_ENEMY_SPIRAL_VELOCITY_BLEND = 0.16;
  const LEVEL_SIX_ENEMY_SPIRAL_RECOVERY_BLEND = 0.38;
  const LEVEL_SIX_ENEMY_SPIRAL_RADIAL_SPEED_RATIO = 0.58;
  const LEVEL_SIX_ENEMY_SPIRAL_SLOT_ANGLE = 2.399963229728653;
  const LEVEL_SIX_ENEMY_SPIRAL_SPACING_PADDING = 24;
  const LEVEL_SIX_ENEMY_SPIRAL_SPACING_FORCE = 2800;
  const LEVEL_SIX_ENEMY_SPIRAL_SPACING_VELOCITY_FACTOR = 0.42;
  const LEVEL_SIX_MOON_VISUAL_RADIUS_RATIO = 0.46;
  const LEVEL_SIX_MOON_COLLISION_PADDING = 4;
  const LEVEL_SIX_MOON_RESTITUTION = 0.78;
  const LEVEL_SIX_MOON_MIN_BOUNCE_SPEED = 58;
  const LEVEL_SIX_MOON_MAX_BOUNCE_SPEED = 220;
  const LEVEL_SIX_PLAYER_CONTROL_GRACE_SECONDS = 2.5;
  const COLLISION_RIPPLE_DURATION_SECONDS = 0.82;
  const COLLISION_RIPPLE_COOLDOWN_SECONDS = 0.28;
  const COLLISION_RIPPLE_START_RADIUS = 18;
  const COLLISION_RIPPLE_END_RADIUS = 112;
  const COLLISION_RIPPLE_CONTACT_MARGIN = 10;
  const COLLISION_RIPPLE_REPEAT_IMPACT_SPEED = 18;
  const COLLISION_RIPPLE_MAX_ACTIVE = 12;
  const PLANET_COLLISION_SOUND = "assets\\audio\\Boom - Earth Core Ripper (Space).aac";
  const PLANET_COLLISION_SOUND_CHANNEL = 102;
  const PLANET_COLLISION_SOUND_VOLUME = 50;
  const LEVEL_SIX_MOON_CONFIGS = [
    {
      resourceName: "ChatGPT Image May 27, 2025, 08_39_17 PM.png",
      size: 176,
      orbitFraction: 0.2,
      phase: 0.24,
      orbitSpeed: 0.11,
      rotationSpeed: 0.18,
    },
    {
      resourceName: "Planets\\Planet7.png",
      size: 224,
      orbitFraction: 0.58,
      phase: 2.36,
      orbitSpeed: 0.075,
      rotationSpeed: -0.14,
    },
    {
      resourceName: "moon-1303512_1280.png",
      size: 148,
      orbitFraction: 0.9,
      phase: 4.42,
      orbitSpeed: 0.13,
      rotationSpeed: 0.22,
    },
  ];
  const LEVEL_SEVEN_PRIMARY_PLANET_SIZE = 832;
  const LEVEL_SEVEN_PRIMARY_PLANET_RADIUS_RATIO = 0.42;
  const LEVEL_SEVEN_PRIMARY_PLANET_Y_RATIO = 0.24;
  const LEVEL_SEVEN_PRIMARY_PLANET_PHYSICS_BASE_RADIUS = 435;
  const LEVEL_SEVEN_SECONDARY_PLANET_SIZE = 1118;
  const LEVEL_SEVEN_SECONDARY_PLANET_RADIUS_RATIO = 0.42;
  const LEVEL_SEVEN_SECONDARY_PLANET_X_RATIO = 0.5;
  const LEVEL_SEVEN_SECONDARY_PLANET_Y_RATIO = 0.8;
  const LEVEL_SEVEN_PRIMARY_LIGHT_COLOR = "75;175;255";
  const LEVEL_SEVEN_PRIMARY_LIGHT_RADIUS = 1300;
  const LEVEL_SEVEN_SECONDARY_LIGHT_COLOR = "55;220;115";
  const LEVEL_SEVEN_SECONDARY_LIGHT_RADIUS = 1550;
  const LEVEL_SEVEN_PLANET_COLLISION_PADDING = 5;
  const LEVEL_SEVEN_PLANET_RESTITUTION = 0.74;
  const LEVEL_SEVEN_PLANET_MIN_BOUNCE_SPEED = 54;
  const LEVEL_SEVEN_PLANET_MAX_BOUNCE_SPEED = 260;
  const LEVEL_SEVEN_PLANET_Z_ORDER = 2;
  const LEVEL_SEVEN_PLANET12_RENDERER_MARKER = "__headSpaceLevelSevenPlanet12";
  const LEVEL_SEVEN_MOON_CONFIGS = [
    {
      key: "planet1",
      resourceUrl: "Planet1.png",
      parent: "primary",
      size: 180,
      radiusRatio: 0.45,
      orbitRadius: 559,
      phase: 2.15,
      orbitSpeed: 0.12,
      rotationSpeed: 0.14,
    },
    {
      key: "planet8",
      resourceUrl: "Planet8.png",
      parent: "secondary",
      size: 220,
      radiusRatio: 0.45,
      orbitRadius: 637,
      phase: 0.4,
      orbitSpeed: 0.1,
      rotationSpeed: 0.1,
    },
    {
      key: "planet9",
      resourceUrl: "Planet9.png",
      parent: "secondary",
      size: 190,
      radiusRatio: 0.45,
      orbitRadius: 793,
      phase: 3.55,
      orbitSpeed: 0.1,
      rotationSpeed: -0.13,
    },
  ];
  const LEVEL_EIGHT_PLANET_COLLISION_CONFIGS = [
    {
      objectName: "Planet_2",
      radiusRatio: 578.5 / 1200,
      offsetXRatio: 0,
      offsetYRatio: -1 / 1200,
    },
    {
      objectName: "Planet_5",
      radiusRatio: 456.5 / 1024,
      offsetXRatio: 0,
      offsetYRatio: 3 / 1024,
    },
  ];
  const LEVEL_EIGHT_PLANET_SIZE_SCALE = 1.2;
  const LEVEL_EIGHT_PLANET_WALL_OUTWARD_OFFSET = 120;
  const LEVEL_EIGHT_STATION_RESOURCE = "spacestationwhite.png";
  const LEVEL_EIGHT_STATION_SIZE = 780;
  const LEVEL_EIGHT_STATION_VISIBLE_TOP_RATIO = 473 / 1024;
  const LEVEL_EIGHT_STATION_VISIBLE_BOTTOM_RATIO = 503 / 1024;
  const LEVEL_EIGHT_STATION_VERTICAL_EDGE_MARGIN = 72;
  const LEVEL_EIGHT_STATION_BOB_ANGULAR_SPEED = 0.16;
  const LEVEL_EIGHT_STATION_COLLISION_INSET = 22;
  const LEVEL_EIGHT_STATION_ACTOR_RADIUS_SCALE = 0.78;
  const LEVEL_EIGHT_STATION_Z_OFFSET = 0.08;
  const LEVEL_EIGHT_STATION_RESTITUTION = 0.82;
  const LEVEL_EIGHT_STATION_MIN_BOUNCE_SPEED = 68;
  const LEVEL_EIGHT_STATION_MAX_BOUNCE_SPEED = 260;
  const LEVEL_EIGHT_STATION_ENEMY_MIN_BOUNCE_SPEED = 156;
  const LEVEL_EIGHT_STATION_ENEMY_MAX_BOUNCE_SPEED = 310;
  const LEVEL_EIGHT_STATION_ENEMY_TANGENT_RETENTION = 0.42;
  const LEVEL_EIGHT_STATION_ENEMY_VERTICAL_CARRY = 0.18;
  const LEVEL_EIGHT_STATION_ENEMY_BOUNCE_GUARD_SECONDS = 0.36;
  const LEVEL_EIGHT_STATION_ENEMY_ESCAPE_SPEED = 240;
  const LEVEL_EIGHT_STATION_COLLISION_RESOLUTION_PASSES = 5;
  const LEVEL_EIGHT_STATION_COLLISION_SEPARATION_PADDING = 5;
  const LEVEL_EIGHT_STATION_PROJECTILE_INTERVAL_SECONDS = 10;
  const LEVEL_EIGHT_STATION_PROJECTILE_SPEED = 360;
  const LEVEL_EIGHT_STATION_PROJECTILE_RADIUS = 30;
  const LEVEL_EIGHT_STATION_PROJECTILE_LIFETIME_SECONDS = 24;
  const LEVEL_EIGHT_STATION_PROJECTILE_MIN_SCALE = 0.26;
  const LEVEL_EIGHT_STATION_PROJECTILE_TAIL_SEGMENTS = 13;
  const LEVEL_EIGHT_STATION_PROJECTILE_SPARK_COUNT = 10;
  const LEVEL_EIGHT_STATION_PROJECTILE_BOUNDARY_MARGIN = 640;
  const LEVEL_EIGHT_STATION_PROJECTILE_SURFACE_RESTITUTION = 0.92;
  const LEVEL_EIGHT_STATION_PROJECTILE_BOSS_KNOCKBACK_SECONDS = 0.48;
  const LEVEL_EIGHT_STATION_PROJECTILE_IMPACT_DELTA_SPEED =
    LEVEL_EIGHT_STATION_MAX_BOUNCE_SPEED * 2;
  const LEVEL_EIGHT_STATION_PROJECTILE_AVOIDANCE_PADDING = 220;
  const LEVEL_EIGHT_STATION_PROJECTILE_AVOIDANCE_HORIZON_SECONDS = 1.35;
  const LEVEL_EIGHT_STATION_COLLISION_COMPONENTS = [
    { type: "ellipse-ring", offsetY: -0.184, radiusX: 0.318, radiusY: 0.064, thickness: 0.03 },
    { type: "ellipse-ring", offsetY: -0.022, radiusX: 0.322, radiusY: 0.068, thickness: 0.034 },
    { type: "ellipse-ring", offsetY: 0.133, radiusX: 0.16, radiusY: 0.038, thickness: 0.024 },
    { type: "capsule", offsetX: 0.008, startY: -0.41, endY: 0.065, radius: 0.066 },
    { type: "capsule", offsetX: 0.01, startY: 0.04, endY: 0.355, radius: 0.037 },
    { type: "capsule", offsetX: 0.012, startY: 0.32, endY: 0.485, radius: 0.019 },
  ];
  const LEVEL_NINE_BLACK_HOLE_RESOURCE = "blackhole.png";
  const LEVEL_NINE_BLACK_HOLE_SIZE = 820;
  const LEVEL_NINE_BLACK_HOLE_OUTER_EDGE_RATIO = 0.48;
  const LEVEL_NINE_BLACK_HOLE_EXIT_RATIO = 0.34;
  const LEVEL_NINE_BLACK_HOLE_INTAKE_SECONDS = 0.58;
  const LEVEL_NINE_BLACK_HOLE_EXIT_SECONDS = 0.42;
  const LEVEL_NINE_BLACK_HOLE_COOLDOWN_SECONDS = 1.1;
  const LEVEL_NINE_BLACK_HOLE_LAUNCH_SPEED = 390;
  const LEVEL_NINE_BLACK_HOLE_ROTATION_SPEED = 0.42;
  const LEVEL_NINE_BLACK_HOLE_SPARK_COUNT = 22;
  const LEVEL_NINE_BLACK_HOLE_TINTS = [0x9db8ff, 0xd28cff, 0xff7eb6, 0x799dff];
  const LEVEL_ELEVEN_ARENA_SCALE = 1.25;
  const LEVEL_ELEVEN_BLACK_HOLE_SIZE = 360;
  const LEVEL_ELEVEN_BLACK_HOLE_TRAVEL_DISTANCE = 620;
  const LEVEL_ELEVEN_BLACK_HOLE_OSCILLATION_SPEED = 0.28;
  const LEVEL_ELEVEN_PLANET_SIZE = 1440;
  const LEVEL_ELEVEN_PLANET_RADIUS = 654;
  const LEVEL_ELEVEN_STATION_SIZE = 420;
  const LEVEL_ELEVEN_STATION_RADIUS = 156;
  const LEVEL_ELEVEN_STATION_ORBIT_RADIUS = 900;
  const LEVEL_ELEVEN_STATION_ORBIT_SPEED = 0.18;
  const LEVEL_ELEVEN_PORTAL_TRIGGER_RADIUS = 138;
  const LEVEL_ELEVEN_PORTAL_COOLDOWN_SECONDS = 1.4;
  const LEVEL_ELEVEN_PORTAL_LAUNCH_SPEED = 290;
  const LEVEL_ELEVEN_PORTAL_INTAKE_SECONDS = 0.58;
  const LEVEL_ELEVEN_PORTAL_EXIT_SECONDS = 0.42;
  const LEVEL_ELEVEN_PLAYER_COLLISION_RADIUS_SCALE = 0.94;
  const MULTIPLAYER_LEVEL_FOUR_PLAYER_COLLISION_SCALE = 0.9;
  const MULTIPLAYER_LEVEL_FOUR_STATION_COLLISION_SCALE = 0.85;
  const LEVEL_ELEVEN_STATION_FIRE_INTERVAL_SECONDS = 5.2;
  const LEVEL_TWELVE_STATION_FIRE_INTERVAL_SECONDS = 20;
  const LEVEL_TWELVE_BLACK_HOLE_SIZE = 160;
  const LEVEL_TWELVE_PORTAL_TRIGGER_RADIUS = 58;
  const LEVEL_TWELVE_BLACK_HOLE_VERTEX_MARGIN = 30;
  const LEVEL_TWELVE_COSMIC_ALIEN_RESOURCE = "cosmicalien.png?v=level12-cosmic-alien-20260708-1";
  const LEVEL_TWELVE_COSMIC_ALIEN_GROWTH_MULTIPLIER = 10;
  const LEVEL_TWELVE_COSMIC_ALIEN_RESPAWN_SECONDS = 30;
  const LEVEL_TWELVE_COSMIC_ALIEN_SIZE_RATIO = 0.72;
  const LEVEL_TWELVE_COSMIC_ALIEN_MIN_SIZE = 32;
  const LEVEL_TWELVE_COSMIC_ALIEN_MAX_SIZE = 118;
  const LEVEL_TWELVE_COSMIC_ALIEN_ABSORBED_SIZE = 8;
  const LEVEL_TWELVE_COSMIC_ALIEN_SPAWN_BATCH_COUNT = 2;
  const LEVEL_TWELVE_COSMIC_ALIEN_SPARKLE_COUNT = 18;
  const LEVEL_TWELVE_COSMIC_ALIEN_PULSE_COLORS = [0x3f8cff, 0xffdf58, 0xff3f32];
  const LEVEL_TWELVE_COSMIC_ALIEN_PULSE_SEGMENTS_PER_SECOND = 0.82;
  const LEVEL_FIVE_COSMIC_ALIEN_SPAWN_SECONDS = 45;
  const LEVEL_FIVE_COSMIC_ALIEN_RESPAWN_SECONDS = 30;
  const LEVEL_FIVE_BOOST_RESOURCE = "boost.png?v=level5-boost-20260710-1";
  const LEVEL_FIVE_BOOST_WIDTH_RATIO = 0.184;
  const LEVEL_FIVE_BOOST_MIN_WIDTH = 208;
  const LEVEL_FIVE_BOOST_MAX_WIDTH = 328;
  const LEVEL_FIVE_BOOST_ASPECT_RATIO = 377 / 881;
  const LEVEL_FIVE_BOOST_EDGE_Y_RATIO = 0.22;
  const LEVEL_FIVE_BOOST_EDGE_X_RATIO = 0.1;
  const LEVEL_FIVE_BOOST_TRIGGER_HEIGHT_RATIO = 0.58;
  const LEVEL_FIVE_BOOST_CAPTURE_OVERLAP_RATIO = 0.15;
  const LEVEL_FIVE_BOOST_PULL_SPEED = 1800;
  const LEVEL_FIVE_BOOST_CAPTURE_MAX_SECONDS = 0.5;
  const LEVEL_FIVE_BOOST_LAUNCH_SPEED = 700;
  const LEVEL_FIVE_BOOST_DURATION_SECONDS = 0.65;
  const LEVEL_FIVE_BOOST_FLASH_HZ = 2.4;
  const LEVEL_FIVE_BOOST_WOBBLE_HZ = 5.5;
  const LEVEL_FIVE_BOOST_WOBBLE_ROTATION = 0.16;
  const LEVEL_FIVE_BOOST_LIGHTNING_BOLT_COUNT = 7;
  const LEVEL_FIVE_BOOST_LIGHTNING_SEGMENTS = 11;
  const LEVEL_EIGHT_COSMIC_ALIEN_RESPAWN_SECONDS = 30;
  const LEVEL_NINE_COSMIC_ALIEN_FIRST_SPAWN_SECONDS = 45;
  const LEVEL_NINE_COSMIC_ALIEN_RESPAWN_SECONDS = 30;
  const LEVEL_ELEVEN_STATION_PROJECTILE_SPEED = 360;
  const LEVEL_ELEVEN_STATION_PROJECTILE_LIFETIME_SECONDS = 12;
  const LEVEL_ELEVEN_TARGET_ENEMY_COUNT = 20;
  const LEVEL_TWELVE_SMALL_EXTRA_ENEMY_COUNT = 15;
  const LEVEL_TWELVE_TARGET_ENEMY_COUNT = 40 + LEVEL_TWELVE_SMALL_EXTRA_ENEMY_COUNT;
  const LEVEL_TWELVE_SMALL_EXTRA_ENEMY_SIZE_RATIOS = [0.24, 0.28, 0.32, 0.36, 0.4, 0.44];
  const LEVEL_TWELVE_LARGE_EXTRA_ENEMY_COUNT = 10;
  const LEVEL_TWELVE_LARGE_EXTRA_ENEMY_SIZE_RATIOS = [0.92, 1, 1.06, 1.12, 1.18];
  const LEVEL_TWELVE_HUGE_EXTRA_ENEMY_COUNT = 5;
  const LEVEL_TWELVE_HUGE_EXTRA_ENEMY_SIZE_RATIOS = [1.65, 1.85, 2.05, 2.25, 2.45];
  const LEVEL_TWELVE_PLAYER_START_ENEMY_CLEARANCE = 160;
  const LEVEL_ELEVEN_EXTRA_ENEMY_SIZE_RATIOS = [0.38, 0.48, 0.58, 0.68, 0.82, 0.96, 1.08, 1.18];
  const LEVEL_ELEVEN_TRIEXO_RESOURCE = "triexo.png?v=level11-triexo-20260706-1";
  const LEVEL_ELEVEN_TRIEXO_COUNT = 10;
  const LEVEL_TWELVE_TRIEXO_COUNT = 5;
  const LEVEL_ELEVEN_TRIEXO_SIZE = 210;
  const LEVEL_ELEVEN_TRIEXO_RADIUS = 90;
  const LEVEL_ELEVEN_TRIEXO_FRAME_HALF_WIDTH = 18;
  const LEVEL_ELEVEN_TRIEXO_FRAME_TOP_Y = -74;
  const LEVEL_ELEVEN_TRIEXO_FRAME_BOTTOM_X = 74;
  const LEVEL_ELEVEN_TRIEXO_FRAME_BOTTOM_Y = 58;
  const LEVEL_ELEVEN_TRIEXO_ARENA_MARGIN = 110;
  const LEVEL_ELEVEN_TRIEXO_PLANET_CLEARANCE = 90;
  const LEVEL_ELEVEN_TRIEXO_PAIR_CLEARANCE = 44;
  const LEVEL_ELEVEN_TRIEXO_RESTITUTION = 0.88;
  const LEVEL_ELEVEN_TRIEXO_MIN_FLING_SPEED = 110;
  const LEVEL_ELEVEN_TRIEXO_MAX_FLING_SPEED = 420;
  const LEVEL_ELEVEN_TRIEXO_LINEAR_DAMPING = 0.18;
  const LEVEL_ELEVEN_TRIEXO_ANGULAR_DAMPING = 0.42;
  const LEVEL_ELEVEN_TRIEXO_SOUND_COOLDOWN_SECONDS = 0.12;
  const LEVEL_ELEVEN_TRIEXO_BOSS_KNOCKBACK_SECONDS = 0.42;
  const LEVEL_TWELVE_ARENA_SIDE_COUNT = 6;
  const LEVEL_TWELVE_ARENA_APOTHEM_SCALE = 1.2;
  const LEVEL_TWELVE_TRANSIT_PERIOD_SECONDS = 60;
  const LEVEL_TWELVE_PLANET10_SIZE = 560;
  const LEVEL_TWELVE_PLANET10_RADIUS = 245;
  const LEVEL_TWELVE_PLANET1_SIZE = 170;
  const LEVEL_TWELVE_PLANET1_RADIUS = 72;
  const LEVEL_TWELVE_PLANET1_ORBIT_RADIUS = 390;
  const LEVEL_TWELVE_PLANET1_ORBIT_SPEED = 0.18;
  const LEVEL_TWELVE_PLANET14_SIZE = 520;
  const LEVEL_TWELVE_PLANET14_RADIUS = 228;
  const LEVEL_TWELVE_PLANET6_SIZE = 160;
  const LEVEL_TWELVE_PLANET6_RADIUS = 68;
  const LEVEL_TWELVE_PLANET6_ORBIT_RADIUS = 360;
  const LEVEL_TWELVE_PLANET6_ORBIT_SPEED = -0.165;
  const LEVEL_TWELVE_EYE_PLANET8_SIZE = 760;
  const LEVEL_TWELVE_EYE_PLANET8_RADIUS = 330;
  const LEVEL_TWELVE_EYE_PLANET11_SIZE = 190;
  const LEVEL_TWELVE_EYE_PLANET11_RADIUS = 82;
  const LEVEL_TWELVE_EYE_PLANET11_ORBIT_RADIUS = 540;
  const LEVEL_TWELVE_EYE_PLANET11_ORBIT_SPEED = 0.2;
  const LEVEL_TWELVE_EYE_PLANET3_SIZE = 170;
  const LEVEL_TWELVE_EYE_PLANET3_RADIUS = 74;
  const LEVEL_TWELVE_EYE_PLANET3_ORBIT_RADIUS = 475;
  const LEVEL_TWELVE_EYE_PLANET3_ORBIT_SPEED = -0.235;
  const LEVEL_NINE_SMALL_PLANET_CONFIGS = [
    { key: "planet1", resourceUrl: "Planet1.png", size: 420, radiusRatio: 0.44, xRatio: 0.16, yRatio: 0.16, rotationSpeed: 0.055 },
    { key: "planet2", resourceUrl: "Planet2.png", size: 360, radiusRatio: 0.44, xRatio: 0.5, yRatio: 0.13, rotationSpeed: -0.045 },
    { key: "planet3", resourceUrl: "Planet3.png", size: 330, radiusRatio: 0.44, xRatio: 0.84, yRatio: 0.17, rotationSpeed: 0.06 },
    { key: "planet4", resourceUrl: "Planet4.png", size: 390, radiusRatio: 0.44, xRatio: 0.28, yRatio: 0.82, rotationSpeed: -0.05 },
    { key: "planet6", resourceUrl: "Planet6.png", size: 350, radiusRatio: 0.44, xRatio: 0.72, yRatio: 0.82, rotationSpeed: 0.048 },
  ];
  const LEVEL_NINE_SMALL_PLANET_PORTAL_CLEARANCE = 150;
  const LEVEL_NINE_SMALL_PLANET_PAIR_CLEARANCE = 110;
  const LEVEL_NINE_SMALL_PLANET_EDGE_CLEARANCE = 58;
  const LEVEL_NINE_SMALL_PLANET_WALL_CLEARANCE = 45;
  const LEVEL_NINE_SMALL_PLANET_COLLISION_PADDING = 5;
  const LEVEL_NINE_SMALL_PLANET_RESTITUTION = 0.78;
  const LEVEL_NINE_SMALL_PLANET_MIN_BOUNCE_SPEED = 58;
  const LEVEL_NINE_SMALL_PLANET_MAX_BOUNCE_SPEED = 280;
  const LEVEL_TEN_BACKGROUND_RESOURCE = "b2 (2).png";
  const LEVEL_TEN_ARENA_CENTER_X = 640;
  const LEVEL_TEN_ARENA_CENTER_Y = 360;
  const LEVEL_TEN_ARENA_RADIUS = 3000;
  const LEVEL_TEN_ARENA_WALL_SEGMENTS = 55;
  const LEVEL_TEN_ARENA_WALL_WIDTH = 76;
  const LEVEL_TEN_ARENA_WALL_LENGTH = 338;
  const LEVEL_TEN_ARENA_RESTITUTION = 0.76;
  const LEVEL_TEN_SUN_SIZE = 1300;
  const LEVEL_TEN_SUN_RADIUS_RATIO = 0.43;
  const LEVEL_TEN_SUN_ROTATION_SPEED = 0.055;
  const LEVEL_TEN_SUN_LIGHT_RADIUS = 2900;
  const LEVEL_TEN_SUN_LIGHT_PERIOD_SECONDS = 8;
  const LEVEL_TEN_EXTRA_SMALL_ENEMY_COUNT = 8;
  const LEVEL_TEN_EXTRA_SMALL_ENEMY_SIZE_RATIOS = [0.28, 0.34, 0.4, 0.46, 0.52, 0.58, 0.37, 0.49];
  const LEVEL_TEN_PLAYER_CONTROL_GRACE_SECONDS = 2.5;
  const LEVEL_TEN_ACTOR_START_CLEARANCE = 220;
  const LEVEL_TEN_SOLAR_COLLISION_PADDING = 6;
  const LEVEL_TEN_SOLAR_RESTITUTION = 0.78;
  const LEVEL_TEN_SOLAR_MIN_BOUNCE_SPEED = 62;
  const LEVEL_TEN_SOLAR_MAX_BOUNCE_SPEED = 310;
  const LEVEL_TEN_ORBITAL_BODY_CONFIGS = [
    {
      key: "planet5",
      resourceUrl: "Planet5.png",
      size: 420,
      radiusRatio: 0.43,
      orbitRadius: 1050,
      phase: 0.4,
      orbitSpeed: 0.62,
      rotationSpeed: 0.18,
    },
    {
      key: "planet14",
      resourceUrl: "Planet14.png",
      size: 520,
      radiusRatio: 0.44,
      orbitRadius: 2150,
      phase: 4.35,
      orbitSpeed: 0.27,
      rotationSpeed: 0.08,
    },
  ];
  const LEVEL_TEN_PLANET11_CONFIG = {
    key: "planet11",
    resourceUrl: "Planet11.png",
    size: 220,
    radiusRatio: 0.43,
    orbitRadius: 400,
    phase: 1.25,
    orbitSpeed: 0.9,
    rotationSpeed: 0.2,
  };
  const REGULAR_ENEMY_RESPAWN_BATCH_COUNT = 3;
  const REGULAR_ENEMY_LOW_COUNT_THRESHOLD = 3;
  const REGULAR_ENEMY_LOW_COUNT_DELAY_SECONDS = 20;
  const REGULAR_ENEMY_ZERO_COUNT_DELAY_SECONDS = 5;
  const REGULAR_ENEMY_ZERO_WAVE_SPAN_SECONDS = 10;
  const REGULAR_ENEMY_RESPAWN_SIZE_RATIOS = [0.42, 0.6, 0.78];
  const BOSS_RESPAWN_ENEMY_MIN_SIZE = 34;
  const BOSS_RESPAWN_ENEMY_MIN_RATIO = 0.38;
  const BOSS_RESPAWN_ENEMY_MAX_RATIO = 0.82;
  const BOSS_RESPAWN_ENEMY_ARENA_PADDING = 54;
  const BOSS_MIN_SIZE = 175;
  const BOSS_MAX_SIZE = 300;
  const BOSS_SIZE_BASE_RATIO = 1.02;
  const BOSS_SIZE_LEVEL_RATIO_STEP = 0.018;
  const BOSS_MIN_START_DISTANCE = 560;
  const BOSS_START_DISTANCE_PLAYER_WEIGHT = 1.6;
  const BOSS_START_DISTANCE_BOSS_WEIGHT = 1.0;
  const BOSS_START_BOUNDARY_PADDING = 120;
  const BOSS_BOOTSTRAP_RESCUE_WINDOW_MS = 2000;
  const MUSIC_CHANNEL = 1;
  const MUSIC_VOLUME = 100;
  const MUSIC_RETRY_INTERVAL_MS = 1000;
  const BACKGROUND_MUSIC_TRACKS = [
    "Found in space.mp3",
    "Inner Frontier.mp3",
    "RAS Counter Of Stars.mp3",
    "RAS Cryogenic Power Nap.mp3",
    "RAS Deep Space Heart Throb.mp3",
    "RAS Ejector.mp3",
    "RAS Eternal Machine.mp3",
    "RAS Gravity Well.mp3",
    "RAS Orbit Arboretum.mp3",
    "RAS Pillars of Creation.mp3",
    "RAS Short War.mp3",
    "RAS Solar Sail.mp3",
    "RAS Vector.mp3",
    "RAS Way Gate.mp3",
  ];
  const SFX_VOLUME_CAPS = new Map([
    ["boom - earth core ripper (space).aac", 24],
    ["bluezone_bc0271_debris_falling_rock_dust_002.aac", 22],
    ["audio - impact - wet - hard - 49.aac", 18],
    ["braam - this one is massive (space).aac", 26],
    ["chord - sorrowful (space).aac", 22],
    ["pickup magic.aac", 24],
    ["audio - bluezone bc0268 switch button click high tech interface 001.aac", 18],
  ]);

  const sceneState = new WeakMap();
  const homeMenuLayoutState = new WeakMap();
  const homeMenuActionButtonState = new WeakMap();
  const levelSixMoonSprites = new WeakMap();
  const levelSevenPlanetSystemState = new WeakMap();
  const levelEightStationSystemState = new WeakMap();
  const levelNineBlackHoleSystemState = new WeakMap();
  const levelTenSolarSystemState = new WeakMap();
  const levelElevenCelestialSystemState = new WeakMap();
  const levelFiveCosmicAlienSystemState = new WeakMap();
  const levelFiveBoostSystemState = new WeakMap();
  const levelEightCosmicAlienSystemState = new WeakMap();
  const levelNineCosmicAlienSystemState = new WeakMap();
  const levelSelectCelestialSystemState = new WeakMap();
  const multiplayerLevelOneMazeState = new WeakMap();
  const multiplayerLevelOneFeatureState = new WeakMap();
  const multiplayerLevelTwoPongState = new WeakMap();
  const MULTIPLAYER_LEVEL_TWO_ENEMY_SIZE_RATIOS = [0.14, 0.27, 0.45, 0.64];
  const multiplayerBlueWallFeedbackState = new WeakMap();
  const multiplayerModeObjectiveState = new WeakMap();
  const multiplayerParticipantState = new WeakMap();
  const multiplayerActorLightObstacleState = new WeakMap();
  const multiplayerLevelThreeLayoutState = new WeakMap();
  const multiplayerLevelFourHoneycombState = new WeakMap();
  const lastAllowedHelmetSelectionByGame = new WeakMap();
  const levelOverPrimaryRendererLabelState = new WeakMap();
  const REMOVED_KNIGHT_HELMET_INDEX = 3;
  const homeHighResBackgroundState = new WeakMap();
  const levelHighResBackgroundState = new WeakMap();
  const playerCollisionRippleState = new WeakMap();
  let bestTimes = loadBestTimes();
  let activeRuntimeScene = null;
  let multiplayerInputSuppressedUntil = 0;

  function isMultiplayerDomInputOwned() {
    return Boolean(
      globalThis.HeadSpaceMultiplayerSetup?.isOpen?.() ||
      performance.now() < multiplayerInputSuppressedUntil
    );
  }

  function installMultiplayerDomInputShield() {
    const inputTools = gdjs?.evtTools?.input;
    if (!inputTools || inputTools.__headSpaceMultiplayerDomShieldInstalled) return;
    inputTools.__headSpaceMultiplayerDomShieldInstalled = true;
    for (const methodName of [
      "isMouseButtonPressed",
      "isMouseButtonReleased",
      "hasAnyTouchStarted",
      "hasAnyTouchOrMouseStarted",
    ]) {
      const original = inputTools[methodName];
      if (typeof original !== "function") continue;
      inputTools[methodName] = function (...args) {
        if (isMultiplayerDomInputOwned()) return false;
        return original.apply(this, args);
      };
    }
  }
  let pendingPauseMenuNavigation = null;
  let openMultiplayerSetupAfterNavigation = false;
  let multiplayerSetupNavigationSourceScene = null;
  let multiplayerSelectionSnapshotAfterNavigation = null;
  let musicUnlockHandlersInstalled = false;
  let musicGestureSeen = false;
  let nextMusicRetryAt = 0;
  let lastBackgroundMusicTrack = null;
  let screenWakeLock = null;
  let screenWakeLockRequest = null;
  let screenWakeLockDesired = false;
  let nextWakeLockRetryAt = 0;

  function shouldKeepScreenAwake(runtimeScene = activeRuntimeScene) {
    if (!runtimeScene || runtimeScene.getName?.() !== "Game") return false;
    const level = getCurrentLevel(runtimeScene);
    if (!isPlayableLevel(level)) return false;
    return !getSceneBoolean(runtimeScene, "LevelWon") && !getSceneBoolean(runtimeScene, "LevelLost");
  }

  async function requestScreenWakeLock() {
    screenWakeLockDesired = shouldKeepScreenAwake();
    if (!screenWakeLockDesired || screenWakeLock || screenWakeLockRequest) return Boolean(screenWakeLock);
    if (document.visibilityState !== "visible" || !navigator.wakeLock?.request) return false;
    if (Date.now() < nextWakeLockRetryAt) return false;

    try {
      screenWakeLockRequest = navigator.wakeLock.request("screen");
      const sentinel = await screenWakeLockRequest;
      if (!screenWakeLockDesired || document.visibilityState !== "visible") {
        await sentinel.release?.();
        return false;
      }
      screenWakeLock = sentinel;
      nextWakeLockRetryAt = 0;
      sentinel.addEventListener?.("release", () => {
        if (screenWakeLock === sentinel) screenWakeLock = null;
      });
      return true;
    } catch {
      // Browser policy, battery-saving mode, or an older browser may deny it.
      nextWakeLockRetryAt = Date.now() + 5000;
      return false;
    } finally {
      screenWakeLockRequest = null;
    }
  }

  function releaseScreenWakeLock() {
    screenWakeLockDesired = false;
    const sentinel = screenWakeLock;
    screenWakeLock = null;
    if (sentinel?.release) Promise.resolve(sentinel.release()).catch(() => {});
  }

  function syncScreenWakeLock(runtimeScene = activeRuntimeScene) {
    const desired = shouldKeepScreenAwake(runtimeScene);
    screenWakeLockDesired = desired;
    if (!desired) {
      releaseScreenWakeLock();
      return;
    }
    void requestScreenWakeLock();
  }

  function installScreenWakeLockHandlers() {
    if (installScreenWakeLockHandlers.installed) return;
    installScreenWakeLockHandlers.installed = true;
    const tryFromGesture = () => {
      if (shouldKeepScreenAwake()) void requestScreenWakeLock();
    };
    window.addEventListener("pointerdown", tryFromGesture, { capture: true, passive: true });
    window.addEventListener("touchstart", tryFromGesture, { capture: true, passive: true });
    window.addEventListener("keydown", tryFromGesture, { capture: true });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") syncScreenWakeLock();
    });
    window.addEventListener("pagehide", releaseScreenWakeLock);
  }

  window.HeadSpaceWakeLock = Object.freeze({
    request: requestScreenWakeLock,
    sync: syncScreenWakeLock,
    getState: () => ({
      supported: Boolean(navigator.wakeLock?.request),
      desired: screenWakeLockDesired,
      active: Boolean(screenWakeLock && !screenWakeLock.released),
    }),
  });

  window.addEventListener(
    "keydown",
    (event) => {
      if (event.code === "Space" || event.key === " ") event.preventDefault();
    },
    { passive: false }
  );

  function loadBestTimes() {
    try {
      const raw = window.localStorage.getItem(BEST_TIMES_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }

  function saveBestTimes() {
    try {
      window.localStorage.setItem(BEST_TIMES_KEY, JSON.stringify(bestTimes));
    } catch {
      // Ignore storage failures.
    }
  }

  function isAudioContextRunning() {
    try {
      return window.Howler?.ctx?.state === "running";
    } catch {
      return false;
    }
  }

  function isBackgroundMusicPlaying(runtimeScene) {
    try {
      return gdjs.evtTools.sound.isSoundOnChannelPlaying(runtimeScene, MUSIC_CHANNEL);
    } catch {
      return false;
    }
  }

  function markBackgroundMusicInitialized(runtimeScene) {
    try {
      runtimeScene.getGame().getVariables().get("musicInitialized").setNumber(1);
    } catch {
      // Leave authored music state untouched if the variable is unavailable.
    }
  }

  function pickBackgroundMusicTrack() {
    if (BACKGROUND_MUSIC_TRACKS.length === 1) return BACKGROUND_MUSIC_TRACKS[0];

    let track = BACKGROUND_MUSIC_TRACKS[Math.floor(Math.random() * BACKGROUND_MUSIC_TRACKS.length)];
    if (track === lastBackgroundMusicTrack) {
      const index = BACKGROUND_MUSIC_TRACKS.indexOf(track);
      track = BACKGROUND_MUSIC_TRACKS[(index + 1) % BACKGROUND_MUSIC_TRACKS.length];
    }
    lastBackgroundMusicTrack = track;
    return track;
  }

  function playBackgroundMusic(runtimeScene) {
    if (!runtimeScene || runtimeScene.getName?.() !== "Game") return false;
    if (isBackgroundMusicPlaying(runtimeScene)) {
      markBackgroundMusicInitialized(runtimeScene);
      return true;
    }

    nextMusicRetryAt = Date.now() + MUSIC_RETRY_INTERVAL_MS;
    try {
      gdjs.evtTools.sound.playSoundOnChannel(
        runtimeScene,
        pickBackgroundMusicTrack(),
        MUSIC_CHANNEL,
        false,
        MUSIC_VOLUME,
        1
      );
      markBackgroundMusicInitialized(runtimeScene);
      return true;
    } catch {
      return false;
    }
  }

  function handleMusicUnlockGesture() {
    musicGestureSeen = true;
    try {
      window.Howler?.ctx?.resume?.();
    } catch {
      // Howler may not have created an audio context yet.
    }

    nextMusicRetryAt = 0;
    playBackgroundMusic(activeRuntimeScene);
  }

  function installMusicUnlockHandlers() {
    if (musicUnlockHandlersInstalled) return;
    musicUnlockHandlersInstalled = true;

    const pointerOptions = { capture: true, passive: true };
    window.addEventListener("pointerdown", handleMusicUnlockGesture, pointerOptions);
    window.addEventListener("touchstart", handleMusicUnlockGesture, pointerOptions);
    window.addEventListener("keydown", handleMusicUnlockGesture, { capture: true });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") syncBackgroundMusic(activeRuntimeScene);
    });
  }

  function syncBackgroundMusic(runtimeScene) {
    if (!runtimeScene || runtimeScene.getName?.() !== "Game") return;
    installMusicUnlockHandlers();

    if (isBackgroundMusicPlaying(runtimeScene)) {
      markBackgroundMusicInitialized(runtimeScene);
      return;
    }

    if (!musicGestureSeen && !isAudioContextRunning()) return;
    if (Date.now() < nextMusicRetryAt) return;
    playBackgroundMusic(runtimeScene);
  }

  function normalizeAudioAssetName(soundName) {
    return String(soundName || "")
      .replace(/\\/g, "/")
      .split("/")
      .pop()
      .toLowerCase();
  }

  function getBalancedSfxVolume(soundName, volume) {
    const cap = SFX_VOLUME_CAPS.get(normalizeAudioAssetName(soundName));
    if (!Number.isFinite(cap)) return volume;

    const numericVolume = Number(volume);
    if (!Number.isFinite(numericVolume)) return volume;
    return Math.min(numericVolume, cap);
  }

  function installSfxVolumeCaps() {
    const soundTools = gdjs?.evtTools?.sound;
    if (!soundTools || soundTools.__headSpaceSfxVolumeCapsInstalled) return;

    const originalPlaySound = soundTools.playSound;
    if (typeof originalPlaySound === "function") {
      soundTools.playSound = function (...args) {
        args[3] = getBalancedSfxVolume(args[1], args[3]);
        return originalPlaySound.apply(this, args);
      };
    }

    const originalPlaySoundOnChannel = soundTools.playSoundOnChannel;
    if (typeof originalPlaySoundOnChannel === "function") {
      soundTools.playSoundOnChannel = function (...args) {
        args[4] = getBalancedSfxVolume(args[1], args[4]);
        return originalPlaySoundOnChannel.apply(this, args);
      };
    }

    soundTools.__headSpaceSfxVolumeCapsInstalled = true;
  }

  function installLevelOverRetryLobbyGuard() {
    const multiplayer = gdjs?.multiplayer;
    const originalOpenLobbiesWindow = multiplayer?.openLobbiesWindow;
    if (typeof originalOpenLobbiesWindow !== "function") return;
    if (originalOpenLobbiesWindow.__headSpaceLevelOverRetryGuard) return;

    const guardedOpenLobbiesWindow = function (runtimeScene) {
      try {
        const scene = runtimeScene || activeRuntimeScene;
        if (
          scene?.getName?.() === "Game" &&
          isPlayableLevel(getCurrentLevel(scene)) &&
          getSceneBoolean(scene, "LevelWon")
        ) {
          return;
        }
      } catch {
        // Fall through to the authored multiplayer action outside the win screen.
      }

      return originalOpenLobbiesWindow.apply(this, arguments);
    };

    guardedOpenLobbiesWindow.__headSpaceLevelOverRetryGuard = true;
    multiplayer.openLobbiesWindow = guardedOpenLobbiesWindow;
  }

  function ensureBrandBadge() {
    let badge = document.getElementById(BRAND_ID);
    if (badge) return badge;

    badge = document.createElement("div");
    badge.id = BRAND_ID;
    badge.style.position = "fixed";
    badge.style.left = "4px";
    badge.style.bottom = "4px";
    badge.style.display = "flex";
    badge.style.alignItems = "center";
    badge.style.gap = "4px";
    badge.style.padding = "3px 4px";
    badge.style.background = "rgba(0, 0, 0, 0.62)";
    badge.style.border = "1px solid rgba(255, 255, 255, 0.45)";
    badge.style.borderRadius = "3px";
    badge.style.color = "#FFFFFF";
    badge.style.fontFamily = "Achron, Arial, sans-serif";
    badge.style.fontSize = "8px";
    badge.style.lineHeight = "1";
    badge.style.letterSpacing = "0";
    badge.style.whiteSpace = "nowrap";
    badge.style.boxSizing = "border-box";
    badge.style.textShadow = "0 1px 2px rgba(0, 0, 0, 0.65)";
    badge.style.pointerEvents = "none";
    badge.style.zIndex = "2147483646";

    const logo = document.createElement("img");
    logo.src = "ourologo262.png";
    logo.alt = "OUROBORIALIS";
    logo.style.width = "14px";
    logo.style.height = "14px";
    logo.style.display = "block";
    logo.style.flex = "0 0 14px";
    logo.style.objectFit = "contain";

    const label = document.createElement("span");
    label.textContent = "OUROBORIALIS";

    badge.appendChild(logo);
    badge.appendChild(label);
    document.body.appendChild(badge);
    return badge;
  }

  function isTouchLandscapeViewport() {
    const viewport = window.visualViewport;
    const width = viewport?.width || window.innerWidth;
    const height = viewport?.height || window.innerHeight;
    return (navigator.maxTouchPoints > 0 || window.matchMedia?.("(pointer: coarse)")?.matches) && width > height;
  }

  function updateBrandBadgePosition() {
    const badge = ensureBrandBadge();
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    badge.style.left = `${Math.round(rect.left + 6)}px`;
    badge.style.bottom = `${Math.round(Math.max(4, window.innerHeight - rect.bottom + 6))}px`;
  }

  function ensureTouchHint() {
    let hint = document.getElementById(TOUCH_HINT_ID);
    if (hint) return hint;
    hint = document.createElement("div");
    hint.id = TOUCH_HINT_ID;
    hint.textContent = "TAP TO MOVE";
    Object.assign(hint.style, {
      position: "fixed",
      display: "none",
      padding: "6px 10px",
      border: "1px solid rgba(89,214,255,.72)",
      borderRadius: "7px",
      color: "#dff8ff",
      background: "rgba(1,9,20,.72)",
      font: "700 12px Achron,Arial,sans-serif",
      letterSpacing: "1px",
      pointerEvents: "none",
      zIndex: "2147483645",
    });
    document.body.appendChild(hint);
    window.addEventListener("pointerdown", () => {
      hint.dataset.dismissed = "true";
      hint.style.display = "none";
    }, { once: true, passive: true });
    return hint;
  }

  function ensureHud() {
    let hud = document.getElementById(HUD_ID);
    if (hud) return hud;

    hud = document.createElement("div");
    hud.id = HUD_ID;
    hud.style.position = "fixed";
    hud.style.top = "16px";
    hud.style.left = "16px";
    hud.style.padding = "clamp(6px, 0.65vw, 9px) clamp(8px, 0.8vw, 12px)";
    hud.style.borderRadius = "8px";
    hud.style.background = "rgba(0, 0, 0, 0.72)";
    hud.style.border = "1px solid rgba(255, 255, 255, 0.42)";
    hud.style.color = "#FFFFFF";
    hud.style.fontFamily = "Achron, Arial, sans-serif";
    hud.style.fontSize = "clamp(16px, 1.1vw, 21px)";
    hud.style.lineHeight = "1.08";
    hud.style.letterSpacing = "0.7px";
    hud.style.maxWidth = "calc(100vw - 190px)";
    hud.style.whiteSpace = "pre-line";
    hud.style.pointerEvents = "none";
    hud.style.display = "block";
    hud.style.zIndex = "2147483647";
    document.body.appendChild(hud);
    return hud;
  }

  function togglePauseFromHud() {
    const runtimeScene = activeRuntimeScene;
    if (!runtimeScene || runtimeScene.getName?.() !== "Game") return;

    const level = getCurrentLevel(runtimeScene);
    if (!isPlayableLevel(level)) return;
    if (getSceneBoolean(runtimeScene, "LevelWon") || getSceneBoolean(runtimeScene, "LevelLost")) return;

    const state = ensureSceneState(runtimeScene, level);
    setSceneBoolean(runtimeScene, "Paused", !getSceneBoolean(runtimeScene, "Paused"));
    syncPauseState(runtimeScene, state, true);
  }

  function ensureHudPauseButton() {
    let button = document.getElementById(HUD_PAUSE_BUTTON_ID);
    if (button) return button;

    button = document.createElement("button");
    button.id = HUD_PAUSE_BUTTON_ID;
    button.type = "button";
    button.title = "Pause";
    button.setAttribute("aria-label", "Pause game");
    button.textContent = "\u23F8";
    button.style.position = "fixed";
    button.style.display = "none";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.padding = "0";
    button.style.border = "1px solid rgba(255, 255, 255, 0.52)";
    button.style.borderRadius = "8px";
    button.style.background = "rgba(0, 0, 0, 0.76)";
    button.style.color = "#ffffff";
    button.style.fontFamily = "Arial, sans-serif";
    button.style.lineHeight = "1";
    button.style.cursor = "pointer";
    button.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.38)";
    button.style.textShadow = "0 0 8px rgba(120, 220, 255, 0.7)";
    button.style.zIndex = "2147483646";
    button.style.transition = "filter 100ms ease, transform 100ms ease";

    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      button.style.transform = "scale(0.94)";
    });
    button.addEventListener("pointerup", (event) => {
      event.preventDefault();
      event.stopPropagation();
      button.style.transform = "scale(1)";
    });
    button.addEventListener("pointercancel", () => {
      button.style.transform = "scale(1)";
    });
    button.addEventListener("pointerover", () => {
      button.style.filter = "brightness(1.28)";
    });
    button.addEventListener("pointerout", () => {
      button.style.filter = "brightness(1)";
      button.style.transform = "scale(1)";
    });
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      togglePauseFromHud();
    });

    document.body.appendChild(button);
    return button;
  }

  function setHudVisible(visible) {
    ensureHud().style.display = visible ? "block" : "none";
    ensureHudPauseButton().style.display = visible ? "flex" : "none";
    const touchHint = ensureTouchHint();
    touchHint.style.display = visible && isTouchLandscapeViewport() && touchHint.dataset.dismissed !== "true" ? "block" : "none";
  }

  function setHudPauseButtonVisible(visible) {
    ensureHudPauseButton().style.display = visible ? "flex" : "none";
  }

  function syncHudPauseButtonState(paused) {
    const button = ensureHudPauseButton();
    button.textContent = paused ? "\u25B6" : "\u23F8";
    button.title = paused ? "Resume" : "Pause";
    button.setAttribute("aria-label", paused ? "Resume game" : "Pause game");
  }

  function createPauseButton(label, action) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.action = action;
    button.textContent = label;
    button.style.width = `min(${PAUSE_MENU_BUTTON_WIDTH_PX}px, 72vw)`;
    button.style.maxWidth = `${PAUSE_MENU_BUTTON_MAX_WIDTH_VW}vw`;
    button.style.height = `clamp(42px, 8.5vh, ${PAUSE_MENU_BUTTON_HEIGHT_PX}px)`;
    button.style.margin = `clamp(2px, 0.5vh, ${PAUSE_MENU_BUTTON_MARGIN_Y_PX}px) 0`;
    button.style.padding = "0 clamp(18px, 4vw, 38px)";
    button.style.border = "2px solid #45d7ff";
    button.style.borderRadius = "9px";
    button.style.background = "linear-gradient(180deg, rgba(8,32,54,.96), rgba(1,10,23,.98))";
    button.style.boxShadow = "inset 0 0 15px rgba(69,215,255,.14), 0 0 12px rgba(69,215,255,.25), 0 8px 18px rgba(0,0,0,.4)";
    button.style.color = "#ffffff";
    button.style.cursor = "pointer";
    button.style.fontFamily = `${HEADNAUT_DOM_FONT_FAMILY}, sans-serif`;
    button.style.fontSize =
      action === "level-select"
        ? `clamp(14px, 3vh, ${PAUSE_MENU_BUTTON_WIDE_FONT_SIZE_PX}px)`
        : `clamp(16px, 3.4vh, ${PAUSE_MENU_BUTTON_FONT_SIZE_PX}px)`;
    button.style.letterSpacing = "1.8px";
    button.style.lineHeight = "1.05";
    button.style.textAlign = "center";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.textShadow = "1px 0 #00ffc8, -1px 0 #ff2ab8, 0 0 8px rgba(255,255,255,.55)";
    button.style.textTransform = "uppercase";
    button.style.transition = "transform 120ms ease, filter 120ms ease, box-shadow 120ms ease";
    return button;
  }

  function ensurePauseOverlay() {
    if (!document.getElementById("headspace-achron-font")) {
      const fontStyle = document.createElement("style");
      fontStyle.id = "headspace-achron-font";
      fontStyle.textContent =
        `@font-face{font-family:"${HEADNAUT_DOM_FONT_FAMILY}";src:url("Achron.otf") format("opentype");font-style:normal;font-weight:400 900;font-display:block}`;
      document.head.appendChild(fontStyle);
      document.fonts?.load?.(`700 32px "${HEADNAUT_DOM_FONT_FAMILY}"`).catch?.(() => {});
    }
    let overlay = document.getElementById(PAUSE_OVERLAY_ID);
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.id = PAUSE_OVERLAY_ID;
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.display = "none";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.flexDirection = "column";
    overlay.style.gap = "clamp(1px, 0.5vh, 5px)";
    overlay.style.background =
      "radial-gradient(circle at 50% 42%, rgba(16, 34, 66, 0.78), rgba(0, 0, 0, 0.9) 62%, rgba(0,0,0,0.96) 100%)";
    overlay.style.backdropFilter = "blur(2px)";
    overlay.style.boxSizing = "border-box";
    overlay.style.overflow = "hidden";
    overlay.style.padding = "clamp(10px, 2vh, 24px) 0";
    overlay.style.zIndex = "2147483647";

    const title = document.createElement("div");
    title.textContent = "PAUSED";
    title.style.marginBottom = "clamp(3px, 1vh, 10px)";
    title.style.color = "#ffffff";
    title.style.fontFamily = `${HEADNAUT_DOM_FONT_FAMILY}, sans-serif`;
    title.style.fontSize = "clamp(38px, 9vh, 88px)";
    title.style.letterSpacing = "8px";
    title.style.textShadow =
      "5px 0 #00ffc8, -5px 0 #ff2ab8, 0 6px 0 rgba(0,0,0,0.9), 0 0 32px rgba(100,215,255,0.62)";
    overlay.appendChild(title);

    overlay.appendChild(createPauseButton("RESUME", "resume"));
    overlay.appendChild(createPauseButton("HOME", "home"));
    overlay.appendChild(createPauseButton("RETRY", "retry"));
    overlay.appendChild(createPauseButton("LEVEL SELECT", "level-select"));

    overlay.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      handlePauseMenuAction(button.dataset.action);
    });
    overlay.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const button = event.target.closest("button[data-action]");
      if (button) button.style.transform = "scale(0.97)";
    });
    overlay.addEventListener("pointerup", (event) => {
      const button = event.target.closest("button[data-action]");
      if (button) button.style.transform = "scale(1)";
    });
    overlay.addEventListener("pointerover", (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      button.style.filter = "brightness(1.22)";
      button.style.boxShadow = "inset 0 0 18px rgba(69,215,255,.25), 0 0 22px rgba(78,206,255,.68), 0 10px 20px rgba(0,0,0,.45)";
    });
    overlay.addEventListener("pointerout", (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      button.style.filter = "brightness(1)";
      button.style.transform = "scale(1)";
      button.style.boxShadow = "inset 0 0 15px rgba(69,215,255,.14), 0 0 12px rgba(69,215,255,.25), 0 8px 18px rgba(0,0,0,.4)";
    });

    document.body.appendChild(overlay);
    return overlay;
  }

  function setPauseOverlayVisible(visible) {
    const overlay = ensurePauseOverlay();
    const destinationButton = overlay.querySelector('button[data-action="level-select"],button[data-action="multiplayer"]');
    if (destinationButton && activeRuntimeScene) {
      const multiplayer = isMultiplayerGame(activeRuntimeScene, getCurrentLevel(activeRuntimeScene));
      destinationButton.dataset.action = multiplayer ? "multiplayer" : "level-select";
      destinationButton.textContent = multiplayer ? "MULTIPLAYER" : "LEVEL SELECT";
    }
    overlay.style.display = visible ? "flex" : "none";
  }

  function ensureMultiplayerOutcomeOverlay() {
    let overlay = document.getElementById("headspace-multiplayer-outcome");
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.id = "headspace-multiplayer-outcome";
    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      zIndex: "2147483646",
      display: "none",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "clamp(8px,1.3vh,16px)",
      padding: "clamp(12px,2vh,28px)",
      boxSizing: "border-box",
      overflow: "hidden",
      background: "radial-gradient(circle at 50% 42%,rgba(16,34,66,.52),rgba(0,0,0,.82) 70%)",
      fontFamily: `${HEADNAUT_DOM_FONT_FAMILY}, sans-serif`,
    });
    const title = document.createElement("div");
    title.dataset.role = "title";
    Object.assign(title.style, {
      color: "#fff",
      fontSize: "clamp(34px,7vw,92px)",
      lineHeight: "1",
      textAlign: "center",
      letterSpacing: "clamp(1px,.4vw,6px)",
      textShadow: "4px 0 #00ffc8,-4px 0 #ff2ab8,0 5px #000",
      marginBottom: "clamp(8px,2vh,22px)",
    });
    overlay.appendChild(title);
    for (const [label, action] of [
      ["MULTIPLAYER", "multiplayer"],
      ["PLAY AGAIN", "retry"],
      ["HOME", "home"],
    ]) {
      const button = createPauseButton(label, action);
      button.style.width = "min(460px,82vw)";
      button.style.height = "clamp(58px,9vh,92px)";
      button.style.fontSize = "clamp(21px,3vw,42px)";
      overlay.appendChild(button);
    }
    overlay.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const button = event.target.closest("button[data-action]");
      if (button) handlePauseMenuAction(button.dataset.action);
    });
    document.body.appendChild(overlay);
    return overlay;
  }

  function syncMultiplayerOutcomeOverlay(runtimeScene, levelWon, levelLost) {
    const overlay = ensureMultiplayerOutcomeOverlay();
    const multiplayer = isMultiplayerGame(runtimeScene, getCurrentLevel(runtimeScene));
    const authorized =
      sceneState.get(runtimeScene)?.multiplayerOutcomeAuthorized === true;
    const visible = multiplayer && authorized && (levelWon || levelLost);
    overlay.style.display = visible ? "flex" : "none";
    if (!visible) return false;
    const mode = getMultiplayerGameMode(runtimeScene);
    overlay.querySelector('[data-role="title"]').textContent = levelWon
      ? mode === "hunt-the-boss"
        ? "BOSS DEFEATED"
        : "HEAD TO HEAD WIN"
      : "HEADNAUT DOWN!";
    for (const objectName of [
      "Message1",
      "Button",
      "Button_Text",
      "ButtonMulti",
      "Button_Multi_Text",
      "HomeButton",
      "HomeButtonText",
    ]) {
      for (const object of runtimeScene.getObjects(objectName)) object.hide?.(true);
    }
    return true;
  }

  function updateHudPosition(runtimeScene) {
    const hud = ensureHud();
    const pauseButton = ensureHudPauseButton();
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      hud.style.left = "20px";
      hud.style.top = "20px";
    } else {
      // Anchor to the top-left of the visible game canvas so it stays in view while the camera/player move.
      const rect = canvas.getBoundingClientRect();
      const left = Math.round(rect.left + 18);
      const top = Math.round(rect.top + 18);
      hud.style.left = `${left}px`;
      hud.style.top = `${top}px`;
    }

    const hudRect = hud.getBoundingClientRect();
    const mobileLandscape = isTouchLandscapeViewport();
    if (mobileLandscape) {
      hud.style.padding = "6px 9px";
      hud.style.fontSize = "clamp(12px, 2.7vh, 16px)";
      hud.style.lineHeight = "1.06";
      hud.style.maxWidth = "48vw";
      hud.style.borderRadius = "7px";
    } else {
      hud.style.padding = "clamp(6px, 0.65vw, 9px) clamp(8px, 0.8vw, 12px)";
      hud.style.fontSize = "clamp(16px, 1.1vw, 21px)";
      hud.style.lineHeight = "1.08";
      hud.style.maxWidth = "calc(100vw - 190px)";
      hud.style.borderRadius = "8px";
    }
    const measuredHudRect = hud.getBoundingClientRect();
    const buttonSize = Math.round(mobileLandscape ? clamp(window.innerHeight * 0.12, 38, 58) : clamp(measuredHudRect.height * 0.46, 48, 150));
    const gap = Math.round(clamp(hudRect.height * 0.07, 8, 22));
    if (mobileLandscape && canvas) {
      const rect = canvas.getBoundingClientRect();
      pauseButton.style.left = `${Math.round(rect.right - buttonSize - 12)}px`;
      pauseButton.style.top = `${Math.round(rect.top + 12)}px`;
      const hint = ensureTouchHint();
      hint.style.right = `${Math.round(Math.max(8, window.innerWidth - rect.right + 10))}px`;
      hint.style.bottom = `${Math.round(Math.max(8, window.innerHeight - rect.bottom + 10))}px`;
    } else {
      pauseButton.style.left = `${Math.round(measuredHudRect.right + gap)}px`;
      pauseButton.style.top = `${Math.round(measuredHudRect.top + (measuredHudRect.height - buttonSize) * 0.5)}px`;
    }
    pauseButton.style.width = `${buttonSize}px`;
    pauseButton.style.height = `${buttonSize}px`;
    pauseButton.style.fontSize = `${Math.round(buttonSize * 0.56)}px`;
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds <= 0) return "--";
    const totalSeconds = Math.max(0, seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const wholeSeconds = Math.floor(totalSeconds % 60);
    const paddedSeconds = String(wholeSeconds).padStart(2, "0");

    return `${minutes}:${paddedSeconds}`;
  }

  function getCurrentLevel(runtimeScene) {
    try {
      return runtimeScene.getGame().getVariables().get("CurrentLevel").getAsNumber();
    } catch {
      return 0;
    }
  }

  function parseLevelFromExternalLayoutName(layoutName) {
    const match = /^Level\s+(-?\d+(?:\.\d+)?)$/i.exec(String(layoutName || "").trim());
    if (!match) return null;

    const parsed = Number(match[1]);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function isPlayableLevel(level) {
    return level >= PLAYABLE_LEVEL_MIN && level <= PLAYABLE_LEVEL_MAX;
  }

  function isBossLevel(level) {
    return level >= BOSS_LEVEL_MIN && level <= BOSS_LEVEL_MAX;
  }

  function usesLevelElevenConfiguration(level) {
    const numericLevel = Number(level);
    return numericLevel === 11 || numericLevel === 12;
  }

  function areCustomBossSettingsActive() {
    return ACTIVE_BOSS_SETTINGS === CustomBossSettings;
  }

  function areNativeBossSettingsActive() {
    return ACTIVE_BOSS_SETTINGS === NativeBossSettings;
  }

  function areLifelikeBossSettingsActive() {
    return ACTIVE_BOSS_SETTINGS === LifelikeBossSettings;
  }

  function isLevelSelectMap(level) {
    return Number(level) === LEVEL_SELECT_MAP_LEVEL;
  }

  function primeBossAfterExternalLayoutCreate(runtimeScene, layoutName) {
    if (!runtimeScene || runtimeScene.getName?.() !== "Game") return;

    const level = parseLevelFromExternalLayoutName(layoutName);
    if (!isBossLevel(level)) return;

    const players = runtimeScene.getObjects("Player");
    if (!players.length) return;

    const state = ensureSceneState(runtimeScene, level);
    ensureBossEnemy(runtimeScene, level, state);
    setSceneBoolean(runtimeScene, "LevelWon", false);
    setSceneBoolean(runtimeScene, "LevelLost", false);
  }

  function installBossExternalLayoutBootstrap() {
    const runtimeSceneTools = gdjs?.evtTools?.runtimeScene;
    const originalCreate = runtimeSceneTools?.createObjectsFromExternalLayout;
    if (typeof originalCreate !== "function") return;
    if (originalCreate.__headSpaceBossBootstrapWrapped) return;

    const wrappedCreate = function (...args) {
      let primeLayoutName = args[1];
      try {
        const runtimeScene = args[0];
        const layoutName = args[1];
        if (
          runtimeScene?.getName?.() === "Game" &&
          getCurrentLevel(runtimeScene) === 10 &&
          layoutName === "Level 10"
        ) {
          args[1] = "Level 8";
          primeLayoutName = "Level 10";
        }
        if (
          runtimeScene?.getName?.() === "Game" &&
          getCurrentLevel(runtimeScene) === 12 &&
          layoutName === "Level 12"
        ) {
          args[1] = "Level 11";
          primeLayoutName = "Level 12";
        }
        if (runtimeScene?.getName?.() === "Game" && layoutName === "Level Over UI") {
          const level = getCurrentLevel(runtimeScene);
          if (
            isMultiplayerGame(runtimeScene, level) &&
            !ensureSceneState(runtimeScene, level).multiplayerOutcomeAuthorized
          ) {
            return [];
          }
          const state = isBossLevel(level) ? ensureSceneState(runtimeScene, level) : null;
          if (
            !getSceneBoolean(runtimeScene, "LevelWon") &&
            !getSceneBoolean(runtimeScene, "LevelLost") &&
            isWithinBossBootstrapRescueWindow(state)
          ) {
            stabilizeBossLevelStartup(runtimeScene, level);
            return [];
          }
        }
      } catch {
        // Ignore bootstrap rescue failures and fall through to authored layout creation.
      }

      const result = originalCreate.apply(this, args);
      try {
        primeBossAfterExternalLayoutCreate(args[0], primeLayoutName);
      } catch {
        // Leave authored scene creation untouched if the runtime hook fails.
      }
      return result;
    };

    wrappedCreate.__headSpaceBossBootstrapWrapped = true;
    runtimeSceneTools.createObjectsFromExternalLayout = wrappedCreate;
  }

  function installBossSceneInstanceCountBootstrapRescue() {
    const objectTools = gdjs?.evtTools?.object;
    const originalGetSceneInstancesCount = objectTools?.getSceneInstancesCount;
    if (typeof originalGetSceneInstancesCount !== "function") return;
    if (originalGetSceneInstancesCount.__headSpaceBossBootstrapWrapped) return;

    const wrappedGetSceneInstancesCount = function (...args) {
      let count = originalGetSceneInstancesCount.apply(this, args);
      try {
        const runtimeScene = args[0];
        const objectMap = args[1];
        const keys =
          objectMap && objectMap.items && typeof objectMap.items === "object" ? Object.keys(objectMap.items) : [];

        if (
          count === 0 &&
          runtimeScene?.getName?.() === "Game" &&
          keys.length === 1 &&
          keys[0] === "SmartEnemy"
        ) {
          const level = getCurrentLevel(runtimeScene);
          const state = isBossLevel(level) ? ensureSceneState(runtimeScene, level) : null;
          if (isWithinBossBootstrapRescueWindow(state)) {
            const boss = stabilizeBossLevelStartup(runtimeScene, level);
            if (boss) {
              count = originalGetSceneInstancesCount.apply(this, args);
            }
          }
        }
      } catch {
        // Ignore rescue errors and keep the authored count result.
      }

      return count;
    };

    wrappedGetSceneInstancesCount.__headSpaceBossBootstrapWrapped = true;
    objectTools.getSceneInstancesCount = wrappedGetSceneInstancesCount;
  }

  function installAuthoredLevelFiveBossWinHotfix() {
    const gameCode = gdjs?.GameCode;
    const originalLevelFiveBossWinCheck = gameCode?.eventsList213;
    if (typeof originalLevelFiveBossWinCheck !== "function") return;
    if (originalLevelFiveBossWinCheck.__headSpaceLevelFiveBossWrapped) return;

    const wrappedLevelFiveBossWinCheck = function (runtimeScene) {
      const level = getCurrentLevel(runtimeScene);
      if (level === 5) {
        const state = ensureSceneState(runtimeScene, level);
        const boss = ensureBossEnemy(runtimeScene, level, state);
        if (boss) {
          setSceneBoolean(runtimeScene, "LevelWon", false);
          cleanupLingeringBossLevelOverUi(runtimeScene, level, false, getSceneBoolean(runtimeScene, "LevelLost"));
        }
      }

      return originalLevelFiveBossWinCheck.apply(this, arguments);
    };

    wrappedLevelFiveBossWinCheck.__headSpaceLevelFiveBossWrapped = true;
    gdjs.GameCode.eventsList213 = wrappedLevelFiveBossWinCheck;
  }

  function objectMapContainsNamedObject(objectMap, objectName) {
    const items = objectMap?.items;
    if (!items || typeof items !== "object") return false;

    const namedObjects = items[objectName];
    if (Array.isArray(namedObjects) && namedObjects.length > 0) return true;

    for (const objects of Object.values(items)) {
      if (!Array.isArray(objects)) continue;
      for (let i = 0; i < objects.length; i++) {
        if (objects[i]?.getName?.() === objectName) return true;
      }
    }

    return false;
  }

  function createObjectMapWithoutNames(objectMap, excludedNames) {
    const items = objectMap?.items;
    if (!items || typeof items !== "object" || typeof Hashtable === "undefined") return null;

    const filteredItems = {};
    for (const [key, objects] of Object.entries(items)) {
      if (!Array.isArray(objects)) continue;
      filteredItems[key] = objects.filter((object) => {
        const objectName = object?.getName?.() || key;
        return !excludedNames.has(key) && !excludedNames.has(objectName);
      });
    }
    return Hashtable.newFrom(filteredItems);
  }

  function getObjectsFromObjectMap(objectMap) {
    const items = objectMap?.items;
    if (!items || typeof items !== "object") return [];

    const objectsFromMap = [];
    for (const objects of Object.values(items)) {
      if (!Array.isArray(objects)) continue;
      for (let i = 0; i < objects.length; i++) {
        if (objects[i]) objectsFromMap.push(objects[i]);
      }
    }
    return objectsFromMap;
  }

  function getLiveSceneObjects(runtimeScene, objectName) {
    return runtimeScene.getObjects(objectName).filter(
      (object) => object && object.getWidth?.() > 0.5 && object.getHeight?.() > 0.5
    );
  }

  function getMultiplayerParticipantId(player, fallbackIndex = 0) {
    if (!player) return "";
    if (!player.__headSpaceParticipantId) {
      const uniqueId = player.getUniqueId?.();
      player.__headSpaceParticipantId =
        fallbackIndex === 0
          ? "local-player"
          : `player-${uniqueId ?? fallbackIndex + 1}`;
    }
    return player.__headSpaceParticipantId;
  }

  function bindOwnedCompanion(player, companion, role) {
    if (!player || !companion) return;
    const participantId = getMultiplayerParticipantId(player);
    companion.__headSpaceParticipantId = participantId;
    companion.__headSpaceCompanionRole = role;
    companion.__headSpaceCompanionHost = player;
    if (role === "image") player.__headSpaceImageCompanion = companion;
    if (role === "helmet") player.__headSpaceHelmetCompanion = companion;
  }

  function ensureMultiplayerParticipantOwnership(runtimeScene, level = getCurrentLevel(runtimeScene)) {
    if (!isMultiplayerGame(runtimeScene, level)) {
      multiplayerParticipantState.delete(runtimeScene);
      return [];
    }
    const players = getLiveSceneObjects(runtimeScene, "Player");
    const images = runtimeScene.getObjects("PlayerImage").slice();
    const helmets = runtimeScene.getObjects("PlayerHelmet").slice();
    const usedImages = new Set();
    const usedHelmets = new Set();
    const participants = [];
    const room = globalThis.HeadSpaceMultiplayerService?.getRoom?.() || globalThis.headSpaceMultiplayerRoom;
    const roomPlayers = Array.isArray(room?.players)
      ? room.players.slice().sort((a, b) => Number(a.playerNumber) - Number(b.playerNumber))
      : [];
    const localPlayerNumber = Math.max(1, Number(room?.localPlayerNumber) || gdjs.multiplayer?.getCurrentPlayerNumber?.() || 1);
    const participantOrder = [
      localPlayerNumber,
      ...roomPlayers.map(entry => Number(entry.playerNumber)).filter(number => number && number !== localPlayerNumber),
    ];

    const applyParticipantIdentity = (object, participantNumber, role) => {
      if (!object || !participantNumber) return;
      object.__headSpaceParticipantId = `player-${participantNumber}`;
      object.networkId = `headnaut-${role}-${participantNumber}`;
      const behavior = object.getBehavior?.("MultiplayerObject");
      if (behavior) behavior.playerNumber = participantNumber;
    };

    const applyParticipantCosmetic = (object, profile, role) => {
      if (!object || !profile) return;
      const animationIndex = Number(role === "image" ? profile.characterIndex : profile.helmetIndex);
      if (Number.isFinite(animationIndex) && object.hasBehavior?.("Animation")) {
        object.getBehavior("Animation").setAnimationIndex(clamp(
          Math.round(animationIndex),
          0,
          role === "image" ? NATIVE_CHARACTER_COUNT - 1 : HELMET_COUNT - 1
        ));
      }
      if (role !== "image" || animationIndex < NATIVE_CHARACTER_COUNT || !profile.characterUrl || typeof PIXI === "undefined") {
        if (role === "image") object.__headSpaceParticipantCustomTexture = false;
        return;
      }
      const renderer = object.getRendererObject?.();
      if (!renderer) return;
      renderer.texture = PIXI.Texture.from(profile.characterUrl);
      object.__headSpaceUsesCustomPlayerTexture = true;
      object.__headSpaceParticipantCustomTexture = true;
    };

    players.forEach((player, index) => {
      const participantNumber = participantOrder[index] || index + 1;
      const profile = roomPlayers.find(entry => Number(entry.playerNumber) === participantNumber) || null;
      applyParticipantIdentity(player, participantNumber, "player");
      const id = getMultiplayerParticipantId(player, index);
      let image =
        player.__headSpaceImageCompanion &&
        images.includes(player.__headSpaceImageCompanion)
          ? player.__headSpaceImageCompanion
          : images.find((candidate) => candidate.__headSpaceParticipantId === id);
      if (!image) {
        image = images.find((candidate) => !usedImages.has(candidate) && !candidate.__headSpaceParticipantId);
      }
      if (!image) image = createImageCompanionForHost(runtimeScene, player, "Player", "PlayerImage");
      if (image) {
        bindOwnedCompanion(player, image, "image");
        applyParticipantIdentity(image, participantNumber, "image");
        if (profile) {
          applyParticipantCosmetic(image, profile, "image");
        } else if (index === 0 && image.hasBehavior?.("Animation")) {
          image
            .getBehavior("Animation")
            .setAnimationIndex(
              clamp(
                Math.round(runtimeScene.getGame().getVariables().getFromIndex(0).getAsNumber()),
                0,
                NATIVE_CHARACTER_COUNT - 1
              )
            );
        }
        usedImages.add(image);
      }

      let helmet =
        player.__headSpaceHelmetCompanion &&
        helmets.includes(player.__headSpaceHelmetCompanion)
          ? player.__headSpaceHelmetCompanion
          : helmets.find((candidate) => candidate.__headSpaceParticipantId === id);
      if (!helmet) {
        helmet = helmets.find((candidate) => !usedHelmets.has(candidate) && !candidate.__headSpaceParticipantId);
      }
      if (!helmet) {
        helmet = createSceneObject(
          runtimeScene,
          "PlayerHelmet",
          typeof player.getLayer === "function" ? player.getLayer() : ""
        );
      }
      if (helmet) {
        bindOwnedCompanion(player, helmet, "helmet");
        applyParticipantIdentity(helmet, participantNumber, "helmet");
        if (profile) {
          applyParticipantCosmetic(helmet, profile, "helmet");
        } else if (index === 0 && helmet.hasBehavior?.("Animation")) {
          helmet
            .getBehavior("Animation")
            .setAnimationIndex(
              clamp(
                Math.round(runtimeScene.getGame().getVariables().getFromIndex(1).getAsNumber()),
                0,
                HELMET_COUNT - 1
              )
            );
        }
        usedHelmets.add(helmet);
      }
      participants.push({ id, player, image: image || null, helmet: helmet || null, local: participantNumber === localPlayerNumber });
    });

    for (const image of images) {
      if (!usedImages.has(image)) image.deleteFromScene?.(runtimeScene);
    }
    for (const helmet of helmets) {
      if (!usedHelmets.has(helmet)) helmet.deleteFromScene?.(runtimeScene);
    }
    multiplayerParticipantState.set(runtimeScene, participants);
    return participants;
  }

  function recordMultiplayerAbsorption(runtimeScene, absorbers, eatenObjects) {
    const level = getCurrentLevel(runtimeScene);
    if (!isMultiplayerGame(runtimeScene, level)) return;
    const objective = multiplayerModeObjectiveState.get(runtimeScene);
    if (!objective) return;
    const playerAbsorbers = absorbers.filter((object) => object?.getName?.() === "Player");
    if (!playerAbsorbers.length) return;

    for (const eaten of eatenObjects) {
      if (!eaten) continue;
      if (eaten.getName?.() === "Player") {
        const victimId = getMultiplayerParticipantId(eaten);
        const absorberId = getMultiplayerParticipantId(playerAbsorbers[0]);
        if (victimId && absorberId && victimId !== absorberId) {
          objective.absorbedPlayerIds.add(victimId);
          objective.lastPlayerAbsorberId = absorberId;
        }
      }
      if (eaten.getName?.() === "SmartEnemy" && eaten.__headSpaceMultiplayerHuntBoss) {
        objective.bossAbsorbedByParticipantId = getMultiplayerParticipantId(playerAbsorbers[0]);
      }
    }
  }

  function isLevelTwelveCosmicAlien(object) {
    return !!object?.__headSpaceLevelTwelveCosmicAlien;
  }

  function collectLevelTwelveCosmicAlienAbsorbBonuses(runtimeScene, objectMap, eatenMap) {
    if (![5, 8, 9, 11, 12].includes(getCurrentLevel(runtimeScene))) return [];

    const players = getObjectsFromObjectMap(objectMap).filter(
      (object) => object?.getName?.() === "Player"
    );
    if (!players.length) return [];

    const cosmicAliens = getObjectsFromObjectMap(eatenMap).filter(isLevelTwelveCosmicAlien);
    if (!cosmicAliens.length) return [];

    const bonuses = [];
    for (const player of players) {
      if (!player || player.getWidth() <= 0) continue;
      for (const cosmicAlien of cosmicAliens) {
        if (!cosmicAlien || cosmicAlien.getWidth() <= 0) continue;
        const playerWidth = Math.max(1, player.getWidth());
        const eatenWidth = Math.max(0, cosmicAlien.getWidth());
        const distance =
          typeof player.getDistanceToObject === "function"
            ? player.getDistanceToObject(cosmicAlien)
            : Math.hypot(
                player.getCenterXInScene() - cosmicAlien.getCenterXInScene(),
                player.getCenterYInScene() - cosmicAlien.getCenterYInScene()
              );
        const shrinkedObjectSize = 2 * Math.max(0, distance - playerWidth * 0.5);
        const givenMatter = Math.max(0, eatenWidth * eatenWidth - shrinkedObjectSize * shrinkedObjectSize);
        if (givenMatter <= 0) continue;
        bonuses.push({
          player,
          cosmicAlien,
          extraMatter: Math.max(
            0,
            eatenWidth * eatenWidth * LEVEL_TWELVE_COSMIC_ALIEN_GROWTH_MULTIPLIER - givenMatter
          ),
        });
      }
    }
    return bonuses;
  }

  function applyLevelTwelveCosmicAlienAbsorbBonuses(bonuses) {
    if (!bonuses?.length) return;
    for (const bonus of bonuses) {
      const player = bonus.player;
      if (!player || !Number.isFinite(bonus.extraMatter) || bonus.extraMatter <= 0) continue;
      const currentSize = Math.max(1, player.getWidth ? player.getWidth() : 1);
      setObjectSizeAndShape(player, Math.sqrt(currentSize * currentSize + bonus.extraMatter));
      if (bonus.cosmicAlien) {
        setObjectSizeAndShape(bonus.cosmicAlien, 0);
      }
    }
  }

  function isPlayerStartProtectionActive(state, level, elapsedSeconds) {
    if (!state) return false;
    if (level === 6) {
      return !state.introDismissed || elapsedSeconds < state.levelSixPlayerProtectionUntilSeconds;
    }
    return false;
  }

  function prepareBossTangentAbsorptionBridge(runtimeScene, state, level, absorberMap, eatenMap) {
    if (
      !runtimeScene ||
      // The boss can become active after normal player movement; the
      // first-orb flag belongs only to the pre-launch colour treatment.
      !state?.smartEnemyActivated ||
      !isBossLevel(level) ||
      isMultiplayerGame(runtimeScene, level)
    ) return null;

    const absorbers = getObjectsFromObjectMap(absorberMap);
    const eatenObjects = getObjectsFromObjectMap(eatenMap);
    const boss = absorbers[0] || null;
    const prey = eatenObjects[0] || null;
    if (!getEdibleBossPreyPair(runtimeScene, level, boss, prey)) return null;
    if (!isObjectInScene(runtimeScene, boss) || !isObjectInScene(runtimeScene, prey)) return null;

    const bossSize = Math.max(1, Math.min(boss.getWidth(), boss.getHeight()));
    const preySize = Math.max(1, Math.min(prey.getWidth(), prey.getHeight()));
    const distance = boss.getDistanceToObject(prey);
    const contactDistance = (bossSize + preySize) * 0.5;
    const currentOverlap = contactDistance - distance;

    // The generated distance condition has already selected this pair. Leave
    // normal overlaps alone; only turn a tangent/near-tangent contact into the
    // minimum overlap needed by Absorbus' area-transfer formula.
    if (
      currentOverlap >= BOSS_CONTACT_ABSORB_OVERLAP - 0.05 ||
      currentOverlap < -0.5
    ) return null;

    // Physics2 resolves circles at exact tangency, while Absorbus calculates
    // transferred area from visual overlap. Give the single authored Absorb
    // call a tiny logical inset without moving either actor or its body.
    const hadOwnDistanceMethod = Object.prototype.hasOwnProperty.call(
      boss,
      "getDistanceToObject"
    );
    const originalDistanceMethod = boss.getDistanceToObject;
    boss.getDistanceToObject = function (target) {
      const measuredDistance = originalDistanceMethod.call(this, target);
      return target === prey
        ? Math.max(0, measuredDistance - BOSS_CONTACT_ABSORB_OVERLAP)
        : measuredDistance;
    };

    return {
      boss,
      prey,
      hadOwnDistanceMethod,
      originalDistanceMethod,
      bossSizeBefore: bossSize,
      preySizeBefore: preySize,
    };
  }

  function finalizeBossTangentAbsorptionBridge(runtimeScene, bridge) {
    if (!bridge) return;
    const { boss, prey, hadOwnDistanceMethod, originalDistanceMethod } = bridge;
    if (hadOwnDistanceMethod) boss.getDistanceToObject = originalDistanceMethod;
    else delete boss.getDistanceToObject;
    if (!isObjectInScene(runtimeScene, boss)) return;

    const bossSizeAfter = Math.max(0, Math.min(boss.getWidth(), boss.getHeight()));
    const preyAlive = isObjectInScene(runtimeScene, prey);
    const preySizeAfter = preyAlive
      ? Math.max(0, Math.min(prey.getWidth(), prey.getHeight()))
      : 0;
    const transferred =
      bossSizeAfter > bridge.bossSizeBefore + 0.0001 ||
      preySizeAfter < bridge.preySizeBefore - 0.0001;

    if (!transferred) return;

    // The native extension owns size/mass transfer. Rebuild only the automatic
    // fixtures so the next collision uses those new visible diameters.
    boss.getBehavior?.("Physics2")?.recreateShape?.();
    if (preyAlive && preySizeAfter > 0) {
      prey.getBehavior?.("Physics2")?.recreateShape?.();
    }
  }

  function installProtectedAbsorbFiltering() {
    const absorbExtension = gdjs?.evtsExt__Absorbus__Absorb;
    const originalAbsorb = absorbExtension?.func;
    if (typeof originalAbsorb !== "function") return;
    if (originalAbsorb.__headSpaceProtectedAbsorbFiltering) return;

    const wrappedAbsorb = function (runtimeScene, Object, Physics2, Eaten) {
      let callArguments = arguments;
      let cosmicAlienBonuses = null;
      let multiplayerAbsorbSnapshot = null;
      let bossTangentAbsorptionBridge = null;
      try {
        if (runtimeScene?.getName?.() === "Game") {
          const level = getCurrentLevel(runtimeScene);
          const state = ensureSceneState(runtimeScene, level);
          const elapsedSeconds = getElapsedSecondsForState(state);
          const protectedNames = new Set();
          if (isMultiplayerGame(runtimeScene, level)) {
            ensureMultiplayerParticipantOwnership(runtimeScene, level);
            multiplayerAbsorbSnapshot = {
              absorbers: getObjectsFromObjectMap(Object).slice(),
              eaten: getObjectsFromObjectMap(Eaten)
                .filter((object) => object?.getName?.() === "Player" || object?.getName?.() === "SmartEnemy")
                .map((object) => ({
                  object,
                  name: object.getName?.() || "",
                  width: object.getWidth?.() || 0,
                  height: object.getHeight?.() || 0,
                })),
            };
          }
          const regularEnemyEatingBoss =
            (isBossLevel(level) ||
              (isMultiplayerGame(runtimeScene, level) &&
                getMultiplayerGameMode(runtimeScene) === "hunt-the-boss")) &&
            objectMapContainsNamedObject(Object, "Enemy") &&
            !objectMapContainsNamedObject(Object, "Player") &&
            objectMapContainsNamedObject(Eaten, "SmartEnemy");
          if (
            (regularEnemyEatingBoss ||
              (level >= 5 &&
                isBossLevel(level) &&
                isBossAbsorbProtectionActive(state, level, elapsedSeconds))) &&
            objectMapContainsNamedObject(Eaten, "SmartEnemy")
          ) {
            protectedNames.add("SmartEnemy");
          }
          if (
            isPlayerStartProtectionActive(state, level, elapsedSeconds) &&
            objectMapContainsNamedObject(Eaten, "Player")
          ) {
            protectedNames.add("Player");
          }
          if (
            isMultiplayerGame(runtimeScene, level) &&
            Number(level) === 1 &&
            !state.firstOrbFired &&
            objectMapContainsNamedObject(Eaten, "Player")
          ) {
            protectedNames.add("Player");
          }
          // Head-to-head describes the human win condition; it must not make
          // a player immune to a larger NPC enemy. That broad exemption let a
          // smaller player pass through orange enemies on every shared level.
          if (
            runtimeScene.getObjects("Player").some((player) => player.__headSpaceLevelNinePortalTransit) &&
            objectMapContainsNamedObject(Eaten, "Player")
          ) {
            protectedNames.add("Player");
          }
          const multiplayerPortals = multiplayerLevelOneFeatureState.get(runtimeScene)?.portals || [];
          if (
            multiplayerPortals.length &&
            runtimeScene.getObjects("Player").some((player) =>
              multiplayerPortals.some((portal) =>
                Math.hypot(
                  player.getCenterXInScene() - portal.x,
                  player.getCenterYInScene() - portal.y
                ) <= (portal.currentOuterRadius || portal.radius || 0) * 1.35
              )
            ) &&
            objectMapContainsNamedObject(Eaten, "Player")
          ) {
            protectedNames.add("Player");
          }
          if (
            runtimeScene.getObjects("Player").some((player) => player.__headSpaceBlackHoleTransit) &&
            objectMapContainsNamedObject(Eaten, "Player")
          ) {
            protectedNames.add("Player");
          }
          if (protectedNames.size > 0) {
            const filteredEaten = createObjectMapWithoutNames(Eaten, protectedNames);
            if (filteredEaten) {
              const filteredArguments = Array.from(arguments);
              filteredArguments[3] = filteredEaten;
              callArguments = filteredArguments;
            }
          }
          cosmicAlienBonuses = collectLevelTwelveCosmicAlienAbsorbBonuses(
            runtimeScene,
            Object,
            callArguments[3]
          );
          bossTangentAbsorptionBridge = prepareBossTangentAbsorptionBridge(
            runtimeScene,
            state,
            level,
            callArguments[1],
            callArguments[3]
          );
        }
      } catch {
        // Preserve authored absorption if the protection check cannot run.
      }

      let result;
      try {
        result = originalAbsorb.apply(this, callArguments);
      } finally {
        // Always restore the temporarily wrapped distance method, including if
        // a future version of the authored extension throws.
        finalizeBossTangentAbsorptionBridge(runtimeScene, bossTangentAbsorptionBridge);
      }
      try {
        applyLevelTwelveCosmicAlienAbsorbBonuses(cosmicAlienBonuses);
        if (multiplayerAbsorbSnapshot) {
          const actuallyAbsorbed = multiplayerAbsorbSnapshot.eaten
            .filter((entry) => {
              const stillInScene = runtimeScene
                .getObjects(entry.name)
                .includes(entry.object);
              return (
                !stillInScene ||
                entry.object.getWidth?.() <= 0.5 ||
                entry.object.getHeight?.() <= 0.5
              );
            })
            .map((entry) => entry.object);
          if (actuallyAbsorbed.length) {
            recordMultiplayerAbsorption(
              runtimeScene,
              multiplayerAbsorbSnapshot.absorbers,
              actuallyAbsorbed
            );
          }
        }
      } catch {
        // Preserve authored absorption if bonus growth cannot run.
      }
      return result;
    };

    wrappedAbsorb.__headSpaceProtectedAbsorbFiltering = true;
    absorbExtension.func = wrappedAbsorb;
  }

  function isWithinBossBootstrapRescueWindow(state) {
    if (!state || !Number.isFinite(state.levelStartTimeMs)) return false;
    return performance.now() - state.levelStartTimeMs <= BOSS_BOOTSTRAP_RESCUE_WINDOW_MS;
  }

  function stabilizeBossLevelStartup(runtimeScene, level) {
    if (!runtimeScene || runtimeScene.getName?.() !== "Game") return null;
    if (!isBossLevel(level)) return null;

    const state = ensureSceneState(runtimeScene, level);
    if (!isWithinBossBootstrapRescueWindow(state)) return null;

    setSceneBoolean(runtimeScene, "LevelWon", false);
    setSceneBoolean(runtimeScene, "LevelLost", false);
    setSceneBoolean(runtimeScene, "ChangingScenes", false);

    const boss = ensureBossEnemy(runtimeScene, level, state);
    if (!boss) return null;

    cleanupLingeringBossLevelOverUi(runtimeScene, level, false, false);
    return boss;
  }

  function ensureLevelSelectZoomState(runtimeScene, level) {
    let state = sceneState.get(runtimeScene);
    if (!state) {
      state = {
        level,
        levelSelectZoomSnapshot: null,
      };
      sceneState.set(runtimeScene, state);
    }
    return state;
  }

  function captureLevelSelectZoomSnapshot(runtimeScene, level) {
    if (!isLevelSelectMap(level)) return;
    if (!gdjs?.evtTools?.input || !gdjs?.evtTools?.camera) return;

    const state = ensureLevelSelectZoomState(runtimeScene, level);
    state.levelSelectZoomSnapshot = {
      isScrolling:
        gdjs.evtTools.input.isScrollingUp(runtimeScene) || gdjs.evtTools.input.isScrollingDown(runtimeScene),
      cameraX: gdjs.evtTools.camera.getCameraX(runtimeScene, "", 0),
      cameraY: gdjs.evtTools.camera.getCameraY(runtimeScene, "", 0),
      zoom: gdjs.evtTools.camera.getCameraZoom(runtimeScene, "", 0),
      cursorX: gdjs.evtTools.input.getCursorX(runtimeScene, "", 0),
      cursorY: gdjs.evtTools.input.getCursorY(runtimeScene, "", 0),
    };
  }

  function applyLevelSelectMouseAnchoredZoom(runtimeScene, level) {
    if (!isLevelSelectMap(level) || !gdjs?.evtTools?.camera) return;

    const state = sceneState.get(runtimeScene);
    const snapshot = state?.levelSelectZoomSnapshot;
    if (!snapshot) return;
    state.levelSelectZoomSnapshot = null;
    if (!snapshot.isScrolling) return;

    const newZoom = gdjs.evtTools.camera.getCameraZoom(runtimeScene, "", 0);
    if (!Number.isFinite(snapshot.zoom) || !Number.isFinite(newZoom) || newZoom <= 0) return;
    if (Math.abs(newZoom - snapshot.zoom) < 0.0001) return;

    const zoomRatio = snapshot.zoom / newZoom;
    const targetCameraX = snapshot.cursorX + (snapshot.cameraX - snapshot.cursorX) * zoomRatio;
    const targetCameraY = snapshot.cursorY + (snapshot.cameraY - snapshot.cursorY) * zoomRatio;

    for (let i = 0; i < LEVEL_SELECT_CAMERA_LAYERS.length; i++) {
      const layerName = LEVEL_SELECT_CAMERA_LAYERS[i];
      if (typeof runtimeScene.hasLayer === "function" && !runtimeScene.hasLayer(layerName)) continue;
      gdjs.evtTools.camera.setCameraX(runtimeScene, targetCameraX, layerName, 0);
      gdjs.evtTools.camera.setCameraY(runtimeScene, targetCameraY, layerName, 0);
    }
  }

  function createLevelSelectSprite(layerRenderer, resourceUrl, size, x, y, zOrder) {
    const sprite = new PIXI.Sprite(PIXI.Texture.from(resourceUrl));
    if (sprite.anchor?.set) sprite.anchor.set(0.5);
    sprite.position.set(x, y);
    sprite.width = size;
    sprite.height = size;
    sprite.eventMode = "none";
    layerRenderer.addRendererObject(sprite, zOrder);
    return sprite;
  }

  function createLevelSelectPlanetVisual(layerRenderer, config) {
    const container = new PIXI.Container();
    const content = new PIXI.Container();
    const sprite = new PIXI.Sprite(PIXI.Texture.from(config.resourceUrl));
    const shadow = config.showShadow === false ? null : new PIXI.Sprite(PIXI.Texture.from(config.resourceUrl));
    const clipMask = new PIXI.Graphics();
    const shadowMask = new PIXI.Graphics();
    const renderedSize = config.size * (config.imageScale || 1);
    const lightAway = getNormalizedVector(
      config.x - LEVEL_SELECT_SUN_X,
      config.y - LEVEL_SELECT_SUN_Y
    );

    for (const image of [sprite, shadow].filter(Boolean)) {
      if (image.anchor?.set) image.anchor.set(0.5);
      image.width = renderedSize;
      image.height = renderedSize;
      image.eventMode = "none";
    }
    if (shadow) {
      shadow.tint = 0x050812;
      shadow.alpha = 0.72;
    }

    clipMask.beginFill(0xffffff, 1);
    clipMask.drawCircle(0, 0, config.size * 0.5);
    clipMask.endFill();
    if (shadow) {
      shadowMask.beginFill(0xffffff, 1);
      shadowMask.drawCircle(
        lightAway.x * config.size * 0.3,
        lightAway.y * config.size * 0.3,
        config.size * 0.52
      );
      shadowMask.endFill();
    }

    content.addChild(sprite);
    if (shadow) {
      content.addChild(shadow);
      content.addChild(shadowMask);
      shadow.mask = shadowMask;
    }
    container.addChild(content);
    container.addChild(clipMask);
    content.mask = clipMask;
    container.position.set(config.x, config.y);
    container.eventMode = "none";
    layerRenderer.addRendererObject(container, config.zOrder);
    return {
      container,
      sprite,
      shadow,
      rotationSpeed: config.rotationSpeed || 0,
    };
  }

  function removeLevelSelectRendererObject(
    runtimeScene,
    rendererObject,
    destroyTexture = false,
    layerName = ""
  ) {
    if (!rendererObject) return;
    const layerRenderer = runtimeScene.getLayer(layerName)?.getRenderer?.();
    try {
      layerRenderer?.removeRendererObject?.(rendererObject);
    } catch {
      // Fall back to direct removal.
    }
    if (rendererObject.parent) rendererObject.parent.removeChild(rendererObject);
    if (rendererObject.destroy && !rendererObject.destroyed) {
      rendererObject.destroy({ children: true, texture: destroyTexture, baseTexture: destroyTexture });
    }
  }

  function clearHomeHighResBackground(runtimeScene) {
    const state = homeHighResBackgroundState.get(runtimeScene);
    if (!state) return;
    removeLevelSelectRendererObject(runtimeScene, state.sprite, false, "");
    for (const background of state.authoredBackgrounds || []) {
      if (background.hide) background.hide(false);
    }
    homeHighResBackgroundState.delete(runtimeScene);
  }

  function updateHomeHighResBackground(runtimeScene) {
    let state = homeHighResBackgroundState.get(runtimeScene);
    if (!state?.sprite || state.sprite.destroyed) {
      clearHomeHighResBackground(runtimeScene);
      const layerRenderer = runtimeScene.getLayer("")?.getRenderer?.();
      if (!layerRenderer) return;
      const sprite = new PIXI.Sprite(PIXI.Texture.from("home.png?v=highres-home-20260705-1"));
      if (sprite.anchor?.set) sprite.anchor.set(0.5);
      sprite.eventMode = "none";
      layerRenderer.addRendererObject(sprite, -11000);
      state = {
        sprite,
        authoredBackgrounds: runtimeScene.getObjects("Background_UNTILED_1"),
      };
      homeHighResBackgroundState.set(runtimeScene, state);
    }
    for (const background of state.authoredBackgrounds) {
      if (background.hide) background.hide(true);
    }
    const frame = getCameraFrame(runtimeScene, "");
    const size = getCoverSizeForFrame(frame, 1, 1.03);
    state.sprite.position.set(frame.x, frame.y);
    state.sprite.width = size.width;
    state.sprite.height = size.height;
    state.sprite.visible = true;
  }

  function clearLevelHighResBackground(runtimeScene) {
    const state = levelHighResBackgroundState.get(runtimeScene);
    if (!state) return;
    removeLevelSelectRendererObject(runtimeScene, state.sprite, false, "Background");
    for (const background of state.authoredBackgrounds || []) {
      if (background.hide) background.hide(false);
    }
    levelHighResBackgroundState.delete(runtimeScene);
  }

  function updateLevelHighResBackground(runtimeScene, level) {
    const levelNumber = Number(level);
    if (!Number.isInteger(levelNumber) || levelNumber < 1 || levelNumber > 12) {
      clearLevelHighResBackground(runtimeScene);
      return;
    }
    const backgroundLevelNumber = levelNumber;

    let state = levelHighResBackgroundState.get(runtimeScene);
    if (!state?.sprite || state.sprite.destroyed || state.level !== levelNumber) {
      clearLevelHighResBackground(runtimeScene);
      const layerRenderer = runtimeScene.getLayer("Background")?.getRenderer?.();
      if (!layerRenderer) return;
      const backgroundResource = LEVEL_BACKGROUND_RESOURCES[backgroundLevelNumber - 1];
      const sprite = new PIXI.Sprite(
        PIXI.Texture.from(`${backgroundResource}?v=multiplayer-level-backgrounds-20260722-1`)
      );
      if (sprite.anchor?.set) sprite.anchor.set(0.5);
      sprite.eventMode = "none";
      // Keep the selected level artwork above authored/random backgrounds that
      // may be recreated or shown again during pause/resume.
      layerRenderer.addRendererObject(sprite, 10000);
      state = {
        level: levelNumber,
        sprite,
        authoredBackgrounds: GAMEPLAY_BACKGROUND_OBJECT_NAMES.flatMap((name) =>
          runtimeScene.getObjects(name)
        ),
      };
      levelHighResBackgroundState.set(runtimeScene, state);
    }

    state.authoredBackgrounds = GAMEPLAY_BACKGROUND_OBJECT_NAMES.flatMap((name) =>
      runtimeScene.getObjects(name)
    );
    for (const background of state.authoredBackgrounds) {
      if (background.hide) background.hide(true);
    }
    const frame = getCameraFrame(runtimeScene, "Background");
    const size = getCoverSizeForFrame(frame, 1, 1.03);
    state.sprite.position.set(frame.x, frame.y);
    state.sprite.width = size.width;
    state.sprite.height = size.height;
    state.sprite.visible = true;
  }

  function clearLevelSelectCelestialSystem(runtimeScene) {
    const system = levelSelectCelestialSystemState.get(runtimeScene);
    if (!system) return;
    for (const visual of [system.sun, system.station, system.planet11, system.planet13]) {
      removeLevelSelectRendererObject(runtimeScene, visual, false);
    }
    if (system.planet1Visual) {
      removeLevelSelectRendererObject(runtimeScene, system.planet1Visual.container, false);
    }
    removeLevelSelectRendererObject(runtimeScene, system.background, false, "Background");
    removeLevelSelectRendererObject(runtimeScene, system.sunGlow, true);
    for (const config of system.authoredPlanetConfigs || []) {
      if (config.object.hide) config.object.hide(false);
      if (config.object.setAngle) config.object.setAngle(0);
    }
    if (system.authoredPinkPlanet) {
      if (system.authoredPinkPlanet.hide) system.authoredPinkPlanet.hide(false);
      if (system.authoredPinkPlanet.setOpacity) system.authoredPinkPlanet.setOpacity(255);
    }
    if (system.authoredGreenPlanet) {
      if (system.authoredGreenPlanet.hide) system.authoredGreenPlanet.hide(false);
      if (system.authoredGreenPlanet.setOpacity) system.authoredGreenPlanet.setOpacity(255);
    }
    for (const background of system.authoredBackgrounds || []) {
      if (background.hide) background.hide(false);
    }
    levelSelectCelestialSystemState.delete(runtimeScene);
  }

  function ensureLevelSelectCelestialSystem(runtimeScene) {
    let system = levelSelectCelestialSystemState.get(runtimeScene);
    if (system?.sun && !system.sun.destroyed) return system;
    if (typeof PIXI === "undefined" || typeof PIXI.Sprite !== "function") return null;
    clearLevelSelectCelestialSystem(runtimeScene);

    const layerRenderer = runtimeScene.getLayer("")?.getRenderer?.();
    const backgroundLayerRenderer = runtimeScene.getLayer("Background")?.getRenderer?.();
    if (!layerRenderer || !backgroundLayerRenderer) return null;
    const authoredPlanetConfigs = [
      {
        object: runtimeScene.getObjects("Panet_1pic2")[0] || null,
        resourceUrl: "planet_no_ring.png",
        rotationSpeed: -0.042,
      },
    ].filter((config) => config.object);
    const planet1Visual = createLevelSelectPlanetVisual(layerRenderer, {
      resourceUrl: "Planet1.png",
      x: 312,
      y: 203,
      size: 190,
      imageScale: 1.1,
      zOrder: 45,
      rotationSpeed: 0.055,
      showShadow: false,
    });
    const background = new PIXI.Sprite(
      PIXI.Texture.from("levelselect.png?v=highres-levelselect-20260705-1")
    );
    if (background.anchor?.set) background.anchor.set(0.5);
    background.eventMode = "none";
    backgroundLayerRenderer.addRendererObject(background, -11000);
    const sunGlow = createLevelSevenSteadyPlanetLight(layerRenderer, 28.8, "255;166;72");
    const sun = createLevelSelectSprite(
      layerRenderer,
      "thesun.png",
      170,
      LEVEL_SELECT_SUN_X,
      LEVEL_SELECT_SUN_Y,
      29
    );
    const planet11 = createLevelSelectSprite(layerRenderer, "Planet11.png", 150, -45, 520, 29);
    const planet13 = createLevelSelectSprite(
      layerRenderer,
      "Planet13.png?v=actual-planet13-20260704-1",
      260,
      355,
      818,
      45
    );
    const station = createLevelSelectSprite(layerRenderer, "spacestationwhite.png", 170, 1325, 960, 30);

    system = {
      authoredPlanetConfigs,
      planet1Visual,
      background,
      authoredBackgrounds: runtimeScene.getObjects("Background_UNTILED_4"),
      sunGlow,
      sun,
      planet11,
      planet13,
      authoredPinkPlanet: runtimeScene.getObjects("Panet_1pic3")[0] || null,
      authoredGreenPlanet: runtimeScene.getObjects("Panet_1pic")[0] || null,
      station,
      stationBaseY: 960,
      elapsedSeconds: 0,
    };
    levelSelectCelestialSystemState.set(runtimeScene, system);
    return system;
  }

  function updateLevelSelectCelestialSystem(runtimeScene) {
    if (!isLevelSelectMap(getCurrentLevel(runtimeScene))) {
      clearLevelSelectCelestialSystem(runtimeScene);
      return;
    }
    const system = ensureLevelSelectCelestialSystem(runtimeScene);
    if (!system) return;
    const rawDeltaSeconds = runtimeScene.getElapsedTime() / 1000;
    if (Number.isFinite(rawDeltaSeconds)) system.elapsedSeconds += clamp(rawDeltaSeconds, 0, 0.05);
    updateLevelSevenSteadyPlanetLight(
      system.sunGlow,
      LEVEL_SELECT_SUN_X,
      LEVEL_SELECT_SUN_Y,
      390
    );
    system.sun.rotation = system.elapsedSeconds * 0.035;
    const planet1Rotation = system.elapsedSeconds * system.planet1Visual.rotationSpeed;
    system.planet1Visual.sprite.rotation = planet1Rotation;
    if (system.planet1Visual.shadow) system.planet1Visual.shadow.rotation = planet1Rotation;
    for (const config of system.authoredPlanetConfigs) {
      if (config.object.hide) config.object.hide(false);
      if (config.object.setAngle) {
        config.object.setAngle((system.elapsedSeconds * config.rotationSpeed * 180) / Math.PI);
      }
      const rendererObject = config.object.getRendererObject?.();
      if (rendererObject) rendererObject.texture = PIXI.Texture.from(config.resourceUrl);
    }
    system.planet11.rotation = system.elapsedSeconds * -0.065;
    system.planet13.rotation = system.elapsedSeconds * 0.034;
    if (system.authoredPinkPlanet) {
      if (system.authoredPinkPlanet.hide) system.authoredPinkPlanet.hide(true);
      if (system.authoredPinkPlanet.setOpacity) system.authoredPinkPlanet.setOpacity(0);
    }
    if (system.authoredGreenPlanet) {
      if (system.authoredGreenPlanet.hide) system.authoredGreenPlanet.hide(true);
      if (system.authoredGreenPlanet.setOpacity) system.authoredGreenPlanet.setOpacity(0);
    }
    for (const background of system.authoredBackgrounds) {
      if (background.hide) background.hide(true);
    }
    const backgroundFrame = getCameraFrame(runtimeScene, "Background");
    const backgroundSize = getCoverSizeForFrame(backgroundFrame, 1, 1.03);
    system.background.position.set(backgroundFrame.x, backgroundFrame.y);
    system.background.width = backgroundSize.width;
    system.background.height = backgroundSize.height;
    system.background.visible = true;
    system.station.position.y = system.stationBaseY + Math.sin(system.elapsedSeconds * 1.15) * 13;
    system.station.rotation = Math.sin(system.elapsedSeconds * 0.72) * 0.035;
    const baseCameraX = gdjs.evtTools.camera.getCameraX(runtimeScene, "", 0);
    const baseCameraY = gdjs.evtTools.camera.getCameraY(runtimeScene, "", 0);
    for (const star of runtimeScene.getObjects("BACKstars3")) {
      if (star.setXOffset) star.setXOffset(baseCameraX * 0.5 + system.elapsedSeconds * 5);
      if (star.setYOffset) star.setYOffset(baseCameraY * 0.5 + system.elapsedSeconds * 2.5);
    }
    for (const star of runtimeScene.getObjects("BACKstars2")) {
      if (star.setXOffset) star.setXOffset(baseCameraX * 0.9 - system.elapsedSeconds * 11);
      if (star.setYOffset) star.setYOffset(baseCameraY * 0.9 + system.elapsedSeconds * 6);
    }
    for (const objectName of ["Level9", "Level10", "Level11", "Level12"]) {
      for (const button of runtimeScene.getObjects(objectName)) {
        if (button.setEffectStringParameter) {
          button.setEffectStringParameter("PlanetOutline", "color", LEVEL_SELECT_BLUE_GLOW_COLOR);
          button.setEffectStringParameter("PlanetGlow", "color", LEVEL_SELECT_BLUE_GLOW_COLOR);
        }
      }
    }
    const homeButtons = runtimeScene.getObjects("HomeButton");
    const homeTexts = runtimeScene.getObjects("HomeButtonText");
    for (const button of homeButtons) {
      if (!button.__headSpaceLevelSelectBaseWidth) {
        button.__headSpaceLevelSelectBaseWidth = Math.max(1, button.getWidth?.() || 1);
        button.__headSpaceLevelSelectBaseHeight = Math.max(1, button.getHeight?.() || 1);
        button.__headSpaceLevelSelectBaseCenterX = button.getCenterXInScene?.() || 0;
        button.__headSpaceLevelSelectBaseCenterY = button.getCenterYInScene?.() || 0;
      }
      setObjectSizePreservingCenter(
        button,
        button.__headSpaceLevelSelectBaseWidth * 3,
        button.__headSpaceLevelSelectBaseHeight * 3
      );
      setObjectCenter(
        button,
        button.__headSpaceLevelSelectBaseCenterX,
        button.__headSpaceLevelSelectBaseCenterY + LEVEL_SELECT_HOME_OFFSET_Y
      );
    }
    for (let i = 0; i < homeTexts.length; i++) {
      const textObject = homeTexts[i];
      if (!textObject.__headSpaceLevelSelectBaseCharacterSize) {
        textObject.__headSpaceLevelSelectBaseCharacterSize = Math.max(
          1,
          textObject.getCharacterSize?.() || BUTTON_TEXT_DEFAULT_SIZE
        );
      }
      if (textObject.setCharacterSize) {
        textObject.setCharacterSize(textObject.__headSpaceLevelSelectBaseCharacterSize * 3);
      }
      if (homeButtons[0]) placeTextInsideButton(textObject, homeButtons[0]);
    }

    // Level 5 was authored as a 228px-tall text box containing a leading
    // newline. That makes its visible glyph drift independently of the round
    // level marker as the canvas is scaled. Normalize the label and register
    // it to the marker every frame, matching the other level buttons.
    const levelFiveButton = runtimeScene.getObjects("Level5")[0];
    const levelFiveLabel = runtimeScene.getObjects("LevelButtonText5")[0];
    if (levelFiveButton && levelFiveLabel) {
      if (levelFiveLabel.getString?.() !== "5") levelFiveLabel.setString?.("5");
      if (levelFiveLabel.setTextAlignment) levelFiveLabel.setTextAlignment("center");
      if (levelFiveLabel.setVerticalTextAlignment) {
        levelFiveLabel.setVerticalTextAlignment("center");
      }
      setObjectCenter(
        levelFiveLabel,
        levelFiveButton.getCenterXInScene(),
        levelFiveButton.getCenterYInScene()
      );
    }
  }

  function getSceneBoolean(runtimeScene, name) {
    try {
      return runtimeScene.getVariables().get(name).getAsBoolean();
    } catch {
      return false;
    }
  }

  function setSceneNumber(runtimeScene, name, value) {
    try {
      runtimeScene.getVariables().get(name).setNumber(value);
    } catch {
      // Ignore missing variable containers.
    }
  }

  function setSceneBoolean(runtimeScene, name, value) {
    try {
      runtimeScene.getVariables().get(name).setBoolean(value);
    } catch {
      // Ignore missing variable containers.
    }
  }

  function applySharedLateLevelOutcomeConditions(runtimeScene, level, state) {
    if (!state || Number(level) < 11 || Number(level) > 12) return;
    if (isMultiplayerGame(runtimeScene, level)) return;
    const playerAlive = runtimeScene
      .getObjects("Player")
      .some((player) => player && player.getWidth?.() > 0.5 && player.getHeight?.() > 0.5);
    const bossAlive = runtimeScene
      .getObjects("SmartEnemy")
      .some((boss) => boss && boss.getWidth?.() > 0.5 && boss.getHeight?.() > 0.5);
    if (playerAlive) state.playerWasPresent = true;
    if (bossAlive) state.bossWasPresent = true;

    if (state.playerWasPresent && !playerAlive) {
      setSceneBoolean(runtimeScene, "LevelWon", false);
      setSceneBoolean(runtimeScene, "LevelLost", true);
      setSceneBoolean(runtimeScene, "Paused", false);
      return;
    }
    if (state.bossWasPresent && !bossAlive && !getSceneBoolean(runtimeScene, "LevelLost")) {
      setSceneBoolean(runtimeScene, "LevelWon", true);
      setSceneBoolean(runtimeScene, "Paused", false);
    }
  }

  function getBestTimeFromGameVar(runtimeScene, level) {
    try {
      return runtimeScene
        .getGame()
        .getVariables()
        .get("BestTimes")
        .getChild(String(level))
        .getAsNumber();
    } catch {
      return 0;
    }
  }

  function setBestTimeToGameVar(runtimeScene, level, value) {
    try {
      runtimeScene
        .getGame()
        .getVariables()
        .get("BestTimes")
        .getChild(String(level))
        .setNumber(value);
    } catch {
      // Ignore missing variables.
    }
  }

  function syncBestTimesIntoGameVariables(runtimeScene) {
    for (let level = PLAYABLE_LEVEL_MIN; level <= PLAYABLE_LEVEL_MAX; level++) {
      const key = String(level);
      const fromStorage = Number(bestTimes[key]) || 0;
      const fromGame = getBestTimeFromGameVar(runtimeScene, level);
      const merged =
        fromStorage > 0 && fromGame > 0 ? Math.min(fromStorage, fromGame) : fromStorage || fromGame || 0;
      if (merged > 0) {
        bestTimes[key] = merged;
        setBestTimeToGameVar(runtimeScene, level, merged);
      }
    }
    saveBestTimes();
  }

  function ensureSceneState(runtimeScene, level) {
    let state = sceneState.get(runtimeScene);
    if (!state) {
      state = {
        level: level,
        levelStartTimeMs: performance.now(),
        timerStartedAtMs: null,
        frozenTimeSeconds: null,
        totalPausedMs: 0,
        pauseStartedAtMs: null,
        paused: false,
        pauseSnapshotCounts: null,
        justResumedFromPause: false,
        completionVisualMode: null,
        completionVisualFilters: [],
        completionFrozen: false,
        introDismissed: false,
        firstOrbFired: false,
        winCommitted: false,
        playerWasPresent: false,
        bossWasPresent: false,
        enemySizeInitialized: false,
        smartEnemyActivated: false,
        bossLockedTarget: null,
        bossLockedTargetUntilSeconds: -Infinity,
        bossIntentMode: null,
        bossIntentTarget: null,
        bossIntentUntilSeconds: -Infinity,
        bossNextDecisionAtSeconds: -Infinity,
        bossHeadingX: 0,
        bossHeadingY: 0,
        bossAvoidanceTurnSign: 0,
        bossAvoidanceObstacleKey: null,
        bossHazardUntilSeconds: -Infinity,
        bossWallEscapeUntilSeconds: -Infinity,
        bossSearchAngle: 0,
        bossSearchUntilSeconds: -Infinity,
        bossEscapeThreat: null,
        bossEscapeThreatUntilSeconds: -Infinity,
        bossTargetSize: null,
        bossSizeAdjusted: false,
        bossSpawnAdjusted: false,
        levelFourExtraEnemiesAdded: false,
        levelFourBossNeighborBalanced: false,
        levelFiveLargestEnemiesReduced: false,
        levelSixExtraEnemiesAdded: false,
        levelSixEnemySpiralSeeded: false,
        levelSixStartLayoutApplied: false,
        levelSixPlayerProtectionUntilSeconds: -Infinity,
        levelTenStartLayoutApplied: false,
        levelTenPostStartLayoutApplied: false,
        levelTenPlayerProtectionUntilSeconds: -Infinity,
        levelSevenFigureEightCenterX: null,
        levelSevenFigureEightCenterY: null,
        levelSevenFigureEightPhase: 0,
        levelSevenFigureEightUpdatedAtSeconds: null,
        planetSpawnClearanceApplied: false,
        levelFourBaitEnemiesRelocated: false,
        levelFourBossCorneredForSeconds: 0,
        levelFourBossUnstickUntilSeconds: -Infinity,
        nativeBossForceX: 0,
        nativeBossForceY: 0,
        nativeBossForceUpdatedAtSeconds: -Infinity,
        bossWallContactStartedAtSeconds: null,
        levelSixBossCorneredForSeconds: 0,
        levelSixBossUnstickUntilSeconds: -Infinity,
        levelSixBossPlanetRouteDirection: 0,
        nativeSmartEnemyImpulseCleared: false,
        bossHeadStartStartedAtSeconds: null,
        bossAggroStartedAtSeconds: null,
        lowRegularEnemiesSinceSeconds: null,
        zeroRegularEnemiesSinceSeconds: null,
        zeroEnemyWaveStartedAtSeconds: null,
        zeroEnemyWaveSpawnedCount: 0,
        levelSelectZoomSnapshot: null,
        recoilProcessedOrbKeys: new Set(),
        absorbFlashByObjectKey: new Map(),
        multiplayerOutcomeAuthorized: false,
      };
      sceneState.set(runtimeScene, state);
      return state;
    }

    if (state.level !== level) {
      state.level = level;
      state.levelStartTimeMs = performance.now();
      state.timerStartedAtMs = null;
      state.frozenTimeSeconds = null;
      state.totalPausedMs = 0;
      state.pauseStartedAtMs = null;
      state.paused = false;
      state.pauseSnapshotCounts = null;
      state.justResumedFromPause = false;
      clearCompletionVisuals(runtimeScene, state);
      state.completionVisualMode = null;
      state.completionVisualFilters = [];
      state.completionFrozen = false;
      state.introDismissed = false;
      state.firstOrbFired = false;
      state.winCommitted = false;
      state.multiplayerOutcomeAuthorized = false;
      state.playerWasPresent = false;
      state.bossWasPresent = false;
      state.enemySizeInitialized = false;
      state.smartEnemyActivated = false;
      state.bossLockedTarget = null;
      state.bossLockedTargetUntilSeconds = -Infinity;
      state.bossIntentMode = null;
      state.bossIntentTarget = null;
      state.bossIntentUntilSeconds = -Infinity;
      state.bossNextDecisionAtSeconds = -Infinity;
      state.bossHeadingX = 0;
      state.bossHeadingY = 0;
      state.bossAvoidanceTurnSign = 0;
      state.bossAvoidanceObstacleKey = null;
      state.bossHazardUntilSeconds = -Infinity;
      state.bossWallEscapeUntilSeconds = -Infinity;
      state.bossSearchAngle = 0;
      state.bossSearchUntilSeconds = -Infinity;
      state.bossEscapeThreat = null;
      state.bossEscapeThreatUntilSeconds = -Infinity;
      state.bossTargetSize = null;
      state.bossSizeAdjusted = false;
      state.bossSpawnAdjusted = false;
      state.bossBootstrapComplete = false;
      state.levelFourExtraEnemiesAdded = false;
      state.levelFourBossNeighborBalanced = false;
      state.levelFiveLargestEnemiesReduced = false;
      state.levelSixExtraEnemiesAdded = false;
      state.levelSixEnemySpiralSeeded = false;
      state.levelSixStartLayoutApplied = false;
      state.levelSixPlayerProtectionUntilSeconds = -Infinity;
      state.levelTenStartLayoutApplied = false;
      state.levelTenPostStartLayoutApplied = false;
      state.levelTenPlayerProtectionUntilSeconds = -Infinity;
      state.levelSevenFigureEightCenterX = null;
      state.levelSevenFigureEightCenterY = null;
      state.levelSevenFigureEightPhase = 0;
      state.levelSevenFigureEightUpdatedAtSeconds = null;
      state.planetSpawnClearanceApplied = false;
      state.levelFourBaitEnemiesRelocated = false;
      state.levelFourBossCorneredForSeconds = 0;
      state.levelFourBossUnstickUntilSeconds = -Infinity;
      state.nativeBossForceX = 0;
      state.nativeBossForceY = 0;
      state.nativeBossForceUpdatedAtSeconds = -Infinity;
      state.bossWallContactStartedAtSeconds = null;
      state.levelSixBossCorneredForSeconds = 0;
      state.levelSixBossUnstickUntilSeconds = -Infinity;
      state.levelSixBossPlanetRouteDirection = 0;
      state.nativeSmartEnemyImpulseCleared = false;
      state.bossHeadStartStartedAtSeconds = null;
      state.bossAggroStartedAtSeconds = null;
      state.lowRegularEnemiesSinceSeconds = null;
      state.zeroRegularEnemiesSinceSeconds = null;
      state.zeroEnemyWaveStartedAtSeconds = null;
      state.zeroEnemyWaveSpawnedCount = 0;
      state.levelSelectZoomSnapshot = null;
      state.recoilProcessedOrbKeys = new Set();
      state.absorbFlashByObjectKey = new Map();
      setPauseOverlayVisible(false);
      showIntroMessages(runtimeScene, level);
      setSceneNumber(runtimeScene, "LevelTime", 0);
    }

    return state;
  }

  function hideIntroMessages(runtimeScene) {
    const names = ["Message1", "Message2", "Message3"];
    for (const name of names) {
      const objects = runtimeScene.getObjects(name);
      for (let i = 0; i < objects.length; i++) {
        objects[i].setOpacity(0);
        objects[i].hide(true);
      }
    }
  }

  function removeMobileIntroMessages(runtimeScene) {
    for (const name of ["Message1", "Message2", "Message3"]) {
      for (const object of runtimeScene.getObjects(name)) {
        object.setString?.("");
        object.setText?.("");
        object.setOpacity?.(0);
        object.hide?.(true);
        const renderer = object.getRendererObject?.();
        if (renderer) {
          renderer.visible = false;
          renderer.renderable = false;
          renderer.alpha = 0;
        }
        object.deleteFromScene?.(runtimeScene);
      }
    }
  }

  function getIntroMessages(level) {
    const normalizedLevel = Number(level);
    if (normalizedLevel === 1) {
      return [
        "Touch screen or click to move player",
        "Bigger objects absorb smaller ones",
        "ABSORB ALL ENEMIES",
      ];
    }
    if (normalizedLevel === 2 || normalizedLevel === 3) {
      return ["BECOME THE BIGGEST TO\nTO WIN"];
    }
    if (normalizedLevel === 4 || normalizedLevel === 5) {
      return ["ABSORB THE BOSS TO WIN!"];
    }
    if (normalizedLevel >= 6 && normalizedLevel <= 12) {
      return ["HUNT THE BOSS TO\nTO WIN"];
    }
    return null;
  }

  function suppressLegacyTutorialMessages(runtimeScene, level, state) {
    const messages = getIntroMessages(level) || [];
    const names = ["Message1", "Message2", "Message3"];
    for (let index = 0; index < names.length; index++) {
      const objects = runtimeScene.getObjects(names[index]);
      for (let i = 0; i < objects.length; i++) {
        const object = objects[i];
        const currentText = object.getString ? object.getString() : object.getText ? object.getText() : "";
        if (!LEGACY_TUTORIAL_TEXTS.has(currentText)) continue;

        const replacement = state?.introDismissed ? "" : messages[index] || "";
        if (object.setString) object.setString(replacement);
        else if (object.setText) object.setText(replacement);
        object.setOpacity(replacement ? 255 : 0);
        object.hide(!replacement);
      }
    }
  }

  function applyIntroMessages(runtimeScene, level) {
    const messages = getIntroMessages(level);
    if (!messages) return;

    const names = ["Message1", "Message2", "Message3"];
    for (let index = 0; index < names.length; index++) {
      const objects = runtimeScene.getObjects(names[index]);
      const text = messages[index] || "";
      const shouldShow = text.length > 0;
      for (let i = 0; i < objects.length; i++) {
        const object = objects[i];
        if (object.setString) {
          object.setString(text);
        } else if (object.setText) {
          object.setText(text);
        }
        if (object.setCharacterSize) {
          if (text.includes("\n")) {
            object.setCharacterSize(index === 0 ? 34 : 30);
          } else {
            object.setCharacterSize(index === 0 ? 40 : 34);
          }
        }
        object.setOpacity(255);
        object.hide(!shouldShow);
      }
    }
  }

  function positionIntroMessages(runtimeScene) {
    const names = ["Message1", "Message2", "Message3"];
    const uiCamX = gdjs.evtTools.camera.getCameraX(runtimeScene, "UI", 0);
    const uiCamY = gdjs.evtTools.camera.getCameraY(runtimeScene, "UI", 0);
    const uiCamW = gdjs.evtTools.camera.getCameraWidth(runtimeScene, "UI", 0);
    const uiCamH = gdjs.evtTools.camera.getCameraHeight(runtimeScene, "UI", 0);
    const players = runtimeScene.getObjects("Player");
    const player = players.length ? players[0] : null;

    let anchorX = uiCamX;
    let anchorY = uiCamY + uiCamH * 0.22;
    let playerHeight = 96;

    if (player) {
      const playerLayer = player.getLayer ? player.getLayer() : "";
      const worldCamX = gdjs.evtTools.camera.getCameraX(runtimeScene, playerLayer, 0);
      const worldCamY = gdjs.evtTools.camera.getCameraY(runtimeScene, playerLayer, 0);
      anchorX = uiCamX + (player.getCenterXInScene() - worldCamX);
      anchorY = uiCamY + (player.getCenterYInScene() - worldCamY);
      playerHeight = Math.max(64, player.getHeight ? player.getHeight() : 96);
    }

    const visibleObjects = [];
    for (let index = 0; index < names.length; index++) {
      const objects = runtimeScene.getObjects(names[index]);
      for (let i = 0; i < objects.length; i++) {
        const object = objects[i];
        if (object.isHidden && object.isHidden()) continue;
        visibleObjects.push({ object, index });
      }
    }
    if (!visibleObjects.length) return;

    const lineGap = visibleObjects.length === 1 ? 0 : 42;
    const stackHeight = lineGap * Math.max(0, visibleObjects.length - 1);
    const desiredTopY = anchorY - Math.max(110, playerHeight * 0.95) - stackHeight * 0.5;
    const minTopY = uiCamY - uiCamH * 0.34;
    const maxTopY = uiCamY + uiCamH * 0.08;
    const topY = clamp(desiredTopY, minTopY, maxTopY);
    const clampedX = clamp(anchorX, uiCamX - uiCamW * 0.18, uiCamX + uiCamW * 0.18);

    for (let i = 0; i < visibleObjects.length; i++) {
      const { object } = visibleObjects[i];
      if (object.setTextAlignment) {
        object.setTextAlignment("center");
      }
      const lineY = topY + i * lineGap;
      if (object.setCenterPositionInScene) {
        object.setCenterPositionInScene(clampedX, lineY);
      } else {
        if (object.setCenterXInScene) object.setCenterXInScene(clampedX);
        if (object.setCenterYInScene) object.setCenterYInScene(lineY);
      }
    }
  }

  function showIntroMessages(runtimeScene, level = getCurrentLevel(runtimeScene)) {
    if (isTouchLandscapeViewport()) {
      hideIntroMessages(runtimeScene);
      return;
    }
    applyIntroMessages(runtimeScene, level);
    positionIntroMessages(runtimeScene);
    const messages = getIntroMessages(level);
    const names = ["Message1", "Message2", "Message3"];
    for (let index = 0; index < names.length; index++) {
      const objects = runtimeScene.getObjects(names[index]);
      const shouldShow = !messages || !!messages[index];
      for (let i = 0; i < objects.length; i++) {
        objects[i].setOpacity(255);
        objects[i].hide(!shouldShow);
      }
    }
  }

  function hasGameplayStarted(runtimeScene) {
    if (runtimeScene.getObjects("EmittedMaterial").length > 0) return true;
    if (gdjs?.evtTools?.input?.isMouseButtonPressed && gdjs.evtTools.input.isMouseButtonPressed(runtimeScene, "Left")) {
      return true;
    }

    const players = runtimeScene.getObjects("Player");
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      if (!player.hasBehavior || !player.hasBehavior("Physics2")) continue;
      const physics = player.getBehavior("Physics2");
      const speed = Math.hypot(physics.getLinearVelocityX(), physics.getLinearVelocityY());
      if (speed > 8) return true;
    }

    return false;
  }

  function applyPlayerOrbRecoilBonus(runtimeScene, state) {
    if (!runtimeScene || !state) return;
    if (!(state.recoilProcessedOrbKeys instanceof Set)) {
      state.recoilProcessedOrbKeys = new Set();
    }

    const player = runtimeScene.getObjects("Player")[0] || null;
    if (!player?.hasBehavior || !player.hasBehavior("Physics2")) return;

    const physics = player.getBehavior("Physics2");
    if (!physics?.setLinearVelocityX || !physics?.setLinearVelocityY) return;

    const playerX = player.getCenterXInScene();
    const playerY = player.getCenterYInScene();
    const orbs = runtimeScene.getObjects("EmittedMaterial");
    let recoilApplied = false;
    for (let i = 0; i < orbs.length; i++) {
      const orb = orbs[i];
      const orbKey = getAbsorbFlashObjectKey(orb);
      if (!orbKey || state.recoilProcessedOrbKeys.has(orbKey)) continue;
      state.recoilProcessedOrbKeys.add(orbKey);

      let directionX = orb.getCenterXInScene() - playerX;
      let directionY = orb.getCenterYInScene() - playerY;
      let directionMagnitude = Math.hypot(directionX, directionY);
      if (directionMagnitude <= 0.001 && orb.hasBehavior?.("Physics2")) {
        const orbPhysics = orb.getBehavior("Physics2");
        directionX =
          (orbPhysics.getLinearVelocityX ? orbPhysics.getLinearVelocityX() : 0) -
          (physics.getLinearVelocityX ? physics.getLinearVelocityX() : 0);
        directionY =
          (orbPhysics.getLinearVelocityY ? orbPhysics.getLinearVelocityY() : 0) -
          (physics.getLinearVelocityY ? physics.getLinearVelocityY() : 0);
        directionMagnitude = Math.hypot(directionX, directionY);
      }
      if (directionMagnitude <= 0.001) continue;

      const velocityX = physics.getLinearVelocityX ? physics.getLinearVelocityX() : 0;
      const velocityY = physics.getLinearVelocityY ? physics.getLinearVelocityY() : 0;
      const currentSpeed = Math.hypot(velocityX, velocityY);
      const recoilBonus =
        currentSpeed >= PLAYER_ORB_RECOIL_HIGH_SPEED_THRESHOLD
          ? PLAYER_ORB_RECOIL_HIGH_SPEED_BONUS
          : PLAYER_ORB_RECOIL_BONUS_SPEED;
      const directionScale = recoilBonus / directionMagnitude;
      physics.setLinearVelocityX(velocityX - directionX * directionScale);
      physics.setLinearVelocityY(velocityY - directionY * directionScale);
      recoilApplied = true;
    }

    if (recoilApplied) capPhysicsSpeed(physics, PLAYER_INTENDED_MAX_SPEED);
  }

  function isClearAllEnemiesLevel(level) {
    return Number(level) === 1;
  }

  function getWinObjectiveLabel(level, runtimeScene = null) {
    if (runtimeScene && isMultiplayerGame(runtimeScene, level)) {
      return getMultiplayerGameMode(runtimeScene) === "hunt-the-boss"
        ? "Absorb The Boss"
        : "Absorb The Other Players";
    }
    if (isClearAllEnemiesLevel(level)) return "Clear All Enemies";
    if (isBossLevel(level)) return "Hunt The Boss";
    return "Become The Biggest";
  }

  function updateHud(runtimeScene, level, elapsedSeconds, bestSeconds) {
    const hud = ensureHud();
    const objective = getWinObjectiveLabel(Number(level), runtimeScene);
    hud.textContent = isTouchLandscapeViewport()
      ? `LEVEL ${level}  ·  TIME ${formatTime(elapsedSeconds)}  ·  BEST ${formatTime(bestSeconds)}\nGOAL: ${objective}`
      : `LEVEL ${level}\nTIME ${formatTime(elapsedSeconds)}\nBEST ${formatTime(bestSeconds)}\nTO WIN: ${objective}`;
  }

  function setRuntimeTimeScale(runtimeScene, scale) {
    try {
      gdjs.evtTools.runtimeScene.setTimeScale(runtimeScene, scale);
    } catch {
      // Ignore runtime scenes that are already being replaced.
    }
  }

  function getElapsedSecondsForState(state) {
    if (!state || !Number.isFinite(state.timerStartedAtMs)) return 0;
    const now = performance.now();
    const activePauseMs = state.paused && state.pauseStartedAtMs !== null ? now - state.pauseStartedAtMs : 0;
    return Math.max(0, (now - state.timerStartedAtMs - state.totalPausedMs - activePauseMs) / 1000);
  }

  function ensureRunTimerStarted(runtimeScene, state) {
    if (!runtimeScene || !state || Number.isFinite(state.timerStartedAtMs)) return false;
    if (runtimeScene.getObjects("EmittedMaterial").length < 1) return false;

    state.timerStartedAtMs = performance.now();
    return true;
  }

  function captureObjectCounts(runtimeScene, objectNames) {
    const counts = {};
    for (const name of objectNames) {
      counts[name] = runtimeScene.getObjects(name).length;
    }
    return counts;
  }

  function trimObjectsToCount(runtimeScene, objectName, maxCount) {
    if (maxCount < 0) return;
    const objects = runtimeScene.getObjects(objectName);
    for (let i = objects.length - 1; i >= maxCount; i--) {
      objects[i].deleteFromScene(runtimeScene);
    }
  }

  function deleteRuntimeObjectTree(runtimeScene, object) {
    if (!object) return;
    disableHiddenHostLighting(object);
    for (const companion of [
      object.__headSpaceImageCompanion,
      object.__headSpaceHelmetCompanion,
      object.__headSpacePointerCompanion,
    ]) {
      if (!companion) continue;
      disableHiddenHostLighting(companion);
      companion.__headSpaceCompanionHost = null;
      companion.deleteFromScene?.(runtimeScene);
    }
    object.__headSpaceImageCompanion = null;
    object.__headSpaceHelmetCompanion = null;
    object.__headSpacePointerCompanion = null;
    object.hide?.(true);
    object.setOpacity?.(0);
    object.deleteFromScene?.(runtimeScene);
  }

  function cleanupOrphanedGameplayCompanions(runtimeScene) {
    for (const [hostName, companionName] of [
      ["Player", "PlayerImage"],
      ["Player", "PlayerHelmet"],
      ["Enemy", "EnemyImage"],
      ["SmartEnemy", "SmartEnemyImage"],
    ]) {
      const liveHosts = new Set(getLiveSceneObjects(runtimeScene, hostName));
      for (const companion of runtimeScene.getObjects(companionName).slice()) {
        const host = companion.__headSpaceCompanionHost;
        if (host && !liveHosts.has(host)) {
          disableHiddenHostLighting(companion);
          companion.deleteFromScene?.(runtimeScene);
        }
      }
      for (const host of runtimeScene.getObjects(hostName)) {
        if (liveHosts.has(host)) continue;
        disableHiddenHostLighting(host);
      }
    }
  }

  function removeNonFrameworkDeclarativeActors(runtimeScene, level) {
    if (!isSharedDeclarativeMultiplayerLevel(runtimeScene, level)) return;
    for (const objectName of ["Enemy", "SmartEnemy", "Walls"]) {
      for (const object of runtimeScene.getObjects(objectName).slice()) {
        if (object.__headSpaceFrameworkCreated) continue;
        deleteRuntimeObjectTree(runtimeScene, object);
      }
    }
    for (const companionName of ["EnemyImage", "SmartEnemyImage"]) {
      for (const companion of runtimeScene.getObjects(companionName).slice()) {
        if (companion.__headSpaceCompanionHost?.__headSpaceFrameworkCreated) continue;
        deleteRuntimeObjectTree(runtimeScene, companion);
      }
    }
  }

  function getActiveBossCount(runtimeScene) {
    return runtimeScene
      .getObjects("SmartEnemy")
      .filter((boss) => Math.max(boss.getWidth ? boss.getWidth() : 0, boss.getHeight ? boss.getHeight() : 0) > 0.5)
      .length;
  }

  function suppressErroneousBossWin(runtimeScene, level, state) {
    if (!isBossLevel(level)) return false;
    if (!getSceneBoolean(runtimeScene, "LevelWon")) return false;
    if (getActiveBossCount(runtimeScene) < 1) return false;

    setSceneBoolean(runtimeScene, "LevelWon", false);
    if (state) {
      state.frozenTimeSeconds = null;
      state.winCommitted = false;
    }
    return true;
  }

  function cleanupLingeringBossLevelOverUi(runtimeScene, level, levelWon, levelLost) {
    if (!isBossLevel(level) || levelWon || levelLost) return;
    if (getActiveBossCount(runtimeScene) < 1) return;

    trimObjectsToCount(runtimeScene, "Button", 0);
    trimObjectsToCount(runtimeScene, "Button_Text", 0);
    trimObjectsToCount(runtimeScene, "HomeButton", 0);
    trimObjectsToCount(runtimeScene, "HomeButtonText", 0);
    trimObjectsToCount(runtimeScene, "ButtonMulti", 0);
    trimObjectsToCount(runtimeScene, "Button_Multi_Text", 0);

    const message1Count = runtimeScene.getObjects("Message1").length;
    if (message1Count > 1) {
      trimObjectsToCount(runtimeScene, "Message1", 1);
    }
  }

  function enforcePauseSnapshot(runtimeScene, state) {
    if (!state || !state.pauseSnapshotCounts) return;
    const multiplayer = isMultiplayerGame(runtimeScene, getCurrentLevel(runtimeScene));
    const resumeCriticalObjects = multiplayer
      ? new Set([
          "Player",
          "PlayerImage",
          "PlayerHelmet",
          "Light1",
          "Light2",
          "Light3",
          "Light4",
        ])
      : null;
    for (const [objectName, expectedCount] of Object.entries(state.pauseSnapshotCounts)) {
      if (resumeCriticalObjects?.has(objectName)) continue;
      trimObjectsToCount(runtimeScene, objectName, Number(expectedCount) || 0);
    }
    state.pauseSnapshotCounts = null;
  }

  function restoreMultiplayerPlayerVisualsAfterResume(runtimeScene, state) {
    if (!isMultiplayerGame(runtimeScene, getCurrentLevel(runtimeScene))) return;

    const players = runtimeScene.getObjects("Player");
    trimObjectsToCount(runtimeScene, "PlayerImage", players.length);
    trimObjectsToCount(runtimeScene, "PlayerHelmet", players.length);
    const playerImages = runtimeScene.getObjects("PlayerImage");
    const playerHelmets = runtimeScene.getObjects("PlayerHelmet");
    const selectedHelmet = Math.max(
      0,
      Math.round(runtimeScene.getGame().getVariables().getFromIndex(1).getAsNumber())
    );
    for (const objectName of ["Player", "PlayerImage", "PlayerHelmet"]) {
      for (const object of runtimeScene.getObjects(objectName)) {
        object.hide?.(false);
        const isPhysicsHost = objectName === "Player";
        object.setOpacity?.(isPhysicsHost ? 0 : 255);
        const rendererObject = object.getRendererObject?.();
        if (rendererObject) {
          rendererObject.visible = true;
          rendererObject.renderable = true;
          rendererObject.alpha = isPhysicsHost ? 0 : 1;
        }
        if (objectName === "PlayerHelmet" && object.hasBehavior?.("Animation")) {
          object.getBehavior("Animation").setAnimationIndex(selectedHelmet);
        }
      }
    }
    players.forEach((player, index) => {
      const centerX = player.getCenterXInScene();
      const centerY = player.getCenterYInScene();
      if (playerImages[index]) moveObjectToCenter(playerImages[index], centerX, centerY);
      if (playerHelmets[index]) moveObjectToCenter(playerHelmets[index], centerX, centerY);
    });
    applyGameplayHelmetCoverScale(runtimeScene);

    setRuntimeTimeScale(runtimeScene, 1);
    setPauseOverlayVisible(false);
    state.pauseResumeVisualRecoveryFrames = Math.max(
      0,
      Number(state.pauseResumeVisualRecoveryFrames || 0) - 1
    );
  }

  function handlePauseHotkey(runtimeScene, canPause) {
    if (!canPause) return false;
    if (!gdjs?.evtTools?.input?.wasKeyReleased) return false;
    if (!gdjs.evtTools.input.wasKeyReleased(runtimeScene, "Space")) return false;

    const nextPaused = !getSceneBoolean(runtimeScene, "Paused");
    setSceneBoolean(runtimeScene, "Paused", nextPaused);
    return nextPaused;
  }

  function syncPauseState(runtimeScene, state, canPause) {
    const now = performance.now();
    const scenePaused = canPause && getSceneBoolean(runtimeScene, "Paused");

    if (scenePaused && !state.paused) {
      state.paused = true;
      state.pauseStartedAtMs = now;
      state.pauseSnapshotCounts = captureObjectCounts(
        runtimeScene,
        PAUSE_DUPLICATION_GUARD_OBJECTS
      );
      state.justResumedFromPause = false;
    } else if (!scenePaused && state.paused) {
      if (state.pauseStartedAtMs !== null) state.totalPausedMs += now - state.pauseStartedAtMs;
      state.paused = false;
      state.pauseStartedAtMs = null;
      state.justResumedFromPause = true;
    }

    if (!canPause) {
      setSceneBoolean(runtimeScene, "Paused", false);
      setRuntimeTimeScale(runtimeScene, 1);
      setPauseOverlayVisible(false);
      state.pauseSnapshotCounts = null;
      state.justResumedFromPause = false;
      syncHudPauseButtonState(false);
      return false;
    }

    setPauseOverlayVisible(state.paused);
    setRuntimeTimeScale(runtimeScene, state.paused ? 0 : 1);
    syncHudPauseButtonState(state.paused);
    return state.paused;
  }

  function clearPauseBeforeSceneChange(runtimeScene, state) {
    if (state && state.paused && state.pauseStartedAtMs !== null) {
      state.totalPausedMs += performance.now() - state.pauseStartedAtMs;
      state.pauseStartedAtMs = null;
      state.paused = false;
    }
    if (state) {
      state.pauseSnapshotCounts = null;
      state.justResumedFromPause = false;
      state.completionFrozen = false;
    }
    clearCompletionVisuals(runtimeScene, state);
    setSceneBoolean(runtimeScene, "Paused", false);
    setRuntimeTimeScale(runtimeScene, 1);
    setPauseOverlayVisible(false);
  }

  function getCompletionColorMatrix(mode) {
    if (mode === "win") {
      return [
        -0.5, 0, 0, 0, 0.58,
        0, -1, 0, 0, 1.08,
        0, 0, -0.5, 0, 0.58,
        0, 0, 0, 1, 0,
      ];
    }

    return [
      -1, 0, 0, 0, 1.08,
      0, -0.5, 0, 0, 0.58,
      0, 0, -0.5, 0, 0.58,
      0, 0, 0, 1, 0,
    ];
  }

  function createCompletionFilter(mode) {
    if (typeof PIXI === "undefined" || typeof PIXI.ColorMatrixFilter !== "function") return null;
    const filter = new PIXI.ColorMatrixFilter();
    filter[COMPLETION_FILTER_KEY] = true;
    filter.matrix = getCompletionColorMatrix(mode);
    filter.alpha = 1;
    filter.enabled = true;
    return filter;
  }

  function clearCompletionVisuals(runtimeScene, state) {
    if (!state || !state.completionVisualFilters) return;

    for (let i = 0; i < state.completionVisualFilters.length; i++) {
      const entry = state.completionVisualFilters[i];
      const rendererObject = entry && entry.rendererObject;
      const filter = entry && entry.filter;
      if (!rendererObject || !filter || !Array.isArray(rendererObject.filters)) continue;
      rendererObject.filters = rendererObject.filters.filter((candidate) => candidate !== filter);
    }

    state.completionVisualFilters = [];
    state.completionVisualMode = null;
  }

  function applyCompletionVisuals(runtimeScene, state, mode) {
    if (!runtimeScene || !state || !mode) return;
    if (state.completionVisualMode === mode && state.completionVisualFilters.length) return;

    clearCompletionVisuals(runtimeScene, state);

    for (let i = 0; i < COMPLETION_FILTER_LAYER_NAMES.length; i++) {
      const layerName = COMPLETION_FILTER_LAYER_NAMES[i];
      if (typeof runtimeScene.hasLayer === "function" && !runtimeScene.hasLayer(layerName)) continue;

      let layer = null;
      try {
        layer = runtimeScene.getLayer(layerName);
      } catch {
        layer = null;
      }
      const rendererObject = layer && layer.getRendererObject ? layer.getRendererObject() : null;
      if (!rendererObject) continue;

      const filter = createCompletionFilter(mode);
      if (!filter) continue;
      rendererObject.filters = (rendererObject.filters || []).filter(
        (candidate) => !candidate || !candidate[COMPLETION_FILTER_KEY]
      );
      rendererObject.filters.push(filter);
      state.completionVisualFilters.push({ rendererObject, filter });
    }

    state.completionVisualMode = mode;
  }

  function freezePhysicsObject(object) {
    if (!object) return;
    if (typeof object.clearForces === "function") object.clearForces();
    if (!object.hasBehavior || !object.hasBehavior("Physics2")) return;

    const physics = object.getBehavior("Physics2");
    if (physics.setLinearVelocityX) physics.setLinearVelocityX(0);
    if (physics.setLinearVelocityY) physics.setLinearVelocityY(0);
    if (physics.setAngularVelocity) physics.setAngularVelocity(0);
  }

  function freezeCompletionObjects(runtimeScene) {
    const seen = new Set();
    for (let i = 0; i < COMPLETION_FREEZE_OBJECT_NAMES.length; i++) {
      const objects = runtimeScene.getObjects(COMPLETION_FREEZE_OBJECT_NAMES[i]);
      for (let j = 0; j < objects.length; j++) {
        const object = objects[j];
        const key = typeof object.getUniqueId === "function" ? object.getUniqueId() : object;
        if (seen.has(key)) continue;
        seen.add(key);
        freezePhysicsObject(object);
      }
    }

    if (typeof runtimeScene.getAdhocListOfAllInstances !== "function") return;
    const allObjects = runtimeScene.getAdhocListOfAllInstances();
    for (let i = 0; i < allObjects.length; i++) freezePhysicsObject(allObjects[i]);
  }

  function setLevelOverObjectsVisible(runtimeScene, objectNames) {
    for (let i = 0; i < objectNames.length; i++) {
      const objects = runtimeScene.getObjects(objectNames[i]);
      for (let j = 0; j < objects.length; j++) {
        const object = objects[j];
        if (typeof object.hide === "function") object.hide(false);
        if (typeof object.setOpacity === "function") object.setOpacity(255);
      }
    }
  }

  function ensureLevelOverRetryInstances(runtimeScene, levelWon, levelLost = false) {
    const multiplayerOutcome =
      (levelWon || levelLost) &&
      isMultiplayerGame(runtimeScene, getCurrentLevel(runtimeScene));
    if (!levelWon && !multiplayerOutcome) return;

    const primaryButton = runtimeScene.getObjects("Button")[0] || null;
    const layer = primaryButton?.getLayer?.() || "UI";
    let retryButton = runtimeScene.getObjects("ButtonMulti")[0] || null;
    let retryText = runtimeScene.getObjects("Button_Multi_Text")[0] || null;

    if (!retryButton) retryButton = createSceneObject(runtimeScene, "ButtonMulti", layer);
    if (!retryText) retryText = createSceneObject(runtimeScene, "Button_Multi_Text", layer);

    if (retryButton && primaryButton && retryButton.setZOrder && primaryButton.getZOrder) {
      retryButton.setZOrder(primaryButton.getZOrder());
    }
    if (retryText) {
      if (retryText.setString) retryText.setString("RETRY");
      if (retryButton && retryText.setZOrder && retryButton.getZOrder) {
        retryText.setZOrder(retryButton.getZOrder() + 1);
      }
    }
  }

  function ensureLevelOverUiInstances(runtimeScene, levelWon) {
    const hasPrimaryButton = runtimeScene.getObjects("Button").length > 0;
    const hasHomeButton = runtimeScene.getObjects("HomeButton").length > 0;
    const hasMessage = runtimeScene.getObjects("Message1").length > 0;
    if (!hasPrimaryButton || !hasHomeButton || !hasMessage) {
      const createFromLayout = gdjs?.evtTools?.runtimeScene?.createObjectsFromExternalLayout;
      if (typeof createFromLayout === "function") {
        createFromLayout(runtimeScene, "Level Over UI", 0, 0, 0);
      }
    }

    const primaryButton = runtimeScene.getObjects("Button")[0] || null;
    const homeButton = runtimeScene.getObjects("HomeButton")[0] || null;
    const primaryLayer = primaryButton?.getLayer?.() || "UI";
    const homeLayer = homeButton?.getLayer?.() || "UI";
    let primaryText = runtimeScene.getObjects("Button_Text")[0] || null;
    let homeText = runtimeScene.getObjects("HomeButtonText")[0] || null;
    if (!primaryText) primaryText = createSceneObject(runtimeScene, "Button_Text", primaryLayer);
    if (!homeText) homeText = createSceneObject(runtimeScene, "HomeButtonText", homeLayer);
    if (primaryText) {
      primaryText.setString?.(levelWon ? "NEXT" : "RETRY");
      if (primaryButton && primaryText.setZOrder && primaryButton.getZOrder) {
        primaryText.setZOrder(primaryButton.getZOrder() + 1);
      }
    }
    if (homeText) {
      homeText.setString?.("HOME");
      if (homeButton && homeText.setZOrder && homeButton.getZOrder) {
        homeText.setZOrder(homeButton.getZOrder() + 1);
      }
    }

    ensureLevelOverRetryInstances(
      runtimeScene,
      levelWon,
      getSceneBoolean(runtimeScene, "LevelLost")
    );
  }

  function clearLegacyLevelOverPrimaryRendererLabel(runtimeScene) {
    // NEXT previously used an ad-hoc PIXI.Text object while RETRY and HOME used
    // the authored GDevelop text objects. Remove that alternate renderer and
    // restore Button_Text so all three labels share one styling pipeline.
    const state = levelOverPrimaryRendererLabelState.get(runtimeScene);
    const label = state?.label || null;
    if (label) {
      try {
        label.parent?.removeChild?.(label);
        label.destroy?.();
      } catch {
        label.visible = false;
      }
    }
    levelOverPrimaryRendererLabelState.delete(runtimeScene);
    for (const nativeText of runtimeScene.getObjects("Button_Text")) {
      nativeText.setOpacity?.(255);
      nativeText.hide?.(false);
    }
  }

  function forceLevelOverUiReadable(runtimeScene, levelWon) {
    setLevelOverObjectsVisible(runtimeScene, [
      "Message1",
      "Button",
      "Button_Text",
      "HomeButton",
      "HomeButtonText",
    ]);

    if (
      levelWon ||
      (getSceneBoolean(runtimeScene, "LevelLost") &&
        isMultiplayerGame(runtimeScene, getCurrentLevel(runtimeScene)))
    ) {
      setLevelOverObjectsVisible(runtimeScene, ["ButtonMulti", "Button_Multi_Text"]);
    }
    clearLegacyLevelOverPrimaryRendererLabel(runtimeScene);
  }

  function raiseLevelTenCompletionUiAboveSun(runtimeScene) {
    if (!runtimeScene || getCurrentLevel(runtimeScene) !== 10) return;
    const uiRendererObject = runtimeScene.getLayer("UI")?.getRendererObject?.();
    const textureRendererObject = runtimeScene.getLayer("Texture")?.getRendererObject?.();
    const parent = uiRendererObject?.parent;
    if (!parent || parent !== textureRendererObject?.parent) return;
    const uiIndex = parent.getChildIndex?.(uiRendererObject);
    const textureIndex = parent.getChildIndex?.(textureRendererObject);
    if (!Number.isFinite(uiIndex) || !Number.isFinite(textureIndex) || uiIndex > textureIndex) return;
    parent.setChildIndex?.(uiRendererObject, textureIndex);
  }

  function applyLevelCompletionFreeze(runtimeScene, state, mode) {
    applyCompletionVisuals(runtimeScene, state, mode);
    freezeCompletionObjects(runtimeScene);
    setRuntimeTimeScale(runtimeScene, 0);
    if (state) state.completionFrozen = true;
  }

  function freezeSmartEnemies(runtimeScene) {
    const smartEnemies = runtimeScene.getObjects("SmartEnemy");
    for (let i = 0; i < smartEnemies.length; i++) {
      const smartEnemy = smartEnemies[i];
      try {
        smartEnemy.getVariables().get("CanMove").setBoolean(false);
      } catch {
        // Ignore missing variables.
      }

      if (!smartEnemy.hasBehavior || !smartEnemy.hasBehavior("Physics2")) continue;
      const physics = smartEnemy.getBehavior("Physics2");
      if (physics.setLinearVelocityX) physics.setLinearVelocityX(0);
      if (physics.setLinearVelocityY) physics.setLinearVelocityY(0);
    }
  }

  function getBossDifficultyScale(level) {
    if (level === 10) level = 8;
    return clamp(1 + Math.max(0, level - BOSS_LEVEL_MIN) * 0.08, 1, 1.56);
  }

  function getBossHeadStartSeconds(level) {
    if (isBossLevel(level)) return BOSS_HEAD_START_SECONDS;
    return 0;
  }

  function getBossActivationDelaySeconds(level) {
    if (isBossLevel(level)) return BOSS_ACTIVATION_DELAY_SECONDS;
    return 0;
  }

  function getBossSpeedRampSeconds(level) {
    if (level === 5) return LEVEL_FIVE_BOSS_SPEED_RAMP_SECONDS;
    if (isBossLevel(level)) return LEVEL_FOUR_BOSS_SPEED_RAMP_SECONDS;
    return 0;
  }

  function getBossPlayerHuntDelaySeconds(level) {
    if (isBossLevel(level)) return getBossHeadStartSeconds(level);
    return 0;
  }

  function getBossStartDistanceBonus(level, playerWidth, bossWidth) {
    if (level === 4) {
      return Math.max(430, playerWidth * 1.35 + bossWidth * 0.92);
    }

    return 0;
  }

  function getBossSpeedRampStartFactor(level) {
    if (level === 4) return 0.24;
    if (level === 5) return LEVEL_FIVE_BOSS_SPEED_RAMP_START_FACTOR;
    return BOSS_SPEED_RAMP_START_FACTOR;
  }

  function getBossForceRampStartFactor(level) {
    if (level === 4) return 0.22;
    if (level === 5) return LEVEL_FIVE_BOSS_FORCE_RAMP_START_FACTOR;
    return BOSS_FORCE_RAMP_START_FACTOR;
  }

  function getBossPreyPursuitSpeedFactor(level) {
    return level === 5 ? LEVEL_FIVE_PREY_PURSUIT_SPEED_FACTOR : BOSS_PREY_PURSUIT_SPEED_FACTOR;
  }

  function getBossPlayerAttackSpeedFactor(level) {
    return level === 5 ? LEVEL_FIVE_PLAYER_ATTACK_SPEED_FACTOR : BOSS_PLAYER_ATTACK_SPEED_FACTOR;
  }

  function getBossFinalPursuitBlend(level) {
    return level === 5 ? LEVEL_FIVE_FINAL_PURSUIT_BLEND : BOSS_FINAL_PURSUIT_BLEND;
  }

  function getBossTargetSize(level, playerWidth) {
    if (level === 4) return Math.max(1, playerWidth - LEVEL_FOUR_BOSS_SIZE_OFFSET);
    if (level === 5) return Math.max(1, playerWidth - LEVEL_FIVE_BOSS_SIZE_OFFSET);
    if (level === 6) return Math.max(1, playerWidth - LEVEL_SIX_BOSS_SIZE_OFFSET);
    if (level === 7) return Math.max(1, playerWidth - LEVEL_SEVEN_BOSS_SIZE_OFFSET);
    return Math.max(1, playerWidth + BOSS_START_SIZE_ADVANTAGE_PX);
  }

  function canBossHuntPlayer(player, size, tuning) {
    if (!player || !tuning) return false;
    return Math.max(1, player.getWidth()) < Math.max(1, size) * tuning.absorbRatio;
  }

  function isPlayerThreateningBoss(player, size, tuning) {
    if (!player || !tuning) return false;
    return Math.max(1, player.getWidth()) > Math.max(1, size) * tuning.threatRatio;
  }

  function hasNativeBossPrey(sx, sy, size, player, enemies, tuning) {
    if (canBossHuntPlayer(player, size, tuning)) return true;
    return !!findNearestObject(
      sx,
      sy,
      enemies,
      (enemy) => Math.max(1, enemy.getWidth()) < Math.max(1, size) * tuning.absorbRatio
    );
  }

  function hasNearbyLargerThreat(sx, sy, size, targets, tuning, maxDistance) {
    const threat = findNearestObject(
      sx,
      sy,
      targets,
      (target) => Math.max(1, target.getWidth()) > Math.max(1, size) * tuning.threatRatio
    );
    if (!threat) return false;
    return (
      Math.hypot(threat.getCenterXInScene() - sx, threat.getCenterYInScene() - sy) <=
      Math.max(1, maxDistance)
    );
  }

  function findNativeBossEscapeThreat(sx, sy, size, player, enemies, tuning) {
    let bestThreat = null;
    let bestDistance = Infinity;

    const playerThreatDistance = Math.max(240, size * 2.2);
    if (isPlayerThreateningBoss(player, size, tuning)) {
      const playerDistance = Math.hypot(player.getCenterXInScene() - sx, player.getCenterYInScene() - sy);
      if (playerDistance <= playerThreatDistance) {
        bestThreat = player;
        bestDistance = playerDistance;
      }
    }

    const nearbyEnemyThreat = findNearestObject(
      sx,
      sy,
      enemies,
      (enemy) => Math.max(1, enemy.getWidth()) > Math.max(1, size) * tuning.threatRatio
    );
    if (nearbyEnemyThreat) {
      const enemyDistance = Math.hypot(nearbyEnemyThreat.getCenterXInScene() - sx, nearbyEnemyThreat.getCenterYInScene() - sy);
      if (enemyDistance <= Math.max(190, size * 1.65) && enemyDistance < bestDistance) {
        bestThreat = nearbyEnemyThreat;
      }
    }

    return bestThreat;
  }

  function shouldNativeBossPrioritizeEscape(sx, sy, size, player, enemies, tuning) {
    return !!findNativeBossEscapeThreat(sx, sy, size, player, enemies, tuning);
  }

  function getLevelFourBaitFactors(runtimeScene, x, y, referenceObject) {
    const bounds = getBossSpawnBounds(runtimeScene, referenceObject);
    const topFactor = clamp((bounds.minY + LEVEL_FOUR_TOP_EDGE_BAIT_DEPTH - y) / LEVEL_FOUR_TOP_EDGE_BAIT_DEPTH, 0, 1);
    const rightFactor = clamp(
      (x - (bounds.maxX - LEVEL_FOUR_TOP_RIGHT_BAIT_WIDTH)) / LEVEL_FOUR_TOP_RIGHT_BAIT_WIDTH,
      0,
      1
    );
    const topRightPocketFactor =
      topFactor *
      clamp((bounds.minY + LEVEL_FOUR_TOP_RIGHT_BAIT_DEPTH - y) / LEVEL_FOUR_TOP_RIGHT_BAIT_DEPTH, 0, 1) *
      rightFactor;

    return {
      topFactor,
      rightFactor,
      topRightPocketFactor,
    };
  }

  function getLevelFourEnemyBaitPenalty(runtimeScene, target, referenceObject) {
    const factors = getLevelFourBaitFactors(
      runtimeScene,
      target.getCenterXInScene(),
      target.getCenterYInScene(),
      referenceObject || target
    );

    let penalty = 0;
    penalty += factors.topFactor * 220;
    penalty += factors.topRightPocketFactor * 420;
    return penalty;
  }

  function getLevelFourSpawnBaitPenalty(runtimeScene, player, x, y) {
    const factors = getLevelFourBaitFactors(runtimeScene, x, y, player);
    let penalty = 0;
    penalty += factors.topFactor * 280;
    penalty += factors.topRightPocketFactor * 520;
    return penalty;
  }

  function collectLevelFourEnemyAvoidCenters(runtimeScene, player, boss) {
    const avoidCenters = [];

    function pushObject(object, padding) {
      if (!object) return;
      const centerX = object.getCenterXInScene ? object.getCenterXInScene() : object.getX() + object.getWidth() / 2;
      const centerY = object.getCenterYInScene ? object.getCenterYInScene() : object.getY() + object.getHeight() / 2;
      if (!Number.isFinite(centerX) || !Number.isFinite(centerY)) return;
      avoidCenters.push({
        x: centerX,
        y: centerY,
        radius: Math.max(object.getWidth ? object.getWidth() : 0, object.getHeight ? object.getHeight() : 0) * 0.5 + padding,
      });
    }

    pushObject(player, 240);
    pushObject(boss, 320);

    const enemies = runtimeScene.getObjects("Enemy");
    for (let i = 0; i < enemies.length; i++) {
      pushObject(enemies[i], 88);
    }

    for (let i = 0; i < PLANET_NAMES.length; i++) {
      const planets = runtimeScene.getObjects(PLANET_NAMES[i]);
      for (let j = 0; j < planets.length; j++) {
        pushObject(planets[j], 120);
      }
    }

    return avoidCenters;
  }

  function ensureLevelFourBaitEnemiesRelocated(runtimeScene, level, state) {
    if (level !== 4 || state?.levelFourBaitEnemiesRelocated) return;

    const players = runtimeScene.getObjects("Player");
    if (!players.length) return;

    const player = players[0];
    const boss = runtimeScene.getObjects("SmartEnemy")[0] || null;
    const enemies = runtimeScene
      .getObjects("Enemy")
      .filter((enemy) => Math.max(enemy.getWidth(), enemy.getHeight()) > 0);

    if (!enemies.length) {
      state.levelFourBaitEnemiesRelocated = true;
      return;
    }

    const movedEnemies = [];
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const centerX = enemy.getCenterXInScene();
      const centerY = enemy.getCenterYInScene();
      const targetSize = Math.max(1, enemy.getWidth());
      const wallClearance = getLevelFourEnemyWallClearance(runtimeScene, centerX, centerY, targetSize * 0.5);
      const baitPenalty = getLevelFourSpawnBaitPenalty(runtimeScene, player, centerX, centerY);
      if (baitPenalty < 180 && wallClearance >= 18) continue;

      const avoidCenters = collectLevelFourEnemyAvoidCenters(runtimeScene, player, boss)
        .filter(
          (avoid) =>
            Math.hypot(avoid.x - centerX, avoid.y - centerY) >
            Math.max(enemy.getWidth(), enemy.getHeight()) * 0.5 + 16
        );

      for (let j = 0; j < movedEnemies.length; j++) {
        avoidCenters.push(movedEnemies[j]);
      }

      const spawnCenter = chooseLevelFourExtraEnemyCenter(runtimeScene, player, targetSize, avoidCenters, i + 20);
      moveObjectToCenter(enemy, spawnCenter.x, spawnCenter.y);
      if (enemy.hasBehavior && enemy.hasBehavior("Physics2")) {
        const physics = enemy.getBehavior("Physics2");
        if (physics.setLinearVelocityX) physics.setLinearVelocityX(0);
        if (physics.setLinearVelocityY) physics.setLinearVelocityY(0);
      }

      movedEnemies.push({
        x: spawnCenter.x,
        y: spawnCenter.y,
        radius: targetSize * 0.8 + 88,
      });
    }

    state.levelFourBaitEnemiesRelocated = true;
  }

  function getHashtableApi() {
    if (typeof Hashtable !== "undefined" && Hashtable && typeof Hashtable.newFrom === "function") {
      return Hashtable;
    }

    const fallback = globalThis.Hashtable;
    return fallback && typeof fallback.newFrom === "function" ? fallback : null;
  }

  function getSceneObjectBounds(runtimeScene, objectNames) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < objectNames.length; i++) {
      const objects = runtimeScene.getObjects(objectNames[i]);
      for (let j = 0; j < objects.length; j++) {
        const object = objects[j];
        const width = Math.max(0, object.getWidth ? object.getWidth() : 0);
        const height = Math.max(0, object.getHeight ? object.getHeight() : 0);
        const centerX = object.getCenterXInScene ? object.getCenterXInScene() : object.getX() + width / 2;
        const centerY = object.getCenterYInScene ? object.getCenterYInScene() : object.getY() + height / 2;
        if (!Number.isFinite(centerX) || !Number.isFinite(centerY)) continue;

        minX = Math.min(minX, centerX - width / 2);
        maxX = Math.max(maxX, centerX + width / 2);
        minY = Math.min(minY, centerY - height / 2);
        maxY = Math.max(maxY, centerY + height / 2);
      }
    }

    if (!Number.isFinite(minX) || !Number.isFinite(maxX) || !Number.isFinite(minY) || !Number.isFinite(maxY)) {
      return null;
    }

    return { minX, maxX, minY, maxY };
  }

  function getBossSpawnBounds(runtimeScene, player) {
    const wallBounds = getSceneObjectBounds(runtimeScene, ["Walls"]);
    if (wallBounds) return wallBounds;

    const viewportWidth =
      typeof runtimeScene.getViewportWidth === "function" ? Math.max(1, runtimeScene.getViewportWidth()) : 1280;
    const viewportHeight =
      typeof runtimeScene.getViewportHeight === "function" ? Math.max(1, runtimeScene.getViewportHeight()) : 720;
    const px = player.getCenterXInScene();
    const py = player.getCenterYInScene();
    return {
      minX: px - viewportWidth,
      maxX: px + viewportWidth,
      minY: py - viewportHeight,
      maxY: py + viewportHeight,
    };
  }

  function moveObjectToCenter(object, centerX, centerY) {
    if (object.setCenterPositionInScene) {
      object.setCenterPositionInScene(Math.round(centerX), Math.round(centerY));
      return;
    }

    if (object.setPosition) {
      object.setPosition(Math.round(centerX - object.getWidth() / 2), Math.round(centerY - object.getHeight() / 2));
    }
  }

  function setObjectCenterExact(object, centerX, centerY) {
    if (!object || !Number.isFinite(centerX) || !Number.isFinite(centerY)) return;
    if (object.setCenterPositionInScene) {
      object.setCenterPositionInScene(centerX, centerY);
      return;
    }
    if (object.setPosition) {
      object.setPosition(centerX - object.getWidth() / 2, centerY - object.getHeight() / 2);
    }
  }

  function syncPhysicsBodyToObjectTransform(object) {
    if (!object?.hasBehavior?.("Physics2")) return;
    const physics = object.getBehavior("Physics2");
    const body = physics.getBody?.();
    if (!body || !physics.b2Vec2 || !physics._sharedData) return;
    const worldInvScale = physics._sharedData.worldInvScale;
    body.SetTransform(
      physics.b2Vec2(
        object.getCenterXInScene() * worldInvScale,
        object.getCenterYInScene() * worldInvScale
      ),
      body.GetAngle()
    );
    body.SetAwake(true);
  }

  function getEdibleBossPreyPair(runtimeScene, level, left, right) {
    if (!runtimeScene || !isBossLevel(level) || isMultiplayerGame(runtimeScene, level)) return null;
    const leftName = left?.getName?.();
    const rightName = right?.getName?.();
    const boss = leftName === "SmartEnemy" ? left : rightName === "SmartEnemy" ? right : null;
    const prey = leftName === "Enemy" ? left : rightName === "Enemy" ? right : null;
    if (!boss || !prey || boss.getWidth?.() <= 1 || prey.getWidth?.() <= 1) return null;
    if (boss.getWidth() + 0.001 < prey.getWidth()) return null;
    return { boss, prey };
  }

  function resolveMultiplayerEnemyOverlaps(runtimeScene) {
    if (
      getSceneBoolean(runtimeScene, "Paused") ||
      getSceneBoolean(runtimeScene, "LevelWon") ||
      getSceneBoolean(runtimeScene, "LevelLost")
    ) return;

    // Global actor invariant: no two live hostile actors may occupy the same
    // visible disc. Run this for every single-player and multiplayer level,
    // including future layouts that use the standard Enemy/SmartEnemy hosts.
    const enemies = ["Enemy", "SmartEnemy"]
      .flatMap((name) => runtimeScene.getObjects(name))
      .filter((enemy) => enemy && enemy.getWidth?.() > 1 && enemy.getHeight?.() > 1);
    if (enemies.length < 2) return;
    const movedEnemies = new Set();

    const level = getCurrentLevel(runtimeScene);

    for (let pass = 0; pass < 8; pass++) {
      let corrected = false;
      for (let leftIndex = 0; leftIndex < enemies.length; leftIndex++) {
        const left = enemies[leftIndex];
        const leftRadius = Math.min(left.getWidth(), left.getHeight()) * 0.5;
        for (let rightIndex = leftIndex + 1; rightIndex < enemies.length; rightIndex++) {
          const right = enemies[rightIndex];
          if (getEdibleBossPreyPair(runtimeScene, level, left, right)) continue;
          const rightRadius = Math.min(right.getWidth(), right.getHeight()) * 0.5;
          const minimumDistance = leftRadius + rightRadius + 4;
          let dx = right.getCenterXInScene() - left.getCenterXInScene();
          let dy = right.getCenterYInScene() - left.getCenterYInScene();
          let distance = Math.hypot(dx, dy);
          if (distance >= minimumDistance) continue;
          if (distance <= 0.001) {
            const angle = (leftIndex * 2.17 + rightIndex * 0.91) % (Math.PI * 2);
            dx = Math.cos(angle);
            dy = Math.sin(angle);
            distance = 1;
          }
          const correction = (minimumDistance - distance) * 0.5 + 0.5;
          const normalX = dx / distance;
          const normalY = dy / distance;
          moveObjectToCenter(
            left,
            left.getCenterXInScene() - normalX * correction,
            left.getCenterYInScene() - normalY * correction
          );
          moveObjectToCenter(
            right,
            right.getCenterXInScene() + normalX * correction,
            right.getCenterYInScene() + normalY * correction
          );
          movedEnemies.add(left);
          movedEnemies.add(right);
          corrected = true;
        }
      }
      if (!corrected) break;
    }

    // Before the first orb, enemies are layout actors rather than valid
    // contacts. Pair separation must never push one into a waiting player and
    // trigger a cascade of immediate absorptions/growth behind the intro text.
    const sceneState = ensureSceneState(runtimeScene, getCurrentLevel(runtimeScene));
    if (!sceneState.firstOrbFired) {
      for (const player of runtimeScene.getObjects("Player")) {
        if (!player || player.getWidth?.() <= 1 || player.getHeight?.() <= 1) continue;
        const playerRadius = Math.max(player.getWidth(), player.getHeight()) * 0.5;
        for (let enemyIndex = 0; enemyIndex < enemies.length; enemyIndex++) {
          const enemy = enemies[enemyIndex];
          const enemyRadius = Math.min(enemy.getWidth(), enemy.getHeight()) * 0.5;
          const minimumDistance = playerRadius + enemyRadius + 6;
          let dx = enemy.getCenterXInScene() - player.getCenterXInScene();
          let dy = enemy.getCenterYInScene() - player.getCenterYInScene();
          let distance = Math.hypot(dx, dy);
          if (distance >= minimumDistance) continue;
          if (distance <= 0.001) {
            const angle = (enemyIndex * 2.399963229728653) % (Math.PI * 2);
            dx = Math.cos(angle);
            dy = Math.sin(angle);
            distance = 1;
          }
          const correction = minimumDistance - distance;
          moveObjectToCenter(
            enemy,
            enemy.getCenterXInScene() + (dx / distance) * correction,
            enemy.getCenterYInScene() + (dy / distance) * correction
          );
          movedEnemies.add(enemy);
        }
      }
    }

    for (const enemy of enemies) {
      // SetTransform wakes a Box2D body. Only bodies moved by this correction
      // pass need a transform sync; waking every boss and enemy every frame
      // disturbed their authored/controller velocity and looked like aimless
      // bouncing even when no overlap correction occurred.
      if (movedEnemies.has(enemy)) syncPhysicsBodyToObjectTransform(enemy);
      const image = enemy.__headSpaceImageCompanion;
      const validImages = enemy.getName?.() === "SmartEnemy"
        ? runtimeScene.getObjects("SmartEnemyImage")
        : runtimeScene.getObjects("EnemyImage");
      if (image && validImages.includes(image)) {
        moveObjectToCenter(image, enemy.getCenterXInScene(), enemy.getCenterYInScene());
      }
    }
  }

  function clampWithinRange(value, min, max) {
    if (min <= max) return clamp(value, min, max);
    return (min + max) * 0.5;
  }

  function clearObjectMotion(object) {
    if (!object?.hasBehavior || !object.hasBehavior("Physics2")) return;

    const physics = object.getBehavior("Physics2");
    if (physics.setLinearVelocityX) physics.setLinearVelocityX(0);
    if (physics.setLinearVelocityY) physics.setLinearVelocityY(0);
    if (physics.setAngularVelocity) physics.setAngularVelocity(0);
  }

  function getWallsShapeCenter(runtimeScene) {
    const bounds = getSceneObjectBounds(runtimeScene, ["Walls"]);
    if (!bounds) return null;

    return {
      x: (bounds.minX + bounds.maxX) * 0.5,
      y: (bounds.minY + bounds.maxY) * 0.5,
    };
  }

  function getLevelSixPrimaryPlanet(runtimeScene, createIfMissing = false) {
    if (!runtimeScene) return null;

    let planet = runtimeScene.getObjects("Planet_4")[0] || runtimeScene.getObjects("Planet_6")[0] || null;
    if (!planet && createIfMissing) {
      planet = createSceneObject(runtimeScene, "Planet_4", "");
    }
    return planet;
  }

  function getLevelSixPlanetCoreRadius(runtimeScene, planet = null) {
    const effectivePlanet = planet || getLevelSixPrimaryPlanet(runtimeScene, false);
    if (!effectivePlanet) return 168;

    const bounds = getSceneObjectBounds(runtimeScene, ["Walls"]);
    const arenaSpan = bounds ? Math.min(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) : 960;
    const spriteRadius = getApproxObjectRadius(effectivePlanet, 24);
    return clamp(
      spriteRadius * LEVEL_SIX_PRIMARY_PLANET_VISUAL_RADIUS_RATIO,
      132,
      Math.max(228, arenaSpan * 0.42)
    );
  }

  function getLevelSixBossPlanetAvoidance(runtimeScene, smartEnemy, target, state) {
    if (!runtimeScene || !smartEnemy || getCurrentLevel(runtimeScene) !== 6) return null;

    const planet = getLevelSixPrimaryPlanet(runtimeScene, false);
    if (!planet) return null;

    const sx = smartEnemy.getCenterXInScene();
    const sy = smartEnemy.getCenterYInScene();
    const planetX = planet.getCenterXInScene();
    const planetY = planet.getCenterYInScene();
    const bossRadius = getApproxObjectRadius(smartEnemy, 30);
    const planetRadius = getLevelSixPlanetCoreRadius(runtimeScene, planet);
    const keepOutRadius = planetRadius + bossRadius + LEVEL_SIX_BOSS_PLANET_ROUTE_CLEARANCE;
    const routeRadius = keepOutRadius + Math.max(LEVEL_SIX_BOSS_PLANET_ROUTE_BUFFER, bossRadius * 0.9);
    let radialX = sx - planetX;
    let radialY = sy - planetY;
    let distance = Math.hypot(radialX, radialY);
    if (distance <= 0.001) {
      radialX = 0;
      radialY = 1;
      distance = 1;
    } else {
      radialX /= distance;
      radialY /= distance;
    }

    const clearance = distance - keepOutRadius;
    const velocity = getObjectVelocity(smartEnemy);
    const radialVelocity = velocity.x * radialX + velocity.y * radialY;
    let routeBlocked = false;
    let targetCross = 0;

    if (target && isObjectInScene(runtimeScene, target)) {
      const targetX = target.getCenterXInScene();
      const targetY = target.getCenterYInScene();
      const pathX = targetX - sx;
      const pathY = targetY - sy;
      const pathLengthSq = pathX * pathX + pathY * pathY;
      if (pathLengthSq > 1) {
        const routeT = clamp(((planetX - sx) * pathX + (planetY - sy) * pathY) / pathLengthSq, 0, 1);
        const closestX = sx + pathX * routeT;
        const closestY = sy + pathY * routeT;
        const routeDistance = Math.hypot(closestX - planetX, closestY - planetY);
        routeBlocked =
          routeT > 0.03 &&
          routeT < 0.97 &&
          routeDistance < keepOutRadius + LEVEL_SIX_BOSS_PLANET_CONTACT_CLEARANCE;

        const targetRadius = Math.max(1, Math.hypot(targetX - planetX, targetY - planetY));
        const targetRadialX = (targetX - planetX) / targetRadius;
        const targetRadialY = (targetY - planetY) / targetRadius;
        targetCross = radialX * targetRadialY - radialY * targetRadialX;
      }
    }

    const contactActive = clearance <= LEVEL_SIX_BOSS_PLANET_CONTACT_CLEARANCE;
    const inwardPressureActive = clearance <= 88 && radialVelocity < -Math.max(18, velocity.speed * 0.12);
    const active = distance < routeRadius && (routeBlocked || contactActive || inwardPressureActive);

    if (!active) {
      if (state && distance > routeRadius + 70) state.levelSixBossPlanetRouteDirection = 0;
      return {
        active: false,
        contactActive: false,
        routeBlocked: false,
        clearance,
        keepOutRadius,
        radialX,
        radialY,
        forceX: 0,
        forceY: 0,
      };
    }

    let routeDirection = Number(state?.levelSixBossPlanetRouteDirection) || 0;
    if (routeDirection !== -1 && routeDirection !== 1) {
      if (Math.abs(targetCross) > 0.06) {
        routeDirection = targetCross > 0 ? 1 : -1;
      } else {
        const tangentialVelocity = velocity.x * -radialY + velocity.y * radialX;
        if (Math.abs(tangentialVelocity) > 8) {
          routeDirection = tangentialVelocity >= 0 ? 1 : -1;
        } else {
          const uniqueId = typeof smartEnemy.getUniqueId === "function" ? smartEnemy.getUniqueId() : 0;
          routeDirection = uniqueId % 2 === 0 ? 1 : -1;
        }
      }
      if (state) state.levelSixBossPlanetRouteDirection = routeDirection;
    }

    const tangentX = -radialY * routeDirection;
    const tangentY = radialX * routeDirection;
    const proximity = clamp(1 - Math.max(0, clearance) / Math.max(1, routeRadius - keepOutRadius), 0, 1);
    const contactFactor = clamp(
      1 - clearance / Math.max(1, LEVEL_SIX_BOSS_PLANET_CONTACT_CLEARANCE),
      0,
      1.6
    );
    const outwardWeight = (routeBlocked ? 0.82 : 0.54) + proximity * 0.92 + contactFactor * 0.78;
    const tangentWeight = routeBlocked ? 1.18 + proximity * 0.68 : contactActive ? 0.94 : 0.34;

    return {
      active: true,
      contactActive,
      routeBlocked,
      clearance,
      keepOutRadius,
      radialX,
      radialY,
      forceX: radialX * outwardWeight + tangentX * tangentWeight,
      forceY: radialY * outwardWeight + tangentY * tangentWeight,
    };
  }

  function releaseLevelSixBossFromPlanet(smartEnemy, physics, avoidance, velocity) {
    if (!smartEnemy || !physics || !avoidance) return;

    if (avoidance.clearance < 4) {
      const nudgeDistance = Math.min(
        LEVEL_SIX_BOSS_PLANET_RELEASE_NUDGE_MAX,
        Math.max(0, 10 - avoidance.clearance)
      );
      if (nudgeDistance > 0) {
        moveObjectToCenter(
          smartEnemy,
          smartEnemy.getCenterXInScene() + avoidance.radialX * nudgeDistance,
          smartEnemy.getCenterYInScene() + avoidance.radialY * nudgeDistance
        );
      }
    }

    const radialVelocity = velocity.x * avoidance.radialX + velocity.y * avoidance.radialY;
    if (radialVelocity >= 0) return;
    if (physics.setLinearVelocityX) {
      physics.setLinearVelocityX(velocity.x - avoidance.radialX * radialVelocity);
    }
    if (physics.setLinearVelocityY) {
      physics.setLinearVelocityY(velocity.y - avoidance.radialY * radialVelocity);
    }
  }

  function getPlanetObjects(runtimeScene) {
    const planets = [];
    for (let i = 0; i < PLANET_NAMES.length; i++) {
      const objects = runtimeScene.getObjects(PLANET_NAMES[i]);
      for (let j = 0; j < objects.length; j++) planets.push(objects[j]);
    }
    return planets;
  }

  function getPlanetSpawnKeepOutRadius(runtimeScene, planet, object) {
    const level = getCurrentLevel(runtimeScene);
    const objectRadius = getApproxObjectRadius(object, 12);
    const primaryLevelSixPlanet = level === 6 ? getLevelSixPrimaryPlanet(runtimeScene, false) : null;
    const planetRadius =
      level === 6 && planet === primaryLevelSixPlanet
        ? getLevelSixPlanetCoreRadius(runtimeScene, planet)
        : getApproxObjectRadius(planet, 24);
    const clearance = level === 6 ? LEVEL_SIX_PLANET_START_CLEARANCE : 34;
    return planetRadius + objectRadius + clearance;
  }

  function getFallbackPlanetClearanceDirection(object, index) {
    const objectName = typeof object?.getName === "function" ? object.getName() : "";
    if (objectName === "Player") return { x: 0, y: -1 };
    if (objectName === "SmartEnemy") return { x: 0, y: 1 };

    const angle = index * 2.399963 + 0.35;
    return { x: Math.cos(angle), y: Math.sin(angle) };
  }

  function moveObjectOutOfPlanetStartOverlap(runtimeScene, object, planets, bounds, index) {
    if (!object || !planets.length) return false;

    let moved = false;
    const objectRadius = getApproxObjectRadius(object, 12);
    const minX = bounds.minX + objectRadius + 18;
    const maxX = bounds.maxX - objectRadius - 18;
    const minY = bounds.minY + objectRadius + 18;
    const maxY = bounds.maxY - objectRadius - 18;

    for (let i = 0; i < planets.length; i++) {
      const planet = planets[i];
      const keepOutRadius = getPlanetSpawnKeepOutRadius(runtimeScene, planet, object);
      let ox = object.getCenterXInScene();
      let oy = object.getCenterYInScene();
      const dx = ox - planet.getCenterXInScene();
      const dy = oy - planet.getCenterYInScene();
      const distance = Math.hypot(dx, dy);
      if (distance >= keepOutRadius) continue;

      const fallbackDirection = getFallbackPlanetClearanceDirection(object, index + i);
      const nx = distance > 0.001 ? dx / distance : fallbackDirection.x;
      const ny = distance > 0.001 ? dy / distance : fallbackDirection.y;
      ox = planet.getCenterXInScene() + nx * keepOutRadius;
      oy = planet.getCenterYInScene() + ny * keepOutRadius;
      moveObjectToCenter(object, clampWithinRange(ox, minX, maxX), clampWithinRange(oy, minY, maxY));
      clearObjectMotion(object);
      moved = true;
    }

    return moved;
  }

  function ensurePlanetSpawnClearance(runtimeScene, level, state) {
    if (!isPlayableLevel(level) || !state || state.planetSpawnClearanceApplied) return;

    const planets = getPlanetObjects(runtimeScene);
    if (!planets.length) {
      state.planetSpawnClearanceApplied = true;
      return;
    }

    const referenceObject =
      runtimeScene.getObjects("Player")[0] ||
      runtimeScene.getObjects("SmartEnemy")[0] ||
      runtimeScene.getObjects("Enemy")[0] ||
      planets[0];
    const bounds = getBossSpawnBounds(runtimeScene, referenceObject);
    const actors = [];
    for (const objectName of ["Player", "SmartEnemy", "Enemy"]) {
      const objects = runtimeScene.getObjects(objectName);
      for (let i = 0; i < objects.length; i++) actors.push(objects[i]);
    }

    for (let i = 0; i < actors.length; i++) {
      moveObjectOutOfPlanetStartOverlap(runtimeScene, actors[i], planets, bounds, i);
    }

    state.planetSpawnClearanceApplied = true;
  }

  function createLevelSixMoonLightObstacle(runtimeScene) {
    if (
      typeof gdjs.LightObstacleRuntimeBehavior !== "function" ||
      typeof gdjs.Polygon !== "function"
    ) {
      return null;
    }

    const polygon = new gdjs.Polygon();
    polygon.vertices = Array.from({ length: 32 }, () => [0, 0]);
    const aabb = { min: [0, 0], max: [0, 0] };
    const owner = {
      centerX: 0,
      centerY: 0,
      radius: 1,
      getX() {
        return this.centerX - this.radius;
      },
      getY() {
        return this.centerY - this.radius;
      },
      getWidth() {
        return this.radius * 2;
      },
      getHeight() {
        return this.radius * 2;
      },
      getAABB() {
        aabb.min[0] = this.centerX - this.radius;
        aabb.min[1] = this.centerY - this.radius;
        aabb.max[0] = this.centerX + this.radius;
        aabb.max[1] = this.centerY + this.radius;
        return aabb;
      },
      getHitBoxesAround() {
        return [polygon];
      },
    };
    const behavior = new gdjs.LightObstacleRuntimeBehavior(
      runtimeScene,
      { name: "HeadSpaceMoonLightObstacle", type: "Lighting::LightObstacleBehavior" },
      owner
    );
    return { owner, polygon, behavior };
  }

  function updateLevelSixMoonLightObstacle(proxy, x, y, radius, runtimeScene) {
    if (!proxy) return;

    proxy.owner.centerX = x;
    proxy.owner.centerY = y;
    proxy.owner.radius = Math.max(1, radius);
    for (let i = 0; i < proxy.polygon.vertices.length; i++) {
      const angle = (i / proxy.polygon.vertices.length) * Math.PI * 2;
      proxy.polygon.vertices[i][0] = x + Math.cos(angle) * proxy.owner.radius;
      proxy.polygon.vertices[i][1] = y + Math.sin(angle) * proxy.owner.radius;
    }
    proxy.behavior.doStepPreEvents(runtimeScene);
  }

  function clearPlayerCollisionRipples(runtimeScene) {
    const rippleState = playerCollisionRippleState.get(runtimeScene);
    if (!rippleState) return;

    for (let i = 0; i < rippleState.ripples.length; i++) {
      const graphics = rippleState.ripples[i].graphics;
      if (graphics?.parent) graphics.parent.removeChild(graphics);
      if (graphics?.destroy) graphics.destroy();
    }
    playerCollisionRippleState.delete(runtimeScene);
  }

  function getPlayerCollisionRippleState(runtimeScene) {
    let rippleState = playerCollisionRippleState.get(runtimeScene);
    if (rippleState) return rippleState;

    rippleState = {
      ripples: [],
      touchingSurfaceKeys: new Set(),
      lastRippleAtBySurface: new Map(),
    };
    playerCollisionRippleState.set(runtimeScene, rippleState);
    return rippleState;
  }

  function spawnPlayerCollisionRipple(
    runtimeScene,
    surface,
    x,
    y,
    contactAngle,
    nowSeconds,
    layerNameOverride = null,
    zOrderOverride = null
  ) {
    if (typeof PIXI === "undefined" || typeof PIXI.Graphics !== "function") return;

    const layerName =
      layerNameOverride !== null
        ? layerNameOverride
        : surface && typeof surface.getLayer === "function"
          ? surface.getLayer()
          : "";
    const layer = runtimeScene.getLayer(layerName) || runtimeScene.getLayer("");
    const layerRenderer = layer?.getRenderer?.();
    if (!layerRenderer) return;

    const graphics = new PIXI.Graphics();
    graphics.position.set(x, y);
    graphics.rotation = contactAngle + Math.PI * 0.5;
    graphics.scale.set(1, 0.42);
    graphics.blendMode = PIXI.BLEND_MODES.ADD;
    const surfaceZOrder =
      Number.isFinite(zOrderOverride)
        ? zOrderOverride
        : surface && typeof surface.getZOrder === "function"
          ? surface.getZOrder()
          : 0;
    layerRenderer.addRendererObject(graphics, surfaceZOrder + 1.8);

    const rippleState = getPlayerCollisionRippleState(runtimeScene);
    while (rippleState.ripples.length >= COLLISION_RIPPLE_MAX_ACTIVE) {
      const oldest = rippleState.ripples.shift();
      if (oldest?.graphics?.parent) oldest.graphics.parent.removeChild(oldest.graphics);
      if (oldest?.graphics?.destroy) oldest.graphics.destroy();
    }
    rippleState.ripples.push({ graphics, startedAtSeconds: nowSeconds });
  }

  function updatePlayerCollisionRippleGraphics(rippleState, nowSeconds) {
    for (let i = rippleState.ripples.length - 1; i >= 0; i--) {
      const ripple = rippleState.ripples[i];
      const progress = clamp(
        (nowSeconds - ripple.startedAtSeconds) / COLLISION_RIPPLE_DURATION_SECONDS,
        0,
        1
      );
      if (progress >= 1) {
        if (ripple.graphics.parent) ripple.graphics.parent.removeChild(ripple.graphics);
        ripple.graphics.destroy();
        rippleState.ripples.splice(i, 1);
        continue;
      }

      const easedProgress = 1 - Math.pow(1 - progress, 2);
      const radius =
        COLLISION_RIPPLE_START_RADIUS +
        (COLLISION_RIPPLE_END_RADIUS - COLLISION_RIPPLE_START_RADIUS) * easedProgress;
      const alpha = Math.pow(1 - progress, 1.45);
      ripple.graphics.clear();
      ripple.graphics.lineStyle(Math.max(1.5, 6 - progress * 3.5), 0x73f8ff, alpha * 0.95);
      ripple.graphics.drawCircle(0, 0, radius);
      ripple.graphics.lineStyle(Math.max(1, 3.5 - progress * 2), 0xff62d8, alpha * 0.72);
      ripple.graphics.drawCircle(0, 0, radius * 0.68);
      ripple.graphics.lineStyle(Math.max(1, 2.5 - progress), 0xffffff, alpha * 0.55);
      ripple.graphics.drawCircle(0, 0, radius * 0.38);
    }
  }

  function getCollisionRippleSurfaceKey(prefix, surface, fallbackIndex) {
    const id = surface && typeof surface.getUniqueId === "function" ? surface.getUniqueId() : fallbackIndex;
    return `${prefix}:${id}`;
  }

  function playPlanetCollisionSound(runtimeScene) {
    try {
      gdjs.evtTools.sound.playSoundOnChannel(
        runtimeScene,
        PLANET_COLLISION_SOUND,
        PLANET_COLLISION_SOUND_CHANNEL,
        false,
        PLANET_COLLISION_SOUND_VOLUME,
        1
      );
    } catch {
      // Audio can remain locked until the browser receives its first user gesture.
    }
  }

  function registerPlayerCollisionRippleContact(
    runtimeScene,
    rippleState,
    currentSurfaceKeys,
    surfaceKey,
    surface,
    contactX,
    contactY,
    contactAngle,
    inwardVelocity,
    nowSeconds,
    layerNameOverride = null,
    zOrderOverride = null
  ) {
    currentSurfaceKeys.add(surfaceKey);
    const wasTouching = rippleState.touchingSurfaceKeys.has(surfaceKey);
    const lastRippleAt = rippleState.lastRippleAtBySurface.get(surfaceKey) ?? -Infinity;
    const canRepeat =
      nowSeconds - lastRippleAt >= COLLISION_RIPPLE_COOLDOWN_SECONDS &&
      inwardVelocity < -COLLISION_RIPPLE_REPEAT_IMPACT_SPEED;
    if (wasTouching && !canRepeat) return false;

    spawnPlayerCollisionRipple(
      runtimeScene,
      surface,
      contactX,
      contactY,
      contactAngle,
      nowSeconds,
      layerNameOverride,
      zOrderOverride
    );
    rippleState.lastRippleAtBySurface.set(surfaceKey, nowSeconds);
    return true;
  }

  function updatePlayerCollisionRippleEffect(runtimeScene) {
    const rippleState = getPlayerCollisionRippleState(runtimeScene);
    const nowSeconds = performance.now() / 1000;
    updatePlayerCollisionRippleGraphics(rippleState, nowSeconds);

    if (
      getSceneBoolean(runtimeScene, "Paused") ||
      getSceneBoolean(runtimeScene, "LevelWon") ||
      getSceneBoolean(runtimeScene, "LevelLost")
    ) {
      return;
    }

    const player = runtimeScene.getObjects("Player")[0] || null;
    if (!player) {
      rippleState.touchingSurfaceKeys.clear();
      return;
    }

    const playerRadius = getApproxObjectRadius(player, 20);
    const velocity = getObjectVelocity(player);
    const playerX = player.getCenterXInScene();
    const playerY = player.getCenterYInScene();
    const currentSurfaceKeys = new Set();
    const level = getCurrentLevel(runtimeScene);
    const primaryLevelSixPlanet = level === 6 ? getLevelSixPrimaryPlanet(runtimeScene, false) : null;
    const levelSevenSystem = level === 7 ? levelSevenPlanetSystemState.get(runtimeScene) : null;
    const planets = getPlanetObjects(runtimeScene);

    for (let i = 0; i < planets.length; i++) {
      const planet = planets[i];
      const planetX = planet.getCenterXInScene();
      const planetY = planet.getCenterYInScene();
      let dx = playerX - planetX;
      let dy = playerY - planetY;
      let distance = Math.hypot(dx, dy);
      if (distance <= 0.001) {
        dx = 0;
        dy = -1;
        distance = 1;
      }
      const normalX = dx / distance;
      const normalY = dy / distance;
      const planetRadius =
        level === 6 && planet === primaryLevelSixPlanet
          ? getLevelSixPlanetCoreRadius(runtimeScene, planet) + LEVEL_SIX_PRIMARY_PLANET_COLLISION_PADDING
          : level === 7 && levelSevenSystem && planet === levelSevenSystem.primary
            ? levelSevenSystem.primaryRadius
          : getApproxObjectRadius(planet, 24);
      if (distance > planetRadius + playerRadius + COLLISION_RIPPLE_CONTACT_MARGIN) continue;

      registerPlayerCollisionRippleContact(
        runtimeScene,
        rippleState,
        currentSurfaceKeys,
        getCollisionRippleSurfaceKey("planet", planet, i),
        planet,
        planetX + normalX * planetRadius,
        planetY + normalY * planetRadius,
        Math.atan2(normalY, normalX),
        velocity.x * normalX + velocity.y * normalY,
        nowSeconds
      );
    }

    // Declarative multiplayer planets are PIXI bodies rather than authored
    // GDevelop Planet_* objects, so include their collision proxies explicitly.
    // Without this bridge their physical collision resolves correctly but the
    // contact never reaches the ripple and impact-sound system.
    const sharedPlanets = runtimeScene.__headSpaceSharedDeclarativeMultiplayerSystem?.planets || [];
    for (let i = 0; i < sharedPlanets.length; i++) {
      const body = sharedPlanets[i];
      if (!body?.sprite?.visible || !(body.radius > 0)) continue;
      let dx = playerX - body.x;
      let dy = playerY - body.y;
      let distance = Math.hypot(dx, dy);
      if (distance <= 0.001) {
        dx = 0;
        dy = -1;
        distance = 1;
      }
      const normalX = dx / distance;
      const normalY = dy / distance;
      if (distance > body.radius + playerRadius + COLLISION_RIPPLE_CONTACT_MARGIN) continue;

      const didRipple = registerPlayerCollisionRippleContact(
        runtimeScene,
        rippleState,
        currentSurfaceKeys,
        `shared-planet:${body.key || i}`,
        null,
        body.x + normalX * body.radius,
        body.y + normalY * body.radius,
        Math.atan2(normalY, normalX),
        (velocity.x - (body.velocityX || 0)) * normalX +
          (velocity.y - (body.velocityY || 0)) * normalY,
        nowSeconds,
        runtimeScene.__headSpaceSharedDeclarativeMultiplayerSystem.layerName || "",
        Number(body.sprite.zIndex) || 2
      );
      if (didRipple) playPlanetCollisionSound(runtimeScene);
    }

    const secondaryLevelSevenPlanet = levelSevenSystem?.secondary || null;
    if (secondaryLevelSevenPlanet?.sprite?.visible) {
      let dx = playerX - secondaryLevelSevenPlanet.sprite.position.x;
      let dy = playerY - secondaryLevelSevenPlanet.sprite.position.y;
      let distance = Math.hypot(dx, dy);
      if (distance <= 0.001) {
        dx = 0;
        dy = -1;
        distance = 1;
      }
      const normalX = dx / distance;
      const normalY = dy / distance;
      if (
        distance <=
        secondaryLevelSevenPlanet.radius + playerRadius + COLLISION_RIPPLE_CONTACT_MARGIN
      ) {
        const collisionStarted = registerPlayerCollisionRippleContact(
          runtimeScene,
          rippleState,
          currentSurfaceKeys,
          "level-seven-planet:planet12",
          null,
          secondaryLevelSevenPlanet.sprite.position.x + normalX * secondaryLevelSevenPlanet.radius,
          secondaryLevelSevenPlanet.sprite.position.y + normalY * secondaryLevelSevenPlanet.radius,
          Math.atan2(normalY, normalX),
          velocity.x * normalX + velocity.y * normalY,
          nowSeconds,
          secondaryLevelSevenPlanet.layerName,
          secondaryLevelSevenPlanet.zOrder
        );
        if (collisionStarted) playPlanetCollisionSound(runtimeScene);
      }
    }

    const moonSprites = levelSixMoonSprites.get(runtimeScene) || [];
    for (let i = 0; i < moonSprites.length; i++) {
      const moon = moonSprites[i];
      if (!moon?.visible) continue;

      const config = LEVEL_SIX_MOON_CONFIGS[i];
      const moonRadius = config.size * LEVEL_SIX_MOON_VISUAL_RADIUS_RATIO;
      let dx = playerX - moon.position.x;
      let dy = playerY - moon.position.y;
      let distance = Math.hypot(dx, dy);
      if (distance <= 0.001) {
        const fallbackAngle = i * 2.1 + 0.4;
        dx = Math.cos(fallbackAngle);
        dy = Math.sin(fallbackAngle);
        distance = 1;
      }
      const normalX = dx / distance;
      const normalY = dy / distance;
      const contactDistance = moonRadius + playerRadius + LEVEL_SIX_MOON_COLLISION_PADDING;
      if (distance > contactDistance + COLLISION_RIPPLE_CONTACT_MARGIN) continue;

      const collisionStarted = registerPlayerCollisionRippleContact(
        runtimeScene,
        rippleState,
        currentSurfaceKeys,
        `moon:${i}`,
        null,
        moon.position.x + normalX * moonRadius,
        moon.position.y + normalY * moonRadius,
        Math.atan2(normalY, normalX),
        velocity.x * normalX + velocity.y * normalY,
        nowSeconds,
        moon.__headSpaceRippleLayerName || "",
        Number.isFinite(moon.__headSpaceRippleZOrder) ? moon.__headSpaceRippleZOrder : 0
      );
    }

    const levelSevenMoons = levelSevenSystem?.moons || [];
    for (let i = 0; i < levelSevenMoons.length; i++) {
      const moon = levelSevenMoons[i];
      let dx = playerX - moon.sprite.position.x;
      let dy = playerY - moon.sprite.position.y;
      let distance = Math.hypot(dx, dy);
      if (distance <= 0.001) {
        const fallbackAngle = i * 2.23 + 0.55;
        dx = Math.cos(fallbackAngle);
        dy = Math.sin(fallbackAngle);
        distance = 1;
      }
      const normalX = dx / distance;
      const normalY = dy / distance;
      const contactDistance = moon.radius + playerRadius + LEVEL_SEVEN_PLANET_COLLISION_PADDING;
      if (distance > contactDistance + COLLISION_RIPPLE_CONTACT_MARGIN) continue;

      registerPlayerCollisionRippleContact(
        runtimeScene,
        rippleState,
        currentSurfaceKeys,
        `level-seven-moon:${moon.config.key}`,
        null,
        moon.sprite.position.x + normalX * moon.radius,
        moon.sprite.position.y + normalY * moon.radius,
        Math.atan2(normalY, normalX),
        (velocity.x - moon.velocityX) * normalX + (velocity.y - moon.velocityY) * normalY,
        nowSeconds,
        moon.layerName,
        moon.zOrder
      );
    }

    const levelNinePlanets =
      level === 9 ? levelNineBlackHoleSystemState.get(runtimeScene)?.planets || [] : [];
    for (let i = 0; i < levelNinePlanets.length; i++) {
      const planet = levelNinePlanets[i];
      let dx = playerX - planet.sprite.position.x;
      let dy = playerY - planet.sprite.position.y;
      let distance = Math.hypot(dx, dy);
      if (distance <= 0.001) {
        const fallbackAngle = i * 2.07 + 0.48;
        dx = Math.cos(fallbackAngle);
        dy = Math.sin(fallbackAngle);
        distance = 1;
      }
      const normalX = dx / distance;
      const normalY = dy / distance;
      const contactDistance =
        planet.radius + playerRadius + LEVEL_NINE_SMALL_PLANET_COLLISION_PADDING;
      if (distance > contactDistance + COLLISION_RIPPLE_CONTACT_MARGIN) continue;

      registerPlayerCollisionRippleContact(
        runtimeScene,
        rippleState,
        currentSurfaceKeys,
        `level-nine-planet:${planet.config.key}`,
        null,
        planet.sprite.position.x + normalX * planet.radius,
        planet.sprite.position.y + normalY * planet.radius,
        Math.atan2(normalY, normalX),
        velocity.x * normalX + velocity.y * normalY,
        nowSeconds,
        planet.layerName,
        planet.zOrder
      );
      if (collisionStarted) playPlanetCollisionSound(runtimeScene);
    }

    const levelTenBodies = usesLevelTenRuntime(runtimeScene, level)
      ? levelTenSolarSystemState.get(runtimeScene)?.bodies || []
      : [];
    for (let i = 0; i < levelTenBodies.length; i++) {
      const body = levelTenBodies[i];
      let dx = playerX - body.x;
      let dy = playerY - body.y;
      let distance = Math.hypot(dx, dy);
      if (distance <= 0.001) {
        const fallbackAngle = i * 2.19 + 0.31;
        dx = Math.cos(fallbackAngle);
        dy = Math.sin(fallbackAngle);
        distance = 1;
      }
      const normalX = dx / distance;
      const normalY = dy / distance;
      const contactDistance =
        body.radius + playerRadius + LEVEL_TEN_SOLAR_COLLISION_PADDING;
      if (distance > contactDistance + COLLISION_RIPPLE_CONTACT_MARGIN) continue;

      const collisionStarted = registerPlayerCollisionRippleContact(
        runtimeScene,
        rippleState,
        currentSurfaceKeys,
        `level-ten-body:${body.key}`,
        null,
        body.x + normalX * body.radius,
        body.y + normalY * body.radius,
        Math.atan2(normalY, normalX),
        (velocity.x - body.velocityX) * normalX +
          (velocity.y - body.velocityY) * normalY,
        nowSeconds,
        body.layerName,
        body.zOrder
      );
      if (collisionStarted) playPlanetCollisionSound(runtimeScene);
    }

    const levelFourBodies =
      level === 4 && isMultiplayerGame(runtimeScene, level)
        ? (() => {
            const system = multiplayerLevelFourHoneycombState.get(runtimeScene);
            return system
              ? [...(system.planets || []), ...(system.stations || [])]
              : [];
          })()
        : [];
    for (let i = 0; i < levelFourBodies.length; i++) {
      const body = levelFourBodies[i];
      let dx = playerX - body.x;
      let dy = playerY - body.y;
      let distance = Math.hypot(dx, dy);
      if (distance <= 0.001) {
        const fallbackAngle = i * 2.17 + 0.43;
        dx = Math.cos(fallbackAngle);
        dy = Math.sin(fallbackAngle);
        distance = 1;
      }
      const normalX = dx / distance;
      const normalY = dy / distance;
      if (
        distance >
        body.radius + playerRadius + COLLISION_RIPPLE_CONTACT_MARGIN
      ) continue;
      const collisionStarted = registerPlayerCollisionRippleContact(
        runtimeScene,
        rippleState,
        currentSurfaceKeys,
        `multiplayer-level-four-body:${body.key || i}`,
        null,
        body.x + normalX * body.radius,
        body.y + normalY * body.radius,
        Math.atan2(normalY, normalX),
        (velocity.x - (body.velocityX || 0)) * normalX +
          (velocity.y - (body.velocityY || 0)) * normalY,
        nowSeconds,
        body.layerName || "",
        Number.isFinite(body.zOrder) ? body.zOrder : 2
      );
      if (collisionStarted) playPlanetCollisionSound(runtimeScene);
    }

    rippleState.touchingSurfaceKeys = currentSurfaceKeys;
  }

  function clearLevelSixMoonSprites(runtimeScene) {
    const moonSprites = levelSixMoonSprites.get(runtimeScene);
    if (!moonSprites) return;

    for (let i = 0; i < moonSprites.length; i++) {
      const sprite = moonSprites[i];
      if (!sprite) continue;
      if (sprite.__headSpaceLightObstacle?.behavior?.onDestroy) {
        sprite.__headSpaceLightObstacle.behavior.onDestroy();
      }
      if (sprite.parent) sprite.parent.removeChild(sprite);
      if (typeof sprite.destroy === "function") {
        sprite.destroy({ children: false, texture: false, baseTexture: false });
      }
    }
    levelSixMoonSprites.delete(runtimeScene);
  }

  function ensureLevelSixMoonSprites(runtimeScene, planet) {
    let moonSprites = levelSixMoonSprites.get(runtimeScene);
    if (moonSprites?.length === LEVEL_SIX_MOON_CONFIGS.length) return moonSprites;
    if (typeof PIXI === "undefined") return [];

    clearLevelSixMoonSprites(runtimeScene);
    const layer = runtimeScene.getLayer(planet.getLayer ? planet.getLayer() : "") || runtimeScene.getLayer("");
    const layerRenderer = layer?.getRenderer ? layer.getRenderer() : null;
    const imageManager = runtimeScene.getGame?.().getImageManager?.();
    if (!layerRenderer || !imageManager) return [];

    moonSprites = [];
    for (let i = 0; i < LEVEL_SIX_MOON_CONFIGS.length; i++) {
      const config = LEVEL_SIX_MOON_CONFIGS[i];
      const texture = imageManager.getOrLoadPIXITexture
        ? imageManager.getOrLoadPIXITexture(config.resourceName)
        : imageManager.getPIXITexture(config.resourceName);
      const sprite = new PIXI.Sprite(texture);
      if (sprite.anchor?.set) sprite.anchor.set(0.5);
      sprite.width = config.size;
      sprite.height = config.size;
      sprite.eventMode = "none";
      sprite.__headSpaceLightObstacle = createLevelSixMoonLightObstacle(runtimeScene);
      sprite.__headSpaceRippleLayerName = planet.getLayer ? planet.getLayer() : "";
      sprite.__headSpaceRippleZOrder = (planet.getZOrder ? planet.getZOrder() : 0) + 0.25 + i * 0.02;
      layerRenderer.addRendererObject(sprite, sprite.__headSpaceRippleZOrder);
      moonSprites.push(sprite);
    }
    levelSixMoonSprites.set(runtimeScene, moonSprites);
    return moonSprites;
  }

  function updateLevelSixMoonSprites(runtimeScene, planet, wallsCenter) {
    const moonSprites = ensureLevelSixMoonSprites(runtimeScene, planet);
    if (!moonSprites.length) return;

    const referenceObject = runtimeScene.getObjects("Player")[0] || planet;
    const bounds = getBossSpawnBounds(runtimeScene, referenceObject);
    const planetX = planet.getCenterXInScene();
    const planetY = planet.getCenterYInScene();
    const planetRadius = getLevelSixPlanetCoreRadius(runtimeScene, planet);
    const elapsedSeconds = performance.now() / 1000;
    const maxCenterOrbit = Math.max(
      planetRadius + 72,
      Math.min(
        wallsCenter.x - bounds.minX,
        bounds.maxX - wallsCenter.x,
        wallsCenter.y - bounds.minY,
        bounds.maxY - wallsCenter.y
      ) - 34
    );

    for (let i = 0; i < moonSprites.length; i++) {
      const sprite = moonSprites[i];
      const config = LEVEL_SIX_MOON_CONFIGS[i];
      const moonRadius = config.size * 0.5;
      const minOrbit = planetRadius + moonRadius + 54;
      const maxOrbit = Math.max(minOrbit, maxCenterOrbit - moonRadius);
      const orbitRadius = minOrbit + (maxOrbit - minOrbit) * config.orbitFraction;
      const orbitAngle = config.phase + elapsedSeconds * config.orbitSpeed;
      sprite.position.set(
        planetX + Math.cos(orbitAngle) * orbitRadius,
        planetY + Math.sin(orbitAngle) * orbitRadius
      );
      sprite.rotation = elapsedSeconds * config.rotationSpeed;
      sprite.width = config.size;
      sprite.height = config.size;
      sprite.visible = true;
      updateLevelSixMoonLightObstacle(
        sprite.__headSpaceLightObstacle,
        sprite.position.x,
        sprite.position.y,
        config.size * LEVEL_SIX_MOON_VISUAL_RADIUS_RATIO,
        runtimeScene
      );
    }

    applyLevelSixMoonCollisions(runtimeScene, moonSprites);
  }

  function applyLevelSixMoonCollisions(runtimeScene, moonSprites) {
    if (
      getSceneBoolean(runtimeScene, "Paused") ||
      getSceneBoolean(runtimeScene, "LevelWon") ||
      getSceneBoolean(runtimeScene, "LevelLost")
    ) {
      return;
    }

    const actors = [];
    for (const objectName of ["Player", "Enemy", "SmartEnemy"]) {
      const objects = runtimeScene.getObjects(objectName);
      for (let i = 0; i < objects.length; i++) actors.push(objects[i]);
    }

    for (let moonIndex = 0; moonIndex < moonSprites.length; moonIndex++) {
      const moon = moonSprites[moonIndex];
      if (!moon?.visible) continue;
      const config = LEVEL_SIX_MOON_CONFIGS[moonIndex];
      const moonRadius = config.size * LEVEL_SIX_MOON_VISUAL_RADIUS_RATIO;

      for (let actorIndex = 0; actorIndex < actors.length; actorIndex++) {
        const actor = actors[actorIndex];
        if (!actor || actor.getWidth() <= 0) continue;

        const actorRadius = getApproxObjectRadius(actor, 12);
        const contactDistance = moonRadius + actorRadius + LEVEL_SIX_MOON_COLLISION_PADDING;
        let dx = actor.getCenterXInScene() - moon.position.x;
        let dy = actor.getCenterYInScene() - moon.position.y;
        let distance = Math.hypot(dx, dy);
        if (distance >= contactDistance) continue;

        if (distance <= 0.001) {
          const uniqueId = typeof actor.getUniqueId === "function" ? actor.getUniqueId() : actorIndex + 1;
          const fallbackAngle = (uniqueId * 0.83 + moonIndex * 2.11) % (Math.PI * 2);
          dx = Math.cos(fallbackAngle);
          dy = Math.sin(fallbackAngle);
          distance = 1;
        }

        const normalX = dx / distance;
        const normalY = dy / distance;
        moveObjectToCenter(
          actor,
          moon.position.x + normalX * (contactDistance + 2),
          moon.position.y + normalY * (contactDistance + 2)
        );

        if (!actor.hasBehavior || !actor.hasBehavior("Physics2")) continue;
        const physics = actor.getBehavior("Physics2");
        const velocity = getObjectVelocity(actor);
        const radialVelocity = velocity.x * normalX + velocity.y * normalY;
        const tangentVelocityX = velocity.x - normalX * radialVelocity;
        const tangentVelocityY = velocity.y - normalY * radialVelocity;
        const reflectedSpeed = radialVelocity < 0 ? -radialVelocity * LEVEL_SIX_MOON_RESTITUTION : radialVelocity;
        const outwardSpeed = clamp(
          Math.max(LEVEL_SIX_MOON_MIN_BOUNCE_SPEED, reflectedSpeed),
          LEVEL_SIX_MOON_MIN_BOUNCE_SPEED,
          LEVEL_SIX_MOON_MAX_BOUNCE_SPEED
        );
        if (physics.setLinearVelocityX) {
          physics.setLinearVelocityX(tangentVelocityX + normalX * outwardSpeed);
        }
        if (physics.setLinearVelocityY) {
          physics.setLinearVelocityY(tangentVelocityY + normalY * outwardSpeed);
        }
      }
    }
  }

  function updateLevelSixPlanet(runtimeScene) {
    if (getCurrentLevel(runtimeScene) !== 6) {
      clearLevelSixMoonSprites(runtimeScene);
      return;
    }

    const wallsCenter = getWallsShapeCenter(runtimeScene);
    if (!wallsCenter) return;

    const planet = getLevelSixPrimaryPlanet(runtimeScene, true);
    if (!planet) return;

    moveObjectToCenter(planet, wallsCenter.x, wallsCenter.y);
    if (planet.hasBehavior && planet.hasBehavior("Physics2")) {
      const physics = planet.getBehavior("Physics2");
      const visibleCoreRadius = getLevelSixPlanetCoreRadius(runtimeScene, planet);
      if (physics.setStatic) physics.setStatic();
      if (physics.setGravityScale) physics.setGravityScale(0);
      if (physics.setLinearVelocityX) physics.setLinearVelocityX(0);
      if (physics.setLinearVelocityY) physics.setLinearVelocityY(0);
      if (physics.setAngularVelocity) physics.setAngularVelocity(0);
      if (physics.setRestitution) physics.setRestitution(LEVEL_SIX_PRIMARY_PLANET_RESTITUTION);
      if (physics.setShapeScale) {
        physics.setShapeScale(
          (visibleCoreRadius + LEVEL_SIX_PRIMARY_PLANET_COLLISION_PADDING) /
            LEVEL_SIX_PRIMARY_PLANET_PHYSICS_BASE_RADIUS
        );
      }
    }
    if (typeof planet.rotate === "function") {
      planet.rotate(0.2, runtimeScene);
    } else if (typeof planet.setAngle === "function") {
      const currentAngle = typeof planet.getAngle === "function" ? planet.getAngle() : 0;
      planet.setAngle(currentAngle + 0.2);
    }
    updateLevelSixMoonSprites(runtimeScene, planet, wallsCenter);

    let light = runtimeScene.getObjects("Light2")[0] || null;
    if (!light) {
      light = createSceneObject(runtimeScene, "Light2", "Lighting");
      if (!light) return;
    }

    moveObjectToCenter(light, planet.getCenterXInScene(), planet.getCenterYInScene());
    if (typeof light.setZOrder === "function" && typeof planet.getZOrder === "function") {
      light.setZOrder(planet.getZOrder() + 1);
    }
  }

  function alignLevelEightPlanetCollisionMasks(runtimeScene) {
    if (!runtimeScene || getCurrentLevel(runtimeScene) !== 8) return;
    const walls = runtimeScene.getObjects("Walls").filter(
      (wall) => wall?.getCenterXInScene && wall?.getCenterYInScene
    );

    for (let configIndex = 0; configIndex < LEVEL_EIGHT_PLANET_COLLISION_CONFIGS.length; configIndex++) {
      const config = LEVEL_EIGHT_PLANET_COLLISION_CONFIGS[configIndex];
      const planets = runtimeScene.getObjects(config.objectName);
      for (let planetIndex = 0; planetIndex < planets.length; planetIndex++) {
        const planet = planets[planetIndex];
        if (!planet) continue;

        if (!planet.__headSpaceLevelEightSizeScaled && typeof planet.setSize === "function") {
          const centerX = planet.getCenterXInScene();
          const centerY = planet.getCenterYInScene();
          planet.__headSpaceLevelEightAuthoredCenterX = centerX;
          planet.__headSpaceLevelEightAuthoredCenterY = centerY;
          const originalWidth = Math.max(1, Number(planet.getWidth?.()) || 1);
          const originalHeight = Math.max(1, Number(planet.getHeight?.()) || 1);
          planet.setSize(
            originalWidth * LEVEL_EIGHT_PLANET_SIZE_SCALE,
            originalHeight * LEVEL_EIGHT_PLANET_SIZE_SCALE
          );
          moveObjectToCenter(planet, centerX, centerY);
          planet.__headSpaceLevelEightSizeScaled = true;
        }

        if (walls.length > 0) {
          const planetX = planet.getCenterXInScene();
          const planetY = planet.getCenterYInScene();
          let nearestWall = null;
          let nearestDistance = Infinity;
          for (let wallIndex = 0; wallIndex < walls.length; wallIndex++) {
            const wall = walls[wallIndex];
            const distance = Math.hypot(
              wall.getCenterXInScene() - planetX,
              wall.getCenterYInScene() - planetY
            );
            if (distance < nearestDistance) {
              nearestDistance = distance;
              nearestWall = wall;
            }
          }
          if (nearestWall) {
            // The wall objects themselves sit on the visible blue boundary.
            // Centering the planet on the nearest wall therefore gives the
            // intended half-inside, half-outside placement directly.
            moveObjectToCenter(
              planet,
              nearestWall.getCenterXInScene(),
              nearestWall.getCenterYInScene()
            );
            if (planet.hasBehavior && planet.hasBehavior("Physics2")) {
              const positionPhysics = planet.getBehavior("Physics2");
              const body = positionPhysics.getBody?.();
              if (body && positionPhysics.b2Vec2 && positionPhysics._sharedData) {
                const worldInvScale = positionPhysics._sharedData.worldInvScale;
                body.SetTransform(
                  positionPhysics.b2Vec2(
                    planet.getCenterXInScene() * worldInvScale,
                    planet.getCenterYInScene() * worldInvScale
                  ),
                  body.GetAngle()
                );
                body.SetAwake(true);
              }
            }
          }
        }

        if (!planet.hasBehavior || !planet.hasBehavior("Physics2")) continue;

        const width = Math.max(1, Number(planet.getWidth?.()) || 1);
        const height = Math.max(1, Number(planet.getHeight?.()) || 1);
        const radius = Math.min(width, height) * config.radiusRatio;
        const offsetX = width * config.offsetXRatio;
        const offsetY = height * config.offsetYRatio;
        const fixtureKey = `${radius.toFixed(4)}:${offsetX.toFixed(4)}:${offsetY.toFixed(4)}`;
        const physics = planet.getBehavior("Physics2");
        if (physics.__headSpaceLevelEightFixtureKey === fixtureKey) continue;

        physics.shapeDimensionA = radius;
        physics.shapeOffsetX = offsetX;
        physics.shapeOffsetY = offsetY;
        if (physics.getShapeScale?.() !== 1 && physics.setShapeScale) {
          physics.setShapeScale(1);
        } else if (physics.recreateShape) {
          physics.recreateShape();
        }
        physics.__headSpaceLevelEightFixtureKey = fixtureKey;
      }
    }
  }

  function getLevelSevenArenaBounds(runtimeScene) {
    const walls = runtimeScene.getObjects("Walls").slice();
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < walls.length; i++) {
      const wall = walls[i];
      if (!wall || typeof wall.getAABB !== "function") continue;
      const bounds = wall.getAABB();
      if (!bounds?.min || !bounds?.max) continue;
      minX = Math.min(minX, bounds.min[0]);
      minY = Math.min(minY, bounds.min[1]);
      maxX = Math.max(maxX, bounds.max[0]);
      maxY = Math.max(maxY, bounds.max[1]);
    }

    if ([minX, minY, maxX, maxY].every(Number.isFinite)) {
      return { minX, minY, maxX, maxY };
    }
    return getSceneObjectBounds(runtimeScene, ["Walls"]);
  }

  function retireAuthoredLevelSevenPlanet(runtimeScene) {
    const authoredPlanets = runtimeScene.getObjects("Planet_1");
    for (let i = 0; i < authoredPlanets.length; i++) {
      const planet = authoredPlanets[i];
      if (!planet || planet.__headSpaceLevelSevenOrbitalBody) continue;
      if (planet.hide) planet.hide(true);
      if (planet.setSize) planet.setSize(1, 1);
      moveObjectToCenter(planet, -100000, -100000);
      if (planet.hasBehavior && planet.hasBehavior("Physics2")) {
        const physics = planet.getBehavior("Physics2");
        if (physics.setStatic) physics.setStatic();
        if (physics.setShapeScale) physics.setShapeScale(0.001);
        if (physics.setLinearVelocityX) physics.setLinearVelocityX(0);
        if (physics.setLinearVelocityY) physics.setLinearVelocityY(0);
      }
      if (planet.deleteFromScene) planet.deleteFromScene();
    }
  }

  function removeLevelSevenRendererObject(runtimeScene, layerName, rendererObject, destroyTexture = false) {
    if (!rendererObject) return;

    const layer = runtimeScene.getLayer(layerName) || runtimeScene.getLayer("");
    const layerRenderer = layer?.getRenderer?.();
    if (layerRenderer?.removeRendererObject) {
      try {
        layerRenderer.removeRendererObject(rendererObject);
      } catch {
        // Fall back to direct parent removal below.
      }
    }
    if (rendererObject.parent) rendererObject.parent.removeChild(rendererObject);
    if (rendererObject.destroy && !rendererObject.destroyed) {
      rendererObject.destroy({
        children: false,
        texture: destroyTexture,
        baseTexture: destroyTexture,
      });
    }
  }

  function isLevelSevenPlanet12RendererObject(rendererObject) {
    if (!rendererObject) return false;
    if (rendererObject[LEVEL_SEVEN_PLANET12_RENDERER_MARKER]) return true;

    const texture = rendererObject.texture;
    const textureIds = [
      ...(texture?.textureCacheIds || []),
      ...(texture?.baseTexture?.textureCacheIds || []),
    ];
    const resourceUrl =
      texture?.baseTexture?.resource?.url ||
      texture?.baseTexture?.resource?.source?.src ||
      texture?.source?.resource?.url ||
      "";
    return [...textureIds, resourceUrl].some((value) =>
      String(value || "").toLowerCase().includes("planet12.png")
    );
  }

  function removeDuplicateLevelSevenPlanet12Sprites(runtimeScene, system) {
    const activeSprite = system?.secondary?.sprite || null;
    const layerName = system?.secondary?.layerName || "";
    const layer = runtimeScene.getLayer(layerName) || runtimeScene.getLayer("");
    const container = layer?.getRenderer?.()?.getRendererObject?.();
    if (!container?.children) return;

    const children = container.children.slice();
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child === activeSprite || !isLevelSevenPlanet12RendererObject(child)) continue;
      removeLevelSevenRendererObject(runtimeScene, layerName, child, false);
    }
  }

  function clearLevelSevenPlanetSystem(runtimeScene) {
    const system = levelSevenPlanetSystemState.get(runtimeScene);
    if (!system) return;

    for (let i = 0; i < system.moons.length; i++) {
      const moon = system.moons[i];
      if (moon.lightObstacle?.behavior?.onDestroy) moon.lightObstacle.behavior.onDestroy();
      removeLevelSevenRendererObject(runtimeScene, moon.layerName || "", moon.sprite, false);
    }
    if (system.primaryLightObstacle?.behavior?.onDestroy) {
      system.primaryLightObstacle.behavior.onDestroy();
    }
    if (system.secondary?.lightObstacle?.behavior?.onDestroy) {
      system.secondary.lightObstacle.behavior.onDestroy();
    }
    removeLevelSevenRendererObject(
      runtimeScene,
      system.secondary?.layerName || "",
      system.secondary?.sprite,
      false
    );
    for (const steadyLight of [system.primarySteadyLight, system.secondarySteadyLight]) {
      removeLevelSevenRendererObject(runtimeScene, system.secondary?.layerName || "", steadyLight, true);
    }
    if (system.secondaryLight?.deleteFromScene) system.secondaryLight.deleteFromScene();
    if (system.primaryLight) {
      if (system.primaryLightWasCreated && system.primaryLight.deleteFromScene) {
        system.primaryLight.deleteFromScene();
      } else {
        if (system.primaryLight.setColor) system.primaryLight.setColor("255;255;255");
        if (system.primaryLight.setRadius) system.primaryLight.setRadius(2000);
      }
    }
    if (system.primary) {
      if (system.primary.hide) system.primary.hide(true);
      if (system.primary.setSize) system.primary.setSize(1, 1);
      moveObjectToCenter(system.primary, -100000, -100000);
      if (system.primary.hasBehavior && system.primary.hasBehavior("Physics2")) {
        const physics = system.primary.getBehavior("Physics2");
        if (physics.setShapeScale) physics.setShapeScale(0.001);
      }
      if (system.primary.deleteFromScene) system.primary.deleteFromScene();
    }
    levelSevenPlanetSystemState.delete(runtimeScene);
  }

  function createLevelSevenMoonCollisionProxy(moon, index) {
    return {
      getCenterXInScene: () => moon.sprite.position.x,
      getCenterYInScene: () => moon.sprite.position.y,
      getWidth: () => moon.radius * 2,
      getHeight: () => moon.radius * 2,
      getUniqueId: () => `level-seven-${moon.config.key}-${index}`,
      getName: () => "LevelSevenMoon",
    };
  }

  function createLevelSevenStaticPlanetCollisionProxy(planet, key) {
    return {
      getCenterXInScene: () => planet.sprite.position.x,
      getCenterYInScene: () => planet.sprite.position.y,
      getWidth: () => planet.radius * 2,
      getHeight: () => planet.radius * 2,
      getUniqueId: () => `level-seven-planet-${key}`,
      getName: () => "LevelSevenPlanet",
    };
  }

  function createLevelSevenSteadyPlanetLight(layerRenderer, zOrder, color) {
    if (!layerRenderer || typeof document === "undefined" || typeof PIXI?.Sprite !== "function") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext("2d");
    if (!context) return null;

    const channels = String(color)
      .split(";")
      .map((value) => clamp(Number(value) || 0, 0, 255));
    const red = channels[0] || 0;
    const green = channels[1] || 0;
    const blue = channels[2] || 0;
    const gradient = context.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, `rgba(${red}, ${green}, ${blue}, 0.24)`);
    gradient.addColorStop(0.28, `rgba(${red}, ${green}, ${blue}, 0.15)`);
    gradient.addColorStop(0.62, `rgba(${red}, ${green}, ${blue}, 0.055)`);
    gradient.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0)`);
    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 512);

    const steadyLight = new PIXI.Sprite(PIXI.Texture.from(canvas));
    if (steadyLight.anchor?.set) steadyLight.anchor.set(0.5);
    steadyLight.blendMode = PIXI.BLEND_MODES.ADD;
    steadyLight.eventMode = "none";
    layerRenderer.addRendererObject(steadyLight, zOrder);
    return steadyLight;
  }

  function updateLevelSevenSteadyPlanetLight(steadyLight, x, y, radius) {
    if (!steadyLight) return;
    steadyLight.position.set(x, y);
    steadyLight.width = radius * 2;
    steadyLight.height = radius * 2;
    steadyLight.visible = true;
  }

  function ensureLevelSevenPlanetSystem(runtimeScene) {
    let system = levelSevenPlanetSystemState.get(runtimeScene);
    if (
      system?.primary &&
      system.secondary?.sprite &&
      system.moons.length === LEVEL_SEVEN_MOON_CONFIGS.length
    ) {
      return system;
    }
    if (typeof PIXI === "undefined" || typeof PIXI.Sprite !== "function") return null;

    clearLevelSevenPlanetSystem(runtimeScene);
    retireAuthoredLevelSevenPlanet(runtimeScene);

    const primary = createSceneObject(runtimeScene, "Planet_6", "");
    if (!primary) return null;
    primary.__headSpaceLevelSevenOrbitalBody = true;
    primary.setSize(LEVEL_SEVEN_PRIMARY_PLANET_SIZE, LEVEL_SEVEN_PRIMARY_PLANET_SIZE);
    if (primary.setZOrder) primary.setZOrder(LEVEL_SEVEN_PLANET_Z_ORDER);
    if (primary.hide) primary.hide(false);

    const primaryRadius = LEVEL_SEVEN_PRIMARY_PLANET_SIZE * LEVEL_SEVEN_PRIMARY_PLANET_RADIUS_RATIO;
    if (primary.hasBehavior && primary.hasBehavior("Physics2")) {
      const physics = primary.getBehavior("Physics2");
      if (physics.setStatic) physics.setStatic();
      if (physics.setGravityScale) physics.setGravityScale(0);
      if (physics.setRestitution) physics.setRestitution(LEVEL_SEVEN_PLANET_RESTITUTION);
      if (physics.setShapeScale) {
        physics.setShapeScale(
          (primaryRadius + LEVEL_SEVEN_PLANET_COLLISION_PADDING) /
            LEVEL_SEVEN_PRIMARY_PLANET_PHYSICS_BASE_RADIUS
        );
      }
      if (physics.setLinearVelocityX) physics.setLinearVelocityX(0);
      if (physics.setLinearVelocityY) physics.setLinearVelocityY(0);
      if (physics.setAngularVelocity) physics.setAngularVelocity(0);
    }

    const layerName = primary.getLayer ? primary.getLayer() : "";
    const layer = runtimeScene.getLayer(layerName) || runtimeScene.getLayer("");
    const layerRenderer = layer?.getRenderer?.();
    if (!layerRenderer) {
      primary.deleteFromScene();
      return null;
    }

    const secondarySprite = new PIXI.Sprite(PIXI.Texture.from("Planet12.png"));
    secondarySprite[LEVEL_SEVEN_PLANET12_RENDERER_MARKER] = true;
    if (secondarySprite.anchor?.set) secondarySprite.anchor.set(0.5);
    secondarySprite.width = LEVEL_SEVEN_SECONDARY_PLANET_SIZE;
    secondarySprite.height = LEVEL_SEVEN_SECONDARY_PLANET_SIZE;
    secondarySprite.eventMode = "none";
    const secondaryZOrder = LEVEL_SEVEN_PLANET_Z_ORDER + 0.05;
    layerRenderer.addRendererObject(secondarySprite, secondaryZOrder);

    const secondary = {
      sprite: secondarySprite,
      radius: LEVEL_SEVEN_SECONDARY_PLANET_SIZE * LEVEL_SEVEN_SECONDARY_PLANET_RADIUS_RATIO,
      velocityX: 0,
      velocityY: 0,
      zOrder: secondaryZOrder,
      layerName,
    };
    secondary.collisionProxy = createLevelSevenStaticPlanetCollisionProxy(secondary, "planet12");

    let primaryLight = runtimeScene.getObjects("Light1")[0] || null;
    const primaryLightWasCreated = !primaryLight;
    if (!primaryLight) primaryLight = createSceneObject(runtimeScene, "Light1", "Lighting");
    const secondaryLight = createSceneObject(runtimeScene, "Light2", "Lighting");
    if (secondaryLight?.setZOrder && primaryLight?.getZOrder) {
      secondaryLight.setZOrder(primaryLight.getZOrder() + 1);
    }

    system = {
      primary,
      primaryRadius,
      primaryLight,
      primaryLightWasCreated,
      primarySteadyLight: createLevelSevenSteadyPlanetLight(
        layerRenderer,
        LEVEL_SEVEN_PLANET_Z_ORDER - 0.08,
        LEVEL_SEVEN_PRIMARY_LIGHT_COLOR
      ),
      secondary,
      secondaryLight,
      secondarySteadyLight: createLevelSevenSteadyPlanetLight(
        layerRenderer,
        secondaryZOrder - 0.08,
        LEVEL_SEVEN_SECONDARY_LIGHT_COLOR
      ),
      moons: [],
    };
    for (let i = 0; i < LEVEL_SEVEN_MOON_CONFIGS.length; i++) {
      const config = LEVEL_SEVEN_MOON_CONFIGS[i];
      const sprite = new PIXI.Sprite(PIXI.Texture.from(config.resourceUrl));
      if (sprite.anchor?.set) sprite.anchor.set(0.5);
      sprite.width = config.size;
      sprite.height = config.size;
      sprite.eventMode = "none";
      const zOrder = LEVEL_SEVEN_PLANET_Z_ORDER + 0.1 + i * 0.02;
      layerRenderer.addRendererObject(sprite, zOrder);

      const moon = {
        config,
        sprite,
        radius: config.size * config.radiusRatio,
        velocityX: 0,
        velocityY: 0,
        zOrder,
        layerName,
        lightObstacle: createLevelSixMoonLightObstacle(runtimeScene),
      };
      moon.collisionProxy = createLevelSevenMoonCollisionProxy(moon, i);
      system.moons.push(moon);
    }
    levelSevenPlanetSystemState.set(runtimeScene, system);
    removeDuplicateLevelSevenPlanet12Sprites(runtimeScene, system);
    return system;
  }

  function applyLevelSevenPlanetCollisions(runtimeScene, system) {
    if (
      !system ||
      getSceneBoolean(runtimeScene, "Paused") ||
      getSceneBoolean(runtimeScene, "LevelWon") ||
      getSceneBoolean(runtimeScene, "LevelLost")
    ) {
      return;
    }

    const bodies = [
      {
        centerX: system.primary.getCenterXInScene(),
        centerY: system.primary.getCenterYInScene(),
        radius: system.primaryRadius,
        velocityX: 0,
        velocityY: 0,
      },
      ...(system.secondary
        ? [
            {
              centerX: system.secondary.sprite.position.x,
              centerY: system.secondary.sprite.position.y,
              radius: system.secondary.radius,
              velocityX: 0,
              velocityY: 0,
            },
          ]
        : []),
      ...system.moons.map((moon) => ({
        centerX: moon.sprite.position.x,
        centerY: moon.sprite.position.y,
        radius: moon.radius,
        velocityX: moon.velocityX,
        velocityY: moon.velocityY,
      })),
    ];
    const actors = [];
    for (const objectName of ["Player", "Enemy", "SmartEnemy", "EmittedMaterial", "Asteroid"]) {
      const objects = runtimeScene.getObjects(objectName);
      for (let i = 0; i < objects.length; i++) actors.push(objects[i]);
    }

    for (let actorIndex = 0; actorIndex < actors.length; actorIndex++) {
      const actor = actors[actorIndex];
      if (!actor || actor.getWidth() <= 0) continue;
      const actorRadius = getApproxObjectRadius(actor, 8);

      for (let bodyIndex = 0; bodyIndex < bodies.length; bodyIndex++) {
        const body = bodies[bodyIndex];
        const contactDistance = body.radius + actorRadius + LEVEL_SEVEN_PLANET_COLLISION_PADDING;
        let dx = actor.getCenterXInScene() - body.centerX;
        let dy = actor.getCenterYInScene() - body.centerY;
        let distance = Math.hypot(dx, dy);
        if (distance >= contactDistance) continue;

        if (distance <= 0.001) {
          const uniqueId = typeof actor.getUniqueId === "function" ? actor.getUniqueId() : actorIndex + 1;
          const fallbackAngle = (uniqueId * 0.79 + bodyIndex * 2.17) % (Math.PI * 2);
          dx = Math.cos(fallbackAngle);
          dy = Math.sin(fallbackAngle);
          distance = 1;
        }
        const normalX = dx / distance;
        const normalY = dy / distance;
        moveObjectToCenter(
          actor,
          body.centerX + normalX * (contactDistance + 2),
          body.centerY + normalY * (contactDistance + 2)
        );

        if (!actor.hasBehavior || !actor.hasBehavior("Physics2")) continue;
        const physics = actor.getBehavior("Physics2");
        const velocity = getObjectVelocity(actor);
        const relativeVelocityX = velocity.x - body.velocityX;
        const relativeVelocityY = velocity.y - body.velocityY;
        const radialVelocity = relativeVelocityX * normalX + relativeVelocityY * normalY;
        const tangentVelocityX = relativeVelocityX - normalX * radialVelocity;
        const tangentVelocityY = relativeVelocityY - normalY * radialVelocity;
        const reflectedSpeed =
          radialVelocity < 0 ? -radialVelocity * LEVEL_SEVEN_PLANET_RESTITUTION : radialVelocity;
        const outwardSpeed = clamp(
          Math.max(LEVEL_SEVEN_PLANET_MIN_BOUNCE_SPEED, reflectedSpeed),
          LEVEL_SEVEN_PLANET_MIN_BOUNCE_SPEED,
          LEVEL_SEVEN_PLANET_MAX_BOUNCE_SPEED
        );
        if (physics.setLinearVelocityX) {
          physics.setLinearVelocityX(body.velocityX + tangentVelocityX + normalX * outwardSpeed);
        }
        if (physics.setLinearVelocityY) {
          physics.setLinearVelocityY(body.velocityY + tangentVelocityY + normalY * outwardSpeed);
        }
      }
    }
  }

  function updateLevelSevenPlanetSystem(runtimeScene) {
    if (getCurrentLevel(runtimeScene) !== 7) {
      clearLevelSevenPlanetSystem(runtimeScene);
      return;
    }

    const bounds = getLevelSevenArenaBounds(runtimeScene);
    const system = ensureLevelSevenPlanetSystem(runtimeScene);
    if (!bounds || !system) return;

    const arenaWidth = Math.max(1, bounds.maxX - bounds.minX);
    const arenaHeight = Math.max(1, bounds.maxY - bounds.minY);
    const centerX = bounds.minX + arenaWidth * 0.5;
    const centerY = bounds.minY + arenaHeight * LEVEL_SEVEN_PRIMARY_PLANET_Y_RATIO;
    const secondaryX = bounds.minX + arenaWidth * LEVEL_SEVEN_SECONDARY_PLANET_X_RATIO;
    const secondaryY = bounds.minY + arenaHeight * LEVEL_SEVEN_SECONDARY_PLANET_Y_RATIO;
    removeDuplicateLevelSevenPlanet12Sprites(runtimeScene, system);
    moveObjectToCenter(system.primary, centerX, centerY);
    if (system.primary.setAngle) system.primary.setAngle(0);

    const elapsedSeconds = performance.now() / 1000;
    updateLevelSevenSteadyPlanetLight(
      system.primarySteadyLight,
      centerX,
      centerY,
      LEVEL_SEVEN_PRIMARY_LIGHT_RADIUS
    );
    system.secondary.sprite.position.set(secondaryX, secondaryY);
    system.secondary.sprite.rotation = elapsedSeconds * 0.025;
    system.secondary.sprite.width = LEVEL_SEVEN_SECONDARY_PLANET_SIZE;
    system.secondary.sprite.height = LEVEL_SEVEN_SECONDARY_PLANET_SIZE;
    system.secondary.sprite.visible = true;
    updateLevelSevenSteadyPlanetLight(
      system.secondarySteadyLight,
      secondaryX,
      secondaryY,
      LEVEL_SEVEN_SECONDARY_LIGHT_RADIUS
    );

    for (let i = 0; i < system.moons.length; i++) {
      const moon = system.moons[i];
      const angle = moon.config.phase + elapsedSeconds * moon.config.orbitSpeed;
      const parentX = moon.config.parent === "primary" ? centerX : secondaryX;
      const parentY = moon.config.parent === "primary" ? centerY : secondaryY;
      moon.sprite.position.set(
        parentX + Math.cos(angle) * moon.config.orbitRadius,
        parentY + Math.sin(angle) * moon.config.orbitRadius
      );
      moon.sprite.rotation = elapsedSeconds * moon.config.rotationSpeed;
      moon.sprite.width = moon.config.size;
      moon.sprite.height = moon.config.size;
      moon.sprite.visible = true;
      moon.velocityX = -Math.sin(angle) * moon.config.orbitRadius * moon.config.orbitSpeed;
      moon.velocityY = Math.cos(angle) * moon.config.orbitRadius * moon.config.orbitSpeed;
      updateLevelSixMoonLightObstacle(
        moon.lightObstacle,
        moon.sprite.position.x,
        moon.sprite.position.y,
        moon.radius,
        runtimeScene
      );
    }

    if (system.primaryLight) {
      moveObjectToCenter(system.primaryLight, centerX, centerY);
      if (system.primaryLight.setColor) system.primaryLight.setColor(LEVEL_SEVEN_PRIMARY_LIGHT_COLOR);
      if (system.primaryLight.setRadius) system.primaryLight.setRadius(LEVEL_SEVEN_PRIMARY_LIGHT_RADIUS);
      if (system.primaryLight.setZOrder && system.primary.getZOrder) {
        system.primaryLight.setZOrder(system.primary.getZOrder() + 1);
      }
    }
    if (system.secondaryLight) {
      moveObjectToCenter(system.secondaryLight, secondaryX, secondaryY);
      if (system.secondaryLight.setColor) system.secondaryLight.setColor(LEVEL_SEVEN_SECONDARY_LIGHT_COLOR);
      if (system.secondaryLight.setRadius) system.secondaryLight.setRadius(LEVEL_SEVEN_SECONDARY_LIGHT_RADIUS);
      if (system.secondaryLight.setZOrder) {
        system.secondaryLight.setZOrder(system.secondary.zOrder + 1);
      }
    }
    applyLevelSevenPlanetCollisions(runtimeScene, system);
  }

  function removeLevelEightStationProjectile(runtimeScene, system, projectile) {
    if (!projectile) return;
    const graphic = projectile.graphic;
    const layer = runtimeScene.getLayer(system?.layerName || "") || runtimeScene.getLayer("");
    const layerRenderer = layer?.getRenderer?.();
    if (graphic && layerRenderer?.removeRendererObject) {
      try {
        layerRenderer.removeRendererObject(graphic);
      } catch {
        // Fall through to direct renderer cleanup.
      }
    }
    if (graphic?.parent) graphic.parent.removeChild(graphic);
    if (graphic?.destroy && !graphic.destroyed) {
      graphic.destroy({ children: true, texture: false, baseTexture: false });
    }
    if (system?.projectiles) {
      const index = system.projectiles.indexOf(projectile);
      if (index !== -1) system.projectiles.splice(index, 1);
    }
  }

  function clearLevelEightSpaceStationSystem(runtimeScene) {
    const system = levelEightStationSystemState.get(runtimeScene);
    if (!system) return;

    while (system.projectiles.length) {
      removeLevelEightStationProjectile(runtimeScene, system, system.projectiles[system.projectiles.length - 1]);
    }
    removeLevelSevenRendererObject(runtimeScene, system.layerName || "", system.sprite, false);
    levelEightStationSystemState.delete(runtimeScene);
    if (typeof window !== "undefined") delete window.__headSpaceLevelEightStationPose;
  }

  function ensureLevelEightSpaceStationSystem(runtimeScene) {
    let system = levelEightStationSystemState.get(runtimeScene);
    if (system?.sprite && !system.sprite.destroyed) return system;
    if (typeof PIXI === "undefined" || typeof PIXI.Sprite !== "function") return null;

    clearLevelEightSpaceStationSystem(runtimeScene);
    const referencePlanet = runtimeScene.getObjects("Planet_2")[0] || runtimeScene.getObjects("Planet_5")[0] || null;
    const layerName = referencePlanet?.getLayer?.() || "";
    const layer = runtimeScene.getLayer(layerName) || runtimeScene.getLayer("");
    const layerRenderer = layer?.getRenderer?.();
    if (!layerRenderer) return null;

    const sprite = new PIXI.Sprite(PIXI.Texture.from(LEVEL_EIGHT_STATION_RESOURCE));
    if (sprite.anchor?.set) sprite.anchor.set(0.5);
    sprite.width = LEVEL_EIGHT_STATION_SIZE;
    sprite.height = LEVEL_EIGHT_STATION_SIZE;
    sprite.eventMode = "none";
    const zOrder = (Number(referencePlanet?.getZOrder?.()) || 2) + LEVEL_EIGHT_STATION_Z_OFFSET;
    layerRenderer.addRendererObject(sprite, zOrder);

    system = {
      sprite,
      layerName,
      layerRenderer,
      zOrder,
      elapsedSeconds: 0,
      launchAccumulatorSeconds: 0,
      projectilesArmed: false,
      shotIndex: 0,
      centerX: 0,
      centerY: 0,
      velocityY: 0,
      projectiles: [],
    };
    levelEightStationSystemState.set(runtimeScene, system);
    return system;
  }

  function createLevelEightStationProjectileGraphic() {
    if (
      typeof PIXI === "undefined" ||
      typeof PIXI.Container !== "function" ||
      typeof PIXI.Graphics !== "function"
    ) {
      return null;
    }

    const radius = LEVEL_EIGHT_STATION_PROJECTILE_RADIUS;
    const container = new PIXI.Container();
    container.eventMode = "none";

    const tail = new PIXI.Graphics();
    for (let i = LEVEL_EIGHT_STATION_PROJECTILE_TAIL_SEGMENTS; i >= 1; i--) {
      const progress = i / LEVEL_EIGHT_STATION_PROJECTILE_TAIL_SEGMENTS;
      const segmentRadius = radius * (0.52 - progress * 0.36);
      const segmentX = -radius * (1.05 + i * 0.62);
      tail.beginFill(i % 3 === 0 ? 0xff8a62 : 0xff1738, 0.05 + (1 - progress) * 0.34);
      tail.drawCircle(segmentX, 0, Math.max(2, segmentRadius));
      tail.endFill();
    }
    tail.blendMode = PIXI.BLEND_MODES.ADD;
    container.addChild(tail);

    const glow = new PIXI.Graphics();
    glow.beginFill(0xff0028, 0.1);
    glow.drawCircle(0, 0, radius * 2.35);
    glow.endFill();
    glow.beginFill(0xff3153, 0.2);
    glow.drawCircle(0, 0, radius * 1.68);
    glow.endFill();
    glow.beginFill(0xff6a56, 0.3);
    glow.drawCircle(0, 0, radius * 1.18);
    glow.endFill();
    glow.blendMode = PIXI.BLEND_MODES.ADD;
    container.addChild(glow);

    const core = new PIXI.Graphics();
    core.beginFill(0xff2038, 0.96);
    core.drawCircle(0, 0, radius);
    core.endFill();
    core.beginFill(0xffa48c, 0.98);
    core.drawCircle(0, 0, radius * 0.62);
    core.endFill();
    core.beginFill(0xffffff, 1);
    core.drawCircle(radius * 0.12, -radius * 0.12, radius * 0.3);
    core.endFill();
    core.lineStyle(3, 0xffd5c8, 0.92);
    core.drawCircle(0, 0, radius * 1.04);
    core.blendMode = PIXI.BLEND_MODES.ADD;
    container.addChild(core);

    const sparkles = [];
    for (let i = 0; i < LEVEL_EIGHT_STATION_PROJECTILE_SPARK_COUNT; i++) {
      const sparkle = new PIXI.Graphics();
      const sparkleRadius = 1.8 + (i % 3) * 0.9;
      sparkle.beginFill(i % 2 === 0 ? 0xffffff : 0xff7a62, 1);
      sparkle.drawCircle(0, 0, sparkleRadius);
      sparkle.endFill();
      sparkle.blendMode = PIXI.BLEND_MODES.ADD;
      sparkle.__headSpacePhase = (i / LEVEL_EIGHT_STATION_PROJECTILE_SPARK_COUNT) * Math.PI * 2;
      sparkle.__headSpaceOrbitRatio = 1.05 + (i % 4) * 0.24;
      container.addChild(sparkle);
      sparkles.push(sparkle);
    }

    container.__headSpaceGlow = glow;
    container.__headSpaceCore = core;
    container.__headSpaceSparkles = sparkles;
    return container;
  }

  function launchLevelEightStationProjectile(runtimeScene, system) {
    if (!system?.layerRenderer) return null;

    const player = runtimeScene.getObjects("Player")[0] || null;
    const fallbackBoss = runtimeScene.getObjects("SmartEnemy")[0] || null;
    const target = player || fallbackBoss;
    let targetX = system.centerX;
    const stationSize = system.stationSize || LEVEL_EIGHT_STATION_SIZE;
    const launchCenterY = Number.isFinite(system.stationCenterY) ? system.stationCenterY : system.centerY;
    let targetY = launchCenterY + stationSize;
    if (target) {
      const targetVelocity = getObjectVelocity(target);
      targetX = target.getCenterXInScene() + targetVelocity.x * 0.28;
      targetY = target.getCenterYInScene() + targetVelocity.y * 0.28;
    }

    let direction = getNormalizedVector(targetX - system.centerX, targetY - launchCenterY);
    if (direction.magnitude <= 0.001) direction = { x: 0, y: 1, magnitude: 1 };
    const graphic = createLevelEightStationProjectileGraphic();
    if (!graphic) return null;

    const launchOffset = stationSize * 0.43;
    const projectile = {
      graphic,
      baseRadius: LEVEL_EIGHT_STATION_PROJECTILE_RADIUS,
      radius: LEVEL_EIGHT_STATION_PROJECTILE_RADIUS,
      x: system.centerX + direction.x * launchOffset,
      y: launchCenterY + direction.y * launchOffset,
      velocityX: direction.x * LEVEL_EIGHT_STATION_PROJECTILE_SPEED,
      velocityY: direction.y * LEVEL_EIGHT_STATION_PROJECTILE_SPEED,
      ageSeconds: 0,
      shotIndex: system.shotIndex++,
    };
    graphic.position.set(projectile.x, projectile.y);
    graphic.rotation = Math.atan2(projectile.velocityY, projectile.velocityX);
    system.layerRenderer.addRendererObject(graphic, system.zOrder + 0.12);
    system.projectiles.push(projectile);
    return projectile;
  }

  function getLevelEightStationActorCollision(system, actor, actorRadius) {
    if (!system || !actor) return null;
    const actorX = actor.getCenterXInScene();
    const actorY = actor.getCenterYInScene();
    const size = LEVEL_EIGHT_STATION_SIZE;
    let bestCollision = null;

    for (let i = 0; i < LEVEL_EIGHT_STATION_COLLISION_COMPONENTS.length; i++) {
      const component = LEVEL_EIGHT_STATION_COLLISION_COMPONENTS[i];
      let normalX = 0;
      let normalY = 0;
      let penetration = 0;

      if (component.type === "capsule") {
        const centerX = system.centerX + component.offsetX * size;
        const startY = system.centerY + component.startY * size;
        const endY = system.centerY + component.endY * size;
        const nearestY = clamp(actorY, Math.min(startY, endY), Math.max(startY, endY));
        let dx = actorX - centerX;
        let dy = actorY - nearestY;
        let distance = Math.hypot(dx, dy);
        const contactDistance =
          actorRadius + Math.max(2, component.radius * size - LEVEL_EIGHT_STATION_COLLISION_INSET);
        if (distance >= contactDistance) continue;
        if (distance <= 0.001) {
          dx = actorX >= system.centerX ? 1 : -1;
          dy = 0;
          distance = 1;
        }
        normalX = dx / distance;
        normalY = dy / distance;
        penetration = contactDistance - distance;
      } else if (component.type === "ellipse-ring") {
        const centerX = system.centerX;
        const centerY = system.centerY + component.offsetY * size;
        const radiusX = Math.max(2, component.radiusX * size - LEVEL_EIGHT_STATION_COLLISION_INSET);
        const radiusY = Math.max(2, component.radiusY * size - LEVEL_EIGHT_STATION_COLLISION_INSET);
        const dx = actorX - centerX;
        const dy = actorY - centerY;
        const normalizedDistance = Math.hypot(dx / radiusX, dy / radiusY);
        if (normalizedDistance <= 0.001) continue;
        const boundaryX = centerX + dx / normalizedDistance;
        const boundaryY = centerY + dy / normalizedDistance;
        let separationX = actorX - boundaryX;
        let separationY = actorY - boundaryY;
        let separation = Math.hypot(separationX, separationY);
        const contactDistance =
          actorRadius +
          Math.max(2, component.thickness * size * 0.5 - LEVEL_EIGHT_STATION_COLLISION_INSET * 0.5);
        if (separation >= contactDistance) continue;
        if (separation <= 0.001) {
          const gradientX = dx / (radiusX * radiusX);
          const gradientY = dy / (radiusY * radiusY);
          const gradient = getNormalizedVector(gradientX, gradientY);
          separationX = gradient.x;
          separationY = gradient.y;
          separation = 1;
        }
        normalX = separationX / separation;
        normalY = separationY / separation;
        penetration = contactDistance - separation;
      }

      if (penetration > (bestCollision?.penetration || 0)) {
        bestCollision = { normalX, normalY, penetration };
      }
    }
    return bestCollision;
  }

  function applyLevelEightStationBodyCollisions(runtimeScene, system) {
    const actors = [];
    for (const objectName of ["Player", "Enemy", "SmartEnemy"]) {
      const objects = runtimeScene.getObjects(objectName);
      for (let i = 0; i < objects.length; i++) actors.push(objects[i]);
    }

    for (let i = 0; i < actors.length; i++) {
      const actor = actors[i];
      if (!actor || actor.getWidth() <= 0) continue;
      const isRegularEnemy = actor.getName?.() === "Enemy";
      const physics =
        actor.hasBehavior && actor.hasBehavior("Physics2")
          ? actor.getBehavior("Physics2")
          : null;

      // Thin elliptical rings can be crossed in one physics step. If a
      // regular enemy reaches the hollow station core, eject it sideways so
      // it cannot remain visually pinned inside the rings.
      if (isRegularEnemy && physics) {
        const coreDeltaX = actor.getCenterXInScene() - system.centerX;
        const coreDeltaY = actor.getCenterYInScene() - system.centerY;
        const insideCore =
          Math.abs(coreDeltaX) < LEVEL_EIGHT_STATION_SIZE * 0.29 &&
          coreDeltaY > -LEVEL_EIGHT_STATION_SIZE * 0.27 &&
          coreDeltaY < LEVEL_EIGHT_STATION_SIZE * 0.19;
        if (insideCore) {
          const velocity = getObjectVelocity(actor);
          const escapeDirection =
            Math.abs(coreDeltaX) > 2
              ? Math.sign(coreDeltaX)
              : Math.abs(velocity.x) > 1
                ? Math.sign(velocity.x)
                : 1;
          const actorRadius =
            getApproxObjectRadius(actor, 8) * LEVEL_EIGHT_STATION_ACTOR_RADIUS_SCALE;
          moveObjectToCenter(
            actor,
            system.centerX +
              escapeDirection *
                (LEVEL_EIGHT_STATION_SIZE * 0.34 + actorRadius +
                  LEVEL_EIGHT_STATION_COLLISION_SEPARATION_PADDING),
            actor.getCenterYInScene()
          );
          const body = physics.getBody?.();
          if (body && physics.b2Vec2 && physics._sharedData) {
            const worldInvScale = physics._sharedData.worldInvScale;
            body.SetTransform(
              physics.b2Vec2(
                actor.getCenterXInScene() * worldInvScale,
                actor.getCenterYInScene() * worldInvScale
              ),
              body.GetAngle()
            );
            body.SetAwake(true);
          }
          if (physics.setLinearVelocityX) {
            physics.setLinearVelocityX(
              escapeDirection *
                Math.max(LEVEL_EIGHT_STATION_ENEMY_ESCAPE_SPEED, Math.abs(velocity.x))
            );
          }
          if (physics.setLinearVelocityY) physics.setLinearVelocityY(velocity.y);
          actor.__headSpaceStationBounceGuardUntilSeconds =
            system.elapsedSeconds + LEVEL_EIGHT_STATION_ENEMY_BOUNCE_GUARD_SECONDS;
          actor.__headSpaceStationBounceNormalX = escapeDirection;
          actor.__headSpaceStationBounceNormalY = 0;
        }
      }

      if (
        isRegularEnemy &&
        physics &&
        system.elapsedSeconds < (actor.__headSpaceStationBounceGuardUntilSeconds || -Infinity)
      ) {
        const guardNormal = getNormalizedVector(
          actor.__headSpaceStationBounceNormalX || 0,
          actor.__headSpaceStationBounceNormalY || 0
        );
        if (guardNormal.magnitude > 0.001) {
          const guardedVelocity = getObjectVelocity(actor);
          const awaySpeed =
            guardedVelocity.x * guardNormal.x + guardedVelocity.y * guardNormal.y;
          const minimumGuardSpeed = LEVEL_EIGHT_STATION_ENEMY_MIN_BOUNCE_SPEED * 0.72;
          if (awaySpeed < minimumGuardSpeed) {
            const correction = minimumGuardSpeed - awaySpeed;
            if (physics.setLinearVelocityX) {
              physics.setLinearVelocityX(guardedVelocity.x + guardNormal.x * correction);
            }
            if (physics.setLinearVelocityY) {
              physics.setLinearVelocityY(guardedVelocity.y + guardNormal.y * correction);
            }
          }
        }
      }

      const actorRadius =
        getApproxObjectRadius(actor, 8) * LEVEL_EIGHT_STATION_ACTOR_RADIUS_SCALE;
      let deepestCollision = null;
      let accumulatedNormalX = 0;
      let accumulatedNormalY = 0;
      for (let pass = 0; pass < LEVEL_EIGHT_STATION_COLLISION_RESOLUTION_PASSES; pass++) {
        const collision = getLevelEightStationActorCollision(system, actor, actorRadius);
        if (!collision) break;
        if (!deepestCollision || collision.penetration > deepestCollision.penetration) {
          deepestCollision = collision;
        }
        accumulatedNormalX += collision.normalX * Math.max(1, collision.penetration);
        accumulatedNormalY += collision.normalY * Math.max(1, collision.penetration);
        moveObjectToCenter(
          actor,
          actor.getCenterXInScene() +
            collision.normalX *
              (collision.penetration + LEVEL_EIGHT_STATION_COLLISION_SEPARATION_PADDING),
          actor.getCenterYInScene() +
            collision.normalY *
              (collision.penetration + LEVEL_EIGHT_STATION_COLLISION_SEPARATION_PADDING)
        );
      }
      if (!deepestCollision || !physics) continue;

      // Keep Box2D at the separated visual position. Without this, the next
      // physics step can restore the pre-separation position and pin actors
      // against (or inside) the station.
      const resolvedBody = physics.getBody?.();
      if (resolvedBody && physics.b2Vec2 && physics._sharedData) {
        const worldInvScale = physics._sharedData.worldInvScale;
        resolvedBody.SetTransform(
          physics.b2Vec2(
            actor.getCenterXInScene() * worldInvScale,
            actor.getCenterYInScene() * worldInvScale
          ),
          resolvedBody.GetAngle()
        );
        resolvedBody.SetAwake(true);
      }

      let responseNormal = getNormalizedVector(accumulatedNormalX, accumulatedNormalY);
      if (responseNormal.magnitude <= 0.001) {
        responseNormal = getNormalizedVector(
          deepestCollision.normalX,
          deepestCollision.normalY
        );
      }
      if (isRegularEnemy) {
        const horizontalDelta = actor.getCenterXInScene() - system.centerX;
        const horizontalDirection =
          Math.abs(horizontalDelta) > 1
            ? Math.sign(horizontalDelta)
            : responseNormal.x >= 0
              ? 1
              : -1;
        const centrality = clamp(
          1 - Math.abs(horizontalDelta) / (LEVEL_EIGHT_STATION_SIZE * 0.36),
          0,
          1
        );
        responseNormal = getNormalizedVector(
          responseNormal.x + horizontalDirection * (0.82 + centrality * 1.08),
          responseNormal.y * (0.82 - centrality * 0.24)
        );
      }

      const velocity = getObjectVelocity(actor);
      const relativeVelocityX = velocity.x;
      const relativeVelocityY = velocity.y - system.velocityY;
      const radialVelocity =
        relativeVelocityX * responseNormal.x + relativeVelocityY * responseNormal.y;
      const tangentRetention = isRegularEnemy
        ? LEVEL_EIGHT_STATION_ENEMY_TANGENT_RETENTION
        : 1;
      const tangentVelocityX =
        (relativeVelocityX - responseNormal.x * radialVelocity) * tangentRetention;
      const tangentVelocityY =
        (relativeVelocityY - responseNormal.y * radialVelocity) * tangentRetention;
      const reflectedSpeed =
        radialVelocity < 0 ? -radialVelocity * LEVEL_EIGHT_STATION_RESTITUTION : radialVelocity;
      const minimumBounceSpeed = isRegularEnemy
        ? LEVEL_EIGHT_STATION_ENEMY_MIN_BOUNCE_SPEED
        : LEVEL_EIGHT_STATION_MIN_BOUNCE_SPEED;
      const maximumBounceSpeed = isRegularEnemy
        ? LEVEL_EIGHT_STATION_ENEMY_MAX_BOUNCE_SPEED
        : LEVEL_EIGHT_STATION_MAX_BOUNCE_SPEED;
      const outwardSpeed = clamp(
        Math.max(minimumBounceSpeed, reflectedSpeed),
        minimumBounceSpeed,
        maximumBounceSpeed
      );
      if (physics.setLinearVelocityX) {
        physics.setLinearVelocityX(tangentVelocityX + responseNormal.x * outwardSpeed);
      }
      if (physics.setLinearVelocityY) {
        physics.setLinearVelocityY(
          system.velocityY *
            (isRegularEnemy ? LEVEL_EIGHT_STATION_ENEMY_VERTICAL_CARRY : 1) +
            tangentVelocityY +
            responseNormal.y * outwardSpeed
        );
      }
      if (isRegularEnemy) {
        actor.__headSpaceStationBounceGuardUntilSeconds =
          system.elapsedSeconds + LEVEL_EIGHT_STATION_ENEMY_BOUNCE_GUARD_SECONDS;
        actor.__headSpaceStationBounceNormalX = responseNormal.x;
        actor.__headSpaceStationBounceNormalY = responseNormal.y;
      }
    }
  }

  function isBossStationProjectileKnockbackActive(runtimeScene, boss) {
    if (!runtimeScene || !boss) return false;
    const system = levelEightStationSystemState.get(runtimeScene);
    return (
      !!system &&
      Number.isFinite(boss.__headSpaceStationOrbKnockbackUntilSeconds) &&
      system.elapsedSeconds < boss.__headSpaceStationOrbKnockbackUntilSeconds
    );
  }

  function applyLevelEightStationProjectileImpact(runtimeScene, system, actor, projectile) {
    if (!actor?.hasBehavior || !actor.hasBehavior("Physics2")) return;
    const physics = actor.getBehavior("Physics2");
    const velocity = getObjectVelocity(actor);
    const travelDirection = getNormalizedVector(projectile.velocityX, projectile.velocityY);
    const impactDirection =
      travelDirection.magnitude > 0.001 ? travelDirection : getNormalizedVector(0, 1);
    const impactVelocityX =
      velocity.x + impactDirection.x * LEVEL_EIGHT_STATION_PROJECTILE_IMPACT_DELTA_SPEED;
    const impactVelocityY =
      velocity.y + impactDirection.y * LEVEL_EIGHT_STATION_PROJECTILE_IMPACT_DELTA_SPEED;
    if (physics.setLinearVelocityX) physics.setLinearVelocityX(impactVelocityX);
    if (physics.setLinearVelocityY) physics.setLinearVelocityY(impactVelocityY);
    if (actor.__headSpaceMultiplayerLevelOneEnemySize) {
      actor.__headSpaceMultiplayerOrbitResumeAtSeconds =
        (system?.elapsedSeconds || 0) + 1.35;
    }

    if (actor.getName?.() === "SmartEnemy") {
      actor.__headSpaceStationOrbKnockbackUntilSeconds =
        (system?.elapsedSeconds || 0) + LEVEL_EIGHT_STATION_PROJECTILE_BOSS_KNOCKBACK_SECONDS;
      actor.__headSpaceStationOrbImpactVelocityX = impactVelocityX;
      actor.__headSpaceStationOrbImpactVelocityY = impactVelocityY;
      setBossNativeMovementEnabled(actor, false);
    }
  }

  function getLevelEightProjectilePlanetCollision(runtimeScene, projectile) {
    let bestCollision = null;
    for (let configIndex = 0; configIndex < LEVEL_EIGHT_PLANET_COLLISION_CONFIGS.length; configIndex++) {
      const config = LEVEL_EIGHT_PLANET_COLLISION_CONFIGS[configIndex];
      const planets = runtimeScene.getObjects(config.objectName);
      for (let planetIndex = 0; planetIndex < planets.length; planetIndex++) {
        const planet = planets[planetIndex];
        if (!planet || planet.getWidth() <= 0) continue;

        const width = Math.max(1, planet.getWidth());
        const height = Math.max(1, planet.getHeight());
        const angle = ((Number(planet.getAngle?.()) || 0) * Math.PI) / 180;
        const localOffsetX = width * config.offsetXRatio;
        const localOffsetY = height * config.offsetYRatio;
        const centerX =
          planet.getCenterXInScene() + localOffsetX * Math.cos(angle) - localOffsetY * Math.sin(angle);
        const centerY =
          planet.getCenterYInScene() + localOffsetX * Math.sin(angle) + localOffsetY * Math.cos(angle);
        let dx = projectile.x - centerX;
        let dy = projectile.y - centerY;
        let distance = Math.hypot(dx, dy);
        const contactDistance = Math.min(width, height) * config.radiusRatio + projectile.radius;
        if (distance >= contactDistance) continue;
        if (distance <= 0.001) {
          const fallback = getNormalizedVector(-projectile.velocityX, -projectile.velocityY);
          dx = fallback.magnitude > 0.001 ? fallback.x : 1;
          dy = fallback.magnitude > 0.001 ? fallback.y : 0;
          distance = 1;
        }
        const collision = {
          normalX: dx / distance,
          normalY: dy / distance,
          penetration: contactDistance - distance,
        };
        if (collision.penetration > (bestCollision?.penetration || 0)) bestCollision = collision;
      }
    }
    return bestCollision;
  }

  function getLevelEightProjectileWallCollision(runtimeScene, projectile) {
    const walls = runtimeScene.getObjects("Walls");
    let bestCollision = null;

    for (let i = 0; i < walls.length; i++) {
      const wall = walls[i];
      if (!wall || wall.getWidth() <= 0 || wall.getHeight() <= 0) continue;
      const centerX = wall.getCenterXInScene();
      const centerY = wall.getCenterYInScene();
      const angle = ((Number(wall.getAngle?.()) || 0) * Math.PI) / 180;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const worldX = projectile.x - centerX;
      const worldY = projectile.y - centerY;
      const localX = worldX * cos + worldY * sin;
      const localY = -worldX * sin + worldY * cos;
      const halfWidth = Math.max(1, wall.getWidth() * 0.5);
      const halfHeight = Math.max(1, wall.getHeight() * 0.5);
      const nearestX = clamp(localX, -halfWidth, halfWidth);
      const nearestY = clamp(localY, -halfHeight, halfHeight);
      let deltaX = localX - nearestX;
      let deltaY = localY - nearestY;
      let distance = Math.hypot(deltaX, deltaY);
      let penetration = projectile.radius - distance;

      if (distance <= 0.001) {
        const xClearance = halfWidth - Math.abs(localX);
        const yClearance = halfHeight - Math.abs(localY);
        if (xClearance < yClearance) {
          deltaX = localX >= 0 ? 1 : -1;
          deltaY = 0;
          penetration = projectile.radius + xClearance;
        } else {
          deltaX = 0;
          deltaY = localY >= 0 ? 1 : -1;
          penetration = projectile.radius + yClearance;
        }
        distance = 1;
      } else if (penetration <= 0) {
        continue;
      }

      const localNormalX = deltaX / distance;
      const localNormalY = deltaY / distance;
      const collision = {
        normalX: localNormalX * cos - localNormalY * sin,
        normalY: localNormalX * sin + localNormalY * cos,
        penetration,
      };
      if (collision.penetration > (bestCollision?.penetration || 0)) bestCollision = collision;
    }
    return bestCollision;
  }

  function bounceLevelEightStationProjectileOffSurfaces(runtimeScene, projectile) {
    const planetCollision = getLevelEightProjectilePlanetCollision(runtimeScene, projectile);
    const wallCollision = getLevelEightProjectileWallCollision(runtimeScene, projectile);
    const collision =
      !wallCollision || (planetCollision?.penetration || 0) > wallCollision.penetration
        ? planetCollision
        : wallCollision;
    if (!collision) return false;

    projectile.x += collision.normalX * (collision.penetration + 2);
    projectile.y += collision.normalY * (collision.penetration + 2);
    const normalVelocity =
      projectile.velocityX * collision.normalX + projectile.velocityY * collision.normalY;
    if (normalVelocity < 0) {
      const reflectionScale = (1 + LEVEL_EIGHT_STATION_PROJECTILE_SURFACE_RESTITUTION) * normalVelocity;
      projectile.velocityX -= reflectionScale * collision.normalX;
      projectile.velocityY -= reflectionScale * collision.normalY;
    }
    projectile.graphic.position.set(projectile.x, projectile.y);
    projectile.graphic.rotation = Math.atan2(projectile.velocityY, projectile.velocityX);
    return true;
  }

  function updateLevelEightStationProjectileVisual(projectile) {
    const graphic = projectile?.graphic;
    if (!graphic) return;

    const progress = clamp(
      projectile.ageSeconds / LEVEL_EIGHT_STATION_PROJECTILE_LIFETIME_SECONDS,
      0,
      1
    );
    const shrinkProgress = Math.pow(progress, 0.82);
    const visualScale = 1 - shrinkProgress * (1 - LEVEL_EIGHT_STATION_PROJECTILE_MIN_SCALE);
    projectile.radius = projectile.baseRadius * visualScale;
    if (graphic.scale?.set) graphic.scale.set(visualScale);

    const pulse = 1 + Math.sin(projectile.ageSeconds * 11 + projectile.shotIndex * 0.9) * 0.1;
    if (graphic.__headSpaceCore?.scale?.set) graphic.__headSpaceCore.scale.set(pulse);
    if (graphic.__headSpaceGlow) {
      graphic.__headSpaceGlow.alpha = 0.68 + Math.sin(projectile.ageSeconds * 7.4) * 0.16;
    }

    const sparkles = graphic.__headSpaceSparkles || [];
    for (let i = 0; i < sparkles.length; i++) {
      const sparkle = sparkles[i];
      const phase =
        sparkle.__headSpacePhase +
        projectile.ageSeconds * (2.2 + (i % 3) * 0.48) +
        projectile.shotIndex * 0.37;
      const orbit = projectile.baseRadius * sparkle.__headSpaceOrbitRatio * (1 + Math.sin(phase * 1.7) * 0.14);
      sparkle.position.set(Math.cos(phase) * orbit, Math.sin(phase) * orbit * 0.76);
      sparkle.alpha = 0.32 + (Math.sin(phase * 2.6) * 0.5 + 0.5) * 0.68;
      if (sparkle.scale?.set) sparkle.scale.set(0.62 + (Math.sin(phase * 3.1) * 0.5 + 0.5) * 0.72);
    }
  }

  function updateLevelEightStationProjectiles(runtimeScene, system, deltaSeconds, bounds) {
    const actors = [];
    for (const objectName of ["Player", "Enemy", "SmartEnemy"]) {
      const objects = runtimeScene.getObjects(objectName);
      for (let i = 0; i < objects.length; i++) actors.push(objects[i]);
    }

    for (let projectileIndex = system.projectiles.length - 1; projectileIndex >= 0; projectileIndex--) {
      const projectile = system.projectiles[projectileIndex];
      projectile.ageSeconds += deltaSeconds;
      projectile.x += projectile.velocityX * deltaSeconds;
      projectile.y += projectile.velocityY * deltaSeconds;
      projectile.graphic.position.set(projectile.x, projectile.y);
      updateLevelEightStationProjectileVisual(projectile);
      bounceLevelEightStationProjectileOffSurfaces(runtimeScene, projectile);

      let hitActor = null;
      for (let actorIndex = 0; actorIndex < actors.length; actorIndex++) {
        const actor = actors[actorIndex];
        if (!actor || actor.getWidth() <= 0) continue;
        const contactDistance = projectile.radius + getApproxObjectRadius(actor, 8);
        if (
          Math.hypot(
            actor.getCenterXInScene() - projectile.x,
            actor.getCenterYInScene() - projectile.y
          ) <= contactDistance
        ) {
          hitActor = actor;
          break;
        }
      }

      if (hitActor) {
        applyLevelEightStationProjectileImpact(runtimeScene, system, hitActor, projectile);
        removeLevelEightStationProjectile(runtimeScene, system, projectile);
        continue;
      }

      const outsideBounds =
        projectile.x < bounds.minX - LEVEL_EIGHT_STATION_PROJECTILE_BOUNDARY_MARGIN ||
        projectile.x > bounds.maxX + LEVEL_EIGHT_STATION_PROJECTILE_BOUNDARY_MARGIN ||
        projectile.y < bounds.minY - LEVEL_EIGHT_STATION_PROJECTILE_BOUNDARY_MARGIN ||
        projectile.y > bounds.maxY + LEVEL_EIGHT_STATION_PROJECTILE_BOUNDARY_MARGIN;
      if (outsideBounds || projectile.ageSeconds >= LEVEL_EIGHT_STATION_PROJECTILE_LIFETIME_SECONDS) {
        removeLevelEightStationProjectile(runtimeScene, system, projectile);
      }
    }
  }

  function getLevelEightStationOrbAvoidance(runtimeScene, boss, maxSpeed) {
    if (!runtimeScene || getCurrentLevel(runtimeScene) !== 8 || !boss) return null;
    const system = levelEightStationSystemState.get(runtimeScene);
    if (!system?.projectiles?.length) return null;

    const bossVelocity = getObjectVelocity(boss);
    const bossRadius = getApproxObjectRadius(boss, 24);
    const bossX = boss.getCenterXInScene();
    const bossY = boss.getCenterYInScene();
    let best = null;

    for (let i = 0; i < system.projectiles.length; i++) {
      const projectile = system.projectiles[i];
      const relativeX = bossX - projectile.x;
      const relativeY = bossY - projectile.y;
      const relativeVelocityX = bossVelocity.x - projectile.velocityX;
      const relativeVelocityY = bossVelocity.y - projectile.velocityY;
      const relativeSpeedSq =
        relativeVelocityX * relativeVelocityX + relativeVelocityY * relativeVelocityY;
      const closestTime =
        relativeSpeedSq > 1
          ? clamp(
              -(
                relativeX * relativeVelocityX +
                relativeY * relativeVelocityY
              ) / relativeSpeedSq,
              0,
              LEVEL_EIGHT_STATION_PROJECTILE_AVOIDANCE_HORIZON_SECONDS
            )
          : 0;
      const predictedBossX = bossX + bossVelocity.x * closestTime;
      const predictedBossY = bossY + bossVelocity.y * closestTime;
      const predictedProjectileX = projectile.x + projectile.velocityX * closestTime;
      const predictedProjectileY = projectile.y + projectile.velocityY * closestTime;
      const away = getNormalizedVector(
        predictedBossX - predictedProjectileX,
        predictedBossY - predictedProjectileY
      );
      const safeDistance =
        bossRadius + projectile.radius + LEVEL_EIGHT_STATION_PROJECTILE_AVOIDANCE_PADDING;
      if (away.magnitude >= safeDistance) continue;

      const urgency = clamp(1 - away.magnitude / safeDistance, 0, 1);
      const travelDirection = getNormalizedVector(projectile.velocityX, projectile.velocityY);
      const arenaBounds = getBossSpawnBounds(runtimeScene, boss);
      const arenaCenterX = (arenaBounds.minX + arenaBounds.maxX) * 0.5;
      const arenaCenterY = (arenaBounds.minY + arenaBounds.maxY) * 0.5;
      const tangentA = { x: -travelDirection.y, y: travelDirection.x };
      const tangentB = { x: travelDirection.y, y: -travelDirection.x };
      const centerX = arenaCenterX - bossX;
      const centerY = arenaCenterY - bossY;
      const tangent =
        tangentA.x * centerX + tangentA.y * centerY >= tangentB.x * centerX + tangentB.y * centerY
          ? tangentA
          : tangentB;
      const forceX = away.x * (1.1 + urgency * 0.75) + tangent.x * (0.72 + urgency * 0.58);
      const forceY = away.y * (1.1 + urgency * 0.75) + tangent.y * (0.72 + urgency * 0.58);
      const score = urgency * 2 + (1 - closestTime / LEVEL_EIGHT_STATION_PROJECTILE_AVOIDANCE_HORIZON_SECONDS);
      if (!best || score > best.score) {
        best = {
          active: true,
          forceX,
          forceY,
          desiredSpeed: Math.max(90, Math.max(1, maxSpeed) * (0.72 + urgency * 0.22)),
          score,
        };
      }
    }
    return best;
  }

  function updateLevelEightSpaceStation(runtimeScene) {
    if (getCurrentLevel(runtimeScene) !== 8) {
      clearLevelEightSpaceStationSystem(runtimeScene);
      return;
    }

    const player = runtimeScene.getObjects("Player")[0] || null;
    const bounds = getBossSpawnBounds(runtimeScene, player);
    const system = ensureLevelEightSpaceStationSystem(runtimeScene);
    if (!bounds || !system) return;

    const paused = getSceneBoolean(runtimeScene, "Paused");
    const finished = getSceneBoolean(runtimeScene, "LevelWon") || getSceneBoolean(runtimeScene, "LevelLost");
    const rawDeltaSeconds = runtimeScene.getElapsedTime() / 1000;
    const deltaSeconds =
      !paused && !finished && Number.isFinite(rawDeltaSeconds) ? clamp(rawDeltaSeconds, 0, 0.05) : 0;
    system.elapsedSeconds += deltaSeconds;
    if (!system.projectilesArmed && hasGameplayStarted(runtimeScene)) {
      system.projectilesArmed = true;
      system.launchAccumulatorSeconds = 0;
    }
    if (system.projectilesArmed) system.launchAccumulatorSeconds += deltaSeconds;

    const arenaWidth = Math.max(1, bounds.maxX - bounds.minX);
    system.centerX = bounds.minX + arenaWidth * 0.5;
    const minCenterY =
      bounds.minY +
      LEVEL_EIGHT_STATION_SIZE * LEVEL_EIGHT_STATION_VISIBLE_TOP_RATIO +
      LEVEL_EIGHT_STATION_VERTICAL_EDGE_MARGIN;
    const maxCenterY =
      bounds.maxY -
      LEVEL_EIGHT_STATION_SIZE * LEVEL_EIGHT_STATION_VISIBLE_BOTTOM_RATIO -
      LEVEL_EIGHT_STATION_VERTICAL_EDGE_MARGIN;
    const verticalCenter = (minCenterY + maxCenterY) * 0.5;
    const verticalAmplitude = Math.max(0, (maxCenterY - minCenterY) * 0.5);
    const verticalPhase =
      system.elapsedSeconds * LEVEL_EIGHT_STATION_BOB_ANGULAR_SPEED - Math.PI * 0.5;
    system.centerY = verticalCenter + Math.sin(verticalPhase) * verticalAmplitude;
    system.velocityY =
      Math.cos(verticalPhase) *
      verticalAmplitude *
      LEVEL_EIGHT_STATION_BOB_ANGULAR_SPEED;
    system.sprite.position.set(system.centerX, system.centerY);
    system.sprite.width = LEVEL_EIGHT_STATION_SIZE;
    system.sprite.height = LEVEL_EIGHT_STATION_SIZE;
    system.sprite.visible = true;
    if (typeof window !== "undefined") {
      window.__headSpaceLevelEightStationPose = {
        centerX: system.centerX,
        centerY: system.centerY,
        velocityY: system.velocityY,
      };
    }

    while (system.launchAccumulatorSeconds >= LEVEL_EIGHT_STATION_PROJECTILE_INTERVAL_SECONDS) {
      system.launchAccumulatorSeconds -= LEVEL_EIGHT_STATION_PROJECTILE_INTERVAL_SECONDS;
      launchLevelEightStationProjectile(runtimeScene, system);
    }
    if (deltaSeconds > 0) {
      updateLevelEightStationProjectiles(runtimeScene, system, deltaSeconds, bounds);
      applyLevelEightStationBodyCollisions(runtimeScene, system);
    }
  }

  function interpolateLevelNineBlackHoleTint(colorA, colorB, amount) {
    const t = clamp(amount, 0, 1);
    const red = Math.round(((colorA >> 16) & 0xff) * (1 - t) + ((colorB >> 16) & 0xff) * t);
    const green = Math.round(((colorA >> 8) & 0xff) * (1 - t) + ((colorB >> 8) & 0xff) * t);
    const blue = Math.round((colorA & 0xff) * (1 - t) + (colorB & 0xff) * t);
    return (red << 16) | (green << 8) | blue;
  }

  function createLevelNineBlackHoleGraphic(texture, index, size = LEVEL_NINE_BLACK_HOLE_SIZE) {
    if (
      typeof PIXI === "undefined" ||
      typeof PIXI.Container !== "function" ||
      typeof PIXI.Sprite !== "function" ||
      typeof PIXI.Graphics !== "function"
    ) {
      return null;
    }

    const container = new PIXI.Container();
    container.eventMode = "none";

    const halo = new PIXI.Graphics();
    halo.beginFill(index === 0 ? 0x5324ff : 0xd12cff, 0.1);
    halo.drawCircle(0, 0, size * 0.46);
    halo.endFill();
    halo.beginFill(index === 0 ? 0x2f86ff : 0xff356d, 0.08);
    halo.drawCircle(0, 0, size * 0.39);
    halo.endFill();
    halo.blendMode = PIXI.BLEND_MODES.ADD;
    container.addChild(halo);

    const sprite = new PIXI.Sprite(texture);
    if (sprite.anchor?.set) sprite.anchor.set(0.5);
    sprite.width = size;
    sprite.height = size;
    sprite.eventMode = "none";
    container.addChild(sprite);

    const sparkles = [];
    for (let i = 0; i < LEVEL_NINE_BLACK_HOLE_SPARK_COUNT; i++) {
      const sparkle = new PIXI.Graphics();
      const radius = 2.4 + (i % 4) * 1.35;
      sparkle.beginFill(i % 3 === 0 ? 0xffffff : i % 2 === 0 ? 0x7dc9ff : 0xf487ff, 1);
      sparkle.drawCircle(0, 0, radius);
      sparkle.endFill();
      sparkle.blendMode = PIXI.BLEND_MODES.ADD;
      sparkle.__headSpacePhase = (i / LEVEL_NINE_BLACK_HOLE_SPARK_COUNT) * Math.PI * 2;
      sparkle.__headSpaceOrbit = 0.26 + (i % 6) * 0.035;
      container.addChild(sparkle);
      sparkles.push(sparkle);
    }

    container.__headSpaceSprite = sprite;
    container.__headSpaceHalo = halo;
    container.__headSpaceSparkles = sparkles;
    container.__headSpaceBaseSize = size;
    return container;
  }

  function retireLevelNineAuthoredPlanets(runtimeScene) {
    for (const objectName of ["Planet_3", "Planet_6"]) {
      const planets = runtimeScene.getObjects(objectName).slice();
      for (let i = 0; i < planets.length; i++) {
        const planet = planets[i];
        if (planet.hide) planet.hide(true);
        if (planet.hasBehavior && planet.hasBehavior("Physics2")) {
          const physics = planet.getBehavior("Physics2");
          if (physics.setStatic) physics.setStatic();
          if (physics.setGravityScale) physics.setGravityScale(0);
          if (physics.setShapeScale) physics.setShapeScale(0.001);
          if (physics.setLinearVelocityX) physics.setLinearVelocityX(0);
          if (physics.setLinearVelocityY) physics.setLinearVelocityY(0);
        }
        if (planet.setSize) planet.setSize(1, 1);
        moveObjectToCenter(planet, -100000, -100000);
        if (planet.deleteFromScene) planet.deleteFromScene(runtimeScene);
      }
    }
  }

  function createLevelNineSmallPlanetCollisionProxy(planet, index) {
    return {
      getCenterXInScene: () => planet.sprite.position.x,
      getCenterYInScene: () => planet.sprite.position.y,
      getWidth: () => planet.radius * 2,
      getHeight: () => planet.radius * 2,
      getUniqueId: () => `level-nine-${planet.config.key}-${index}`,
      getName: () => "LevelNineSmallPlanet",
    };
  }

  function getLevelNineArenaGeometry(runtimeScene) {
    const walls = runtimeScene.getObjects("Walls");
    const wallBounds = [];
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < walls.length; i++) {
      const bounds = walls[i]?.getAABB?.();
      if (!bounds?.min || !bounds?.max) continue;
      const wall = {
        minX: bounds.min[0],
        minY: bounds.min[1],
        maxX: bounds.max[0],
        maxY: bounds.max[1],
      };
      if (![wall.minX, wall.minY, wall.maxX, wall.maxY].every(Number.isFinite)) continue;
      wallBounds.push(wall);
      minX = Math.min(minX, wall.minX);
      minY = Math.min(minY, wall.minY);
      maxX = Math.max(maxX, wall.maxX);
      maxY = Math.max(maxY, wall.maxY);
    }

    if (![minX, minY, maxX, maxY].every(Number.isFinite)) return null;
    return { bounds: { minX, minY, maxX, maxY }, walls: wallBounds };
  }

  function getLevelNinePlanetWallClearance(x, y, radius, walls) {
    let minimumClearance = Infinity;
    for (let i = 0; i < walls.length; i++) {
      const wall = walls[i];
      const outsideX = Math.max(wall.minX - x, 0, x - wall.maxX);
      const outsideY = Math.max(wall.minY - y, 0, y - wall.maxY);
      let clearance;
      if (outsideX > 0 || outsideY > 0) {
        clearance =
          Math.hypot(outsideX, outsideY) - radius - LEVEL_NINE_SMALL_PLANET_WALL_CLEARANCE;
      } else {
        const depth = Math.min(x - wall.minX, wall.maxX - x, y - wall.minY, wall.maxY - y);
        clearance = -(radius + LEVEL_NINE_SMALL_PLANET_WALL_CLEARANCE + depth);
      }
      minimumClearance = Math.min(minimumClearance, clearance);
    }
    return minimumClearance;
  }

  function chooseLevelNineSmallPlanetPlacements(bounds, walls, portals) {
    const placements = [];
    const arenaWidth = Math.max(1, bounds.maxX - bounds.minX);
    const arenaHeight = Math.max(1, bounds.maxY - bounds.minY);
    const portalRadius = LEVEL_NINE_BLACK_HOLE_SIZE * LEVEL_NINE_BLACK_HOLE_OUTER_EDGE_RATIO;

    for (let configIndex = 0; configIndex < LEVEL_NINE_SMALL_PLANET_CONFIGS.length; configIndex++) {
      const config = LEVEL_NINE_SMALL_PLANET_CONFIGS[configIndex];
      const radius = config.size * config.radiusRatio;
      const minX = bounds.minX + radius + LEVEL_NINE_SMALL_PLANET_EDGE_CLEARANCE;
      const maxX = bounds.maxX - radius - LEVEL_NINE_SMALL_PLANET_EDGE_CLEARANCE;
      const minY = bounds.minY + radius + LEVEL_NINE_SMALL_PLANET_EDGE_CLEARANCE;
      const maxY = bounds.maxY - radius - LEVEL_NINE_SMALL_PLANET_EDGE_CLEARANCE;
      const preferredX = bounds.minX + arenaWidth * config.xRatio;
      const preferredY = bounds.minY + arenaHeight * config.yRatio;
      const candidateRatios = [[config.xRatio, config.yRatio]];

      for (let row = 1; row <= 9; row++) {
        for (let column = 1; column <= 9; column++) {
          candidateRatios.push([column / 10, row / 10]);
        }
      }

      let best = null;
      for (let candidateIndex = 0; candidateIndex < candidateRatios.length; candidateIndex++) {
        const ratio = candidateRatios[candidateIndex];
        const x = clamp(bounds.minX + arenaWidth * ratio[0], minX, maxX);
        const y = clamp(bounds.minY + arenaHeight * ratio[1], minY, maxY);
        let minimumClearance = Infinity;

        for (let portalIndex = 0; portalIndex < portals.length; portalIndex++) {
          const portal = portals[portalIndex];
          minimumClearance = Math.min(
            minimumClearance,
            Math.hypot(x - portal.x, y - portal.y) -
              (portalRadius + radius + LEVEL_NINE_SMALL_PLANET_PORTAL_CLEARANCE)
          );
        }
        for (let placedIndex = 0; placedIndex < placements.length; placedIndex++) {
          const placed = placements[placedIndex];
          minimumClearance = Math.min(
            minimumClearance,
            Math.hypot(x - placed.x, y - placed.y) -
              (radius + placed.radius + LEVEL_NINE_SMALL_PLANET_PAIR_CLEARANCE)
          );
        }
        minimumClearance = Math.min(
          minimumClearance,
          getLevelNinePlanetWallClearance(x, y, radius, walls)
        );

        const preferredDistance = Math.hypot(x - preferredX, y - preferredY);
        const validBonus = minimumClearance >= 0 ? 1000000 : 0;
        const score = validBonus + minimumClearance * 100 - preferredDistance;
        if (!best || score > best.score) {
          best = { x, y, radius, minimumClearance, score };
        }
      }

      placements.push(best);
    }

    return placements;
  }

  function createLevelNineSmallPlanets(runtimeScene, layerRenderer, layerName, zOrder, portals) {
    const player = runtimeScene.getObjects("Player")[0] || null;
    const geometry = getLevelNineArenaGeometry(runtimeScene);
    const bounds = geometry?.bounds || getBossSpawnBounds(runtimeScene, player);
    const placements = chooseLevelNineSmallPlanetPlacements(bounds, geometry?.walls || [], portals);
    const planets = [];

    for (let i = 0; i < LEVEL_NINE_SMALL_PLANET_CONFIGS.length; i++) {
      const config = LEVEL_NINE_SMALL_PLANET_CONFIGS[i];
      const placement = placements[i];
      if (!placement) continue;

      const sprite = new PIXI.Sprite(PIXI.Texture.from(config.resourceUrl));
      if (sprite.anchor?.set) sprite.anchor.set(0.5);
      sprite.position.set(placement.x, placement.y);
      sprite.width = config.size;
      sprite.height = config.size;
      sprite.eventMode = "none";
      layerRenderer.addRendererObject(sprite, zOrder + i * 0.01);

      const planet = {
        config,
        sprite,
        radius: placement.radius,
        layerName,
        zOrder: zOrder + i * 0.01,
        minimumClearance: placement.minimumClearance,
      };
      planet.collisionProxy = createLevelNineSmallPlanetCollisionProxy(planet, i);
      planets.push(planet);
    }

    return planets;
  }

  function applyLevelNineSmallPlanetCollisions(runtimeScene, system) {
    if (
      !system?.planets?.length ||
      getSceneBoolean(runtimeScene, "Paused") ||
      getSceneBoolean(runtimeScene, "LevelWon") ||
      getSceneBoolean(runtimeScene, "LevelLost")
    ) {
      return;
    }

    const actors = [];
    for (const objectName of ["Player", "Enemy", "SmartEnemy", "EmittedMaterial", "Asteroid"]) {
      const objects = runtimeScene.getObjects(objectName);
      for (let i = 0; i < objects.length; i++) actors.push(objects[i]);
    }

    for (let actorIndex = 0; actorIndex < actors.length; actorIndex++) {
      const actor = actors[actorIndex];
      if (!actor || actor.getWidth() <= 0 || actor.__headSpaceLevelNinePortalTransit) continue;
      const actorRadius = getApproxObjectRadius(actor, 8);

      for (let planetIndex = 0; planetIndex < system.planets.length; planetIndex++) {
        const planet = system.planets[planetIndex];
        const contactDistance =
          planet.radius + actorRadius + LEVEL_NINE_SMALL_PLANET_COLLISION_PADDING;
        let dx = actor.getCenterXInScene() - planet.sprite.position.x;
        let dy = actor.getCenterYInScene() - planet.sprite.position.y;
        let distance = Math.hypot(dx, dy);
        if (distance >= contactDistance) continue;

        if (distance <= 0.001) {
          const uniqueId = typeof actor.getUniqueId === "function" ? actor.getUniqueId() : actorIndex + 1;
          const fallbackAngle = (uniqueId * 0.73 + planetIndex * 2.11) % (Math.PI * 2);
          dx = Math.cos(fallbackAngle);
          dy = Math.sin(fallbackAngle);
          distance = 1;
        }
        const normalX = dx / distance;
        const normalY = dy / distance;
        moveObjectToCenter(
          actor,
          planet.sprite.position.x + normalX * (contactDistance + 2),
          planet.sprite.position.y + normalY * (contactDistance + 2)
        );

        if (!actor.hasBehavior || !actor.hasBehavior("Physics2")) continue;
        const physics = actor.getBehavior("Physics2");
        const velocity = getObjectVelocity(actor);
        const radialVelocity = velocity.x * normalX + velocity.y * normalY;
        const tangentVelocityX = velocity.x - normalX * radialVelocity;
        const tangentVelocityY = velocity.y - normalY * radialVelocity;
        const reflectedSpeed =
          radialVelocity < 0 ? -radialVelocity * LEVEL_NINE_SMALL_PLANET_RESTITUTION : radialVelocity;
        const outwardSpeed = clamp(
          Math.max(LEVEL_NINE_SMALL_PLANET_MIN_BOUNCE_SPEED, reflectedSpeed),
          LEVEL_NINE_SMALL_PLANET_MIN_BOUNCE_SPEED,
          LEVEL_NINE_SMALL_PLANET_MAX_BOUNCE_SPEED
        );
        if (physics.setLinearVelocityX) {
          physics.setLinearVelocityX(tangentVelocityX + normalX * outwardSpeed);
        }
        if (physics.setLinearVelocityY) {
          physics.setLinearVelocityY(tangentVelocityY + normalY * outwardSpeed);
        }
      }
    }
  }

  function restoreLevelNinePortalVisuals(system) {
    if (!system?.visualRecords?.length) return;
    for (let i = 0; i < system.visualRecords.length; i++) {
      const record = system.visualRecords[i];
      const rendererObject = record.rendererObject;
      if (!rendererObject || rendererObject.destroyed) continue;
      rendererObject.scale.x = record.scaleX;
      rendererObject.scale.y = record.scaleY;
      rendererObject.rotation = record.rotation;
    }
    system.visualRecords.length = 0;
  }

  function clearLevelNineBlackHoleSystem(runtimeScene) {
    const system = levelNineBlackHoleSystemState.get(runtimeScene);
    if (!system) return;

    restoreLevelNinePortalVisuals(system);
    if (system.transit?.player) system.transit.player.__headSpaceLevelNinePortalTransit = false;
    for (let i = 0; i < system.portals.length; i++) {
      removeLevelSevenRendererObject(runtimeScene, system.layerName || "", system.portals[i].graphic, false);
    }
    for (let i = 0; i < (system.planets || []).length; i++) {
      removeLevelSevenRendererObject(runtimeScene, system.layerName || "", system.planets[i].sprite, false);
    }
    if (typeof window !== "undefined") delete window.__headSpaceLevelNineSmallPlanetLayout;
    levelNineBlackHoleSystemState.delete(runtimeScene);
  }

  function ensureLevelNineBlackHoleSystem(runtimeScene) {
    let system = levelNineBlackHoleSystemState.get(runtimeScene);
    if (
      system?.portals?.length === 2 &&
      system.portals.every((portal) => !portal.graphic.destroyed) &&
      system.planets?.length === LEVEL_NINE_SMALL_PLANET_CONFIGS.length &&
      system.planets.every((planet) => !planet.sprite.destroyed)
    ) {
      return system;
    }
    if (typeof PIXI === "undefined" || typeof PIXI.Texture?.from !== "function") return null;

    clearLevelNineBlackHoleSystem(runtimeScene);
    const sourcePlanets = [
      runtimeScene.getObjects("Planet_6")[0] || null,
      runtimeScene.getObjects("Planet_3")[0] || null,
    ].filter(Boolean);
    if (sourcePlanets.length !== 2) return null;

    const layerName = sourcePlanets[0].getLayer?.() || "";
    const layer = runtimeScene.getLayer(layerName) || runtimeScene.getLayer("");
    const layerRenderer = layer?.getRenderer?.();
    if (!layerRenderer) return null;

    const endpoints = sourcePlanets
      .map((planet) => ({
        x: planet.getCenterXInScene(),
        y: planet.getCenterYInScene(),
        zOrder: Number(planet.getZOrder?.()) || 2,
      }))
      .sort((a, b) => a.x - b.x);
    const playerZOrder = Number(runtimeScene.getObjects("Player")[0]?.getZOrder?.());
    const portalZOrder = Number.isFinite(playerZOrder)
      ? playerZOrder - 0.5
      : Math.min(...endpoints.map((endpoint) => endpoint.zOrder)) - 0.5;
    const texture = PIXI.Texture.from(LEVEL_NINE_BLACK_HOLE_RESOURCE);
    const portals = [];
    for (let i = 0; i < endpoints.length; i++) {
      const graphic = createLevelNineBlackHoleGraphic(texture, i);
      if (!graphic) continue;
      graphic.position.set(endpoints[i].x, endpoints[i].y);
      layerRenderer.addRendererObject(graphic, portalZOrder);
      portals.push({ ...endpoints[i], graphic, index: i });
    }
    if (portals.length !== 2) {
      for (let i = 0; i < portals.length; i++) {
        removeLevelSevenRendererObject(runtimeScene, layerName, portals[i].graphic, false);
      }
      return null;
    }

    retireLevelNineAuthoredPlanets(runtimeScene);
    const planets = createLevelNineSmallPlanets(
      runtimeScene,
      layerRenderer,
      layerName,
      portalZOrder + 0.12,
      portals
    );
    if (planets.length !== LEVEL_NINE_SMALL_PLANET_CONFIGS.length) {
      for (let i = 0; i < planets.length; i++) {
        removeLevelSevenRendererObject(runtimeScene, layerName, planets[i].sprite, false);
      }
      for (let i = 0; i < portals.length; i++) {
        removeLevelSevenRendererObject(runtimeScene, layerName, portals[i].graphic, false);
      }
      return null;
    }
    system = {
      layerName,
      portals,
      planets,
      elapsedSeconds: 0,
      cooldownSeconds: 0,
      transit: null,
      visualRecords: [],
    };
    levelNineBlackHoleSystemState.set(runtimeScene, system);
    if (typeof window !== "undefined") {
      window.__headSpaceLevelNineSmallPlanetLayout = {
        portals: portals.map((portal) => ({ x: portal.x, y: portal.y })),
        planets: planets.map((planet) => ({
          key: planet.config.key,
          x: planet.sprite.position.x,
          y: planet.sprite.position.y,
          radius: planet.radius,
          minimumClearance: planet.minimumClearance,
        })),
      };
    }
    return system;
  }

  function animateLevelNineBlackHoles(system) {
    const tintCount = LEVEL_NINE_BLACK_HOLE_TINTS.length;
    for (let i = 0; i < system.portals.length; i++) {
      const portal = system.portals[i];
      const graphic = portal.graphic;
      const sprite = graphic.__headSpaceSprite;
      const baseSize = graphic.__headSpaceBaseSize || LEVEL_NINE_BLACK_HOLE_SIZE;
      const pulsePhase = system.elapsedSeconds * 1.85 + i * Math.PI;
      const pulse = 1 + Math.sin(pulsePhase) * 0.055 + Math.sin(pulsePhase * 0.47) * 0.018;
      portal.currentOuterRadius =
        baseSize * pulse * LEVEL_NINE_BLACK_HOLE_OUTER_EDGE_RATIO;
      sprite.rotation = system.elapsedSeconds * LEVEL_NINE_BLACK_HOLE_ROTATION_SPEED * (i === 0 ? 1 : -1);
      sprite.width = baseSize * pulse;
      sprite.height = baseSize * pulse;
      graphic.__headSpaceHalo.scale.set(0.94 + pulse * 0.07);
      graphic.__headSpaceHalo.alpha = 0.68 + Math.sin(pulsePhase * 1.3) * 0.18;

      const tintPhase = (system.elapsedSeconds * 0.22 + i * 0.5) % tintCount;
      const tintIndex = Math.floor(tintPhase);
      sprite.tint = interpolateLevelNineBlackHoleTint(
        LEVEL_NINE_BLACK_HOLE_TINTS[tintIndex],
        LEVEL_NINE_BLACK_HOLE_TINTS[(tintIndex + 1) % tintCount],
        tintPhase - tintIndex
      );

      const sparkles = graphic.__headSpaceSparkles || [];
      for (let sparkleIndex = 0; sparkleIndex < sparkles.length; sparkleIndex++) {
        const sparkle = sparkles[sparkleIndex];
        const phase =
          sparkle.__headSpacePhase +
          system.elapsedSeconds * (0.7 + (sparkleIndex % 5) * 0.075) * (i === 0 ? 1 : -1);
        const orbit = baseSize * sparkle.__headSpaceOrbit;
        sparkle.position.set(Math.cos(phase) * orbit, Math.sin(phase) * orbit * 0.82);
        sparkle.alpha = 0.18 + (Math.sin(phase * 3.4 + system.elapsedSeconds * 2.6) * 0.5 + 0.5) * 0.82;
        sparkle.scale.set(0.55 + (Math.sin(phase * 2.1) * 0.5 + 0.5) * 0.9);
      }
    }

    for (let i = 0; i < (system.planets || []).length; i++) {
      const planet = system.planets[i];
      planet.sprite.rotation = system.elapsedSeconds * planet.config.rotationSpeed + i * 0.37;
      planet.sprite.visible = true;
    }
  }

  function startLevelNinePortalTransit(runtimeScene, system, player, sourceIndex) {
    const source = system.portals[sourceIndex];
    const target = system.portals[sourceIndex === 0 ? 1 : 0];
    const velocity = getObjectVelocity(player);
    let entryDirection = getNormalizedVector(velocity.x, velocity.y);
    if (entryDirection.magnitude <= 0.001) {
      entryDirection = getNormalizedVector(
        source.x - player.getCenterXInScene(),
        source.y - player.getCenterYInScene()
      );
    }
    if (entryDirection.magnitude <= 0.001) entryDirection = { x: sourceIndex === 0 ? 1 : -1, y: 0 };

    player.__headSpaceLevelNinePortalTransit = true;
    system.transit = {
      player,
      source,
      target,
      phase: "intake",
      elapsedSeconds: 0,
      startX: player.getCenterXInScene(),
      startY: player.getCenterYInScene(),
      directionX: entryDirection.x,
      directionY: entryDirection.y,
    };
  }

  function updateLevelNinePortalTransit(runtimeScene, system, deltaSeconds, bounds) {
    const transit = system.transit;
    if (!transit?.player || transit.player.getWidth() <= 0) {
      if (transit?.player) transit.player.__headSpaceLevelNinePortalTransit = false;
      system.transit = null;
      return;
    }

    const player = transit.player;
    transit.elapsedSeconds += deltaSeconds;
    if (transit.phase === "intake") {
      const progress = clamp(transit.elapsedSeconds / LEVEL_NINE_BLACK_HOLE_INTAKE_SECONDS, 0, 1);
      const eased = progress * progress * (3 - 2 * progress);
      moveObjectToCenter(
        player,
        transit.startX + (transit.source.x - transit.startX) * eased,
        transit.startY + (transit.source.y - transit.startY) * eased
      );
      const physics = player.hasBehavior?.("Physics2") ? player.getBehavior("Physics2") : null;
      if (physics?.setLinearVelocityX) physics.setLinearVelocityX(0);
      if (physics?.setLinearVelocityY) physics.setLinearVelocityY(0);
      if (progress < 1) return;

      const arenaCenterX = (bounds.minX + bounds.maxX) * 0.5;
      const arenaCenterY = (bounds.minY + bounds.maxY) * 0.5;
      const centerDirection = getNormalizedVector(
        arenaCenterX - transit.target.x,
        arenaCenterY - transit.target.y
      );
      const launchDirection = getNormalizedVector(
        centerDirection.x * 0.72 + transit.directionX * 0.28,
        centerDirection.y * 0.72 + transit.directionY * 0.28
      );
      const playerRadius = getApproxObjectRadius(player, 24);
      const targetSize = target.graphic?.__headSpaceBaseSize || LEVEL_NINE_BLACK_HOLE_SIZE;
      const exitDistance = targetSize * LEVEL_NINE_BLACK_HOLE_EXIT_RATIO + playerRadius + 24;
      moveObjectToCenter(
        player,
        transit.target.x + launchDirection.x * exitDistance,
        transit.target.y + launchDirection.y * exitDistance
      );
      if (physics?.setLinearVelocityX) {
        physics.setLinearVelocityX(launchDirection.x * LEVEL_NINE_BLACK_HOLE_LAUNCH_SPEED);
      }
      if (physics?.setLinearVelocityY) {
        physics.setLinearVelocityY(launchDirection.y * LEVEL_NINE_BLACK_HOLE_LAUNCH_SPEED);
      }
      transit.directionX = launchDirection.x;
      transit.directionY = launchDirection.y;
      transit.phase = "exit";
      transit.elapsedSeconds = 0;
      return;
    }

    if (transit.elapsedSeconds >= LEVEL_NINE_BLACK_HOLE_EXIT_SECONDS) {
      player.__headSpaceLevelNinePortalTransit = false;
      system.transit = null;
      system.cooldownSeconds = LEVEL_NINE_BLACK_HOLE_COOLDOWN_SECONDS;
    }
  }

  function updateLevelNineBlackHoleSystem(runtimeScene) {
    // Multiplayer M9 is now described entirely by the shared level manifest.
    // Do not layer this retired, hard-coded planet/portal scene on top of it:
    // doing so creates a second set of invisible collision bodies and unrelated
    // planet sprites in addition to the manifest's Planet4/Planet6/Planet8.
    if (getCurrentLevel(runtimeScene) !== 9 || isMultiplayerGame(runtimeScene, 9)) {
      clearLevelNineBlackHoleSystem(runtimeScene);
      return;
    }

    const system = ensureLevelNineBlackHoleSystem(runtimeScene);
    if (!system) return;
    restoreLevelNinePortalVisuals(system);

    const paused = getSceneBoolean(runtimeScene, "Paused");
    const finished = getSceneBoolean(runtimeScene, "LevelWon") || getSceneBoolean(runtimeScene, "LevelLost");
    const rawDeltaSeconds = runtimeScene.getElapsedTime() / 1000;
    const deltaSeconds =
      !paused && !finished && Number.isFinite(rawDeltaSeconds) ? clamp(rawDeltaSeconds, 0, 0.05) : 0;
    system.elapsedSeconds += deltaSeconds;
    system.cooldownSeconds = Math.max(0, system.cooldownSeconds - deltaSeconds);
    animateLevelNineBlackHoles(system);
    if (deltaSeconds <= 0) return;
    applyLevelNineSmallPlanetCollisions(runtimeScene, system);

    const player = runtimeScene.getObjects("Player")[0] || null;
    const bounds = getBossSpawnBounds(runtimeScene, player);
    if (system.transit) {
      updateLevelNinePortalTransit(runtimeScene, system, deltaSeconds, bounds);
      return;
    }
    if (!player || system.cooldownSeconds > 0) return;

    for (let i = 0; i < system.portals.length; i++) {
      const portal = system.portals[i];
      const triggerRadius =
        portal.currentOuterRadius ||
        LEVEL_NINE_BLACK_HOLE_SIZE * LEVEL_NINE_BLACK_HOLE_OUTER_EDGE_RATIO;
      if (
        Math.hypot(
          player.getCenterXInScene() - portal.x,
          player.getCenterYInScene() - portal.y
        ) <= triggerRadius
      ) {
        startLevelNinePortalTransit(runtimeScene, system, player, i);
        break;
      }
    }
  }

  function applyBlackHolePortalPlayerVisual(runtimeScene) {
    const system =
      levelNineBlackHoleSystemState.get(runtimeScene) ||
      levelElevenCelestialSystemState.get(runtimeScene) ||
      multiplayerLevelOneFeatureState.get(runtimeScene) ||
      runtimeScene.__headSpaceSharedDeclarativeMultiplayerSystem;
    const transit = system?.transit;
    if (!transit?.player) return;

    const duration =
      transit.phase === "intake"
        ? transit.intakeSeconds || LEVEL_NINE_BLACK_HOLE_INTAKE_SECONDS
        : transit.exitSeconds || LEVEL_NINE_BLACK_HOLE_EXIT_SECONDS;
    const progress = clamp(transit.elapsedSeconds / duration, 0, 1);
    const intensity = transit.phase === "intake" ? Math.pow(progress, 1.35) : Math.pow(1 - progress, 0.82);
    const stretch = 1 + intensity * 2.15;
    const squash = 1 - intensity * 0.58;
    const spinTurns = transit.phase === "intake" ? progress * 2 : 2 + progress;
    const spinRotation = spinTurns * Math.PI * 2;

    for (const objectName of ["Player", "PlayerImage", "PlayerHelmet"]) {
      const objects = runtimeScene.getObjects(objectName);
      for (let i = 0; i < objects.length; i++) {
        const object = objects[i];
        const rendererObject = object?.getRendererObject?.();
        if (!rendererObject?.scale) continue;
        system.visualRecords.push({
          object,
          rendererObject,
          scaleX: rendererObject.scale.x,
          scaleY: rendererObject.scale.y,
          rotation: rendererObject.rotation,
          stretchX: stretch,
          stretchY: squash,
          appliedRotation: rendererObject.rotation + spinRotation,
        });
        rendererObject.rotation += spinRotation;
        rendererObject.scale.x *= stretch;
        rendererObject.scale.y *= squash;
      }
    }
  }

  function reapplyBlackHolePortalCompanionVisual(runtimeScene) {
    const system =
      levelNineBlackHoleSystemState.get(runtimeScene) ||
      levelElevenCelestialSystemState.get(runtimeScene) ||
      multiplayerLevelOneFeatureState.get(runtimeScene) ||
      runtimeScene.__headSpaceSharedDeclarativeMultiplayerSystem;
    if (!system?.transit || !system.visualRecords?.length) return;
    for (const record of system.visualRecords) {
      const objectName = record.object?.getName?.();
      if (
        (objectName !== "PlayerImage" && objectName !== "PlayerHelmet") ||
        !record.rendererObject?.scale
      ) continue;
      record.rendererObject.scale.x *= record.stretchX;
      record.rendererObject.scale.y *= record.stretchY;
      record.rendererObject.rotation = record.appliedRotation;
    }
  }

  function createLevelTenCollisionProxy(body) {
    return {
      getCenterXInScene: () => body.x,
      getCenterYInScene: () => body.y,
      getWidth: () => body.radius * 2,
      getHeight: () => body.radius * 2,
      getUniqueId: () => `level-ten-${body.key}`,
      getName: () => "LevelTenSolarBody",
    };
  }

  function configureLevelTenRoundArena(runtimeScene) {
    const walls = runtimeScene.getObjects("Walls");
    const isMultiplayerLevelThree =
      getCurrentLevel(runtimeScene) === 3 && isMultiplayerGame(runtimeScene, 3);
    if (isMultiplayerLevelThree) {
      let creationAttempts = 0;
      while (
        walls.length < LEVEL_TEN_ARENA_WALL_SEGMENTS &&
        creationAttempts < LEVEL_TEN_ARENA_WALL_SEGMENTS
      ) {
        creationAttempts += 1;
        const wall = createSceneObject(runtimeScene, "Walls", "");
        if (!wall) break;
        if (!walls.includes(wall)) walls.push(wall);
      }
    }

    const activeWalls = [];
    for (let i = 0; i < walls.length; i++) {
      const wall = walls[i];
      if (i >= LEVEL_TEN_ARENA_WALL_SEGMENTS) {
        if (wall.deleteFromScene) wall.deleteFromScene();
        continue;
      }

      const angle = (i / LEVEL_TEN_ARENA_WALL_SEGMENTS) * Math.PI * 2 - Math.PI * 0.5;
      const x = LEVEL_TEN_ARENA_CENTER_X + Math.cos(angle) * LEVEL_TEN_ARENA_RADIUS;
      const y = LEVEL_TEN_ARENA_CENTER_Y + Math.sin(angle) * LEVEL_TEN_ARENA_RADIUS;
      if (wall.hide) wall.hide(false);
      if (getCurrentLevel(runtimeScene) === 3 && isMultiplayerGame(runtimeScene, 3)) {
        wall.__headSpaceMultiplayerMazeWall = true;
        wall.__headSpaceMultiplayerLevelThreeBorderWall = true;
        wall.__headSpaceLevelTenArenaWall = true;
        wall.setOpacity?.(190);
      }
      if (wall.setSize) wall.setSize(LEVEL_TEN_ARENA_WALL_WIDTH, LEVEL_TEN_ARENA_WALL_LENGTH);
      if (wall.setAngle) wall.setAngle((angle * 180) / Math.PI + 180);
      moveObjectToCenter(wall, x, y);
      if (wall.hasBehavior?.("Physics2")) {
        const physics = wall.getBehavior("Physics2");
        if (physics.setStatic) physics.setStatic();
        if (physics.setLinearVelocityX) physics.setLinearVelocityX(0);
        if (physics.setLinearVelocityY) physics.setLinearVelocityY(0);
        if (physics.setAngularVelocity) physics.setAngularVelocity(0);
      }
      activeWalls.push(wall);
    }
    return activeWalls;
  }

  function maintainLevelTenRoundArena(runtimeScene, system) {
    const activeWalls = system?.activeWalls || [];
    const activeSet = new Set(activeWalls);
    const walls = runtimeScene.getObjects("Walls").slice();
    for (const wall of walls) {
      if (activeSet.has(wall)) continue;
      if (wall.deleteFromScene) wall.deleteFromScene();
    }

    for (let i = 0; i < activeWalls.length; i++) {
      const wall = activeWalls[i];
      const angle = (i / LEVEL_TEN_ARENA_WALL_SEGMENTS) * Math.PI * 2 - Math.PI * 0.5;
      if (wall.setSize) wall.setSize(LEVEL_TEN_ARENA_WALL_WIDTH, LEVEL_TEN_ARENA_WALL_LENGTH);
      if (wall.setAngle) wall.setAngle((angle * 180) / Math.PI + 180);
      moveObjectToCenter(
        wall,
        LEVEL_TEN_ARENA_CENTER_X + Math.cos(angle) * LEVEL_TEN_ARENA_RADIUS,
        LEVEL_TEN_ARENA_CENTER_Y + Math.sin(angle) * LEVEL_TEN_ARENA_RADIUS
      );
    }
  }

  function retireLevelTenAuthoredPlanets(runtimeScene) {
    for (const objectName of PLANET_NAMES) {
      const planets = runtimeScene.getObjects(objectName);
      for (let i = 0; i < planets.length; i++) {
        const planet = planets[i];
        if (planet.hide) planet.hide(true);
        if (planet.setSize) planet.setSize(1, 1);
        moveObjectToCenter(planet, -100000, -100000);
        if (planet.hasBehavior?.("Physics2")) {
          const physics = planet.getBehavior("Physics2");
          if (physics.setShapeScale) physics.setShapeScale(0.001);
          if (physics.setLinearVelocityX) physics.setLinearVelocityX(0);
          if (physics.setLinearVelocityY) physics.setLinearVelocityY(0);
        }
        if (planet.deleteFromScene) planet.deleteFromScene();
      }
    }
  }

  function remapLevelTenActors(runtimeScene, system) {
    const player = runtimeScene.getObjects("Player")[0] || null;
    if (player) {
      moveObjectToCenter(player, LEVEL_TEN_ARENA_CENTER_X - 860, LEVEL_TEN_ARENA_CENTER_Y);
      clearObjectMotion(player);
    }

    const bosses = runtimeScene
      .getObjects("SmartEnemy")
      .filter((boss) => boss && boss.getWidth?.() > 0 && boss.getHeight?.() > 0);
    for (let i = 0; i < bosses.length; i++) {
      if (i === 0 && player) {
        moveObjectToCenter(
          bosses[i],
          player.getCenterXInScene() - 120,
          player.getCenterYInScene() - 260
        );
      } else {
        const angle = (i / Math.max(1, bosses.length)) * Math.PI * 2;
        moveObjectToCenter(
          bosses[i],
          LEVEL_TEN_ARENA_CENTER_X + Math.cos(angle) * 1050,
          LEVEL_TEN_ARENA_CENTER_Y + Math.sin(angle) * 1050
        );
      }
      clearObjectMotion(bosses[i]);
    }

    const enemies = runtimeScene
      .getObjects("Enemy")
      .filter((enemy) => enemy && enemy.getWidth?.() > 0 && enemy.getHeight?.() > 0);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const fixedBlockers = [];
    if (player) {
      fixedBlockers.push({
        x: player.getCenterXInScene(),
        y: player.getCenterYInScene(),
        radius: getApproxObjectRadius(player, 30),
        clearance: LEVEL_TEN_ACTOR_START_CLEARANCE,
      });
    }
    for (const boss of bosses) {
      fixedBlockers.push({
        x: boss.getCenterXInScene(),
        y: boss.getCenterYInScene(),
        radius: getApproxObjectRadius(boss, 30),
        clearance: LEVEL_TEN_ACTOR_START_CLEARANCE,
      });
    }
    for (const body of system?.bodies || []) {
      fixedBlockers.push({
        x: body.x,
        y: body.y,
        radius: body.radius,
        clearance: 36,
      });
    }
    const placedEnemies = [];
    for (let i = 0; i < enemies.length; i++) {
      const progress = (i + 0.5) / Math.max(1, enemies.length);
      const baseRadius = 1080 + Math.sqrt(progress) * 980;
      const baseAngle = i * goldenAngle + 0.82;
      const enemy = enemies[i];
      const enemyRadius = getApproxObjectRadius(enemy, 24);
      let bestCandidate = null;
      let bestGap = -Infinity;
      for (let candidateIndex = 0; candidateIndex < 48; candidateIndex++) {
        const angle = baseAngle + (candidateIndex / 48) * Math.PI * 2;
        const radiusOffset = ((candidateIndex % 3) - 1) * 70;
        const radius = clamp(
          baseRadius + radiusOffset,
          1040,
          LEVEL_TEN_ARENA_RADIUS - LEVEL_TEN_ARENA_WALL_WIDTH - enemyRadius - 70
        );
        const x = LEVEL_TEN_ARENA_CENTER_X + Math.cos(angle) * radius;
        const y = LEVEL_TEN_ARENA_CENTER_Y + Math.sin(angle) * radius;
        let nearestGap = Infinity;
        for (const blocker of [...fixedBlockers, ...placedEnemies]) {
          const gap =
            Math.hypot(x - blocker.x, y - blocker.y) -
            enemyRadius -
            blocker.radius -
            blocker.clearance;
          nearestGap = Math.min(nearestGap, gap);
        }
        if (nearestGap > bestGap) {
          bestGap = nearestGap;
          bestCandidate = { x, y };
        }
      }
      if (bestCandidate) moveObjectToCenter(enemy, bestCandidate.x, bestCandidate.y);
      clearObjectMotion(enemy);
      placedEnemies.push({
        x: enemy.getCenterXInScene(),
        y: enemy.getCenterYInScene(),
        radius: enemyRadius,
        clearance: 28,
      });
    }
  }

  function ensureLevelTenExtraSmallEnemies(runtimeScene, system) {
    if (!system || system.extraSmallEnemiesSeeded) return;
    const player = runtimeScene.getObjects("Player")[0] || null;
    if (!player || player.getWidth() <= 0) return;
    system.extraSmallEnemiesSeeded = true;
    system.extraSmallEnemies = [];
    const playerSize = Math.max(1, Math.min(player.getWidth(), player.getHeight()));
    const maximumSize = Math.max(24, playerSize - Math.max(16, playerSize * 0.12));
    const layerName = player.getLayer?.() || "";
    const existingCount = runtimeScene.getObjects("Enemy").length;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < LEVEL_TEN_EXTRA_SMALL_ENEMY_COUNT; i++) {
      const enemy = createSceneObject(runtimeScene, "Enemy", layerName);
      if (!enemy) continue;
      const ratio = LEVEL_TEN_EXTRA_SMALL_ENEMY_SIZE_RATIOS[i % LEVEL_TEN_EXTRA_SMALL_ENEMY_SIZE_RATIOS.length];
      const baseSize = Math.min(maximumSize, Math.max(24, playerSize * ratio));
      setObjectSizeAndShape(enemy, baseSize);
      enemy.__headSpaceLevelTenExtraSmallEnemy = true;
      enemy.__headSpaceLevelTenExtraSmallEnemyBaseSize = baseSize;

      const angle = (existingCount + i) * goldenAngle + 0.36;
      const radius = 1250 + ((existingCount + i) % 3) * 600;
      moveObjectToCenter(
        enemy,
        LEVEL_TEN_ARENA_CENTER_X + Math.cos(angle) * radius,
        LEVEL_TEN_ARENA_CENTER_Y + Math.sin(angle) * radius
      );
      if (enemy.setZOrder && player.getZOrder) enemy.setZOrder(player.getZOrder());
      clearObjectMotion(enemy);
      const image = createImageCompanionForHost(runtimeScene, enemy, "Enemy", "EnemyImage");
      system.extraSmallEnemies.push({ enemy, image, baseSize });
    }
  }

  function maintainLevelTenExtraSmallEnemySizes(runtimeScene) {
    if (!usesLevelTenRuntime(runtimeScene)) return;
    const player = runtimeScene.getObjects("Player")[0] || null;
    if (!player || player.getWidth() <= 0) return;
    const playerSize = Math.max(1, Math.min(player.getWidth(), player.getHeight()));
    const maximumSize = Math.max(18, playerSize - Math.max(14, playerSize * 0.1));
    const activeEnemies = new Set(runtimeScene.getObjects("Enemy"));
    const records = levelTenSolarSystemState.get(runtimeScene)?.extraSmallEnemies || [];
    for (const record of records) {
      if (!record?.enemy || !activeEnemies.has(record.enemy)) continue;
      const targetSize = Math.min(record.baseSize, maximumSize);
      if (Math.abs(record.enemy.getWidth() - targetSize) > 0.25) {
        setObjectSizeAndShape(record.enemy, targetSize);
      }
    }
  }

  function updateLevelTenEnemyOrbits(runtimeScene, system, isMoving) {
    const enemies = runtimeScene
      .getObjects("Enemy")
      .filter((enemy) => enemy && enemy.getWidth?.() > 0 && enemy.getHeight?.() > 0);
    const activeEnemies = new Set(enemies);
    system.enemyOrbits = (system.enemyOrbits || []).filter((record) =>
      activeEnemies.has(record.enemy)
    );
    const assignedEnemies = new Set(system.enemyOrbits.map((record) => record.enemy));
    const orbitRadii = [1250, 1850, 2650];
    const orbitSpeeds = [0.13, -0.095, 0.07];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (const enemy of enemies) {
      if (assignedEnemies.has(enemy)) continue;
      const ordinal = system.nextEnemyOrbitIndex || 0;
      const ring = ordinal % orbitRadii.length;
      system.enemyOrbits.push({
        enemy,
        radius: orbitRadii[ring],
        speed: orbitSpeeds[ring],
        phase: ordinal * goldenAngle + ring * 0.42,
      });
      system.nextEnemyOrbitIndex = ordinal + 1;
    }

    for (const record of system.enemyOrbits) {
      const angle = record.phase + system.elapsedSeconds * record.speed;
      const x = LEVEL_TEN_ARENA_CENTER_X + Math.cos(angle) * record.radius;
      const y = LEVEL_TEN_ARENA_CENTER_Y + Math.sin(angle) * record.radius;
      moveObjectToCenter(record.enemy, x, y);
      if (!record.enemy.hasBehavior?.("Physics2")) continue;
      const physics = record.enemy.getBehavior("Physics2");
      const velocityX = isMoving ? -Math.sin(angle) * record.radius * record.speed : 0;
      const velocityY = isMoving ? Math.cos(angle) * record.radius * record.speed : 0;
      if (physics.setLinearVelocityX) physics.setLinearVelocityX(velocityX);
      if (physics.setLinearVelocityY) physics.setLinearVelocityY(velocityY);
    }
  }

  function createLevelTenSolarBody(runtimeScene, layerRenderer, layerName, config, zOrder) {
    const sprite = new PIXI.Sprite(PIXI.Texture.from(config.resourceUrl));
    if (sprite.anchor?.set) sprite.anchor.set(0.5);
    sprite.width = config.size;
    sprite.height = config.size;
    sprite.eventMode = "none";
    layerRenderer.addRendererObject(sprite, zOrder);

    const body = {
      key: config.key,
      config,
      sprite,
      x: LEVEL_TEN_ARENA_CENTER_X,
      y: LEVEL_TEN_ARENA_CENTER_Y,
      radius: config.size * config.radiusRatio,
      velocityX: 0,
      velocityY: 0,
      layerName,
      zOrder,
      lightObstacle: config.emitsLight ? null : createLevelSixMoonLightObstacle(runtimeScene),
    };
    body.collisionProxy = createLevelTenCollisionProxy(body);
    return body;
  }

  function clearLevelTenSolarSystem(runtimeScene) {
    const system = levelTenSolarSystemState.get(runtimeScene);
    if (!system) {
      runtimeScene.__headSpaceLevelTenSolarSystemActive = false;
      return;
    }

    const activeEnemies = new Set(runtimeScene.getObjects("Enemy"));
    const activeEnemyImages = new Set(runtimeScene.getObjects("EnemyImage"));
    for (const record of system.extraSmallEnemies || []) {
      if (record.image && activeEnemyImages.has(record.image) && record.image.deleteFromScene) {
        record.image.deleteFromScene(runtimeScene);
      }
      if (record.enemy && activeEnemies.has(record.enemy) && record.enemy.deleteFromScene) {
        record.enemy.deleteFromScene(runtimeScene);
      }
    }

    for (const body of system.renderBodies || system.bodies || []) {
      if (body.lightObstacle?.behavior?.onDestroy) body.lightObstacle.behavior.onDestroy();
      removeLevelSevenRendererObject(runtimeScene, body.layerName || "", body.sprite, false);
    }
    removeLevelSevenRendererObject(runtimeScene, system.layerName || "", system.sunGlow, true);
    if (system.backgroundSprite) {
      removeLevelSevenRendererObject(runtimeScene, "Background", system.backgroundSprite, false);
    }
    if (system.sunLight) {
      if (system.sunLightWasCreated && system.sunLight.deleteFromScene) system.sunLight.deleteFromScene();
      else if (system.sunLight.hide) system.sunLight.hide(true);
    }
    for (const background of system.authoredBackgrounds || []) {
      if (background.hide) background.hide(false);
    }
    levelTenSolarSystemState.delete(runtimeScene);
    runtimeScene.__headSpaceLevelTenSolarSystemActive = false;
  }

  function ensureLevelTenSolarSystem(runtimeScene) {
    let system = levelTenSolarSystemState.get(runtimeScene);
    if (
      system?.sun &&
      system.bodies?.length === 4 &&
      system.renderBodies?.length === 4 &&
      system.renderBodies.every((body) => !body.sprite.destroyed)
    ) {
      runtimeScene.__headSpaceLevelTenSolarSystemActive = true;
      return system;
    }
    if (typeof PIXI === "undefined" || typeof PIXI.Texture?.from !== "function") return null;
    clearLevelTenSolarSystem(runtimeScene);

    const baseLayer = runtimeScene.getLayer("");
    const baseLayerRenderer = baseLayer?.getRenderer?.();
    const textureLayer = runtimeScene.getLayer("Texture") || baseLayer;
    const textureLayerRenderer = textureLayer?.getRenderer?.();
    if (!baseLayerRenderer || !textureLayerRenderer) return null;

    const activeWalls = configureLevelTenRoundArena(runtimeScene);
    retireLevelTenAuthoredPlanets(runtimeScene);
    const sunConfig = {
      key: "sun",
      resourceUrl: "thesun.png",
      size: LEVEL_TEN_SUN_SIZE,
      radiusRatio: LEVEL_TEN_SUN_RADIUS_RATIO,
      rotationSpeed: LEVEL_TEN_SUN_ROTATION_SPEED,
      emitsLight: true,
    };
    const sun = createLevelTenSolarBody(runtimeScene, textureLayerRenderer, "Texture", sunConfig, 2);
    const orbitingPlanets = LEVEL_TEN_ORBITAL_BODY_CONFIGS.map((config, index) =>
      createLevelTenSolarBody(runtimeScene, baseLayerRenderer, "", config, 2.1 + index * 0.04)
    );
    const planet11 = createLevelTenSolarBody(
      runtimeScene,
      baseLayerRenderer,
      "",
      LEVEL_TEN_PLANET11_CONFIG,
      2.24
    );
    const bodies = [sun, ...orbitingPlanets, planet11];
    const renderBodies = bodies;

    const sunGlow = createLevelSevenSteadyPlanetLight(baseLayerRenderer, 1.92, "255;255;255");
    let sunLight = runtimeScene.getObjects("Light1")[0] || null;
    const sunLightWasCreated = !sunLight;
    if (!sunLight) sunLight = createSceneObject(runtimeScene, "Light1", "Lighting");
    for (const lightName of ["Light2", "Light3", "Light4"]) {
      const lights = runtimeScene.getObjects(lightName);
      for (const light of lights) {
        if (light.hide) light.hide(true);
        if (light.deleteFromScene) light.deleteFromScene();
      }
    }

    system = {
      layerName: "",
      backgroundSprite: null,
      authoredBackgrounds: [],
      activeWalls,
      sun,
      orbitingPlanets,
      planet14: orbitingPlanets.find((body) => body.key === "planet14") || null,
      planet11,
      bodies,
      renderBodies,
      sunGlow,
      sunLight,
      sunLightWasCreated,
      elapsedSeconds: 0,
      enemyOrbits: [],
      nextEnemyOrbitIndex: 0,
      extraSmallEnemies: [],
      extraSmallEnemiesSeeded: false,
    };
    levelTenSolarSystemState.set(runtimeScene, system);
    runtimeScene.__headSpaceLevelTenSolarSystemActive = true;
    return system;
  }

  function updateLevelTenBodyPose(
    runtimeScene,
    body,
    x,
    y,
    velocityX,
    velocityY,
    elapsedSeconds
  ) {
    body.x = x;
    body.y = y;
    body.velocityX = velocityX;
    body.velocityY = velocityY;
    body.sprite.position.set(x, y);
    body.sprite.rotation = elapsedSeconds * (body.config.rotationSpeed || 0);
    body.sprite.width = body.config.size;
    body.sprite.height = body.config.size;
    body.sprite.visible = true;
    body.sprite.renderable = true;
    body.sprite.alpha = 1;
    updateLevelSixMoonLightObstacle(body.lightObstacle, x, y, body.radius, runtimeScene);
  }

  function updateLevelTenSolarBodyOrbits(runtimeScene, system) {
    const elapsedSeconds = system.elapsedSeconds;
    updateLevelTenBodyPose(
      runtimeScene,
      system.sun,
      LEVEL_TEN_ARENA_CENTER_X,
      LEVEL_TEN_ARENA_CENTER_Y,
      0,
      0,
      elapsedSeconds
    );

    for (const body of system.orbitingPlanets) {
      const angle = body.config.phase + elapsedSeconds * body.config.orbitSpeed;
      const x = LEVEL_TEN_ARENA_CENTER_X + Math.cos(angle) * body.config.orbitRadius;
      const y = LEVEL_TEN_ARENA_CENTER_Y + Math.sin(angle) * body.config.orbitRadius;
      const velocityX = -Math.sin(angle) * body.config.orbitRadius * body.config.orbitSpeed;
      const velocityY = Math.cos(angle) * body.config.orbitRadius * body.config.orbitSpeed;
      updateLevelTenBodyPose(runtimeScene, body, x, y, velocityX, velocityY, elapsedSeconds);
    }

    const planet14 = system.planet14;
    if (planet14) {
      const moon = system.planet11;
      const angle = moon.config.phase + elapsedSeconds * moon.config.orbitSpeed;
      const x = planet14.x + Math.cos(angle) * moon.config.orbitRadius;
      const y = planet14.y + Math.sin(angle) * moon.config.orbitRadius;
      const velocityX =
        planet14.velocityX - Math.sin(angle) * moon.config.orbitRadius * moon.config.orbitSpeed;
      const velocityY =
        planet14.velocityY + Math.cos(angle) * moon.config.orbitRadius * moon.config.orbitSpeed;
      updateLevelTenBodyPose(runtimeScene, moon, x, y, velocityX, velocityY, elapsedSeconds);
    }
  }

  function updateLevelTenSunLight(runtimeScene, system) {
    const phase =
      (Math.sin((system.elapsedSeconds / LEVEL_TEN_SUN_LIGHT_PERIOD_SECONDS) * Math.PI * 2) + 1) *
      0.5;
    const red = 255;
    const green = Math.round(54 + (224 - 54) * phase);
    const blue = Math.round(18 + (72 - 18) * phase);
    const color = `${red};${green};${blue}`;
    const tint = (red << 16) | (green << 8) | blue;

    updateLevelSevenSteadyPlanetLight(
      system.sunGlow,
      LEVEL_TEN_ARENA_CENTER_X,
      LEVEL_TEN_ARENA_CENTER_Y,
      LEVEL_TEN_SUN_LIGHT_RADIUS
    );
    if (system.sunGlow) {
      system.sunGlow.tint = tint;
      system.sunGlow.alpha = 0.72 + phase * 0.25;
    }
    if (system.sunLight) {
      if (system.sunLight.hide) system.sunLight.hide(false);
      moveObjectToCenter(system.sunLight, LEVEL_TEN_ARENA_CENTER_X, LEVEL_TEN_ARENA_CENTER_Y);
      if (system.sunLight.setColor) system.sunLight.setColor(color);
      if (system.sunLight.setRadius) system.sunLight.setRadius(LEVEL_TEN_SUN_LIGHT_RADIUS);
    }
  }

  function ensureLevelTenStartLayout(runtimeScene, state, system, phase = "pre") {
    const flag = phase === "post" ? "levelTenPostStartLayoutApplied" : "levelTenStartLayoutApplied";
    if (!state || !usesLevelTenRuntime(runtimeScene, state.level) || state[flag] || !system) return;
    const player = runtimeScene.getObjects("Player")[0] || null;
    const boss = runtimeScene.getObjects("SmartEnemy")[0] || null;
    if (!player || !boss) return;

    updateLevelTenSolarBodyOrbits(runtimeScene, system);
    updateLevelTenSunLight(runtimeScene, system);
    remapLevelTenActors(runtimeScene, system);
    state.bossSpawnAdjusted = true;
    state[flag] = true;
  }

  function getLevelTenActors(runtimeScene) {
    const actors = [];
    for (const objectName of ["Player", "SmartEnemy", "Enemy"]) {
      const objects = runtimeScene.getObjects(objectName);
      for (const object of objects) {
        if (object?.getWidth?.() > 0 && object?.getHeight?.() > 0) actors.push(object);
      }
    }
    return actors;
  }

  function applyLevelTenSolarBodyCollisions(runtimeScene, system) {
    const actors = getLevelTenActors(runtimeScene);
    for (let actorIndex = 0; actorIndex < actors.length; actorIndex++) {
      const actor = actors[actorIndex];
      const actorRadius = getApproxObjectRadius(actor, 10);
      for (let bodyIndex = 0; bodyIndex < system.bodies.length; bodyIndex++) {
        const body = system.bodies[bodyIndex];
        const contactDistance = body.radius + actorRadius + LEVEL_TEN_SOLAR_COLLISION_PADDING;
        let dx = actor.getCenterXInScene() - body.x;
        let dy = actor.getCenterYInScene() - body.y;
        let distance = Math.hypot(dx, dy);
        if (distance >= contactDistance) continue;
        if (distance <= 0.001) {
          const fallbackAngle = actorIndex * 1.71 + bodyIndex * 2.13;
          dx = Math.cos(fallbackAngle);
          dy = Math.sin(fallbackAngle);
          distance = 1;
        }

        const normalX = dx / distance;
        const normalY = dy / distance;
        moveObjectToCenter(actor, body.x + normalX * contactDistance, body.y + normalY * contactDistance);
        if (!actor.hasBehavior?.("Physics2")) continue;

        const physics = actor.getBehavior("Physics2");
        const velocity = getObjectVelocity(actor);
        const relativeX = velocity.x - body.velocityX;
        const relativeY = velocity.y - body.velocityY;
        const radialVelocity = relativeX * normalX + relativeY * normalY;
        const tangentX = relativeX - normalX * radialVelocity;
        const tangentY = relativeY - normalY * radialVelocity;
        const reflectedSpeed =
          radialVelocity < 0 ? -radialVelocity * LEVEL_TEN_SOLAR_RESTITUTION : radialVelocity;
        const outwardSpeed = clamp(
          Math.max(LEVEL_TEN_SOLAR_MIN_BOUNCE_SPEED, reflectedSpeed),
          LEVEL_TEN_SOLAR_MIN_BOUNCE_SPEED,
          LEVEL_TEN_SOLAR_MAX_BOUNCE_SPEED
        );
        if (physics.setLinearVelocityX) {
          physics.setLinearVelocityX(body.velocityX + tangentX + normalX * outwardSpeed);
        }
        if (physics.setLinearVelocityY) {
          physics.setLinearVelocityY(body.velocityY + tangentY + normalY * outwardSpeed);
        }
      }
    }
  }

  function applyLevelTenRoundArenaBoundary(runtimeScene) {
    const actors = getLevelTenActors(runtimeScene);
    for (const actor of actors) {
      const actorRadius = getApproxObjectRadius(actor, 10);
      const maxDistance =
        LEVEL_TEN_ARENA_RADIUS - LEVEL_TEN_ARENA_WALL_WIDTH * 0.5 - actorRadius;
      let dx = actor.getCenterXInScene() - LEVEL_TEN_ARENA_CENTER_X;
      let dy = actor.getCenterYInScene() - LEVEL_TEN_ARENA_CENTER_Y;
      const distance = Math.hypot(dx, dy);
      if (distance <= maxDistance || distance <= 0.001) continue;

      const normalX = dx / distance;
      const normalY = dy / distance;
      moveObjectToCenter(
        actor,
        LEVEL_TEN_ARENA_CENTER_X + normalX * maxDistance,
        LEVEL_TEN_ARENA_CENTER_Y + normalY * maxDistance
      );
      if (!actor.hasBehavior?.("Physics2")) continue;
      const physics = actor.getBehavior("Physics2");
      const velocity = getObjectVelocity(actor);
      const outwardVelocity = velocity.x * normalX + velocity.y * normalY;
      if (outwardVelocity <= 0) continue;
      const tangentX = velocity.x - normalX * outwardVelocity;
      const tangentY = velocity.y - normalY * outwardVelocity;
      if (physics.setLinearVelocityX) {
        physics.setLinearVelocityX(tangentX - normalX * outwardVelocity * LEVEL_TEN_ARENA_RESTITUTION);
      }
      if (physics.setLinearVelocityY) {
        physics.setLinearVelocityY(tangentY - normalY * outwardVelocity * LEVEL_TEN_ARENA_RESTITUTION);
      }
    }
  }

  function updateLevelTenSolarSystem(runtimeScene) {
    if (!usesLevelTenRuntime(runtimeScene)) {
      clearLevelTenSolarSystem(runtimeScene);
      return;
    }

    const system = ensureLevelTenSolarSystem(runtimeScene);
    if (!system) return;
    maintainLevelTenRoundArena(runtimeScene, system);
    retireLevelTenAuthoredPlanets(runtimeScene);
    ensureLevelTenExtraSmallEnemies(runtimeScene, system);
    const paused = getSceneBoolean(runtimeScene, "Paused");
    const finished = getSceneBoolean(runtimeScene, "LevelWon") || getSceneBoolean(runtimeScene, "LevelLost");
    const rawDeltaSeconds = runtimeScene.getElapsedTime() / 1000;
    const deltaSeconds =
      !paused && !finished && Number.isFinite(rawDeltaSeconds) ? clamp(rawDeltaSeconds, 0, 0.05) : 0;
    system.elapsedSeconds += deltaSeconds;
    updateLevelTenSolarBodyOrbits(runtimeScene, system);
    updateLevelTenSunLight(runtimeScene, system);
    updateLevelTenEnemyOrbits(runtimeScene, system, deltaSeconds > 0);
    if (deltaSeconds <= 0) return;
    applyLevelTenSolarBodyCollisions(runtimeScene, system);
    applyLevelTenRoundArenaBoundary(runtimeScene);
  }

  function createLevelElevenCollisionProxy(body, key) {
    return {
      getCenterXInScene: () => body.x,
      getCenterYInScene: () => body.y,
      getWidth: () => body.radius * 2,
      getHeight: () => body.radius * 2,
      getUniqueId: () => `level-eleven-${key}`,
      getName: () => "LevelElevenOrbitalBody",
    };
  }

  function createLevelTwelvePlanetBody(
    layerRenderer,
    key,
    resourceUrl,
    size,
    radius,
    zOrder
  ) {
    const body = {
      key,
      sprite: createLevelSelectSprite(layerRenderer, resourceUrl, size, 0, 0, zOrder),
      x: 0,
      y: 0,
      radius,
      velocityX: 0,
      velocityY: 0,
    };
    body.sprite.blendMode = PIXI.BLEND_MODES.NORMAL;
    body.sprite.filters = null;
    body.sprite.__headSpaceEmitsLight = false;
    body.collisionProxy = createLevelElevenCollisionProxy(body, `level12-${key}`);
    return body;
  }

  function createLevelTwelvePlanetSystems(layerRenderer, centerX, centerY, arenaVertices, apothem) {
    if (!arenaVertices?.length) return [];
    const pointDirectionClearance = Math.cos(Math.PI / 6);
    const planet10TravelRadius = Math.max(
      600,
      (apothem -
        LEVEL_TWELVE_PLANET10_RADIUS -
        LEVEL_TWELVE_PLANET1_ORBIT_RADIUS -
        LEVEL_TWELVE_PLANET1_RADIUS -
        70) /
        pointDirectionClearance
    );
    const planet14TravelRadius = Math.max(
      600,
      (apothem -
        LEVEL_TWELVE_PLANET14_RADIUS -
        LEVEL_TWELVE_PLANET6_ORBIT_RADIUS -
        LEVEL_TWELVE_PLANET6_RADIUS -
        70) /
        pointDirectionClearance
    );
    const insetPoint = (vertexIndex, distance) => {
      const vertex = arenaVertices[vertexIndex];
      const direction = getNormalizedVector(vertex.x - centerX, vertex.y - centerY);
      return {
        x: centerX + direction.x * distance,
        y: centerY + direction.y * distance,
      };
    };

    const planet10 = createLevelTwelvePlanetBody(
      layerRenderer,
      "planet10",
      "Planet10.png?v=level12-transit-20260707-1",
      LEVEL_TWELVE_PLANET10_SIZE,
      LEVEL_TWELVE_PLANET10_RADIUS,
      2.04
    );
    const planet1 = createLevelTwelvePlanetBody(
      layerRenderer,
      "planet1",
      "Planet1.png?v=level12-moon-20260707-1",
      LEVEL_TWELVE_PLANET1_SIZE,
      LEVEL_TWELVE_PLANET1_RADIUS,
      2.06
    );
    const planet14 = createLevelTwelvePlanetBody(
      layerRenderer,
      "planet14",
      "Planet14.png?v=level12-transit-20260707-1",
      LEVEL_TWELVE_PLANET14_SIZE,
      LEVEL_TWELVE_PLANET14_RADIUS,
      2.05
    );
    const planet6 = createLevelTwelvePlanetBody(
      layerRenderer,
      "planet6",
      "Planet6.png?v=level12-moon-20260707-1",
      LEVEL_TWELVE_PLANET6_SIZE,
      LEVEL_TWELVE_PLANET6_RADIUS,
      2.07
    );

    return [
      {
        primary: planet10,
        moon: planet1,
        pathStart: insetPoint(0, planet10TravelRadius),
        pathEnd: insetPoint(3, planet10TravelRadius),
        pathPhase: 0,
        moonOrbitRadius: LEVEL_TWELVE_PLANET1_ORBIT_RADIUS,
        moonOrbitSpeed: LEVEL_TWELVE_PLANET1_ORBIT_SPEED,
        moonPhase: 0,
      },
      {
        primary: planet14,
        moon: planet6,
        pathStart: insetPoint(1, planet14TravelRadius),
        pathEnd: insetPoint(4, planet14TravelRadius),
        pathPhase: Math.PI * 0.5,
        moonOrbitRadius: LEVEL_TWELVE_PLANET6_ORBIT_RADIUS,
        moonOrbitSpeed: LEVEL_TWELVE_PLANET6_ORBIT_SPEED,
        moonPhase: Math.PI,
      },
    ];
  }

  function updateLevelTwelvePlanetSystems(system) {
    if (!system.levelTwelvePlanetSystems?.length) return;
    const transitSpeed = (Math.PI * 2) / LEVEL_TWELVE_TRANSIT_PERIOD_SECONDS;
    for (let index = 0; index < system.levelTwelvePlanetSystems.length; index++) {
      const planetSystem = system.levelTwelvePlanetSystems[index];
      const transitAngle = system.elapsedSeconds * transitSpeed + planetSystem.pathPhase;
      const amount = (1 - Math.cos(transitAngle)) * 0.5;
      const amountVelocity = Math.sin(transitAngle) * transitSpeed * 0.5;
      const pathX = planetSystem.pathEnd.x - planetSystem.pathStart.x;
      const pathY = planetSystem.pathEnd.y - planetSystem.pathStart.y;
      const primary = planetSystem.primary;
      primary.x = planetSystem.pathStart.x + pathX * amount;
      primary.y = planetSystem.pathStart.y + pathY * amount;
      primary.velocityX = pathX * amountVelocity;
      primary.velocityY = pathY * amountVelocity;
      primary.sprite.position.set(primary.x, primary.y);
      primary.sprite.rotation = system.elapsedSeconds * (index === 0 ? 0.045 : -0.04);

      const moon = planetSystem.moon;
      const moonAngle = system.elapsedSeconds * planetSystem.moonOrbitSpeed + planetSystem.moonPhase;
      const cosine = Math.cos(moonAngle);
      const sine = Math.sin(moonAngle);
      moon.x = primary.x + cosine * planetSystem.moonOrbitRadius;
      moon.y = primary.y + sine * planetSystem.moonOrbitRadius;
      moon.velocityX =
        primary.velocityX - sine * planetSystem.moonOrbitRadius * planetSystem.moonOrbitSpeed;
      moon.velocityY =
        primary.velocityY + cosine * planetSystem.moonOrbitRadius * planetSystem.moonOrbitSpeed;
      moon.sprite.position.set(moon.x, moon.y);
      moon.sprite.rotation = system.elapsedSeconds * (index === 0 ? -0.11 : 0.13);
    }
  }

  function createLevelTwelveEyeSystem(layerRenderer, centerX, centerY) {
    const planet8 = createLevelTwelvePlanetBody(
      layerRenderer,
      "planet8",
      "Planet8.png?v=level12-eye-center-20260805-1",
      LEVEL_TWELVE_EYE_PLANET8_SIZE,
      LEVEL_TWELVE_EYE_PLANET8_RADIUS,
      2.08
    );
    const planet11 = createLevelTwelvePlanetBody(
      layerRenderer,
      "planet11",
      "Planet11.png?v=level12-eye-moon-20260805-1",
      LEVEL_TWELVE_EYE_PLANET11_SIZE,
      LEVEL_TWELVE_EYE_PLANET11_RADIUS,
      2.09
    );
    const planet3 = createLevelTwelvePlanetBody(
      layerRenderer,
      "planet3",
      "Planet3.png?v=level12-eye-moon-20260805-1",
      LEVEL_TWELVE_EYE_PLANET3_SIZE,
      LEVEL_TWELVE_EYE_PLANET3_RADIUS,
      2.1
    );
    planet8.x = centerX;
    planet8.y = centerY;
    planet8.sprite.position.set(centerX, centerY);
    return { planet8, moons: [planet11, planet3] };
  }

  function updateLevelTwelveEyeSystem(system) {
    const eyeSystem = system.levelTwelveEyeSystem;
    if (!eyeSystem) return;
    const planet8 = eyeSystem.planet8;
    planet8.x = system.centerX;
    planet8.y = system.centerY;
    planet8.velocityX = 0;
    planet8.velocityY = 0;
    planet8.sprite.position.set(planet8.x, planet8.y);
    planet8.sprite.rotation = system.elapsedSeconds * 0.035;

    const moonConfigs = [
      {
        orbitRadius: LEVEL_TWELVE_EYE_PLANET11_ORBIT_RADIUS,
        orbitSpeed: LEVEL_TWELVE_EYE_PLANET11_ORBIT_SPEED,
        phase: 0,
        rotationSpeed: -0.12,
      },
      {
        orbitRadius: LEVEL_TWELVE_EYE_PLANET3_ORBIT_RADIUS,
        orbitSpeed: LEVEL_TWELVE_EYE_PLANET3_ORBIT_SPEED,
        phase: Math.PI,
        rotationSpeed: 0.14,
      },
    ];
    for (let index = 0; index < eyeSystem.moons.length; index++) {
      const moon = eyeSystem.moons[index];
      const config = moonConfigs[index];
      const angle = config.phase + system.elapsedSeconds * config.orbitSpeed;
      const cosine = Math.cos(angle);
      const sine = Math.sin(angle);
      moon.x = planet8.x + cosine * config.orbitRadius;
      moon.y = planet8.y + sine * config.orbitRadius;
      moon.velocityX = -sine * config.orbitRadius * config.orbitSpeed;
      moon.velocityY = cosine * config.orbitRadius * config.orbitSpeed;
      moon.sprite.position.set(moon.x, moon.y);
      moon.sprite.rotation = system.elapsedSeconds * config.rotationSpeed;
    }
  }

  function createLevelTwelveCosmicAlienVisual(system, x, y, size) {
    if (!system?.layerRenderer || typeof PIXI === "undefined" || typeof PIXI.Sprite !== "function") {
      return null;
    }

    const texture = PIXI.Texture.from(LEVEL_TWELVE_COSMIC_ALIEN_RESOURCE);
    const sprite = new PIXI.Sprite(texture);
    if (sprite.anchor?.set) sprite.anchor.set(0.5);
    sprite.width = size;
    sprite.height = size;
    sprite.position.set(x, y);
    sprite.eventMode = "none";
    sprite.blendMode = PIXI.BLEND_MODES.NORMAL;
    sprite.filters = null;
    sprite.__headSpaceEmitsLight = false;
    system.layerRenderer.addRendererObject(sprite, 2.185);

    const sparkleGraphics =
      typeof PIXI.Graphics === "function" ? new PIXI.Graphics() : null;
    if (sparkleGraphics) {
      sparkleGraphics.position.set(x, y);
      sparkleGraphics.eventMode = "none";
      sparkleGraphics.blendMode = PIXI.BLEND_MODES.ADD;
      sparkleGraphics.__headSpaceEmitsLight = false;
      system.layerRenderer.addRendererObject(sparkleGraphics, 2.195);
    }

    const sparkles = [];
    for (let i = 0; i < LEVEL_TWELVE_COSMIC_ALIEN_SPARKLE_COUNT; i++) {
      const angle = i * 2.399963229728653;
      sparkles.push({
        angle,
        distanceRatio: 0.18 + ((i * 37) % 100) / 100 * 0.45,
        phase: i * 0.73,
        twinkleSpeed: 1.15 + ((i * 19) % 100) / 100 * 1.85,
        sizeRatio: 0.012 + ((i * 11) % 100) / 100 * 0.018,
      });
    }

    return { sprite, sparkleGraphics, sparkles };
  }

  function cleanupLevelTwelveCosmicAlien(runtimeScene, system, record, deleteHost = false) {
    if (!record) return;
    if (record.visual?.sprite) {
      removeLevelSevenRendererObject(runtimeScene, system.layerName || "", record.visual.sprite, false);
    }
    if (record.visual?.sparkleGraphics) {
      removeLevelSevenRendererObject(
        runtimeScene,
        system.layerName || "",
        record.visual.sparkleGraphics,
        false
      );
    }
    if (deleteHost && record.enemy?.deleteFromScene) record.enemy.deleteFromScene(runtimeScene);
    record.visual = null;
  }

  function getLevelTwelveCosmicAlienPulseColor(elapsedSeconds, phase = 0) {
    const colors = LEVEL_TWELVE_COSMIC_ALIEN_PULSE_COLORS;
    const colorCount = colors.length;
    const colorPhase =
      ((elapsedSeconds * LEVEL_TWELVE_COSMIC_ALIEN_PULSE_SEGMENTS_PER_SECOND + phase * 0.21) %
        colorCount +
        colorCount) %
      colorCount;
    const colorIndex = Math.floor(colorPhase);
    const nextColorIndex = (colorIndex + 1) % colorCount;
    const colorAmount = 0.5 - Math.cos((colorPhase - colorIndex) * Math.PI) * 0.5;
    return interpolateLevelNineBlackHoleTint(
      colors[colorIndex],
      colors[nextColorIndex],
      colorAmount
    );
  }

  function updateLevelTwelveCosmicAlienVisual(record, elapsedSeconds) {
    const enemy = record?.enemy;
    const visual = record?.visual;
    if (!enemy || !visual?.sprite || visual.sprite.destroyed) return;

    const x = enemy.getCenterXInScene();
    const y = enemy.getCenterYInScene();
    const size = Math.max(1, enemy.getWidth()) * 1.1;
    const pulse = 1 + Math.sin(elapsedSeconds * 2.35 + record.phase) * 0.025;
    visual.sprite.position.set(x, y);
    visual.sprite.width = size * pulse;
    visual.sprite.height = size * pulse;
    visual.sprite.rotation = Math.sin(elapsedSeconds * 0.72 + record.phase) * 0.035;
    visual.sprite.alpha = 0.94 + Math.sin(elapsedSeconds * 1.7 + record.phase) * 0.045;
    const pulseColor = getLevelTwelveCosmicAlienPulseColor(elapsedSeconds, record.phase);
    const secondaryPulseColor = getLevelTwelveCosmicAlienPulseColor(
      elapsedSeconds,
      record.phase + 3.7
    );
    const tertiaryPulseColor = getLevelTwelveCosmicAlienPulseColor(
      elapsedSeconds,
      record.phase + 7.4
    );
    visual.sprite.tint = pulseColor;

    const graphics = visual.sparkleGraphics;
    if (!graphics) return;
    graphics.position.set(x, y);
    graphics.clear();
    const glowPulse = 0.5 + Math.sin(elapsedSeconds * 2.1 + record.phase) * 0.5;
    const ringFade = 0.5 -
      Math.cos((elapsedSeconds * 0.42 + record.phase * 0.07) * Math.PI * 2) * 0.5;
    graphics.beginFill(pulseColor, (0.1 + glowPulse * 0.06) * ringFade);
    graphics.drawCircle(0, 0, size * (0.66 + glowPulse * 0.05));
    graphics.endFill();
    graphics.beginFill(
      secondaryPulseColor,
      (0.055 + (1 - glowPulse) * 0.04) * ringFade
    );
    graphics.drawCircle(0, 0, size * 0.84);
    graphics.endFill();
    graphics.lineStyle(
      Math.max(1.2, size * 0.026),
      tertiaryPulseColor,
      0.28 * ringFade
    );
    graphics.drawCircle(0, 0, size * 0.62);
    graphics.lineStyle(Math.max(1, size * 0.018), pulseColor, 0.44 * ringFade);
    graphics.drawCircle(0, 0, size * 0.49);
    for (let i = 0; i < visual.sparkles.length; i++) {
      const sparkle = visual.sparkles[i];
      const twinkle =
        (1 + Math.sin(elapsedSeconds * sparkle.twinkleSpeed + sparkle.phase)) * 0.5;
      const alpha = 0.18 + twinkle * 0.62;
      const orbitAngle = sparkle.angle + Math.sin(elapsedSeconds * 0.23 + sparkle.phase) * 0.18;
      const distance = size * sparkle.distanceRatio;
      const sx = Math.cos(orbitAngle) * distance;
      const sy = Math.sin(orbitAngle) * distance;
      const sparkleSize = Math.max(2, size * sparkle.sizeRatio * (0.9 + twinkle * 1.05));
      const sparkleColor = getLevelTwelveCosmicAlienPulseColor(
        elapsedSeconds,
        sparkle.phase + i * 2.25
      );
      const sparkleCoreColor = i % 4 === 0 ? 0xffffff : sparkleColor;
      graphics.lineStyle(Math.max(0.8, sparkleSize * 0.22), sparkleColor, alpha);
      graphics.moveTo(sx - sparkleSize, sy);
      graphics.lineTo(sx + sparkleSize, sy);
      graphics.moveTo(sx, sy - sparkleSize);
      graphics.lineTo(sx, sy + sparkleSize);
      graphics.beginFill(sparkleCoreColor, alpha * 0.8);
      graphics.drawCircle(sx, sy, sparkleSize * 0.32);
      graphics.endFill();
    }
  }

  function createLevelTwelveCosmicAlien(runtimeScene, system) {
    try {
      if (![5, 8, 9, 11, 12].includes(system.level)) return null;
      const player = runtimeScene.getObjects("Player")[0] || null;
      if (!player || player.getWidth() <= 0) return null;
      const boss = runtimeScene.getObjects("SmartEnemy")[0] || null;
      const playerWidth = Math.max(1, player.getWidth());
      const playerSafeMaxSize = Math.max(18, playerWidth - 8);
      const targetSize = Math.min(
        playerSafeMaxSize,
        clamp(
          playerWidth * LEVEL_TWELVE_COSMIC_ALIEN_SIZE_RATIO,
          LEVEL_TWELVE_COSMIC_ALIEN_MIN_SIZE,
          LEVEL_TWELVE_COSMIC_ALIEN_MAX_SIZE
        )
      );
      const layerName = player.getLayer?.() || "";
      const blockers = runtimeScene
        .getObjects("Enemy")
        .filter((enemy) => enemy && enemy.getWidth() > 0);
      const spawnCenter = chooseBossRespawnEnemyCenter(
        runtimeScene,
        targetSize,
        player,
        boss,
        blockers
      );

      const enemy = createSceneObject(runtimeScene, "Enemy", layerName);
      if (!enemy) return null;
      enemy.__headSpaceLevelTwelveCosmicAlien = true;
      enemy.__headSpaceSuppressEnemyImage = true;
      if (enemy.setVariableBoolean && enemy.getVariables) {
        enemy.setVariableBoolean(enemy.getVariables().get("CosmicAlien"), true);
      }
      setObjectSizeAndShape(enemy, targetSize);
      moveObjectToCenter(enemy, spawnCenter.x, spawnCenter.y);
      if (enemy.setZOrder && player.getZOrder) enemy.setZOrder(player.getZOrder() + 1);
      if (enemy.hide) enemy.hide(true);
      if (enemy.setOpacity) enemy.setOpacity(0);
      if (enemy.enableEffect) enemy.enableEffect("Effect", false);
      clearObjectMotion(enemy);

      const visual = createLevelTwelveCosmicAlienVisual(
        system,
        spawnCenter.x,
        spawnCenter.y,
        targetSize * 1.1
      );
      const record = {
        enemy,
        visual,
        phase: (system.cosmicAlienSpawnIndex || 0) * 0.91,
      };
      system.cosmicAlienSpawnIndex = (system.cosmicAlienSpawnIndex || 0) + 1;
      system.cosmicAliens.push(record);
      return record;
    } catch (error) {
      if (typeof console !== "undefined" && console.warn) {
        console.warn("Level 12 cosmic alien spawn failed", error);
      }
      return null;
    }
  }

  function createLevelTwelveCosmicAlienBatch(runtimeScene, system) {
    let createdCount = 0;
    for (let i = 0; i < LEVEL_TWELVE_COSMIC_ALIEN_SPAWN_BATCH_COUNT; i++) {
      if (createLevelTwelveCosmicAlien(runtimeScene, system)) createdCount++;
    }
    return createdCount;
  }

  function updateLevelTwelveCosmicAlienSystem(runtimeScene, system, deltaSeconds) {
    if (system.level !== 11 && system.level !== 12) return;

    const liveEnemies = new Set(runtimeScene.getObjects("Enemy"));
    const activeRecords = [];
    for (let i = 0; i < (system.cosmicAliens || []).length; i++) {
      const record = system.cosmicAliens[i];
      const enemy = record?.enemy;
      const isActive =
        enemy &&
        liveEnemies.has(enemy) &&
        enemy.getWidth() > LEVEL_TWELVE_COSMIC_ALIEN_ABSORBED_SIZE;
      if (!isActive) {
        cleanupLevelTwelveCosmicAlien(runtimeScene, system, record, !!enemy && liveEnemies.has(enemy));
        continue;
      }
      activeRecords.push(record);
      if (enemy.hide) enemy.hide(true);
      if (enemy.setOpacity) enemy.setOpacity(0);
      updateLevelTwelveCosmicAlienVisual(record, system.elapsedSeconds);
    }
    system.cosmicAliens = activeRecords;

    if (activeRecords.length > 0) {
      system.cosmicAlienAbsentSinceSeconds = null;
      return;
    }

    if (!Number.isFinite(system.cosmicAlienAbsentSinceSeconds)) {
      system.cosmicAlienAbsentSinceSeconds = system.elapsedSeconds;
    }
    if (
      deltaSeconds >= 0 &&
      system.elapsedSeconds - system.cosmicAlienAbsentSinceSeconds >=
        LEVEL_TWELVE_COSMIC_ALIEN_RESPAWN_SECONDS
    ) {
      const createdCount =
        system.level === 12
          ? createLevelTwelveCosmicAlienBatch(runtimeScene, system)
          : createLevelTwelveCosmicAlien(runtimeScene, system)
            ? 1
            : 0;
      if (createdCount > 0) {
        system.cosmicAlienAbsentSinceSeconds = null;
      }
    }
  }

  function clearLevelFiveCosmicAlienSystem(runtimeScene) {
    const system = levelFiveCosmicAlienSystemState.get(runtimeScene);
    if (!system) return;
    for (const record of system.cosmicAliens || []) {
      cleanupLevelTwelveCosmicAlien(runtimeScene, system, record, true);
    }
    levelFiveCosmicAlienSystemState.delete(runtimeScene);
  }

  function clearLevelFiveBoostSystem(runtimeScene) {
    const system = levelFiveBoostSystemState.get(runtimeScene);
    if (!system) {
      if (runtimeScene.__headSpaceBoostRegistry?.kind === "level-five-standard") {
        runtimeScene.__headSpaceBoostRegistry = null;
      }
      return;
    }
    restoreLevelFiveBoostWarpVisuals(system);
    for (const pad of system.pads || []) {
      removeLevelSevenRendererObject(runtimeScene, system.layerName || "", pad.sprite, false);
      removeLevelSevenRendererObject(runtimeScene, system.layerName || "", pad.graphic, true);
    }
    removeLevelSevenRendererObject(
      runtimeScene,
      system.layerName || "",
      system.lightningGraphic,
      false
    );
    removeLevelSevenRendererObject(
      runtimeScene,
      system.layerName || "",
      system.cometTailSprite,
      false
    );
    const cometParticleEmitter = system.cometParticleEmitter;
    if (cometParticleEmitter) {
      removeLevelSevenRendererObject(
        runtimeScene,
        system.layerName || "",
        cometParticleEmitter.getRendererObject?.(),
        false
      );
      try {
        cometParticleEmitter.onDestroyed?.();
      } catch {}
      try {
        cometParticleEmitter.destroy?.();
      } catch {}
    }
    removeLevelSevenRendererObject(
      runtimeScene,
      system.layerName || "",
      system.lightningOverlayGraphic,
      false
    );
    levelFiveBoostSystemState.delete(runtimeScene);
    runtimeScene.__headSpaceBoostDebug = null;
    if (runtimeScene.__headSpaceBoostRegistry?.system === system) {
      runtimeScene.__headSpaceBoostRegistry = null;
    }
  }

  function createBoostCometParticleEmitter(runtimeScene, layerName) {
    try {
      if (typeof PIXI?.particles?.Emitter !== "function" || typeof PIXI?.Container !== "function") {
        globalThis.__headSpaceBoostParticleEmitterError = "PIXI particle emitter runtime is unavailable";
        return null;
      }
      const pixiRenderer = runtimeScene.getGame?.().getRenderer?.().getPIXIRenderer?.();
      const texture = runtimeScene.getGame?.().getImageManager?.().getOrCreateDiskTexture?.(16, pixiRenderer) || PIXI.Texture.WHITE;
      const container = new PIXI.Container();
      container.eventMode = "none";
      const particleEmitter = new PIXI.particles.Emitter(container, {
        // A dense, irregular grit plume reads as dust in a wake instead of
        // a smooth, polished particle ribbon.
        lifetime: { min: 0.38, max: 0.82 },
        frequency: 1 / 132,
        spawnChance: 1,
        particlesPerWave: 1,
        maxParticles: 88,
        emitterLifetime: -1,
        pos: { x: 0, y: 0 },
        addAtBack: false,
        behaviors: [
          { type: "alpha", config: { alpha: { isStepped: false, list: [{ time: 0, value: 0.62 }, { time: 0.38, value: 0.34 }, { time: 1, value: 0 }] } } },
          { type: "moveAcceleration", config: { accel: { x: 0, y: 0 }, minStart: 125, maxStart: 310, rotate: false } },
          { type: "scale", config: { scale: { isStepped: false, minMult: 0.24, list: [{ time: 0, value: 0.12 }, { time: 0.42, value: 0.3 }, { time: 1, value: 0.52 }] } } },
          { type: "color", config: { color: { isStepped: false, list: [{ time: 0, value: "#52c5b4" }, { time: 0.58, value: "#68b9bd" }, { time: 1, value: "#9ab6b1" }] } } },
          { type: "rotation", config: { accel: 0, minStart: 0, maxStart: 0, minSpeed: 0, maxSpeed: 0 } },
          { type: "blendMode", config: { blendMode: "NORMAL" } },
          { type: "textureSingle", config: { texture } },
          { type: "spawnShape", config: { type: "torus", data: { affectRotation: false, innerRadius: 0, radius: 40, x: 0, y: 0 } } },
        ],
      });
      particleEmitter.emit = false;
      return {
        getRendererObject: () => container,
        getParticleCount: () => particleEmitter.particleCount || 0,
        getParticleSample: () => {
          const particle = particleEmitter._activeParticlesFirst;
          return particle
            ? { x: particle.x, y: particle.y, rotation: particle.rotation }
            : null;
        },
        startEmission: () => { particleEmitter.emit = true; },
        stopEmission: () => { particleEmitter.emit = false; },
        configure: ({ x, y, travelAngleDegrees, radius, forceMin, forceMax }) => {
          // Keep the particle simulation local to the moving composite. The
          // former world-space spawn position let a live boost leave detached
          // particle islands behind as the camera and player advanced.
          // A helmet-centred container keeps the coma wrapped around the
          // player and makes the fading plume read as one attached tail.
          container.position.set(x, y);
          container.rotation = (travelAngleDegrees * Math.PI) / 180;
          particleEmitter.spawnPos.x = 0;
          particleEmitter.spawnPos.y = 0;
          const rotation = particleEmitter.getBehavior("rotation");
          // The emitter is rotated with travel. In that local space, π is
          // unambiguously the rear of the astronaut, matching the graphic
          // tail's negative-x plume.
          rotation.minStart = Math.PI - (26 * Math.PI) / 180;
          rotation.maxStart = Math.PI + (26 * Math.PI) / 180;
          const movement = particleEmitter.getBehavior("moveAcceleration");
          movement.minStart = forceMin;
          movement.maxStart = forceMax;
          particleEmitter.getBehavior("spawnShape").shape.radius = radius;
        },
        update: (deltaSeconds) => particleEmitter.update(deltaSeconds),
        clear: () => particleEmitter.cleanup(),
        destroy: () => particleEmitter.destroy(),
      };
    } catch (error) {
      globalThis.__headSpaceBoostParticleEmitterError = String(error?.stack || error?.message || error);
      return null;
    }
  }

  function createBoostCometTailSprite() {
    if (
      typeof PIXI?.Sprite !== "function" ||
      typeof PIXI?.Texture?.from !== "function" ||
      typeof document?.createElement !== "function"
    ) {
      return null;
    }
    const canvas = document.createElement("canvas");
    canvas.width = 560;
    canvas.height = 280;
    const context = canvas.getContext("2d");
    if (!context) return null;
    const headX = 420;
    const headY = canvas.height * 0.5;

    // Broad dust tail: transparent at its tapered tip, then gently luminous
    // as it meets the coma. The curved edges avoid the harsh graphic wedge.
    const dust = context.createLinearGradient(20, headY, headX, headY);
    dust.addColorStop(0, "rgba(86, 145, 255, 0)");
    dust.addColorStop(0.5, "rgba(94, 164, 255, 0.07)");
    dust.addColorStop(0.84, "rgba(143, 205, 255, 0.24)");
    dust.addColorStop(1, "rgba(220, 247, 255, 0.11)");
    context.fillStyle = dust;
    context.beginPath();
    context.moveTo(headX, 42);
    context.bezierCurveTo(320, 50, 136, 76, 16, headY - 2);
    context.bezierCurveTo(154, 201, 314, 233, headX, 238);
    context.bezierCurveTo(382, 204, 366, 78, headX, 42);
    context.fill();

    // A narrower ion plume floats through the dust tail rather than forming a
    // separate spike. It is offset only a little, like a natural comet tail.
    const ion = context.createLinearGradient(70, headY, headX, headY);
    ion.addColorStop(0, "rgba(156, 214, 255, 0)");
    ion.addColorStop(0.54, "rgba(142, 203, 255, 0.08)");
    ion.addColorStop(0.9, "rgba(203, 239, 255, 0.34)");
    ion.addColorStop(1, "rgba(243, 252, 255, 0.18)");
    context.fillStyle = ion;
    context.beginPath();
    context.moveTo(headX, 92);
    context.bezierCurveTo(300, 102, 166, 119, 64, headY + 8);
    context.bezierCurveTo(182, 175, 316, 191, headX, 193);
    context.bezierCurveTo(386, 174, 381, 111, headX, 92);
    context.fill();

    // The radial gradient is a true soft coma—no stroked circle or visible
    // edge—and lives behind the native player composite.
    const coma = context.createRadialGradient(headX, headY, 6, headX, headY, 112);
    coma.addColorStop(0, "rgba(238, 253, 255, 0.38)");
    coma.addColorStop(0.35, "rgba(174, 223, 255, 0.2)");
    coma.addColorStop(0.72, "rgba(93, 162, 255, 0.08)");
    coma.addColorStop(1, "rgba(93, 162, 255, 0)");
    context.fillStyle = coma;
    context.beginPath();
    context.arc(headX, headY, 112, 0, Math.PI * 2);
    context.fill();

    const sprite = new PIXI.Sprite(PIXI.Texture.from(canvas));
    sprite.anchor.set(headX / canvas.width, 0.5);
    sprite.eventMode = "none";
    // The pre-painted alpha gradients already contain the intended light.
    // Normal blending preserves their soft colour transitions; ADD made the
    // tail nearly disappear against bright nebulae and overexpose on black.
    sprite.blendMode = PIXI.BLEND_MODES.NORMAL;
    sprite.alpha = 0.96;
    return sprite;
  }

  function ensureLevelFiveBoostSystem(runtimeScene) {
    const level = getCurrentLevel(runtimeScene);
    const isMultiplayerLevel = isMultiplayerGame(runtimeScene, level);
    const isMultiplayerLevelOne = level === 1 && isMultiplayerGame(runtimeScene, level);
    const isMultiplayerLevelThree = level === 3 && isMultiplayerGame(runtimeScene, level);
    const isLevelTenRuntime = usesLevelTenRuntime(runtimeScene, level);
    const isSinglePlayerBoostLevel = !isMultiplayerLevel && (level === 5 || level === 6);
    if (!isSinglePlayerBoostLevel && !isLevelTenRuntime && !isMultiplayerLevelOne && !isMultiplayerLevelThree) {
      clearLevelFiveBoostSystem(runtimeScene);
      return null;
    }
    let system = levelFiveBoostSystemState.get(runtimeScene);
    if (system?.level === level && system?.pads?.every((pad) => pad.sprite && !pad.sprite.destroyed)) return system;

    clearLevelFiveBoostSystem(runtimeScene);
    if (typeof PIXI === "undefined" || typeof PIXI.Sprite !== "function") return null;
    const player = runtimeScene.getObjects("Player")[0] || null;
    const layerName = player?.getLayer?.() || "";
    const layerRenderer = runtimeScene.getLayer(layerName)?.getRenderer?.();
    if (!player || !layerRenderer) return null;

    const bounds = getBossSpawnBounds(runtimeScene, player);
    const arenaWidth = Math.max(1, bounds.maxX - bounds.minX);
    const arenaHeight = Math.max(1, bounds.maxY - bounds.minY);
    const width = clamp(
      arenaWidth * LEVEL_FIVE_BOOST_WIDTH_RATIO,
      LEVEL_FIVE_BOOST_MIN_WIDTH,
      LEVEL_FIVE_BOOST_MAX_WIDTH
    );
    const height = width * LEVEL_FIVE_BOOST_ASPECT_RATIO;
    const centerX = (bounds.minX + bounds.maxX) * 0.5;
    const texture = PIXI.Texture.from(LEVEL_FIVE_BOOST_RESOURCE);
    const multiplayerMaze = isMultiplayerLevelOne
      ? multiplayerLevelOneMazeState.get(runtimeScene)
      : null;
    const configs =
      isMultiplayerLevelOne && multiplayerMaze
        ? [
            {
              x: multiplayerMaze.centerX,
              y: multiplayerMaze.centerY - multiplayerMaze.outerApothem * 0.78,
              directionX: 0,
              directionY: 1,
            },
            {
              x: multiplayerMaze.centerX,
              y: multiplayerMaze.centerY + multiplayerMaze.outerApothem * 0.78,
              directionX: 0,
              directionY: -1,
            },
          ]
        : isMultiplayerLevelThree
        ? [0, Math.PI].map((angle) => {
              const centerY = (bounds.minY + bounds.maxY) * 0.5;
              const orbitRadius = Math.min(arenaWidth, arenaHeight) * 0.445;
              return {
                x: centerX + Math.cos(angle) * orbitRadius,
                y: centerY + Math.sin(angle) * orbitRadius,
                directionX: -Math.cos(angle),
                directionY: -Math.sin(angle),
                orbitAngle: angle,
                orbitRadius,
                orbitSpeed: 0.12,
                orbits: true,
              };
            })
        : isLevelTenRuntime
        ? [0, 1, 2].map((index) => {
            const angle = -Math.PI * 0.5 + index * (Math.PI * 2 / 3);
            const orbitRadius = Math.min(arenaWidth, arenaHeight) * 0.43;
            return {
              x: centerX + Math.cos(angle) * orbitRadius,
              y: (bounds.minY + bounds.maxY) * 0.5 + Math.sin(angle) * orbitRadius,
              directionX: -Math.cos(angle),
              directionY: -Math.sin(angle),
              orbitAngle: angle,
              orbitRadius,
            };
          })
        : level === 6
        ? [
            { x: centerX - arenaWidth * 0.18, y: bounds.minY + arenaHeight * 0.28, directionX: -Math.SQRT1_2, directionY: Math.SQRT1_2 },
            { x: centerX + arenaWidth * 0.18, y: bounds.minY + arenaHeight * 0.28, directionX: Math.SQRT1_2, directionY: Math.SQRT1_2 },
            { x: centerX - arenaWidth * 0.18, y: bounds.maxY - arenaHeight * 0.28, directionX: -Math.SQRT1_2, directionY: -Math.SQRT1_2 },
            { x: centerX + arenaWidth * 0.18, y: bounds.maxY - arenaHeight * 0.28, directionX: Math.SQRT1_2, directionY: -Math.SQRT1_2 },
          ]
        : [
            // Keep only the diagonal pair requested for Level 5. Both pads use
            // the shared capture-and-launch behavior below, facing across the arena.
            { x: centerX - arenaWidth * LEVEL_FIVE_BOOST_EDGE_X_RATIO, y: bounds.minY + arenaHeight * LEVEL_FIVE_BOOST_EDGE_Y_RATIO, directionX: 1, directionY: 0 },
            { x: centerX + arenaWidth * LEVEL_FIVE_BOOST_EDGE_X_RATIO, y: bounds.maxY - arenaHeight * LEVEL_FIVE_BOOST_EDGE_Y_RATIO, directionX: -1, directionY: 0 },
          ];
    const pads = configs.map((config, index) => {
      const sprite = new PIXI.Sprite(texture);
      if (sprite.anchor?.set) sprite.anchor.set(0.5);
      sprite.position.set(config.x, config.y);
      sprite.width = width;
      sprite.height = height;
      sprite.rotation = Math.atan2(config.directionY, config.directionX);
      sprite.alpha = 0.82;
      sprite.visible = false;
      sprite.eventMode = "none";
      try {
        if (PIXI.filters?.GlowFilter) {
          sprite.filters = [
            new PIXI.filters.GlowFilter({
              distance: 22,
              outerStrength: 0,
              innerStrength: 0,
              color: 0x22bfff,
              quality: 0.35,
            }),
          ];
        }
      } catch {
        // Tint and alpha flashing remain available when the glow filter is unavailable.
      }
      const graphic = typeof PIXI.Graphics === "function" ? new PIXI.Graphics() : null;
      if (graphic) {
        graphic.eventMode = "none";
        graphic.alpha = 0.72;
        graphic.position.set(config.x, config.y);
        graphic.rotation = Math.atan2(config.directionY, config.directionX);
        graphic.lineStyle(Math.max(5, height * 0.065), 0x46ff7b, 0.96);
        const chevronCount = 5;
        const span = width * 0.18;
        const startX = -width * 0.46;
        for (let chevron = 0; chevron < chevronCount; chevron++) {
          const x = startX + chevron * width * 0.18;
          graphic.moveTo(x, -height * 0.34);
          graphic.lineTo(x + span, 0);
          graphic.lineTo(x, height * 0.34);
        }
        graphic.lineStyle(Math.max(1.5, height * 0.018), 0xeaffef, 0.9);
        for (let chevron = 0; chevron < chevronCount; chevron++) {
          const x = startX + chevron * width * 0.18;
          graphic.moveTo(x, -height * 0.34);
          graphic.lineTo(x + span, 0);
          graphic.lineTo(x, height * 0.34);
        }
        layerRenderer.addRendererObject(graphic, 6.6 + index * 0.01);
      }
      return {
        id: index,
        sprite,
        x: config.x,
        y: config.y,
        width,
        height,
        directionX: config.directionX,
        directionY: config.directionY,
        orbitAngle: config.orbitAngle,
        orbitRadius: config.orbitRadius,
        orbitSpeed: config.orbitSpeed,
        orbits: config.orbits === true,
        graphic,
      };
    });
    // Keep the effect in the renderer path used by the shipped export. Some
    // WebGL builds do not upload a runtime canvas texture to this layer, while
    // Graphics objects are reliable across every arena.
    const cometTailSprite = null;
    const lightningGraphic = typeof PIXI.Graphics === "function" ? new PIXI.Graphics() : null;
    const lightningOverlayGraphic = typeof PIXI.Graphics === "function" ? new PIXI.Graphics() : null;
    const cometParticleEmitter = createBoostCometParticleEmitter(runtimeScene, layerName);
    if (lightningGraphic) {
      lightningGraphic.eventMode = "none";
      lightningGraphic.blendMode = PIXI.BLEND_MODES.ADD;
      // Feather the layered dust/ion plumes so they read as light, rather
      // than as a crisp geometric wedge.
      try {
        const BlurFilter = PIXI.filters?.BlurFilter || PIXI.BlurFilter;
        if (typeof BlurFilter === "function") {
          const blur = new BlurFilter(5, 2);
          blur.padding = 28;
          lightningGraphic.filters = [blur];
        }
      } catch {}
      // This is the comet tail. Its live z-order is assigned while a player
      // is boosted, because the Player/Image/Helmet composite can be rebuilt.
      layerRenderer.addRendererObject(lightningGraphic, 0);
    }
    if (cometTailSprite) {
      layerRenderer.addRendererObject(cometTailSprite, 0);
    }
    if (lightningOverlayGraphic) {
      lightningOverlayGraphic.eventMode = "none";
      lightningOverlayGraphic.blendMode = PIXI.BLEND_MODES.ADD;
      try {
        const BlurFilter = PIXI.filters?.BlurFilter || PIXI.BlurFilter;
        if (typeof BlurFilter === "function") {
          const blur = new BlurFilter(2.5, 2);
          blur.padding = 18;
          lightningOverlayGraphic.filters = [blur];
        }
      } catch {}
      // The corona must sit above the selected helmet, never between the
      // face and helmet layers.
      layerRenderer.addRendererObject(lightningOverlayGraphic, 0);
    }
    system = {
      level,
      usesLevelTenRuntime: isLevelTenRuntime,
      runtimeScene,
      layerName,
      layerRenderer,
      pads,
      warpRecords: [],
      lightningGraphic,
      cometTailSprite,
      cometParticleEmitter,
      lightningOverlayGraphic,
      boostCometZOrders: null,
    };
    levelFiveBoostSystemState.set(runtimeScene, system);
    runtimeScene.__headSpaceBoostDebug = {
      level,
      isMultiplayerLevelThree,
      bounds,
      pads: pads.map((pad) => ({ x: pad.x, y: pad.y, width: pad.width, height: pad.height })),
    };
    return system;
  }

  function restoreLevelFiveBoostWarpVisuals(system) {
    if (system?.lightningGraphic) system.lightningGraphic.clear();
    if (system?.lightningOverlayGraphic) system.lightningOverlayGraphic.clear();
    if (!system?.warpRecords?.length) return;
    for (const record of system.warpRecords) {
      const rendererObject = record.rendererObject;
      if (!rendererObject || rendererObject.destroyed) continue;
      rendererObject.scale.x = record.scaleX;
      rendererObject.scale.y = record.scaleY;
      rendererObject.rotation = record.rotation;
    }
    system.warpRecords.length = 0;
  }

  function getLevelFiveBoostWarp(elapsedSeconds, phaseObject) {
    // Use a monotonic launch-progress pulse. A sine wave can be sampled at
    // symmetric points on adjacent frames, which made a real boost look static
    // to validation even though its frame-to-frame scale was changing.
    const startedAt = Number(phaseObject?.__headSpaceBoostStartedAtSeconds);
    const progress = Number.isFinite(startedAt)
      ? clamp(
          (elapsedSeconds - startedAt) / Math.max(0.001, LEVEL_FIVE_BOOST_DURATION_SECONDS),
          0,
          1
        )
      : 0;
    const uniformPulse = 1.02 + progress * 0.055;
    return { stretchX: uniformPulse, stretchY: uniformPulse, rotationRadians: 0 };
  }

  function clearPlayerCosmeticBoostWarp(player) {
    if (!player) return;
    player.__headSpaceCosmeticBoostActive = false;
    player.__headSpaceCosmeticBoostStretchX = 1;
    player.__headSpaceCosmeticBoostStretchY = 1;
    player.__headSpaceCosmeticBoostRotationRadians = 0;
  }

  function applyLevelFiveBoostWarpVisual(system, object, elapsedSeconds, phaseObject = object) {
    const rendererObject = object?.getRendererObject?.();
    if (!rendererObject?.scale) return;
    if (system.warpRecords.some((record) => record.rendererObject === rendererObject)) return;
    const { stretchX, stretchY, rotationRadians } =
      getLevelFiveBoostWarp(elapsedSeconds, phaseObject);
    system.warpRecords.push({
      object,
      rendererObject,
      scaleX: rendererObject.scale.x,
      scaleY: rendererObject.scale.y,
      rotation: rendererObject.rotation,
      stretchX,
      stretchY,
    });
    rendererObject.scale.x *= stretchX;
    rendererObject.scale.y *= stretchY;
    rendererObject.rotation += rotationRadians;
  }

  function reapplyLevelFiveBoostCompanionWarpAfterLayout(runtimeScene) {
    const system = levelFiveBoostSystemState.get(runtimeScene);
    reapplyBoostCompanionWarpAfterLayout(system);
  }

  function reapplyBoostCompanionWarpAfterLayout(system) {
    if (!system?.warpRecords?.length) return;
    for (const record of system.warpRecords) {
      const objectName = record.object?.getName?.();
      // Player cosmetics are transformed only through the shared GDevelop
      // companion-object registration pipeline. Never deform their PIXI
      // children independently.
      if (objectName === "PlayerHelmet" || objectName === "PlayerImage") continue;
      const layoutResetScale = false;
      if (!layoutResetScale || !record.rendererObject?.scale) continue;
      const scaleWasReset =
        Math.abs(record.rendererObject.scale.x - record.scaleX) <= 0.0001 &&
        Math.abs(record.rendererObject.scale.y - record.scaleY) <= 0.0001;
      if (objectName === "PlayerImage") {
        // The final composite lock always restores the native face layer.
        // Assign from its recorded base so it deforms with the helmet once,
        // without accumulating scale over successive boost frames.
        record.rendererObject.scale.x = record.scaleX * record.stretchX;
        record.rendererObject.scale.y = record.scaleY * record.stretchY;
      } else if (scaleWasReset) {
        record.rendererObject.scale.x *= record.stretchX;
        record.rendererObject.scale.y *= record.stretchY;
      }
    }
  }

  function applyLevelFiveBoostActorWarpVisual(runtimeScene, system, actor, elapsedSeconds) {
    const actorName = actor?.getName?.() || "";
    if (actorName === "Player") {
      const warp = getLevelFiveBoostWarp(elapsedSeconds, actor);
      actor.__headSpaceCosmeticBoostActive = true;
      actor.__headSpaceCosmeticBoostStretchX = warp.stretchX;
      actor.__headSpaceCosmeticBoostStretchY = warp.stretchY;
      actor.__headSpaceCosmeticBoostRotationRadians = warp.rotationRadians;
      return;
    }
    const companionName =
      actorName === "Enemy"
        ? "EnemyImage"
        : actorName === "SmartEnemy"
          ? "SmartEnemyImage"
          : null;
    if (!companionName) {
      applyLevelFiveBoostWarpVisual(system, actor, elapsedSeconds);
      return;
    }

    const companion = findNearestObject(
      actor.getCenterXInScene(),
      actor.getCenterYInScene(),
      runtimeScene.getObjects(companionName)
    );
    if (companion) {
      applyLevelFiveBoostWarpVisual(system, companion, elapsedSeconds, actor);
    } else {
      applyLevelFiveBoostWarpVisual(system, actor, elapsedSeconds);
    }
  }

  function drawLevelFiveBoostLightning(system, player, pad, elapsedSeconds) {
    const tailGraphic = system?.lightningGraphic;
    const cometTailSprite = system?.cometTailSprite;
    let cometParticleEmitter = system?.cometParticleEmitter;
    const coronaGraphic = system?.lightningOverlayGraphic;
    const tailRenderer = cometTailSprite || tailGraphic;
    let particleRenderer = cometParticleEmitter?.getRendererObject?.() || null;
    if (!tailRenderer && !particleRenderer) return;
    tailGraphic?.clear();
    coronaGraphic?.clear();
    const previousParticleElapsed = Number(system?.cometParticleElapsedSeconds);
    const particleDeltaSeconds = clamp(
      Number.isFinite(previousParticleElapsed) ? elapsedSeconds - previousParticleElapsed : 1 / 60,
      0,
      0.05
    );
    system.cometParticleElapsedSeconds = elapsedSeconds;
    if (!player || !pad) {
      cometParticleEmitter?.stopEmission?.();
      cometParticleEmitter?.update?.(particleDeltaSeconds);
      return;
    }

    // Multiplayer layouts finish registering their authored object factories
    // after the first boost-system pass. Retry here once the live player and
    // layer are available rather than permanently giving up at scene startup.
    if (!cometParticleEmitter) {
      cometParticleEmitter = createBoostCometParticleEmitter(
        system.runtimeScene,
        system.layerName || ""
      );
      system.cometParticleEmitter = cometParticleEmitter;
      particleRenderer = cometParticleEmitter?.getRendererObject?.() || null;
    }

    const playerZOrder = Number(player.getZOrder?.());
    const helmet = player.__headSpaceHelmetCompanion;
    const helmetZOrder = Number(helmet?.getZOrder?.());
    const baseZOrder = Number.isFinite(playerZOrder) ? playerZOrder : 0;
    const compositeTopZOrder = Number.isFinite(helmetZOrder) ? helmetZOrder : baseZOrder + 2;
    const nextZOrders = {
      tail: baseZOrder - 0.25,
      // The particle coma lives behind the native composite. It can show
      // around the helmet edge and form a tail without veiling the face or
      // selected helmet artwork.
      particles: baseZOrder - 0.1,
      corona: compositeTopZOrder + 0.25,
    };
    const previousZOrders = system.boostCometZOrders;
    if (coronaGraphic && (
      !previousZOrders ||
      previousZOrders.tail !== nextZOrders.tail ||
      previousZOrders.particles !== nextZOrders.particles ||
      previousZOrders.corona !== nextZOrders.corona
    )) {
      if (tailRenderer) system.layerRenderer?.removeRendererObject?.(tailRenderer);
      if (particleRenderer) system.layerRenderer?.removeRendererObject?.(particleRenderer);
      system.layerRenderer?.removeRendererObject?.(coronaGraphic);
      if (tailRenderer) system.layerRenderer?.addRendererObject?.(tailRenderer, nextZOrders.tail);
      if (particleRenderer) system.layerRenderer?.addRendererObject?.(particleRenderer, nextZOrders.particles);
      system.layerRenderer?.addRendererObject?.(coronaGraphic, nextZOrders.corona);
      system.boostCometZOrders = nextZOrders;
    }

    const centerX = player.getCenterXInScene();
    const centerY = player.getCenterYInScene();
    tailRenderer?.position.set(centerX, centerY);
    coronaGraphic?.position.set(centerX, centerY);
    const launchAngle = Math.atan2(pad.directionY ?? 0, pad.directionX ?? 1);
    if (tailRenderer) tailRenderer.rotation = launchAngle;
    if (coronaGraphic) coronaGraphic.rotation = launchAngle;
    const playerRadius = getApproxObjectRadius(player, 18);
    const helmetRadius = getApproxObjectRadius(helmet, playerRadius);
    // The helmet is the outer gameplay silhouette. Build the corona from its
    // live diameter so it visibly wraps the entire composite, not just face.
    const compositeRadius = Math.max(playerRadius, helmetRadius);
    // This is the outer coma radius, deliberately beyond the helmet silhouette.
    // Every tail plume starts at its rear edge rather than cutting across the
    // player centre.
    const headRadius = Math.max(34, compositeRadius * 1.16);
    const tailLength = Math.max(118, compositeRadius * 3.1);
    const tailSpread = Math.max(30, compositeRadius * 0.7);
    const pulse = 1 + Math.sin(elapsedSeconds * 11) * 0.045;
    const tailRootX = -headRadius * 0.12;

    if (cometParticleEmitter?.configure) {
      const launchDegrees = (launchAngle * 180) / Math.PI;
      const boostKey = `${pad.id ?? "boost"}:${player.__headSpaceBoostStartedAtSeconds ?? elapsedSeconds}`;
      if (system.cometParticleBoostKey !== boostKey) {
        cometParticleEmitter.clear?.();
        system.cometParticleBoostKey = boostKey;
      }
      // The emitter's spawn circle is the live outer helmet radius. Particles
      // therefore swell from the complete astronaut silhouette, then travel
      // backward through a narrow, motion-aligned cone and fade out.
      cometParticleEmitter.configure({
        x: centerX,
        y: centerY,
        travelAngleDegrees: launchDegrees,
        // The soft corona carries the full helmet silhouette. Start the
        // physical particles nearer its rear centre so they read as an
        // intentional tapering plume instead of a dotted ring.
        radius: compositeRadius * 0.3,
        forceMin: Math.max(150, compositeRadius * 2.25),
        forceMax: Math.max(320, compositeRadius * 5.6),
      });
      cometParticleEmitter.startEmission?.();
      cometParticleEmitter.update?.(particleDeltaSeconds);
    }

    if (cometTailSprite) {
      // The texture was authored around a 112px coma radius. Scale it only
      // from the live helmet-derived composite radius; it never feeds back
      // into PlayerImage, PlayerHelmet, or collision geometry.
      const spriteScale = (compositeRadius / 112) * pulse;
      cometTailSprite.scale.set(spriteScale, spriteScale);
      cometTailSprite.alpha = 0.96;
    }

    // Graphics are retained as a safe runtime fallback on exports where an
    // HTML canvas texture cannot be made. Draw the fallback as tapered curved
    // strokes instead of filled wedges: at small screen scale, filled shapes
    // expose their polygon edges and look mechanical.
    const drawTaperedCometTail = (length, spread, color, alpha, width, curl) => {
      if (!tailGraphic) return;
      const start = { x: tailRootX, y: 0 };
      const controlA = { x: -length * 0.25, y: -spread * 0.58 };
      const controlB = { x: -length * 0.7, y: spread * 0.24 };
      const end = { x: -length, y: curl };
      const pointAt = (t) => {
        const inverse = 1 - t;
        return {
          x:
            inverse ** 3 * start.x +
            3 * inverse ** 2 * t * controlA.x +
            3 * inverse * t ** 2 * controlB.x +
            t ** 3 * end.x,
          y:
            inverse ** 3 * start.y +
            3 * inverse ** 2 * t * controlA.y +
            3 * inverse * t ** 2 * controlB.y +
            t ** 3 * end.y,
        };
      };
      const segments = 18;
      let previous = pointAt(0);
      for (let index = 1; index <= segments; index += 1) {
        const t = index / segments;
        const point = pointAt(t);
        const taper = (1 - t) ** 1.35;
        tailGraphic.lineStyle(Math.max(0.7, width * taper), color, alpha * (0.25 + taper * 0.75));
        tailGraphic.moveTo(previous.x, previous.y);
        tailGraphic.lineTo(point.x, point.y);
        previous = point;
      }
    };
    if (tailGraphic) {
      // Particle plumes provide the main visual statement. These soft guide
      // strokes only preserve a little direction at a distance.
      drawTaperedCometTail(tailLength, tailSpread * pulse, 0x276f86, 0.075, tailSpread * 1.15, tailSpread * 0.13);
      drawTaperedCometTail(tailLength * 0.76, tailSpread * 0.58 * pulse, 0x4cc9cf, 0.1, tailSpread * 0.58, tailSpread * 0.075);
    }
    if (coronaGraphic) {
      // A very faint bloom lies above the whole native composite. It is sized
      // from the helmet and blurred, so it reads as light on the astronaut,
      // not as an outlined force-field.
      coronaGraphic.beginFill(0x72f3db, 0.115);
      coronaGraphic.drawCircle(0, 0, compositeRadius * 1.16 * pulse);
      coronaGraphic.endFill();
    }
  }

  function getStandardBoostTriggerCenter(pad) {
    const offset = pad?.anchoredAtBase ? (Number(pad.width) || 0) * 0.5 : 0;
    return {
      x: (Number(pad?.x) || 0) + (Number(pad?.directionX) || 0) * offset,
      y: (Number(pad?.y) || 0) + (Number(pad?.directionY) || 0) * offset,
    };
  }

  function applyLevelFiveBoostEffects(runtimeScene, elapsedSeconds) {
    const system = ensureLevelFiveBoostSystem(runtimeScene);
    if (!system) return;
    runtimeScene.__headSpaceBoostRegistry = {
      lifecycle: "single-player-level-5",
      kind: "level-five-standard",
      system,
      pads: system.pads,
    };
    restoreLevelFiveBoostWarpVisuals(system);
    const deltaSeconds = clamp(runtimeScene.getElapsedTime() / 1000, 0, 0.05);
    // The Level 5 behavior is the canonical boost contract. Give it a clock
    // owned by the boost lifecycle so retries and transitions cannot leave its
    // stretch/lightning state tied to a stopped scene-state timer.
    const previousBoostElapsedSeconds = Number(system.__headSpaceBoostElapsedSeconds);
    elapsedSeconds =
      (Number.isFinite(previousBoostElapsedSeconds)
        ? previousBoostElapsedSeconds
        : Math.max(0, Number(elapsedSeconds) || 0)) + deltaSeconds;
    system.__headSpaceBoostElapsedSeconds = elapsedSeconds;
    if (system.usesLevelTenRuntime) {
      const player = runtimeScene.getObjects("Player")[0] || null;
      const bounds = getBossSpawnBounds(runtimeScene, player);
      const solarSystem = levelTenSolarSystemState.get(runtimeScene);
      const sun = solarSystem?.bodies?.find((body) => body.key === "sun") || null;
      const sunX = Number.isFinite(sun?.x) ? sun.x : (bounds.minX + bounds.maxX) * 0.5;
      const sunY = Number.isFinite(sun?.y) ? sun.y : (bounds.minY + bounds.maxY) * 0.5;
      for (const pad of system.pads) {
        if (!pad.orbits) continue;
        pad.orbitAngle += deltaSeconds * (Number.isFinite(pad.orbitSpeed) ? pad.orbitSpeed : 0.16);
        pad.x = sunX + Math.cos(pad.orbitAngle) * pad.orbitRadius;
        pad.y = sunY + Math.sin(pad.orbitAngle) * pad.orbitRadius;
        const inward = getNormalizedVector(sunX - pad.x, sunY - pad.y);
        pad.directionX = inward.x;
        pad.directionY = inward.y;
        pad.sprite.position.set(pad.x, pad.y);
        pad.sprite.rotation = Math.atan2(pad.directionY, pad.directionX);
        pad.graphic?.position.set(pad.x, pad.y);
        if (pad.graphic) pad.graphic.rotation = Math.atan2(pad.directionY, pad.directionX);
      }
    }
    const activePadIds = new Set();
    let lightningPlayer = null;
    let lightningPad = null;
    let playerBoostEnded = false;
    const actors = ["Player", "Enemy", "SmartEnemy", "EmittedMaterial"].flatMap((name) =>
      runtimeScene.getObjects(name)
    );

    for (const actor of actors) {
      if (!actor?.hasBehavior?.("Physics2") || actor.getWidth() <= 0) continue;
      actor.__headSpaceBoostCooldownSeconds = Math.max(
        0,
        (Number(actor.__headSpaceBoostCooldownSeconds) || 0) - deltaSeconds
      );
      const radius = getApproxObjectRadius(actor, 4);
      let overlappingPad = null;
      for (const pad of system.pads) {
        const captureMargin = radius * (1 - LEVEL_FIVE_BOOST_CAPTURE_OVERLAP_RATIO * 2);
        const relativeX = actor.getCenterXInScene() - pad.x;
        const relativeY = actor.getCenterYInScene() - pad.y;
        const along = relativeX * pad.directionX + relativeY * pad.directionY;
        const across = -relativeX * pad.directionY + relativeY * pad.directionX;
        if (
          Math.abs(along) <= pad.width * 0.5 + captureMargin &&
          Math.abs(across) <=
            pad.height * LEVEL_FIVE_BOOST_TRIGGER_HEIGHT_RATIO * 0.5 + captureMargin
        ) {
          overlappingPad = pad;
          activePadIds.add(pad.id);
          break;
        }
      }

      const activePad = overlappingPad ||
        system.pads.find((pad) => pad.id === actor.__headSpaceBoostPadId) || null;
      if (activePad && (overlappingPad || actor.__headSpaceBoostPhase === "launch")) {
        activePadIds.add(activePad.id);
        applyLevelFiveBoostActorWarpVisual(runtimeScene, system, actor, elapsedSeconds);
        if (actor.getName?.() === "Player") {
          lightningPlayer = actor;
          lightningPad = activePad;
        }
      } else if (actor.getName?.() === "Player") {
        clearPlayerCosmeticBoostWarp(actor);
      }

      const physics = actor.getBehavior("Physics2");
      if (
        overlappingPad &&
        !actor.__headSpaceBoostPhase &&
        actor.__headSpaceBoostCooldownSeconds <= 0
      ) {
        actor.__headSpaceBoostPadId = overlappingPad.id;
        actor.__headSpaceBoostDirectionX = overlappingPad.directionX;
        actor.__headSpaceBoostDirectionY = overlappingPad.directionY;
        actor.__headSpaceBoostCaptureStartedAtSeconds = null;
        actor.__headSpaceBoostStartedAtSeconds = elapsedSeconds;
        actor.__headSpaceBoostUntilSeconds = elapsedSeconds + LEVEL_FIVE_BOOST_DURATION_SECONDS;
        actor.__headSpaceBoostPhase = "launch";
      }

      // Normalize any state left by an older capture-first build. Standard
      // boosts always launch immediately on contact; they never hold an actor
      // at the pad apex.
      if (actor.__headSpaceBoostPhase === "capture") {
        actor.__headSpaceBoostPhase = "launch";
        actor.__headSpaceBoostCaptureStartedAtSeconds = null;
        actor.__headSpaceBoostStartedAtSeconds = elapsedSeconds;
        actor.__headSpaceBoostUntilSeconds = elapsedSeconds + LEVEL_FIVE_BOOST_DURATION_SECONDS;
      }

      if (
        actor.__headSpaceBoostPhase === "launch" &&
        elapsedSeconds < (actor.__headSpaceBoostUntilSeconds || -Infinity)
      ) {
        const directionX = actor.__headSpaceBoostDirectionX ?? 1;
        const directionY = actor.__headSpaceBoostDirectionY ?? 0;
        moveObjectToCenter(
          actor,
          actor.getCenterXInScene() + directionX * LEVEL_FIVE_BOOST_LAUNCH_SPEED * deltaSeconds,
          actor.getCenterYInScene() + directionY * LEVEL_FIVE_BOOST_LAUNCH_SPEED * deltaSeconds
        );
        if (physics.setLinearVelocityX) physics.setLinearVelocityX(0);
        if (physics.setLinearVelocityY) physics.setLinearVelocityY(0);
      } else if (actor.__headSpaceBoostPhase === "launch") {
        const directionX = actor.__headSpaceBoostDirectionX ?? 1;
        const directionY = actor.__headSpaceBoostDirectionY ?? 0;
        if (physics.setLinearVelocityX) {
          physics.setLinearVelocityX(directionX * LEVEL_FIVE_BOOST_LAUNCH_SPEED);
        }
        if (physics.setLinearVelocityY) {
          physics.setLinearVelocityY(directionY * LEVEL_FIVE_BOOST_LAUNCH_SPEED);
        }
        actor.__headSpaceBoostPhase = null;
        actor.__headSpaceBoostPadId = null;
        actor.__headSpaceBoostCaptureStartedAtSeconds = null;
        actor.__headSpaceBoostStartedAtSeconds = null;
        actor.__headSpaceBoostUntilSeconds = null;
        actor.__headSpaceBoostCooldownSeconds = 0.3;
        if (actor.getName?.() === "Player") {
          clearPlayerCosmeticBoostWarp(actor);
          playerBoostEnded = true;
        }
      }
    }
    if (playerBoostEnded && !actors.some(
      (actor) => actor.getName?.() === "Player" && actor.__headSpaceBoostPhase === "launch"
    )) {
      lightningPlayer = null;
      lightningPad = null;
    }
    drawLevelFiveBoostLightning(system, lightningPlayer, lightningPad, elapsedSeconds);

    const flashAmount =
      0.5 - Math.cos(elapsedSeconds * Math.PI * 2 * LEVEL_FIVE_BOOST_FLASH_HZ) * 0.5;
    const flashColor = interpolateLevelNineBlackHoleTint(0x21bfff, 0xffef35, flashAmount);
    for (const pad of system.pads) {
      const active = activePadIds.has(pad.id);
      pad.sprite.tint = active ? flashColor : 0xffffff;
      pad.sprite.alpha = active ? 0.72 + flashAmount * 0.28 : 0.82;
      if (pad.graphic) {
        pad.graphic.tint = active ? flashColor : 0xffffff;
        pad.graphic.alpha = active ? 0.7 + flashAmount * 0.16 : 0.72;
      }
      const glow = pad.sprite.filters?.[0];
      if (glow && "color" in glow) glow.color = active ? flashColor : 0x22bfff;
      if (glow && "outerStrength" in glow) {
        glow.outerStrength = active ? 2.2 + flashAmount * 1.8 : 0;
      }
      if (glow && "innerStrength" in glow) glow.innerStrength = active ? 0.8 : 0;
    }
  }

  function applySharedMultiplayerBoostEffects(runtimeScene, system) {
    if (!system?.boosts?.length) return;
    runtimeScene.__headSpaceBoostRegistry = {
      lifecycle: "single-player-level-5",
      kind: "shared-multiplayer",
      manifestId: system.manifestId,
      system,
      pads: system.boosts,
    };
    if (!Array.isArray(system.warpRecords)) system.warpRecords = [];
    restoreLevelFiveBoostWarpVisuals(system);
    const deltaSeconds = clamp(runtimeScene.getElapsedTime() / 1000, 0, 0.05);
    // The declarative multiplayer adapter clock can stop while the live Game
    // scene continues rendering. Boost movement already uses this frame delta,
    // so own the corresponding lifecycle clock here as well. Keeping launch,
    // deformation, lightning, and cleanup on one clock prevents a permanent
    // stretched/static frame on any current or future multiplayer boost.
    const previousBoostElapsedSeconds = Number(system.__headSpaceBoostElapsedSeconds);
    const elapsedSeconds =
      (Number.isFinite(previousBoostElapsedSeconds)
        ? previousBoostElapsedSeconds
        : Math.max(0, Number(system.elapsedSeconds) || 0)) + deltaSeconds;
    system.__headSpaceBoostElapsedSeconds = elapsedSeconds;
    const activePadIds = new Set();
    let lightningPlayer = null;
    let lightningPad = null;
    let playerBoostEnded = false;
    const actors = ["Player", "Enemy", "SmartEnemy", "EmittedMaterial"].flatMap((name) =>
      runtimeScene.getObjects(name)
    );

    for (const actor of actors) {
      if (!actor?.hasBehavior?.("Physics2") || actor.getWidth() <= 0) continue;
      actor.__headSpaceBoostCooldownSeconds = Math.max(
        0,
        (Number(actor.__headSpaceBoostCooldownSeconds) || 0) - deltaSeconds
      );
      const radius = getApproxObjectRadius(actor, 4);
      let overlappingPad = null;
      for (const pad of system.boosts) {
        const captureMargin = radius * (1 - LEVEL_FIVE_BOOST_CAPTURE_OVERLAP_RATIO * 2);
        const triggerCenter = getStandardBoostTriggerCenter(pad);
        const relativeX = actor.getCenterXInScene() - triggerCenter.x;
        const relativeY = actor.getCenterYInScene() - triggerCenter.y;
        const along = relativeX * pad.directionX + relativeY * pad.directionY;
        const across = -relativeX * pad.directionY + relativeY * pad.directionX;
        if (
          Math.abs(along) <= pad.width * 0.5 + captureMargin &&
          Math.abs(across) <= pad.height * LEVEL_FIVE_BOOST_TRIGGER_HEIGHT_RATIO * 0.5 + captureMargin
        ) {
          overlappingPad = pad;
          activePadIds.add(pad.id);
          break;
        }
      }

      const activePad = overlappingPad ||
        system.boosts.find((pad) => pad.id === actor.__headSpaceBoostPadId) || null;
      if (activePad && (overlappingPad || actor.__headSpaceBoostPhase === "launch")) {
        activePadIds.add(activePad.id);
        applyLevelFiveBoostActorWarpVisual(runtimeScene, system, actor, elapsedSeconds);
        if (actor.getName?.() === "Player") {
          lightningPlayer = actor;
          lightningPad = activePad;
        }
      } else if (actor.getName?.() === "Player") {
        clearPlayerCosmeticBoostWarp(actor);
      }

      const physics = actor.getBehavior("Physics2");
      if (
        overlappingPad &&
        !actor.__headSpaceBoostPhase &&
        actor.__headSpaceBoostCooldownSeconds <= 0
      ) {
        actor.__headSpaceBoostPadId = overlappingPad.id;
        actor.__headSpaceBoostDirectionX = overlappingPad.directionX;
        actor.__headSpaceBoostDirectionY = overlappingPad.directionY;
        actor.__headSpaceBoostCaptureStartedAtSeconds = null;
        actor.__headSpaceBoostStartedAtSeconds = elapsedSeconds;
        actor.__headSpaceBoostUntilSeconds = elapsedSeconds + LEVEL_FIVE_BOOST_DURATION_SECONDS;
        actor.__headSpaceBoostPhase = "launch";
      }

      // Older multiplayer builds used a capture phase that visibly froze the
      // player on the pad. Convert stale capture state into the canonical
      // single-player Level 5 immediate launch.
      if (actor.__headSpaceBoostPhase === "capture") {
        const pad = system.boosts.find((candidate) => candidate.id === actor.__headSpaceBoostPadId);
        if (!pad) {
          actor.__headSpaceBoostPhase = null;
          continue;
        }
        actor.__headSpaceBoostPhase = "launch";
        actor.__headSpaceBoostCaptureStartedAtSeconds = null;
        actor.__headSpaceBoostStartedAtSeconds = elapsedSeconds;
        actor.__headSpaceBoostUntilSeconds = elapsedSeconds + LEVEL_FIVE_BOOST_DURATION_SECONDS;
      }

      if (actor.__headSpaceBoostPhase === "launch") {
        const directionX = actor.__headSpaceBoostDirectionX ?? 1;
        const directionY = actor.__headSpaceBoostDirectionY ?? 0;
        if (elapsedSeconds < (Number(actor.__headSpaceBoostUntilSeconds) || -Infinity)) {
          const launchSpeed = LEVEL_FIVE_BOOST_LAUNCH_SPEED;
          // Native player-control events can overwrite Physics2 velocity before
          // it advances. Move through the boost path explicitly, matching the
          // working boost implementation, then return motion to Physics2 below.
          moveObjectToCenter(
            actor,
            actor.getCenterXInScene() + directionX * launchSpeed * deltaSeconds,
            actor.getCenterYInScene() + directionY * launchSpeed * deltaSeconds
          );
          let wallCollision = null;
          for (const wall of runtimeScene.getObjects("Walls")) {
            const segment = getWallSegmentData(wall);
            const closest = getClosestPointOnSegment(
              actor.getCenterXInScene(),
              actor.getCenterYInScene(),
              segment
            );
            if (!segment || !closest) continue;
            const dx = actor.getCenterXInScene() - closest.x;
            const dy = actor.getCenterYInScene() - closest.y;
            const distance = Math.hypot(dx, dy);
            const penetration = segment.halfThickness + radius - distance;
            if (penetration <= (wallCollision?.penetration || 0)) continue;
            let normalX;
            let normalY;
            if (distance > 0.001) {
              normalX = dx / distance;
              normalY = dy / distance;
            } else {
              normalX = -segment.tangentY;
              normalY = segment.tangentX;
              if (normalX * directionX + normalY * directionY > 0) {
                normalX *= -1;
                normalY *= -1;
              }
            }
            wallCollision = { normalX, normalY, penetration };
          }
          if (wallCollision) {
            moveObjectToCenter(
              actor,
              actor.getCenterXInScene() + wallCollision.normalX * (wallCollision.penetration + 4),
              actor.getCenterYInScene() + wallCollision.normalY * (wallCollision.penetration + 4)
            );
            // End at the visible wall surface. The next pass performs the
            // normal effect cleanup without allowing immediate recapture.
            actor.__headSpaceBoostHitWall = true;
            actor.__headSpaceBoostUntilSeconds = elapsedSeconds;
          }
          physics.setLinearVelocityX?.(0);
          physics.setLinearVelocityY?.(0);
        } else {
          const endedPlayerBoost = actor.getName?.() === "Player";
          const pad = system.boosts.find(
            (candidate) => candidate.id === actor.__headSpaceBoostPadId
          );
          const launchSpeed = LEVEL_FIVE_BOOST_LAUNCH_SPEED;
          if (actor.__headSpaceBoostHitWall) {
            physics.setLinearVelocityX?.(0);
            physics.setLinearVelocityY?.(0);
          } else {
            physics.setLinearVelocityX?.(directionX * launchSpeed);
            physics.setLinearVelocityY?.(directionY * launchSpeed);
          }
          actor.__headSpaceBoostHitWall = false;
          actor.__headSpaceBoostPhase = null;
          actor.__headSpaceBoostPadId = null;
          actor.__headSpaceBoostCaptureStartedAtSeconds = null;
          actor.__headSpaceBoostStartedAtSeconds = null;
          actor.__headSpaceBoostUntilSeconds = null;
          actor.__headSpaceBoostCooldownSeconds = 0.3;
          if (endedPlayerBoost) {
            clearPlayerCosmeticBoostWarp(actor);
            playerBoostEnded = true;
          }
        }
      }
    }

    if (playerBoostEnded) {
      lightningPlayer = null;
      lightningPad = null;
      const playerCompanionNames = new Set(["Player", "PlayerImage", "PlayerHelmet"]);
      for (const record of system.warpRecords) {
        const objectName = record.object?.getName?.();
        if (!playerCompanionNames.has(objectName) || !record.rendererObject?.scale) continue;
        record.rendererObject.scale.x = Number(record.object.getScaleX?.()) || record.scaleX;
        record.rendererObject.scale.y = Number(record.object.getScaleY?.()) || record.scaleY;
        record.rendererObject.rotation = (Number(record.object.getAngle?.()) || 0) * Math.PI / 180;
      }
      system.warpRecords = system.warpRecords.filter(
        (record) => !playerCompanionNames.has(record.object?.getName?.())
      );
    }

    drawLevelFiveBoostLightning(system, lightningPlayer, lightningPad, elapsedSeconds);
    const flashAmount =
      0.5 - Math.cos(elapsedSeconds * Math.PI * 2 * LEVEL_FIVE_BOOST_FLASH_HZ) * 0.5;
    const flashColor = interpolateLevelNineBlackHoleTint(0x21bfff, 0xffef35, flashAmount);
    for (const pad of system.boosts) {
      pad.graphic.tint = activePadIds.has(pad.id) ? flashColor : 0xffffff;
      pad.graphic.alpha = activePadIds.has(pad.id) ? 0.7 + flashAmount * 0.16 : 0.72;
    }
  }

  function enforceLevelFiveBoostVelocity(runtimeScene) {
    if (!runtimeScene) return;
    const currentLevel = getCurrentLevel(runtimeScene);
    const sharedSystem = runtimeScene.__headSpaceSharedDeclarativeMultiplayerSystem;
    const hasSharedBoosts = !!sharedSystem?.boosts?.length;
    if (
      ![5, 6, 10].includes(currentLevel) &&
      !usesLevelTenRuntime(runtimeScene, currentLevel) &&
      !(currentLevel === 1 && isMultiplayerGame(runtimeScene, currentLevel)) &&
      !hasSharedBoosts
    ) return;
    if (hasSharedBoosts) {
      const sharedActors = ["Player", "Enemy", "SmartEnemy", "EmittedMaterial"].flatMap((name) =>
        runtimeScene.getObjects(name)
      );
      for (const actor of sharedActors) {
        if (!actor?.hasBehavior?.("Physics2") || actor.getWidth() <= 0) continue;
        const pad = sharedSystem.boosts.find(
          (candidate) => candidate.id === actor.__headSpaceBoostPadId
        );
        if (!pad) continue;
        const physics = actor.getBehavior("Physics2");
        if (
          actor.__headSpaceBoostPhase === "launch" &&
          (Number(sharedSystem.__headSpaceBoostElapsedSeconds) || 0) <
            (Number(actor.__headSpaceBoostUntilSeconds) || -Infinity)
        ) {
          const launchSpeed = LEVEL_FIVE_BOOST_LAUNCH_SPEED;
          physics.setLinearVelocityX?.((actor.__headSpaceBoostDirectionX ?? 1) * launchSpeed);
          physics.setLinearVelocityY?.((actor.__headSpaceBoostDirectionY ?? 0) * launchSpeed);
        }
      }
    }
    const system = levelFiveBoostSystemState.get(runtimeScene);
    if (!system) return;
    const elapsedSeconds = Number.isFinite(Number(system.__headSpaceBoostElapsedSeconds))
      ? Number(system.__headSpaceBoostElapsedSeconds)
      : getElapsedSecondsForState(sceneState.get(runtimeScene));
    const actors = ["Player", "Enemy", "SmartEnemy", "EmittedMaterial"].flatMap((name) =>
      runtimeScene.getObjects(name)
    );
    for (const actor of actors) {
      if (!actor?.hasBehavior?.("Physics2") || actor.getWidth() <= 0) continue;
      const physics = actor.getBehavior("Physics2");
      if (actor.__headSpaceBoostPhase === "capture") {
        const pad = system.pads.find((candidate) => candidate.id === actor.__headSpaceBoostPadId);
        if (!pad) continue;
        const apexX = pad.x + pad.directionX * pad.width * 0.46;
        const apexY = pad.y + pad.directionY * pad.width * 0.46;
        const toApex = getNormalizedVector(
          apexX - actor.getCenterXInScene(),
          apexY - actor.getCenterYInScene()
        );
        if (physics.setLinearVelocityX) physics.setLinearVelocityX(toApex.x * LEVEL_FIVE_BOOST_PULL_SPEED);
        if (physics.setLinearVelocityY) physics.setLinearVelocityY(toApex.y * LEVEL_FIVE_BOOST_PULL_SPEED);
      } else if (
        actor.__headSpaceBoostPhase === "launch" &&
        elapsedSeconds < (actor.__headSpaceBoostUntilSeconds || -Infinity)
      ) {
        const directionX = actor.__headSpaceBoostDirectionX ?? 1;
        const directionY = actor.__headSpaceBoostDirectionY ?? 0;
        if (physics.setLinearVelocityX) physics.setLinearVelocityX(directionX * LEVEL_FIVE_BOOST_LAUNCH_SPEED);
        if (physics.setLinearVelocityY) physics.setLinearVelocityY(directionY * LEVEL_FIVE_BOOST_LAUNCH_SPEED);
      }
    }
  }

  function updateLevelFiveCosmicAlienSystem(runtimeScene, elapsedSeconds, active) {
    const level = getCurrentLevel(runtimeScene);
    if (![5, 6, 7].includes(level)) {
      clearLevelFiveCosmicAlienSystem(runtimeScene);
      return;
    }

    let system = levelFiveCosmicAlienSystemState.get(runtimeScene);
    if (system && system.level !== level) {
      clearLevelFiveCosmicAlienSystem(runtimeScene);
      system = null;
    }
    if (!system) {
      const player = runtimeScene.getObjects("Player")[0] || null;
      const layerName = player?.getLayer?.() || "";
      const layerRenderer = runtimeScene.getLayer(layerName)?.getRenderer?.();
      if (!player || !layerRenderer) return;
      system = {
        level,
        layerName,
        layerRenderer,
        elapsedSeconds: 0,
        cosmicAliens: [],
        cosmicAlienSpawnIndex: 0,
        spawned: false,
        cosmicAlienAbsentSinceSeconds: null,
      };
      levelFiveCosmicAlienSystemState.set(runtimeScene, system);
    }

    system.elapsedSeconds = elapsedSeconds;
    const liveEnemies = new Set(runtimeScene.getObjects("Enemy"));
    system.cosmicAliens = (system.cosmicAliens || []).filter((record) => {
      const enemy = record?.enemy;
      const alive =
        enemy &&
        liveEnemies.has(enemy) &&
        enemy.getWidth() > LEVEL_TWELVE_COSMIC_ALIEN_ABSORBED_SIZE;
      if (!alive) {
        cleanupLevelTwelveCosmicAlien(runtimeScene, system, record, !!enemy && liveEnemies.has(enemy));
        if (system.spawned && !Number.isFinite(system.cosmicAlienAbsentSinceSeconds)) {
          system.cosmicAlienAbsentSinceSeconds = elapsedSeconds;
        }
        return false;
      }
      if (enemy.hide) enemy.hide(true);
      if (enemy.setOpacity) enemy.setOpacity(0);
      updateLevelTwelveCosmicAlienVisual(record, elapsedSeconds);
      return true;
    });

    if (system.cosmicAliens.length > 0) {
      system.cosmicAlienAbsentSinceSeconds = null;
      return;
    }

    if (!active) return;

    if (!system.spawned) {
      if (elapsedSeconds >= LEVEL_FIVE_COSMIC_ALIEN_SPAWN_SECONDS) {
        system.spawned = !!createLevelTwelveCosmicAlien(runtimeScene, system);
      }
      return;
    }

    if (!Number.isFinite(system.cosmicAlienAbsentSinceSeconds)) {
      system.cosmicAlienAbsentSinceSeconds = elapsedSeconds;
    }
    if (
      elapsedSeconds - system.cosmicAlienAbsentSinceSeconds >=
        LEVEL_FIVE_COSMIC_ALIEN_RESPAWN_SECONDS &&
      createLevelTwelveCosmicAlien(runtimeScene, system)
    ) {
      system.cosmicAlienAbsentSinceSeconds = null;
    }
  }

  function clearLevelEightCosmicAlienSystem(runtimeScene) {
    const system = levelEightCosmicAlienSystemState.get(runtimeScene);
    if (!system) return;
    for (const record of system.cosmicAliens || []) {
      cleanupLevelTwelveCosmicAlien(runtimeScene, system, record, true);
    }
    levelEightCosmicAlienSystemState.delete(runtimeScene);
  }

  function updateLevelEightCosmicAlienSystem(runtimeScene, elapsedSeconds, active) {
    if (getCurrentLevel(runtimeScene) !== 8) {
      clearLevelEightCosmicAlienSystem(runtimeScene);
      return;
    }

    let system = levelEightCosmicAlienSystemState.get(runtimeScene);
    if (!system) {
      const player = runtimeScene.getObjects("Player")[0] || null;
      const layerName = player?.getLayer?.() || "";
      const layerRenderer = runtimeScene.getLayer(layerName)?.getRenderer?.();
      if (!player || !layerRenderer) return;
      system = {
        level: 8,
        layerName,
        layerRenderer,
        elapsedSeconds: 0,
        cosmicAliens: [],
        cosmicAlienSpawnIndex: 0,
        cosmicAlienAbsentSinceSeconds: 0,
      };
      levelEightCosmicAlienSystemState.set(runtimeScene, system);
    }

    system.elapsedSeconds = elapsedSeconds;
    const liveEnemies = new Set(runtimeScene.getObjects("Enemy"));
    system.cosmicAliens = (system.cosmicAliens || []).filter((record) => {
      const enemy = record?.enemy;
      const alive =
        enemy &&
        liveEnemies.has(enemy) &&
        enemy.getWidth() > LEVEL_TWELVE_COSMIC_ALIEN_ABSORBED_SIZE;
      if (!alive) {
        cleanupLevelTwelveCosmicAlien(runtimeScene, system, record, !!enemy && liveEnemies.has(enemy));
        return false;
      }
      if (enemy.hide) enemy.hide(true);
      if (enemy.setOpacity) enemy.setOpacity(0);
      updateLevelTwelveCosmicAlienVisual(record, elapsedSeconds);
      return true;
    });

    if (system.cosmicAliens.length > 0) {
      system.cosmicAlienAbsentSinceSeconds = null;
      return;
    }
    if (!Number.isFinite(system.cosmicAlienAbsentSinceSeconds)) {
      system.cosmicAlienAbsentSinceSeconds = elapsedSeconds;
    }
    if (
      active &&
      elapsedSeconds - system.cosmicAlienAbsentSinceSeconds >=
        LEVEL_EIGHT_COSMIC_ALIEN_RESPAWN_SECONDS
    ) {
      if (createLevelTwelveCosmicAlien(runtimeScene, system)) {
        system.cosmicAlienAbsentSinceSeconds = null;
      }
    }
  }

  function clearLevelNineCosmicAlienSystem(runtimeScene) {
    const system = levelNineCosmicAlienSystemState.get(runtimeScene);
    if (!system) return;
    for (const record of system.cosmicAliens || []) {
      cleanupLevelTwelveCosmicAlien(runtimeScene, system, record, true);
    }
    levelNineCosmicAlienSystemState.delete(runtimeScene);
  }

  function updateLevelNineCosmicAlienSystem(runtimeScene, elapsedSeconds, active) {
    if (getCurrentLevel(runtimeScene) !== 9) {
      clearLevelNineCosmicAlienSystem(runtimeScene);
      return;
    }
    let system = levelNineCosmicAlienSystemState.get(runtimeScene);
    if (!system) {
      const player = runtimeScene.getObjects("Player")[0] || null;
      const layerName = player?.getLayer?.() || "";
      const layerRenderer = runtimeScene.getLayer(layerName)?.getRenderer?.();
      if (!player || !layerRenderer) return;
      system = {
        level: 9,
        layerName,
        layerRenderer,
        elapsedSeconds: 0,
        cosmicAliens: [],
        cosmicAlienSpawnIndex: 0,
        cosmicAlienAbsentSinceSeconds: null,
        firstSpawned: false,
      };
      levelNineCosmicAlienSystemState.set(runtimeScene, system);
    }
    system.elapsedSeconds = elapsedSeconds;
    const liveEnemies = new Set(runtimeScene.getObjects("Enemy"));
    system.cosmicAliens = (system.cosmicAliens || []).filter((record) => {
      const enemy = record?.enemy;
      const alive = enemy && liveEnemies.has(enemy) &&
        enemy.getWidth() > LEVEL_TWELVE_COSMIC_ALIEN_ABSORBED_SIZE;
      if (!alive) {
        cleanupLevelTwelveCosmicAlien(runtimeScene, system, record, !!enemy && liveEnemies.has(enemy));
        return false;
      }
      if (enemy.hide) enemy.hide(true);
      if (enemy.setOpacity) enemy.setOpacity(0);
      updateLevelTwelveCosmicAlienVisual(record, elapsedSeconds);
      return true;
    });
    if (system.cosmicAliens.length > 0) {
      system.cosmicAlienAbsentSinceSeconds = null;
      return;
    }
    if (!system.firstSpawned) {
      if (active && elapsedSeconds >= LEVEL_NINE_COSMIC_ALIEN_FIRST_SPAWN_SECONDS &&
          createLevelTwelveCosmicAlien(runtimeScene, system)) {
        system.firstSpawned = true;
      }
      return;
    }
    if (!Number.isFinite(system.cosmicAlienAbsentSinceSeconds)) {
      system.cosmicAlienAbsentSinceSeconds = elapsedSeconds;
    }
    if (active && elapsedSeconds - system.cosmicAlienAbsentSinceSeconds >=
        LEVEL_NINE_COSMIC_ALIEN_RESPAWN_SECONDS &&
        createLevelTwelveCosmicAlien(runtimeScene, system)) {
      system.cosmicAlienAbsentSinceSeconds = null;
    }
  }

  function createLevelElevenTriexos(system) {
    const triexos = [];
    let randomState = 0x11e0cafe;
    const random = () => {
      randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0;
      return randomState / 0x100000000;
    };
    const minimumDistance = system.planet
      ? system.planet.radius + LEVEL_ELEVEN_TRIEXO_RADIUS + LEVEL_ELEVEN_TRIEXO_PLANET_CLEARANCE
      : LEVEL_ELEVEN_TRIEXO_RADIUS + 60;
    const maximumDistance = Math.max(
      minimumDistance + 80,
      system.triexoArenaRadius - LEVEL_ELEVEN_TRIEXO_RADIUS - 24
    );
    const triexoCount = system.level === 12 ? LEVEL_TWELVE_TRIEXO_COUNT : LEVEL_ELEVEN_TRIEXO_COUNT;
    const levelTwelveRowHalfWidth = system.triexoArenaRadius * 0.54;
    const levelTwelveRowOffset = system.triexoArenaRadius * 0.18;

    for (let index = 0; index < triexoCount; index++) {
      const levelTwelveTopRowCount = Math.ceil(triexoCount * 0.5);
      const levelTwelveRowIndex = index < levelTwelveTopRowCount ? 0 : 1;
      const levelTwelveColumnCount =
        levelTwelveRowIndex === 0 ? levelTwelveTopRowCount : triexoCount - levelTwelveTopRowCount;
      const levelTwelveColumnIndex =
        levelTwelveRowIndex === 0 ? index : index - levelTwelveTopRowCount;
      const levelTwelveRowProgress =
        levelTwelveColumnCount <= 1 ? 0.5 : levelTwelveColumnIndex / (levelTwelveColumnCount - 1);
      const levelTwelveRowWidth =
        levelTwelveRowHalfWidth * 2 * (levelTwelveColumnCount <= 2 ? 0.62 : 1);
      let candidate =
        system.level === 12
          ? {
              x:
                system.centerX -
                levelTwelveRowWidth * 0.5 +
                levelTwelveRowProgress * levelTwelveRowWidth,
              y: system.centerY + (levelTwelveRowIndex === 0 ? -1 : 1) * levelTwelveRowOffset,
            }
          : null;
      for (let attempt = 0; !candidate && attempt < 120; attempt++) {
        const angle = random() * Math.PI * 2;
        const distance = Math.sqrt(
          minimumDistance * minimumDistance +
            random() * (maximumDistance * maximumDistance - minimumDistance * minimumDistance)
        );
        const x = system.centerX + Math.cos(angle) * distance;
        const y = system.centerY + Math.sin(angle) * distance;
        const overlapsTriexo = triexos.some(
          (other) =>
            Math.hypot(x - other.x, y - other.y) <
            LEVEL_ELEVEN_TRIEXO_RADIUS * 2 + LEVEL_ELEVEN_TRIEXO_PAIR_CLEARANCE
        );
        const overlapsStation = system.stations.some(
          (station) =>
            Math.hypot(x - station.x, y - station.y) <
            LEVEL_ELEVEN_TRIEXO_RADIUS + station.radius + 70
        );
        const overlapsBlackHole = system.blackHoles.some(
          (blackHole) =>
            Math.hypot(x - blackHole.x, y - blackHole.y) <
            LEVEL_ELEVEN_TRIEXO_RADIUS +
              (blackHole.triggerRadius || LEVEL_ELEVEN_PORTAL_TRIGGER_RADIUS) +
              80
        );
        if (!overlapsTriexo && !overlapsStation && !overlapsBlackHole) {
          candidate = { x, y };
          break;
        }
      }

      if (!candidate) {
        const fallbackAngle = index * 2.399963229728653;
        const fallbackDistance =
          minimumDistance +
          ((index % 3) / 2) * Math.max(0, maximumDistance - minimumDistance);
        candidate = {
          x: system.centerX + Math.cos(fallbackAngle) * fallbackDistance,
          y: system.centerY + Math.sin(fallbackAngle) * fallbackDistance,
        };
      }

      const sprite = createLevelSelectSprite(
        system.layerRenderer,
        LEVEL_ELEVEN_TRIEXO_RESOURCE,
        LEVEL_ELEVEN_TRIEXO_SIZE,
        candidate.x,
        candidate.y,
        2.12 + index * 0.001
      );
      sprite.blendMode = PIXI.BLEND_MODES.NORMAL;
      sprite.filters = null;
      sprite.__headSpaceEmitsLight = false;
      const triexo = {
        sprite,
        x: candidate.x,
        y: candidate.y,
        radius: LEVEL_ELEVEN_TRIEXO_RADIUS,
        velocityX: 0,
        velocityY: 0,
        rotation: system.level === 12 ? 0 : random() * Math.PI * 2,
        angularVelocity: 0,
      };
      triexo.collisionProxy = createLevelElevenCollisionProxy(triexo, `triexo-${index}`);
      sprite.rotation = triexo.rotation;
      triexos.push(triexo);
    }

    return triexos;
  }

  function getLevelElevenEnemySpawnClearance(system, occupied, x, y, enemyRadius) {
    let clearance = Infinity;
    for (const triexo of system.triexos || []) {
      clearance = Math.min(
        clearance,
        Math.hypot(x - triexo.x, y - triexo.y) - enemyRadius - triexo.radius - 32
      );
    }
    for (const station of system.stations || []) {
      clearance = Math.min(
        clearance,
        Math.hypot(x - station.x, y - station.y) - enemyRadius - station.radius - 40
      );
    }
    for (const planet of system.planets || []) {
      clearance = Math.min(
        clearance,
        Math.hypot(x - planet.x, y - planet.y) - enemyRadius - planet.radius - 40
      );
    }
    for (const blackHole of system.blackHoles || []) {
      clearance = Math.min(
        clearance,
        Math.hypot(x - blackHole.x, y - blackHole.y) -
          enemyRadius -
          (blackHole.triggerRadius || blackHole.radius || LEVEL_ELEVEN_PORTAL_TRIGGER_RADIUS) -
          52
      );
    }
    for (const other of occupied || []) {
      clearance = Math.min(
        clearance,
        Math.hypot(x - other.x, y - other.y) - enemyRadius - other.radius - (other.margin ?? 24)
      );
    }
    return clearance;
  }

  function chooseLevelElevenExtraEnemyCenter(system, enemyRadius, occupied, ordinal, angleBias = 0) {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const minimumDistance = system.planet
      ? system.planet.radius + enemyRadius + 150
      : Math.max(180, enemyRadius + 120);
    const maximumDistance = Math.max(
      minimumDistance + 80,
      system.triexoArenaRadius - enemyRadius - 96
    );
    let best = null;
    let bestClearance = -Infinity;
    for (let attempt = 0; attempt < 160; attempt++) {
      const angle = ordinal * goldenAngle + 0.41 + angleBias + attempt * 0.37;
      const band = ((ordinal + attempt) % 7) / 6;
      const distance = minimumDistance + band * (maximumDistance - minimumDistance);
      const candidate = {
        x: system.centerX + Math.cos(angle) * distance,
        y: system.centerY + Math.sin(angle) * distance,
      };
      const clearance = getLevelElevenEnemySpawnClearance(
        system,
        occupied,
        candidate.x,
        candidate.y,
        enemyRadius
      );
      if (clearance > bestClearance) {
        bestClearance = clearance;
        best = candidate;
      }
      if (clearance >= 0) return candidate;
    }
    return best || { x: system.centerX, y: system.centerY };
  }

  function createLevelTwelvePlayerStartBlocker(player) {
    if (!player) return null;
    return {
      x: player.getCenterXInScene(),
      y: player.getCenterYInScene(),
      radius: getApproxObjectRadius(player, 18),
      margin: LEVEL_TWELVE_PLAYER_START_ENEMY_CLEARANCE,
    };
  }

  function enforceLevelTwelveEnemyStartClearance(runtimeScene, system, player) {
    if (system.level !== 12 || !player || system.levelTwelveEnemyStartClearanceApplied) return;
    system.levelTwelveEnemyStartClearanceApplied = true;
    const playerBlocker = createLevelTwelvePlayerStartBlocker(player);
    if (!playerBlocker) return;
    const enemies = runtimeScene
      .getObjects("Enemy")
      .filter((enemy) => enemy && !isLevelTwelveCosmicAlien(enemy) && enemy.getWidth() > 0);

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const enemyRadius = getApproxObjectRadius(enemy, 18);
      const playerClearance =
        Math.hypot(enemy.getCenterXInScene() - playerBlocker.x, enemy.getCenterYInScene() - playerBlocker.y) -
        enemyRadius -
        playerBlocker.radius;
      if (playerClearance >= LEVEL_TWELVE_PLAYER_START_ENEMY_CLEARANCE) continue;

      const occupied = [playerBlocker];
      for (let j = 0; j < enemies.length; j++) {
        if (i === j) continue;
        const other = enemies[j];
        occupied.push({
          x: other.getCenterXInScene(),
          y: other.getCenterYInScene(),
          radius: getApproxObjectRadius(other, 18),
          margin: 24,
        });
      }
      const spawn = chooseLevelElevenExtraEnemyCenter(
        system,
        enemyRadius,
        occupied,
        500 + i,
        Math.PI * 0.31
      );
      moveObjectToCenter(enemy, spawn.x, spawn.y);
      clearObjectMotion(enemy);
    }
  }

  function ensureLevelElevenExtraEnemies(runtimeScene, system) {
    if (!system || system.extraEnemiesSeeded) return;
    const player = runtimeScene.getObjects("Player")[0] || null;
    if (!player || player.getWidth() <= 0) return;
    system.extraEnemiesSeeded = true;
    const existingEnemies = runtimeScene.getObjects("Enemy");
    const targetEnemyCount =
      system.level === 12 ? LEVEL_TWELVE_TARGET_ENEMY_COUNT : LEVEL_ELEVEN_TARGET_ENEMY_COUNT;
    const enemiesToAdd = Math.max(0, targetEnemyCount - existingEnemies.length);
    const playerSize = Math.max(1, Math.min(player.getWidth(), player.getHeight()));
    const layerName = player.getLayer?.() || "";
    const occupied = existingEnemies
      .filter((enemy) => !isLevelTwelveCosmicAlien(enemy))
      .map((enemy) => ({
        x: enemy.getCenterXInScene(),
        y: enemy.getCenterYInScene(),
        radius: getApproxObjectRadius(enemy, 18),
        margin: 24,
      }));
    const playerBlocker = system.level === 12 ? createLevelTwelvePlayerStartBlocker(player) : null;
    if (playerBlocker) occupied.push(playerBlocker);

    for (let index = 0; index < enemiesToAdd; index++) {
      const targetOrdinal = existingEnemies.length + index;
      const useLevelTwelveHugeRange =
        system.level === 12 &&
        targetOrdinal >= LEVEL_TWELVE_TARGET_ENEMY_COUNT - LEVEL_TWELVE_HUGE_EXTRA_ENEMY_COUNT;
      const useLevelTwelveLargeRange =
        system.level === 12 &&
        !useLevelTwelveHugeRange &&
        targetOrdinal >=
          LEVEL_TWELVE_TARGET_ENEMY_COUNT -
            LEVEL_TWELVE_HUGE_EXTRA_ENEMY_COUNT -
            LEVEL_TWELVE_LARGE_EXTRA_ENEMY_COUNT;
      const useLevelTwelveSmallRange =
        system.level === 12 && index < LEVEL_TWELVE_SMALL_EXTRA_ENEMY_COUNT;
      const sizeRatios = useLevelTwelveHugeRange
        ? LEVEL_TWELVE_HUGE_EXTRA_ENEMY_SIZE_RATIOS
        : useLevelTwelveLargeRange
        ? LEVEL_TWELVE_LARGE_EXTRA_ENEMY_SIZE_RATIOS
        : useLevelTwelveSmallRange
        ? LEVEL_TWELVE_SMALL_EXTRA_ENEMY_SIZE_RATIOS
        : LEVEL_ELEVEN_EXTRA_ENEMY_SIZE_RATIOS;
      const ratio = sizeRatios[index % sizeRatios.length];
      const targetSize = useLevelTwelveHugeRange
        ? clamp(playerSize * ratio, Math.max(56, playerSize * 1.55), Math.max(72, playerSize * 2.55))
        : useLevelTwelveSmallRange
        ? clamp(playerSize * ratio, 22, Math.max(30, playerSize * 0.52))
        : clamp(playerSize * ratio, 32, Math.max(44, playerSize * 1.18));
      const enemyRadius = targetSize * 0.5;
      const spawn = chooseLevelElevenExtraEnemyCenter(
        system,
        enemyRadius,
        occupied,
        targetOrdinal,
        useLevelTwelveHugeRange ? Math.PI * 0.17 : 0
      );

      const enemy = createSceneObject(runtimeScene, "Enemy", layerName);
      if (!enemy) continue;
      setObjectSizeAndShape(enemy, targetSize);
      moveObjectToCenter(enemy, spawn.x, spawn.y);
      if (enemy.setZOrder && player.getZOrder) enemy.setZOrder(player.getZOrder());
      clearObjectMotion(enemy);
      enemy.__headSpaceLevelElevenExtraEnemy = true;
      createImageCompanionForHost(runtimeScene, enemy, "Enemy", "EnemyImage");
      occupied.push({ x: spawn.x, y: spawn.y, radius: enemyRadius, margin: 24 });
    }
    enforceLevelTwelveEnemyStartClearance(runtimeScene, system, player);
  }

  function clearLevelElevenCelestialSystem(runtimeScene) {
    const system = levelElevenCelestialSystemState.get(runtimeScene);
    if (!system) return;
    restoreLevelNinePortalVisuals(system);
    if (system.transit?.player) system.transit.player.__headSpaceBlackHoleTransit = false;
    while (system.projectiles?.length) {
      removeLevelEightStationProjectile(
        runtimeScene,
        system,
        system.projectiles[system.projectiles.length - 1]
      );
    }
    for (const blackHole of system.blackHoles || []) {
      removeLevelSevenRendererObject(runtimeScene, system.layerName, blackHole.sprite, false);
    }
    if (system.planet?.sprite) {
      removeLevelSevenRendererObject(runtimeScene, system.layerName, system.planet.sprite, false);
    }
    for (const planet of system.planets || []) {
      removeLevelSevenRendererObject(runtimeScene, system.layerName, planet.sprite, false);
    }
    for (const station of system.stations || []) {
      removeLevelSevenRendererObject(runtimeScene, system.layerName, station.sprite, false);
    }
    for (const triexo of system.triexos || []) {
      removeLevelSevenRendererObject(runtimeScene, system.layerName, triexo.sprite, false);
    }
    for (const cosmicAlien of system.cosmicAliens || []) {
      cleanupLevelTwelveCosmicAlien(runtimeScene, system, cosmicAlien, true);
    }
    if (typeof window !== "undefined") delete window.__headSpaceLevelElevenCelestial;
    levelElevenCelestialSystemState.delete(runtimeScene);
  }

  function ensureLevelElevenCelestialSystem(runtimeScene) {
    const level = getCurrentLevel(runtimeScene);
    const isLevelTwelve = level === 12;
    let system = levelElevenCelestialSystemState.get(runtimeScene);
    if (
      system?.level === level &&
      (!system.planet?.sprite || !system.planet.sprite.destroyed) &&
      system.planets?.every((body) => !body.sprite.destroyed) &&
      system.blackHoles?.every((body) => !body.sprite.destroyed) &&
      system.stations?.every((body) => !body.sprite.destroyed)
    ) {
      return system;
    }
    if (typeof PIXI === "undefined" || typeof PIXI.Texture?.from !== "function") return null;

    clearLevelElevenCelestialSystem(runtimeScene);
    const walls = runtimeScene.getObjects("Walls").slice();
    if (walls.length < 3) return null;
    const centerX = walls.reduce((sum, wall) => sum + wall.getCenterXInScene(), 0) / walls.length;
    const centerY = walls.reduce((sum, wall) => sum + wall.getCenterYInScene(), 0) / walls.length;
    let wallTargets = walls.map((wall) => ({
      wall,
      x: centerX + (wall.getCenterXInScene() - centerX) * LEVEL_ELEVEN_ARENA_SCALE,
      y: centerY + (wall.getCenterYInScene() - centerY) * LEVEL_ELEVEN_ARENA_SCALE,
      width: wall.getWidth() * LEVEL_ELEVEN_ARENA_SCALE,
      height: wall.getHeight() * LEVEL_ELEVEN_ARENA_SCALE,
      angle: wall.getAngle(),
    }));
    let hexSides = null;
    let arenaVertices = null;
    let hexApothem = null;
    let hexWallThickness = 0;
    if (isLevelTwelve) {
      const sourceReach = wallTargets.reduce(
        (maximum, target) =>
          Math.max(maximum, Math.hypot(target.x - centerX, target.y - centerY)),
        1
      );
      const apothem = Math.max(900, sourceReach * LEVEL_TWELVE_ARENA_APOTHEM_SCALE);
      const sideLength = (apothem * 2) / Math.sqrt(3);
      const wallThickness = Math.max(
        36,
        wallTargets.reduce(
          (sum, target) => sum + Math.min(target.width, target.height),
          0
        ) / Math.max(1, wallTargets.length)
      );
      const activeWalls = walls.slice(0, LEVEL_TWELVE_ARENA_SIDE_COUNT);
      wallTargets = activeWalls.map((wall, index) => {
        const normalAngle = -Math.PI / 3 + (index * Math.PI * 2) / LEVEL_TWELVE_ARENA_SIDE_COUNT;
        const tangentAngle = normalAngle + Math.PI * 0.5;
        return {
          wall,
          x: centerX + Math.cos(normalAngle) * apothem,
          y: centerY + Math.sin(normalAngle) * apothem,
          width: sideLength + wallThickness * 0.45,
          height: wallThickness,
          angle: (tangentAngle * 180) / Math.PI,
        };
      });
      hexSides = wallTargets.map((target, index) => {
        const normalAngle = -Math.PI / 3 + (index * Math.PI * 2) / LEVEL_TWELVE_ARENA_SIDE_COUNT;
        return {
          normalX: Math.cos(normalAngle),
          normalY: Math.sin(normalAngle),
          apothem,
        };
      });
      const circumradius = (apothem * 2) / Math.sqrt(3);
      arenaVertices = Array.from({ length: LEVEL_TWELVE_ARENA_SIDE_COUNT }, (_, index) => {
        const vertexAngle = -Math.PI * 0.5 + (index * Math.PI * 2) / LEVEL_TWELVE_ARENA_SIDE_COUNT;
        return {
          x: centerX + Math.cos(vertexAngle) * circumradius,
          y: centerY + Math.sin(vertexAngle) * circumradius,
        };
      });
      hexApothem = apothem;
      hexWallThickness = wallThickness;
      const activeWallSet = new Set(activeWalls);
      for (const wall of walls) {
        if (activeWallSet.has(wall)) continue;
        if (wall.deleteFromScene) wall.deleteFromScene(runtimeScene);
      }
    }
    const verticalReach = wallTargets.reduce(
      (maximum, target) => Math.max(maximum, Math.abs(target.y - centerY)),
      1
    );
    const horizontalReach = wallTargets.reduce(
      (maximum, target) => Math.max(maximum, Math.abs(target.x - centerX)),
      1
    );

    const layerName = "";
    const layerRenderer = runtimeScene.getLayer(layerName)?.getRenderer?.();
    if (!layerRenderer) return null;
    const blackHoleTexture = PIXI.Texture.from(
      isLevelTwelve
        ? "blackhole.png?v=level12-vertex-pair-20260708-1"
        : "blackhole.png?v=level11-pair-20260706-1"
    );
    const createBlackHole = (config, index) => {
      const sprite = createLevelNineBlackHoleGraphic(blackHoleTexture, index, config.size);
      if (!sprite) return null;
      layerRenderer.addRendererObject(sprite, 1.6 + index * 0.01);
      const blackHole = {
        sprite,
        ...config,
        radius: config.triggerRadius,
      };
      blackHole.collisionProxy = createLevelElevenCollisionProxy(blackHole, `black-hole-${index}`);
      return blackHole;
    };
    const blackHoles = (isLevelTwelve
      ? [0, 3].map((vertexIndex, index) => {
          const vertex = arenaVertices[vertexIndex];
          const radial = getNormalizedVector(vertex.x - centerX, vertex.y - centerY);
          const distance = Math.max(
            1,
            (hexApothem -
              LEVEL_TWELVE_PORTAL_TRIGGER_RADIUS -
              hexWallThickness * 0.5 -
              LEVEL_TWELVE_BLACK_HOLE_VERTEX_MARGIN) /
              Math.cos(Math.PI / 6)
          );
          return {
            fixed: true,
            size: LEVEL_TWELVE_BLACK_HOLE_SIZE,
            triggerRadius: LEVEL_TWELVE_BLACK_HOLE_SIZE * LEVEL_NINE_BLACK_HOLE_OUTER_EDGE_RATIO,
            x: centerX + radial.x * distance,
            y: centerY + radial.y * distance,
            baseY: centerY + radial.y * distance,
            motionPhase: index * Math.PI,
            direction: index === 0 ? 1 : -1,
          };
        })
      : [-1, 1].map((direction, index) => ({
          fixed: false,
          size: LEVEL_ELEVEN_BLACK_HOLE_SIZE,
          triggerRadius: LEVEL_ELEVEN_BLACK_HOLE_SIZE * LEVEL_NINE_BLACK_HOLE_OUTER_EDGE_RATIO,
          x: centerX,
          y: centerY + direction * verticalReach * 0.72,
          baseY: centerY + direction * verticalReach * 0.72,
          motionPhase: index * Math.PI,
          direction,
        }))).map(createBlackHole).filter(Boolean);

    const planet = isLevelTwelve
      ? null
      : {
          sprite: createLevelSelectSprite(
            layerRenderer,
            "Planet13.png?v=level11-center-20260706-1",
            LEVEL_ELEVEN_PLANET_SIZE,
            centerX,
            centerY,
            2
          ),
          x: centerX,
          y: centerY,
          radius: LEVEL_ELEVEN_PLANET_RADIUS,
          velocityX: 0,
          velocityY: 0,
        };
    if (planet) planet.collisionProxy = createLevelElevenCollisionProxy(planet, "planet13");

    const stationConfigs = isLevelTwelve
      ? [5, 2].map((vertexIndex, index) => {
          const vertex = arenaVertices[vertexIndex];
          const direction = getNormalizedVector(vertex.x - centerX, vertex.y - centerY);
          const distance =
            (hexApothem - LEVEL_ELEVEN_STATION_RADIUS - hexWallThickness * 0.5 - 54) /
            Math.cos(Math.PI / 6);
          return {
            phase: 0,
            direction: index === 0 ? 1 : -1,
            fixed: true,
            x: centerX + direction.x * distance,
            y: centerY + direction.y * distance,
          };
        })
      : [
          {
            phase: 0,
            direction: 1,
            fixed: false,
            x: centerX + LEVEL_ELEVEN_STATION_ORBIT_RADIUS,
            y: centerY,
          },
          {
            phase: Math.PI,
            direction: -1,
            fixed: false,
            x: centerX - LEVEL_ELEVEN_STATION_ORBIT_RADIUS,
            y: centerY,
          },
        ];
    const stationFireIntervalSeconds = isLevelTwelve
      ? LEVEL_TWELVE_STATION_FIRE_INTERVAL_SECONDS
      : LEVEL_ELEVEN_STATION_FIRE_INTERVAL_SECONDS;
    const stations = stationConfigs.map((config, index) => {
      const sprite = createLevelSelectSprite(
        layerRenderer,
        "spacestationwhite.png?v=level11-orbit-20260706-1",
        LEVEL_ELEVEN_STATION_SIZE,
        centerX,
        centerY,
        2.2 + index * 0.01
      );
      const station = {
        sprite,
        phase: config.phase,
        direction: config.direction,
        fixed: config.fixed,
        radius: LEVEL_ELEVEN_STATION_RADIUS,
        x: config.x,
        y: config.y,
        velocityX: 0,
        velocityY: 0,
        nextShotAt: 1 + index * (stationFireIntervalSeconds * 0.5),
      };
      station.collisionProxy = createLevelElevenCollisionProxy(station, `station-${index}`);
      sprite.position.set(station.x, station.y);
      return station;
    });

    const levelTwelvePlanetSystems = isLevelTwelve
      ? createLevelTwelvePlanetSystems(layerRenderer, centerX, centerY, arenaVertices, hexApothem)
      : [];
    const levelTwelveEyeSystem = isLevelTwelve
      ? createLevelTwelveEyeSystem(layerRenderer, centerX, centerY)
      : null;
    const planets = levelTwelvePlanetSystems.flatMap((planetSystem) => [
      planetSystem.primary,
      planetSystem.moon,
    ]);
    if (levelTwelveEyeSystem) {
      planets.push(levelTwelveEyeSystem.planet8, ...levelTwelveEyeSystem.moons);
    }

    system = {
      level,
      layerName,
      centerX,
      centerY,
      wallTargets,
      hexSides,
      arenaVertices,
      blackHoles,
      planet,
      planets,
      levelTwelvePlanetSystems,
      levelTwelveEyeSystem,
      stations,
      stationFireIntervalSeconds,
      elapsedSeconds: 0,
      portalCooldownSeconds: 0,
      transit: null,
      visualRecords: [],
      projectiles: [],
      shotIndex: 0,
      layerRenderer,
      extraEnemiesSeeded: false,
      cosmicAliens: [],
      cosmicAlienAbsentSinceSeconds: isLevelTwelve
        ? -LEVEL_TWELVE_COSMIC_ALIEN_RESPAWN_SECONDS
        : null,
      cosmicAlienSpawnIndex: 0,
      triexoArenaRadius:
        (isLevelTwelve ? hexApothem : Math.min(horizontalReach, verticalReach)) -
        LEVEL_ELEVEN_TRIEXO_ARENA_MARGIN,
    };
    updateLevelTwelvePlanetSystems(system);
    updateLevelTwelveEyeSystem(system);
    system.triexos = createLevelElevenTriexos(system);
    levelElevenCelestialSystemState.set(runtimeScene, system);
    if (typeof window !== "undefined") window.__headSpaceLevelElevenCelestial = system;
    return system;
  }

  function maintainLevelElevenArena(system) {
    for (const target of system.wallTargets) {
      const wall = target.wall;
      if (!wall || wall.getWidth() <= 0) continue;
      if (wall.hide) wall.hide(false);
      if (wall.setSize) wall.setSize(target.width, target.height);
      if (wall.setAngle) wall.setAngle(target.angle);
      moveObjectToCenter(wall, target.x, target.y);
      if (wall.hasBehavior?.("Physics2")) {
        const physics = wall.getBehavior("Physics2");
        if (physics.setStatic) physics.setStatic();
        if (physics.setLinearVelocityX) physics.setLinearVelocityX(0);
        if (physics.setLinearVelocityY) physics.setLinearVelocityY(0);
        if (physics.setAngularVelocity) physics.setAngularVelocity(0);
      }
    }
  }

  function retireLevelElevenAuthoredPlanets(runtimeScene) {
    for (const objectName of PLANET_NAMES) {
      const planets = runtimeScene.getObjects(objectName).slice();
      for (const planet of planets) {
        if (planet.hide) planet.hide(true);
        if (planet.hasBehavior?.("Physics2")) {
          const physics = planet.getBehavior("Physics2");
          if (physics.setStatic) physics.setStatic();
          if (physics.setShapeScale) physics.setShapeScale(0.001);
          if (physics.setLinearVelocityX) physics.setLinearVelocityX(0);
          if (physics.setLinearVelocityY) physics.setLinearVelocityY(0);
        }
        if (planet.setSize) planet.setSize(1, 1);
        moveObjectToCenter(planet, -100000, -100000);
        if (planet.deleteFromScene) planet.deleteFromScene(runtimeScene);
      }
    }
  }

  function updateLevelElevenVisuals(system) {
    if (system.planet?.sprite) {
      system.planet.sprite.position.set(system.centerX, system.centerY);
      system.planet.sprite.rotation = system.elapsedSeconds * 0.035;
    }
    for (let i = 0; i < system.blackHoles.length; i++) {
      const blackHole = system.blackHoles[i];
      if (!blackHole.fixed) {
        const motionPhase =
          system.elapsedSeconds * LEVEL_ELEVEN_BLACK_HOLE_OSCILLATION_SPEED + blackHole.motionPhase;
        blackHole.x =
          system.centerX + Math.sin(motionPhase) * LEVEL_ELEVEN_BLACK_HOLE_TRAVEL_DISTANCE;
        blackHole.y = blackHole.baseY;
      }
      const pulse = 1 + Math.sin(system.elapsedSeconds * 1.25 + i * Math.PI) * 0.035;
      const size = blackHole.size || LEVEL_ELEVEN_BLACK_HOLE_SIZE;
      blackHole.sprite.position.set(blackHole.x, blackHole.y);
      const coreSprite = blackHole.sprite.__headSpaceSprite || blackHole.sprite;
      coreSprite.width = size * pulse;
      coreSprite.height = size * pulse;
      coreSprite.rotation =
        system.elapsedSeconds * LEVEL_NINE_BLACK_HOLE_ROTATION_SPEED * blackHole.direction;
      const tintCount = LEVEL_NINE_BLACK_HOLE_TINTS.length;
      const tintPhase = (system.elapsedSeconds * 0.22 + i * 0.5) % tintCount;
      const tintIndex = Math.floor(tintPhase);
      coreSprite.tint = interpolateLevelNineBlackHoleTint(
        LEVEL_NINE_BLACK_HOLE_TINTS[tintIndex],
        LEVEL_NINE_BLACK_HOLE_TINTS[(tintIndex + 1) % tintCount],
        tintPhase - tintIndex
      );
      const halo = blackHole.sprite.__headSpaceHalo;
      if (halo) {
        halo.scale.set(0.94 + pulse * 0.07);
        halo.alpha = 0.68 + Math.sin(system.elapsedSeconds * 1.6 + i) * 0.18;
      }
      const sparkles = blackHole.sprite.__headSpaceSparkles || [];
      for (let sparkleIndex = 0; sparkleIndex < sparkles.length; sparkleIndex++) {
        const sparkle = sparkles[sparkleIndex];
        const phase = sparkle.__headSpacePhase +
          system.elapsedSeconds * (0.7 + (sparkleIndex % 5) * 0.075) * blackHole.direction;
        const orbit = size * sparkle.__headSpaceOrbit;
        sparkle.position.set(Math.cos(phase) * orbit, Math.sin(phase) * orbit * 0.82);
        sparkle.alpha = 0.18 +
          (Math.sin(phase * 3.4 + system.elapsedSeconds * 2.6) * 0.5 + 0.5) * 0.82;
      }
    }
    for (let i = 0; i < system.stations.length; i++) {
      const station = system.stations[i];
      if (station.fixed) {
        station.velocityX = 0;
        station.velocityY = 0;
        station.sprite.position.set(station.x, station.y);
        station.sprite.rotation =
          Math.atan2(system.centerY - station.y, system.centerX - station.x) + Math.PI * 0.5;
        continue;
      }
      const angularSpeed = LEVEL_ELEVEN_STATION_ORBIT_SPEED * station.direction;
      const angle = station.phase + system.elapsedSeconds * angularSpeed;
      station.x = system.centerX + Math.cos(angle) * LEVEL_ELEVEN_STATION_ORBIT_RADIUS;
      station.y = system.centerY + Math.sin(angle) * LEVEL_ELEVEN_STATION_ORBIT_RADIUS;
      station.velocityX = -Math.sin(angle) * LEVEL_ELEVEN_STATION_ORBIT_RADIUS * angularSpeed;
      station.velocityY = Math.cos(angle) * LEVEL_ELEVEN_STATION_ORBIT_RADIUS * angularSpeed;
      station.sprite.position.set(station.x, station.y);
      station.sprite.rotation = angle + Math.PI * 0.5;
    }
    updateLevelTwelvePlanetSystems(system);
    updateLevelTwelveEyeSystem(system);
  }

  function capLevelElevenTriexoSpeed(triexo) {
    const speed = Math.hypot(triexo.velocityX, triexo.velocityY);
    if (!Number.isFinite(speed) || speed <= LEVEL_ELEVEN_TRIEXO_MAX_FLING_SPEED || speed <= 0.001) return;
    const scale = LEVEL_ELEVEN_TRIEXO_MAX_FLING_SPEED / speed;
    triexo.velocityX *= scale;
    triexo.velocityY *= scale;
  }

  function syncLevelElevenTriexoVisuals(system) {
    for (const triexo of system.triexos || []) {
      triexo.sprite.position.set(triexo.x, triexo.y);
      triexo.sprite.rotation = triexo.rotation;
    }
  }

  function playLevelElevenTriexoCollisionSound(runtimeScene, triexo, otherTriexo = null) {
    const nowSeconds = performance.now() / 1000;
    if (
      nowSeconds - (triexo.lastCollisionSoundAtSeconds ?? -Infinity) <
      LEVEL_ELEVEN_TRIEXO_SOUND_COOLDOWN_SECONDS
    ) return;
    triexo.lastCollisionSoundAtSeconds = nowSeconds;
    if (otherTriexo) otherTriexo.lastCollisionSoundAtSeconds = nowSeconds;
    playPlanetCollisionSound(runtimeScene);
  }

  function applyLevelElevenTriexoArenaBoundary(runtimeScene, system, triexo) {
    if (system.hexSides?.length) {
      let collided = false;
      for (let pass = 0; pass < 2; pass++) {
        for (const side of system.hexSides) {
          const allowedDistance = Math.max(1, side.apothem - triexo.radius);
          const offsetX = triexo.x - system.centerX;
          const offsetY = triexo.y - system.centerY;
          const outwardDistance = offsetX * side.normalX + offsetY * side.normalY;
          if (outwardDistance <= allowedDistance) continue;
          const penetration = outwardDistance - allowedDistance;
          triexo.x -= side.normalX * penetration;
          triexo.y -= side.normalY * penetration;
          const outwardVelocity =
            triexo.velocityX * side.normalX + triexo.velocityY * side.normalY;
          if (outwardVelocity > 0) {
            const tangentX = triexo.velocityX - side.normalX * outwardVelocity;
            const tangentY = triexo.velocityY - side.normalY * outwardVelocity;
            const reboundSpeed = Math.max(
              LEVEL_ELEVEN_TRIEXO_MIN_FLING_SPEED,
              outwardVelocity * LEVEL_ELEVEN_TRIEXO_RESTITUTION
            );
            triexo.velocityX = tangentX - side.normalX * reboundSpeed;
            triexo.velocityY = tangentY - side.normalY * reboundSpeed;
            triexo.angularVelocity *= -0.8;
          }
          collided = true;
        }
      }
      if (collided) {
        capLevelElevenTriexoSpeed(triexo);
        playLevelElevenTriexoCollisionSound(runtimeScene, triexo);
      }
      return collided;
    }
    const maximumDistance = Math.max(
      1,
      system.triexoArenaRadius - triexo.radius
    );
    let dx = triexo.x - system.centerX;
    let dy = triexo.y - system.centerY;
    let distance = Math.hypot(dx, dy);
    if (distance <= maximumDistance) return false;
    if (distance <= 0.001) {
      dx = 1;
      dy = 0;
      distance = 1;
    }
    const normalX = dx / distance;
    const normalY = dy / distance;
    triexo.x = system.centerX + normalX * maximumDistance;
    triexo.y = system.centerY + normalY * maximumDistance;
    const radialVelocity = triexo.velocityX * normalX + triexo.velocityY * normalY;
    if (radialVelocity > 0) {
      const tangentX = triexo.velocityX - normalX * radialVelocity;
      const tangentY = triexo.velocityY - normalY * radialVelocity;
      const reboundSpeed = Math.max(
        LEVEL_ELEVEN_TRIEXO_MIN_FLING_SPEED,
        radialVelocity * LEVEL_ELEVEN_TRIEXO_RESTITUTION
      );
      triexo.velocityX = tangentX - normalX * reboundSpeed;
      triexo.velocityY = tangentY - normalY * reboundSpeed;
      triexo.angularVelocity *= -0.8;
      capLevelElevenTriexoSpeed(triexo);
      playLevelElevenTriexoCollisionSound(runtimeScene, triexo);
    }
    return true;
  }

  function applyMultiplayerLevelFourVisibleWallCollision(runtimeScene, system, triexo) {
    if (!system?.walls?.length || !triexo) return false;
    const liveWalls = new Set(runtimeScene.getObjects("Walls"));
    let collided = false;
    for (let pass = 0; pass < 2; pass++) {
      for (const wall of system.walls) {
        if (
          !liveWalls.has(wall) ||
          wall.__headSpaceDestructibleDestroyed ||
          wall.getWidth?.() <= 0 ||
          wall.getHeight?.() <= 0
        ) continue;
        const segment = getWallSegmentData(wall);
        const closest = getClosestPointOnSegment(triexo.x, triexo.y, segment);
        if (!segment || !closest) continue;
        let dx = triexo.x - closest.x;
        let dy = triexo.y - closest.y;
        let distance = Math.hypot(dx, dy);
        const contactDistance = triexo.radius + segment.halfThickness;
        if (distance >= contactDistance) continue;
        if (distance <= 0.001) {
          dx = -segment.tangentY;
          dy = segment.tangentX;
          if (triexo.velocityX * dx + triexo.velocityY * dy > 0) {
            dx *= -1;
            dy *= -1;
          }
          distance = 1;
        }
        const normalX = dx / distance;
        const normalY = dy / distance;
        const penetration = contactDistance - distance;
        triexo.x += normalX * (penetration + 0.5);
        triexo.y += normalY * (penetration + 0.5);
        const normalVelocity =
          triexo.velocityX * normalX + triexo.velocityY * normalY;
        if (normalVelocity < 0) {
          const tangentX = triexo.velocityX - normalX * normalVelocity;
          const tangentY = triexo.velocityY - normalY * normalVelocity;
          const reboundSpeed = Math.max(
            LEVEL_ELEVEN_TRIEXO_MIN_FLING_SPEED,
            -normalVelocity * LEVEL_ELEVEN_TRIEXO_RESTITUTION
          );
          triexo.velocityX = tangentX + normalX * reboundSpeed;
          triexo.velocityY = tangentY + normalY * reboundSpeed;
          triexo.angularVelocity *= -0.8;
        }
        collided = true;
      }
    }
    if (collided) {
      capLevelElevenTriexoSpeed(triexo);
      playLevelElevenTriexoCollisionSound(runtimeScene, triexo);
    }
    return collided;
  }

  function applyLevelElevenTriexoCelestialCollisions(runtimeScene, system) {
    const celestialBodies = [
      system.planet,
      ...(system.planets || []),
      ...(system.stations || []),
    ].filter(Boolean);
    for (let triexoIndex = 0; triexoIndex < system.triexos.length; triexoIndex++) {
      const triexo = system.triexos[triexoIndex];
      for (let bodyIndex = 0; bodyIndex < celestialBodies.length; bodyIndex++) {
        const body = celestialBodies[bodyIndex];
        const contactDistance = triexo.radius + body.radius + 4;
        let dx = triexo.x - body.x;
        let dy = triexo.y - body.y;
        let distance = Math.hypot(dx, dy);
        if (distance >= contactDistance) continue;
        if (distance <= 0.001) {
          const fallbackAngle = triexoIndex * 1.73 + bodyIndex * 2.41;
          dx = Math.cos(fallbackAngle);
          dy = Math.sin(fallbackAngle);
          distance = 1;
        }
        const normalX = dx / distance;
        const normalY = dy / distance;
        triexo.x = body.x + normalX * (contactDistance + 2);
        triexo.y = body.y + normalY * (contactDistance + 2);
        const bodyVelocityX = body.velocityX || 0;
        const bodyVelocityY = body.velocityY || 0;
        const relativeX = triexo.velocityX - bodyVelocityX;
        const relativeY = triexo.velocityY - bodyVelocityY;
        const radialVelocity = relativeX * normalX + relativeY * normalY;
        if (radialVelocity >= 0) continue;
        const tangentX = relativeX - normalX * radialVelocity;
        const tangentY = relativeY - normalY * radialVelocity;
        const reboundSpeed = Math.max(
          LEVEL_ELEVEN_TRIEXO_MIN_FLING_SPEED,
          -radialVelocity * LEVEL_ELEVEN_TRIEXO_RESTITUTION
        );
        triexo.velocityX = bodyVelocityX + tangentX + normalX * reboundSpeed;
        triexo.velocityY = bodyVelocityY + tangentY + normalY * reboundSpeed;
        const tangentialImpact = relativeX * normalY - relativeY * normalX;
        triexo.angularVelocity += clamp(tangentialImpact / 260, -1.4, 1.4);
        capLevelElevenTriexoSpeed(triexo);
        playLevelElevenTriexoCollisionSound(runtimeScene, triexo);
      }
    }
  }

  function applyLevelElevenTriexoPairCollisions(runtimeScene, system) {
    for (let aIndex = 0; aIndex < system.triexos.length; aIndex++) {
      const a = system.triexos[aIndex];
      for (let bIndex = aIndex + 1; bIndex < system.triexos.length; bIndex++) {
        const b = system.triexos[bIndex];
        const contactDistance = a.radius + b.radius + 2;
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let distance = Math.hypot(dx, dy);
        if (distance >= contactDistance) continue;
        if (distance <= 0.001) {
          const fallbackAngle = aIndex * 1.37 + bIndex * 2.03;
          dx = Math.cos(fallbackAngle);
          dy = Math.sin(fallbackAngle);
          distance = 1;
        }
        const normalX = dx / distance;
        const normalY = dy / distance;
        const overlap = contactDistance - distance + 1;
        a.x += normalX * overlap * 0.5;
        a.y += normalY * overlap * 0.5;
        b.x -= normalX * overlap * 0.5;
        b.y -= normalY * overlap * 0.5;
        const relativeRadial =
          (a.velocityX - b.velocityX) * normalX +
          (a.velocityY - b.velocityY) * normalY;
        if (relativeRadial >= 0) continue;
        const impulse = (-(1 + LEVEL_ELEVEN_TRIEXO_RESTITUTION) * relativeRadial) / 2;
        a.velocityX += normalX * impulse;
        a.velocityY += normalY * impulse;
        b.velocityX -= normalX * impulse;
        b.velocityY -= normalY * impulse;
        a.angularVelocity += clamp(relativeRadial / 360, -0.8, 0.8);
        b.angularVelocity -= clamp(relativeRadial / 360, -0.8, 0.8);
        capLevelElevenTriexoSpeed(a);
        capLevelElevenTriexoSpeed(b);
        playLevelElevenTriexoCollisionSound(runtimeScene, a, b);
      }
    }
  }

  function getLevelElevenTriexoFrameCollision(triexo, pointX, pointY, objectRadius) {
    const frameScale =
      Number.isFinite(triexo?.size) && triexo.size > 0
        ? triexo.size / LEVEL_ELEVEN_TRIEXO_SIZE
        : 1;
    const cosine = Math.cos(triexo.rotation);
    const sine = Math.sin(triexo.rotation);
    const transform = (localX, localY) => ({
      x: triexo.x + localX * cosine - localY * sine,
      y: triexo.y + localX * sine + localY * cosine,
    });
    const top = transform(0, LEVEL_ELEVEN_TRIEXO_FRAME_TOP_Y * frameScale);
    const right = transform(
      LEVEL_ELEVEN_TRIEXO_FRAME_BOTTOM_X * frameScale,
      LEVEL_ELEVEN_TRIEXO_FRAME_BOTTOM_Y * frameScale
    );
    const left = transform(
      -LEVEL_ELEVEN_TRIEXO_FRAME_BOTTOM_X * frameScale,
      LEVEL_ELEVEN_TRIEXO_FRAME_BOTTOM_Y * frameScale
    );
    const segments = [
      { start: top, end: right },
      { start: right, end: left },
      { start: left, end: top },
    ];
    let best = null;
    for (const segment of segments) {
      const segmentX = segment.end.x - segment.start.x;
      const segmentY = segment.end.y - segment.start.y;
      const lengthSq = segmentX * segmentX + segmentY * segmentY;
      const amount =
        lengthSq > 0.001
          ? clamp(
              ((pointX - segment.start.x) * segmentX +
                (pointY - segment.start.y) * segmentY) /
                lengthSq,
              0,
              1
            )
          : 0;
      const closestX = segment.start.x + segmentX * amount;
      const closestY = segment.start.y + segmentY * amount;
      const dx = pointX - closestX;
      const dy = pointY - closestY;
      const distance = Math.hypot(dx, dy);
      if (!best || distance < best.distance) {
        best = { distance, dx, dy, closestX, closestY, segmentX, segmentY };
      }
    }
    const contactDistance =
      Math.max(1, objectRadius) + LEVEL_ELEVEN_TRIEXO_FRAME_HALF_WIDTH * frameScale;
    if (!best || best.distance >= contactDistance) return null;
    let normalX;
    let normalY;
    if (best.distance > 0.001) {
      normalX = best.dx / best.distance;
      normalY = best.dy / best.distance;
    } else {
      const segmentLength = Math.max(0.001, Math.hypot(best.segmentX, best.segmentY));
      normalX = -best.segmentY / segmentLength;
      normalY = best.segmentX / segmentLength;
      if (normalX * (pointX - triexo.x) + normalY * (pointY - triexo.y) < 0) {
        normalX *= -1;
        normalY *= -1;
      }
    }
    return {
      normalX,
      normalY,
      penetration: contactDistance - best.distance,
      closestX: best.closestX,
      closestY: best.closestY,
    };
  }

  function applyLevelElevenTriexoActorCollisions(runtimeScene, system) {
    const actorGroups = [
      { name: "Player", objects: runtimeScene.getObjects("Player") },
      { name: "EmittedMaterial", objects: runtimeScene.getObjects("EmittedMaterial") },
      { name: "Enemy", objects: runtimeScene.getObjects("Enemy") },
      { name: "SmartEnemy", objects: runtimeScene.getObjects("SmartEnemy") },
    ];
    for (const group of actorGroups) {
      for (let actorIndex = 0; actorIndex < group.objects.length; actorIndex++) {
        const actor = group.objects[actorIndex];
        if (!actor?.hasBehavior?.("Physics2") || actor.getWidth() <= 0) continue;
        const physics = actor.getBehavior("Physics2");
        const actorRadius =
          getApproxObjectRadius(actor, 8) *
          (group.name === "Player"
            ? system.visibleWallBoundaryOnly
              ? MULTIPLAYER_LEVEL_FOUR_PLAYER_COLLISION_SCALE
              : LEVEL_ELEVEN_PLAYER_COLLISION_RADIUS_SCALE
            : 1);
        for (let triexoIndex = 0; triexoIndex < system.triexos.length; triexoIndex++) {
          const triexo = system.triexos[triexoIndex];
          const collision = getLevelElevenTriexoFrameCollision(
            triexo,
            actor.getCenterXInScene(),
            actor.getCenterYInScene(),
            actorRadius
          );
          if (!collision) continue;
          const { normalX, normalY } = collision;
          moveObjectToCenter(
            actor,
            actor.getCenterXInScene() + normalX * (collision.penetration + (group.name === "Player" ? 0.5 : 2)),
            actor.getCenterYInScene() + normalY * (collision.penetration + (group.name === "Player" ? 0.5 : 2))
          );
          const actorVelocity = getObjectVelocity(actor);
          const relativeX = actorVelocity.x - triexo.velocityX;
          const relativeY = actorVelocity.y - triexo.velocityY;
          const radialVelocity = relativeX * normalX + relativeY * normalY;
          if (radialVelocity >= 0) continue;
          const tangentX = relativeX - normalX * radialVelocity;
          const tangentY = relativeY - normalY * radialVelocity;
          const actorReboundSpeed = Math.max(72, -radialVelocity * LEVEL_ELEVEN_TRIEXO_RESTITUTION);
          if (physics.setLinearVelocityX) {
            physics.setLinearVelocityX(triexo.velocityX + tangentX + normalX * actorReboundSpeed);
          }
          if (physics.setLinearVelocityY) {
            physics.setLinearVelocityY(triexo.velocityY + tangentY + normalY * actorReboundSpeed);
          }
          const flingSpeed = clamp(
            -radialVelocity * 0.62 + actorVelocity.speed * 0.18,
            LEVEL_ELEVEN_TRIEXO_MIN_FLING_SPEED,
            LEVEL_ELEVEN_TRIEXO_MAX_FLING_SPEED
          );
          triexo.velocityX -= normalX * flingSpeed;
          triexo.velocityY -= normalY * flingSpeed;
          const tangentialImpact = relativeX * normalY - relativeY * normalX;
          triexo.angularVelocity += clamp(tangentialImpact / 240, -1.6, 1.6);
          capLevelElevenTriexoSpeed(triexo);
          playLevelElevenTriexoCollisionSound(runtimeScene, triexo);
          if (group.name === "Player") capPhysicsSpeed(physics, PLAYER_INTENDED_MAX_SPEED);
          if (group.name === "SmartEnemy") {
            const bossElapsedSeconds = getElapsedSecondsForState(sceneState.get(runtimeScene));
            actor.__headSpaceStationOrbKnockbackUntilSeconds =
              bossElapsedSeconds + LEVEL_ELEVEN_TRIEXO_BOSS_KNOCKBACK_SECONDS;
            actor.__headSpaceStationOrbImpactVelocityX =
              physics.getLinearVelocityX ? physics.getLinearVelocityX() : 0;
            actor.__headSpaceStationOrbImpactVelocityY =
              physics.getLinearVelocityY ? physics.getLinearVelocityY() : 0;
            setBossNativeMovementEnabled(actor, false);
          }
        }
      }
    }
  }

  function updateLevelElevenTriexos(runtimeScene, system, deltaSeconds) {
    if (!system.triexos?.length) return;
    if (deltaSeconds > 0) {
      const linearDamping = Math.exp(-LEVEL_ELEVEN_TRIEXO_LINEAR_DAMPING * deltaSeconds);
      const angularDamping = Math.exp(-LEVEL_ELEVEN_TRIEXO_ANGULAR_DAMPING * deltaSeconds);
      for (const triexo of system.triexos) {
        triexo.x += triexo.velocityX * deltaSeconds;
        triexo.y += triexo.velocityY * deltaSeconds;
        triexo.rotation += triexo.angularVelocity * deltaSeconds;
        triexo.velocityX *= linearDamping;
        triexo.velocityY *= linearDamping;
        triexo.angularVelocity *= angularDamping;
        if (system.visibleWallBoundaryOnly) {
          applyMultiplayerLevelFourVisibleWallCollision(runtimeScene, system, triexo);
        } else {
          applyLevelElevenTriexoArenaBoundary(runtimeScene, system, triexo);
        }
      }
      applyLevelElevenTriexoCelestialCollisions(runtimeScene, system);
      applyLevelElevenTriexoPairCollisions(runtimeScene, system);
      applyLevelElevenTriexoActorCollisions(runtimeScene, system);
      for (const triexo of system.triexos) {
        if (system.visibleWallBoundaryOnly) {
          applyMultiplayerLevelFourVisibleWallCollision(runtimeScene, system, triexo);
        } else {
          applyLevelElevenTriexoArenaBoundary(runtimeScene, system, triexo);
        }
      }
    }
    syncLevelElevenTriexoVisuals(system);
  }

  function applyLevelElevenBodyCollisions(runtimeScene, system) {
    if (
      getSceneBoolean(runtimeScene, "Paused") ||
      getSceneBoolean(runtimeScene, "LevelWon") ||
      getSceneBoolean(runtimeScene, "LevelLost")
    ) return;
    const bodies = [system.planet, ...(system.planets || []), ...system.stations].filter(Boolean);
    const actors = ["Player", "Enemy", "SmartEnemy", "EmittedMaterial", "Asteroid"].flatMap(
      (name) => runtimeScene.getObjects(name)
    );
    for (let actorIndex = 0; actorIndex < actors.length; actorIndex++) {
      const actor = actors[actorIndex];
      if (!actor || actor.getWidth() <= 0) continue;
      const isPlayer = actor.getName?.() === "Player";
      const actorRadius =
        getApproxObjectRadius(actor, 8) *
        (isPlayer
          ? system.visibleWallBoundaryOnly
            ? MULTIPLAYER_LEVEL_FOUR_PLAYER_COLLISION_SCALE
            : LEVEL_ELEVEN_PLAYER_COLLISION_RADIUS_SCALE
          : 1);
      for (let bodyIndex = 0; bodyIndex < bodies.length; bodyIndex++) {
        const body = bodies[bodyIndex];
        const contactDistance = actorRadius + body.radius + (isPlayer ? 0 : 5);
        let dx = actor.getCenterXInScene() - body.x;
        let dy = actor.getCenterYInScene() - body.y;
        let distance = Math.hypot(dx, dy);
        if (distance >= contactDistance) continue;
        if (distance <= 0.001) {
          const fallbackAngle = actorIndex * 0.91 + bodyIndex * 2.17;
          dx = Math.cos(fallbackAngle);
          dy = Math.sin(fallbackAngle);
          distance = 1;
        }
        const normalX = dx / distance;
        const normalY = dy / distance;
        moveObjectToCenter(
          actor,
          body.x + normalX * (contactDistance + (isPlayer ? 0.5 : 2)),
          body.y + normalY * (contactDistance + (isPlayer ? 0.5 : 2))
        );
        if (!actor.hasBehavior?.("Physics2")) continue;
        const physics = actor.getBehavior("Physics2");
        const physicsBody = physics.getBody?.();
        if (physicsBody && physics.b2Vec2 && physics._sharedData) {
          const worldInvScale = physics._sharedData.worldInvScale;
          physicsBody.SetTransform(
            physics.b2Vec2(
              actor.getCenterXInScene() * worldInvScale,
              actor.getCenterYInScene() * worldInvScale
            ),
            physicsBody.GetAngle()
          );
          physicsBody.SetAwake(true);
        }
        const velocity = getObjectVelocity(actor);
        const relativeX = velocity.x - body.velocityX;
        const relativeY = velocity.y - body.velocityY;
        const radialVelocity = relativeX * normalX + relativeY * normalY;
        const tangentX = relativeX - normalX * radialVelocity;
        const tangentY = relativeY - normalY * radialVelocity;
        const outwardSpeed = clamp(
          radialVelocity < 0 ? -radialVelocity * 0.72 : Math.max(42, radialVelocity),
          42,
          280
        );
        if (physics.setLinearVelocityX) {
          physics.setLinearVelocityX(body.velocityX + tangentX + normalX * outwardSpeed);
        }
        if (physics.setLinearVelocityY) {
          physics.setLinearVelocityY(body.velocityY + tangentY + normalY * outwardSpeed);
        }
      }
    }
  }

  function updateLevelElevenPortalTeleport(runtimeScene, system, deltaSeconds) {
    if (system.blackHoles.length < 2) return;
    const frameId = runtimeScene.getGame?.().getFrameId?.();
    if (Number.isFinite(frameId) && system.__headSpacePortalFrameId === frameId) return;
    if (Number.isFinite(frameId)) system.__headSpacePortalFrameId = frameId;
    system.portalCooldownSeconds = Math.max(0, system.portalCooldownSeconds - deltaSeconds);
    if (deltaSeconds <= 0) return;

    const transit = system.transit;
    if (transit) {
      const player = transit.player;
      if (!player || player.getWidth() <= 0) {
        if (player) player.__headSpaceBlackHoleTransit = false;
        system.transit = null;
        return;
      }

      transit.elapsedSeconds += deltaSeconds;
      const physics = player.hasBehavior?.("Physics2") ? player.getBehavior("Physics2") : null;
      if (transit.phase === "intake") {
        const progress = clamp(transit.elapsedSeconds / transit.intakeSeconds, 0, 1);
        const eased = progress * progress * (3 - 2 * progress);
        moveObjectToCenter(
          player,
          transit.startX + (transit.source.x - transit.startX) * eased,
          transit.startY + (transit.source.y - transit.startY) * eased
        );
        if (physics?.setLinearVelocityX) physics.setLinearVelocityX(0);
        if (physics?.setLinearVelocityY) physics.setLinearVelocityY(0);
        if (progress < 1) return;

        const playerRadius = getApproxObjectRadius(player, 20);
        const targetTriggerRadius = transit.target.triggerRadius || LEVEL_ELEVEN_PORTAL_TRIGGER_RADIUS;
        const exitDistance = targetTriggerRadius + playerRadius + 42;
        moveObjectToCenter(
          player,
          transit.target.x + transit.directionX * exitDistance,
          transit.target.y + transit.directionY * exitDistance
        );
        if (physics?.setLinearVelocityX) {
          physics.setLinearVelocityX(transit.directionX * LEVEL_NINE_BLACK_HOLE_LAUNCH_SPEED);
        }
        if (physics?.setLinearVelocityY) {
          physics.setLinearVelocityY(transit.directionY * LEVEL_NINE_BLACK_HOLE_LAUNCH_SPEED);
        }
        transit.phase = "exit";
        transit.elapsedSeconds = 0;
        return;
      }

      if (transit.elapsedSeconds >= transit.exitSeconds) {
        player.__headSpaceBlackHoleTransit = false;
        system.transit = null;
        system.portalCooldownSeconds = LEVEL_NINE_BLACK_HOLE_COOLDOWN_SECONDS;
      }
      return;
    }

    if (system.portalCooldownSeconds > 0) return;
    const player = runtimeScene.getObjects("Player")[0] || null;
    if (!player || player.getWidth() <= 0) return;
    const playerRadius = getApproxObjectRadius(player, 20);
    system.__headSpacePortalDebug = {
      deltaSeconds,
      cooldown: system.portalCooldownSeconds,
      playerX: player.getCenterXInScene(),
      playerY: player.getCenterYInScene(),
      playerRadius,
      distances: system.blackHoles.map((blackHole) => Math.hypot(
        player.getCenterXInScene() - blackHole.x,
        player.getCenterYInScene() - blackHole.y
      )),
    };
    for (let i = 0; i < system.blackHoles.length; i++) {
      const source = system.blackHoles[i];
      const sourceTriggerRadius = source.triggerRadius || LEVEL_ELEVEN_PORTAL_TRIGGER_RADIUS;
      if (
        Math.hypot(
          player.getCenterXInScene() - source.x,
          player.getCenterYInScene() - source.y
        ) > sourceTriggerRadius + playerRadius
      ) continue;
      const target = system.blackHoles[i === 0 ? 1 : 0];
      let exitDirection = getNormalizedVector(system.centerX - target.x, system.centerY - target.y);
      if (exitDirection.magnitude <= 0.001) exitDirection = { x: 0, y: i === 0 ? -1 : 1 };
      player.__headSpaceBlackHoleTransit = true;
      system.transit = {
        player,
        source,
        target,
        phase: "intake",
        elapsedSeconds: 0,
        intakeSeconds: LEVEL_NINE_BLACK_HOLE_INTAKE_SECONDS,
        exitSeconds: LEVEL_NINE_BLACK_HOLE_EXIT_SECONDS,
        startX: player.getCenterXInScene(),
        startY: player.getCenterYInScene(),
        directionX: exitDirection.x,
        directionY: exitDirection.y,
      };
      break;
    }
  }

  function launchLevelElevenStationProjectile(runtimeScene, system, station) {
    const players = runtimeScene
      .getObjects("Player")
      .filter((player) => player && player.getWidth?.() > 0 && player.getHeight?.() > 0);
    const target = station.targetNearestPlayer && players.length
      ? players.reduce((nearest, player) =>
          Math.hypot(player.getCenterXInScene() - station.x, player.getCenterYInScene() - station.y) <
          Math.hypot(nearest.getCenterXInScene() - station.x, nearest.getCenterYInScene() - station.y)
            ? player
            : nearest
        )
      : players[0] || runtimeScene.getObjects("SmartEnemy")[0] || null;
    if (!target || !system?.layerRenderer) return null;
    const targetVelocity = getObjectVelocity(target);
    let direction = getNormalizedVector(
      target.getCenterXInScene() + targetVelocity.x * 0.24 - station.x,
      target.getCenterYInScene() + targetVelocity.y * 0.24 - station.y
    );
    if (direction.magnitude <= 0.001) direction = getNormalizedVector(station.x - system.centerX, station.y - system.centerY);
    const graphic = createLevelEightStationProjectileGraphic();
    if (!graphic) return null;
    const launchOffset = (station.size || LEVEL_ELEVEN_STATION_SIZE) * 0.56;
    const projectile = {
      graphic,
      baseRadius: LEVEL_EIGHT_STATION_PROJECTILE_RADIUS,
      radius: LEVEL_EIGHT_STATION_PROJECTILE_RADIUS,
      x: station.x + direction.x * launchOffset,
      y: station.y + direction.y * launchOffset,
      velocityX: direction.x * LEVEL_ELEVEN_STATION_PROJECTILE_SPEED,
      velocityY: direction.y * LEVEL_ELEVEN_STATION_PROJECTILE_SPEED,
      ageSeconds: 0,
      shotIndex: system.shotIndex++,
      targetId: target.getUniqueId?.() ?? null,
      sourceKey: station.key,
    };
    graphic.position.set(projectile.x, projectile.y);
    graphic.rotation = Math.atan2(projectile.velocityY, projectile.velocityX);
    system.layerRenderer.addRendererObject(graphic, 2.35);
    system.projectiles.push(projectile);
    // Runtime telemetry for declarative station validation. This records the
    // real launch decision even when an orb hits a nearby object during the
    // same physics frame and is removed before a visual probe can inspect it.
    system.lastStationShot = {
      sourceKey: station.key,
      targetId: projectile.targetId,
      velocityX: projectile.velocityX,
      velocityY: projectile.velocityY,
      firedAtSeconds: system.elapsedSeconds,
    };
    return projectile;
  }

  function bounceLevelElevenProjectileOffTriexos(runtimeScene, system, projectile) {
    for (let index = 0; index < system.triexos.length; index++) {
      const triexo = system.triexos[index];
      const collision = getLevelElevenTriexoFrameCollision(
        triexo,
        projectile.x,
        projectile.y,
        projectile.radius
      );
      if (!collision) continue;
      const { normalX, normalY } = collision;
      projectile.x += normalX * (collision.penetration + 2);
      projectile.y += normalY * (collision.penetration + 2);
      const relativeX = projectile.velocityX - triexo.velocityX;
      const relativeY = projectile.velocityY - triexo.velocityY;
      const radialVelocity = relativeX * normalX + relativeY * normalY;
      if (radialVelocity >= 0) return true;
      const tangentX = relativeX - normalX * radialVelocity;
      const tangentY = relativeY - normalY * radialVelocity;
      const projectileReboundSpeed = Math.max(
        90,
        -radialVelocity * LEVEL_ELEVEN_TRIEXO_RESTITUTION
      );
      projectile.velocityX = triexo.velocityX + tangentX + normalX * projectileReboundSpeed;
      projectile.velocityY = triexo.velocityY + tangentY + normalY * projectileReboundSpeed;
      const flingSpeed = clamp(
        -radialVelocity * 0.54,
        LEVEL_ELEVEN_TRIEXO_MIN_FLING_SPEED,
        LEVEL_ELEVEN_TRIEXO_MAX_FLING_SPEED
      );
      triexo.velocityX -= normalX * flingSpeed;
      triexo.velocityY -= normalY * flingSpeed;
      const tangentialImpact = relativeX * normalY - relativeY * normalX;
      triexo.angularVelocity += clamp(tangentialImpact / 220, -1.8, 1.8);
      capLevelElevenTriexoSpeed(triexo);
      playLevelElevenTriexoCollisionSound(runtimeScene, triexo);
      return true;
    }
    return false;
  }

  function bounceLevelElevenProjectileOffPlanet(system, projectile) {
    const planets = [system.planet, ...(system.planets || [])].filter(Boolean);
    for (const planet of planets) {
      let dx = projectile.x - planet.x;
      let dy = projectile.y - planet.y;
      let distance = Math.hypot(dx, dy);
      const contactDistance = planet.radius + projectile.radius;
      if (distance >= contactDistance) continue;
      if (distance <= 0.001) {
        const fallback = getNormalizedVector(-projectile.velocityX, -projectile.velocityY);
        dx = fallback.magnitude > 0.001 ? fallback.x : 1;
        dy = fallback.magnitude > 0.001 ? fallback.y : 0;
        distance = 1;
      }
      const normalX = dx / distance;
      const normalY = dy / distance;
      projectile.x = planet.x + normalX * (contactDistance + 2);
      projectile.y = planet.y + normalY * (contactDistance + 2);
      const normalVelocity = projectile.velocityX * normalX + projectile.velocityY * normalY;
      if (normalVelocity < 0) {
        projectile.velocityX -= normalVelocity * 1.72 * normalX;
        projectile.velocityY -= normalVelocity * 1.72 * normalY;
      }
      return true;
    }
    return false;
  }

  function applyLevelElevenProjectileImpact(actor, projectile) {
    if (!actor?.hasBehavior?.("Physics2")) return;
    const physics = actor.getBehavior("Physics2");
    const velocity = getObjectVelocity(actor);
    const direction = getNormalizedVector(projectile.velocityX, projectile.velocityY);
    const impactSpeed = 245;
    if (physics.setLinearVelocityX) physics.setLinearVelocityX(velocity.x + direction.x * impactSpeed);
    if (physics.setLinearVelocityY) physics.setLinearVelocityY(velocity.y + direction.y * impactSpeed);
  }

  function updateLevelElevenStationProjectiles(runtimeScene, system, deltaSeconds) {
    if (deltaSeconds <= 0) return;
    for (const station of system.stations) {
      if (system.elapsedSeconds >= station.nextShotAt) {
        launchLevelElevenStationProjectile(runtimeScene, system, station);
        station.nextShotAt += station.fireIntervalSeconds || system.stationFireIntervalSeconds;
      }
    }
    const actors = ["Player", "Enemy", "SmartEnemy"].flatMap((name) => runtimeScene.getObjects(name));
    for (let i = system.projectiles.length - 1; i >= 0; i--) {
      const projectile = system.projectiles[i];
      projectile.ageSeconds += deltaSeconds;
      projectile.x += projectile.velocityX * deltaSeconds;
      projectile.y += projectile.velocityY * deltaSeconds;
      bounceLevelElevenProjectileOffTriexos(runtimeScene, system, projectile);
      bounceLevelElevenProjectileOffPlanet(system, projectile);
      bounceLevelEightStationProjectileOffSurfaces(runtimeScene, projectile);
      projectile.graphic.position.set(projectile.x, projectile.y);
      projectile.graphic.rotation = Math.atan2(projectile.velocityY, projectile.velocityX);
      updateLevelEightStationProjectileVisual(projectile);
      let hitActor = null;
      for (const actor of actors) {
        if (!actor || actor.getWidth() <= 0) continue;
        if (
          Math.hypot(actor.getCenterXInScene() - projectile.x, actor.getCenterYInScene() - projectile.y) <=
          getApproxObjectRadius(actor, 8) + projectile.radius
        ) {
          hitActor = actor;
          break;
        }
      }
      if (hitActor) {
        applyLevelElevenProjectileImpact(hitActor, projectile);
        removeLevelEightStationProjectile(runtimeScene, system, projectile);
        continue;
      }
      if (projectile.ageSeconds >= LEVEL_ELEVEN_STATION_PROJECTILE_LIFETIME_SECONDS) {
        removeLevelEightStationProjectile(runtimeScene, system, projectile);
      }
    }
  }

  function updateLevelElevenCelestialSystem(runtimeScene) {
    if (!usesLevelElevenConfiguration(getCurrentLevel(runtimeScene))) {
      clearLevelElevenCelestialSystem(runtimeScene);
      return;
    }
    const system = ensureLevelElevenCelestialSystem(runtimeScene);
    if (!system) return;
    restoreLevelNinePortalVisuals(system);
    ensureLevelElevenExtraEnemies(runtimeScene, system);
    maintainLevelElevenArena(system);
    retireLevelElevenAuthoredPlanets(runtimeScene);
    const paused = getSceneBoolean(runtimeScene, "Paused");
    const finished = getSceneBoolean(runtimeScene, "LevelWon") || getSceneBoolean(runtimeScene, "LevelLost");
    const rawDeltaSeconds = runtimeScene.getElapsedTime() / 1000;
    const deltaSeconds =
      !paused && !finished && Number.isFinite(rawDeltaSeconds) ? clamp(rawDeltaSeconds, 0, 0.05) : 0;
    system.elapsedSeconds += deltaSeconds;
    updateLevelElevenVisuals(system);
    updateLevelElevenTriexos(runtimeScene, system, deltaSeconds);
    updateLevelTwelveCosmicAlienSystem(runtimeScene, system, deltaSeconds);
    updateLevelElevenPortalTeleport(runtimeScene, system, deltaSeconds);
    updateLevelElevenStationProjectiles(runtimeScene, system, deltaSeconds);
    applyLevelElevenBodyCollisions(runtimeScene, system);
  }

  function getLevelSixVerticalStartBounds(runtimeScene, player, boss) {
    const bounds = getBossSpawnBounds(runtimeScene, player || boss);
    const planet = getLevelSixPrimaryPlanet(runtimeScene, true);
    const fallbackCenter = getWallsShapeCenter(runtimeScene) || {
      x: (bounds.minX + bounds.maxX) * 0.5,
      y: (bounds.minY + bounds.maxY) * 0.5,
    };
    const planetX = planet ? planet.getCenterXInScene() : fallbackCenter.x;
    const planetY = planet ? planet.getCenterYInScene() : fallbackCenter.y;
    const planetRadius = getLevelSixPlanetCoreRadius(runtimeScene, planet);
    const arenaHeight = Math.max(1, bounds.maxY - bounds.minY);

    return { bounds, planetX, planetY, planetRadius, arenaHeight };
  }

  function ensureLevelSixStartLayout(runtimeScene, level, state) {
    if (level !== 6 || !state || state.levelSixStartLayoutApplied) return;

    const players = runtimeScene.getObjects("Player");
    const bosses = runtimeScene.getObjects("SmartEnemy");
    if (!players.length || !bosses.length) return;

    const player = players[0];
    const boss = bosses[0];
    const { bounds, planetX, planetY, planetRadius, arenaHeight } =
      getLevelSixVerticalStartBounds(runtimeScene, player, boss);
    const playerRadius = getApproxObjectRadius(player, 24);
    const bossRadius = getApproxObjectRadius(boss, 24);
    const sideMargin = Math.max(72, Math.min(150, arenaHeight * 0.08));
    const playerTopMargin = Math.max(98, arenaHeight * 0.12);
    const bossBottomMargin = Math.max(96, arenaHeight * LEVEL_SIX_BOTTOM_START_MARGIN_RATIO);

    const minActorX = bounds.minX + Math.max(playerRadius, bossRadius) + sideMargin;
    const maxActorX = bounds.maxX - Math.max(playerRadius, bossRadius) - sideMargin;
    const sharedX = clampWithinRange(planetX, minActorX, maxActorX);

    const playerSafeY = planetY - planetRadius - playerRadius - LEVEL_SIX_PLAYER_PLANET_GAP;
    const playerY = clampWithinRange(
      Math.min(playerSafeY, bounds.minY + playerTopMargin),
      bounds.minY + playerRadius + 46,
      playerSafeY
    );
    const bossSafeY = planetY + planetRadius + bossRadius + LEVEL_SIX_BOSS_PLANET_GAP;
    const bossY = clampWithinRange(
      Math.max(bossSafeY, bounds.maxY - bossBottomMargin),
      bossSafeY,
      bounds.maxY - bossRadius - 46
    );

    moveObjectToCenter(player, sharedX, playerY);
    moveObjectToCenter(boss, sharedX, bossY);
    clearObjectMotion(player);
    clearObjectMotion(boss);
    state.bossSpawnAdjusted = true;
    state.levelSixStartLayoutApplied = true;
  }

  function getLevelSixEnemySpiralPose(runtimeScene, slotIndex, totalSlots, enemyRadius, elapsedSeconds = 0) {
    const planet = getLevelSixPrimaryPlanet(runtimeScene, false);
    const wallsCenter = getWallsShapeCenter(runtimeScene);
    if (!planet || !wallsCenter) return null;

    const players = runtimeScene.getObjects("Player");
    const referenceObject = players[0] || planet;
    const bounds = getBossSpawnBounds(runtimeScene, referenceObject);
    const planetX = planet.getCenterXInScene();
    const planetY = planet.getCenterYInScene();
    const planetRadius = getLevelSixPlanetCoreRadius(runtimeScene, planet);
    const edgeRadiusLimit = Math.max(
      80,
      Math.min(
        planetX - bounds.minX - enemyRadius - 24,
        bounds.maxX - planetX - enemyRadius - 24,
        planetY - bounds.minY - enemyRadius - 24,
        bounds.maxY - planetY - enemyRadius - 24
      )
    );
    const safeRadius = Math.min(edgeRadiusLimit, planetRadius + enemyRadius + LEVEL_SIX_PLANET_START_CLEARANCE);
    const baseRadius = Math.min(edgeRadiusLimit, safeRadius + Math.max(36, enemyRadius * 0.32));
    const slotCount = Math.max(1, totalSlots);
    const availableSpan = Math.max(0, edgeRadiusLimit - baseRadius);
    const radiusStep = slotCount > 1 ? availableSpan / (slotCount - 1) : 0;
    const radiusProgress = slotCount > 1 ? clamp(slotIndex / (slotCount - 1), 0, 1) : 0.5;
    const waveAmplitude =
      availableSpan > 0 ? Math.min(9, availableSpan * 0.12, Math.max(1.5, radiusStep * 0.7)) : 0;
    const desiredRadius = clamp(
      baseRadius +
        availableSpan * radiusProgress +
        Math.sin(elapsedSeconds * 0.52 + slotIndex * 0.47) * waveAmplitude,
      baseRadius,
      edgeRadiusLimit
    );
    const desiredAngle =
      elapsedSeconds * LEVEL_SIX_ENEMY_SPIRAL_ANGULAR_SPEED +
      slotIndex * LEVEL_SIX_ENEMY_SPIRAL_SLOT_ANGLE;

    return {
      planetX,
      planetY,
      planetRadius,
      safeRadius,
      desiredRadius,
      desiredAngle,
      targetX: planetX + Math.cos(desiredAngle) * desiredRadius,
      targetY: planetY + Math.sin(desiredAngle) * desiredRadius,
      targetOrbitSpeed: clamp(desiredRadius * LEVEL_SIX_ENEMY_SPIRAL_ANGULAR_SPEED, 84, 188),
    };
  }

  function layoutLevelSixEnemiesIntoSpiral(runtimeScene) {
    if (!runtimeScene || getCurrentLevel(runtimeScene) !== 6) return;

    const enemies = runtimeScene
      .getObjects("Enemy")
      .filter((enemy) => Math.max(enemy.getWidth ? enemy.getWidth() : 0, enemy.getHeight ? enemy.getHeight() : 0) > 0);
    if (!enemies.length) return;

    enemies.sort((a, b) => {
      const aId = typeof a.getUniqueId === "function" ? a.getUniqueId() : 0;
      const bId = typeof b.getUniqueId === "function" ? b.getUniqueId() : 0;
      return aId - bId;
    });

    const elapsedSeconds = performance.now() / 1000;
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const enemyRadius = getApproxObjectRadius(enemy, 12);
      const pose = getLevelSixEnemySpiralPose(runtimeScene, i, enemies.length, enemyRadius, elapsedSeconds);
      if (!pose) continue;

      moveObjectToCenter(enemy, pose.targetX, pose.targetY);
      if (enemy.hasBehavior && enemy.hasBehavior("Physics2")) {
        const physics = enemy.getBehavior("Physics2");
        if (physics.setLinearVelocityX) physics.setLinearVelocityX(-Math.sin(pose.desiredAngle) * pose.targetOrbitSpeed);
        if (physics.setLinearVelocityY) physics.setLinearVelocityY(Math.cos(pose.desiredAngle) * pose.targetOrbitSpeed);
      }
    }
  }

  function ensureLevelSixExtraEnemies(runtimeScene, level, state) {
    if (level !== 6) return;

    const players = runtimeScene.getObjects("Player");
    if (!players.length) return;

    if (!state?.levelSixExtraEnemiesAdded) {
      const existingEnemies = runtimeScene.getObjects("Enemy");
      const enemiesToAdd = Math.max(0, LEVEL_SIX_TARGET_ENEMY_COUNT - existingEnemies.length);
      const player = players[0];
      const playerWidth = Math.max(1, player.getWidth());
      const layer = typeof player.getLayer === "function" ? player.getLayer() : "";

      for (let i = 0; i < enemiesToAdd; i++) {
        const enemy = createSceneObject(runtimeScene, "Enemy", layer);
        if (!enemy) continue;

        const sizeRatio = LEVEL_SIX_EXTRA_ENEMY_SIZE_RATIOS[i % LEVEL_SIX_EXTRA_ENEMY_SIZE_RATIOS.length];
        const targetSize = clamp(playerWidth * sizeRatio, 34, Math.max(42, playerWidth * 1.34));
        setObjectSizeAndShape(enemy, targetSize);

        if (typeof enemy.setZOrder === "function" && typeof player.getZOrder === "function") {
          enemy.setZOrder(player.getZOrder());
        }

        if (enemy.hasBehavior && enemy.hasBehavior("Physics2")) {
          const physics = enemy.getBehavior("Physics2");
          if (physics.setLinearVelocityX) physics.setLinearVelocityX(0);
          if (physics.setLinearVelocityY) physics.setLinearVelocityY(0);
        }

        createImageCompanionForHost(runtimeScene, enemy, "Enemy", "EnemyImage");
      }

      state.levelSixExtraEnemiesAdded = true;
    }

    const spiralEnemies = runtimeScene
      .getObjects("Enemy")
      .filter((enemy) => Math.max(enemy.getWidth ? enemy.getWidth() : 0, enemy.getHeight ? enemy.getHeight() : 0) > 0);
    spiralEnemies.sort((a, b) => {
      const aId = typeof a.getUniqueId === "function" ? a.getUniqueId() : 0;
      const bId = typeof b.getUniqueId === "function" ? b.getUniqueId() : 0;
      return aId - bId;
    });

    const player = players[0];
    const playerWidth = Math.max(1, player.getWidth());
    if (!state?.levelSixEnemySpiralSeeded) {
      for (let i = 0; i < spiralEnemies.length; i++) {
        const enemy = spiralEnemies[i];
        const sizeRatio = LEVEL_SIX_EXTRA_ENEMY_SIZE_RATIOS[i % LEVEL_SIX_EXTRA_ENEMY_SIZE_RATIOS.length];
        const targetSize = clamp(playerWidth * sizeRatio, 36, Math.max(44, playerWidth * 1.34));
        setObjectSizeAndShape(enemy, targetSize);
        if (typeof enemy.setZOrder === "function" && typeof player.getZOrder === "function") {
          enemy.setZOrder(player.getZOrder());
        }
      }

      layoutLevelSixEnemiesIntoSpiral(runtimeScene);
      state.levelSixEnemySpiralSeeded = true;
    }
  }

  function chooseLevelFiveBossStartCenter(runtimeScene, player, boss) {
    const playerCenterX = player.getCenterXInScene();
    const playerCenterY = player.getCenterYInScene();
    const playerRadius = Math.max(player.getWidth(), player.getHeight()) * 0.5;
    const bossRadius = Math.max(boss.getWidth(), boss.getHeight()) * 0.5;
    const bounds = getBossSpawnBounds(runtimeScene, player);
    const minX = bounds.minX + bossRadius + BOSS_START_BOUNDARY_PADDING;
    const maxX = bounds.maxX - bossRadius - BOSS_START_BOUNDARY_PADDING;
    const minY = bounds.minY + bossRadius + BOSS_START_BOUNDARY_PADDING;
    const maxY = bounds.maxY - bossRadius - BOSS_START_BOUNDARY_PADDING;
    const desiredDistance = Math.max(300, playerRadius + bossRadius + 56, player.getWidth() * 1.3);
    const minSafeDistance = playerRadius + bossRadius + 28;
    const candidates = [
      { x: playerCenterX, y: playerCenterY - desiredDistance },
      { x: playerCenterX + desiredDistance * 0.82, y: playerCenterY - desiredDistance * 0.28 },
      { x: playerCenterX - desiredDistance * 0.82, y: playerCenterY - desiredDistance * 0.28 },
      { x: playerCenterX + desiredDistance, y: playerCenterY },
      { x: playerCenterX - desiredDistance, y: playerCenterY },
      { x: playerCenterX, y: playerCenterY + desiredDistance * 0.65 },
    ];

    let best = null;
    let bestScore = -Infinity;
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      const clampedX = clamp(candidate.x, minX, maxX);
      const clampedY = clamp(candidate.y, minY, maxY);
      const distance = Math.hypot(clampedX - playerCenterX, clampedY - playerCenterY);
      if (distance < minSafeDistance) continue;

      const score =
        distance -
        Math.abs(distance - desiredDistance) * 0.35 -
        Math.abs(clampedX - candidate.x) * 0.3 -
        Math.abs(clampedY - candidate.y) * 0.3;

      if (score > bestScore) {
        bestScore = score;
        best = { x: clampedX, y: clampedY };
      }
    }

    if (best) return best;

    return {
      x: clamp(playerCenterX, minX, maxX),
      y: clamp(playerCenterY - desiredDistance, minY, maxY),
    };
  }

  function chooseLevelSixBossStartCenter(runtimeScene, player, boss) {
    const bossRadius = Math.max(boss.getWidth(), boss.getHeight()) * 0.5;
    const { bounds, planetX, planetY, planetRadius, arenaHeight } =
      getLevelSixVerticalStartBounds(runtimeScene, player, boss);
    const minX = bounds.minX + bossRadius + Math.max(72, arenaHeight * 0.08);
    const maxX = bounds.maxX - bossRadius - Math.max(72, arenaHeight * 0.08);
    const bossSafeY = planetY + planetRadius + bossRadius + LEVEL_SIX_BOSS_PLANET_GAP;
    const bossBottomY = bounds.maxY - Math.max(96, arenaHeight * LEVEL_SIX_BOTTOM_START_MARGIN_RATIO);
    return {
      x: clampWithinRange(planetX, minX, maxX),
      y: clampWithinRange(Math.max(bossSafeY, bossBottomY), bossSafeY, bounds.maxY - bossRadius - 46),
    };
  }

  function chooseLevelFourBossStartCenter(runtimeScene, player, boss, minDistance) {
    const playerCenterX = player.getCenterXInScene();
    const playerCenterY = player.getCenterYInScene();
    const bossRadius = Math.max(boss.getWidth(), boss.getHeight()) * 0.5;
    const bounds = getBossSpawnBounds(runtimeScene, player);
    const minX = bounds.minX + bossRadius + BOSS_START_BOUNDARY_PADDING;
    const maxX = bounds.maxX - bossRadius - BOSS_START_BOUNDARY_PADDING;
    const minY = bounds.minY + bossRadius + BOSS_START_BOUNDARY_PADDING;
    const maxY = bounds.maxY - bossRadius - BOSS_START_BOUNDARY_PADDING;
    const arenaHeight = Math.max(1, maxY - minY);
    const desiredDistance = Math.max(320, minDistance, player.getWidth() * 1.45);
    const minSafeDistance = Math.max(BOSS_MIN_START_DISTANCE, desiredDistance * 0.82);
    const candidates = [
      { x: playerCenterX, y: playerCenterY + desiredDistance },
      { x: playerCenterX - desiredDistance * 0.86, y: playerCenterY + desiredDistance * 0.44 },
      { x: playerCenterX + desiredDistance * 0.86, y: playerCenterY + desiredDistance * 0.44 },
      { x: playerCenterX - desiredDistance, y: playerCenterY },
      { x: playerCenterX + desiredDistance, y: playerCenterY },
      { x: playerCenterX - desiredDistance * 0.7, y: playerCenterY - desiredDistance * 0.48 },
      { x: playerCenterX, y: playerCenterY - desiredDistance * 0.66 },
      { x: playerCenterX + desiredDistance * 0.7, y: playerCenterY - desiredDistance * 0.48 },
    ];

    let best = null;
    let bestScore = -Infinity;
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      const clampedX = clamp(candidate.x, minX, maxX);
      const clampedY = clamp(candidate.y, minY, maxY);
      const distance = Math.hypot(clampedX - playerCenterX, clampedY - playerCenterY);
      if (distance < minSafeDistance) continue;

      const baitPenalty = getLevelFourSpawnBaitPenalty(runtimeScene, player, clampedX, clampedY);
      const baitFactors = getLevelFourBaitFactors(runtimeScene, clampedX, clampedY, player);
      if (baitFactors.topRightPocketFactor > 0.16 || baitPenalty >= 170) continue;

      const edgeClearance = Math.min(clampedX - minX, maxX - clampedX, clampedY - minY, maxY - clampedY);
      const verticalBias = clamp((clampedY - playerCenterY) / arenaHeight, -1, 1);
      const score =
        distance -
        Math.abs(distance - desiredDistance) * 0.28 +
        edgeClearance * 0.08 +
        verticalBias * 140 -
        baitFactors.topFactor * 320 -
        baitFactors.rightFactor * 55 -
        baitFactors.topRightPocketFactor * 1000 -
        Math.abs(clampedX - candidate.x) * 0.3 -
        Math.abs(clampedY - candidate.y) * 0.3;

      if (score > bestScore) {
        bestScore = score;
        best = { x: clampedX, y: clampedY };
      }
    }

    if (best) return best;

    return {
      x: clamp(playerCenterX - desiredDistance * 0.9, minX, maxX),
      y: clamp(playerCenterY + desiredDistance * 0.42, minY, maxY),
    };
  }

  function chooseBossSpawnCenter(runtimeScene, player, boss, minDistance, level) {
    if (level === 4) {
      return chooseLevelFourBossStartCenter(runtimeScene, player, boss, minDistance);
    }
    if (level === 5) {
      return chooseLevelFiveBossStartCenter(runtimeScene, player, boss);
    }
    if (level === 6) {
      return chooseLevelSixBossStartCenter(runtimeScene, player, boss);
    }

    const playerCenterX = player.getCenterXInScene();
    const playerCenterY = player.getCenterYInScene();
    const bossCenterX = boss.getCenterXInScene();
    const bossCenterY = boss.getCenterYInScene();
    const bossRadius = Math.max(boss.getWidth(), boss.getHeight()) * 0.5;
    const bounds = getBossSpawnBounds(runtimeScene, player);
    const minX = bounds.minX + bossRadius + BOSS_START_BOUNDARY_PADDING;
    const maxX = bounds.maxX - bossRadius - BOSS_START_BOUNDARY_PADDING;
    const minY = bounds.minY + bossRadius + BOSS_START_BOUNDARY_PADDING;
    const maxY = bounds.maxY - bossRadius - BOSS_START_BOUNDARY_PADDING;

    const directions = [];
    const dx = bossCenterX - playerCenterX;
    const dy = bossCenterY - playerCenterY;
    const baseDistance = Math.hypot(dx, dy);
    if (baseDistance > 0.001) {
      directions.push({ x: dx / baseDistance, y: dy / baseDistance });
    }

    const seedAngle = level * 0.67 + 0.35;
    const extraAngles = [
      seedAngle,
      seedAngle + Math.PI * 0.5,
      seedAngle + Math.PI,
      seedAngle + Math.PI * 1.5,
      Math.PI * 0.25,
      Math.PI * 0.75,
      Math.PI * 1.25,
      Math.PI * 1.75,
      0,
      Math.PI * 0.5,
      Math.PI,
      Math.PI * 1.5,
    ];

    for (let i = 0; i < extraAngles.length; i++) {
      directions.push({
        x: Math.cos(extraAngles[i]),
        y: Math.sin(extraAngles[i]),
      });
    }

    let best = { x: bossCenterX, y: bossCenterY, distance: baseDistance };
    for (let i = 0; i < directions.length; i++) {
      const direction = directions[i];
      const candidateX = clamp(playerCenterX + direction.x * minDistance, minX, maxX);
      const candidateY = clamp(playerCenterY + direction.y * minDistance, minY, maxY);
      const candidateDistance = Math.hypot(candidateX - playerCenterX, candidateY - playerCenterY);
      if (candidateDistance > best.distance) {
        best = { x: candidateX, y: candidateY, distance: candidateDistance };
      }
    }

    return best;
  }

  function ensureBossSpawnDistance(runtimeScene, boss, level, state) {
    if (state?.bossSpawnAdjusted) return;

    const players = runtimeScene.getObjects("Player");
    if (!players.length) return;

    const player = players[0];
    if (level === 6) {
      const spawnCenter = chooseLevelSixBossStartCenter(runtimeScene, player, boss);
      moveObjectToCenter(boss, spawnCenter.x, spawnCenter.y);

      if (boss.hasBehavior && boss.hasBehavior("Physics2")) {
        const physics = boss.getBehavior("Physics2");
        if (physics.setLinearVelocityX) physics.setLinearVelocityX(0);
        if (physics.setLinearVelocityY) physics.setLinearVelocityY(0);
      }

      if (state) state.bossSpawnAdjusted = true;
      return;
    }

    const playerWidth = Math.max(1, player.getWidth());
    const bossWidth = Math.max(1, boss.getWidth());
    const currentDistance = Math.hypot(
      boss.getCenterXInScene() - player.getCenterXInScene(),
      boss.getCenterYInScene() - player.getCenterYInScene()
    );
    const minDistance = Math.max(
      BOSS_MIN_START_DISTANCE,
      playerWidth * BOSS_START_DISTANCE_PLAYER_WEIGHT + bossWidth * BOSS_START_DISTANCE_BOSS_WEIGHT,
      BOSS_MIN_START_DISTANCE + getBossStartDistanceBonus(level, playerWidth, bossWidth)
    );

    if (currentDistance < minDistance) {
      const spawnCenter = chooseBossSpawnCenter(runtimeScene, player, boss, minDistance, level);
      moveObjectToCenter(boss, spawnCenter.x, spawnCenter.y);

      if (boss.hasBehavior && boss.hasBehavior("Physics2")) {
        const physics = boss.getBehavior("Physics2");
        if (physics.setLinearVelocityX) physics.setLinearVelocityX(0);
        if (physics.setLinearVelocityY) physics.setLinearVelocityY(0);
      }
    }

    if (state) state.bossSpawnAdjusted = true;
  }

  function createSceneObject(runtimeScene, objectName, layer) {
    if (gdjs?.evtTools?.object?.createObjectOnScene) {
      const createdObjects = [];
      const hashtableApi = getHashtableApi();
      if (hashtableApi && typeof hashtableApi.newFrom === "function") {
        gdjs.evtTools.object.createObjectOnScene(
          runtimeScene,
          hashtableApi.newFrom({ [objectName]: createdObjects }),
          0,
          0,
          layer || ""
        );
        if (createdObjects.length) return createdObjects[0];
      }
    }

    if (typeof runtimeScene.createObject === "function") {
      return runtimeScene.createObject(objectName);
    }

    return null;
  }

  function isMultiplayerGame(runtimeScene, level = getCurrentLevel(runtimeScene)) {
    try {
      return (
        Number(level) >= PLAYABLE_LEVEL_MIN &&
        Number(level) <= PLAYABLE_LEVEL_MAX &&
        runtimeScene.getGame().getVariables().get("MultiplayerMode").getAsBoolean()
      );
    } catch {
      return false;
    }
  }

  function isSharedDeclarativeMultiplayerLevel(
    runtimeScene,
    level = getCurrentLevel(runtimeScene)
  ) {
    if (!isMultiplayerGame(runtimeScene, level)) return false;
    const manifest = globalThis.headSpaceMultiplayerFramework?.getLevel?.(level);
    return Boolean(
      manifest &&
      manifest.status === "ready" &&
      manifest.implementation === "declarative"
    );
  }

  function getMultiplayerGameMode(runtimeScene) {
    try {
      return runtimeScene
        .getGame()
        .getVariables()
        .get("MultiplayerGameMode")
        .getAsString() === "hunt-the-boss"
        ? "hunt-the-boss"
        : "head-to-head";
    } catch {
      return "head-to-head";
    }
  }

  function enforceMultiplayerParticipantInstanceLimit(runtimeScene, level) {
    if (!isMultiplayerGame(runtimeScene, level)) return;
    let participantLimit = 1;
    try {
      participantLimit = Math.min(
        4,
        Math.max(
          1,
          Math.round(
            runtimeScene
              .getGame()
              .getVariables()
              .get("MultiplayerPlayerCount")
              .getAsNumber()
          )
        )
      );
    } catch {}

    const participants = ensureMultiplayerParticipantOwnership(runtimeScene, level);
    for (let index = participants.length - 1; index >= participantLimit; index--) {
      deleteRuntimeObjectTree(runtimeScene, participants[index].player);
    }
    ensureMultiplayerParticipantOwnership(runtimeScene, level);
  }

  function removeHeadToHeadBossObjects(runtimeScene, level) {
    if (
      !isMultiplayerGame(runtimeScene, level) ||
      getMultiplayerGameMode(runtimeScene) !== "head-to-head"
    ) {
      return false;
    }
    for (const objectName of ["SmartEnemy", "SmartEnemyImage", "SmartEnemyPointer"]) {
      for (const object of runtimeScene.getObjects(objectName).slice()) {
        if (objectName === "SmartEnemy") {
          disableHiddenHostLighting(object);
          object.hide?.(true);
          object.setOpacity?.(0);
          moveObjectToCenter(object, -100000, -100000);
          setObjectSizeAndShape(object, 0);
          if (object.hasBehavior?.("Physics2")) {
            const physics = object.getBehavior("Physics2");
            physics.setShapeScale?.(0.001);
            physics.setLinearVelocityX?.(0);
            physics.setLinearVelocityY?.(0);
          }
        }
        deleteRuntimeObjectTree(runtimeScene, object);
      }
    }
    return true;
  }

  function ensureMultiplayerModeObjective(runtimeScene, level) {
    if (!isMultiplayerGame(runtimeScene, level)) {
      multiplayerModeObjectiveState.delete(runtimeScene);
      return;
    }
    const mode = getMultiplayerGameMode(runtimeScene);
    let objective = multiplayerModeObjectiveState.get(runtimeScene);
    if (!objective || objective.level !== Number(level) || objective.mode !== mode) {
      objective = {
        level: Number(level),
        mode,
        bossSeen: false,
        bossAbsorbed: false,
        bossMissingSinceMs: null,
        maximumLivePlayers: 0,
        multiplePlayersPresentSinceMs: null,
        humanContestStarted: false,
        initialParticipantIds: new Set(),
        absorbedPlayerIds: new Set(),
        lastPlayerAbsorberId: "",
        bossAbsorbedByParticipantId: "",
      };
      multiplayerModeObjectiveState.set(runtimeScene, objective);
    }
    const livePlayers = runtimeScene.getObjects("Player").filter(
      (player) => player && player.getWidth() > 0 && player.getHeight() > 0
    );
    for (let index = 0; index < livePlayers.length; index++) {
      objective.initialParticipantIds.add(getMultiplayerParticipantId(livePlayers[index], index));
    }
    objective.maximumLivePlayers = Math.max(objective.maximumLivePlayers, livePlayers.length);
    if (mode !== "hunt-the-boss") {
      removeHeadToHeadBossObjects(runtimeScene, level);
      return;
    }

    let bosses = runtimeScene.getObjects("SmartEnemy").filter(
      (boss) => boss && boss.getWidth() > 0 && boss.getHeight() > 0
    );
    const visibleBossImages = runtimeScene.getObjects("SmartEnemyImage").filter(
      (image) => image && image.isVisible?.() && image.getWidth() > 0 && image.getHeight() > 0
    );
    if (!bosses.length && objective.bossSeen) return;
    if (!bosses.length && !objective.bossSeen) {
      const player = livePlayers[0] || null;
      const boss = createSceneObject(runtimeScene, "SmartEnemy", player?.getLayer?.() || "");
      if (boss) {
        const bounds = getBossSpawnBounds(runtimeScene, player);
        const playerSize = player
          ? Math.max(72, Math.min(player.getWidth(), player.getHeight()))
          : 150;
        setObjectSizeAndShape(boss, playerSize * 1.35);
        moveObjectToCenter(
          boss,
          bounds.minX + (bounds.maxX - bounds.minX) * 0.72,
          bounds.minY + (bounds.maxY - bounds.minY) * 0.3
        );
        boss.__headSpaceMultiplayerHuntBoss = true;
        createImageCompanionForHost(runtimeScene, boss, "SmartEnemy", "SmartEnemyImage");
        bosses = [boss];
      }
    }
    if (bosses.length) {
      objective.bossSeen = true;
      objective.bossMissingSinceMs = null;
      bosses[0].__headSpaceMultiplayerHuntBoss = true;
    }
  }

  function applyMultiplayerModeWinCondition(runtimeScene, level, state) {
    if (!isMultiplayerGame(runtimeScene, level)) return;
    const objective = multiplayerModeObjectiveState.get(runtimeScene);
    if (!objective) return;
    const livePlayers = runtimeScene.getObjects("Player").filter(
      (player) => player && player.getWidth() > 0 && player.getHeight() > 0
    );
    let objectiveWon = false;
    if (objective.mode === "hunt-the-boss") {
      const liveBosses = runtimeScene.getObjects("SmartEnemy").filter(
        (boss) => boss && boss.getWidth() > 0 && boss.getHeight() > 0
      );
      objectiveWon =
        objective.bossSeen &&
        typeof objective.bossAbsorbedByParticipantId === "string" &&
        objective.bossAbsorbedByParticipantId.length > 0;
      if (objectiveWon) {
        for (const boss of liveBosses) boss.deleteFromScene?.(runtimeScene);
        for (const image of runtimeScene.getObjects("SmartEnemyImage").slice()) {
          image.deleteFromScene?.(runtimeScene);
        }
      }
    } else {
      objective.maximumLivePlayers = Math.max(objective.maximumLivePlayers, livePlayers.length);
      let configuredPlayerCount = 1;
      try {
        configuredPlayerCount = Math.min(
          4,
          Math.max(
            1,
            Math.round(
              runtimeScene
                .getGame()
                .getVariables()
                .get("MultiplayerPlayerCount")
                .getAsNumber()
            )
          )
        );
      } catch {}
      if (
        configuredPlayerCount >= 2 &&
        livePlayers.length >= configuredPlayerCount
      ) {
        if (!Number.isFinite(objective.multiplePlayersPresentSinceMs)) {
          objective.multiplePlayersPresentSinceMs = performance.now();
        } else if (performance.now() - objective.multiplePlayersPresentSinceMs >= 750) {
          objective.humanContestStarted = true;
        }
      } else if (!objective.humanContestStarted) {
        objective.multiplePlayersPresentSinceMs = null;
      }
      objectiveWon =
        configuredPlayerCount >= 2 &&
        objective.humanContestStarted &&
        livePlayers.length === 1 &&
        objective.absorbedPlayerIds.size >= configuredPlayerCount - 1 &&
        objective.lastPlayerAbsorberId === getMultiplayerParticipantId(livePlayers[0]);
    }

    if (!objectiveWon) {
      suppressMultiplayerLevelTwoNativeCompletion(runtimeScene);
      return;
    }
    setSceneBoolean(runtimeScene, "LevelLost", false);
    setSceneBoolean(runtimeScene, "LevelWon", true);
    if (state) {
      state.multiplayerOutcomeAuthorized = true;
      state.winCommitted = true;
    }
  }

  function removeKnightHelmetFromSelection(runtimeScene) {
    const game = runtimeScene?.getGame?.();
    if (!game) return;
    const helmetVariable = game.getVariables().getFromIndex(1);
    let selectedIndex = helmetVariable.getAsNumber();
    const previousIndex = lastAllowedHelmetSelectionByGame.get(game);
    if (selectedIndex === REMOVED_KNIGHT_HELMET_INDEX) {
      selectedIndex = previousIndex === 4 ? 2 : 4;
      helmetVariable.setNumber(selectedIndex);
    }
    lastAllowedHelmetSelectionByGame.set(game, selectedIndex);
    for (const objectName of ["PreviewHelmet", "PlayerHelmet"]) {
      for (const helmet of runtimeScene.getObjects(objectName)) {
        if (helmet.hasBehavior?.("Animation")) {
          helmet.getBehavior("Animation").setAnimationIndex(selectedIndex);
        }
      }
    }
  }

  function configureMultiplayerMazeWall(wall, x, y, length, thickness, angle, zOrder) {
    if (!wall) return;
    wall.__headSpaceMultiplayerMazeWall = true;
    if (wall.hide) wall.hide(false);
    if (wall.setOpacity) wall.setOpacity(255);
    if (wall.setSize) wall.setSize(Math.max(4, length), Math.max(4, thickness));
    if (wall.setAngle) wall.setAngle(angle);
    if (wall.setZOrder) wall.setZOrder(zOrder);
    moveObjectToCenter(wall, x, y);
    if (wall.hasBehavior?.("Physics2")) {
      const physics = wall.getBehavior("Physics2");
      if (physics.setStatic) physics.setStatic();
      if (physics.setLinearVelocityX) physics.setLinearVelocityX(0);
      if (physics.setLinearVelocityY) physics.setLinearVelocityY(0);
      if (physics.setAngularVelocity) physics.setAngularVelocity(0);
    }
  }

  function updateMultiplayerBlueWallFeedback(runtimeScene, level) {
    if (!isMultiplayerGame(runtimeScene, level)) {
      multiplayerBlueWallFeedbackState.delete(runtimeScene);
      return;
    }
    const walls = runtimeScene
      .getObjects("Walls")
      .filter((wall) => wall.__headSpaceMultiplayerMazeWall && !wall.__headSpaceDestructibleWall);
    if (!walls.length) return;
    let state = multiplayerBlueWallFeedbackState.get(runtimeScene);
    if (!state) {
      state = { lastSoundAtMs: -Infinity };
      multiplayerBlueWallFeedbackState.set(runtimeScene, state);
    }
    const nowMs = performance.now();
    const actors = [
      ...runtimeScene.getObjects("Player"),
      ...runtimeScene.getObjects("Enemy"),
      ...runtimeScene.getObjects("SmartEnemy"),
    ].filter((actor) => actor && actor.getWidth() > 0 && actor.getHeight() > 0);

    for (const wall of walls) {
      const segment = getWallSegmentData(wall);
      if (!segment) continue;
      const previousContacts = wall.__headSpaceWallFeedbackContacts || new Set();
      const currentContacts = new Set();
      let newImpact = false;
      for (const actor of actors) {
        const hasPhysicsContact =
          actor.hasBehavior?.("Physics2") &&
          wall.hasBehavior?.("Physics2") &&
          actor.getBehavior("Physics2").contactsStartedThisFrame?.some(
            (contactBehavior) =>
              contactBehavior === wall.getBehavior("Physics2") ||
              contactBehavior?.owner === wall
          );
        if (!hasPhysicsContact) continue;
        const key = actor.getUniqueId?.() ?? actor;
        currentContacts.add(key);
        if (!previousContacts.has(key)) newImpact = true;
      }
      wall.__headSpaceWallFeedbackContacts = currentContacts;
      if (newImpact) {
        wall.__headSpaceWallFeedbackImpactAtMs = nowMs;
        if (nowMs - state.lastSoundAtMs >= 90) {
          state.lastSoundAtMs = nowMs;
          try {
            gdjs.evtTools.sound.playSound(
              runtimeScene,
              "assets\\audio\\audio - impact - wet - hard - 49.aac",
              false,
              40,
              0.9
            );
          } catch {
            // Audio may still be waiting for the first user gesture.
          }
        }
      }
      const impactAgeMs = nowMs - (wall.__headSpaceWallFeedbackImpactAtMs ?? -Infinity);
      const flash = clamp(1 - impactAgeMs / 260, 0, 1);
      const baseOpacity = wall.__headSpaceMultiplayerLevelThreeBorderWall
        ? 190
        : wall.__headSpaceMultiplayerLevelFourBorderWall
          ? 150
          : 64;
      wall.setOpacity?.(Math.round(baseOpacity + flash * (255 - baseOpacity)));
    }
  }

  function usesLevelTenRuntime(runtimeScene, level = getCurrentLevel(runtimeScene)) {
    const numericLevel = Number(level);
    return (
      numericLevel === 10 ||
      (numericLevel === 3 && isMultiplayerGame(runtimeScene, numericLevel))
    );
  }

  function ensureMultiplayerLevelThreeUsesLevelTenLayout(runtimeScene, level) {
    if (Number(level) !== 3 || !isMultiplayerGame(runtimeScene, level)) {
      multiplayerLevelThreeLayoutState.delete(runtimeScene);
      return;
    }
    if (multiplayerLevelThreeLayoutState.has(runtimeScene)) {
      const solarSystem = levelTenSolarSystemState.get(runtimeScene);
      if (solarSystem) {
        const ownedEnemies = new Set(
          (solarSystem.enemyOrbits || []).map((record) => record?.enemy).filter(Boolean)
        );
        for (const record of solarSystem.extraSmallEnemies || []) {
          if (record?.enemy) ownedEnemies.add(record.enemy);
        }
        for (const enemy of runtimeScene.getObjects("Enemy").slice()) {
          if (!ownedEnemies.has(enemy)) deleteRuntimeObjectTree(runtimeScene, enemy);
        }
      }
      return;
    }

    const preservedPlayers = new Set(runtimeScene.getObjects("Player"));
    const layoutObjectNames = [
      "Enemy",
      "EnemyImage",
      "SmartEnemy",
      "SmartEnemyImage",
      "Light1",
      "Light2",
      "Light3",
      ...PLANET_NAMES,
      ...GAMEPLAY_BACKGROUND_OBJECT_NAMES,
    ];
    for (const objectName of layoutObjectNames) {
      for (const object of runtimeScene.getObjects(objectName).slice()) {
        object.deleteFromScene?.(runtimeScene);
      }
    }

    // Level 3 uses the reusable, code-driven Level 10 solar controller directly,
    // while retaining its authored border walls as the arena boundary.
    const cameraX = gdjs.evtTools.camera.getCameraX(runtimeScene, "", 0);
    const cameraY = gdjs.evtTools.camera.getCameraY(runtimeScene, "", 0);
    [...preservedPlayers].forEach((player, index) => {
      const angle = -Math.PI / 2 + index * (Math.PI * 2 / Math.max(1, preservedPlayers.size));
      moveObjectToCenter(
        player,
        cameraX + Math.cos(angle) * 170,
        cameraY + Math.sin(angle) * 170
      );
      clearObjectMotion(player);
    });

    // The multiplayer Level 3 artwork is supplied by the selected high-resolution
    // background layer, so discard only the imported authored background image.
    for (const objectName of GAMEPLAY_BACKGROUND_OBJECT_NAMES) {
      for (const object of runtimeScene.getObjects(objectName).slice()) {
        object.deleteFromScene?.(runtimeScene);
      }
    }
    setSceneBoolean(runtimeScene, "LevelWon", false);
    setSceneBoolean(runtimeScene, "LevelLost", false);
    multiplayerLevelThreeLayoutState.set(runtimeScene, { source: "level-10-runtime-controller" });
  }

  function ensureMultiplayerLevelOneMaze(runtimeScene, level) {
    if (Number(level) !== 1 || !isMultiplayerGame(runtimeScene, level)) {
      multiplayerLevelOneMazeState.delete(runtimeScene);
      return;
    }
    const existingMaze = multiplayerLevelOneMazeState.get(runtimeScene);
    if (existingMaze) {
      const ownedWalls = new Set(
        existingMaze.walls.filter(
          (wall) => wall && !wall.__headSpaceDestructibleDestroyed
        )
      );
      for (const wall of runtimeScene.getObjects("Walls").slice()) {
        if (!ownedWalls.has(wall)) deleteRuntimeObjectTree(runtimeScene, wall);
      }
      for (const wall of existingMaze.walls) {
        if (wall?.__headSpaceDestructibleDestroyed) {
          wall.activateBehavior?.("Physics2", false);
          wall.hide?.(true);
          wall.setSize?.(0, 0);
          wall.deleteFromScene?.(runtimeScene);
          continue;
        }
        if (wall && wall.getWidth() > 0 && wall.setOpacity) {
          wall.setOpacity(wall.__headSpaceDestructibleWall ? 0 : 64);
        }
      }
      return;
    }

    const authoredWalls = runtimeScene.getObjects("Walls").slice();
    if (!authoredWalls.length) return;
    const bounds = getSceneObjectBounds(runtimeScene, ["Walls"]);
    if (!bounds) return;
    const layer = authoredWalls[0].getLayer?.() || "";
    const zOrder = authoredWalls[0].getZOrder?.() || 0;
    const cameraFrame = getUnzoomedViewportFrame(runtimeScene, layer);
    const centerX = cameraFrame.x;
    const centerY = cameraFrame.y;
    const arenaSpan = Math.min(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
    const visibleSpan = Math.min(cameraFrame.width, cameraFrame.height);
    const outerApothem = Math.max(arenaSpan * 0.46, visibleSpan * 0.43) * 2.4;
    const thickness = Math.max(24, Math.min(44, outerApothem * 0.026));
    const walls = [];
    const addWall = (x, y, length, angle, wallThickness = thickness) => {
      const wall = createSceneObject(runtimeScene, "Walls", layer);
      if (!wall) return;
      configureMultiplayerMazeWall(wall, x, y, length, wallThickness, angle, zOrder);
      walls.push(wall);
    };
    const addOctagonSegments = (apothem, includedSides) => {
      const sideLength = 2 * apothem * Math.tan(Math.PI / 8) + thickness * 0.8;
      for (const sideIndex of includedSides) {
        const normalAngle = -Math.PI / 2 + (sideIndex * Math.PI) / 4;
        addWall(
          centerX + Math.cos(normalAngle) * apothem,
          centerY + Math.sin(normalAngle) * apothem,
          sideLength,
          ((normalAngle + Math.PI / 2) * 180) / Math.PI
        );
      }
    };
    const addRadialWall = (angle, startRadius, endRadius) => {
      const middleRadius = (startRadius + endRadius) * 0.5;
      addWall(
        centerX + Math.cos(angle) * middleRadius,
        centerY + Math.sin(angle) * middleRadius,
        endRadius - startRadius + thickness * 0.75,
        (angle * 180) / Math.PI
      );
    };

    for (const wall of authoredWalls) wall.deleteFromScene(runtimeScene);

    // Solid blue octagonal enclosure.
    addOctagonSegments(outerApothem, [0, 1, 2, 3, 4, 5, 6, 7]);

    // Four alternating sides of one concentric octagon: visually this is an
    // inner octagon with every other wall removed.
    const innerApothem = outerApothem * 0.43;
    addOctagonSegments(innerApothem, [1, 3, 5, 7]);

    multiplayerLevelOneMazeState.set(runtimeScene, {
      walls,
      layer,
      zOrder,
      centerX,
      centerY,
      outerApothem,
      thickness,
    });
  }

  function ensureMultiplayerLevelTwoPong(runtimeScene, level) {
    if (Number(level) !== 2 || !isMultiplayerGame(runtimeScene, level)) {
      multiplayerLevelTwoPongState.delete(runtimeScene);
      return;
    }
    let system = multiplayerLevelTwoPongState.get(runtimeScene);
    if (system) {
      updateMultiplayerLevelTwoPong(runtimeScene, system);
      return;
    }
    const authoredWalls = runtimeScene.getObjects("Walls").slice();
    const bounds = getSceneObjectBounds(runtimeScene, ["Walls"]);
    if (!authoredWalls.length || !bounds || typeof PIXI === "undefined") return;
    const layerName = authoredWalls[0].getLayer?.() || "";
    const layerRenderer = runtimeScene.getLayer(layerName)?.getRenderer?.();
    if (!layerRenderer) return;
    const zOrder = Number(authoredWalls[0].getZOrder?.()) || 3;
    const width = Math.max(900, bounds.maxX - bounds.minX);
    const height = Math.max(560, bounds.maxY - bounds.minY);
    const centerX = (bounds.minX + bounds.maxX) * 0.5;
    const centerY = (bounds.minY + bounds.maxY) * 0.5;
    const wallThickness = clamp(Math.min(width, height) * 0.035, 26, 48);
    for (const wall of authoredWalls) wall.deleteFromScene?.(runtimeScene);

    const walls = [];
    const makeWall = (x, y, length, thickness, angle) => {
      const wall = createSceneObject(runtimeScene, "Walls", layerName);
      if (!wall) return null;
      configureMultiplayerMazeWall(wall, x, y, length, thickness, angle, zOrder);
      walls.push(wall);
      return wall;
    };
    makeWall(centerX, bounds.minY, width, wallThickness, 0);
    makeWall(centerX, bounds.maxY, width, wallThickness, 0);
    makeWall(bounds.minX, centerY, height, wallThickness, 90);
    makeWall(bounds.maxX, centerY, height, wallThickness, 90);

    const paddleHeight = height * 0.27;
    const paddleThickness = wallThickness * 1.15;
    const paddleInset = width * 0.09;
    const leftPaddle = makeWall(
      bounds.minX + paddleInset,
      centerY,
      paddleHeight,
      paddleThickness,
      90
    );
    const rightPaddle = makeWall(
      bounds.maxX - paddleInset,
      centerY,
      paddleHeight,
      paddleThickness,
      90
    );

    const ballRadius = clamp(Math.min(width, height) * 0.075, 58, 105);
    const ball = new PIXI.Sprite(PIXI.Texture.from("Planet14.png"));
    ball.anchor?.set?.(0.5);
    ball.position.set(centerX, centerY);
    ball.width = ballRadius * 2;
    ball.height = ballRadius * 2;
    ball.eventMode = "none";
    layerRenderer.addRendererObject(ball, zOrder + 0.35);

    for (const objectName of ["EnemyImage", "SmartEnemyImage", "SmartEnemy", "Enemy"]) {
      for (const object of runtimeScene.getObjects(objectName).slice()) {
        object.deleteFromScene?.(runtimeScene);
      }
    }
    const player = runtimeScene.getObjects("Player")[0] || null;
    const playerSize = player ? Math.max(28, Math.min(player.getWidth(), player.getHeight())) : 100;
    const enemies = [];
    const enemyPositions = [
      [0.31, 0.28],
      [0.69, 0.28],
      [0.31, 0.72],
      [0.69, 0.72],
    ];
    for (let i = 0; i < 4; i++) {
      const enemy = createSceneObject(runtimeScene, "Enemy", layerName);
      if (!enemy) continue;
      const size =
        playerSize *
        MULTIPLAYER_LEVEL_TWO_ENEMY_SIZE_RATIOS[
          i % MULTIPLAYER_LEVEL_TWO_ENEMY_SIZE_RATIOS.length
        ];
      enemy.setSize?.(size, size);
      moveObjectToCenter(
        enemy,
        bounds.minX + width * enemyPositions[i][0],
        bounds.minY + height * enemyPositions[i][1]
      );
      enemy.__headSpaceMultiplayerLevelTwoEnemySize = size;
      createImageCompanionForHost(runtimeScene, enemy, "Enemy", "EnemyImage");
      enemies.push(enemy);
    }

    system = {
      bounds,
      layerName,
      centerX,
      centerY,
      width,
      height,
      wallThickness,
      walls,
      paddles: [
        { wall: leftPaddle, x: bounds.minX + paddleInset, y: centerY, velocityY: 0 },
        { wall: rightPaddle, x: bounds.maxX - paddleInset, y: centerY, velocityY: 0 },
      ],
      paddleHeight,
      paddleThickness,
      ball,
      ballRadius,
      ballX: centerX,
      ballY: centerY,
      ballVelocityX: Math.max(360, width * 0.24),
      ballVelocityY: Math.max(135, height * 0.12),
      elapsedSeconds: 0,
      enemies,
      enemyLimit: 4,
      enemyRespawnDelaySeconds: 15,
      enemyRespawnQueue: [],
      knownLiveEnemyCount: enemies.length,
      nextEnemyOrdinal: enemies.length,
      actorContactTimes: new Map(),
    };
    multiplayerLevelTwoPongState.set(runtimeScene, system);
    const gameplayState = sceneState.get(runtimeScene);
    if (gameplayState) gameplayState.enemySizeInitialized = true;
    updateMultiplayerLevelTwoPong(runtimeScene, system);
  }

  function ensureMultiplayerLevelFourHoneycomb(runtimeScene, level) {
    if (Number(level) !== 4 || !isMultiplayerGame(runtimeScene, level)) {
      const existing = multiplayerLevelFourHoneycombState.get(runtimeScene);
      if (existing) {
        for (const projectile of (existing.projectiles || []).slice()) {
          removeLevelEightStationProjectile(runtimeScene, existing, projectile);
        }
        for (const sprite of existing.visualSprites || []) {
          removeLevelSevenRendererObject(runtimeScene, existing.layerName || "", sprite, false);
        }
        for (const body of [...(existing.planets || []), ...(existing.stations || [])]) {
          body.lightObstacle?.behavior?.onDestroy?.();
        }
        for (const light of existing.lights || []) {
          light.object?.setRadius?.(1);
          light.object?.hide?.(true);
        }
      }
      multiplayerLevelFourHoneycombState.delete(runtimeScene);
      runtimeScene.__headSpaceMultiplayerLevelFourHoneycomb = null;
      return;
    }

    let system = multiplayerLevelFourHoneycombState.get(runtimeScene);
    if (system) {
      const deltaSeconds =
        !getSceneBoolean(runtimeScene, "Paused")
          ? clamp(runtimeScene.getElapsedTime() / 1000, 0, 0.05)
          : 0;
      system.elapsedSeconds += deltaSeconds;
      const authoredHoneycombWalls = new Set(system.walls || []);
      for (const wall of runtimeScene.getObjects("Walls").slice()) {
        if (!authoredHoneycombWalls.has(wall)) {
          wall.deleteFromScene?.(runtimeScene);
        }
      }
      if (
        !system.playerSpawnReleased &&
        runtimeScene.getObjects("EmittedMaterial").length > 0
      ) {
        system.playerSpawnReleased = true;
      }
      if (!system.playerSpawnReleased) {
        const players = runtimeScene.getObjects("Player");
        players.forEach((player, index) => {
          const spawn =
            system.playerSpawns[index % system.playerSpawns.length];
          if (!spawn) return;
          moveObjectToCenter(player, spawn.x, spawn.y);
          clearObjectMotion(player);
          const image = player.__headSpaceImageCompanion;
          const helmet = player.__headSpaceHelmetCompanion;
          if (image) moveObjectToCenter(image, spawn.x, spawn.y);
          if (helmet) moveObjectToCenter(helmet, spawn.x, spawn.y);
        });
      }
      // Player collision is synchronized globally to the visible helmet
      // diameter. Do not shrink the Physics2 fixture for this level; the
      // honeycomb's manual boundary resolution already applies its own contact
      // margin without changing the player's actual collision silhouette.
      for (const objectName of ["Enemy", "EnemyImage", "SmartEnemy", "SmartEnemyImage"]) {
        if (objectName === "Enemy" || objectName === "EnemyImage") continue;
        for (const enemy of runtimeScene.getObjects(objectName).slice()) {
          deleteRuntimeObjectTree(runtimeScene, enemy);
        }
      }
      ensureMultiplayerParticipantOwnership(runtimeScene, 4);
      for (const player of runtimeScene.getObjects("Player")) {
        const image = player.__headSpaceImageCompanion;
        if (image && runtimeScene.getObjects("PlayerImage").includes(image)) {
          player.hide?.(true);
          player.setOpacity?.(0);
        }
      }
      for (const light of system.lights || []) {
        moveObjectToCenter(light.object, light.x, light.y);
        light.object.setColor?.(light.color);
        light.object.setRadius?.(light.radius);
        light.object.setZOrder?.(light.zOrder);
        light.object.hide?.(false);
      }
      for (const planet of system.planets || []) {
        planet.sprite.position.set(planet.x, planet.y);
        planet.sprite.rotation += planet.rotationSpeed * deltaSeconds;
        updateLevelSixMoonLightObstacle(
          planet.lightObstacle,
          planet.x,
          planet.y,
          planet.radius,
          runtimeScene
        );
      }
      for (const station of system.stations || []) {
        const bobPhase =
          system.elapsedSeconds * 0.72 + (station.bobPhase || 0);
        station.y = station.baseY + Math.sin(bobPhase) * station.bobAmplitude;
        station.velocityY =
          Math.cos(bobPhase) * station.bobAmplitude * 0.72;
        station.sprite.position.set(station.x, station.y);
        station.sprite.rotation = Math.sin(bobPhase * 0.63) * 0.035;
        updateLevelSixMoonLightObstacle(
          station.lightObstacle,
          station.x,
          station.y,
          station.radius,
          runtimeScene
        );
      }
      updateLevelElevenTriexos(runtimeScene, system, deltaSeconds);
      updateLevelElevenStationProjectiles(runtimeScene, system, deltaSeconds);
      applyLevelElevenBodyCollisions(runtimeScene, system);
      syncMultiplayerLevelFourOrangeEnemyVisuals(runtimeScene, system);
      updateMultiplayerDestructibleWalls(runtimeScene, system);
      return;
    }

    const authoredWalls = runtimeScene.getObjects("Walls").slice();
    if (!authoredWalls.length || typeof PIXI === "undefined") return;
    const layerName = authoredWalls[0].getLayer?.() || "";
    const layerRenderer = runtimeScene.getLayer(layerName)?.getRenderer?.();
    if (!layerRenderer) return;
    const zOrder = Number(authoredWalls[0].getZOrder?.()) || 3;
    const cameraFrame = getUnzoomedViewportFrame(runtimeScene, layerName);
    const centerX = cameraFrame.x;
    const centerY = cameraFrame.y;
    const visibleSpan = Math.min(cameraFrame.width, cameraFrame.height);
    // M4 needs substantially more world-space room than its decorative
    // objects require. Enlarge the honeycomb cells independently from the
    // planets/stations/triexos so players gain real maneuvering and growth
    // space instead of seeing the same proportions at a different zoom.
    const contentScaleRadius = Math.max(260, visibleSpan * 0.46);
    const cellRadius = contentScaleRadius * 1.4;
    const neighborDistance = Math.sqrt(3) * cellRadius;
    const thickness = clamp(contentScaleRadius * 0.075, 24, 42);

    for (const wall of authoredWalls) wall.deleteFromScene?.(runtimeScene);

    const cellCenters = [{ x: centerX, y: centerY }];
    for (let index = 0; index < 6; index++) {
      const angle = -Math.PI / 2 + index * (Math.PI / 3);
      cellCenters.push({
        x: centerX + Math.cos(angle) * neighborDistance,
        y: centerY + Math.sin(angle) * neighborDistance,
      });
    }

    const initialPlayers = runtimeScene.getObjects("Player");
    const playerSpawns = [cellCenters[1], cellCenters[4]];
    initialPlayers.forEach((player, index) => {
      const spawn = playerSpawns[index % playerSpawns.length];
      moveObjectToCenter(player, spawn.x, spawn.y);
      clearObjectMotion(player);
    });

    const edges = new Map();
    const pointKey = (point) => `${Math.round(point.x * 10)},${Math.round(point.y * 10)}`;
    for (const cell of cellCenters) {
      const vertices = Array.from({ length: 6 }, (_, index) => {
        const angle = index * (Math.PI / 3);
        return {
          x: cell.x + Math.cos(angle) * cellRadius,
          y: cell.y + Math.sin(angle) * cellRadius,
        };
      });
      for (let index = 0; index < 6; index++) {
        const a = vertices[index];
        const b = vertices[(index + 1) % 6];
        const aKey = pointKey(a);
        const bKey = pointKey(b);
        const key = aKey < bKey ? `${aKey}|${bKey}` : `${bKey}|${aKey}`;
        const existing = edges.get(key);
        if (existing) existing.count += 1;
        else edges.set(key, { a, b, count: 1 });
      }
    }

    const walls = [];
    const destructibleWalls = [];
    for (const edge of edges.values()) {
      const dx = edge.b.x - edge.a.x;
      const dy = edge.b.y - edge.a.y;
      const length = Math.hypot(dx, dy) + thickness * 0.7;
      const wall = createSceneObject(runtimeScene, "Walls", layerName);
      if (!wall) continue;
      configureMultiplayerMazeWall(
        wall,
        (edge.a.x + edge.b.x) * 0.5,
        (edge.a.y + edge.b.y) * 0.5,
        length,
        thickness,
        (Math.atan2(dy, dx) * 180) / Math.PI,
        zOrder
      );
      walls.push(wall);

      if (edge.count === 1) {
        wall.__headSpaceMultiplayerLevelFourBorderWall = true;
        wall.setOpacity?.(150);
        continue;
      }

      wall.__headSpaceDestructibleWall = true;
      wall.setOpacity?.(0);
      const graphic = new PIXI.Graphics();
      graphic.eventMode = "none";
      graphic.position.set(wall.getCenterXInScene(), wall.getCenterYInScene());
      graphic.rotation = ((Number(wall.getAngle?.()) || 0) * Math.PI) / 180;
      layerRenderer.addRendererObject(graphic, zOrder + 0.08 + destructibleWalls.length * 0.001);
      destructibleWalls.push({
        wall,
        graphic,
        hits: 0,
        initialColor: 0xff3fae,
        touchingPlayers: new Set(),
        lastHitAtSecondsByPlayer: new Map(),
        fadeStartedAtSeconds: null,
        disableCollisionAtSeconds: null,
      });
    }

    for (const planetName of PLANET_NAMES) {
      for (const planet of runtimeScene.getObjects(planetName).slice()) {
        planet.deleteFromScene?.(runtimeScene);
      }
    }

    const visualSprites = [];
    const addLevelFourSprite = (resource, point, size, zOrder, rotation = 0) => {
      const sprite = new PIXI.Sprite(PIXI.Texture.from(resource));
      sprite.anchor?.set?.(0.5);
      sprite.position.set(point.x, point.y);
      sprite.width = size;
      sprite.height = size;
      sprite.rotation = rotation;
      sprite.eventMode = "none";
      layerRenderer.addRendererObject(sprite, zOrder);
      visualSprites.push(sprite);
      return sprite;
    };

    const stationSize = contentScaleRadius * 0.64;
    const stationRadius =
      stationSize *
      (LEVEL_ELEVEN_STATION_RADIUS / LEVEL_ELEVEN_STATION_SIZE) *
      MULTIPLAYER_LEVEL_FOUR_STATION_COLLISION_SCALE;
    const stations = [
      { point: cellCenters[6], key: "section-6" },
      { point: cellCenters[3], key: "section-3" },
    ].map((config, index) => {
      const station = {
        key: config.key,
        sprite: addLevelFourSprite(
          LEVEL_EIGHT_STATION_RESOURCE,
          config.point,
          stationSize,
          zOrder - 0.32 + index * 0.001
        ),
        size: stationSize,
        x: config.point.x,
        y: config.point.y,
        baseY: config.point.y,
        bobPhase: index * Math.PI,
        bobAmplitude: contentScaleRadius * 0.055,
        radius: stationRadius,
        velocityX: 0,
        velocityY: 0,
        nextShotAt: 2.4 + index * 3.6,
      };
      station.collisionProxy = createLevelElevenCollisionProxy(station, `m4-station-${index}`);
      station.lightObstacle = createLevelSixMoonLightObstacle(runtimeScene);
      return station;
    });

    const planetSize = contentScaleRadius * 0.72;
    const planetRadius = planetSize * 0.43;
    const planets = [
      {
        key: "planet4",
        resource: "Planet4.png",
        point: cellCenters[5],
        rotationSpeed: -0.05,
      },
      {
        key: "planet10",
        resource: "Planet10.png",
        point: cellCenters[2],
        rotationSpeed: 0.045,
      },
    ].map((config, index) => {
      const planet = {
        key: config.key,
        sprite: addLevelFourSprite(
          config.resource,
          config.point,
          planetSize,
          zOrder - 0.38 + index * 0.001
        ),
        x: config.point.x,
        y: config.point.y,
        radius: planetRadius,
        velocityX: 0,
        velocityY: 0,
        rotationSpeed: config.rotationSpeed,
        layerName,
        zOrder: zOrder - 0.38 + index * 0.001,
      };
      planet.collisionProxy = createLevelElevenCollisionProxy(planet, `m4-${config.key}`);
      // These planets emit the native lights, so they must not be registered
      // as obstacles to their own light meshes.
      planet.lightObstacle = null;
      return planet;
    });

    const triexos = [];
    const triexoRingRadius = cellRadius * 0.46;
    const triexoSize = contentScaleRadius * 0.4;
    const triexoRadius =
      LEVEL_ELEVEN_TRIEXO_RADIUS * (triexoSize / LEVEL_ELEVEN_TRIEXO_SIZE);
    for (let index = 0; index < 6; index++) {
      const angle = -Math.PI / 2 + index * (Math.PI / 3);
      const point = {
        x: centerX + Math.cos(angle) * triexoRingRadius,
        y: centerY + Math.sin(angle) * triexoRingRadius,
      };
      const sprite = addLevelFourSprite(
          LEVEL_ELEVEN_TRIEXO_RESOURCE,
          point,
          triexoSize,
          zOrder - 0.35 + index * 0.001,
          angle + (Math.PI * 3) / 2
        );
      const triexo = {
        key: `m4-triexo-${index}`,
        sprite,
        size: triexoSize,
        x: point.x,
        y: point.y,
        radius: triexoRadius,
        velocityX: 0,
        velocityY: 0,
        rotation: sprite.rotation,
        angularVelocity: 0,
      };
      triexo.collisionProxy = createLevelElevenCollisionProxy(triexo, triexo.key);
      triexos.push(triexo);
    }

    const configureLight = (objectName, point, color, index) => {
      const candidates = runtimeScene.getObjects(objectName);
      const light = candidates[0] || createSceneObject(runtimeScene, objectName, "Lighting");
      for (const extra of candidates.slice(1)) {
        extra.setRadius?.(1);
        extra.hide?.(true);
      }
      if (!light) return null;
      const radius = cellRadius * 1.02;
      const lightZOrder = zOrder - 0.5 + index * 0.001;
      moveObjectToCenter(light, point.x, point.y);
      light.setColor?.(color);
      light.setRadius?.(radius);
      light.setZOrder?.(lightZOrder);
      light.hide?.(false);
      return {
        object: light,
        x: point.x,
        y: point.y,
        color,
        radius,
        zOrder: lightZOrder,
      };
    };
    const lights = [
      configureLight("Light1", cellCenters[5], "255;35;190", 0),
      configureLight("Light2", cellCenters[2], "45;255;110", 1),
    ].filter(Boolean);

    for (const objectName of ["Enemy", "EnemyImage", "SmartEnemy", "SmartEnemyImage"]) {
      for (const enemy of runtimeScene.getObjects(objectName).slice()) {
        deleteRuntimeObjectTree(runtimeScene, enemy);
      }
    }

    const orangeEnemies = [];
    const playerReference = initialPlayers[0] || null;
    const orangeEnemySize = clamp(
      Math.max(1, playerReference?.getWidth?.() || 120) * 0.62,
      54,
      94
    );
    const orangeEnemySpawns = [
      {
        x: cellCenters[6].x - cellRadius * 0.48,
        y: cellCenters[6].y - cellRadius * 0.24,
      },
      {
        x: cellCenters[3].x + cellRadius * 0.48,
        y: cellCenters[3].y + cellRadius * 0.24,
      },
    ];
    for (let index = 0; index < orangeEnemySpawns.length; index++) {
      const enemy = createSceneObject(runtimeScene, "Enemy", layerName);
      if (!enemy) continue;
      setObjectSizeAndShape(enemy, orangeEnemySize);
      moveObjectToCenter(
        enemy,
        orangeEnemySpawns[index].x,
        orangeEnemySpawns[index].y
      );
      clearObjectMotion(enemy);
      enemy.__headSpaceMultiplayerLevelFourOrangeEnemy = true;
      enemy.__headSpaceMultiplayerLevelFourSpawnIndex = index;
      orangeEnemies.push(enemy);
    }

    const centralApothem = cellRadius * Math.cos(Math.PI / 6) - thickness * 0.72;
    const hexSides = Array.from({ length: 6 }, (_, index) => {
      const angle = Math.PI / 6 + index * (Math.PI / 3);
      return {
        normalX: Math.cos(angle),
        normalY: Math.sin(angle),
        apothem: centralApothem,
      };
    });

    system = {
      walls,
      destructibleWalls,
      visualSprites,
      triexos,
      lights,
      orangeEnemies,
      planets,
      stations,
      projectiles: [],
      shotIndex: 0,
      stationFireIntervalSeconds: 7.2,
      hexSides,
      triexoArenaRadius: centralApothem,
      visibleWallBoundaryOnly: true,
      cellCenters,
      playerSpawns,
      playerSpawnReleased: false,
      layerName,
      layerRenderer,
      centerX,
      centerY,
      cellRadius,
      contentScaleRadius,
      elapsedSeconds: 0,
      enemyVisualByHost: new Map(),
    };
    multiplayerLevelFourHoneycombState.set(runtimeScene, system);
    runtimeScene.__headSpaceMultiplayerLevelFourHoneycomb = system;
    initializeMultiplayerLevelFourCamera(runtimeScene, system);
    for (const planet of planets) {
      updateLevelSixMoonLightObstacle(
        planet.lightObstacle,
        planet.x,
        planet.y,
        planet.radius,
        runtimeScene
      );
    }
    for (const station of stations) {
      updateLevelSixMoonLightObstacle(
        station.lightObstacle,
        station.x,
        station.y,
        station.radius,
        runtimeScene
      );
    }
    updateMultiplayerDestructibleWalls(runtimeScene, system);
  }

  function initializeMultiplayerLevelFourCamera(runtimeScene, system) {
    if (!system || !gdjs?.evtTools?.camera) return;
    const viewportWidth =
      typeof runtimeScene.getViewportWidth === "function"
        ? Math.max(1, runtimeScene.getViewportWidth())
        : 1280;
    const viewportHeight =
      typeof runtimeScene.getViewportHeight === "function"
        ? Math.max(1, runtimeScene.getViewportHeight())
        : 720;
    const arenaWidth = system.cellRadius * 5;
    const arenaHeight = system.cellRadius * 3 * Math.sqrt(3);
    const margin = Math.max(70, system.cellRadius * 0.28);
    const fittedZoom = clamp(
      Math.min(
        viewportWidth / (arenaWidth + margin * 2),
        viewportHeight / (arenaHeight + margin * 2)
      ),
      0.25,
      1
    );
    for (const layerName of ["", "Texture"]) {
      if (typeof runtimeScene.hasLayer === "function" && !runtimeScene.hasLayer(layerName)) continue;
      gdjs.evtTools.camera.setCameraZoom(runtimeScene, fittedZoom, layerName, 0);
      const player = runtimeScene.getObjects("Player")[0];
      if (player) {
        gdjs.evtTools.camera.setCameraX(
          runtimeScene,
          player.getCenterXInScene(),
          layerName,
          0
        );
        gdjs.evtTools.camera.setCameraY(
          runtimeScene,
          player.getCenterYInScene(),
          layerName,
          0
        );
      }
    }
    system.cameraInitialized = true;
  }

  function syncMultiplayerLevelFourOrangeEnemyVisuals(runtimeScene, system) {
    if (!system || typeof PIXI === "undefined") return;
    if (!system.layerRenderer) {
      system.layerRenderer = runtimeScene.getLayer?.(system.layerName || "")?.getRenderer?.() || null;
    }
    if (!system.layerRenderer) return;
    if (!(system.enemyVisualByHost instanceof Map)) system.enemyVisualByHost = new Map();
    const liveEnemies = new Set(runtimeScene.getObjects("Enemy"));
    const playerWidth = Math.max(
      0,
      Number(runtimeScene.getObjects("Player")[0]?.getWidth?.()) || 0
    );

    for (const [host, sprite] of system.enemyVisualByHost) {
      if (liveEnemies.has(host) && host?.getWidth?.() > 0) continue;
      removeLevelSevenRendererObject(runtimeScene, system.layerName || "", sprite, false);
      system.enemyVisualByHost.delete(host);
    }

    for (const enemy of liveEnemies) {
      let sprite = system.enemyVisualByHost.get(enemy);
      if (!sprite) {
        sprite = new PIXI.Sprite(
          PIXI.Texture.from("alien_helmet_tentacles_resized_transparent.png")
        );
        sprite.anchor?.set?.(0.5);
        sprite.eventMode = "none";
        // Match M3's native EnemyImage Glow effect instead of drawing a
        // thick solid outline around the M4 enemy artwork.
        if (PIXI.filters?.GlowFilter) {
          sprite.__headSpaceBlueGlowFilter = new PIXI.filters.GlowFilter({
            distance: 15,
            outerStrength: 2,
            innerStrength: 1,
            color: 0x0023d8,
            quality: 0.1,
            knockout: false,
          });
        }
        system.layerRenderer.addRendererObject(
          sprite,
          (Number(enemy.getZOrder?.()) || 3) + 1.15
        );
        system.enemyVisualByHost.set(enemy, sprite);
        system.visualSprites.push(sprite);
      }
      const size = Math.max(0, Number(enemy.getWidth?.()) || 0);
      sprite.position.set(enemy.getCenterXInScene(), enemy.getCenterYInScene());
      sprite.width = size;
      sprite.height = size;
      sprite.rotation = ((Number(enemy.getAngle?.()) || 0) * Math.PI) / 180;
      sprite.visible = size > 0.5;
      const shouldShowBlueGlow =
        sprite.visible && playerWidth > 0 && size < playerWidth;
      if (sprite.__headSpaceBlueGlowEnabled !== shouldShowBlueGlow) {
        sprite.__headSpaceBlueGlowEnabled = shouldShowBlueGlow;
        sprite.filters =
          shouldShowBlueGlow && sprite.__headSpaceBlueGlowFilter
            ? [sprite.__headSpaceBlueGlowFilter]
            : null;
      }

      enemy.hide?.(true);
      enemy.setOpacity?.(0);
      const image = enemy.__headSpaceImageCompanion;
      if (image) {
        image.hide?.(true);
        image.setOpacity?.(0);
      }
    }
  }

  function applyMultiplayerLevelFourPlanetPlayerCollisions(runtimeScene, system) {
    if (
      !system ||
      getSceneBoolean(runtimeScene, "Paused") ||
      getSceneBoolean(runtimeScene, "LevelWon") ||
      getSceneBoolean(runtimeScene, "LevelLost")
    ) return;
    const players = runtimeScene.getObjects("Player");
    for (let playerIndex = 0; playerIndex < players.length; playerIndex++) {
      const player = players[playerIndex];
      if (!player?.hasBehavior?.("Physics2") || player.getWidth?.() <= 0) continue;
      const physics = player.getBehavior("Physics2");
      const playerRadius =
        getApproxObjectRadius(player, 18) * LEVEL_ELEVEN_PLAYER_COLLISION_RADIUS_SCALE;
      for (let planetIndex = 0; planetIndex < system.planets.length; planetIndex++) {
        const planet = system.planets[planetIndex];
        const contactDistance = playerRadius + planet.radius;
        let dx = player.getCenterXInScene() - planet.x;
        let dy = player.getCenterYInScene() - planet.y;
        let distance = Math.hypot(dx, dy);
        if (distance >= contactDistance) continue;
        if (distance <= 0.001) {
          const fallbackAngle = playerIndex * 1.7 + planetIndex * Math.PI;
          dx = Math.cos(fallbackAngle);
          dy = Math.sin(fallbackAngle);
          distance = 1;
        }
        const normalX = dx / distance;
        const normalY = dy / distance;
        moveObjectToCenter(
          player,
          planet.x + normalX * (contactDistance + 2),
          planet.y + normalY * (contactDistance + 2)
        );
        const body = physics.getBody?.();
        if (body && physics.b2Vec2 && physics._sharedData) {
          const worldInvScale = physics._sharedData.worldInvScale;
          body.SetTransform(
            physics.b2Vec2(
              player.getCenterXInScene() * worldInvScale,
              player.getCenterYInScene() * worldInvScale
            ),
            body.GetAngle()
          );
          body.SetAwake(true);
        }
        const velocity = getObjectVelocity(player);
        const inwardSpeed = velocity.x * normalX + velocity.y * normalY;
        const tangentX = velocity.x - normalX * inwardSpeed;
        const tangentY = velocity.y - normalY * inwardSpeed;
        const bounceSpeed = clamp(
          inwardSpeed < 0 ? Math.max(105, -inwardSpeed * 0.9) : 105,
          105,
          420
        );
        physics.setLinearVelocityX?.(tangentX + normalX * bounceSpeed);
        physics.setLinearVelocityY?.(tangentY + normalY * bounceSpeed);
        capPhysicsSpeed(physics, PLAYER_INTENDED_MAX_SPEED);
      }
    }
  }

  function suppressMultiplayerLevelTwoNativeCompletion(runtimeScene) {
    const hadNativeOutcome =
      getSceneBoolean(runtimeScene, "LevelWon") ||
      getSceneBoolean(runtimeScene, "LevelLost") ||
      runtimeScene.getObjects("Button").length > 0 ||
      runtimeScene.getObjects("HomeButton").length > 0 ||
      runtimeScene.getObjects("Message1").some((message) => {
        const text = String(message.getString?.() || "").toUpperCase();
        return text.includes("LEVEL COMPLETE") || text.includes("HEADNAUT DOWN");
      });
    if (!hadNativeOutcome) return;

    setSceneBoolean(runtimeScene, "LevelWon", false);
    setSceneBoolean(runtimeScene, "LevelLost", false);
    setSceneBoolean(runtimeScene, "Paused", false);
    setSceneBoolean(runtimeScene, "ChangingScenes", false);
    const gameplayState = sceneState.get(runtimeScene);
    if (gameplayState) {
      clearCompletionVisuals(runtimeScene, gameplayState);
      gameplayState.completionFrozen = false;
      gameplayState.frozenTimeSeconds = null;
      gameplayState.winCommitted = false;
    }
    if (!getSceneBoolean(runtimeScene, "Paused")) setRuntimeTimeScale(runtimeScene, 1);

    for (const objectName of [
      "Button",
      "Button_Text",
      "ButtonMulti",
      "Button_Multi_Text",
      "HomeButton",
      "HomeButtonText",
    ]) {
      for (const object of runtimeScene.getObjects(objectName).slice()) {
        object.deleteFromScene?.(runtimeScene);
      }
    }
    for (const message of runtimeScene.getObjects("Message1").slice()) {
      const text = String(message.getString?.() || "").toUpperCase();
      if (text.includes("LEVEL COMPLETE") || text.includes("HEADNAUT DOWN")) {
        message.deleteFromScene?.(runtimeScene);
      }
    }
  }

  function spawnMultiplayerLevelTwoReplacementEnemy(runtimeScene, system) {
    const liveCount = runtimeScene.getObjects("Enemy").filter(
      (enemy) => enemy.__headSpaceMultiplayerLevelTwoEnemySize && enemy.getWidth() > 0
    ).length;
    if (!system || liveCount >= system.enemyLimit) return null;

    const enemy = createSceneObject(runtimeScene, "Enemy", system.layerName || "");
    if (!enemy) return null;
    const ordinal = system.nextEnemyOrdinal++;
    const player = runtimeScene.getObjects("Player")[0] || null;
    const playerSize = player ? Math.max(28, Math.min(player.getWidth(), player.getHeight())) : 100;
    const size =
      playerSize *
      MULTIPLAYER_LEVEL_TWO_ENEMY_SIZE_RATIOS[
        ordinal % MULTIPLAYER_LEVEL_TWO_ENEMY_SIZE_RATIOS.length
      ];
    const positions = [
      [0.31, 0.28],
      [0.69, 0.28],
      [0.31, 0.72],
      [0.69, 0.72],
    ];
    const position = positions[ordinal % positions.length];
    enemy.setSize?.(size, size);
    moveObjectToCenter(
      enemy,
      system.bounds.minX + system.width * position[0],
      system.bounds.minY + system.height * position[1]
    );
    enemy.__headSpaceMultiplayerLevelTwoEnemySize = size;
    createImageCompanionForHost(runtimeScene, enemy, "Enemy", "EnemyImage");
    system.enemies.push(enemy);
    return enemy;
  }

  function collideMultiplayerPongBallWithActors(runtimeScene, system, deltaSeconds) {
    if (deltaSeconds <= 0) return;
    const actors = [
      ...runtimeScene.getObjects("Player"),
      ...runtimeScene.getObjects("Enemy").filter(
        (enemy) => enemy.__headSpaceMultiplayerLevelTwoEnemySize
      ),
    ];
    const ballCollisionRadius = system.ballRadius * 0.84;
    for (const actor of actors) {
      if (!actor || actor.getWidth() <= 0 || actor.getHeight() <= 0) continue;
      const actorX = actor.getCenterXInScene();
      const actorY = actor.getCenterYInScene();
      const actorRadius = Math.max(8, Math.min(actor.getWidth(), actor.getHeight()) * 0.43);
      let dx = actorX - system.ballX;
      let dy = actorY - system.ballY;
      let distance = Math.hypot(dx, dy);
      const minimumDistance = ballCollisionRadius + actorRadius;
      if (distance >= minimumDistance) continue;
      if (distance < 0.001) {
        dx = 1;
        dy = 0;
        distance = 1;
      }
      const normalX = dx / distance;
      const normalY = dy / distance;
      moveObjectToCenter(
        actor,
        system.ballX + normalX * (minimumDistance + 2),
        system.ballY + normalY * (minimumDistance + 2)
      );

      const key = actor.getUniqueId?.() ?? actor;
      const lastContact = system.actorContactTimes.get(key) ?? -Infinity;
      if (system.elapsedSeconds - lastContact < 0.12) continue;
      system.actorContactTimes.set(key, system.elapsedSeconds);

      const actorVelocity = getObjectVelocity(actor);
      const ballTowardActor =
        system.ballVelocityX * normalX + system.ballVelocityY * normalY;
      if (ballTowardActor > 0) {
        system.ballVelocityX -= 2 * ballTowardActor * normalX;
        system.ballVelocityY -= 2 * ballTowardActor * normalY;
      }
      if (actor.hasBehavior?.("Physics2")) {
        const physics = actor.getBehavior("Physics2");
        const impactSpeed = Math.max(240, Math.hypot(system.ballVelocityX, system.ballVelocityY) * 0.72);
        physics.setLinearVelocityX?.(actorVelocity.x + normalX * impactSpeed);
        physics.setLinearVelocityY?.(actorVelocity.y + normalY * impactSpeed);
      }
    }
  }

  function updateMultiplayerLevelTwoPong(runtimeScene, system) {
    // Native Level 2 can briefly see zero authored enemies before this controller
    // installs its four-player targets. Pong is continuous, so that is not a win.
    suppressMultiplayerLevelTwoNativeCompletion(runtimeScene);
    const paused = getSceneBoolean(runtimeScene, "Paused");
    const finished = getSceneBoolean(runtimeScene, "LevelWon") || getSceneBoolean(runtimeScene, "LevelLost");
    const rawDelta = runtimeScene.getElapsedTime() / 1000;
    const deltaSeconds =
      !paused && !finished && Number.isFinite(rawDelta) ? clamp(rawDelta, 0, 0.05) : 0;
    system.elapsedSeconds += deltaSeconds;
    const liveCompetitiveEnemies = runtimeScene.getObjects("Enemy").filter(
      (enemy) => enemy.__headSpaceMultiplayerLevelTwoEnemySize && enemy.getWidth() > 0
    );
    if (liveCompetitiveEnemies.length < system.knownLiveEnemyCount) {
      const absorbedCount = system.knownLiveEnemyCount - liveCompetitiveEnemies.length;
      for (let i = 0; i < absorbedCount; i++) {
        system.enemyRespawnQueue.push(system.elapsedSeconds + system.enemyRespawnDelaySeconds);
      }
    }
    system.knownLiveEnemyCount = liveCompetitiveEnemies.length;
    while (
      system.enemyRespawnQueue.length &&
      system.enemyRespawnQueue[0] <= system.elapsedSeconds &&
      system.knownLiveEnemyCount < system.enemyLimit
    ) {
      system.enemyRespawnQueue.shift();
      if (spawnMultiplayerLevelTwoReplacementEnemy(runtimeScene, system)) {
        system.knownLiveEnemyCount++;
      }
    }
    for (const wall of system.walls) {
      if (wall && wall.getWidth() > 0) wall.setOpacity?.(64);
    }

    const minPaddleY =
      system.bounds.minY + system.wallThickness + system.paddleHeight * 0.5;
    const maxPaddleY =
      system.bounds.maxY - system.wallThickness - system.paddleHeight * 0.5;
    for (let i = 0; i < system.paddles.length; i++) {
      const paddle = system.paddles[i];
      const oldY = paddle.y;
      const waveOffset = Math.sin(system.elapsedSeconds * 0.9 + i * Math.PI) * system.height * 0.09;
      const targetY = clamp(system.ballY + waveOffset, minPaddleY, maxPaddleY);
      paddle.y += (targetY - paddle.y) * Math.min(1, deltaSeconds * 3.2);
      paddle.velocityY = deltaSeconds > 0 ? (paddle.y - oldY) / deltaSeconds : 0;
      moveObjectToCenter(paddle.wall, paddle.x, paddle.y);
    }

    if (deltaSeconds > 0) {
      system.ballX += system.ballVelocityX * deltaSeconds;
      system.ballY += system.ballVelocityY * deltaSeconds;
      const top = system.bounds.minY + system.wallThickness + system.ballRadius;
      const bottom = system.bounds.maxY - system.wallThickness - system.ballRadius;
      if (system.ballY < top || system.ballY > bottom) {
        system.ballY = clamp(system.ballY, top, bottom);
        system.ballVelocityY *= -1;
      }
      for (let i = 0; i < system.paddles.length; i++) {
        const paddle = system.paddles[i];
        const movingTowardPaddle =
          i === 0 ? system.ballVelocityX < 0 : system.ballVelocityX > 0;
        const contactX = system.ballRadius + system.paddleThickness * 0.5;
        if (
          movingTowardPaddle &&
          Math.abs(system.ballX - paddle.x) <= contactX &&
          Math.abs(system.ballY - paddle.y) <= system.paddleHeight * 0.5 + system.ballRadius * 0.65
        ) {
          system.ballX = paddle.x + (i === 0 ? contactX : -contactX);
          system.ballVelocityX =
            Math.abs(system.ballVelocityX) * (i === 0 ? 1 : -1);
          const hitOffset = clamp(
            (system.ballY - paddle.y) / (system.paddleHeight * 0.5),
            -1,
            1
          );
          system.ballVelocityY =
            hitOffset * system.height * 0.25 + paddle.velocityY * 0.32;
        }
      }
      const leftReset = system.bounds.minX + system.wallThickness + system.ballRadius;
      const rightReset = system.bounds.maxX - system.wallThickness - system.ballRadius;
      if (system.ballX < leftReset || system.ballX > rightReset) {
        system.ballX = clamp(system.ballX, leftReset, rightReset);
        system.ballVelocityX *= -1;
      }
      collideMultiplayerPongBallWithActors(runtimeScene, system, deltaSeconds);
    }
    system.ball.position.set(system.ballX, system.ballY);
    system.ball.rotation += deltaSeconds * 0.42;
    for (const enemy of runtimeScene.getObjects("Enemy")) {
      if (enemy.__headSpaceMultiplayerLevelTwoEnemySize) {
        enemy.setSize?.(
          enemy.__headSpaceMultiplayerLevelTwoEnemySize,
          enemy.__headSpaceMultiplayerLevelTwoEnemySize
        );
      }
    }
  }

  function ensureMultiplayerLevelOneFeatures(runtimeScene, level) {
    if (Number(level) !== 1 || !isMultiplayerGame(runtimeScene, level)) {
      multiplayerLevelOneFeatureState.delete(runtimeScene);
      runtimeScene.__headSpaceMultiplayerDestructibleWalls = null;
      return;
    }
    const maze = multiplayerLevelOneMazeState.get(runtimeScene);
    if (!maze) return;
    let system = multiplayerLevelOneFeatureState.get(runtimeScene);
    if (system) {
      const ownedEnemies = new Set(
        system.enemies.filter((enemy) => enemy && enemy.getWidth?.() > 0.5)
      );
      for (const enemy of runtimeScene.getObjects("Enemy").slice()) {
        if (!ownedEnemies.has(enemy)) deleteRuntimeObjectTree(runtimeScene, enemy);
      }
      updateMultiplayerLevelOneFeatures(runtimeScene, system);
      return;
    }

    const layerRenderer = runtimeScene.getLayer(maze.layer)?.getRenderer?.();
    if (!layerRenderer || typeof PIXI === "undefined") return;
    const { centerX, centerY, outerApothem } = maze;
    const addSprite = (resource, x, y, size, zOrder = 1.25) => {
      const sprite = new PIXI.Sprite(PIXI.Texture.from(resource));
      sprite.anchor?.set?.(0.5);
      sprite.position.set(x, y);
      sprite.width = size;
      sprite.height = size;
      sprite.eventMode = "none";
      layerRenderer.addRendererObject(sprite, zOrder);
      return sprite;
    };

    const portalSize = outerApothem * 0.18;
    const portalConfigs = [
      { x: centerX - outerApothem * 0.8, y: centerY },
      { x: centerX + outerApothem * 0.8, y: centerY },
    ];
    const portals = portalConfigs.map((portal, index) => ({
      ...portal,
      radius: portalSize * 0.34,
      triggerRadius: portalSize * LEVEL_NINE_BLACK_HOLE_OUTER_EDGE_RATIO,
      index,
      graphic: createLevelNineBlackHoleGraphic(
        PIXI.Texture.from(LEVEL_NINE_BLACK_HOLE_RESOURCE),
        index,
        portalSize
      ),
    }));
    for (let i = 0; i < portals.length; i++) {
      const portal = portals[i];
      if (!portal.graphic) continue;
      portal.graphic.position.set(portal.x, portal.y);
      layerRenderer.addRendererObject(portal.graphic, 1.35 + i * 0.01);
    }

    const boosts = [];

    const station = addSprite(
      LEVEL_EIGHT_STATION_RESOURCE,
      centerX,
      centerY,
      outerApothem * 0.34,
      1.3
    );

    const destructibleWalls = maze.walls.slice(8).map((wall, index) => {
      wall.__headSpaceDestructibleWall = true;
      wall.setOpacity?.(0);
      const graphic = new PIXI.Graphics();
      graphic.eventMode = "none";
      graphic.position.set(wall.getCenterXInScene(), wall.getCenterYInScene());
      graphic.rotation = ((Number(wall.getAngle?.()) || 0) * Math.PI) / 180;
      layerRenderer.addRendererObject(graphic, maze.zOrder + 0.08 + index * 0.001);
      return {
        wall,
        graphic,
        hits: 0,
        touchingPlayers: new Set(),
        lastHitAtSecondsByPlayer: new Map(),
        fadeStartedAtSeconds: null,
        disableCollisionAtSeconds: null,
      };
    });

    const spawnSlots = [
      { x: centerX - outerApothem * 0.58, y: centerY - outerApothem * 0.48 },
      { x: centerX + outerApothem * 0.58, y: centerY - outerApothem * 0.48 },
      { x: centerX + outerApothem * 0.58, y: centerY + outerApothem * 0.48 },
      { x: centerX - outerApothem * 0.58, y: centerY + outerApothem * 0.48 },
    ];
    const initialPlayers = runtimeScene.getObjects("Player");
    initialPlayers.forEach((player, index) => {
      const spawn = spawnSlots[index % spawnSlots.length];
      moveObjectToCenter(player, spawn.x, spawn.y);
      if (player.hasBehavior?.("Physics2")) {
        const physics = player.getBehavior("Physics2");
        physics.setLinearVelocityX?.(0);
        physics.setLinearVelocityY?.(0);
      }
    });
    const firstSpawn = spawnSlots[0];
    for (const objectName of ["PlayerImage", "PlayerHelmet"]) {
      for (const visual of runtimeScene.getObjects(objectName)) {
        moveObjectToCenter(visual, firstSpawn.x, firstSpawn.y);
      }
    }

    for (const image of runtimeScene.getObjects("EnemyImage").slice()) image.deleteFromScene(runtimeScene);
    for (const enemy of runtimeScene.getObjects("Enemy").slice()) enemy.deleteFromScene(runtimeScene);
    const enemies = [];
    const player = runtimeScene.getObjects("Player")[0] || null;
    const playerSize = player ? Math.max(24, Math.min(player.getWidth(), player.getHeight())) : 90;
    const multiplayerEnemyCount = 3;
    for (let i = 0; i < multiplayerEnemyCount; i++) {
      const enemy = createSceneObject(runtimeScene, "Enemy", maze.layer);
      if (!enemy) continue;
      const ring = i % 2 === 0 ? outerApothem * 0.5 : outerApothem * 0.68;
      const angle =
        -Math.PI / 2 + (i * Math.PI * 2) / multiplayerEnemyCount + (i % 2) * 0.11;
      moveObjectToCenter(enemy, centerX + Math.cos(angle) * ring, centerY + Math.sin(angle) * ring);
      const size = playerSize * (0.22 + i * 0.055);
      enemy.setSize?.(size, size);
      enemy.__headSpaceMultiplayerLevelOneEnemySize = size;
      enemy.__headSpaceMultiplayerOrbitSpeed = 92 + (i % 5) * 14;
      enemy.__headSpaceMultiplayerOrbitRadius = ring;
      createImageCompanionForHost(runtimeScene, enemy, "Enemy", "EnemyImage");
      enemies.push(enemy);
    }

    system = {
      centerX,
      centerY,
      outerApothem,
      portals,
      blackHoles: portals,
      boosts,
      station,
      stationSize: outerApothem * 0.34,
      stationRadius: outerApothem * 0.085,
      spawnSlots,
      spawnLockUntilSeconds: 0.55,
      enemies,
      elapsedSeconds: 0,
      cooldownSeconds: 0,
      portalCooldownSeconds: 0,
      transit: null,
      visualRecords: [],
      layerName: maze.layer,
      layerRenderer,
      zOrder: 1.3,
      shotIndex: 0,
      launchAccumulatorSeconds: 0,
      projectilesArmed: false,
      projectiles: [],
      destructibleWalls,
      lastRealtimeUpdateMs: performance.now(),
      enemyLimit: multiplayerEnemyCount,
      enemyRespawnDelaySeconds: 15,
      enemyRespawnQueue: [],
      knownLiveEnemyCount: enemies.length,
      nextEnemyOrdinal: enemies.length,
    };
    if (typeof PIXI.Graphics === "function") {
      system.lightningGraphic = new PIXI.Graphics();
      system.lightningGraphic.eventMode = "none";
      system.lightningGraphic.blendMode = PIXI.BLEND_MODES.ADD;
      layerRenderer.addRendererObject(system.lightningGraphic, 2.92);
    }
    multiplayerLevelOneFeatureState.set(runtimeScene, system);
    runtimeScene.__headSpaceMultiplayerDestructibleWalls = destructibleWalls;
    const gameplayState = sceneState.get(runtimeScene);
    if (gameplayState) gameplayState.enemySizeInitialized = true;
    updateMultiplayerLevelOneFeatures(runtimeScene, system);
  }

  function redrawMultiplayerDestructibleWall(record) {
    const wall = record?.wall;
    const graphic = record?.graphic;
    if (!wall || !graphic || graphic.destroyed) return;
    const color =
      record.hits === 0
        ? record.initialColor || 0xa447ff
        : record.hits === 1
          ? 0xffdf32
          : 0xff3048;
    const width = Math.max(8, wall.getWidth());
    const height = Math.max(8, wall.getHeight());
    graphic.clear();
    graphic.lineStyle(Math.max(5, height * 0.18), color, 0.42);
    graphic.beginFill(color, 0.92);
    graphic.drawRoundedRect(-width * 0.5, -height * 0.5, width, height, height * 0.45);
    graphic.endFill();
    graphic.lineStyle(Math.max(2, height * 0.07), 0xffffff, 0.48);
    graphic.drawRoundedRect(
      -width * 0.5 + 3,
      -height * 0.5 + 3,
      Math.max(2, width - 6),
      Math.max(2, height - 6),
      Math.max(2, height * 0.38)
    );
  }

  function didPlayerStartPhysicsContactWithWall(player, wall) {
    if (
      !player?.hasBehavior?.("Physics2") ||
      !wall?.hasBehavior?.("Physics2")
    ) {
      return false;
    }
    const playerPhysics = player.getBehavior("Physics2");
    const wallPhysics = wall.getBehavior("Physics2");
    return (
      playerPhysics.contactsStartedThisFrame?.some(
        (contactBehavior) =>
          contactBehavior === wallPhysics || contactBehavior?.owner === wall
      ) || false
    );
  }

  function isPlayerTouchingWallAfterBounce(player, wall) {
    const segment = getWallSegmentData(wall);
    if (!segment || !player) return false;
    const playerX = player.getCenterXInScene?.();
    const playerY = player.getCenterYInScene?.();
    if (!Number.isFinite(playerX) || !Number.isFinite(playerY)) return false;
    const closest = getClosestPointOnSegment(playerX, playerY, segment);
    if (!closest) return false;
    const dx = playerX - closest.x;
    const dy = playerY - closest.y;
    const distance = Math.hypot(dx, dy);
    const playerRadius = Math.max(
      6,
      Math.min(player.getWidth?.() || 0, player.getHeight?.() || 0) * 0.42
    );
    if (distance > segment.halfThickness + playerRadius + 1.5) return false;
    const velocity = getObjectVelocity(player);
    if (distance < 0.001) return Math.hypot(velocity.x, velocity.y) > 20;
    return (velocity.x * dx + velocity.y * dy) / distance > 8;
  }

  function updateMultiplayerDestructibleWalls(runtimeScene, system) {
    const players = runtimeScene.getObjects("Player");
    for (const record of system.destructibleWalls || []) {
      if (record.completed) continue;
      if (!record.graphic || record.graphic.destroyed) continue;
      if (Number.isFinite(record.fadeStartedAtSeconds)) {
        if (
          Number.isFinite(record.disableCollisionAtSeconds) &&
          system.elapsedSeconds >= record.disableCollisionAtSeconds
        ) {
          record.wall.activateBehavior?.("Physics2", false);
          record.disableCollisionAtSeconds = null;
        }
        const fadeProgress = clamp(
          (system.elapsedSeconds - record.fadeStartedAtSeconds) / 0.75,
          0,
          1
        );
        record.graphic.alpha = 1 - fadeProgress;
        record.graphic.scale.set(1 + fadeProgress * 0.08, 1 - fadeProgress * 0.22);
        if (fadeProgress >= 1) {
          record.completed = true;
          record.wall.__headSpaceDestructibleDestroyed = true;
          record.wall.activateBehavior?.("Physics2", false);
          record.wall.hide?.(true);
          record.wall.setSize?.(0, 0);
          record.wall.deleteFromScene?.(runtimeScene);
          removeLevelSevenRendererObject(
            runtimeScene,
            system.layerName || "",
            record.graphic,
            false
          );
        }
        continue;
      }

      redrawMultiplayerDestructibleWall(record);
      const touchingNow = new Set();
      for (const player of players) {
        const playerKey = player.getUniqueId?.() ?? player;
        const physicsContact = didPlayerStartPhysicsContactWithWall(player, record.wall);
        const bouncedContact = isPlayerTouchingWallAfterBounce(player, record.wall);
        if (!physicsContact && !bouncedContact) continue;
        touchingNow.add(playerKey);
        if (record.touchingPlayers?.has(playerKey)) continue;
        record.lastHitAtSecondsByPlayer?.set(playerKey, system.elapsedSeconds);
        record.hits++;
        redrawMultiplayerDestructibleWall(record);
        if (record.hits >= 3) {
          record.fadeStartedAtSeconds = system.elapsedSeconds;
          record.disableCollisionAtSeconds = system.elapsedSeconds + 0.08;
          record.wall.setOpacity?.(0);
          break;
        }
      }
      record.touchingPlayers = touchingNow;
    }
  }

  function spawnMultiplayerLevelOneReplacementEnemy(runtimeScene, system) {
    if (!system || runtimeScene.getObjects("Enemy").filter((enemy) =>
      enemy.__headSpaceMultiplayerLevelOneEnemySize && enemy.getWidth() > 0
    ).length >= system.enemyLimit) return null;
    const enemy = createSceneObject(runtimeScene, "Enemy", system.layerName || "");
    if (!enemy) return null;
    const ordinal = system.nextEnemyOrdinal++;
    const player = runtimeScene.getObjects("Player")[0] || null;
    const playerSize = player ? Math.max(24, Math.min(player.getWidth(), player.getHeight())) : 90;
    const size = playerSize * (0.22 + (ordinal % 3) * 0.055);
    const ring = ordinal % 2 === 0 ? system.outerApothem * 0.5 : system.outerApothem * 0.68;
    const angle = -Math.PI / 2 + ordinal * 2.399963229728653;
    moveObjectToCenter(
      enemy,
      system.centerX + Math.cos(angle) * ring,
      system.centerY + Math.sin(angle) * ring
    );
    enemy.setSize?.(size, size);
    enemy.__headSpaceMultiplayerLevelOneEnemySize = size;
    enemy.__headSpaceMultiplayerOrbitSpeed = 92 + (ordinal % 5) * 14;
    enemy.__headSpaceMultiplayerOrbitRadius = ring;
    createImageCompanionForHost(runtimeScene, enemy, "Enemy", "EnemyImage");
    system.enemies.push(enemy);
    return enemy;
  }

  function resolveMultiplayerStationCollision(actor, system) {
    if (!actor || !system?.stationSize || actor.getWidth() <= 0) return;
    const actorRadius = Math.max(10, Math.min(actor.getWidth(), actor.getHeight()) * 0.3);
    const centerX = system.centerX;
    const centerY = system.stationCenterY;
    const size = system.stationSize;
    const actorX = actor.getCenterXInScene();
    const actorY = actor.getCenterYInScene();
    const collisions = [];

    const halfWidth = size * 0.065;
    const halfHeight = size * 0.45;
    const localX = actorX - centerX;
    const localY = actorY - centerY;
    const nearestX = clamp(localX, -halfWidth, halfWidth);
    const nearestY = clamp(localY, -halfHeight, halfHeight);
    let deltaX = localX - nearestX;
    let deltaY = localY - nearestY;
    let distance = Math.hypot(deltaX, deltaY);
    if (distance < actorRadius) {
      if (distance <= 0.001) {
        const xClearance = halfWidth - Math.abs(localX);
        const yClearance = halfHeight - Math.abs(localY);
        if (xClearance < yClearance) {
          deltaX = localX >= 0 ? 1 : -1;
          deltaY = 0;
          distance = 1;
          collisions.push({
            normalX: deltaX,
            normalY: 0,
            penetration: actorRadius + xClearance,
          });
        } else {
          deltaX = 0;
          deltaY = localY >= 0 ? 1 : -1;
          distance = 1;
          collisions.push({
            normalX: 0,
            normalY: deltaY,
            penetration: actorRadius + yClearance,
          });
        }
      } else {
        collisions.push({
          normalX: deltaX / distance,
          normalY: deltaY / distance,
          penetration: actorRadius - distance,
        });
      }
    }

    const ringConfigs = [
      { offsetY: -0.19, radiusX: 0.315, radiusY: 0.072, thickness: 0.025 },
      { offsetY: -0.02, radiusX: 0.32, radiusY: 0.074, thickness: 0.028 },
      { offsetY: 0.14, radiusX: 0.155, radiusY: 0.045, thickness: 0.021 },
    ];
    for (const ring of ringConfigs) {
      const dx = actorX - centerX;
      const dy = actorY - (centerY + size * ring.offsetY);
      const radiusX = size * ring.radiusX;
      const radiusY = size * ring.radiusY;
      const normalizedRadius = Math.hypot(dx / radiusX, dy / radiusY);
      if (normalizedRadius <= 0.001) continue;
      const boundaryX = dx / normalizedRadius;
      const boundaryY = dy / normalizedRadius;
      const surfaceDistance = Math.hypot(dx - boundaryX, dy - boundaryY);
      const contactDistance = actorRadius + size * ring.thickness;
      if (surfaceDistance >= contactDistance) continue;
      let normal = getNormalizedVector(
        boundaryX / (radiusX * radiusX),
        boundaryY / (radiusY * radiusY)
      );
      const side = normalizedRadius >= 1 ? 1 : -1;
      collisions.push({
        normalX: normal.x * side,
        normalY: normal.y * side,
        penetration: contactDistance - surfaceDistance,
      });
    }

    if (!collisions.length) return;
    const collision = collisions.reduce((best, candidate) =>
      candidate.penetration > best.penetration ? candidate : best
    );
    moveObjectToCenter(
      actor,
      actorX + collision.normalX * (collision.penetration + 1),
      actorY + collision.normalY * (collision.penetration + 1)
    );
    if (!actor.hasBehavior?.("Physics2")) return;
    const physics = actor.getBehavior("Physics2");
    const velocity = getObjectVelocity(actor);
    const inwardSpeed =
      velocity.x * collision.normalX + velocity.y * collision.normalY;
    if (inwardSpeed < 0) {
      physics.setLinearVelocityX?.(
        velocity.x - inwardSpeed * collision.normalX * 1.75
      );
      physics.setLinearVelocityY?.(
        velocity.y - inwardSpeed * collision.normalY * 1.75
      );
    }
  }

  function updateMultiplayerLevelOneFeatures(runtimeScene, system) {
    restoreLevelNinePortalVisuals(system);
    const state = sceneState.get(runtimeScene);
    const realtimeNowMs = performance.now();
    const realtimeDeltaSeconds = clamp(
      (realtimeNowMs - (system.lastRealtimeUpdateMs || realtimeNowMs)) / 1000,
      0,
      0.05
    );
    system.lastRealtimeUpdateMs = realtimeNowMs;
    const rawDeltaSeconds = runtimeScene.getElapsedTime() / 1000;
    const paused = getSceneBoolean(runtimeScene, "Paused");
    const deltaSeconds = !paused && Number.isFinite(rawDeltaSeconds) ? clamp(rawDeltaSeconds, 0, 0.05) : 0;
    system.elapsedSeconds += deltaSeconds;
    updateMultiplayerDestructibleWalls(runtimeScene, system);
    setSceneBoolean(runtimeScene, "LevelWon", false);
    const liveCompetitiveEnemies = runtimeScene.getObjects("Enemy").filter(
      (enemy) => enemy.__headSpaceMultiplayerLevelOneEnemySize && enemy.getWidth() > 0
    );
    if (liveCompetitiveEnemies.length < system.knownLiveEnemyCount) {
      const absorbedCount = system.knownLiveEnemyCount - liveCompetitiveEnemies.length;
      for (let i = 0; i < absorbedCount; i++) {
        system.enemyRespawnQueue.push(system.elapsedSeconds + system.enemyRespawnDelaySeconds);
      }
    }
    system.knownLiveEnemyCount = liveCompetitiveEnemies.length;
    while (
      system.enemyRespawnQueue.length &&
      system.enemyRespawnQueue[0] <= system.elapsedSeconds &&
      system.knownLiveEnemyCount < system.enemyLimit
    ) {
      system.enemyRespawnQueue.shift();
      if (spawnMultiplayerLevelOneReplacementEnemy(runtimeScene, system)) {
        system.knownLiveEnemyCount++;
      }
    }
    if (!state?.firstOrbFired) {
      const players = runtimeScene.getObjects("Player");
      const playerImages = runtimeScene.getObjects("PlayerImage");
      const playerHelmets = runtimeScene.getObjects("PlayerHelmet");
      players.forEach((player, index) => {
        const spawn = system.spawnSlots[index % system.spawnSlots.length];
        moveObjectToCenter(player, spawn.x, spawn.y);
        if (playerImages[index]) moveObjectToCenter(playerImages[index], spawn.x, spawn.y);
        if (playerHelmets[index]) moveObjectToCenter(playerHelmets[index], spawn.x, spawn.y);
        if (player.hasBehavior?.("Physics2")) {
          const physics = player.getBehavior("Physics2");
          physics.setLinearVelocityX?.(0);
          physics.setLinearVelocityY?.(0);
        }
      });
    }
    animateLevelNineBlackHoles(system);
    const player = runtimeScene.getObjects("Player")[0] || null;
    const arenaBounds = {
      minX: system.centerX - system.outerApothem,
      maxX: system.centerX + system.outerApothem,
      minY: system.centerY - system.outerApothem,
      maxY: system.centerY + system.outerApothem,
    };
    if (state?.firstOrbFired || system.transit) {
      updateLevelElevenPortalTeleport(
        runtimeScene,
        system,
        Math.max(deltaSeconds, realtimeDeltaSeconds)
      );
    }
    const portalTransit = system.transit;
    if (portalTransit?.player) {
      const activePortal =
        portalTransit.phase === "intake" ? portalTransit.source : portalTransit.target;
      const lightningDirection = getNormalizedVector(
        activePortal.x - portalTransit.player.getCenterXInScene(),
        activePortal.y - portalTransit.player.getCenterYInScene()
      );
      drawLevelFiveBoostLightning(
        system,
        portalTransit.player,
        {
          x: activePortal.x,
          y: activePortal.y,
          width: Math.max(120, activePortal.triggerRadius * 2.15),
          directionX: lightningDirection.x,
          directionY: lightningDirection.y,
        },
        system.elapsedSeconds
      );
    } else {
      system.lightningGraphic?.clear?.();
    }

    if (!system.projectilesArmed && hasGameplayStarted(runtimeScene)) {
      system.projectilesArmed = true;
      system.launchAccumulatorSeconds = 0;
    }
    if (system.projectilesArmed) system.launchAccumulatorSeconds += deltaSeconds;
    system.stationCenterY =
      system.centerY + Math.sin(system.elapsedSeconds * 0.72) * system.outerApothem * 0.035;
    system.station.position.y = system.stationCenterY;
    system.station.rotation = Math.sin(system.elapsedSeconds * 0.41) * 0.025;
    while (system.launchAccumulatorSeconds >= LEVEL_EIGHT_STATION_PROJECTILE_INTERVAL_SECONDS) {
      system.launchAccumulatorSeconds -= LEVEL_EIGHT_STATION_PROJECTILE_INTERVAL_SECONDS;
      launchLevelEightStationProjectile(runtimeScene, system);
    }
    if (deltaSeconds > 0) {
      updateLevelEightStationProjectiles(runtimeScene, system, deltaSeconds, arenaBounds);
    }
    const actors = ["Player", "Enemy", "SmartEnemy"].flatMap((name) => runtimeScene.getObjects(name));
    for (const actor of actors) {
      if (!actor || actor.getWidth() <= 0) continue;
      const ax = actor.getCenterXInScene();
      const ay = actor.getCenterYInScene();
      resolveMultiplayerStationCollision(actor, system);
      for (const boost of system.boosts) {
        if (
          Math.abs(actor.getCenterXInScene() - boost.x) <= boost.width * 0.48 &&
          Math.abs(actor.getCenterYInScene() - boost.y) <= boost.height * 0.8 &&
          actor.hasBehavior?.("Physics2")
        ) {
          const physics = actor.getBehavior("Physics2");
          const speed = Math.max(760, getObjectVelocity(actor).speed);
          physics.setLinearVelocityX?.(boost.directionX * speed);
          physics.setLinearVelocityY?.(boost.directionY * speed);
          if (actor.__headSpaceMultiplayerLevelOneEnemySize) {
            actor.__headSpaceMultiplayerOrbitResumeAtSeconds = system.elapsedSeconds + 1.25;
          }
        }
      }
      if (actor.__headSpaceMultiplayerLevelOneEnemySize) {
        actor.setSize?.(
          actor.__headSpaceMultiplayerLevelOneEnemySize,
          actor.__headSpaceMultiplayerLevelOneEnemySize
        );
        if (
          actor.hasBehavior?.("Physics2") &&
          system.elapsedSeconds >= (actor.__headSpaceMultiplayerOrbitResumeAtSeconds || 0)
        ) {
          const dx = actor.getCenterXInScene() - system.centerX;
          const dy = actor.getCenterYInScene() - system.centerY;
          const distance = Math.max(1, Math.hypot(dx, dy));
          const tangentX = -dy / distance;
          const tangentY = dx / distance;
          const desiredRadius =
            actor.__headSpaceMultiplayerOrbitRadius || system.outerApothem * 0.58;
          const radialCorrection = clamp((desiredRadius - distance) * 0.18, -55, 55);
          const speed = actor.__headSpaceMultiplayerOrbitSpeed;
          const physics = actor.getBehavior("Physics2");
          physics.setLinearVelocityX?.(tangentX * speed + (dx / distance) * radialCorrection);
          physics.setLinearVelocityY?.(tangentY * speed + (dy / distance) * radialCorrection);
          actor.setAngle?.((Number(actor.getAngle?.()) || 0) + deltaSeconds * 42);
        }
      }
    }
  }

  function createImageCompanionForHost(runtimeScene, hostObject, hostName, imageName) {
    if (!hostObject) return null;

    const layer = typeof hostObject.getLayer === "function" ? hostObject.getLayer() : "";
    const image = createSceneObject(runtimeScene, imageName, layer);
    if (!image) return null;

    hostObject.__headSpaceImageCompanion = image;
    image.__headSpaceCompanionHost = hostObject;
    syncImageCompanionRenderState(hostObject, image);
    moveObjectToCenter(image, hostObject.getCenterXInScene(), hostObject.getCenterYInScene());
    attachImageCompanionToHost(runtimeScene, hostObject, image, hostName, imageName);
    hideLevelTwelveEnemyCollisionHost(runtimeScene, hostObject, hostName, image);

    return image;
  }

  function disableHiddenHostLighting(hostObject) {
    if (!hostObject) return;
    for (const behaviorName of ["LightObstacleBehavior", "Light_Obstacle"]) {
      try {
        if (!hostObject.hasBehavior?.(behaviorName)) continue;
        if (typeof hostObject.removeBehavior === "function") {
          hostObject.removeBehavior(behaviorName);
        } else {
          hostObject.activateBehavior?.(behaviorName, false);
          const behavior = hostObject.getBehavior?.(behaviorName);
          behavior?.activate?.(false);
          behavior?.onDestroy?.();
        }
      } catch {
        // Optional lighting extensions must not affect collision physics.
      }
    }
    hostObject.__headSpaceHiddenHostLightingDisabled = true;
  }

  function syncMultiplayerActorLightObstacles(runtimeScene) {
    const level = getCurrentLevel(runtimeScene);
    if (!isMultiplayerGame(runtimeScene, level)) {
      const staleState = multiplayerActorLightObstacleState.get(runtimeScene);
      for (const proxy of staleState?.proxies?.values?.() || []) {
        proxy.behavior?.onDestroy?.();
      }
      multiplayerActorLightObstacleState.delete(runtimeScene);
      return;
    }

    let state = multiplayerActorLightObstacleState.get(runtimeScene);
    if (!state) {
      state = { proxies: new Map() };
      multiplayerActorLightObstacleState.set(runtimeScene, state);
    }

    const actors = ["Player", "Enemy", "SmartEnemy"]
      .flatMap((name) => runtimeScene.getObjects(name))
      .filter((actor) => actor && actor.getWidth?.() > 1);
    const liveActors = new Set(actors);
    for (const [actor, proxy] of state.proxies) {
      if (liveActors.has(actor)) continue;
      proxy.behavior?.onDestroy?.();
      state.proxies.delete(actor);
    }

    for (const actor of actors) {
      disableHiddenHostLighting(actor);
      let proxy = state.proxies.get(actor);
      if (!proxy) {
        proxy = createLevelSixMoonLightObstacle(runtimeScene);
        if (!proxy) continue;
        state.proxies.set(actor, proxy);
      }
      const name = actor.getName?.() || "";
      const visibleObject = name === "Player"
        ? actor.__headSpaceHelmetCompanion || actor.__headSpaceImageCompanion || actor
        : actor.__headSpaceImageCompanion || actor;
      const radiusScale = name === "Player" ? 0.46 : 0.43;
      const radius = Math.min(
        Number(visibleObject.getWidth?.()) || Number(actor.getWidth?.()) || 1,
        Number(visibleObject.getHeight?.()) || Number(actor.getHeight?.()) || 1
      ) * radiusScale;
      updateLevelSixMoonLightObstacle(
        proxy,
        visibleObject.getCenterXInScene?.() ?? actor.getCenterXInScene(),
        visibleObject.getCenterYInScene?.() ?? actor.getCenterYInScene(),
        radius,
        runtimeScene
      );
    }
  }

  function hideLevelTwelveEnemyCollisionHost(runtimeScene, hostObject, hostName, image) {
    if (
      !hostObject ||
      !image ||
      (hostName !== "Enemy" && hostName !== "SmartEnemy")
    ) return;
    if (
      Number(getCurrentLevel(runtimeScene)) === 3 &&
      isMultiplayerGame(runtimeScene, 3)
    ) {
      disableHiddenHostLighting(hostObject);
    }
    if (typeof hostObject.hide === "function") hostObject.hide(true);
    if (typeof hostObject.setOpacity === "function") hostObject.setOpacity(0);
    if (typeof image.enableEffect === "function") image.enableEffect("Effect2", false);
  }

  function hideLevelEightEnemyCollisionHost(runtimeScene, hostObject, hostName, image) {
    if (
      getCurrentLevel(runtimeScene) !== 8 ||
      !hostObject ||
      !image ||
      hostName !== "Enemy"
    ) return;
    if (typeof hostObject.hide === "function") hostObject.hide(true);
    if (typeof hostObject.setOpacity === "function") hostObject.setOpacity(0);
  }

  function syncImageCompanionRenderState(hostObject, image) {
    if (!hostObject || !image) return;

    if (typeof image.setLayer === "function" && typeof hostObject.getLayer === "function") {
      const hostLayer = hostObject.getLayer();
      if (typeof image.getLayer !== "function" || image.getLayer() !== hostLayer) {
        image.setLayer(hostLayer);
      }
    }

    if (typeof image.setZOrder === "function" && typeof hostObject.getZOrder === "function") {
      image.setZOrder(hostObject.getZOrder() + 1);
    }
    if (typeof image.hide === "function") image.hide(false);
    if (typeof image.setOpacity === "function") image.setOpacity(255);
  }

  function attachImageCompanionToHost(runtimeScene, hostObject, image, hostName, imageName) {
    if (!runtimeScene || !hostObject || !image) return;

    // PlayerImage and PlayerHelmet geometry is owned by the final global
    // cosmetic-composite pass. The authored PlaceImage/Sticker path uses the
    // obsolete hostWidth / 124 scale and would make that registration depend
    // on callback order. Enemy companions still use the authored helper.
    if (
      hostName === "Player" &&
      (imageName === "PlayerImage" || imageName === "PlayerHelmet")
    ) return;

    const hashtableApi = getHashtableApi();
    if (gdjs?.evtsExt__Absorbus__PlaceImage?.func && hashtableApi) {
      gdjs.evtsExt__Absorbus__PlaceImage.func(
        runtimeScene,
        hashtableApi.newFrom({ [hostName]: [hostObject] }),
        hashtableApi.newFrom({ [imageName]: [image] }),
        undefined
      );
    }

    const stickerBehavior = image.getBehavior ? image.getBehavior("Sticker") : null;
    if (stickerBehavior && typeof stickerBehavior.Stick === "function" && hashtableApi) {
      stickerBehavior.Stick(hashtableApi.newFrom({ [hostName]: [hostObject] }), undefined);
    }
  }

  function installPlayerCompositePlaceImageGuard() {
    const extension = gdjs?.evtsExt__Absorbus__PlaceImage;
    const original = extension?.func;
    if (!extension || typeof original !== "function" || original.__headSpacePlayerCompositeGuard) {
      return;
    }

    const guardedPlaceImage = function(runtimeScene, hostMap, imageMap, parentContext) {
      const hosts = typeof gdjs.objectsListsToArray === "function"
        ? gdjs.objectsListsToArray(hostMap)
        : Object.values(hostMap || {}).flat();
      const images = typeof gdjs.objectsListsToArray === "function"
        ? gdjs.objectsListsToArray(imageMap)
        : Object.values(imageMap || {}).flat();
      const isPlayerCompositeWrite =
        hosts.length > 0 &&
        images.length > 0 &&
        hosts.every((host) => host?.getName?.() === "Player") &&
        images.every((image) => {
          const name = image?.getName?.();
          return name === "PlayerImage" || name === "PlayerHelmet";
        });
      if (isPlayerCompositeWrite) return;
      return original.call(extension, runtimeScene, hostMap, imageMap, parentContext);
    };
    guardedPlaceImage.__headSpacePlayerCompositeGuard = true;
    guardedPlaceImage.__headSpaceOriginalPlaceImage = original;
    extension.func = guardedPlaceImage;
  }

  function chooseLevelFourExtraEnemyCenter(runtimeScene, player, enemySize, avoidCenters, slotIndex) {
    const bounds = getBossSpawnBounds(runtimeScene, player);
    const enemyRadius = enemySize * 0.5;
    const minX = bounds.minX + enemyRadius + BOSS_START_BOUNDARY_PADDING;
    const maxX = bounds.maxX - enemyRadius - BOSS_START_BOUNDARY_PADDING;
    const minY = bounds.minY + enemyRadius + BOSS_START_BOUNDARY_PADDING;
    const maxY = bounds.maxY - enemyRadius - BOSS_START_BOUNDARY_PADDING;
    const playerCenterX = player.getCenterXInScene();
    const playerCenterY = player.getCenterYInScene();
    const baseAngle = 0.4 + slotIndex * 0.92;
    const ringDistance = Math.max(280, player.getWidth() * 2.45 + slotIndex * 70);
    const midX = (minX + maxX) * 0.5;
    const midY = (minY + maxY) * 0.5;
    const candidates = [
      { x: minX, y: maxY },
      { x: maxX, y: maxY },
      { x: midX, y: maxY },
      { x: minX, y: midY },
      { x: maxX, y: midY },
      { x: minX + (maxX - minX) * 0.32, y: minY + (maxY - minY) * 0.58 },
      { x: minX + (maxX - minX) * 0.68, y: minY + (maxY - minY) * 0.64 },
      { x: midX, y: minY + (maxY - minY) * 0.66 },
    ];

    for (let i = 0; i < 12; i++) {
      const angle = baseAngle + (Math.PI * 2 * i) / 12;
      const distance = ringDistance + (i % 2 === 0 ? 0 : 120);
      candidates.push({
        x: clamp(playerCenterX + Math.cos(angle) * distance, minX, maxX),
        y: clamp(playerCenterY + Math.sin(angle) * distance, minY, maxY),
      });
    }

    const gridXFractions = [0.16, 0.3, 0.44, 0.58, 0.72, 0.86];
    const gridYFractions = [0.24, 0.42, 0.58, 0.74, 0.88];
    for (let yIndex = 0; yIndex < gridYFractions.length; yIndex++) {
      for (let xIndex = 0; xIndex < gridXFractions.length; xIndex++) {
        candidates.push({
          x: minX + (maxX - minX) * gridXFractions[xIndex],
          y: minY + (maxY - minY) * gridYFractions[yIndex],
        });
      }
    }

    let bestCandidate = candidates[0];
    let bestScore = -Infinity;
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      let score = Infinity;
      for (let j = 0; j < avoidCenters.length; j++) {
        const avoid = avoidCenters[j];
        const clearance = Math.hypot(candidate.x - avoid.x, candidate.y - avoid.y) - avoid.radius - enemyRadius;
        score = Math.min(score, clearance);
      }

      const edgeClearance = Math.min(candidate.x - minX, maxX - candidate.x, candidate.y - minY, maxY - candidate.y);
      const wallClearance = getLevelFourEnemyWallClearance(runtimeScene, candidate.x, candidate.y, enemyRadius);
      score = Math.min(score, edgeClearance);
      score = Math.min(score, wallClearance - 12);
      score -= getLevelFourSpawnBaitPenalty(runtimeScene, player, candidate.x, candidate.y);
      if (score > bestScore) {
        bestScore = score;
        bestCandidate = candidate;
      }
    }

    return bestCandidate;
  }

  function ensureLevelFourExtraEnemies(runtimeScene, level, state) {
    if (level !== 4 || state?.levelFourExtraEnemiesAdded) return;

    const players = runtimeScene.getObjects("Player");
    if (!players.length) return;

    const existingEnemies = runtimeScene.getObjects("Enemy");
    const enemiesToAdd = Math.max(0, LEVEL_FOUR_TARGET_ENEMY_COUNT - existingEnemies.length);
    state.levelFourExtraEnemiesAdded = true;
    if (!enemiesToAdd) return;

    const player = players[0];
    const playerWidth = Math.max(1, player.getWidth());
    const layer = typeof player.getLayer === "function" ? player.getLayer() : "";
    const boss = runtimeScene.getObjects("SmartEnemy")[0] || null;
    const avoidCenters = collectLevelFourEnemyAvoidCenters(runtimeScene, player, boss);

    for (let i = 0; i < enemiesToAdd; i++) {
      const enemy = createSceneObject(runtimeScene, "Enemy", layer);
      if (!enemy) continue;

      const sizeRatio = LEVEL_FOUR_EXTRA_ENEMY_SIZE_RATIOS[i % LEVEL_FOUR_EXTRA_ENEMY_SIZE_RATIOS.length];
      const targetSize = clamp(playerWidth * sizeRatio, 44, Math.max(46, playerWidth - 18));
      setObjectSizeAndShape(enemy, targetSize);

      const spawnCenter = chooseLevelFourExtraEnemyCenter(runtimeScene, player, targetSize, avoidCenters, i);
      moveObjectToCenter(enemy, spawnCenter.x, spawnCenter.y);

      if (typeof enemy.setZOrder === "function" && typeof player.getZOrder === "function") {
        enemy.setZOrder(player.getZOrder());
      }

      if (enemy.hasBehavior && enemy.hasBehavior("Physics2")) {
        const physics = enemy.getBehavior("Physics2");
        if (physics.setLinearVelocityX) physics.setLinearVelocityX(0);
        if (physics.setLinearVelocityY) physics.setLinearVelocityY(0);
      }

      createImageCompanionForHost(runtimeScene, enemy, "Enemy", "EnemyImage");

      avoidCenters.push({
        x: spawnCenter.x,
        y: spawnCenter.y,
        radius: targetSize * 0.8 + 88,
      });
    }
  }

  function ensureLevelFourBossNeighborBalance(runtimeScene, level, state) {
    if (level !== 4 || !state || state.levelFourBossNeighborBalanced) return;

    const boss = runtimeScene.getObjects("SmartEnemy")[0] || null;
    const player = runtimeScene.getObjects("Player")[0] || null;
    const enemies = runtimeScene
      .getObjects("Enemy")
      .filter((enemy) => enemy && Math.max(enemy.getWidth(), enemy.getHeight()) > 0);
    if (!boss || !player || enemies.length < 2) return;

    const bossX = boss.getCenterXInScene();
    const bossY = boss.getCenterYInScene();
    const bossSize = Math.max(1, boss.getWidth());
    const horizontalLimit = Math.max(190, bossSize * 1.8);
    const verticalLimit = Math.max(320, bossSize * 3);
    let blockingNeighbor = null;
    let blockingScore = Infinity;

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const dx = Math.abs(enemy.getCenterXInScene() - bossX);
      const dy = bossY - enemy.getCenterYInScene();
      if (dy <= 0 || dy > verticalLimit || dx > horizontalLimit) continue;

      const score = dy + dx * 1.7;
      if (score < blockingScore) {
        blockingNeighbor = enemy;
        blockingScore = score;
      }
    }

    if (!blockingNeighbor) return;

    const edibleNeighborSize = clamp(
      bossSize * LEVEL_FOUR_BOSS_NEIGHBOR_SIZE_RATIO,
      42,
      Math.max(44, bossSize * LEVEL_FOUR_ABSORB_RATIO - 12)
    );
    setObjectSizeAndShape(blockingNeighbor, edibleNeighborSize);

    let relocatedLargeEnemy = null;
    let farthestDistance = -Infinity;
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (enemy === blockingNeighbor) continue;
      const distance = Math.hypot(
        enemy.getCenterXInScene() - bossX,
        enemy.getCenterYInScene() - bossY
      );
      if (distance > farthestDistance) {
        relocatedLargeEnemy = enemy;
        farthestDistance = distance;
      }
    }

    if (!relocatedLargeEnemy) return;

    const largeEnemySize = Math.max(
      bossSize + 14,
      bossSize * LEVEL_FOUR_RELOCATED_LARGE_ENEMY_SIZE_RATIO
    );
    const avoidCenters = collectLevelFourEnemyAvoidCenters(runtimeScene, player, boss);
    const largeEnemyCenter = chooseLevelFourExtraEnemyCenter(
      runtimeScene,
      player,
      largeEnemySize,
      avoidCenters,
      47
    );
    setObjectSizeAndShape(relocatedLargeEnemy, largeEnemySize);
    moveObjectToCenter(relocatedLargeEnemy, largeEnemyCenter.x, largeEnemyCenter.y);

    for (const enemy of [blockingNeighbor, relocatedLargeEnemy]) {
      if (!enemy.hasBehavior || !enemy.hasBehavior("Physics2")) continue;
      const physics = enemy.getBehavior("Physics2");
      if (physics.setLinearVelocityX) physics.setLinearVelocityX(0);
      if (physics.setLinearVelocityY) physics.setLinearVelocityY(0);
      if (physics.setAngularVelocity) physics.setAngularVelocity(0);
    }

    state.levelFourBossNeighborBalanced = true;
  }

  function getActiveRegularEnemies(runtimeScene) {
    return runtimeScene
      .getObjects("Enemy")
      .filter(
        (enemy) =>
          enemy &&
          !isLevelTwelveCosmicAlien(enemy) &&
          (!enemy.getWidth || enemy.getWidth() > 0)
      );
  }

  function getBossRespawnEnemySize(player, boss, sizeBandIndex = 0) {
    const playerSize = Math.max(1, player?.getWidth ? player.getWidth() : 1);
    const bossSize = Math.max(1, boss?.getWidth ? boss.getWidth() : 1);
    const smallerActorSize = Math.min(playerSize, bossSize);
    const hardMax = smallerActorSize - 10;
    if (!Number.isFinite(hardMax) || hardMax <= 8) return null;

    const high = Math.max(8, Math.min(hardMax, smallerActorSize * BOSS_RESPAWN_ENEMY_MAX_RATIO));
    const low = Math.min(high, Math.max(BOSS_RESPAWN_ENEMY_MIN_SIZE, smallerActorSize * BOSS_RESPAWN_ENEMY_MIN_RATIO));
    const bandCount = Math.max(1, REGULAR_ENEMY_RESPAWN_BATCH_COUNT);
    const bandIndex = clamp(Math.floor(sizeBandIndex), 0, bandCount - 1);
    const bandStart = bandIndex / bandCount;
    const bandEnd = (bandIndex + 1) / bandCount;
    const bandProgress = bandStart + (0.16 + Math.random() * 0.68) * (bandEnd - bandStart);
    return low + bandProgress * Math.max(0, high - low);
  }

  function getPlanetKeepOutRadiusForObjectRadius(runtimeScene, planet, objectRadius) {
    const level = getCurrentLevel(runtimeScene);
    const primaryLevelSixPlanet = level === 6 ? getLevelSixPrimaryPlanet(runtimeScene, false) : null;
    const planetRadius =
      level === 6 && planet === primaryLevelSixPlanet
        ? getLevelSixPlanetCoreRadius(runtimeScene, planet)
        : getApproxObjectRadius(planet, 24);
    const clearance = level === 6 ? LEVEL_SIX_PLANET_START_CLEARANCE : 34;
    return planetRadius + objectRadius + clearance;
  }

  function getBossRespawnPlanetBlockers(runtimeScene) {
    const planets = getPlanetObjects(runtimeScene);
    const level = getCurrentLevel(runtimeScene);
    if (level === 7) {
      const system = levelSevenPlanetSystemState.get(runtimeScene);
      const secondaryPlanet = system?.secondary?.collisionProxy || null;
      if (secondaryPlanet) planets.push(secondaryPlanet);
      const moons = system?.moons || [];
      for (let i = 0; i < moons.length; i++) {
        if (moons[i].collisionProxy) planets.push(moons[i].collisionProxy);
      }
    }
    if (level === 9) {
      const levelNinePlanets = levelNineBlackHoleSystemState.get(runtimeScene)?.planets || [];
      for (let i = 0; i < levelNinePlanets.length; i++) {
        if (levelNinePlanets[i].collisionProxy) planets.push(levelNinePlanets[i].collisionProxy);
      }
    }
    if (usesLevelTenRuntime(runtimeScene, level)) {
      const levelTenBodies = levelTenSolarSystemState.get(runtimeScene)?.bodies || [];
      for (let i = 0; i < levelTenBodies.length; i++) {
        if (levelTenBodies[i].collisionProxy) planets.push(levelTenBodies[i].collisionProxy);
      }
    }
    if (usesLevelElevenConfiguration(level)) {
      const system = levelElevenCelestialSystemState.get(runtimeScene);
      const bodies = system
        ? [
            system.planet,
            ...(system.planets || []),
            ...(system.stations || []),
            ...(system.triexos || []),
            ...(system.blackHoles || []),
          ]
        : [];
      for (let i = 0; i < bodies.length; i++) {
        if (bodies[i]?.collisionProxy) planets.push(bodies[i].collisionProxy);
      }
    }
    if (level === 4 && isMultiplayerGame(runtimeScene, level)) {
      const system = multiplayerLevelFourHoneycombState.get(runtimeScene);
      const bodies = system
        ? [
            ...(system.planets || []),
            ...(system.stations || []),
            ...(system.triexos || []),
          ]
        : [];
      for (const body of bodies) {
        if (body?.collisionProxy) planets.push(body.collisionProxy);
      }
    }
    return planets;
  }

  function getRespawnArenaInteriorClearance(runtimeScene, x, y, radius) {
    const wallsCenter = getWallsShapeCenter(runtimeScene);
    const walls = runtimeScene.getObjects("Walls");
    if (!wallsCenter || !walls.length) return Infinity;
    let minimumClearance = Infinity;
    for (let i = 0; i < walls.length; i++) {
      const segment = getWallSegmentData(walls[i]);
      if (!segment) continue;
      let inwardX = wallsCenter.x - segment.centerX;
      let inwardY = wallsCenter.y - segment.centerY;
      const inwardMagnitude = Math.hypot(inwardX, inwardY);
      if (inwardMagnitude <= 0.001) continue;
      inwardX /= inwardMagnitude;
      inwardY /= inwardMagnitude;
      const signedInteriorDistance =
        (x - segment.centerX) * inwardX + (y - segment.centerY) * inwardY;
      const clearance =
        signedInteriorDistance - segment.halfThickness - Math.max(0, radius) - 12;
      minimumClearance = Math.min(minimumClearance, clearance);
    }
    return minimumClearance;
  }

  function chooseBossRespawnEnemyCenter(runtimeScene, enemySize, player, boss, additionalBlockers = []) {
    const bounds = getBossSpawnBounds(runtimeScene, player || boss);
    const enemyRadius = enemySize * 0.5;
    const minX = bounds.minX + enemyRadius + BOSS_RESPAWN_ENEMY_ARENA_PADDING;
    const maxX = bounds.maxX - enemyRadius - BOSS_RESPAWN_ENEMY_ARENA_PADDING;
    const minY = bounds.minY + enemyRadius + BOSS_RESPAWN_ENEMY_ARENA_PADDING;
    const maxY = bounds.maxY - enemyRadius - BOSS_RESPAWN_ENEMY_ARENA_PADDING;
    const planets = getBossRespawnPlanetBlockers(runtimeScene);
    const blockers = [player, boss, ...additionalBlockers].filter(Boolean);
    let best = null;
    let bestScore = -Infinity;

    for (let i = 0; i < 64; i++) {
      const x = minX <= maxX ? minX + Math.random() * (maxX - minX) : (minX + maxX) * 0.5;
      const y = minY <= maxY ? minY + Math.random() * (maxY - minY) : (minY + maxY) * 0.5;
      let score = Math.random() * 40;
      const arenaClearance = getRespawnArenaInteriorClearance(runtimeScene, x, y, enemyRadius);
      if (arenaClearance < 0) continue;
      score += Math.min(arenaClearance, 320) * 0.14;

      for (let j = 0; j < blockers.length; j++) {
        const blocker = blockers[j];
        const clearance =
          Math.hypot(x - blocker.getCenterXInScene(), y - blocker.getCenterYInScene()) -
          getApproxObjectRadius(blocker, 18) -
          enemyRadius -
          110;
        if (clearance < 0) {
          score = -Infinity;
          break;
        }
        score += Math.min(clearance, 520) * 0.12;
      }
      if (score === -Infinity) continue;

      for (let j = 0; j < planets.length; j++) {
        const planet = planets[j];
        const clearance =
          Math.hypot(x - planet.getCenterXInScene(), y - planet.getCenterYInScene()) -
          getPlanetKeepOutRadiusForObjectRadius(runtimeScene, planet, enemyRadius);
        if (clearance < 0) {
          score = -Infinity;
          break;
        }
        score += Math.min(clearance, 380) * 0.08;
      }
      if (score > bestScore) {
        bestScore = score;
        best = { x, y, bounds };
      }
    }

    return (
      best || {
        x: clampWithinRange((bounds.minX + bounds.maxX) * 0.5, minX, maxX),
        y: clampWithinRange((bounds.minY + bounds.maxY) * 0.5, minY, maxY),
        bounds,
      }
    );
  }

  function getRegularRespawnEnemySize(player, boss, sizeBandIndex = 0) {
    if (boss) {
      const bossRelativeSize = getBossRespawnEnemySize(player, boss, sizeBandIndex);
      if (Number.isFinite(bossRelativeSize) && bossRelativeSize > 0) return bossRelativeSize;
    }
    const playerSize = Math.max(1, player?.getWidth ? player.getWidth() : 1);
    const hardMax = Math.max(8, playerSize - 10);
    const minimumSize = Math.min(BOSS_RESPAWN_ENEMY_MIN_SIZE, hardMax);
    const ratio =
      REGULAR_ENEMY_RESPAWN_SIZE_RATIOS[
        Math.abs(Math.floor(sizeBandIndex)) % REGULAR_ENEMY_RESPAWN_SIZE_RATIOS.length
      ];
    return clamp(playerSize * ratio, minimumSize, hardMax);
  }

  function spawnRegularRespawnEnemy(runtimeScene, level, player, boss, targetSize, additionalBlockers = []) {
    if (!Number.isFinite(targetSize) || targetSize <= 0) return null;

    const layer = typeof player.getLayer === "function" ? player.getLayer() : "";
    const enemy = createSceneObject(runtimeScene, "Enemy", layer);
    if (!enemy) return null;

    setObjectSizeAndShape(enemy, targetSize);
    const spawnCenter = chooseBossRespawnEnemyCenter(
      runtimeScene,
      targetSize,
      player,
      boss,
      additionalBlockers
    );
    moveObjectToCenter(enemy, spawnCenter.x, spawnCenter.y);

    if (typeof enemy.setZOrder === "function" && typeof player.getZOrder === "function") {
      enemy.setZOrder(player.getZOrder());
    }

    clearObjectMotion(enemy);
    const planets = getBossRespawnPlanetBlockers(runtimeScene);
    if (planets.length) {
      moveObjectOutOfPlanetStartOverlap(runtimeScene, enemy, planets, spawnCenter.bounds, Math.floor(Math.random() * 1000));
    }

    if (enemy.hasBehavior && enemy.hasBehavior("Physics2")) {
      const physics = enemy.getBehavior("Physics2");
      const driftAngle = Math.random() * Math.PI * 2;
      const driftSpeed = level === 6 ? 58 : 34;
      if (physics.setLinearVelocityX) physics.setLinearVelocityX(Math.cos(driftAngle) * driftSpeed);
      if (physics.setLinearVelocityY) physics.setLinearVelocityY(Math.sin(driftAngle) * driftSpeed);
    }

    createImageCompanionForHost(runtimeScene, enemy, "Enemy", "EnemyImage");
    return enemy;
  }

  function spawnRegularEnemyBatch(runtimeScene, level, count, sizeBandOffset = 0) {
    const player = runtimeScene.getObjects("Player")[0] || null;
    const boss = runtimeScene.getObjects("SmartEnemy")[0] || null;
    if (!player) return 0;
    const sizeReferenceBoss = isBossLevel(level) ? boss : null;
    const blockers = getActiveRegularEnemies(runtimeScene).slice();
    blockers.push(...runtimeScene.getObjects("Enemy").filter(isLevelTwelveCosmicAlien));
    let spawnedCount = 0;
    for (let i = 0; i < count; i++) {
      const targetSize = getRegularRespawnEnemySize(player, sizeReferenceBoss, sizeBandOffset + i);
      const spawnedEnemy = spawnRegularRespawnEnemy(
        runtimeScene,
        level,
        player,
        boss,
        targetSize,
        blockers
      );
      if (!spawnedEnemy) break;
      blockers.push(spawnedEnemy);
      spawnedCount++;
    }
    return spawnedCount;
  }

  function updateRegularEnemyRespawns(runtimeScene, level, state, elapsedSeconds) {
    if (Number(level) === 2 && isMultiplayerGame(runtimeScene, level)) return;
    if (isClearAllEnemiesLevel(level)) {
      if (state) {
        state.zeroRegularEnemiesSinceSeconds = null;
        state.lowRegularEnemiesSinceSeconds = null;
        state.zeroEnemyWaveStartedAtSeconds = null;
        state.zeroEnemyWaveSpawnedCount = 0;
      }
      return;
    }

    if (
      !isPlayableLevel(level) ||
      !state ||
      !Number.isFinite(state.timerStartedAtMs) ||
      !Number.isFinite(elapsedSeconds)
    ) return;

    let enemyCount = getActiveRegularEnemies(runtimeScene).length;
    if (!Number.isFinite(state.zeroEnemyWaveStartedAtSeconds)) {
      if (enemyCount < 1) {
        if (!Number.isFinite(state.zeroRegularEnemiesSinceSeconds)) {
          state.zeroRegularEnemiesSinceSeconds = elapsedSeconds;
        }
        if (
          elapsedSeconds - state.zeroRegularEnemiesSinceSeconds >=
          REGULAR_ENEMY_ZERO_COUNT_DELAY_SECONDS
        ) {
          state.zeroEnemyWaveStartedAtSeconds = elapsedSeconds;
          state.zeroEnemyWaveSpawnedCount = 0;
        }
      } else {
        state.zeroRegularEnemiesSinceSeconds = null;
      }
    }

    if (Number.isFinite(state.zeroEnemyWaveStartedAtSeconds)) {
      const spawnInterval =
        REGULAR_ENEMY_RESPAWN_BATCH_COUNT > 1
          ? REGULAR_ENEMY_ZERO_WAVE_SPAN_SECONDS / (REGULAR_ENEMY_RESPAWN_BATCH_COUNT - 1)
          : 0;
      const waveElapsed = Math.max(0, elapsedSeconds - state.zeroEnemyWaveStartedAtSeconds);
      const dueCount = Math.min(
        REGULAR_ENEMY_RESPAWN_BATCH_COUNT,
        spawnInterval > 0 ? 1 + Math.floor((waveElapsed + 0.0001) / spawnInterval) : 1
      );
      const requestedCount = Math.max(0, dueCount - state.zeroEnemyWaveSpawnedCount);
      if (requestedCount > 0) {
        const spawnedCount = spawnRegularEnemyBatch(
          runtimeScene,
          level,
          requestedCount,
          state.zeroEnemyWaveSpawnedCount
        );
        state.zeroEnemyWaveSpawnedCount += spawnedCount;
      }
      if (state.zeroEnemyWaveSpawnedCount >= REGULAR_ENEMY_RESPAWN_BATCH_COUNT) {
        state.zeroEnemyWaveStartedAtSeconds = null;
        state.zeroEnemyWaveSpawnedCount = 0;
        state.zeroRegularEnemiesSinceSeconds = null;
      }
    }

    enemyCount = getActiveRegularEnemies(runtimeScene).length;
    if (enemyCount < REGULAR_ENEMY_LOW_COUNT_THRESHOLD) {
      if (!Number.isFinite(state.lowRegularEnemiesSinceSeconds)) {
        state.lowRegularEnemiesSinceSeconds = elapsedSeconds;
      }
      if (
        elapsedSeconds - state.lowRegularEnemiesSinceSeconds >=
        REGULAR_ENEMY_LOW_COUNT_DELAY_SECONDS
      ) {
        spawnRegularEnemyBatch(runtimeScene, level, REGULAR_ENEMY_RESPAWN_BATCH_COUNT);
        state.lowRegularEnemiesSinceSeconds = null;
      }
    } else {
      state.lowRegularEnemiesSinceSeconds = null;
    }

  }

  function createMissingBoss(runtimeScene, level, state) {
    const players = runtimeScene.getObjects("Player");
    if (!players.length) return null;

    trimObjectsToCount(runtimeScene, "SmartEnemyImage", 0);
    trimObjectsToCount(runtimeScene, "SmartEnemyPointer", 0);

    const player = players[0];
    const playerWidth = Math.max(1, player.getWidth());
    const targetBossSize = getBossTargetSize(level, playerWidth);
    const layer = typeof player.getLayer === "function" ? player.getLayer() : "";
    const boss = createSceneObject(runtimeScene, "SmartEnemy", layer);
    if (!boss) return null;

    setObjectSizeAndShape(boss, targetBossSize);
    moveObjectToCenter(boss, player.getCenterXInScene(), player.getCenterYInScene());
    if (typeof boss.setZOrder === "function" && typeof player.getZOrder === "function") {
      boss.setZOrder(player.getZOrder());
    }

    if (boss.hasBehavior && boss.hasBehavior("Physics2")) {
      const physics = boss.getBehavior("Physics2");
      if (physics.setLinearVelocityX) physics.setLinearVelocityX(0);
      if (physics.setLinearVelocityY) physics.setLinearVelocityY(0);
    }

    if (state) {
      state.bossTargetSize = targetBossSize;
      state.bossSizeAdjusted = false;
      state.bossSpawnAdjusted = false;
      state.bossBootstrapComplete = true;
      state.bossHeadStartStartedAtSeconds = null;
      state.bossAggroStartedAtSeconds = null;
      state.smartEnemyActivated = false;
      state.bossLockedTarget = null;
      state.bossLockedTargetUntilSeconds = -Infinity;
      state.bossIntentMode = null;
      state.bossIntentTarget = null;
      state.bossIntentUntilSeconds = -Infinity;
      state.bossNextDecisionAtSeconds = -Infinity;
      state.bossHeadingX = 0;
      state.bossHeadingY = 0;
      state.bossAvoidanceTurnSign = 0;
      state.bossAvoidanceObstacleKey = null;
      state.bossHazardUntilSeconds = -Infinity;
      state.bossWallEscapeUntilSeconds = -Infinity;
      state.bossEscapeThreat = null;
      state.bossEscapeThreatUntilSeconds = -Infinity;
    }

    setSceneBoolean(runtimeScene, "LevelWon", false);
    setSceneBoolean(runtimeScene, "LevelLost", false);
    return boss;
  }

  function enforceSingleBoss(runtimeScene) {
    const smartEnemies = runtimeScene.getObjects("SmartEnemy");
    if (!smartEnemies.length) {
      trimObjectsToCount(runtimeScene, "SmartEnemyImage", 0);
      trimObjectsToCount(runtimeScene, "SmartEnemyPointer", 0);
      return null;
    }

    let boss = smartEnemies[0];
    for (let i = 1; i < smartEnemies.length; i++) {
      const candidate = smartEnemies[i];
      if (candidate.getWidth() > boss.getWidth()) boss = candidate;
    }

    for (let i = 0; i < smartEnemies.length; i++) {
      const smartEnemy = smartEnemies[i];
      if (smartEnemy !== boss) smartEnemy.deleteFromScene(runtimeScene);
    }

    trimObjectsToCount(runtimeScene, "SmartEnemyPointer", 1);
    return boss;
  }

  function ensureBossImage(runtimeScene, boss) {
    if (!boss) return null;

    const existingImages = runtimeScene.getObjects("SmartEnemyImage");
    if (existingImages.length) {
      const hostCenterX = boss.getCenterXInScene();
      const hostCenterY = boss.getCenterYInScene();
      let nearestImage = existingImages[0];
      let nearestDistSq = Infinity;
      for (let i = 0; i < existingImages.length; i++) {
        const image = existingImages[i];
        const dx = image.getCenterXInScene() - hostCenterX;
        const dy = image.getCenterYInScene() - hostCenterY;
        const distSq = dx * dx + dy * dy;
        if (distSq < nearestDistSq) {
          nearestDistSq = distSq;
          nearestImage = image;
        }
      }
      for (const image of existingImages) {
        if (image !== nearestImage && image.deleteFromScene) image.deleteFromScene(runtimeScene);
      }
      if (nearestImage.hide) nearestImage.hide(false);
      if (nearestImage.setOpacity) nearestImage.setOpacity(255);
      return nearestImage;
    }

    const createdImage = createImageCompanionForHost(runtimeScene, boss, "SmartEnemy", "SmartEnemyImage");
    if (createdImage) {
      if (createdImage.hide) createdImage.hide(false);
      if (createdImage.setOpacity) createdImage.setOpacity(255);
      return createdImage;
    }

    if (boss.hide) boss.hide(false);
    if (boss.setOpacity) boss.setOpacity(255);
    return null;
  }

  function ensureBossEnemy(runtimeScene, level, state) {
    if (removeHeadToHeadBossObjects(runtimeScene, level)) {
      if (state) {
        state.bossBootstrapComplete = true;
        state.bossSizeAdjusted = false;
      }
      return null;
    }
    if (!isBossLevel(level)) return null;

    if (getSceneBoolean(runtimeScene, "LevelWon") || getSceneBoolean(runtimeScene, "LevelLost")) {
      return runtimeScene
        .getObjects("SmartEnemy")
        .find((boss) => boss && boss.getWidth?.() > 0.5 && boss.getHeight?.() > 0.5) || null;
    }

    const existingBosses = runtimeScene.getObjects("SmartEnemy");
    const elapsedSeconds = state ? getElapsedSecondsForState(state) : 0;
    const missingDuringBootstrap =
      existingBosses.length === 0 && isWithinBossBootstrapRescueWindow(state);
    const missingDuringHeadStartProtection =
      existingBosses.length === 0 && isBossAbsorbProtectionActive(state, level, elapsedSeconds);
    if (!state?.bossBootstrapComplete || missingDuringBootstrap || missingDuringHeadStartProtection) {
      if (existingBosses.length) {
        state.bossBootstrapComplete = true;
      } else {
        createMissingBoss(runtimeScene, level, state);
      }
    }

    const boss = enforceSingleBoss(runtimeScene);
    if (!boss) return null;
    ensureBossImage(runtimeScene, boss);

    if (state && (!Number.isFinite(state.bossTargetSize) || state.bossTargetSize <= 0)) {
      const players = runtimeScene.getObjects("Player");
      const playerWidth = players.length ? Math.max(1, players[0].getWidth()) : 140;
      state.bossTargetSize = getBossTargetSize(level, playerWidth);
    }

    const targetBossSize =
      state && Number.isFinite(state.bossTargetSize) && state.bossTargetSize > 0
        ? state.bossTargetSize
        : getBossTargetSize(level, 140);
    const shouldNormalizeBossSize = !state || !state.bossSizeAdjusted;
    if (shouldNormalizeBossSize && Math.abs(boss.getWidth() - targetBossSize) > 1) {
      setObjectSizeAndShape(boss, targetBossSize);
    }
    if (state) state.bossSizeAdjusted = true;

    ensureBossSpawnDistance(runtimeScene, boss, level, state);

    if (!areNativeBossSettingsActive()) {
      try {
        const vars = boss.getVariables();
        vars.get("CanMove").setBoolean(false);
        vars.get("ChaseSmallerEnemies").setBoolean(false);
        vars.get("AvoidLargerEnemies").setBoolean(false);
      } catch {
        // Ignore missing runtime variables.
      }
    }

    return boss;
  }

  function getLevelSixEnemySeparation(runtimeScene, enemy, enemyRadius) {
    const enemies = runtimeScene.getObjects("Enemy");
    const ex = enemy.getCenterXInScene();
    const ey = enemy.getCenterYInScene();
    const enemyId = typeof enemy.getUniqueId === "function" ? enemy.getUniqueId() : 0;
    let separationX = 0;
    let separationY = 0;

    for (let i = 0; i < enemies.length; i++) {
      const other = enemies[i];
      if (!other || other === enemy || other.getWidth() <= 0) continue;

      const otherRadius = getApproxObjectRadius(other, 12);
      const desiredSpacing = enemyRadius + otherRadius + LEVEL_SIX_ENEMY_SPIRAL_SPACING_PADDING;
      let dx = ex - other.getCenterXInScene();
      let dy = ey - other.getCenterYInScene();
      let distance = Math.hypot(dx, dy);
      if (distance >= desiredSpacing) continue;

      if (distance <= 0.001) {
        const otherId = typeof other.getUniqueId === "function" ? other.getUniqueId() : i + 1;
        const fallbackAngle = (enemyId * 0.73 + otherId * 1.17) % (Math.PI * 2);
        dx = Math.cos(fallbackAngle);
        dy = Math.sin(fallbackAngle);
        distance = 1;
      }

      const pressure = clamp(1 - distance / Math.max(1, desiredSpacing), 0, 1);
      separationX += (dx / distance) * pressure * pressure;
      separationY += (dy / distance) * pressure * pressure;
    }

    const magnitude = Math.hypot(separationX, separationY);
    if (magnitude > 1) {
      separationX /= magnitude;
      separationY /= magnitude;
    }
    return { x: separationX, y: separationY };
  }

  function applyLevelSixEnemySpiralOrbit(runtimeScene, enemy, physics, slotIndex, totalSlots, frameScale) {
    if (!runtimeScene || !enemy || !physics || getCurrentLevel(runtimeScene) !== 6) return false;

    const elapsedSeconds = performance.now() / 1000;
    const enemyRadius = getApproxObjectRadius(enemy, 12);
    const pose = getLevelSixEnemySpiralPose(runtimeScene, slotIndex, totalSlots, enemyRadius, elapsedSeconds);
    if (!pose) return false;

    const ex = enemy.getCenterXInScene();
    const ey = enemy.getCenterYInScene();
    const velocity = getObjectVelocity(enemy);
    const toTargetX = pose.targetX - ex;
    const toTargetY = pose.targetY - ey;
    const distanceFromPlanet = Math.max(1, Math.hypot(ex - pose.planetX, ey - pose.planetY));
    const radialX = (ex - pose.planetX) / distanceFromPlanet;
    const radialY = (ey - pose.planetY) / distanceFromPlanet;
    const tangentX = -radialY;
    const tangentY = radialX;
    const tangentialVelocity = velocity.x * tangentX + velocity.y * tangentY;
    const separation = getLevelSixEnemySeparation(runtimeScene, enemy, enemyRadius);

    let fx = toTargetX * LEVEL_SIX_ENEMY_SPIRAL_POSITION_SPRING - velocity.x * LEVEL_SIX_ENEMY_SPIRAL_DAMPING;
    let fy = toTargetY * LEVEL_SIX_ENEMY_SPIRAL_POSITION_SPRING - velocity.y * LEVEL_SIX_ENEMY_SPIRAL_DAMPING;
    fx += tangentX * (pose.targetOrbitSpeed - tangentialVelocity) * LEVEL_SIX_ENEMY_SPIRAL_TANGENTIAL_GAIN;
    fy += tangentY * (pose.targetOrbitSpeed - tangentialVelocity) * LEVEL_SIX_ENEMY_SPIRAL_TANGENTIAL_GAIN;
    fx += separation.x * LEVEL_SIX_ENEMY_SPIRAL_SPACING_FORCE;
    fy += separation.y * LEVEL_SIX_ENEMY_SPIRAL_SPACING_FORCE;

    if (distanceFromPlanet < pose.safeRadius) {
      const overlapFactor = clamp(1 - distanceFromPlanet / Math.max(1, pose.safeRadius), 0, 1);
      const repel = (1800 + pose.planetRadius * 18) * overlapFactor * overlapFactor;
      fx += radialX * repel;
      fy += radialY * repel;
    }

    const magnitude = Math.hypot(fx, fy);
    if (magnitude >= 0.001) {
      const forceScale =
        magnitude > LEVEL_SIX_ENEMY_SPIRAL_MAX_FORCE ? LEVEL_SIX_ENEMY_SPIRAL_MAX_FORCE / magnitude : 1;
      physics.applyForce(
        fx * forceScale * frameScale,
        fy * forceScale * frameScale,
        physics.getMassCenterX(),
        physics.getMassCenterY()
      );
    }

    if (physics.setLinearVelocityX && physics.setLinearVelocityY) {
      const radialError = pose.desiredRadius - distanceFromPlanet;
      const maxRadialSpeed = pose.targetOrbitSpeed * LEVEL_SIX_ENEMY_SPIRAL_RADIAL_SPEED_RATIO;
      const radialCorrectionSpeed = clamp(radialError * 1.8, -maxRadialSpeed, maxRadialSpeed);
      const desiredVx =
        tangentX * pose.targetOrbitSpeed +
        radialX * radialCorrectionSpeed +
        separation.x * pose.targetOrbitSpeed * LEVEL_SIX_ENEMY_SPIRAL_SPACING_VELOCITY_FACTOR;
      const desiredVy =
        tangentY * pose.targetOrbitSpeed +
        radialY * radialCorrectionSpeed +
        separation.y * pose.targetOrbitSpeed * LEVEL_SIX_ENEMY_SPIRAL_SPACING_VELOCITY_FACTOR;
      const tangentialProgress = tangentialVelocity / Math.max(1, pose.targetOrbitSpeed);
      const baseBlend =
        tangentialProgress < 0.55
          ? LEVEL_SIX_ENEMY_SPIRAL_RECOVERY_BLEND
          : LEVEL_SIX_ENEMY_SPIRAL_VELOCITY_BLEND;
      const velocityBlend = clamp(baseBlend * frameScale, 0.08, 0.58);
      physics.setLinearVelocityX(velocity.x + (desiredVx - velocity.x) * velocityBlend);
      physics.setLinearVelocityY(velocity.y + (desiredVy - velocity.y) * velocityBlend);
    }

    capPhysicsSpeed(physics, pose.targetOrbitSpeed * 1.24);
    return true;
  }

  function findNearestObject(originX, originY, objects, predicate) {
    let best = null;
    let bestDistanceSq = Infinity;

    for (let i = 0; i < objects.length; i++) {
      const object = objects[i];
      if (predicate && !predicate(object)) continue;
      const dx = object.getCenterXInScene() - originX;
      const dy = object.getCenterYInScene() - originY;
      const distanceSq = dx * dx + dy * dy;
      if (distanceSq < bestDistanceSq) {
        bestDistanceSq = distanceSq;
        best = object;
      }
    }

    return best;
  }

  function capPhysicsSpeed(physics, maxSpeed) {
    if (!physics.getLinearVelocityX || !physics.getLinearVelocityY) return;
    if (!physics.setLinearVelocityX || !physics.setLinearVelocityY) return;

    const vx = physics.getLinearVelocityX();
    const vy = physics.getLinearVelocityY();
    const speed = Math.hypot(vx, vy);
    if (!Number.isFinite(speed) || speed <= maxSpeed || speed <= 0.001) return;

    const scale = maxSpeed / speed;
    physics.setLinearVelocityX(vx * scale);
    physics.setLinearVelocityY(vy * scale);
  }

  function getObjectVelocity(object) {
    if (!object || !object.hasBehavior || !object.hasBehavior("Physics2")) {
      return { x: 0, y: 0, speed: 0 };
    }

    const physics = object.getBehavior("Physics2");
    const vx = physics.getLinearVelocityX ? physics.getLinearVelocityX() : 0;
    const vy = physics.getLinearVelocityY ? physics.getLinearVelocityY() : 0;
    const safeX = Number.isFinite(vx) ? vx : 0;
    const safeY = Number.isFinite(vy) ? vy : 0;
    return { x: safeX, y: safeY, speed: Math.hypot(safeX, safeY) };
  }

  function getApproxObjectRadius(object, minimum = 0) {
    if (!object) return minimum;

    const width = object.getWidth ? object.getWidth() : 0;
    const height = object.getHeight ? object.getHeight() : 0;
    return Math.max(minimum, Math.max(width, height) * 0.5);
  }

  function getSmartEnemyTuning(level) {
    if (!isBossLevel(level)) {
      return {
        linearDamping: SMART_ENEMY_LINEAR_DAMPING,
        steerForce: SMART_ENEMY_STEER_FORCE,
        evadeForce: SMART_ENEMY_EVADE_FORCE,
        maxSpeed: SMART_ENEMY_MAX_SPEED,
        senseRadius: SMART_ENEMY_SENSE_RADIUS,
        absorbRatio: SMART_ENEMY_ABSORB_RATIO,
        threatRatio: SMART_ENEMY_THREAT_RATIO,
        playerHuntRatio: SMART_ENEMY_PLAYER_HUNT_RATIO,
        pursuitLeadScale: 0.18,
        maxLeadSeconds: 0.35,
        playerAggroBonus: 0,
        largeEnemyAvoidanceScale: 1,
        largeEnemyAvoidanceSenseRadiusMultiplier: 0.85,
        largeEnemyAvoidanceLeadScale: 0,
        largeEnemyAvoidanceTargetPenaltyScale: 1,
        largeEnemyAvoidanceRoutePenaltyScale: 1,
        largeEnemyAvoidanceSideStepScale: 0.35,
      };
    }

    if (level === 4) {
      return {
        linearDamping: SMART_ENEMY_LINEAR_DAMPING + 0.2,
        steerForce: SMART_ENEMY_STEER_FORCE * LEVEL_FOUR_BOSS_STEER_SCALE,
        evadeForce: SMART_ENEMY_EVADE_FORCE * LEVEL_FOUR_BOSS_EVADE_SCALE,
        maxSpeed: BOSS_REFERENCE_MAX_SPEED - LEVEL_FOUR_BOSS_SPEED_OFFSET,
        senseRadius: SMART_ENEMY_SENSE_RADIUS + 120,
        absorbRatio: LEVEL_FOUR_ABSORB_RATIO,
        threatRatio: LEVEL_FOUR_THREAT_RATIO,
        playerHuntRatio: 1.2,
        pursuitLeadScale: 0.14,
        maxLeadSeconds: 0.16,
        playerAggroBonus: -90,
        largeEnemyAvoidanceScale: 1.85,
        largeEnemyAvoidanceSenseRadiusMultiplier: 1.12,
        largeEnemyAvoidanceLeadScale: 0.18,
        largeEnemyAvoidanceTargetPenaltyScale: 1.18,
        largeEnemyAvoidanceRoutePenaltyScale: 1.28,
        largeEnemyAvoidanceSideStepScale: 0.52,
      };
    }

    const difficulty = getBossDifficultyScale(level);
    return {
      linearDamping: clamp(SMART_ENEMY_LINEAR_DAMPING + 0.02, 0.22, SMART_ENEMY_LINEAR_DAMPING + 0.1),
      steerForce: SMART_ENEMY_STEER_FORCE * (0.84 + (difficulty - 1) * 0.34),
      evadeForce: SMART_ENEMY_EVADE_FORCE * (0.9 + (difficulty - 1) * 0.24),
      maxSpeed:
        level === 5
          ? BOSS_REFERENCE_MAX_SPEED - LEVEL_FIVE_BOSS_SPEED_OFFSET
          : level === 6
            ? BOSS_REFERENCE_MAX_SPEED - LEVEL_SIX_BOSS_SPEED_OFFSET
            : BOSS_REFERENCE_MAX_SPEED,
      senseRadius: SMART_ENEMY_SENSE_RADIUS + 320 + (difficulty - 1) * 280,
      absorbRatio: 0.998,
      threatRatio: 0.998,
      playerHuntRatio: 1.005,
      pursuitLeadScale: 0.38 + (difficulty - 1) * 0.18,
      maxLeadSeconds: 0.76 + (difficulty - 1) * 0.28,
      playerAggroBonus: 145 + (difficulty - 1) * 95,
      largeEnemyAvoidanceScale: 2.45 + (difficulty - 1) * 0.75,
      largeEnemyAvoidanceSenseRadiusMultiplier: 1.45 + (difficulty - 1) * 0.14,
      largeEnemyAvoidanceLeadScale: 0.4 + (difficulty - 1) * 0.22,
      largeEnemyAvoidanceTargetPenaltyScale: 1.7 + (difficulty - 1) * 0.5,
      largeEnemyAvoidanceRoutePenaltyScale: 2.1 + (difficulty - 1) * 0.62,
      largeEnemyAvoidanceSideStepScale: 0.8 + (difficulty - 1) * 0.14,
    };
  }

  function getBossRampState(level, state, elapsedSeconds) {
    if (!isBossLevel(level)) return { forceFactor: 1, speedFactor: 1 };
    if (!state || !Number.isFinite(state.bossAggroStartedAtSeconds)) {
      return { forceFactor: 1, speedFactor: 1 };
    }

    const rampSeconds = Math.max(0.001, getBossSpeedRampSeconds(level));
    const elapsedRampSeconds = Math.max(0, elapsedSeconds - state.bossAggroStartedAtSeconds);
    const progress = clamp(elapsedRampSeconds / rampSeconds, 0, 1);
    const speedStartFactor = getBossSpeedRampStartFactor(level);
    const forceStartFactor = getBossForceRampStartFactor(level);
    return {
      forceFactor: forceStartFactor + (1 - forceStartFactor) * progress,
      speedFactor: speedStartFactor + (1 - speedStartFactor) * progress,
    };
  }

  function scoreSmartEnemyTarget(sx, sy, size, target, tuning, isPlayerTarget) {
    const dx = target.getCenterXInScene() - sx;
    const dy = target.getCenterYInScene() - sy;
    const distance = Math.max(1, Math.hypot(dx, dy));
    const range = tuning.senseRadius * (isPlayerTarget ? 1.15 : 1);
    if (distance > range) return -Infinity;

    const targetSize = Math.max(1, target.getWidth());
    const sizeMargin = clamp((size - targetSize) / Math.max(1, size), -0.35, 1);
    let score = sizeMargin * 180;
    score += clamp(1 - distance / Math.max(1, range), 0, 1) * 120;
    score += Math.min(targetSize, size) * 0.18;
    if (isPlayerTarget) score += tuning.playerAggroBonus;
    return score;
  }

  function getBossArenaControlTargetBonus(runtimeScene, target, referenceObject) {
    if (!runtimeScene || !target) return 0;

    const bounds = getBossSpawnBounds(runtimeScene, referenceObject || target);
    const centerX = (bounds.minX + bounds.maxX) * 0.5;
    const centerY = (bounds.minY + bounds.maxY) * 0.5;
    const halfWidth = Math.max(1, (bounds.maxX - bounds.minX) * 0.5);
    const halfHeight = Math.max(1, (bounds.maxY - bounds.minY) * 0.5);
    const dx = Math.abs(target.getCenterXInScene() - centerX) / halfWidth;
    const dy = Math.abs(target.getCenterYInScene() - centerY) / halfHeight;
    const edgeExposure = clamp(Math.max(dx, dy), 0, 1);
    return (1 - edgeExposure) * BOSS_CENTER_ROUTE_BONUS;
  }

  function getBossEdibleClusterBonus(target, enemies, size, tuning) {
    if (!target || !enemies || enemies.length < 2) return 0;

    const tx = target.getCenterXInScene();
    const ty = target.getCenterYInScene();
    let bonus = 0;

    for (let i = 0; i < enemies.length; i++) {
      const otherEnemy = enemies[i];
      if (!otherEnemy || otherEnemy === target) continue;

      const otherSize = Math.max(1, otherEnemy.getWidth());
      if (otherSize >= size * tuning.absorbRatio) continue;

      const distance = Math.hypot(otherEnemy.getCenterXInScene() - tx, otherEnemy.getCenterYInScene() - ty);
      if (!Number.isFinite(distance) || distance > BOSS_EDIBLE_CLUSTER_RADIUS) continue;

      const closeness = clamp(1 - distance / BOSS_EDIBLE_CLUSTER_RADIUS, 0, 1);
      const sizeValue = clamp(otherSize / Math.max(1, size), 0.12, 0.98);
      bonus += closeness * (18 + sizeValue * 34);
    }

    return Math.min(BOSS_EDIBLE_CLUSTER_BONUS, bonus);
  }

  function getBossProjectedSizeAfterAbsorb(size, targetSize) {
    const safeSize = Math.max(1, size);
    const safeTargetSize = Math.max(1, targetSize);
    return Math.sqrt(safeSize * safeSize + safeTargetSize * safeTargetSize);
  }

  function getBossEdibleValueBonus(target, size, tuning) {
    if (!target) return 0;

    const targetSize = Math.max(1, target.getWidth());
    if (targetSize >= size * tuning.absorbRatio) return 0;

    const sizeRatio = clamp(targetSize / Math.max(1, size), 0.14, 0.995);
    const finishMargin = clamp((size * tuning.absorbRatio - targetSize) / Math.max(1, size), 0, 0.42);
    const finishBonus = clamp(1 - finishMargin / 0.42, 0, 1);
    return sizeRatio * BOSS_EDIBLE_TARGET_SIZE_BONUS + finishBonus * BOSS_EDIBLE_FINISH_BONUS;
  }

  function getBossPostAbsorbGrowthBonus(target, enemies, player, size, tuning) {
    if (!target) return 0;

    const targetSize = Math.max(1, target.getWidth());
    const projectedSize = getBossProjectedSizeAfterAbsorb(size, targetSize);
    let bonus = 0;

    if (player) {
      const playerSize = Math.max(1, player.getWidth());
      const projectedPlayerMargin = clamp(
        (projectedSize - playerSize * tuning.playerHuntRatio) / Math.max(1, projectedSize),
        0,
        1
      );
      bonus += projectedPlayerMargin * BOSS_POST_ABSORB_PLAYER_BONUS;
    }

    if (!enemies || enemies.length < 2) return bonus;

    const tx = target.getCenterXInScene();
    const ty = target.getCenterYInScene();
    let chainBonus = 0;

    for (let i = 0; i < enemies.length; i++) {
      const otherEnemy = enemies[i];
      if (!otherEnemy || otherEnemy === target) continue;

      const otherSize = Math.max(1, otherEnemy.getWidth());
      if (otherSize >= projectedSize * tuning.absorbRatio) continue;

      const distance = Math.hypot(otherEnemy.getCenterXInScene() - tx, otherEnemy.getCenterYInScene() - ty);
      if (!Number.isFinite(distance) || distance > BOSS_POST_ABSORB_CHAIN_RADIUS) continue;

      const closeness = clamp(1 - distance / BOSS_POST_ABSORB_CHAIN_RADIUS, 0, 1);
      const sizeValue = clamp(otherSize / Math.max(1, projectedSize), 0.08, 0.98);
      chainBonus += closeness * (18 + sizeValue * 42);
    }

    return bonus + Math.min(BOSS_POST_ABSORB_CHAIN_BONUS, chainBonus);
  }

  function getBossLargeEnemyThreatPenalty(sx, sy, target, enemies, size, tuning) {
    if (!target || !enemies || enemies.length < 2) return 0;

    const tx = target.getCenterXInScene();
    const ty = target.getCenterYInScene();
    const threatRadius = Math.min(
      Math.max(140, tuning.senseRadius * tuning.largeEnemyAvoidanceSenseRadiusMultiplier * 0.62),
      Math.max(
        BOSS_LARGE_ENEMY_TARGET_THREAT_RADIUS_MIN,
        size * BOSS_LARGE_ENEMY_TARGET_THREAT_RADIUS_SIZE_SCALE
      )
    );
    const pathDx = tx - sx;
    const pathDy = ty - sy;
    const pathLength = Math.max(1, Math.hypot(pathDx, pathDy));
    const pathNx = pathDx / pathLength;
    const pathNy = pathDy / pathLength;
    const routeThreatRadius = Math.max(90, size * 0.95);
    let penalty = 0;

    for (let i = 0; i < enemies.length; i++) {
      const otherEnemy = enemies[i];
      if (!otherEnemy || otherEnemy === target) continue;

      const otherSize = Math.max(1, otherEnemy.getWidth());
      if (otherSize <= size * tuning.threatRatio) continue;

      const otherVelocity = getObjectVelocity(otherEnemy);
      const predictiveSeconds = clamp(
        (pathLength / Math.max(160, tuning.maxSpeed + otherVelocity.speed)) * tuning.largeEnemyAvoidanceLeadScale,
        0,
        tuning.maxLeadSeconds
      );
      const threatX = otherEnemy.getCenterXInScene() + otherVelocity.x * predictiveSeconds;
      const threatY = otherEnemy.getCenterYInScene() + otherVelocity.y * predictiveSeconds;
      const distance = Math.hypot(threatX - tx, threatY - ty);
      const fromBossX = threatX - sx;
      const fromBossY = threatY - sy;
      const alongRoute = clamp(fromBossX * pathNx + fromBossY * pathNy, 0, pathLength);
      const closestRouteX = sx + pathNx * alongRoute;
      const closestRouteY = sy + pathNy * alongRoute;
      const routeDistance = Math.hypot(threatX - closestRouteX, threatY - closestRouteY);
      if ((!Number.isFinite(distance) || distance > threatRadius) && routeDistance > routeThreatRadius) continue;

      const closeness = clamp(1 - distance / threatRadius, 0, 1);
      const routeCloseness = clamp(1 - routeDistance / routeThreatRadius, 0, 1);
      const threatRatioDelta = clamp(otherSize / Math.max(1, size * tuning.threatRatio) - 1, 0, 1.8);
      const routePressure =
        routeCloseness *
        clamp(1 - Math.abs(alongRoute - pathLength * 0.58) / Math.max(80, pathLength * 0.58), 0.2, 1);
      penalty +=
        closeness * tuning.largeEnemyAvoidanceTargetPenaltyScale * (70 + threatRatioDelta * 120) +
        routePressure * tuning.largeEnemyAvoidanceRoutePenaltyScale * (95 + threatRatioDelta * 160);
    }

    return Math.min(520, penalty);
  }

  function getBossPlayerOpportunityBonus(runtimeScene, smartEnemy, player, level) {
    if (!runtimeScene || !smartEnemy || !player) return 0;

    const bounds = getBossSpawnBounds(runtimeScene, player);
    const centerX = (bounds.minX + bounds.maxX) * 0.5;
    const centerY = (bounds.minY + bounds.maxY) * 0.5;
    const halfWidth = Math.max(1, (bounds.maxX - bounds.minX) * 0.5);
    const halfHeight = Math.max(1, (bounds.maxY - bounds.minY) * 0.5);
    const px = player.getCenterXInScene();
    const py = player.getCenterYInScene();
    const sx = smartEnemy.getCenterXInScene();
    const sy = smartEnemy.getCenterYInScene();
    const playerEdgeExposure = clamp(
      Math.max(Math.abs(px - centerX) / halfWidth, Math.abs(py - centerY) / halfHeight),
      0,
      1
    );
    const edgeTrapBonus = clamp((playerEdgeExposure - 0.52) / 0.48, 0, 1) * BOSS_PLAYER_WALL_TRAP_BONUS;

    const playerVelocity = getObjectVelocity(player);
    const toBossX = sx - px;
    const toBossY = sy - py;
    const toBossDistance = Math.max(1, Math.hypot(toBossX, toBossY));
    let approachBonus = 0;
    if (playerVelocity.speed > 6) {
      const approachDot = clamp(
        (playerVelocity.x * toBossX + playerVelocity.y * toBossY) / (playerVelocity.speed * toBossDistance),
        -1,
        1
      );
      approachBonus = clamp(approachDot, 0, 1) * BOSS_PLAYER_APPROACH_BONUS;
    }

    const levelScale = level === 4 ? 0.55 : 0.82 + Math.max(0, level - 5) * 0.04;
    return (edgeTrapBonus + approachBonus) * clamp(levelScale, 0.4, 1.08);
  }

  function getBossGrowthTargetPressureBonus(sx, sy, size, target, player, tuning) {
    if (!player || !target || target === player) return 0;

    const playerSize = Math.max(1, player.getWidth());
    if (playerSize <= size * tuning.threatRatio) return 0;

    const px = player.getCenterXInScene();
    const py = player.getCenterYInScene();
    const tx = target.getCenterXInScene();
    const ty = target.getCenterYInScene();
    const playerDistance = Math.max(1, Math.hypot(sx - px, sy - py));
    if (playerDistance > tuning.senseRadius * 1.1) return 0;

    const targetDistance = Math.max(1, Math.hypot(tx - sx, ty - sy));
    const targetPlayerDistance = Math.max(1, Math.hypot(tx - px, ty - py));
    const awayFromPlayerX = sx - px;
    const awayFromPlayerY = sy - py;
    const escapeDirectionDot = clamp(
      ((tx - sx) * awayFromPlayerX + (ty - sy) * awayFromPlayerY) / (targetDistance * playerDistance),
      -1,
      1
    );
    const targetPlayerDistanceDelta = clamp((targetPlayerDistance - playerDistance) / tuning.senseRadius, -1, 1);

    return (
      targetPlayerDistanceDelta * BOSS_GROWTH_TARGET_PLAYER_DISTANCE_BONUS +
      escapeDirectionDot * BOSS_GROWTH_TARGET_ESCAPE_DIRECTION_BONUS
    );
  }

  function chooseBossGrowthTarget(sx, sy, size, enemies, player, tuning, level, runtimeScene, smartEnemy) {
    if (level === 5) {
      let reachableTarget = null;
      let reachableTargetCost = Infinity;
      for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        if (!enemy) continue;

        const enemySize = Math.max(1, enemy.getWidth());
        if (enemySize >= size * tuning.absorbRatio) continue;

        const distance = Math.hypot(enemy.getCenterXInScene() - sx, enemy.getCenterYInScene() - sy);
        if (!Number.isFinite(distance) || distance > LEVEL_FIVE_REACHABLE_PREY_RADIUS) continue;

        const threatPenalty = getBossLargeEnemyThreatPenalty(sx, sy, enemy, enemies, size, tuning);
        const targetCost =
          distance -
          enemySize * LEVEL_FIVE_REACHABLE_PREY_SIZE_DISTANCE_BONUS +
          threatPenalty * LEVEL_FIVE_REACHABLE_PREY_THREAT_DISTANCE_PENALTY;
        if (targetCost < reachableTargetCost) {
          reachableTarget = enemy;
          reachableTargetCost = targetCost;
        }
      }
      if (reachableTarget) return reachableTarget;
    }

    const target = chooseSmartEnemyChaseTarget(
      sx,
      sy,
      size,
      enemies,
      player,
      tuning,
      false,
      level,
      runtimeScene,
      smartEnemy
    );
    return target && target !== player ? target : null;
  }

  function shouldBossAggressivelyPrioritizeGrowth(player, size, tuning, growthTarget) {
    if (!growthTarget) return false;
    if (!player || !tuning) return true;

    return !canBossHuntPlayer(player, size, tuning);
  }

  function shouldBossPrioritizeGrowth(level, chaseTarget, player, size, tuning) {
    if (!isBossLevel(level) || !player) return false;
    if (chaseTarget === player && canBossHuntPlayer(player, size, tuning)) return false;
    return !canBossHuntPlayer(player, size, tuning);
  }

  function isObjectInScene(runtimeScene, object) {
    if (!runtimeScene || !object || typeof object.getName !== "function") return false;

    const sameTypeObjects = runtimeScene.getObjects(object.getName());
    for (let i = 0; i < sameTypeObjects.length; i++) {
      if (sameTypeObjects[i] === object) return true;
    }
    return false;
  }

  function getNativeBossThreatEnterDistance(threat, player, size) {
    return threat === player ? Math.max(240, size * 2.2) : Math.max(190, size * 1.65);
  }

  function isNativeBossThreatStillValid(runtimeScene, threat, player, size, tuning) {
    if (!threat || !isObjectInScene(runtimeScene, threat)) return false;
    if (threat === player) return isPlayerThreateningBoss(player, size, tuning);
    return Math.max(1, threat.getWidth()) > Math.max(1, size) * tuning.threatRatio;
  }

  function resolveNativeBossEscapeThreat(
    runtimeScene,
    state,
    candidateThreat,
    player,
    size,
    tuning,
    elapsedSeconds,
    sx,
    sy
  ) {
    if (!state) return candidateThreat;

    const lockedThreat = state.bossEscapeThreat;
    if (isNativeBossThreatStillValid(runtimeScene, lockedThreat, player, size, tuning)) {
      const lockedDistance = Math.hypot(
        lockedThreat.getCenterXInScene() - sx,
        lockedThreat.getCenterYInScene() - sy
      );
      const releaseDistance =
        getNativeBossThreatEnterDistance(lockedThreat, player, size) *
        BOSS_ESCAPE_THREAT_RELEASE_DISTANCE_SCALE;
      const lockStillActive =
        elapsedSeconds < state.bossEscapeThreatUntilSeconds || lockedDistance <= releaseDistance;

      const shouldKeepLockedThreat =
        !candidateThreat ||
        candidateThreat === lockedThreat ||
        lockedThreat === player ||
        candidateThreat !== player;
      if (lockStillActive && shouldKeepLockedThreat) {
        if (candidateThreat === lockedThreat) {
          state.bossEscapeThreatUntilSeconds = elapsedSeconds + BOSS_ESCAPE_THREAT_HOLD_SECONDS;
        }
        return lockedThreat;
      }
    }

    if (isNativeBossThreatStillValid(runtimeScene, candidateThreat, player, size, tuning)) {
      state.bossEscapeThreat = candidateThreat;
      state.bossEscapeThreatUntilSeconds = elapsedSeconds + BOSS_ESCAPE_THREAT_HOLD_SECONDS;
      return candidateThreat;
    }

    state.bossEscapeThreat = null;
    state.bossEscapeThreatUntilSeconds = -Infinity;
    return null;
  }

  function getBossAbsorbCommitDistance(size, targetSize) {
    return Math.max(96, (Math.max(1, size) + Math.max(1, targetSize)) * BOSS_ABSORB_COMMIT_DISTANCE_RATIO);
  }

  function getBossLargeEnemyEmergencyThreat(sx, sy, bossVelocity, enemies, size, tuning, maxSpeed) {
    if (!enemies || !enemies.length) return null;

    let strongestThreat = null;
    let strongestThreatScore = -Infinity;
    const safeBossVelocity = bossVelocity || { x: 0, y: 0, speed: 0 };

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (!enemy) continue;

      const enemySize = Math.max(1, enemy.getWidth());
      if (enemySize <= size * tuning.threatRatio) continue;

      const baseDx = sx - enemy.getCenterXInScene();
      const baseDy = sy - enemy.getCenterYInScene();
      const baseDistance = Math.max(1, Math.hypot(baseDx, baseDy));
      const enemyVelocity = getObjectVelocity(enemy);
      const predictiveSeconds = clamp(
        (baseDistance / Math.max(160, maxSpeed + enemyVelocity.speed)) * Math.max(0.24, tuning.largeEnemyAvoidanceLeadScale),
        0.05,
        Math.max(0.2, tuning.maxLeadSeconds)
      );
      const predictedEnemyX = enemy.getCenterXInScene() + enemyVelocity.x * predictiveSeconds;
      const predictedEnemyY = enemy.getCenterYInScene() + enemyVelocity.y * predictiveSeconds;
      const dx = sx - predictedEnemyX;
      const dy = sy - predictedEnemyY;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const threatRatioDelta = clamp(enemySize / Math.max(1, size * tuning.threatRatio) - 1, 0, 1.8);
      const collisionDistance = Math.max(110, (enemySize + size) * (0.58 + threatRatioDelta * 0.05));
      const emergencyDistance = Math.max(
        collisionDistance + 72,
        (enemySize + size) * (BOSS_LARGE_ENEMY_EMERGENCY_DISTANCE_RATIO + threatRatioDelta * 0.1)
      );

      const relativeVelocityX = enemyVelocity.x - (safeBossVelocity.x || 0);
      const relativeVelocityY = enemyVelocity.y - (safeBossVelocity.y || 0);
      const relativeSpeed = Math.hypot(relativeVelocityX, relativeVelocityY);
      const closingSpeed =
        relativeSpeed > 6 ? clamp((relativeVelocityX * dx + relativeVelocityY * dy) / distance, 0, relativeSpeed) : 0;
      const approachFactor = relativeSpeed > 6 ? clamp(closingSpeed / relativeSpeed, 0, 1) : 0;
      const clearance = distance - collisionDistance;
      const timeToContact =
        closingSpeed > 0.001 ? clearance / Math.max(0.001, closingSpeed) : Number.POSITIVE_INFINITY;
      const closeness = clamp(1 - distance / emergencyDistance, 0, 1);
      const imminentContact = clearance <= 68 || timeToContact <= BOSS_LARGE_ENEMY_EMERGENCY_TIME_TO_CONTACT_SECONDS;
      const threatScore =
        closeness * 2.2 +
        approachFactor * 1.15 +
        threatRatioDelta * 0.55 +
        (imminentContact ? 0.75 : 0);
      const emergencyActive =
        distance <= emergencyDistance ||
        imminentContact ||
        (distance <= emergencyDistance * 1.18 && approachFactor >= 0.28) ||
        threatScore >= 0.9;

      if (emergencyActive && threatScore > strongestThreatScore) {
        strongestThreatScore = threatScore;
        strongestThreat = {
          enemy,
          enemySize,
          enemyVelocity,
          dx,
          dy,
          distance,
          dangerDistance: emergencyDistance,
          collisionDistance,
          clearance,
          timeToContact,
          closingSpeed,
          threatRatioDelta,
          approachFactor,
          threatScore,
        };
      }
    }

    return strongestThreat;
  }

  function getBossEmergencyEscapeForce(threat, tuning, steerForceScale) {
    if (!threat) return { x: 0, y: 0 };

    const distance = Math.max(1, threat.distance);
    const nx = threat.dx / distance;
    const ny = threat.dy / distance;
    const tangentDirection = threat.enemyVelocity.x * threat.dy - threat.enemyVelocity.y * threat.dx >= 0 ? 1 : -1;
    const tangentX = (-threat.dy / distance) * tangentDirection;
    const tangentY = (threat.dx / distance) * tangentDirection;
    const panicFactor = clamp(1 - distance / threat.dangerDistance, 0, 1);
    const forceMagnitude =
      tuning.evadeForce *
      steerForceScale *
      BOSS_LARGE_ENEMY_EMERGENCY_FORCE_MULTIPLIER *
      (0.82 + panicFactor * 0.78 + threat.threatRatioDelta * 0.24 + threat.approachFactor * 0.18);

    return {
      x: nx * forceMagnitude + tangentX * forceMagnitude * BOSS_LARGE_ENEMY_EMERGENCY_SIDESTEP_SCALE,
      y: ny * forceMagnitude + tangentY * forceMagnitude * BOSS_LARGE_ENEMY_EMERGENCY_SIDESTEP_SCALE,
    };
  }

  function isBossEnemyTargetStillViable(runtimeScene, target, size, tuning, sx, sy) {
    if (!target || !isObjectInScene(runtimeScene, target)) return false;

    const targetSize = Math.max(1, target.getWidth());
    if (targetSize >= size * tuning.absorbRatio) return false;

    const distance = Math.hypot(target.getCenterXInScene() - sx, target.getCenterYInScene() - sy);
    return Number.isFinite(distance) && distance <= tuning.senseRadius + BOSS_TARGET_LOCK_DISTANCE_BONUS;
  }

  function isBossGrowthTargetStillViable(runtimeScene, target, size, tuning, sx, sy) {
    if (!target || !isObjectInScene(runtimeScene, target)) return false;

    const targetSize = Math.max(1, target.getWidth());
    if (targetSize >= size * tuning.absorbRatio) return false;

    const distance = Math.hypot(target.getCenterXInScene() - sx, target.getCenterYInScene() - sy);
    return Number.isFinite(distance) && distance <= tuning.senseRadius + BOSS_GROWTH_TARGET_LOCK_DISTANCE_BONUS;
  }

  function scoreBossEnemyTargetCandidate(sx, sy, size, enemy, enemies, player, tuning, level, runtimeScene, smartEnemy) {
    if (!enemy) return -Infinity;

    const enemySize = Math.max(1, enemy.getWidth());
    if (enemySize >= size * tuning.absorbRatio) return -Infinity;
    if (level === 4 && getLevelFourEnemyBaitPenalty(runtimeScene, enemy, smartEnemy) >= 260) return -Infinity;

    let score = scoreSmartEnemyTarget(sx, sy, size, enemy, tuning, false);
    if (!Number.isFinite(score)) return -Infinity;

    score += getBossGrowthTargetPressureBonus(sx, sy, size, enemy, player, tuning);
    if (isBossLevel(level)) {
      const threatPenalty = getBossLargeEnemyThreatPenalty(sx, sy, enemy, enemies, size, tuning);
      if (level !== 5 && threatPenalty >= BOSS_LARGE_ENEMY_HARD_REJECT_PENALTY) return -Infinity;

      score += getBossEdibleValueBonus(enemy, size, tuning);
      score += getBossPostAbsorbGrowthBonus(enemy, enemies, player, size, tuning);
      score += getBossArenaControlTargetBonus(runtimeScene, enemy, smartEnemy);
      score += getBossEdibleClusterBonus(enemy, enemies, size, tuning);

      if (player && !canBossHuntPlayer(player, size, tuning)) {
        const playerSize = Math.max(1, player.getWidth());
        const projectedSize = getBossProjectedSizeAfterAbsorb(size, enemySize);
        const growthProgress =
          playerSize > size
            ? clamp((projectedSize - size) / Math.max(1, playerSize - size), 0, 1)
            : clamp((projectedSize - size) / Math.max(1, size), 0, 1);
        const edibleSizeRatio = clamp(enemySize / Math.max(1, size), 0.12, 0.995);
        score += BOSS_UNDERSIZED_GROWTH_TARGET_BONUS;
        score += edibleSizeRatio * BOSS_UNDERSIZED_GROWTH_SIZE_BONUS;
        score += growthProgress * BOSS_UNDERSIZED_GROWTH_PROGRESS_BONUS;
      }

      score -= threatPenalty;
    }

    if (level === 4) {
      score -= getLevelFourEnemyBaitPenalty(runtimeScene, enemy, smartEnemy);
    }

    return score;
  }

  function resolveBossChaseTarget(
    runtimeScene,
    state,
    candidateTarget,
    player,
    size,
    tuning,
    elapsedSeconds,
    sx,
    sy,
    enemies = [],
    level = 0,
    smartEnemy = null
  ) {
    if (!state) return candidateTarget;

    if (candidateTarget === player && canBossHuntPlayer(player, size, tuning)) {
      state.bossLockedTarget = null;
      state.bossLockedTargetUntilSeconds = -Infinity;
      return player;
    }

    const lockedTarget = state.bossLockedTarget;
    const lockStillActive = Number.isFinite(state.bossLockedTargetUntilSeconds) && elapsedSeconds < state.bossLockedTargetUntilSeconds;
    const growthMode = isBossLevel(level) && player && !canBossHuntPlayer(player, size, tuning);
    const lockedTargetViable =
      lockedTarget &&
      lockedTarget !== player &&
      (growthMode
        ? isBossGrowthTargetStillViable(runtimeScene, lockedTarget, size, tuning, sx, sy)
        : isBossEnemyTargetStillViable(runtimeScene, lockedTarget, size, tuning, sx, sy));

    let finalTarget = candidateTarget;
    if (lockStillActive && lockedTargetViable) {
      if (!finalTarget || finalTarget === player) {
        finalTarget = lockedTarget;
      } else if (finalTarget !== lockedTarget) {
        const lockedScore = growthMode
          ? scoreBossEnemyTargetCandidate(sx, sy, size, lockedTarget, enemies, player, tuning, level, runtimeScene, smartEnemy)
          : -Infinity;
        const candidateScore = growthMode
          ? scoreBossEnemyTargetCandidate(sx, sy, size, finalTarget, enemies, player, tuning, level, runtimeScene, smartEnemy)
          : Infinity;
        const lockedDistance = Math.hypot(lockedTarget.getCenterXInScene() - sx, lockedTarget.getCenterYInScene() - sy);
        const candidateDistance = Math.hypot(finalTarget.getCenterXInScene() - sx, finalTarget.getCenterYInScene() - sy);
        const levelFiveReachablePreyClearlyCloser =
          level === 5 &&
          candidateDistance <= LEVEL_FIVE_REACHABLE_PREY_RADIUS &&
          candidateDistance + LEVEL_FIVE_REACHABLE_PREY_SWITCH_DISTANCE_MARGIN < lockedDistance;
        const candidateClearlyBetter =
          growthMode &&
          (levelFiveReachablePreyClearlyCloser ||
            candidateScore >= lockedScore + BOSS_GROWTH_TARGET_SWITCH_SCORE_MARGIN);

        if (growthMode && !candidateClearlyBetter) {
          finalTarget = lockedTarget;
        } else if (!growthMode) {
          if (lockedDistance <= candidateDistance + BOSS_TARGET_LOCK_DISTANCE_BONUS) {
            finalTarget = lockedTarget;
          }
        }
      }
    }

    if (
      finalTarget &&
      finalTarget !== player &&
      (growthMode
        ? isBossGrowthTargetStillViable(runtimeScene, finalTarget, size, tuning, sx, sy)
        : isBossEnemyTargetStillViable(runtimeScene, finalTarget, size, tuning, sx, sy))
    ) {
      const targetSize = Math.max(1, finalTarget.getWidth());
      const distance = Math.hypot(finalTarget.getCenterXInScene() - sx, finalTarget.getCenterYInScene() - sy);
      const commitDistance = getBossAbsorbCommitDistance(size, targetSize);
      const targetLockSeconds =
        growthMode
          ? distance <= commitDistance
            ? BOSS_GROWTH_TARGET_LOCK_CLOSE_SECONDS
            : BOSS_GROWTH_TARGET_LOCK_SECONDS
          : distance <= commitDistance
            ? BOSS_TARGET_LOCK_SECONDS
            : distance <= tuning.senseRadius * 0.36
              ? BOSS_TARGET_LOCK_SECONDS * 0.65
              : BOSS_TARGET_LOCK_SECONDS * 0.35;
      state.bossLockedTarget = finalTarget;
      state.bossLockedTargetUntilSeconds = elapsedSeconds + targetLockSeconds;
      return finalTarget;
    }

    if (!lockedTargetViable || !lockStillActive) {
      state.bossLockedTarget = null;
      state.bossLockedTargetUntilSeconds = -Infinity;
    }

    return finalTarget;
  }

  function isLevelFourBossInTopRightPocket(cornerState) {
    return (
      !!cornerState &&
      cornerState.topFactor > LEVEL_FOUR_BOSS_POCKET_FACTOR &&
      cornerState.rightFactor > LEVEL_FOUR_BOSS_POCKET_FACTOR
    );
  }

  function chooseSmartEnemyChaseTarget(
    sx,
    sy,
    size,
    enemies,
    player,
    tuning,
    readyToHuntPlayer,
    level,
    runtimeScene,
    smartEnemy
  ) {
    let best = null;
    let bestScore = -Infinity;

    if (isBossLevel(level) && player && readyToHuntPlayer) return player;

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const score = scoreBossEnemyTargetCandidate(sx, sy, size, enemy, enemies, player, tuning, level, runtimeScene, smartEnemy);
      if (!Number.isFinite(score)) continue;
      if (score > bestScore) {
        bestScore = score;
        best = enemy;
      }
    }

    if (player && readyToHuntPlayer) {
      let playerScore = scoreSmartEnemyTarget(sx, sy, size, player, tuning, true);
      if (isBossLevel(level)) {
        const playerDistance = Math.hypot(player.getCenterXInScene() - sx, player.getCenterYInScene() - sy);
        const playerSize = Math.max(1, player.getWidth());
        const playerThreatPenalty = getBossLargeEnemyThreatPenalty(sx, sy, player, enemies, size, tuning);
        const playerAttackMargin = clamp(
          (size - playerSize * tuning.playerHuntRatio) / Math.max(1, size),
          0,
          1
        );
        const playerCommitDistance = getBossAbsorbCommitDistance(size, playerSize);
        const playerFinishWindow = clamp(1 - playerDistance / Math.max(1, playerCommitDistance * 1.45), 0, 1);
        const playerDominanceBonus = clamp((size - playerSize) / Math.max(1, size), 0, 1);
        const playerClosingBonus = clamp(1 - playerDistance / Math.max(1, tuning.senseRadius * 0.8), 0, 1);
        const playerAttackScoreScale = level === 4 ? LEVEL_FOUR_PLAYER_ATTACK_SCORE_SCALE : 1;
        playerScore += getBossPlayerOpportunityBonus(runtimeScene, smartEnemy, player, level) * playerAttackScoreScale;
        playerScore += playerAttackMargin * BOSS_PLAYER_ATTACK_MARGIN_BONUS * playerAttackScoreScale;
        playerScore += playerFinishWindow * BOSS_PLAYER_DIRECT_KILL_BONUS * playerAttackScoreScale;
        playerScore += playerDominanceBonus * BOSS_POST_ABSORB_PLAYER_BONUS * 0.6 * playerAttackScoreScale;
        playerScore += playerClosingBonus * BOSS_PLAYER_APPROACH_BONUS * 1.35 * playerAttackScoreScale;
        playerScore -= playerThreatPenalty * 0.44;
      }
      if (playerScore > bestScore) {
        bestScore = playerScore;
        best = player;
      }
    }

    if (best) return best;
    if (player && readyToHuntPlayer) return player;

    if (level === 4) {
      const safeFallback = findNearestObject(
        sx,
        sy,
        enemies,
        (enemy) =>
          enemy.getWidth() < size * tuning.absorbRatio &&
          getLevelFourEnemyBaitPenalty(runtimeScene, enemy, smartEnemy) < 180
      );
      if (safeFallback) return safeFallback;
    }

    if (isBossLevel(level)) {
      const safeFallback = findNearestObject(
        sx,
        sy,
        enemies,
        (enemy) =>
          enemy.getWidth() < size * tuning.absorbRatio &&
          getBossLargeEnemyThreatPenalty(sx, sy, enemy, enemies, size, tuning) < BOSS_LARGE_ENEMY_HARD_REJECT_PENALTY * 0.72
      );
      if (safeFallback) return safeFallback;
      return null;
    }

    return findNearestObject(sx, sy, enemies, (enemy) => enemy.getWidth() < size * tuning.absorbRatio);
  }

  function getLevelFourBossCornerState(runtimeScene, smartEnemy, player) {
    const bounds = getBossSpawnBounds(runtimeScene, player || smartEnemy);
    const sx = smartEnemy.getCenterXInScene();
    const sy = smartEnemy.getCenterYInScene();
    const edgeBuffer = 220;
    const leftFactor = clamp((bounds.minX + edgeBuffer - sx) / edgeBuffer, 0, 1);
    const rightFactor = clamp((sx - (bounds.maxX - edgeBuffer)) / edgeBuffer, 0, 1);
    const topFactor = clamp((bounds.minY + edgeBuffer - sy) / edgeBuffer, 0, 1);
    const bottomFactor = clamp((sy - (bounds.maxY - edgeBuffer)) / edgeBuffer, 0, 1);
    const edgeFactor = Math.max(leftFactor, rightFactor, topFactor, bottomFactor);
    const cornerFactor = Math.max(leftFactor, rightFactor) * Math.max(topFactor, bottomFactor);

    return {
      bounds,
      leftFactor,
      rightFactor,
      topFactor,
      bottomFactor,
      edgeFactor,
      cornerFactor,
      pushX: leftFactor - rightFactor,
      pushY: topFactor - bottomFactor,
    };
  }

  function updateLevelFourBossUnstickState(state, cornerState, velocity, maxSpeed, deltaSeconds, elapsedSeconds) {
    if (!state || !cornerState) return false;

    const inTopRightPocket = isLevelFourBossInTopRightPocket(cornerState);
    const movingTooSlow = velocity.speed < maxSpeed * LEVEL_FOUR_BOSS_UNSTICK_SPEED_RATIO;
    const escapingPoorly = velocity.x > -maxSpeed * 0.16 || velocity.y < maxSpeed * 0.1;

    if (inTopRightPocket) {
      state.levelFourBossCorneredForSeconds += deltaSeconds;
      if (
        state.levelFourBossCorneredForSeconds >= LEVEL_FOUR_BOSS_UNSTICK_TRIGGER_SECONDS ||
        movingTooSlow ||
        escapingPoorly
      ) {
        state.levelFourBossUnstickUntilSeconds = Math.max(
          Number(state.levelFourBossUnstickUntilSeconds) || -Infinity,
          elapsedSeconds + LEVEL_FOUR_BOSS_UNSTICK_DURATION_SECONDS
        );
      }
    } else if (!inTopRightPocket) {
      state.levelFourBossCorneredForSeconds = 0;
    } else {
      state.levelFourBossCorneredForSeconds = Math.max(0, state.levelFourBossCorneredForSeconds - deltaSeconds * 0.5);
    }

    return Number.isFinite(state.levelFourBossUnstickUntilSeconds) && elapsedSeconds < state.levelFourBossUnstickUntilSeconds;
  }

  function updateLevelSixBossUnstickState(state, wallState, velocity, maxSpeed, deltaSeconds, elapsedSeconds) {
    if (!state || !wallState) return false;

    const wallTrapActive = shouldLevelSixBossEscapeWallTrap(wallState, velocity, maxSpeed);
    const movingTooSlow = velocity.speed < maxSpeed * LEVEL_SIX_BOSS_UNSTICK_SPEED_RATIO;
    const forceMagnitude = Math.max(0.001, Math.hypot(wallState.forceX, wallState.forceY));
    const escapeAlignment =
      ((velocity.x || 0) * wallState.forceX + (velocity.y || 0) * wallState.forceY) /
      Math.max(1, velocity.speed * forceMagnitude);
    const escapingPoorly = escapeAlignment < 0.18;

    if (wallTrapActive) {
      state.levelSixBossCorneredForSeconds += deltaSeconds;
      if (
        state.levelSixBossCorneredForSeconds >= LEVEL_SIX_BOSS_UNSTICK_TRIGGER_SECONDS ||
        movingTooSlow ||
        escapingPoorly
      ) {
        state.levelSixBossUnstickUntilSeconds = Math.max(
          Number(state.levelSixBossUnstickUntilSeconds) || -Infinity,
          elapsedSeconds + LEVEL_SIX_BOSS_UNSTICK_DURATION_SECONDS
        );
      }
    } else {
      state.levelSixBossCorneredForSeconds = 0;
    }

    return Number.isFinite(state.levelSixBossUnstickUntilSeconds) && elapsedSeconds < state.levelSixBossUnstickUntilSeconds;
  }

  function getLevelFourLowerBarrierState(runtimeScene, smartEnemy) {
    if (!runtimeScene || !smartEnemy) return null;

    const walls = runtimeScene
      .getObjects("Walls")
      .filter((wall) => Math.max(wall.getWidth ? wall.getWidth() : 0, wall.getHeight ? wall.getHeight() : 0) > 0);
    if (!walls.length) return null;

    let barrier = null;
    for (let i = 0; i < walls.length; i++) {
      const wall = walls[i];
      const width = Math.max(0, wall.getWidth ? wall.getWidth() : 0);
      const height = Math.max(0, wall.getHeight ? wall.getHeight() : 0);
      if (width < 220 || height > 80) continue;

      const centerY = wall.getCenterYInScene();
      if (!barrier || centerY > barrier.centerY || (centerY === barrier.centerY && width > barrier.width)) {
        barrier = {
          width,
          centerY,
          left: wall.getCenterXInScene() - width / 2,
          right: wall.getCenterXInScene() + width / 2,
          top: wall.getCenterYInScene() - height / 2,
        };
      }
    }
    if (!barrier) return null;

    const sx = smartEnemy.getCenterXInScene();
    const sy = smartEnemy.getCenterYInScene();
    const bossWidth = Math.max(1, smartEnemy.getWidth ? smartEnemy.getWidth() : 0);
    const bossHeight = Math.max(1, smartEnemy.getHeight ? smartEnemy.getHeight() : bossWidth);
    const exitX = barrier.right + Math.max(56, bossWidth * 0.48);
    const exitY = barrier.top - Math.max(40, bossHeight * 0.18);
    const exitVector = getNormalizedVector(exitX - sx, exitY - sy);

    return {
      ...barrier,
      exitX,
      exitY,
      exitVectorX: exitVector.x,
      exitVectorY: exitVector.y,
      bossBelowBarrier: sy >= barrier.top + Math.max(26, bossHeight * 0.24),
      bossLeftOfExit: sx <= barrier.right + Math.max(20, bossWidth * 0.2),
    };
  }

  function isLevelFourTargetOutsideLowerBarrier(target, barrierState) {
    if (!target || !barrierState) return false;

    const tx = target.getCenterXInScene();
    const ty = target.getCenterYInScene();
    return tx >= barrierState.right + 18 || ty <= barrierState.top - 18;
  }

  function getStableBossTurnDirection(smartEnemy) {
    const uniqueId = Number(smartEnemy?.getUniqueId?.());
    if (!Number.isFinite(uniqueId)) return 1;
    return Math.abs(Math.trunc(uniqueId)) % 2 === 0 ? 1 : -1;
  }

  function getLevelFourBossUnstickForce(runtimeScene, smartEnemy, player, tuning, steerForceScale, elapsedSeconds) {
    const cornerState = getLevelFourBossCornerState(runtimeScene, smartEnemy, player);
    const { bounds, pushX, pushY, edgeFactor, cornerFactor } = cornerState;
    const sx = smartEnemy.getCenterXInScene();
    const sy = smartEnemy.getCenterYInScene();
    const escapeTargetX = bounds.minX + (bounds.maxX - bounds.minX) * 0.42;
    const escapeTargetY = bounds.minY + (bounds.maxY - bounds.minY) * 0.58;
    const dx = escapeTargetX - sx;
    const dy = escapeTargetY - sy;
    const distance = Math.max(1, Math.hypot(dx, dy));
    const nx = dx / distance;
    const ny = dy / distance;
    const swirlDirection = getStableBossTurnDirection(smartEnemy);
    const tangentX = -ny * swirlDirection;
    const tangentY = nx * swirlDirection;
    const escapeStrength = tuning.steerForce * steerForceScale * (1.12 + edgeFactor * 0.72 + cornerFactor * 0.94);
    const edgePushStrength = tuning.steerForce * steerForceScale * (0.95 + edgeFactor * 0.68 + cornerFactor * 0.98);

    return {
      x: nx * escapeStrength + tangentX * tuning.steerForce * steerForceScale * 0.16 + pushX * edgePushStrength,
      y: ny * escapeStrength + tangentY * tuning.steerForce * steerForceScale * 0.16 + pushY * edgePushStrength,
    };
  }

  function ejectLevelFourBossFromPocket(smartEnemy, cornerState, maxSpeed, deltaSeconds) {
    if (!smartEnemy || !cornerState || !isLevelFourBossInTopRightPocket(cornerState)) return;

    const step = Math.min(22, Math.max(7, 260 * deltaSeconds));
    const offsetX = step * (0.9 + cornerState.rightFactor * 0.5);
    const offsetY = step * (0.78 + cornerState.topFactor * 0.42);
    smartEnemy.setCenterPositionInScene(
      smartEnemy.getCenterXInScene() - offsetX,
      smartEnemy.getCenterYInScene() + offsetY
    );

    if (!smartEnemy.hasBehavior || !smartEnemy.hasBehavior("Physics2")) return;
    const physics = smartEnemy.getBehavior("Physics2");
    if (physics.setLinearVelocityX) physics.setLinearVelocityX(-maxSpeed * 0.54);
    if (physics.setLinearVelocityY) physics.setLinearVelocityY(maxSpeed * 0.38);
  }

  function getLevelFourBossRestlessForce(
    runtimeScene,
    smartEnemy,
    player,
    tuning,
    steerForceScale,
    elapsedSeconds,
    velocity,
    maxSpeed
  ) {
    const cornerState = getLevelFourBossCornerState(runtimeScene, smartEnemy, player);
    const { bounds, edgeFactor, cornerFactor, pushX, pushY } = cornerState;
    const sx = smartEnemy.getCenterXInScene();
    const sy = smartEnemy.getCenterYInScene();
    const centerX = (bounds.minX + bounds.maxX) * 0.5;
    const centerY = (bounds.minY + bounds.maxY) * 0.5;
    const dx = centerX - sx;
    const dy = centerY - sy;
    const distance = Math.max(1, Math.hypot(dx, dy));
    const nx = dx / distance;
    const ny = dy / distance;
    const arenaWidth = Math.max(1, bounds.maxX - bounds.minX);
    const arenaHeight = Math.max(1, bounds.maxY - bounds.minY);
    const orbitRadius = Math.max(180, Math.min(arenaWidth, arenaHeight) * 0.22);
    const inwardStrength =
      tuning.steerForce *
      steerForceScale *
      clamp((distance - orbitRadius) / Math.max(160, orbitRadius), 0, 1) *
      (0.42 + edgeFactor * 0.55 + cornerFactor * 0.75);

    const swirlDirection = getStableBossTurnDirection(smartEnemy);
    const tangentX = -ny * swirlDirection;
    const tangentY = nx * swirlDirection;
    const swirlStrength = tuning.steerForce * steerForceScale * (0.16 + edgeFactor * 0.08);

    let fx = nx * inwardStrength + tangentX * swirlStrength;
    let fy = ny * inwardStrength + tangentY * swirlStrength;

    const edgePushStrength =
      tuning.steerForce * steerForceScale * (0.95 * edgeFactor + 1.15 * cornerFactor);
    fx += pushX * edgePushStrength;
    fy += pushY * edgePushStrength;

    const effectiveVelocity = velocity || getObjectVelocity(smartEnemy);
    const effectiveMaxSpeed = Math.max(1, maxSpeed || tuning.maxSpeed);
    const lowSpeedFactor = clamp(
      1 - effectiveVelocity.speed / (effectiveMaxSpeed * LEVEL_FOUR_BOSS_MOTION_RECOVERY_SPEED_RATIO),
      0,
      1
    );
    fx += tangentX * tuning.steerForce * steerForceScale * lowSpeedFactor * 0.36;
    fy += tangentY * tuning.steerForce * steerForceScale * lowSpeedFactor * 0.36;
    fx += nx * tuning.steerForce * steerForceScale * lowSpeedFactor * 0.14;
    fy += ny * tuning.steerForce * steerForceScale * lowSpeedFactor * 0.14;

    if (effectiveVelocity.speed < effectiveMaxSpeed * 0.22) {
      fx *= 1.55;
      fy *= 1.55;
    }

    return { x: fx, y: fy, edgeFactor, cornerFactor };
  }

  function getWallSegmentData(wall) {
    if (!wall) return null;

    const width = Math.max(0, wall.getWidth ? wall.getWidth() : 0);
    const height = Math.max(0, wall.getHeight ? wall.getHeight() : 0);
    if (width <= 0 || height <= 0) return null;

    const centerX = wall.getCenterXInScene ? wall.getCenterXInScene() : wall.getX() + width * 0.5;
    const centerY = wall.getCenterYInScene ? wall.getCenterYInScene() : wall.getY() + height * 0.5;
    const majorAxisOffset = height > width ? Math.PI * 0.5 : 0;
    const angleRadians = ((wall.getAngle ? wall.getAngle() : 0) * Math.PI) / 180 + majorAxisOffset;
    const majorLength = Math.max(width, height);
    const halfLength = majorLength * 0.5;
    const tangentX = Math.cos(angleRadians);
    const tangentY = Math.sin(angleRadians);

    return {
      centerX,
      centerY,
      tangentX,
      tangentY,
      halfThickness: Math.min(width, height) * 0.5,
      halfLength,
      startX: centerX - tangentX * halfLength,
      startY: centerY - tangentY * halfLength,
      endX: centerX + tangentX * halfLength,
      endY: centerY + tangentY * halfLength,
    };
  }

  function getClosestPointOnSegment(px, py, segment) {
    if (!segment) return null;

    const dx = segment.endX - segment.startX;
    const dy = segment.endY - segment.startY;
    const lengthSq = dx * dx + dy * dy;
    if (lengthSq <= 0.001) {
      return { x: segment.centerX, y: segment.centerY, t: 0.5 };
    }

    const t = clamp(((px - segment.startX) * dx + (py - segment.startY) * dy) / lengthSq, 0, 1);
    return {
      x: segment.startX + dx * t,
      y: segment.startY + dy * t,
      t,
    };
  }

  function getWallCapsuleClearance(px, py, radius, segment) {
    if (!segment) return Infinity;

    const closestPoint = getClosestPointOnSegment(px, py, segment);
    if (!closestPoint) return Infinity;

    return (
      Math.hypot(px - closestPoint.x, py - closestPoint.y) -
      Math.max(0, segment.halfThickness || 0) -
      Math.max(0, radius || 0)
    );
  }

  function getLevelFourEnemyWallClearance(runtimeScene, x, y, radius) {
    if (!runtimeScene) return Infinity;

    const walls = runtimeScene.getObjects("Walls");
    let bestClearance = Infinity;
    for (let i = 0; i < walls.length; i++) {
      const segment = getWallSegmentData(walls[i]);
      if (!segment) continue;
      bestClearance = Math.min(bestClearance, getWallCapsuleClearance(x, y, radius, segment));
    }

    return bestClearance;
  }

  function getLevelSixBossWallState(runtimeScene, smartEnemy) {
    if (!runtimeScene || !smartEnemy) return null;

    const wallsCenter = getWallsShapeCenter(runtimeScene);
    if (!wallsCenter) return null;

    const sx = smartEnemy.getCenterXInScene();
    const sy = smartEnemy.getCenterYInScene();
    const walls = runtimeScene
      .getObjects("Walls")
      .filter((wall) => Math.max(wall.getWidth ? wall.getWidth() : 0, wall.getHeight ? wall.getHeight() : 0) > 0);
    if (!walls.length) return null;

    let forceX = 0;
    let forceY = 0;
    let strongestEdgeFactor = 0;
    let strongestCornerFactor = 0;

    for (let i = 0; i < walls.length; i++) {
      const segment = getWallSegmentData(walls[i]);
      const closestPoint = getClosestPointOnSegment(sx, sy, segment);
      if (!segment || !closestPoint) continue;

      let dx = sx - closestPoint.x;
      let dy = sy - closestPoint.y;
      let distance = Math.hypot(dx, dy);

      if (!Number.isFinite(distance) || distance > LEVEL_SIX_WALL_ESCAPE_BUFFER) continue;

      let inwardX;
      let inwardY;
      if (distance > 0.001) {
        inwardX = dx / distance;
        inwardY = dy / distance;
      } else {
        const toCenterX = wallsCenter.x - segment.centerX;
        const toCenterY = wallsCenter.y - segment.centerY;
        const toCenterDistance = Math.max(1, Math.hypot(toCenterX, toCenterY));
        inwardX = toCenterX / toCenterDistance;
        inwardY = toCenterY / toCenterDistance;
        distance = 0;
      }

      const edgeFactor = clamp(1 - distance / LEVEL_SIX_WALL_ESCAPE_BUFFER, 0, 1);
      const endpointFactor = clamp(1 - Math.min(closestPoint.t, 1 - closestPoint.t) / 0.18, 0, 1);
      const cornerFactor = edgeFactor * endpointFactor;
      const tangentDirection = Math.sin((sx + sy + i * 97) * 0.0032) >= 0 ? 1 : -1;
      const tangentX = -inwardY * tangentDirection;
      const tangentY = inwardX * tangentDirection;
      const pushMagnitude = edgeFactor * (0.92 + cornerFactor * 0.78);

      forceX += inwardX * pushMagnitude + tangentX * edgeFactor * 0.24;
      forceY += inwardY * pushMagnitude + tangentY * edgeFactor * 0.24;
      strongestEdgeFactor = Math.max(strongestEdgeFactor, edgeFactor);
      strongestCornerFactor = Math.max(strongestCornerFactor, cornerFactor);
    }

    const centerDx = wallsCenter.x - sx;
    const centerDy = wallsCenter.y - sy;
    const centerDistance = Math.max(1, Math.hypot(centerDx, centerDy));
    forceX += (centerDx / centerDistance) * (0.18 + strongestEdgeFactor * 0.34 + strongestCornerFactor * 0.28);
    forceY += (centerDy / centerDistance) * (0.18 + strongestEdgeFactor * 0.34 + strongestCornerFactor * 0.28);

    return {
      forceX,
      forceY,
      edgeFactor: strongestEdgeFactor,
      cornerFactor: strongestCornerFactor,
      centerX: wallsCenter.x,
      centerY: wallsCenter.y,
    };
  }

  function getBossWallContactState(runtimeScene, smartEnemy) {
    if (!runtimeScene || !smartEnemy) return null;

    const wallsCenter = getWallsShapeCenter(runtimeScene);
    if (!wallsCenter) return null;

    const sx = smartEnemy.getCenterXInScene();
    const sy = smartEnemy.getCenterYInScene();
    const radius = getApproxObjectRadius(smartEnemy, 30);
    const walls = runtimeScene
      .getObjects("Walls")
      .filter((wall) => Math.max(wall.getWidth ? wall.getWidth() : 0, wall.getHeight ? wall.getHeight() : 0) > 0);
    if (!walls.length) return null;

    let bestClearance = Infinity;
    let forceX = 0;
    let forceY = 0;
    let strongestEdgeFactor = 0;

    for (let i = 0; i < walls.length; i++) {
      const segment = getWallSegmentData(walls[i]);
      const closestPoint = getClosestPointOnSegment(sx, sy, segment);
      if (!segment || !closestPoint) continue;

      const clearance = getWallCapsuleClearance(sx, sy, radius, segment);
      if (!Number.isFinite(clearance)) continue;
      bestClearance = Math.min(bestClearance, clearance);
      if (clearance > BOSS_WALL_CONTACT_CLEARANCE) continue;

      let inwardX = sx - closestPoint.x;
      let inwardY = sy - closestPoint.y;
      let inwardDistance = Math.hypot(inwardX, inwardY);
      if (inwardDistance <= 0.001) {
        inwardX = wallsCenter.x - segment.centerX;
        inwardY = wallsCenter.y - segment.centerY;
        inwardDistance = Math.hypot(inwardX, inwardY);
      }
      if (inwardDistance <= 0.001) continue;

      inwardX /= inwardDistance;
      inwardY /= inwardDistance;

      const centerX = wallsCenter.x - segment.centerX;
      const centerY = wallsCenter.y - segment.centerY;
      if (inwardX * centerX + inwardY * centerY < 0) {
        inwardX *= -1;
        inwardY *= -1;
      }

      const edgeFactor = clamp(
        1 - Math.max(0, clearance - BOSS_WALL_CONTACT_TOUCH_CLEARANCE) /
          Math.max(1, BOSS_WALL_CONTACT_CLEARANCE - BOSS_WALL_CONTACT_TOUCH_CLEARANCE),
        0,
        1
      );
      forceX += inwardX * edgeFactor;
      forceY += inwardY * edgeFactor;
      strongestEdgeFactor = Math.max(strongestEdgeFactor, edgeFactor);
    }

    if (!Number.isFinite(bestClearance) || bestClearance > BOSS_WALL_CONTACT_CLEARANCE) return null;

    return {
      forceX,
      forceY,
      clearance: bestClearance,
      edgeFactor: strongestEdgeFactor,
      bossX: sx,
      bossY: sy,
      centerX: wallsCenter.x,
      centerY: wallsCenter.y,
    };
  }

  function updateBossWallContactReleaseState(state, wallContactState, elapsedSeconds, level) {
    if (!state || !wallContactState || wallContactState.clearance > BOSS_WALL_CONTACT_CLEARANCE) {
      if (state) state.bossWallContactStartedAtSeconds = null;
      return false;
    }

    const isLevelSeven = level === 7;
    const contactStartClearance = isLevelSeven
      ? LEVEL_SEVEN_WALL_CONTACT_START_CLEARANCE
      : BOSS_WALL_CONTACT_TOUCH_CLEARANCE;
    const releaseGraceSeconds = isLevelSeven
      ? LEVEL_SEVEN_WALL_RELEASE_GRACE_SECONDS
      : BOSS_WALL_CONTACT_GRACE_SECONDS;

    if (!Number.isFinite(state.bossWallContactStartedAtSeconds)) {
      if (wallContactState.clearance <= contactStartClearance) {
        state.bossWallContactStartedAtSeconds = elapsedSeconds;
      } else {
        state.bossWallContactStartedAtSeconds = null;
        return false;
      }
    }

    const contactSeconds = elapsedSeconds - state.bossWallContactStartedAtSeconds;
    if (
      !isLevelSeven &&
      wallContactState.clearance > BOSS_WALL_CONTACT_TOUCH_CLEARANCE &&
      contactSeconds < releaseGraceSeconds
    ) {
      state.bossWallContactStartedAtSeconds = null;
      return false;
    }

    return contactSeconds >= releaseGraceSeconds;
  }

  function getBossWallContactReleaseForce(wallContactState, tuning, steerForceScale, velocity, maxSpeed) {
    if (!wallContactState) return { x: 0, y: 0 };

    const wallVector = getNormalizedVector(wallContactState.forceX, wallContactState.forceY);
    const centerVector = getNormalizedVector(
      wallContactState.centerX - wallContactState.bossX,
      wallContactState.centerY - wallContactState.bossY
    );
    if (wallVector.magnitude <= 0.001 && centerVector.magnitude <= 0.001) return { x: 0, y: 0 };

    const releaseVector = getNormalizedVector(
      wallVector.x + centerVector.x * BOSS_WALL_CONTACT_RELEASE_CENTER_WEIGHT,
      wallVector.y + centerVector.y * BOSS_WALL_CONTACT_RELEASE_CENTER_WEIGHT
    );
    if (releaseVector.magnitude <= 0.001) return { x: 0, y: 0 };

    const lowSpeedFactor = clamp(1 - velocity.speed / Math.max(1, maxSpeed * 0.52), 0, 1);
    const overlapFactor = clamp(
      1 - wallContactState.clearance / Math.max(1, BOSS_WALL_CONTACT_TOUCH_CLEARANCE),
      0,
      1.4
    );
    const strength =
      tuning.steerForce *
      steerForceScale *
      (0.82 + wallContactState.edgeFactor * 0.7 + lowSpeedFactor * 0.28 + overlapFactor * 0.32);

    return {
      x: releaseVector.x * strength,
      y: releaseVector.y * strength,
    };
  }

  function nudgeBossAwayFromWallContact(smartEnemy, wallContactState, releaseForce) {
    if (!smartEnemy || !wallContactState) return;

    const releaseVector = getNormalizedVector(releaseForce.x, releaseForce.y);
    if (releaseVector.magnitude <= 0.001) return;

    const step = clamp(
      (BOSS_WALL_CONTACT_TOUCH_CLEARANCE - wallContactState.clearance) * 0.32,
      0,
      BOSS_WALL_CONTACT_RELEASE_NUDGE_MAX
    );
    if (step <= 0.001) return;

    smartEnemy.setCenterPositionInScene(
      smartEnemy.getCenterXInScene() + releaseVector.x * step,
      smartEnemy.getCenterYInScene() + releaseVector.y * step
    );
  }

  function cancelBossWallDirectedVelocity(physics, releaseForce, velocity) {
    if (!physics || !velocity) return;

    const releaseVector = getNormalizedVector(releaseForce.x, releaseForce.y);
    if (releaseVector.magnitude <= 0.001) return;

    const wallDirectedSpeed = (velocity.x || 0) * releaseVector.x + (velocity.y || 0) * releaseVector.y;
    if (wallDirectedSpeed >= 0) return;

    if (physics.setLinearVelocityX) {
      physics.setLinearVelocityX((velocity.x || 0) - releaseVector.x * wallDirectedSpeed);
    }
    if (physics.setLinearVelocityY) {
      physics.setLinearVelocityY((velocity.y || 0) - releaseVector.y * wallDirectedSpeed);
    }
  }

  function cancelBossThreatDirectedVelocity(physics, smartEnemy, threat, velocity) {
    if (!physics || !smartEnemy || !threat || !velocity) return;

    const escapeVector = getNormalizedVector(
      smartEnemy.getCenterXInScene() - threat.getCenterXInScene(),
      smartEnemy.getCenterYInScene() - threat.getCenterYInScene()
    );
    if (escapeVector.magnitude <= 0.001) return;

    const awaySpeed = (velocity.x || 0) * escapeVector.x + (velocity.y || 0) * escapeVector.y;
    if (awaySpeed >= 0) return;

    if (physics.setLinearVelocityX) {
      physics.setLinearVelocityX((velocity.x || 0) - escapeVector.x * awaySpeed);
    }
    if (physics.setLinearVelocityY) {
      physics.setLinearVelocityY((velocity.y || 0) - escapeVector.y * awaySpeed);
    }
  }

  function enforceBossThreatEscapeVelocity(physics, smartEnemy, threat, maxSpeed) {
    if (!physics || !smartEnemy || !threat) return;

    const escapeVector = getNormalizedVector(
      smartEnemy.getCenterXInScene() - threat.getCenterXInScene(),
      smartEnemy.getCenterYInScene() - threat.getCenterYInScene()
    );
    if (escapeVector.magnitude <= 0.001) return;

    const velocity = getObjectVelocity(smartEnemy);
    const awaySpeed = velocity.x * escapeVector.x + velocity.y * escapeVector.y;
    const minimumAwaySpeed = Math.max(24, maxSpeed * BOSS_LARGE_ENEMY_MIN_AWAY_SPEED_FACTOR);
    if (awaySpeed >= minimumAwaySpeed) return;

    const correction = minimumAwaySpeed - awaySpeed;
    if (physics.setLinearVelocityX) {
      physics.setLinearVelocityX(velocity.x + escapeVector.x * correction);
    }
    if (physics.setLinearVelocityY) {
      physics.setLinearVelocityY(velocity.y + escapeVector.y * correction);
    }
    capPhysicsSpeed(physics, maxSpeed);
  }

  function enforceBossLargeEnemySafety(runtimeScene, state, level) {
    if (!runtimeScene || !isBossLevel(level)) return;
    const enemies = runtimeScene.getObjects("Enemy");
    if (!enemies.length) return;

    const tuning = getSmartEnemyTuning(level);
    const bosses = runtimeScene.getObjects("SmartEnemy");
    for (let i = 0; i < bosses.length; i++) {
      const boss = bosses[i];
      if (!boss?.hasBehavior || !boss.hasBehavior("Physics2")) continue;
      if (isBossStationProjectileKnockbackActive(runtimeScene, boss)) continue;

      const bossSize = Math.max(1, boss.getWidth());
      const sx = boss.getCenterXInScene();
      const sy = boss.getCenterYInScene();
      let nearestThreat = null;
      let nearestDistance = Infinity;
      for (let e = 0; e < enemies.length; e++) {
        const enemy = enemies[e];
        if (!enemy || Math.max(1, enemy.getWidth()) <= bossSize * tuning.threatRatio) continue;
        const distance = Math.hypot(enemy.getCenterXInScene() - sx, enemy.getCenterYInScene() - sy);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestThreat = enemy;
        }
      }
      if (!nearestThreat) continue;

      const bossRadius = getApproxObjectRadius(boss, 20);
      const threatRadius = getApproxObjectRadius(nearestThreat, 20);
      const contactDistance = bossRadius + threatRadius + BOSS_LARGE_ENEMY_SAFETY_PADDING;
      const avoidanceDistance = contactDistance + BOSS_LARGE_ENEMY_SAFETY_LOOKAHEAD;
      if (nearestDistance >= avoidanceDistance) continue;

      let escapeX = sx - nearestThreat.getCenterXInScene();
      let escapeY = sy - nearestThreat.getCenterYInScene();
      if (nearestDistance <= 0.001) {
        const threatId = nearestThreat.getUniqueId ? nearestThreat.getUniqueId() : i + 1;
        const fallbackAngle = threatId * 0.73 + i * 1.19;
        escapeX = Math.cos(fallbackAngle);
        escapeY = Math.sin(fallbackAngle);
      }
      const escapeVector = getNormalizedVector(escapeX, escapeY);
      if (escapeVector.magnitude <= 0.001) continue;

      if (nearestDistance < contactDistance) {
        const separation = contactDistance - nearestDistance + 2;
        moveObjectToCenter(
          boss,
          sx + escapeVector.x * separation,
          sy + escapeVector.y * separation
        );
      }

      const physics = boss.getBehavior("Physics2");
      const velocity = getObjectVelocity(boss);
      const awaySpeed = velocity.x * escapeVector.x + velocity.y * escapeVector.y;
      const pressure = clamp(1 - (nearestDistance - contactDistance) / BOSS_LARGE_ENEMY_SAFETY_LOOKAHEAD, 0, 1);
      const maximumSpeed = Math.max(BOSS_HEADSTART_AVOIDANCE_MIN_SPEED, tuning.maxSpeed);
      const minimumAwaySpeed = maximumSpeed * (0.48 + pressure * 0.34);
      if (awaySpeed < minimumAwaySpeed) {
        const correction = minimumAwaySpeed - awaySpeed;
        if (physics.setLinearVelocityX) {
          physics.setLinearVelocityX(velocity.x + escapeVector.x * correction);
        }
        if (physics.setLinearVelocityY) {
          physics.setLinearVelocityY(velocity.y + escapeVector.y * correction);
        }
        capPhysicsSpeed(physics, maximumSpeed);
      }

      if (state) {
        state.bossEscapeThreat = nearestThreat;
        state.bossEscapeThreatUntilSeconds =
          getElapsedSecondsForState(state) + BOSS_ESCAPE_THREAT_HOLD_SECONDS;
        state.bossLockedTarget = null;
        state.bossLockedTargetUntilSeconds = -Infinity;
      }
    }
  }

  function hasBossImmediatePursuitHazard(runtimeScene, boss, player, enemies, tuning) {
    const bossSize = Math.max(1, boss.getWidth());
    const sx = boss.getCenterXInScene();
    const sy = boss.getCenterYInScene();
    const bossRadius = getApproxObjectRadius(boss, 20);

    if (player && isPlayerThreateningBoss(player, bossSize, tuning)) {
      const playerDistance = Math.hypot(
        player.getCenterXInScene() - sx,
        player.getCenterYInScene() - sy
      );
      if (playerDistance <= getNativeBossThreatEnterDistance(player, player, bossSize)) return true;
    }

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (!enemy || Math.max(1, enemy.getWidth()) <= bossSize * tuning.threatRatio) continue;
      const contactDistance =
        bossRadius +
        getApproxObjectRadius(enemy, 20) +
        BOSS_LARGE_ENEMY_SAFETY_PADDING +
        BOSS_LARGE_ENEMY_SAFETY_LOOKAHEAD;
      const distance = Math.hypot(
        enemy.getCenterXInScene() - sx,
        enemy.getCenterYInScene() - sy
      );
      if (distance < contactDistance) return true;
    }

    return false;
  }

  function enforceBossAggressivePursuit(runtimeScene, state, level, elapsedSeconds) {
    if (!runtimeScene || !state?.smartEnemyActivated || !isBossLevel(level)) return;
    if (!areCustomBossSettingsActive()) return;
    if (isBossHeadStartAvoidanceActive(state, level, elapsedSeconds)) return;

    const boss = runtimeScene.getObjects("SmartEnemy")[0] || null;
    if (!boss?.hasBehavior || !boss.hasBehavior("Physics2")) return;
    if (isBossStationProjectileKnockbackActive(runtimeScene, boss)) return;

    const enemies = runtimeScene.getObjects("Enemy");
    const player = runtimeScene.getObjects("Player")[0] || null;
    const tuning = getSmartEnemyTuning(level);
    const size = Math.max(1, boss.getWidth());
    const sx = boss.getCenterXInScene();
    const sy = boss.getCenterYInScene();
    if (getLevelEightStationOrbAvoidance(runtimeScene, boss, tuning.maxSpeed)?.active) return;
    if (hasBossImmediatePursuitHazard(runtimeScene, boss, player, enemies, tuning)) return;

    const wallContactState = getBossWallContactState(runtimeScene, boss);
    if (wallContactState && wallContactState.clearance <= BOSS_WALL_CONTACT_CLEARANCE) return;

    const lowerBarrierState = level === 4 ? getLevelFourLowerBarrierState(runtimeScene, boss) : null;
    if (lowerBarrierState?.bossBelowBarrier && lowerBarrierState.bossLeftOfExit) return;

    let target = canBossHuntPlayer(player, size, tuning)
      ? player
      : chooseBossGrowthTarget(sx, sy, size, enemies, player, tuning, level, runtimeScene, boss);
    if (!target) return;

    if (target !== player) {
      target = resolveBossChaseTarget(
        runtimeScene,
        state,
        target,
        player,
        size,
        tuning,
        elapsedSeconds,
        sx,
        sy,
        enemies,
        level,
        boss
      );
    }
    if (!target || (target !== player && !isObjectInScene(runtimeScene, target))) return;

    const planetAvoidance =
      level === 6 ? getLevelSixBossPlanetAvoidance(runtimeScene, boss, target, state) : null;
    if (planetAvoidance?.active) return;

    const bossRampState = getBossRampState(level, state, elapsedSeconds);
    const maxSpeed = Math.max(1, tuning.maxSpeed * bossRampState.speedFactor);
    const routeGuidance = getBossStrategicRouteGuidance(
      runtimeScene,
      sx,
      sy,
      target,
      enemies,
      size,
      tuning,
      maxSpeed
    );
    const targetSize = Math.max(1, target.getWidth());
    const targetDistance = Math.hypot(
      target.getCenterXInScene() - sx,
      target.getCenterYInScene() - sy
    );
    const directCommitDistance = getBossAbsorbCommitDistance(size, targetSize);
    const aimPoint =
      targetDistance <= directCommitDistance
        ? { x: target.getCenterXInScene(), y: target.getCenterYInScene() }
        : routeGuidance?.aimPoint || getChaseAimPoint(sx, sy, target, tuning);
    const pursuitVector = getNormalizedVector(aimPoint.x - sx, aimPoint.y - sy);
    if (pursuitVector.magnitude <= 0.001) return;

    const physics = boss.getBehavior("Physics2");
    const desiredSpeed =
      maxSpeed *
      (target === player ? getBossPlayerAttackSpeedFactor(level) : getBossPreyPursuitSpeedFactor(level));
    applyBossVelocityDrive(physics, pursuitVector.x, pursuitVector.y, maxSpeed, getObjectVelocity(boss), {
      desiredSpeed,
      engageSpeed: desiredSpeed,
      blend: getBossFinalPursuitBlend(level),
      force: true,
    });
    capPhysicsSpeed(physics, maxSpeed);

    try {
      boss
        .getVariables()
        .get("MovementTargetAngle")
        .setNumber((Math.atan2(pursuitVector.y, pursuitVector.x) * 180) / Math.PI);
    } catch {
      // Ignore missing runtime variables.
    }
  }

  function shouldLevelSixBossEscapeWallTrap(wallState, velocity, maxSpeed) {
    if (!wallState) return false;

    const movingTooSlow = velocity.speed < maxSpeed * LEVEL_SIX_WALL_TRAP_SPEED_RATIO;
    return (
      wallState.edgeFactor >= LEVEL_SIX_WALL_TRAP_EDGE_FACTOR &&
      (wallState.cornerFactor >= LEVEL_SIX_WALL_TRAP_CORNER_FACTOR || movingTooSlow)
    );
  }

  function getLevelSixBossEscapeForce(wallState, tuning, steerForceScale, velocity, maxSpeed) {
    if (!wallState) return { x: 0, y: 0 };

    const forceMagnitude = Math.max(0.001, Math.hypot(wallState.forceX, wallState.forceY));
    const nx = wallState.forceX / forceMagnitude;
    const ny = wallState.forceY / forceMagnitude;
    const lowSpeedFactor = clamp(1 - velocity.speed / Math.max(1, maxSpeed * LEVEL_SIX_WALL_TRAP_SPEED_RATIO), 0, 1);
    const strength =
      tuning.steerForce *
      steerForceScale *
      (0.78 + wallState.edgeFactor * 0.95 + wallState.cornerFactor * 1.18 + lowSpeedFactor * 0.36);

    return {
      x: nx * strength,
      y: ny * strength,
    };
  }

  function getLevelSixBossUnstickForce(runtimeScene, smartEnemy, wallState, tuning, steerForceScale, elapsedSeconds) {
    if (!runtimeScene || !smartEnemy || !wallState) return { x: 0, y: 0 };

    const sx = smartEnemy.getCenterXInScene();
    const sy = smartEnemy.getCenterYInScene();
    const escapeTargetX = wallState.centerX;
    const escapeTargetY = wallState.centerY;
    const dx = escapeTargetX - sx;
    const dy = escapeTargetY - sy;
    const distance = Math.max(1, Math.hypot(dx, dy));
    const nx = dx / distance;
    const ny = dy / distance;
    const swirlDirection = Math.sin(elapsedSeconds * 0.74 + sx * 0.0011 + sy * 0.0009) >= 0 ? 1 : -1;
    const tangentX = -ny * swirlDirection;
    const tangentY = nx * swirlDirection;
    const wallForceMagnitude = Math.max(0.001, Math.hypot(wallState.forceX, wallState.forceY));
    const wallNx = wallState.forceX / wallForceMagnitude;
    const wallNy = wallState.forceY / wallForceMagnitude;
    const escapeStrength = tuning.steerForce * steerForceScale * (1.18 + wallState.edgeFactor * 0.95 + wallState.cornerFactor * 1.2);
    const wallPushStrength = tuning.steerForce * steerForceScale * (1.22 + wallState.edgeFactor * 0.82 + wallState.cornerFactor * 1.08);
    const swirlStrength = tuning.steerForce * steerForceScale * (0.18 + wallState.edgeFactor * 0.12);

    return {
      x: nx * escapeStrength + wallNx * wallPushStrength + tangentX * swirlStrength,
      y: ny * escapeStrength + wallNy * wallPushStrength + tangentY * swirlStrength,
    };
  }

  function ejectLevelSixBossFromWallTrap(smartEnemy, wallState, maxSpeed, deltaSeconds) {
    if (!smartEnemy || !wallState) return;

    const forceMagnitude = Math.max(0.001, Math.hypot(wallState.forceX, wallState.forceY));
    const nx = wallState.forceX / forceMagnitude;
    const ny = wallState.forceY / forceMagnitude;
    const step = Math.min(34, Math.max(10, 360 * deltaSeconds));
    smartEnemy.setCenterPositionInScene(
      smartEnemy.getCenterXInScene() + nx * step,
      smartEnemy.getCenterYInScene() + ny * step
    );

    if (!smartEnemy.hasBehavior || !smartEnemy.hasBehavior("Physics2")) return;
    const physics = smartEnemy.getBehavior("Physics2");
    if (physics.setLinearVelocityX) physics.setLinearVelocityX(nx * maxSpeed * 0.78);
    if (physics.setLinearVelocityY) physics.setLinearVelocityY(ny * maxSpeed * 0.78);
  }

  function getGeneralBossRestlessForce(
    runtimeScene,
    smartEnemy,
    player,
    tuning,
    steerForceScale,
    elapsedSeconds,
    velocity,
    maxSpeed,
    hasChaseTarget,
    bossGrowthPriorityActive
  ) {
    const bounds = getBossSpawnBounds(runtimeScene, player || smartEnemy);
    const sx = smartEnemy.getCenterXInScene();
    const sy = smartEnemy.getCenterYInScene();
    const centerX = (bounds.minX + bounds.maxX) * 0.5;
    const centerY = (bounds.minY + bounds.maxY) * 0.5;
    const dx = centerX - sx;
    const dy = centerY - sy;
    const distance = Math.max(1, Math.hypot(dx, dy));
    const nx = dx / distance;
    const ny = dy / distance;
    const halfWidth = Math.max(1, (bounds.maxX - bounds.minX) * 0.5);
    const halfHeight = Math.max(1, (bounds.maxY - bounds.minY) * 0.5);
    const edgeExposure = clamp(
      Math.max(Math.abs(sx - centerX) / halfWidth, Math.abs(sy - centerY) / halfHeight),
      0,
      1
    );
    const swirlDirection = Math.sin(elapsedSeconds * 0.42 + sx * 0.0017 + sy * 0.0011) >= 0 ? 1 : -1;
    const tangentX = -ny * swirlDirection;
    const tangentY = nx * swirlDirection;
    const effectiveVelocity = velocity || getObjectVelocity(smartEnemy);
    const effectiveMaxSpeed = Math.max(1, maxSpeed || tuning.maxSpeed);
    const lowSpeedFactor = clamp(
      1 - effectiveVelocity.speed / (effectiveMaxSpeed * BOSS_MOTION_RECOVERY_SPEED_RATIO),
      0,
      1
    );
    const searchMultiplier = !hasChaseTarget ? (bossGrowthPriorityActive ? 1.34 : 1.16) : 1;
    const inwardStrength =
      tuning.steerForce *
      steerForceScale *
      (0.1 + edgeExposure * 0.34 + lowSpeedFactor * 0.22) *
      searchMultiplier;
    const swirlStrength =
      tuning.steerForce *
      steerForceScale *
      (0.12 + lowSpeedFactor * 0.2 + (!hasChaseTarget ? 0.08 : 0) + edgeExposure * 0.06) *
      searchMultiplier;

    let fx = nx * inwardStrength + tangentX * swirlStrength;
    let fy = ny * inwardStrength + tangentY * swirlStrength;

    if (effectiveVelocity.speed < effectiveMaxSpeed * 0.22) {
      fx *= 1.42;
      fy *= 1.42;
    }

    return { x: fx, y: fy, edgeExposure, lowSpeedFactor };
  }

  function getBossHoverEscapeMotion(runtimeScene, smartEnemy, player, elapsedSeconds, maxSpeed) {
    const bounds = getBossSpawnBounds(runtimeScene, player || smartEnemy);
    const sx = smartEnemy.getCenterXInScene();
    const sy = smartEnemy.getCenterYInScene();
    const centerX = (bounds.minX + bounds.maxX) * 0.5;
    const centerY = (bounds.minY + bounds.maxY) * 0.5;
    const dx = centerX - sx;
    const dy = centerY - sy;
    const distance = Math.max(1, Math.hypot(dx, dy));
    const nx = dx / distance;
    const ny = dy / distance;
    const halfWidth = Math.max(1, (bounds.maxX - bounds.minX) * 0.5);
    const halfHeight = Math.max(1, (bounds.maxY - bounds.minY) * 0.5);
    const edgeExposure = clamp(
      Math.max(Math.abs(sx - centerX) / halfWidth, Math.abs(sy - centerY) / halfHeight),
      0,
      1
    );
    const tangentDirection = getStableBossTurnDirection(smartEnemy);
    const tangentX = -ny * tangentDirection;
    const tangentY = nx * tangentDirection;
    const orbitRadius = Math.max(160, Math.min(halfWidth, halfHeight) * 0.55);
    const inwardWeight = distance > orbitRadius ? 0.52 + edgeExposure * 0.48 : 0.18 + edgeExposure * 0.34;
    const tangentWeight = 0.94 + (1 - edgeExposure) * 0.18;
    const fx = nx * inwardWeight + tangentX * tangentWeight;
    const fy = ny * inwardWeight + tangentY * tangentWeight;
    const magnitude = Math.max(0.001, Math.hypot(fx, fy));

    return {
      x: fx / magnitude,
      y: fy / magnitude,
      desiredSpeed: Math.max(80, maxSpeed * (0.36 + edgeExposure * 0.16)),
      edgeExposure,
    };
  }

  function getBossStrategicRouteGuidance(runtimeScene, sx, sy, target, enemies, size, tuning, maxSpeed) {
    const baseAimPoint = getChaseAimPoint(sx, sy, target, tuning);
    if (!enemies || !enemies.length) {
      return { aimPoint: baseAimPoint, forceX: 0, forceY: 0, routeRisk: 0, shouldSuppressChase: false };
    }

    const pathDx = baseAimPoint.x - sx;
    const pathDy = baseAimPoint.y - sy;
    const pathLength = Math.max(1, Math.hypot(pathDx, pathDy));
    const pathNx = pathDx / pathLength;
    const pathNy = pathDy / pathLength;
    const bounds = getBossSpawnBounds(runtimeScene, target);
    const centerX = (bounds.minX + bounds.maxX) * 0.5;
    const centerY = (bounds.minY + bounds.maxY) * 0.5;
    const targetIsPlayer = typeof target.getName === "function" && target.getName() === "Player";

    let forceX = 0;
    let forceY = 0;
    let aimOffsetX = 0;
    let aimOffsetY = 0;
    let routeRisk = 0;

    for (let i = 0; i < enemies.length; i++) {
      const otherEnemy = enemies[i];
      if (!otherEnemy || otherEnemy === target) continue;

      const otherSize = Math.max(1, otherEnemy.getWidth());
      if (targetIsPlayer && otherSize < size * tuning.absorbRatio) {
        const snackVelocity = getObjectVelocity(otherEnemy);
        const snackLeadSeconds = clamp(
          (pathLength / Math.max(160, maxSpeed + snackVelocity.speed)) * 0.12,
          0,
          Math.min(0.34, tuning.maxLeadSeconds)
        );
        const snackX = otherEnemy.getCenterXInScene() + snackVelocity.x * snackLeadSeconds;
        const snackY = otherEnemy.getCenterYInScene() + snackVelocity.y * snackLeadSeconds;
        const snackFromBossX = snackX - sx;
        const snackFromBossY = snackY - sy;
        const alongRoute = snackFromBossX * pathNx + snackFromBossY * pathNy;
        if (alongRoute > size * 0.35 && alongRoute < pathLength - size * 0.15) {
          const closestRouteX = sx + pathNx * alongRoute;
          const closestRouteY = sy + pathNy * alongRoute;
          const routeDistance = Math.hypot(snackX - closestRouteX, snackY - closestRouteY);
          const snackCorridor = Math.max(78, (otherSize + size) * 0.36);
          if (routeDistance <= snackCorridor) {
            const snackDistance = Math.max(1, Math.hypot(snackFromBossX, snackFromBossY));
            const snackCloseness = clamp(1 - routeDistance / snackCorridor, 0, 1);
            const snackProgress = clamp(alongRoute / pathLength, 0, 1);
            const snackValue = clamp(otherSize / Math.max(1, size), 0.16, 0.86);
            const snackWeight = snackCloseness * (0.35 + snackProgress * 0.55) * snackValue;
            const snackForce = tuning.steerForce * 0.24 * snackWeight;
            forceX += (snackFromBossX / snackDistance) * snackForce;
            forceY += (snackFromBossY / snackDistance) * snackForce;
            aimOffsetX += (snackX - closestRouteX) * snackWeight * 0.52;
            aimOffsetY += (snackY - closestRouteY) * snackWeight * 0.52;
          }
        }
        continue;
      }
      if (otherSize <= size * tuning.threatRatio) continue;

      const otherVelocity = getObjectVelocity(otherEnemy);
      const predictiveSeconds = clamp(
        (pathLength / Math.max(160, maxSpeed + otherVelocity.speed)) * Math.max(0.24, tuning.largeEnemyAvoidanceLeadScale),
        0.05,
        tuning.maxLeadSeconds
      );
      const threatX = otherEnemy.getCenterXInScene() + otherVelocity.x * predictiveSeconds;
      const threatY = otherEnemy.getCenterYInScene() + otherVelocity.y * predictiveSeconds;
      const toThreatFromBossX = threatX - sx;
      const toThreatFromBossY = threatY - sy;
      const alongRoute = clamp(toThreatFromBossX * pathNx + toThreatFromBossY * pathNy, 0, pathLength);
      const closestRouteX = sx + pathNx * alongRoute;
      const closestRouteY = sy + pathNy * alongRoute;
      const routeDistance = Math.hypot(threatX - closestRouteX, threatY - closestRouteY);
      const threatRatioDelta = clamp(otherSize / Math.max(1, size * tuning.threatRatio) - 1, 0, 1.8);
      const corridorRadius = Math.max(105, (otherSize + size) * (0.5 + threatRatioDelta * 0.08));
      if (routeDistance > corridorRadius) continue;

      const routeCloseness = clamp(1 - routeDistance / corridorRadius, 0, 1);
      const aheadFactor = clamp(1 - Math.abs(alongRoute - pathLength * 0.56) / Math.max(95, pathLength * 0.56), 0.22, 1);
      const threatDistanceFromBoss = Math.max(1, Math.hypot(sx - threatX, sy - threatY));
      const awayNx = (sx - threatX) / threatDistanceFromBoss;
      const awayNy = (sy - threatY) / threatDistanceFromBoss;

      const leftTangentX = -pathNy;
      const leftTangentY = pathNx;
      const rightTangentX = pathNy;
      const rightTangentY = -pathNx;
      const leftCandidateX = closestRouteX + leftTangentX * corridorRadius;
      const leftCandidateY = closestRouteY + leftTangentY * corridorRadius;
      const rightCandidateX = closestRouteX + rightTangentX * corridorRadius;
      const rightCandidateY = closestRouteY + rightTangentY * corridorRadius;
      const leftCenterDistance = Math.hypot(leftCandidateX - centerX, leftCandidateY - centerY);
      const rightCenterDistance = Math.hypot(rightCandidateX - centerX, rightCandidateY - centerY);
      const tangentX = leftCenterDistance <= rightCenterDistance ? leftTangentX : rightTangentX;
      const tangentY = leftCenterDistance <= rightCenterDistance ? leftTangentY : rightTangentY;

      const forceMagnitude =
        tuning.steerForce *
        tuning.largeEnemyAvoidanceRoutePenaltyScale *
        BOSS_ROUTE_GUIDANCE_FORCE_MULTIPLIER *
        routeCloseness *
        (0.42 + aheadFactor * 0.4 + threatRatioDelta * 0.18);
      forceX += awayNx * forceMagnitude * 0.78 + tangentX * forceMagnitude * BOSS_ROUTE_GUIDANCE_TANGENT_MULTIPLIER;
      forceY += awayNy * forceMagnitude * 0.78 + tangentY * forceMagnitude * BOSS_ROUTE_GUIDANCE_TANGENT_MULTIPLIER;

      aimOffsetX += tangentX * corridorRadius * routeCloseness * 1.08 + awayNx * corridorRadius * routeCloseness * 0.44;
      aimOffsetY += tangentY * corridorRadius * routeCloseness * 1.08 + awayNy * corridorRadius * routeCloseness * 0.44;

      routeRisk += routeCloseness * (0.58 + aheadFactor * 0.72 + threatRatioDelta * 0.36);
    }

    const aimOffsetMagnitude = Math.hypot(aimOffsetX, aimOffsetY);
    const maxAimOffset = Math.max(110, Math.min(pathLength * 0.6, tuning.senseRadius * 0.24));
    if (aimOffsetMagnitude > maxAimOffset) {
      const scale = maxAimOffset / aimOffsetMagnitude;
      aimOffsetX *= scale;
      aimOffsetY *= scale;
    }

    return {
      aimPoint: {
        x: baseAimPoint.x + aimOffsetX,
        y: baseAimPoint.y + aimOffsetY,
      },
      forceX,
      forceY,
      routeRisk: clamp(routeRisk, 0, 2.6),
      shouldSuppressChase: routeRisk >= BOSS_ROUTE_GUIDANCE_SUPPRESS_THRESHOLD,
    };
  }

  function getChaseAimPoint(sx, sy, target, tuning) {
    const tx = target.getCenterXInScene();
    const ty = target.getCenterYInScene();
    const velocity = getObjectVelocity(target);
    const distance = Math.max(1, Math.hypot(tx - sx, ty - sy));
    const leadSeconds = clamp(
      (distance / Math.max(1, tuning.maxSpeed)) * tuning.pursuitLeadScale,
      0,
      tuning.maxLeadSeconds
    );
    return {
      x: tx + velocity.x * leadSeconds,
      y: ty + velocity.y * leadSeconds,
    };
  }

  function applyBossVelocityDrive(
    physics,
    forceX,
    forceY,
    maxSpeed,
    currentVelocity,
    options = {}
  ) {
    if (!physics?.setLinearVelocityX || !physics?.setLinearVelocityY) return;

    const magnitude = Math.hypot(forceX, forceY);
    if (!Number.isFinite(magnitude) || magnitude <= 0.01) return;

    const velocity = currentVelocity || {
      x: physics.getLinearVelocityX ? physics.getLinearVelocityX() : 0,
      y: physics.getLinearVelocityY ? physics.getLinearVelocityY() : 0,
      speed: 0,
    };
    if (!Number.isFinite(velocity.speed)) {
      velocity.speed = Math.hypot(velocity.x || 0, velocity.y || 0);
    }

    const nx = forceX / magnitude;
    const ny = forceY / magnitude;
    const desiredSpeed = clamp(
      options.desiredSpeed ?? maxSpeed * 0.58,
      maxSpeed * 0.18,
      maxSpeed
    );
    const engageSpeed = options.engageSpeed ?? desiredSpeed * 0.82;
    const blend = clamp(options.blend ?? 0.18, 0.05, 0.9);
    const shouldDrive = !!options.force || velocity.speed < engageSpeed;
    if (!shouldDrive) return;

    const desiredVx = nx * desiredSpeed;
    const desiredVy = ny * desiredSpeed;
    const currentVx = Number.isFinite(velocity.x) ? velocity.x : 0;
    const currentVy = Number.isFinite(velocity.y) ? velocity.y : 0;
    physics.setLinearVelocityX(currentVx + (desiredVx - currentVx) * blend);
    physics.setLinearVelocityY(currentVy + (desiredVy - currentVy) * blend);
  }

  function getNormalizedVector(x, y) {
    const magnitude = Math.hypot(x, y);
    if (!Number.isFinite(magnitude) || magnitude <= 0.001) {
      return { x: 0, y: 0, magnitude: 0 };
    }

    return {
      x: x / magnitude,
      y: y / magnitude,
      magnitude,
    };
  }

  function smoothNativeBossForce(state, forceX, forceY, elapsedSeconds, blend) {
    if (!state || !Number.isFinite(forceX) || !Number.isFinite(forceY)) {
      return { x: forceX, y: forceY };
    }

    const previousIsFresh =
      Number.isFinite(state.nativeBossForceUpdatedAtSeconds) &&
      elapsedSeconds - state.nativeBossForceUpdatedAtSeconds <= LEVEL_FOUR_NATIVE_BOSS_FORCE_RESET_SECONDS;
    if (!previousIsFresh) {
      state.nativeBossForceX = forceX;
      state.nativeBossForceY = forceY;
    } else {
      const forceBlend = clamp(blend, 0.05, 0.9);
      state.nativeBossForceX += (forceX - state.nativeBossForceX) * forceBlend;
      state.nativeBossForceY += (forceY - state.nativeBossForceY) * forceBlend;
    }

    state.nativeBossForceUpdatedAtSeconds = elapsedSeconds;
    return {
      x: Number.isFinite(state.nativeBossForceX) ? state.nativeBossForceX : forceX,
      y: Number.isFinite(state.nativeBossForceY) ? state.nativeBossForceY : forceY,
    };
  }

  function isBossHeadStartAvoidanceActive(state, level, elapsedSeconds) {
    if (!isBossLevel(level) || !state || !Number.isFinite(state.bossHeadStartStartedAtSeconds)) return false;
    return elapsedSeconds - state.bossHeadStartStartedAtSeconds < getBossHeadStartSeconds(level);
  }

  function isBossAbsorbProtectionActive(state, level, elapsedSeconds) {
    if (!isBossLevel(level) || !state) return false;
    return !state.smartEnemyActivated || isBossHeadStartAvoidanceActive(state, level, elapsedSeconds);
  }

  function setBossNativeMovementEnabled(smartEnemy, enabled) {
    if (!smartEnemy) return;

    try {
      const vars = smartEnemy.getVariables();
      vars.get("CanMove").setBoolean(enabled);
      if (!enabled) {
        vars.get("ChaseSmallerEnemies").setBoolean(false);
        vars.get("AvoidLargerEnemies").setBoolean(true);
      }
    } catch {
      // Ignore missing runtime variables.
    }
  }

  function getBossHeadStartAvoidanceVector(runtimeScene, boss, player) {
    const sx = boss.getCenterXInScene();
    const sy = boss.getCenterYInScene();
    const px = player.getCenterXInScene();
    const py = player.getCenterYInScene();
    const awayVector = getNormalizedVector(sx - px, sy - py);
    const bounds = getBossSpawnBounds(runtimeScene, player || boss);
    const radius = getApproxObjectRadius(boss, 30);
    const innerMinX = bounds.minX + radius + BOSS_HEADSTART_AVOIDANCE_ARENA_PADDING;
    const innerMaxX = bounds.maxX - radius - BOSS_HEADSTART_AVOIDANCE_ARENA_PADDING;
    const innerMinY = bounds.minY + radius + BOSS_HEADSTART_AVOIDANCE_ARENA_PADDING;
    const innerMaxY = bounds.maxY - radius - BOSS_HEADSTART_AVOIDANCE_ARENA_PADDING;
    const distance = Math.max(1, Math.hypot(sx - px, sy - py));
    const safeDistance = Math.max(
      BOSS_HEADSTART_AVOIDANCE_SAFE_GAP,
      getApproxObjectRadius(player, 28) + radius + BOSS_HEADSTART_AVOIDANCE_SAFE_GAP
    );
    const closeFactor = clamp(1 - distance / safeDistance, 0, 1);
    if (closeFactor <= 0.001) {
      return { forceX: 0, forceY: 0, closeFactor: 0, shouldMove: false };
    }

    const moveDistance = Math.min(220, Math.max(64, safeDistance - distance + 48));
    const directCandidate = {
      x: clamp(sx + awayVector.x * moveDistance, innerMinX, innerMaxX),
      y: clamp(sy + awayVector.y * moveDistance, innerMinY, innerMaxY),
    };
    const tangentX = -awayVector.y;
    const tangentY = awayVector.x;
    const tangentCandidates = [
      {
        x: clamp(sx + tangentX * moveDistance, innerMinX, innerMaxX),
        y: clamp(sy + tangentY * moveDistance, innerMinY, innerMaxY),
      },
      {
        x: clamp(sx - tangentX * moveDistance, innerMinX, innerMaxX),
        y: clamp(sy - tangentY * moveDistance, innerMinY, innerMaxY),
      },
    ];
    const candidates = [directCandidate].concat(tangentCandidates);
    let bestCandidate = { x: sx, y: sy };
    let bestScore = distance;
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      const travel = Math.hypot(candidate.x - sx, candidate.y - sy);
      if (travel <= 1) continue;
      const playerDistance = Math.hypot(candidate.x - px, candidate.y - py);
      const score = playerDistance + (i === 0 ? 20 : 0);
      if (score > bestScore) {
        bestScore = score;
        bestCandidate = candidate;
      }
    }

    const forceX = bestCandidate.x - sx;
    const forceY = bestCandidate.y - sy;
    if (Math.hypot(forceX, forceY) <= 1) {
      return { forceX: 0, forceY: 0, closeFactor, shouldMove: false };
    }

    return {
      forceX,
      forceY,
      closeFactor,
      shouldMove: true,
    };
  }

  function getLevelSevenHeadStartObstacles(runtimeScene, smartEnemy) {
    const obstacles = [];
    const seen = new Set();
    for (const objectName of ["Player", "Enemy", "SmartEnemy"]) {
      const objects = runtimeScene.getObjects(objectName);
      for (let i = 0; i < objects.length; i++) {
        const object = objects[i];
        if (!object || object === smartEnemy) continue;
        const key = typeof object.getUniqueId === "function" ? object.getUniqueId() : object;
        if (seen.has(key)) continue;
        seen.add(key);
        obstacles.push(object);
      }
    }
    const planets = getPlanetObjects(runtimeScene);
    for (let i = 0; i < planets.length; i++) {
      const planet = planets[i];
      const key = typeof planet.getUniqueId === "function" ? planet.getUniqueId() : planet;
      if (seen.has(key)) continue;
      seen.add(key);
      obstacles.push(planet);
    }
    const levelSevenSystem = levelSevenPlanetSystemState.get(runtimeScene);
    const levelSevenSecondaryPlanet = levelSevenSystem?.secondary?.collisionProxy || null;
    if (levelSevenSecondaryPlanet) {
      const key = levelSevenSecondaryPlanet.getUniqueId();
      if (!seen.has(key)) {
        seen.add(key);
        obstacles.push(levelSevenSecondaryPlanet);
      }
    }
    const levelSevenMoons = levelSevenSystem?.moons || [];
    for (let i = 0; i < levelSevenMoons.length; i++) {
      const proxy = levelSevenMoons[i].collisionProxy;
      if (!proxy) continue;
      const key = proxy.getUniqueId();
      if (seen.has(key)) continue;
      seen.add(key);
      obstacles.push(proxy);
    }
    const levelNinePlanets = levelNineBlackHoleSystemState.get(runtimeScene)?.planets || [];
    for (let i = 0; i < levelNinePlanets.length; i++) {
      const proxy = levelNinePlanets[i].collisionProxy;
      if (!proxy) continue;
      const key = proxy.getUniqueId();
      if (seen.has(key)) continue;
      seen.add(key);
      obstacles.push(proxy);
    }
    const levelTenBodies = levelTenSolarSystemState.get(runtimeScene)?.bodies || [];
    for (let i = 0; i < levelTenBodies.length; i++) {
      const proxy = levelTenBodies[i].collisionProxy;
      if (!proxy) continue;
      const key = proxy.getUniqueId();
      if (seen.has(key)) continue;
      seen.add(key);
      obstacles.push(proxy);
    }
    const levelElevenSystem = levelElevenCelestialSystemState.get(runtimeScene);
    const levelElevenBodies = levelElevenSystem
      ? [
          levelElevenSystem.planet,
          ...(levelElevenSystem.planets || []),
          ...(levelElevenSystem.stations || []),
        ]
      : [];
    for (let i = 0; i < levelElevenBodies.length; i++) {
      const proxy = levelElevenBodies[i]?.collisionProxy;
      if (!proxy) continue;
      const key = proxy.getUniqueId();
      if (seen.has(key)) continue;
      seen.add(key);
      obstacles.push(proxy);
    }
    const levelFourSystem = multiplayerLevelFourHoneycombState.get(runtimeScene);
    const levelFourBodies = levelFourSystem
      ? [
          ...(levelFourSystem.planets || []),
          ...(levelFourSystem.stations || []),
          ...(levelFourSystem.triexos || []),
        ]
      : [];
    for (const body of levelFourBodies) {
      const proxy = body?.collisionProxy;
      if (!proxy) continue;
      const key = proxy.getUniqueId();
      if (seen.has(key)) continue;
      seen.add(key);
      obstacles.push(proxy);
    }
    return obstacles;
  }

  function enforceLevelSevenHeadStartClearance(runtimeScene, smartEnemy, physics) {
    const bossRadius = getApproxObjectRadius(smartEnemy, 24);
    const obstacles = getLevelSevenHeadStartObstacles(runtimeScene, smartEnemy);
    let bossX = smartEnemy.getCenterXInScene();
    let bossY = smartEnemy.getCenterYInScene();

    for (let i = 0; i < obstacles.length; i++) {
      const obstacle = obstacles[i];
      const obstacleRadius = getApproxObjectRadius(obstacle, 18);
      const requiredDistance = bossRadius + obstacleRadius + LEVEL_SEVEN_HEADSTART_COLLISION_PADDING;
      let dx = bossX - obstacle.getCenterXInScene();
      let dy = bossY - obstacle.getCenterYInScene();
      let distance = Math.hypot(dx, dy);
      if (distance >= requiredDistance) continue;

      if (distance <= 0.001) {
        const obstacleId = typeof obstacle.getUniqueId === "function" ? obstacle.getUniqueId() : i + 1;
        const fallbackAngle = obstacleId * 0.83 + i * 1.17;
        dx = Math.cos(fallbackAngle);
        dy = Math.sin(fallbackAngle);
        distance = 1;
      }
      const nx = dx / distance;
      const ny = dy / distance;
      bossX = obstacle.getCenterXInScene() + nx * (requiredDistance + 2);
      bossY = obstacle.getCenterYInScene() + ny * (requiredDistance + 2);
      moveObjectToCenter(smartEnemy, bossX, bossY);

      const velocity = getObjectVelocity(smartEnemy);
      const inwardVelocity = velocity.x * nx + velocity.y * ny;
      if (inwardVelocity < 0) {
        if (physics.setLinearVelocityX) physics.setLinearVelocityX(velocity.x - nx * inwardVelocity);
        if (physics.setLinearVelocityY) physics.setLinearVelocityY(velocity.y - ny * inwardVelocity);
      }
    }
  }

  function getLevelSevenHeadStartFigureEightMotion(runtimeScene, smartEnemy, state, elapsedSeconds, maxSpeed) {
    const bossRadius = getApproxObjectRadius(smartEnemy, 24);
    const bounds = getBossSpawnBounds(runtimeScene, smartEnemy);
    const minCenterX =
      bounds.minX + bossRadius + LEVEL_SEVEN_HEADSTART_FIGURE_EIGHT_WIDTH + LEVEL_SEVEN_HEADSTART_COLLISION_PADDING;
    const maxCenterX =
      bounds.maxX - bossRadius - LEVEL_SEVEN_HEADSTART_FIGURE_EIGHT_WIDTH - LEVEL_SEVEN_HEADSTART_COLLISION_PADDING;
    const minCenterY =
      bounds.minY + bossRadius + LEVEL_SEVEN_HEADSTART_FIGURE_EIGHT_HEIGHT + LEVEL_SEVEN_HEADSTART_COLLISION_PADDING;
    const maxCenterY =
      bounds.maxY - bossRadius - LEVEL_SEVEN_HEADSTART_FIGURE_EIGHT_HEIGHT - LEVEL_SEVEN_HEADSTART_COLLISION_PADDING;

    if (!Number.isFinite(state.levelSevenFigureEightCenterX)) {
      state.levelSevenFigureEightCenterX = clampWithinRange(
        smartEnemy.getCenterXInScene(),
        minCenterX,
        maxCenterX
      );
      state.levelSevenFigureEightCenterY = clampWithinRange(
        smartEnemy.getCenterYInScene(),
        minCenterY,
        maxCenterY
      );
      state.levelSevenFigureEightPhase = 0;
      state.levelSevenFigureEightUpdatedAtSeconds = elapsedSeconds;
    }

    const previousSeconds = Number.isFinite(state.levelSevenFigureEightUpdatedAtSeconds)
      ? state.levelSevenFigureEightUpdatedAtSeconds
      : elapsedSeconds;
    const deltaSeconds = clamp(elapsedSeconds - previousSeconds, 0, 0.05);
    state.levelSevenFigureEightUpdatedAtSeconds = elapsedSeconds;

    const obstacles = getLevelSevenHeadStartObstacles(runtimeScene, smartEnemy);
    let anchorPushX = 0;
    let anchorPushY = 0;
    for (let i = 0; i < obstacles.length; i++) {
      const obstacle = obstacles[i];
      const obstacleRadius = getApproxObjectRadius(obstacle, 18);
      const requiredAnchorDistance =
        LEVEL_SEVEN_HEADSTART_FIGURE_EIGHT_WIDTH +
        bossRadius +
        obstacleRadius +
        LEVEL_SEVEN_HEADSTART_COLLISION_PADDING;
      let dx = state.levelSevenFigureEightCenterX - obstacle.getCenterXInScene();
      let dy = state.levelSevenFigureEightCenterY - obstacle.getCenterYInScene();
      let distance = Math.hypot(dx, dy);
      if (distance >= requiredAnchorDistance) continue;
      if (distance <= 0.001) {
        const obstacleId = typeof obstacle.getUniqueId === "function" ? obstacle.getUniqueId() : i + 1;
        const fallbackAngle = obstacleId * 0.71 + i * 1.31;
        dx = Math.cos(fallbackAngle);
        dy = Math.sin(fallbackAngle);
        distance = 1;
      }
      const overlap = requiredAnchorDistance - distance;
      anchorPushX += (dx / distance) * overlap;
      anchorPushY += (dy / distance) * overlap;
    }

    const anchorBlend = clamp(deltaSeconds * 4.2, 0.04, 0.22);
    state.levelSevenFigureEightCenterX = clampWithinRange(
      state.levelSevenFigureEightCenterX + anchorPushX * anchorBlend,
      minCenterX,
      maxCenterX
    );
    state.levelSevenFigureEightCenterY = clampWithinRange(
      state.levelSevenFigureEightCenterY + anchorPushY * anchorBlend,
      minCenterY,
      maxCenterY
    );

    state.levelSevenFigureEightPhase +=
      LEVEL_SEVEN_HEADSTART_FIGURE_EIGHT_ANGULAR_SPEED * deltaSeconds;
    const phase = state.levelSevenFigureEightPhase;
    const targetX =
      state.levelSevenFigureEightCenterX + LEVEL_SEVEN_HEADSTART_FIGURE_EIGHT_WIDTH * Math.sin(phase);
    const targetY =
      state.levelSevenFigureEightCenterY + LEVEL_SEVEN_HEADSTART_FIGURE_EIGHT_HEIGHT * Math.sin(phase * 2);
    const desiredVelocityX =
      LEVEL_SEVEN_HEADSTART_FIGURE_EIGHT_WIDTH *
      LEVEL_SEVEN_HEADSTART_FIGURE_EIGHT_ANGULAR_SPEED *
      Math.cos(phase);
    const desiredVelocityY =
      LEVEL_SEVEN_HEADSTART_FIGURE_EIGHT_HEIGHT *
      LEVEL_SEVEN_HEADSTART_FIGURE_EIGHT_ANGULAR_SPEED *
      2 *
      Math.cos(phase * 2);
    const sx = smartEnemy.getCenterXInScene();
    const sy = smartEnemy.getCenterYInScene();
    let forceX = (targetX - sx) * 2.4 + desiredVelocityX * 0.72;
    let forceY = (targetY - sy) * 2.4 + desiredVelocityY * 0.72;

    for (let i = 0; i < obstacles.length; i++) {
      const obstacle = obstacles[i];
      const obstacleVelocity = getObjectVelocity(obstacle);
      const obstacleX = obstacle.getCenterXInScene() + obstacleVelocity.x * 0.28;
      const obstacleY = obstacle.getCenterYInScene() + obstacleVelocity.y * 0.28;
      const obstacleRadius = getApproxObjectRadius(obstacle, 18);
      const requiredDistance = bossRadius + obstacleRadius + LEVEL_SEVEN_HEADSTART_COLLISION_PADDING;
      let dx = sx - obstacleX;
      let dy = sy - obstacleY;
      let distance = Math.hypot(dx, dy);
      const avoidanceDistance = requiredDistance + LEVEL_SEVEN_HEADSTART_COLLISION_LOOKAHEAD;
      if (distance >= avoidanceDistance) continue;
      if (distance <= 0.001) {
        const fallbackAngle = i * 1.19 + 0.43;
        dx = Math.cos(fallbackAngle);
        dy = Math.sin(fallbackAngle);
        distance = 1;
      }
      const nx = dx / distance;
      const ny = dy / distance;
      const pressure = clamp(1 - (distance - requiredDistance) / LEVEL_SEVEN_HEADSTART_COLLISION_LOOKAHEAD, 0, 1);
      const targetCross = (targetX - sx) * ny - (targetY - sy) * nx;
      const side = targetCross >= 0 ? 1 : -1;
      forceX += nx * pressure * 320 + -ny * side * pressure * 96;
      forceY += ny * pressure * 320 + nx * side * pressure * 96;
    }

    return {
      forceX,
      forceY,
      desiredSpeed: maxSpeed * LEVEL_SEVEN_HEADSTART_FIGURE_EIGHT_SPEED_FACTOR,
    };
  }

  function applyBossHeadStartAvoidance(runtimeScene, state, level, elapsedSeconds, gameplayStarted) {
    if (isBossLevel(level) && !areCustomBossSettingsActive()) return false;
    if (!gameplayStarted || !isBossHeadStartAvoidanceActive(state, level, elapsedSeconds)) return false;

    const players = runtimeScene.getObjects("Player");
    const player = players.length ? players[0] : null;
    if (!player) return false;

    const tuning = getSmartEnemyTuning(level);
    const smartEnemies = runtimeScene.getObjects("SmartEnemy");
    let applied = false;
    for (let i = 0; i < smartEnemies.length; i++) {
      const smartEnemy = smartEnemies[i];
      setBossNativeMovementEnabled(smartEnemy, false);
      if (!smartEnemy.hasBehavior || !smartEnemy.hasBehavior("Physics2")) continue;
      if (isBossStationProjectileKnockbackActive(runtimeScene, smartEnemy)) {
        applied = true;
        continue;
      }

      const physics = smartEnemy.getBehavior("Physics2");
      let velocity = getObjectVelocity(smartEnemy);
      const maxSpeed = clamp(
        tuning.maxSpeed,
        BOSS_HEADSTART_AVOIDANCE_MIN_SPEED,
        BOSS_HEADSTART_AVOIDANCE_MAX_SPEED
      );
      const stationOrbAvoidance = getLevelEightStationOrbAvoidance(runtimeScene, smartEnemy, maxSpeed);
      if (stationOrbAvoidance?.active) {
        state.bossLockedTarget = null;
        state.bossLockedTargetUntilSeconds = -Infinity;
        applyBossVelocityDrive(
          physics,
          stationOrbAvoidance.forceX,
          stationOrbAvoidance.forceY,
          maxSpeed,
          velocity,
          {
            desiredSpeed: Math.min(maxSpeed, stationOrbAvoidance.desiredSpeed),
            engageSpeed: Math.min(maxSpeed, stationOrbAvoidance.desiredSpeed) * 0.92,
            blend: 0.52,
            force: true,
          }
        );
        capPhysicsSpeed(physics, maxSpeed);
        applied = true;
        continue;
      }
      let forceX = 0;
      let forceY = 0;
      let desiredSpeed = maxSpeed * BOSS_HEADSTART_AVOIDANCE_SPEED_SCALE;
      let blend = BOSS_HEADSTART_AVOIDANCE_BLEND;

      const avoidance = getBossHeadStartAvoidanceVector(runtimeScene, smartEnemy, player);
      if (!avoidance.shouldMove) {
        if (physics.setLinearVelocityX) physics.setLinearVelocityX((velocity.x || 0) * 0.72);
        if (physics.setLinearVelocityY) physics.setLinearVelocityY((velocity.y || 0) * 0.72);
        applied = true;
        continue;
      }
      forceX = avoidance.forceX;
      forceY = avoidance.forceY;
      desiredSpeed = clamp(
        tuning.maxSpeed *
          (BOSS_HEADSTART_AVOIDANCE_SPEED_SCALE +
            avoidance.closeFactor * BOSS_HEADSTART_AVOIDANCE_CLOSE_SPEED_BONUS),
        BOSS_HEADSTART_AVOIDANCE_MIN_SPEED,
        maxSpeed
      );

      if (level === 5) {
        const wallContactState = getBossWallContactState(runtimeScene, smartEnemy);
        const wallContactVector = wallContactState
          ? getNormalizedVector(wallContactState.forceX, wallContactState.forceY)
          : { x: 0, y: 0, magnitude: 0 };
        if (wallContactState && wallContactVector.magnitude > 0) {
          const avoidanceVector = getNormalizedVector(forceX, forceY);
          let tangentX = -wallContactVector.y;
          let tangentY = wallContactVector.x;
          const tangentAlignment = tangentX * avoidanceVector.x + tangentY * avoidanceVector.y;
          if (Math.abs(tangentAlignment) <= 0.001) {
            const turnDirection = getStableBossTurnDirection(smartEnemy);
            tangentX *= turnDirection;
            tangentY *= turnDirection;
          } else if (tangentAlignment < 0) {
            tangentX *= -1;
            tangentY *= -1;
          }

          const inwardWeight =
            LEVEL_FIVE_WALL_AVOIDANCE_INWARD_WEIGHT +
            wallContactState.edgeFactor * LEVEL_FIVE_WALL_AVOIDANCE_EDGE_WEIGHT;
          forceX =
            avoidanceVector.x * 0.42 +
            wallContactVector.x * inwardWeight +
            tangentX * LEVEL_FIVE_WALL_AVOIDANCE_TANGENT_WEIGHT;
          forceY =
            avoidanceVector.y * 0.42 +
            wallContactVector.y * inwardWeight +
            tangentY * LEVEL_FIVE_WALL_AVOIDANCE_TANGENT_WEIGHT;
          cancelBossWallDirectedVelocity(physics, { x: forceX, y: forceY }, velocity);
          velocity = getObjectVelocity(smartEnemy);
          desiredSpeed = Math.max(desiredSpeed, maxSpeed * LEVEL_FIVE_WALL_AVOIDANCE_SPEED_FACTOR);
          blend = Math.max(blend, 0.5);
        }
      }

      if (Math.hypot(forceX, forceY) <= 0.001) continue;
      try {
        smartEnemy
          .getVariables()
          .get("MovementTargetAngle")
          .setNumber((Math.atan2(forceY, forceX) * 180) / Math.PI);
      } catch {
        // Ignore missing runtime variables.
      }
      applyBossVelocityDrive(physics, forceX, forceY, maxSpeed, velocity, {
        desiredSpeed,
        engageSpeed: desiredSpeed * 0.9,
        blend,
        force: true,
      });
      capPhysicsSpeed(physics, maxSpeed);
      applied = true;
    }

    if (applied && state) {
      state.bossLockedTarget = null;
      state.bossLockedTargetUntilSeconds = -Infinity;
    }
    return applied;
  }

  function getLifelikeBossLevelSettings(level) {
    if (level === 10) level = 8;
    return LIFELIKE_BOSS_LEVEL_SETTINGS[level] || LIFELIKE_BOSS_LEVEL_SETTINGS[11];
  }

  function getLifelikeBossObstacleCircles(runtimeScene, boss) {
    const circles = [];
    const level = getCurrentLevel(runtimeScene);
    const bossRadius = getApproxObjectRadius(boss, 24);

    const planets = getPlanetObjects(runtimeScene);
    for (let i = 0; i < planets.length; i++) {
      const planet = planets[i];
      const x = planet.getCenterXInScene();
      const y = planet.getCenterYInScene();
      if (!Number.isFinite(x) || !Number.isFinite(y) || Math.abs(x) > 50000 || Math.abs(y) > 50000) continue;
      const primaryLevelSixPlanet = level === 6 ? getLevelSixPrimaryPlanet(runtimeScene, false) : null;
      const radius =
        level === 6 && planet === primaryLevelSixPlanet
          ? getLevelSixPlanetCoreRadius(runtimeScene, planet)
          : getApproxObjectRadius(planet, 20) * 0.94;
      if (radius > 8) circles.push({ x, y, radius, key: `planet-${i}` });
    }

    if (level === 7) {
      const system = levelSevenPlanetSystemState.get(runtimeScene);
      if (system?.secondary?.sprite && !system.secondary.sprite.destroyed) {
        circles.push({
          x: system.secondary.sprite.position.x,
          y: system.secondary.sprite.position.y,
          radius: system.secondary.radius,
          key: "level7-secondary",
        });
      }
      const moons = system?.moons || [];
      for (let i = 0; i < moons.length; i++) {
        const moon = moons[i];
        circles.push({
          x: moon.sprite.position.x,
          y: moon.sprite.position.y,
          radius: moon.radius,
          key: `level7-moon-${i}`,
        });
      }
    }

    if (level === 8) {
      const station = levelEightStationSystemState.get(runtimeScene);
      if (station?.sprite && !station.sprite.destroyed) {
        for (let i = 0; i < LEVEL_EIGHT_STATION_COLLISION_COMPONENTS.length; i++) {
          const component = LEVEL_EIGHT_STATION_COLLISION_COMPONENTS[i];
          if (component.type === "ellipse-ring") {
            circles.push({
              x: station.centerX,
              y: station.centerY + component.offsetY * LEVEL_EIGHT_STATION_SIZE,
              radius: Math.max(component.radiusX, component.radiusY) * LEVEL_EIGHT_STATION_SIZE,
              key: `level8-station-ring-${i}`,
            });
            continue;
          }

          const startY = station.centerY + component.startY * LEVEL_EIGHT_STATION_SIZE;
          const endY = station.centerY + component.endY * LEVEL_EIGHT_STATION_SIZE;
          const samples = Math.max(
            2,
            Math.ceil(
              Math.abs(endY - startY) /
                Math.max(24, component.radius * LEVEL_EIGHT_STATION_SIZE)
            )
          );
          for (let sample = 0; sample <= samples; sample++) {
            const progress = sample / samples;
            circles.push({
              x: station.centerX + component.offsetX * LEVEL_EIGHT_STATION_SIZE,
              y: startY + (endY - startY) * progress,
              radius: component.radius * LEVEL_EIGHT_STATION_SIZE,
              key: `level8-station-capsule-${i}-${sample}`,
            });
          }
        }
      }
    }

    if (level === 9) {
      const system = levelNineBlackHoleSystemState.get(runtimeScene);
      const portals = system?.portals || [];
      for (let i = 0; i < portals.length; i++) {
        const portal = portals[i];
        circles.push({
          x: portal.x,
          y: portal.y,
          radius:
            portal.currentOuterRadius ||
            LEVEL_NINE_BLACK_HOLE_SIZE * LEVEL_NINE_BLACK_HOLE_OUTER_EDGE_RATIO,
          key: `level9-black-hole-${i}`,
          danger: true,
        });
      }
      const smallPlanets = system?.planets || [];
      for (let i = 0; i < smallPlanets.length; i++) {
        const planet = smallPlanets[i];
        circles.push({
          x: planet.sprite.position.x,
          y: planet.sprite.position.y,
          radius: planet.radius,
          key: `level9-small-planet-${i}`,
        });
      }
    }

    if (usesLevelTenRuntime(runtimeScene, level)) {
      const system = levelTenSolarSystemState.get(runtimeScene);
      const bodies = system?.bodies || [];
      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        circles.push({
          x: body.x,
          y: body.y,
          radius: body.radius,
          key: `level10-solar-body-${body.key}`,
        });
      }
    }

    if (usesLevelElevenConfiguration(level)) {
      const system = levelElevenCelestialSystemState.get(runtimeScene);
      const bodies = system
        ? [system.planet, ...(system.planets || []), ...(system.stations || [])]
        : [];
      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        if (!body) continue;
        circles.push({
          x: body.x,
          y: body.y,
          radius: body.radius,
          key: `level11-orbital-body-${i}`,
        });
      }
    }

    return circles.filter((circle) => circle.radius + bossRadius > 0);
  }

  function getLifelikeRouteCircleRisk(startX, startY, endX, endY, circle, padding) {
    const pathX = endX - startX;
    const pathY = endY - startY;
    const pathLengthSq = pathX * pathX + pathY * pathY;
    const routeT =
      pathLengthSq > 1
        ? clamp(((circle.x - startX) * pathX + (circle.y - startY) * pathY) / pathLengthSq, 0, 1)
        : 0;
    const closestX = startX + pathX * routeT;
    const closestY = startY + pathY * routeT;
    const distance = Math.hypot(closestX - circle.x, closestY - circle.y);
    const safeRadius = circle.radius + padding;
    return {
      risk: clamp(1 - distance / Math.max(1, safeRadius), 0, 1),
      routeT,
      closestX,
      closestY,
      distance,
      safeRadius,
    };
  }

  function getLifelikeBossTargetSafetyPenalty(runtimeScene, boss, target, enemies, circles) {
    if (!target) return 0;
    const sx = boss.getCenterXInScene();
    const sy = boss.getCenterYInScene();
    const tx = target.getCenterXInScene();
    const ty = target.getCenterYInScene();
    const bossRadius = getApproxObjectRadius(boss, 24);
    let penalty = 0;

    for (let i = 0; i < circles.length; i++) {
      const route = getLifelikeRouteCircleRisk(
        sx,
        sy,
        tx,
        ty,
        circles[i],
        bossRadius + LIFELIKE_BOSS_OBSTACLE_ROUTE_PADDING
      );
      if (route.routeT > 0.04 && route.routeT < 0.97) {
        penalty += route.risk * (circles[i].danger ? 920 : 520);
      }
    }

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (enemy === target || enemy.getWidth() <= boss.getWidth() * 1.01) continue;
      const dangerRadius = getApproxObjectRadius(enemy, 20) + bossRadius + 92;
      const route = getLifelikeRouteCircleRisk(sx, sy, tx, ty, {
        x: enemy.getCenterXInScene(),
        y: enemy.getCenterYInScene(),
        radius: dangerRadius,
      }, 0);
      if (route.routeT > 0.05 && route.routeT < 0.96) penalty += route.risk * 760;
    }
    return penalty;
  }

  function chooseLifelikeBossForageTarget(runtimeScene, boss, player, enemies, tuning, circles) {
    const sx = boss.getCenterXInScene();
    const sy = boss.getCenterYInScene();
    const size = Math.max(1, boss.getWidth());
    let bestTarget = null;
    let bestScore = -Infinity;

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (!enemy || enemy.getWidth() >= size * tuning.absorbRatio) continue;
      let score = scoreBossEnemyTargetCandidate(
        sx,
        sy,
        size,
        enemy,
        enemies,
        player,
        tuning,
        getCurrentLevel(runtimeScene),
        runtimeScene,
        boss
      );
      if (!Number.isFinite(score)) continue;
      const targetRatio = clamp(enemy.getWidth() / size, 0, 1);
      const distance = Math.hypot(enemy.getCenterXInScene() - sx, enemy.getCenterYInScene() - sy);
      score += targetRatio * 360;
      score -= distance * 0.055;
      score -= getLifelikeBossTargetSafetyPenalty(runtimeScene, boss, enemy, enemies, circles);
      if (score > bestScore) {
        bestScore = score;
        bestTarget = enemy;
      }
    }
    return bestTarget;
  }

  function isLifelikeBossIntentTargetViable(runtimeScene, boss, player, tuning, mode, target) {
    if (mode === "hunt_player") return target === player && canBossHuntPlayer(player, boss.getWidth(), tuning);
    if (mode === "evade") return target === player && isObjectInScene(runtimeScene, player);
    if (mode !== "forage" || !target || !isObjectInScene(runtimeScene, target)) return false;
    return target.getWidth() < boss.getWidth() * tuning.absorbRatio;
  }

  function getLifelikeBossCommitSeconds(boss, elapsedSeconds) {
    const rawId = boss?.getUniqueId?.();
    const numericId = Number(rawId);
    const seed = (Number.isFinite(numericId) ? numericId : 17) * 12.9898 + Math.floor(elapsedSeconds * 2.3) * 0.731;
    const fraction = Math.abs(Math.sin(seed) * 43758.5453) % 1;
    return (
      LIFELIKE_BOSS_TARGET_LOCK_MIN_SECONDS +
      fraction * (LIFELIKE_BOSS_TARGET_LOCK_MAX_SECONDS - LIFELIKE_BOSS_TARGET_LOCK_MIN_SECONDS)
    );
  }

  function setLifelikeBossIntent(state, boss, mode, target, elapsedSeconds, settings, force = false) {
    if (!state) return;
    const sameIntent = state.bossIntentMode === mode && state.bossIntentTarget === target;
    if (sameIntent && !force) return;
    const commitmentSeconds = getLifelikeBossCommitSeconds(boss, elapsedSeconds);
    state.bossIntentMode = mode;
    state.bossIntentTarget = target || null;
    state.bossIntentUntilSeconds =
      mode === "hunt_player" || mode === "escape_hazard"
        ? elapsedSeconds + Math.max(0.55, settings.reactionSeconds * 3)
        : elapsedSeconds + commitmentSeconds;
    state.bossNextDecisionAtSeconds = state.bossIntentUntilSeconds + settings.reactionSeconds;
  }

  function getLifelikeBossSearchAim(runtimeScene, state, boss, elapsedSeconds) {
    const bounds = getBossSpawnBounds(runtimeScene, boss);
    const centerX = (bounds.minX + bounds.maxX) * 0.5;
    const centerY = (bounds.minY + bounds.maxY) * 0.5;
    if (!Number.isFinite(state.bossSearchUntilSeconds) || elapsedSeconds >= state.bossSearchUntilSeconds) {
      const direction = getStableBossTurnDirection(boss);
      state.bossSearchAngle = (Number(state.bossSearchAngle) || 0) + direction * (0.8 + Math.PI * 0.38);
      state.bossSearchUntilSeconds = elapsedSeconds + 2.2;
    }
    const radiusX = Math.max(80, (bounds.maxX - bounds.minX) * LIFELIKE_BOSS_SEARCH_RADIUS_FACTOR);
    const radiusY = Math.max(80, (bounds.maxY - bounds.minY) * LIFELIKE_BOSS_SEARCH_RADIUS_FACTOR);
    return {
      x: centerX + Math.cos(state.bossSearchAngle) * radiusX,
      y: centerY + Math.sin(state.bossSearchAngle) * radiusY,
    };
  }

  function getLifelikeBossMovingHazard(boss, objects, predicate, lookaheadSeconds, padding) {
    const bossX = boss.getCenterXInScene();
    const bossY = boss.getCenterYInScene();
    const bossVelocity = getObjectVelocity(boss);
    const bossRadius = getApproxObjectRadius(boss, 24);
    let best = null;

    for (let i = 0; i < objects.length; i++) {
      const object = objects[i];
      if (!object || object === boss || (predicate && !predicate(object))) continue;
      const objectVelocity = getObjectVelocity(object);
      const relativeX = bossX - object.getCenterXInScene();
      const relativeY = bossY - object.getCenterYInScene();
      const relativeVelocityX = bossVelocity.x - objectVelocity.x;
      const relativeVelocityY = bossVelocity.y - objectVelocity.y;
      const relativeSpeedSq = relativeVelocityX * relativeVelocityX + relativeVelocityY * relativeVelocityY;
      const closestTime =
        relativeSpeedSq > 1
          ? clamp(-(relativeX * relativeVelocityX + relativeY * relativeVelocityY) / relativeSpeedSq, 0, lookaheadSeconds)
          : 0;
      const predictedX = relativeX + relativeVelocityX * closestTime;
      const predictedY = relativeY + relativeVelocityY * closestTime;
      const distance = Math.hypot(predictedX, predictedY);
      const safeDistance = bossRadius + getApproxObjectRadius(object, 6) + padding;
      if (distance >= safeDistance) continue;
      const away = getNormalizedVector(predictedX, predictedY);
      const urgency = clamp(1 - distance / Math.max(1, safeDistance), 0, 1);
      const score = urgency * 2 + (1 - closestTime / Math.max(0.01, lookaheadSeconds));
      if (!best || score > best.score) best = { object, away, urgency, score };
    }
    return best;
  }

  function getLifelikeBossWallHazard(runtimeScene, state, boss, aimPoint, settings, elapsedSeconds) {
    const contact = getBossWallContactState(runtimeScene, boss);
    if (contact && contact.clearance <= BOSS_WALL_CONTACT_TOUCH_CLEARANCE) {
      if (!Number.isFinite(state.bossWallContactStartedAtSeconds)) {
        state.bossWallContactStartedAtSeconds = elapsedSeconds;
      }
      if (elapsedSeconds - state.bossWallContactStartedAtSeconds >= LIFELIKE_BOSS_WALL_ESCAPE_DELAY_SECONDS) {
        state.bossWallEscapeUntilSeconds = elapsedSeconds + LIFELIKE_BOSS_WALL_ESCAPE_DURATION_SECONDS;
      }
    } else if (!contact || contact.clearance > BOSS_WALL_CONTACT_TOUCH_CLEARANCE) {
      state.bossWallContactStartedAtSeconds = null;
    }

    if (elapsedSeconds < state.bossWallEscapeUntilSeconds) {
      const center = getWallsShapeCenter(runtimeScene);
      if (center) {
        const centerVector = getNormalizedVector(
          center.x - boss.getCenterXInScene(),
          center.y - boss.getCenterYInScene()
        );
        const contactVector = contact
          ? getNormalizedVector(contact.forceX, contact.forceY)
          : { x: 0, y: 0, magnitude: 0 };
        const escape = getNormalizedVector(
          centerVector.x + contactVector.x * 1.35,
          centerVector.y + contactVector.y * 1.35
        );
        return { active: true, forceX: escape.x, forceY: escape.y, urgency: 1, hardEscape: true };
      }
    }

    const velocity = getObjectVelocity(boss);
    const bossRadius = getApproxObjectRadius(boss, 24);
    const lookahead = LIFELIKE_BOSS_HAZARD_LOOKAHEAD_SECONDS;
    const predictedX = boss.getCenterXInScene() + velocity.x * lookahead;
    const predictedY = boss.getCenterYInScene() + velocity.y * lookahead;
    const wallsCenter = getWallsShapeCenter(runtimeScene);
    const walls = runtimeScene.getObjects("Walls");
    let best = null;

    for (let i = 0; i < walls.length; i++) {
      const segment = getWallSegmentData(walls[i]);
      if (!segment) continue;
      const clearance = getWallCapsuleClearance(predictedX, predictedY, bossRadius, segment);
      if (clearance > LIFELIKE_BOSS_WALL_LOOKAHEAD_CLEARANCE) continue;
      const closest = getClosestPointOnSegment(predictedX, predictedY, segment);
      if (!closest) continue;
      let inward = getNormalizedVector(predictedX - closest.x, predictedY - closest.y);
      const centerDirection = wallsCenter
        ? getNormalizedVector(wallsCenter.x - segment.centerX, wallsCenter.y - segment.centerY)
        : inward;
      if (inward.magnitude <= 0.001) inward = centerDirection;
      if (inward.x * centerDirection.x + inward.y * centerDirection.y < 0) {
        inward = { x: -inward.x, y: -inward.y, magnitude: inward.magnitude };
      }
      let tangentA = { x: -inward.y, y: inward.x };
      let tangentB = { x: inward.y, y: -inward.x };
      const targetX = (aimPoint?.x ?? predictedX) - boss.getCenterXInScene();
      const targetY = (aimPoint?.y ?? predictedY) - boss.getCenterYInScene();
      const tangent =
        tangentA.x * targetX + tangentA.y * targetY >= tangentB.x * targetX + tangentB.y * targetY
          ? tangentA
          : tangentB;
      const urgency = clamp(1 - clearance / LIFELIKE_BOSS_WALL_LOOKAHEAD_CLEARANCE, 0, 1);
      const force = getNormalizedVector(
        inward.x * (0.9 + urgency * 1.15) + tangent.x * (0.45 + urgency * 0.8),
        inward.y * (0.9 + urgency * 1.15) + tangent.y * (0.45 + urgency * 0.8)
      );
      if (!best || urgency > best.urgency) {
        best = { active: true, forceX: force.x, forceY: force.y, urgency, hardEscape: false };
      }
    }
    return best;
  }

  function getLifelikeBossObstacleHazard(runtimeScene, state, boss, aimPoint, circles) {
    const sx = boss.getCenterXInScene();
    const sy = boss.getCenterYInScene();
    const bossRadius = getApproxObjectRadius(boss, 24);
    const velocity = getObjectVelocity(boss);
    const travelEndX = aimPoint?.x ?? sx + velocity.x * LIFELIKE_BOSS_HAZARD_LOOKAHEAD_SECONDS;
    const travelEndY = aimPoint?.y ?? sy + velocity.y * LIFELIKE_BOSS_HAZARD_LOOKAHEAD_SECONDS;
    let best = null;

    for (let i = 0; i < circles.length; i++) {
      const circle = circles[i];
      const route = getLifelikeRouteCircleRisk(
        sx,
        sy,
        travelEndX,
        travelEndY,
        circle,
        bossRadius + LIFELIKE_BOSS_OBSTACLE_ROUTE_PADDING
      );
      const directDistance = Math.hypot(sx - circle.x, sy - circle.y);
      const currentRisk = clamp(1 - directDistance / Math.max(1, route.safeRadius), 0, 1);
      const urgency = Math.max(currentRisk, route.routeT > 0.02 && route.routeT < 0.96 ? route.risk : 0);
      if (urgency <= 0.02) continue;

      const away = getNormalizedVector(route.closestX - circle.x, route.closestY - circle.y);
      const radial = away.magnitude > 0.001 ? away : getNormalizedVector(sx - circle.x, sy - circle.y);
      const tangentA = { x: -radial.y, y: radial.x };
      const tangentB = { x: radial.y, y: -radial.x };
      const targetX = travelEndX - sx;
      const targetY = travelEndY - sy;
      const preferredTurnSign =
        tangentA.x * targetX + tangentA.y * targetY >= tangentB.x * targetX + tangentB.y * targetY
          ? 1
          : -1;
      const turnSign =
        state.bossAvoidanceObstacleKey === circle.key && state.bossAvoidanceTurnSign !== 0
          ? state.bossAvoidanceTurnSign
          : preferredTurnSign;
      const tangent = turnSign > 0 ? tangentA : tangentB;
      const force = getNormalizedVector(
        radial.x * (0.85 + urgency * 1.35) + tangent.x * (0.62 + urgency * 1.08),
        radial.y * (0.85 + urgency * 1.35) + tangent.y * (0.62 + urgency * 1.08)
      );
      const score = urgency + (circle.danger ? 0.42 : 0);
      if (!best || score > best.score) {
        best = {
          active: true,
          forceX: force.x,
          forceY: force.y,
          urgency,
          score,
          obstacleKey: circle.key,
          turnSign,
        };
      }
    }
    if (best) {
      state.bossAvoidanceObstacleKey = best.obstacleKey;
      state.bossAvoidanceTurnSign = best.turnSign;
    } else {
      state.bossAvoidanceObstacleKey = null;
      state.bossAvoidanceTurnSign = 0;
    }
    return best;
  }

  function blendLifelikeBossHazards(hazards) {
    let forceX = 0;
    let forceY = 0;
    let strongestUrgency = 0;
    let active = false;
    let hardEscape = false;
    for (let i = 0; i < hazards.length; i++) {
      const hazard = hazards[i];
      if (!hazard?.active) continue;
      const weight = 0.65 + (hazard.urgency || 0) * 1.35;
      forceX += hazard.forceX * weight;
      forceY += hazard.forceY * weight;
      strongestUrgency = Math.max(strongestUrgency, hazard.urgency || 0);
      active = true;
      hardEscape = hardEscape || !!hazard.hardEscape;
    }
    const force = getNormalizedVector(forceX, forceY);
    return {
      active: active && force.magnitude > 0.001,
      forceX: force.x,
      forceY: force.y,
      urgency: strongestUrgency,
      hardEscape,
    };
  }

  function steerLifelikeBoss(physics, state, desiredX, desiredY, desiredSpeed, settings, deltaSeconds) {
    const desired = getNormalizedVector(desiredX, desiredY);
    if (desired.magnitude <= 0.001) return;
    const velocity = {
      x: physics.getLinearVelocityX ? physics.getLinearVelocityX() : 0,
      y: physics.getLinearVelocityY ? physics.getLinearVelocityY() : 0,
    };
    const speed = Math.hypot(velocity.x, velocity.y);
    let heading = speed > 8
      ? getNormalizedVector(velocity.x, velocity.y)
      : getNormalizedVector(state.bossHeadingX, state.bossHeadingY);
    if (heading.magnitude <= 0.001) heading = desired;

    const cross = heading.x * desired.y - heading.y * desired.x;
    const dot = clamp(heading.x * desired.x + heading.y * desired.y, -1, 1);
    const angleDelta = Math.atan2(cross, dot);
    const maxTurn = settings.turnRate * clamp(deltaSeconds, 0.001, 0.05);
    const appliedTurn = clamp(angleDelta, -maxTurn, maxTurn);
    const cosine = Math.cos(appliedTurn);
    const sine = Math.sin(appliedTurn);
    const nextHeading = getNormalizedVector(
      heading.x * cosine - heading.y * sine,
      heading.x * sine + heading.y * cosine
    );
    state.bossHeadingX = nextHeading.x;
    state.bossHeadingY = nextHeading.y;

    const alignmentSpeedFactor = 0.62 + clamp((dot + 1) * 0.5, 0, 1) * 0.38;
    const targetSpeed = clamp(desiredSpeed * alignmentSpeedFactor, 0, settings.maxSpeed);
    const acceleration = settings.acceleration * clamp(deltaSeconds, 0.001, 0.05);
    const nextSpeed = speed < targetSpeed
      ? Math.min(targetSpeed, speed + acceleration)
      : Math.max(targetSpeed, speed - acceleration * 1.3);
    physics.setLinearVelocityX(nextHeading.x * nextSpeed);
    physics.setLinearVelocityY(nextHeading.y * nextSpeed);
  }

  function applyLifelikeBossController(runtimeScene, state, level) {
    if (!runtimeScene || !state || !isBossLevel(level)) return;
    const boss = runtimeScene.getObjects("SmartEnemy")[0] || null;
    const player = runtimeScene.getObjects("Player")[0] || null;
    if (!boss?.hasBehavior?.("Physics2") || !player) return;

    const elapsedSeconds = getElapsedSecondsForState(state);
    const deltaSeconds = runtimeScene.getElapsedTime() / 1000;
    if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0) return;
    const physics = boss.getBehavior("Physics2");
    if (elapsedSeconds < (boss.__headSpaceStationOrbKnockbackUntilSeconds || -Infinity)) {
      capPhysicsSpeed(physics, getLifelikeBossLevelSettings(level).maxSpeed * 1.3);
      return;
    }
    if (!Number.isFinite(state.bossHeadStartStartedAtSeconds)) {
      if (physics.setLinearVelocityX) physics.setLinearVelocityX(0);
      if (physics.setLinearVelocityY) physics.setLinearVelocityY(0);
      return;
    }

    const settings = getLifelikeBossLevelSettings(level);
    const tuning = { ...getSmartEnemyTuning(level), maxSpeed: settings.maxSpeed };
    const enemies = runtimeScene.getObjects("Enemy").filter((enemy) => enemy && enemy.getWidth() > 0);
    const circles = getLifelikeBossObstacleCircles(runtimeScene, boss);
    const bossSize = Math.max(1, boss.getWidth());
    const headStartActive = isBossHeadStartAvoidanceActive(state, level, elapsedSeconds);
    const canHuntPlayer = !headStartActive && canBossHuntPlayer(player, bossSize, tuning);
    const playerDistance = Math.hypot(
      player.getCenterXInScene() - boss.getCenterXInScene(),
      player.getCenterYInScene() - boss.getCenterYInScene()
    );
    const playerThreatening = isPlayerThreateningBoss(player, bossSize, tuning);
    const playerEvadeDistance = Math.max(
      LIFELIKE_BOSS_PLAYER_EVADE_MIN_DISTANCE,
      bossSize * LIFELIKE_BOSS_PLAYER_EVADE_DISTANCE_FACTOR
    );
    const currentIntentValid = isLifelikeBossIntentTargetViable(
      runtimeScene,
      boss,
      player,
      tuning,
      state.bossIntentMode,
      state.bossIntentTarget
    );

    if (headStartActive) {
      setLifelikeBossIntent(state, boss, "evade", player, elapsedSeconds, settings);
    } else if (canHuntPlayer) {
      setLifelikeBossIntent(state, boss, "hunt_player", player, elapsedSeconds, settings, true);
    } else if (
      !currentIntentValid ||
      (elapsedSeconds >= state.bossIntentUntilSeconds && elapsedSeconds >= state.bossNextDecisionAtSeconds)
    ) {
      const forageTarget = chooseLifelikeBossForageTarget(runtimeScene, boss, player, enemies, tuning, circles);
      if (playerThreatening && playerDistance <= playerEvadeDistance && !forageTarget) {
        setLifelikeBossIntent(state, boss, "evade", player, elapsedSeconds, settings, true);
      } else {
        setLifelikeBossIntent(state, boss, "forage", forageTarget, elapsedSeconds, settings, true);
      }
    }

    let mode = state.bossIntentMode || "forage";
    let target = state.bossIntentTarget;
    let aimPoint;
    let desiredDirection;
    if (mode === "hunt_player" && player) {
      target = player;
      aimPoint = getChaseAimPoint(boss.getCenterXInScene(), boss.getCenterYInScene(), player, tuning);
      desiredDirection = getNormalizedVector(
        aimPoint.x - boss.getCenterXInScene(),
        aimPoint.y - boss.getCenterYInScene()
      );
    } else if (mode === "forage" && target && isObjectInScene(runtimeScene, target)) {
      aimPoint = getChaseAimPoint(boss.getCenterXInScene(), boss.getCenterYInScene(), target, tuning);
      desiredDirection = getNormalizedVector(
        aimPoint.x - boss.getCenterXInScene(),
        aimPoint.y - boss.getCenterYInScene()
      );
    } else if (mode === "evade" && player) {
      const playerAim = getChaseAimPoint(boss.getCenterXInScene(), boss.getCenterYInScene(), player, tuning);
      desiredDirection = getNormalizedVector(
        boss.getCenterXInScene() - playerAim.x,
        boss.getCenterYInScene() - playerAim.y
      );
      aimPoint = {
        x: boss.getCenterXInScene() + desiredDirection.x * settings.maxSpeed * 2,
        y: boss.getCenterYInScene() + desiredDirection.y * settings.maxSpeed * 2,
      };
    } else {
      aimPoint = getLifelikeBossSearchAim(runtimeScene, state, boss, elapsedSeconds);
      desiredDirection = getNormalizedVector(
        aimPoint.x - boss.getCenterXInScene(),
        aimPoint.y - boss.getCenterYInScene()
      );
      mode = "forage";
    }

    const wallHazard = getLifelikeBossWallHazard(runtimeScene, state, boss, aimPoint, settings, elapsedSeconds);
    const obstacleHazard = getLifelikeBossObstacleHazard(runtimeScene, state, boss, aimPoint, circles);
    const largerEnemyHazard = getLifelikeBossMovingHazard(
      boss,
      enemies,
      (enemy) => enemy.getWidth() >= bossSize * tuning.threatRatio,
      LIFELIKE_BOSS_HAZARD_LOOKAHEAD_SECONDS,
      LIFELIKE_BOSS_THREAT_PADDING
    );
    const emittedHazard = getLifelikeBossMovingHazard(
      boss,
      runtimeScene.getObjects("EmittedMaterial"),
      null,
      LIFELIKE_BOSS_HAZARD_LOOKAHEAD_SECONDS,
      LIFELIKE_BOSS_PROJECTILE_PADDING
    );
    const stationHazard = getLevelEightStationOrbAvoidance(runtimeScene, boss, settings.maxSpeed);
    const dynamicHazards = [];
    if (playerThreatening && playerDistance < playerEvadeDistance) {
      const playerAim = getChaseAimPoint(boss.getCenterXInScene(), boss.getCenterYInScene(), player, tuning);
      const away = getNormalizedVector(
        boss.getCenterXInScene() - playerAim.x,
        boss.getCenterYInScene() - playerAim.y
      );
      dynamicHazards.push({
        active: true,
        forceX: away.x,
        forceY: away.y,
        urgency: clamp(1 - playerDistance / playerEvadeDistance, 0.08, 1),
      });
    }
    if (largerEnemyHazard) {
      dynamicHazards.push({
        active: true,
        forceX: largerEnemyHazard.away.x,
        forceY: largerEnemyHazard.away.y,
        urgency: largerEnemyHazard.urgency,
      });
    }
    if (emittedHazard) {
      dynamicHazards.push({
        active: true,
        forceX: emittedHazard.away.x,
        forceY: emittedHazard.away.y,
        urgency: emittedHazard.urgency,
      });
    }
    if (stationHazard?.active) {
      const stationVector = getNormalizedVector(stationHazard.forceX, stationHazard.forceY);
      dynamicHazards.push({
        active: true,
        forceX: stationVector.x,
        forceY: stationVector.y,
        urgency: clamp(stationHazard.score || 0.7, 0, 1),
      });
    }
    const hazard = blendLifelikeBossHazards([
      wallHazard,
      obstacleHazard,
      ...dynamicHazards,
    ]);

    let steeringX = desiredDirection.x;
    let steeringY = desiredDirection.y;
    let speedFactor =
      mode === "hunt_player"
        ? 0.9 + settings.aggression * 0.1
        : mode === "forage"
          ? 0.76 + settings.aggression * 0.18
          : 0.82 + settings.aggression * 0.12;
    if (headStartActive) speedFactor = 0.72;

    if (hazard.active) {
      state.bossHazardUntilSeconds = elapsedSeconds + LIFELIKE_BOSS_HAZARD_HOLD_SECONDS;
      state.bossHazardForceX = hazard.forceX;
      state.bossHazardForceY = hazard.forceY;
      const hazardWeight = hazard.hardEscape ? 1 : 0.62 + hazard.urgency * 0.72;
      const intentWeight = hazard.hardEscape ? 0.08 : Math.max(0.12, 0.66 - hazard.urgency * 0.48);
      const combined = getNormalizedVector(
        desiredDirection.x * intentWeight + hazard.forceX * hazardWeight,
        desiredDirection.y * intentWeight + hazard.forceY * hazardWeight
      );
      steeringX = combined.x;
      steeringY = combined.y;
      speedFactor = Math.max(speedFactor, hazard.hardEscape ? 0.94 : 0.82 + hazard.urgency * 0.16);
      mode = "escape_hazard";
    } else if (elapsedSeconds < state.bossHazardUntilSeconds) {
      const held = getNormalizedVector(state.bossHazardForceX || 0, state.bossHazardForceY || 0);
      const combined = getNormalizedVector(
        desiredDirection.x * 0.42 + held.x * 0.58,
        desiredDirection.y * 0.42 + held.y * 0.58
      );
      steeringX = combined.x;
      steeringY = combined.y;
      speedFactor = Math.max(speedFactor, 0.82);
      mode = "escape_hazard";
    }

    const minMovingSpeed = settings.maxSpeed * LIFELIKE_BOSS_MIN_MOVING_SPEED_FACTOR;
    const desiredSpeed = Math.max(minMovingSpeed, settings.maxSpeed * speedFactor);
    steerLifelikeBoss(physics, state, steeringX, steeringY, desiredSpeed, settings, deltaSeconds);
    capPhysicsSpeed(physics, settings.maxSpeed);

    try {
      const vars = boss.getVariables();
      vars.get("CanMove").setBoolean(false);
      vars.get("MovementTargetAngle").setNumber((Math.atan2(steeringY, steeringX) * 180) / Math.PI);
      vars.get("BossIntentMode").setString(mode);
    } catch {
      // Ignore missing runtime variables.
    }
    boss.__headSpaceBossIntentMode = mode;
    boss.__headSpaceBossIntentTarget = target || null;
  }

  function applyNativeBossMovementCorrection(runtimeScene, state, level) {
    if (!isBossLevel(level) || !runtimeScene || !state) return;

    const smartEnemies = runtimeScene.getObjects("SmartEnemy");
    if (!smartEnemies.length) return;

    const enemies = runtimeScene.getObjects("Enemy");
    const players = runtimeScene.getObjects("Player");
    const player = players.length ? players[0] : null;
    const tuning = getSmartEnemyTuning(level);
    const elapsedSeconds = getElapsedSecondsForState(state);
    const bossRampState = getBossRampState(level, state, elapsedSeconds);
    const maxSpeed = Math.max(1, tuning.maxSpeed * bossRampState.speedFactor);
    const steerForceScale = bossRampState.forceFactor;

    for (let i = 0; i < smartEnemies.length; i++) {
      const smartEnemy = smartEnemies[i];
      if (!smartEnemy?.hasBehavior || !smartEnemy.hasBehavior("Physics2")) continue;
      if (isBossStationProjectileKnockbackActive(runtimeScene, smartEnemy)) continue;

      const physics = smartEnemy.getBehavior("Physics2");
      const sx = smartEnemy.getCenterXInScene();
      const sy = smartEnemy.getCenterYInScene();
      const size = Math.max(1, smartEnemy.getWidth());
      let velocity = getObjectVelocity(smartEnemy);
      const stationOrbAvoidance = getLevelEightStationOrbAvoidance(runtimeScene, smartEnemy, maxSpeed);
      if (stationOrbAvoidance?.active) {
        state.bossLockedTarget = null;
        state.bossLockedTargetUntilSeconds = -Infinity;
        applyBossVelocityDrive(
          physics,
          stationOrbAvoidance.forceX,
          stationOrbAvoidance.forceY,
          maxSpeed,
          velocity,
          {
            desiredSpeed: stationOrbAvoidance.desiredSpeed,
            engageSpeed: stationOrbAvoidance.desiredSpeed * 0.94,
            blend: 0.54,
            force: true,
          }
        );
        capPhysicsSpeed(physics, maxSpeed);
        continue;
      }
      const bossNeedsGrowth = !!player && !canBossHuntPlayer(player, size, tuning);
      const readyToHuntPlayer = canBossHuntPlayer(player, size, tuning);
      const emergencyLargeThreat = getBossLargeEnemyEmergencyThreat(
        sx,
        sy,
        velocity,
        enemies,
        size,
        tuning,
        maxSpeed
      );
      const candidateThreat =
        emergencyLargeThreat?.enemy || findNativeBossEscapeThreat(sx, sy, size, player, enemies, tuning);
      const resolvedThreat = resolveNativeBossEscapeThreat(
        runtimeScene,
        state,
        candidateThreat,
        player,
        size,
        tuning,
        elapsedSeconds,
        sx,
        sy
      );
      let threat = emergencyLargeThreat?.enemy || resolvedThreat;
      const emergencyLargeThreatActive = !!emergencyLargeThreat && threat === emergencyLargeThreat.enemy;
      if (emergencyLargeThreatActive) {
        state.bossEscapeThreat = threat;
        state.bossEscapeThreatUntilSeconds = elapsedSeconds + BOSS_ESCAPE_THREAT_HOLD_SECONDS;
        state.bossLockedTarget = null;
        state.bossLockedTargetUntilSeconds = -Infinity;
      }
      const candidateGrowthTarget = chooseBossGrowthTarget(
        sx,
        sy,
        size,
        enemies,
        player,
        tuning,
        level,
        runtimeScene,
        smartEnemy
      );
      const growthTarget = bossNeedsGrowth
        ? resolveBossChaseTarget(
            runtimeScene,
            state,
            candidateGrowthTarget,
            player,
            size,
            tuning,
            elapsedSeconds,
            sx,
            sy,
            enemies,
            level,
            smartEnemy
          )
        : candidateGrowthTarget;
      if (level === 4 && threat === player && growthTarget && growthTarget !== player) {
        const playerDistance = Math.hypot(
          player.getCenterXInScene() - sx,
          player.getCenterYInScene() - sy
        );
        const panicDistance = Math.max(
          getApproxObjectRadius(player, 28) +
            getApproxObjectRadius(smartEnemy, 28) +
            LEVEL_FOUR_PLAYER_PANIC_PADDING,
          size * LEVEL_FOUR_PLAYER_PANIC_SIZE_FACTOR
        );
        if (playerDistance > panicDistance) {
          threat = null;
          if (state.bossEscapeThreat === player) {
            state.bossEscapeThreat = null;
            state.bossEscapeThreatUntilSeconds = -Infinity;
          }
        }
      }
      const growthPriorityActive = shouldBossAggressivelyPrioritizeGrowth(player, size, tuning, growthTarget);
      const planetAvoidance =
        level === 6
          ? getLevelSixBossPlanetAvoidance(runtimeScene, smartEnemy, growthTarget || player, state)
          : null;
      const edgeState = getLevelFourBossCornerState(runtimeScene, smartEnemy, player || smartEnemy);
      const wallState = level === 6 ? getLevelSixBossWallState(runtimeScene, smartEnemy) : null;
      const wallContactState = getBossWallContactState(runtimeScene, smartEnemy);
      const lowerBarrierState = level === 4 ? getLevelFourLowerBarrierState(runtimeScene, smartEnemy) : null;
      const wallVector = wallState ? getNormalizedVector(wallState.forceX, wallState.forceY) : { x: 0, y: 0, magnitude: 0 };
      const wallContactVector = wallContactState
        ? getNormalizedVector(wallContactState.forceX, wallContactState.forceY)
        : { x: 0, y: 0, magnitude: 0 };
      const wallTrapActive = level === 6 && !!wallState && shouldLevelSixBossEscapeWallTrap(wallState, velocity, maxSpeed);
      const wallContactReleaseActive = updateBossWallContactReleaseState(
        state,
        wallContactState,
        elapsedSeconds,
        level
      );
      const levelFiveWallAvoidanceActive =
        level === 5 && !!wallContactState && wallContactVector.magnitude > 0;
      const levelSevenWallAvoidanceActive =
        level === 7 && !!wallContactState && wallContactVector.magnitude > 0;
      const lowerBarrierTrapActive =
        !!lowerBarrierState && lowerBarrierState.bossBelowBarrier && lowerBarrierState.bossLeftOfExit;
      const lowMobilityNearWall =
        level === 6 && !!wallState && wallState.edgeFactor >= 0.34 && velocity.speed < maxSpeed * 0.42;
      const mobilityAssistActive =
        level === 4
          ? lowerBarrierTrapActive
          : wallTrapActive ||
            lowMobilityNearWall ||
            levelFiveWallAvoidanceActive ||
            levelSevenWallAvoidanceActive;
      const hasGrowthTarget = !!growthTarget && growthTarget !== player;
      if (
        !threat &&
        !mobilityAssistActive &&
        !wallContactReleaseActive &&
        !planetAvoidance?.active &&
        !growthPriorityActive &&
        !hasGrowthTarget &&
        !readyToHuntPlayer
      ) continue;

      const hoverEscape = getBossHoverEscapeMotion(runtimeScene, smartEnemy, player || smartEnemy, elapsedSeconds, maxSpeed);
      const edgeFactor = edgeState ? edgeState.edgeFactor : 0;
      const cornerFactor = edgeState ? edgeState.cornerFactor : 0;
      const lowSpeedFactor = clamp(1 - velocity.speed / Math.max(1, maxSpeed * 0.52), 0, 1);
      let forceX = 0;
      let forceY = 0;
      let desiredSpeed = maxSpeed * 0.56;
      let blend = 0.22;
      let shouldForceDrive = false;
      let stableGrowthTargetActive = false;

      if (wallContactReleaseActive) {
        const wallReleaseForce = getBossWallContactReleaseForce(
          wallContactState,
          tuning,
          steerForceScale,
          velocity,
          maxSpeed
        );
        if (Math.hypot(wallReleaseForce.x, wallReleaseForce.y) > 0.001) {
          state.bossLockedTarget = null;
          state.bossLockedTargetUntilSeconds = -Infinity;
          nudgeBossAwayFromWallContact(smartEnemy, wallContactState, wallReleaseForce);
          cancelBossWallDirectedVelocity(physics, wallReleaseForce, velocity);
          const releaseVelocity = getObjectVelocity(smartEnemy);
          const desiredReleaseSpeed = clamp(
            maxSpeed * BOSS_WALL_CONTACT_RELEASE_SPEED_FACTOR,
            maxSpeed * 0.62,
            maxSpeed
          );
          applyBossVelocityDrive(physics, wallReleaseForce.x, wallReleaseForce.y, maxSpeed, releaseVelocity, {
            desiredSpeed: desiredReleaseSpeed,
            engageSpeed: desiredReleaseSpeed * 0.96,
            blend: BOSS_WALL_CONTACT_RELEASE_BLEND,
            force: true,
          });
          capPhysicsSpeed(physics, maxSpeed);
          continue;
        }
      }

      if (planetAvoidance?.contactActive) {
        releaseLevelSixBossFromPlanet(smartEnemy, physics, planetAvoidance, velocity);
        const releaseVelocity = getObjectVelocity(smartEnemy);
        const desiredReleaseSpeed = maxSpeed * LEVEL_SIX_BOSS_PLANET_RELEASE_SPEED_FACTOR;
        state.nativeBossForceX = planetAvoidance.forceX;
        state.nativeBossForceY = planetAvoidance.forceY;
        state.nativeBossForceUpdatedAtSeconds = elapsedSeconds;
        applyBossVelocityDrive(
          physics,
          planetAvoidance.forceX,
          planetAvoidance.forceY,
          maxSpeed,
          releaseVelocity,
          {
            desiredSpeed: desiredReleaseSpeed,
            engageSpeed: desiredReleaseSpeed * 0.94,
            blend: LEVEL_SIX_BOSS_PLANET_RELEASE_BLEND,
            force: true,
          }
        );
        capPhysicsSpeed(physics, maxSpeed);
        continue;
      }

      if (threat) {
        if (emergencyLargeThreatActive) {
          cancelBossThreatDirectedVelocity(physics, smartEnemy, threat, velocity);
          enforceBossThreatEscapeVelocity(physics, smartEnemy, threat, maxSpeed);
          velocity = getObjectVelocity(smartEnemy);
        }
        const emergencyEscapeForce = emergencyLargeThreatActive
          ? getBossEmergencyEscapeForce(emergencyLargeThreat, tuning, steerForceScale)
          : null;
        const emergencyEscapeVector = emergencyEscapeForce
          ? getNormalizedVector(emergencyEscapeForce.x, emergencyEscapeForce.y)
          : null;
        const directThreatVector = getNormalizedVector(
          sx - threat.getCenterXInScene(),
          sy - threat.getCenterYInScene()
        );
        const threatVector =
          emergencyEscapeVector && emergencyEscapeVector.magnitude > 0.001
            ? emergencyEscapeVector
            : directThreatVector;
        const threatDistance = Math.max(1, threatVector.magnitude);
        const threatWeight = emergencyLargeThreatActive ? 1.82 : 0.92 + (1 - edgeFactor) * 0.16;
        const escapeWeight = emergencyLargeThreatActive
          ? 0.18 + edgeFactor * 0.7 + cornerFactor * 0.22
          : 0.52 + edgeFactor * 0.88 + cornerFactor * 0.22;
        forceX =
          threatVector.x * threatWeight +
          hoverEscape.x * escapeWeight;
        forceY =
          threatVector.y * threatWeight +
          hoverEscape.y * escapeWeight;

        if (edgeState) {
          const edgePushWeight = 0.36 + edgeFactor * 1.12 + cornerFactor * 0.48 + lowSpeedFactor * 0.22;
          forceX += edgeState.pushX * edgePushWeight;
          forceY += edgeState.pushY * edgePushWeight;
        }

        if (wallVector.magnitude > 0) {
          const wallWeight =
            0.34 +
            (wallState?.edgeFactor || 0) * 0.76 +
            (wallState?.cornerFactor || 0) * 0.28 +
            (wallTrapActive ? 0.36 : 0);
          forceX += wallVector.x * wallWeight;
          forceY += wallVector.y * wallWeight;
        }

        if (lowerBarrierTrapActive) {
          forceX += lowerBarrierState.exitVectorX * (0.82 + lowSpeedFactor * 0.22);
          forceY += lowerBarrierState.exitVectorY * (0.82 + lowSpeedFactor * 0.22);
        }

        let growthPressureApplied = false;
        if (!emergencyLargeThreatActive && growthTarget && growthTarget !== player) {
          const preyVector = getNormalizedVector(
            growthTarget.getCenterXInScene() - sx,
            growthTarget.getCenterYInScene() - sy
          );
          const escapeAlignment = preyVector.x * threatVector.x + preyVector.y * threatVector.y;
          const centerAlignment = preyVector.x * hoverEscape.x + preyVector.y * hoverEscape.y;
          const preyThreatDistance = Math.hypot(
            growthTarget.getCenterXInScene() - threat.getCenterXInScene(),
            growthTarget.getCenterYInScene() - threat.getCenterYInScene()
          );
          const preySize = Math.max(1, growthTarget.getWidth());
          const preyMargin = clamp((size * tuning.absorbRatio - preySize) / Math.max(1, size), 0, 0.4);
          const safeToPressureGrowth =
            escapeAlignment >= 0.04 &&
            (centerAlignment >= -0.2 || preyThreatDistance >= threatDistance * 0.96);

          if (safeToPressureGrowth) {
            const pressureWindow = clamp(
              (threatDistance - Math.max(180, size * 1.45)) / Math.max(180, tuning.senseRadius * 0.42),
              0,
              1
            );
            const growthWeight = growthPriorityActive
              ? BOSS_UNDERSIZED_GROWTH_THREAT_BASE_WEIGHT +
                (level === 5 ? LEVEL_FIVE_GROWTH_THREAT_COMMIT_BONUS : 0) +
                pressureWindow * 0.52 +
                preyMargin * 0.44 +
                Math.max(0, centerAlignment) * 0.2 +
                edgeFactor * 0.1 +
                ((wallState?.edgeFactor || 0) > 0.2 ? 0.08 : 0)
              : 0.12 +
                pressureWindow * 0.34 +
                preyMargin * 0.26 +
                Math.max(0, centerAlignment) * 0.12 +
                edgeFactor * 0.08 +
                ((wallState?.edgeFactor || 0) > 0.2 ? 0.06 : 0);
            forceX += preyVector.x * growthWeight;
            forceY += preyVector.y * growthWeight;
            growthPressureApplied = true;
          }
        }

        desiredSpeed = emergencyLargeThreatActive
          ? maxSpeed * BOSS_LARGE_ENEMY_EMERGENCY_SPEED_FACTOR
          : clamp(
              hoverEscape.desiredSpeed +
                maxSpeed * (edgeFactor * 0.08 + cornerFactor * 0.04 + lowSpeedFactor * 0.06),
              growthPriorityActive ? maxSpeed * 0.52 : maxSpeed * 0.34,
              growthPriorityActive ? maxSpeed * 0.9 : maxSpeed * 0.76
            );
        blend = emergencyLargeThreatActive
          ? BOSS_LARGE_ENEMY_EMERGENCY_TURN_BLEND
          : clamp(
              (growthPriorityActive ? BOSS_UNDERSIZED_GROWTH_DRIVE_BLEND : 0.18) +
                edgeFactor * 0.18 +
                cornerFactor * 0.08 +
                lowSpeedFactor * 0.1 +
                (wallTrapActive ? 0.08 : 0),
              0.16,
              growthPriorityActive ? 0.52 : 0.44
            );
        shouldForceDrive =
          emergencyLargeThreatActive ||
          edgeFactor >= 0.12 ||
          cornerFactor >= 0.08 ||
          lowSpeedFactor >= 0.26 ||
          wallTrapActive;
        if (growthPriorityActive && growthPressureApplied) {
          desiredSpeed = Math.max(desiredSpeed, maxSpeed * BOSS_UNDERSIZED_GROWTH_DRIVE_SPEED_FACTOR);
          blend = Math.max(blend, BOSS_UNDERSIZED_GROWTH_DRIVE_BLEND);
          shouldForceDrive = true;
          stableGrowthTargetActive = true;
        }
      } else {
        const candidateChaseTarget = growthPriorityActive
          ? growthTarget
          : chooseSmartEnemyChaseTarget(
              sx,
              sy,
              size,
              enemies,
              player,
              tuning,
              readyToHuntPlayer,
              level,
              runtimeScene,
              smartEnemy
            );
        const chaseTarget =
          resolveBossChaseTarget(
            runtimeScene,
            state,
            candidateChaseTarget,
            player,
            size,
            tuning,
            elapsedSeconds,
            sx,
            sy,
            enemies,
            level,
            smartEnemy
          );
        const committedGrowthTarget = growthPriorityActive && chaseTarget && chaseTarget !== player;
        stableGrowthTargetActive = !!committedGrowthTarget;
        const chaseTargetSize =
          chaseTarget && chaseTarget !== player && isObjectInScene(runtimeScene, chaseTarget)
            ? Math.max(1, chaseTarget.getWidth())
            : 0;
        const chaseTargetDistance =
          chaseTarget && chaseTarget !== player && isObjectInScene(runtimeScene, chaseTarget)
            ? Math.hypot(chaseTarget.getCenterXInScene() - sx, chaseTarget.getCenterYInScene() - sy)
            : Infinity;
        const absorbCommitDistance =
          chaseTargetSize > 0 ? getBossAbsorbCommitDistance(size, chaseTargetSize) : Infinity;
        const absorbCommitmentActive =
          isBossLevel(level) &&
          chaseTarget &&
          chaseTarget !== player &&
          chaseTargetSize < size * tuning.absorbRatio &&
          chaseTargetDistance <= absorbCommitDistance &&
          !wallTrapActive &&
          !lowerBarrierTrapActive;
        const directPreyCommitmentActive =
          isBossLevel(level) &&
          chaseTarget &&
          chaseTarget !== player &&
          (absorbCommitmentActive ||
            (growthPriorityActive &&
              chaseTargetDistance <= Math.max(absorbCommitDistance * 1.18, tuning.senseRadius * 0.3)));
        const mobilityForce =
          level === 4
            ? getLevelFourBossRestlessForce(
                runtimeScene,
                smartEnemy,
                player || smartEnemy,
                tuning,
                steerForceScale,
                elapsedSeconds,
                velocity,
                maxSpeed
              )
            : getGeneralBossRestlessForce(
                runtimeScene,
                smartEnemy,
                player || smartEnemy,
                tuning,
                steerForceScale,
                elapsedSeconds,
                velocity,
                maxSpeed,
                !!chaseTarget,
                !!(chaseTarget && chaseTarget !== player)
              );
        const mobilityVector = getNormalizedVector(mobilityForce.x, mobilityForce.y);
        const hoverEscapeWeight = directPreyCommitmentActive
          ? 0.04 + edgeFactor * 0.06 + (lowSpeedFactor > 0.32 ? 0.04 : 0)
          : committedGrowthTarget
            ? BOSS_GROWTH_TARGET_HOVER_WEIGHT + edgeFactor * 0.025
          : growthPriorityActive
            ? 0.03 + edgeFactor * 0.045
            : 0.26 + edgeFactor * 0.22;
        forceX += hoverEscape.x * hoverEscapeWeight;
        forceY += hoverEscape.y * hoverEscapeWeight;

        if (mobilityVector.magnitude > 0) {
          const mobilityWeight = directPreyCommitmentActive
            ? 0.03 + lowSpeedFactor * 0.06 + (wallTrapActive ? 0.08 : 0)
            : committedGrowthTarget
              ? BOSS_GROWTH_TARGET_MOBILITY_WEIGHT + lowSpeedFactor * 0.045 + (wallTrapActive ? 0.08 : 0)
            : growthPriorityActive
              ? 0.1 + lowSpeedFactor * 0.08 + (wallTrapActive ? 0.1 : 0)
              : 0.44 + lowSpeedFactor * 0.36 + (wallTrapActive ? 0.18 : 0);
          forceX += mobilityVector.x * mobilityWeight;
          forceY += mobilityVector.y * mobilityWeight;
        }

        if (wallVector.magnitude > 0) {
          const wallWeight =
            0.72 +
            (wallState?.edgeFactor || 0) * 0.88 +
            (wallState?.cornerFactor || 0) * 0.36 +
            lowSpeedFactor * 0.18 +
            (wallTrapActive ? 0.34 : 0);
          forceX += wallVector.x * wallWeight;
          forceY += wallVector.y * wallWeight;
        }

        if (chaseTarget) {
          const chaseAimPoint = absorbCommitmentActive
            ? {
                x: chaseTarget.getCenterXInScene(),
                y: chaseTarget.getCenterYInScene(),
              }
            : getChaseAimPoint(sx, sy, chaseTarget, tuning);
          const chaseVector = getNormalizedVector(chaseAimPoint.x - sx, chaseAimPoint.y - sy);
          const chaseWeight =
            chaseTarget === player
              ? BOSS_PLAYER_ATTACK_PURSUIT_WEIGHT *
                (level === 5 ? LEVEL_FIVE_PLAYER_ATTACK_FORCE_FACTOR : 1)
              : absorbCommitmentActive
                ? BOSS_GROWTH_PURSUIT_FORCE_SCALE *
                  1.54 *
                  (level === 5 ? LEVEL_FIVE_PREY_PURSUIT_FORCE_FACTOR : 1)
                : committedGrowthTarget
                  ? BOSS_GROWTH_PURSUIT_FORCE_SCALE *
                    BOSS_GROWTH_TARGET_PURSUIT_SCALE *
                    clamp(chaseTargetSize / Math.max(1, size), 0.92, 1.2) *
                    (level === 5 ? LEVEL_FIVE_PREY_PURSUIT_FORCE_FACTOR : 1)
                : growthPriorityActive
                  ? BOSS_GROWTH_PURSUIT_FORCE_SCALE * 1.18 * clamp(chaseTargetSize / Math.max(1, size), 0.9, 1.14)
                : 0.76;
          forceX += chaseVector.x * chaseWeight;
          forceY += chaseVector.y * chaseWeight;
        }

        if (lowerBarrierTrapActive && (!chaseTarget || isLevelFourTargetOutsideLowerBarrier(chaseTarget, lowerBarrierState))) {
          forceX += lowerBarrierState.exitVectorX * (0.98 + lowSpeedFactor * 0.24);
          forceY += lowerBarrierState.exitVectorY * (0.98 + lowSpeedFactor * 0.24);
        }

        const attackingPlayer = chaseTarget === player && readyToHuntPlayer;
        const pursuingPrey = !!chaseTarget && chaseTarget !== player;
        desiredSpeed = clamp(
          maxSpeed *
            (attackingPlayer
              ? getBossPlayerAttackSpeedFactor(level)
              : pursuingPrey
                ? getBossPreyPursuitSpeedFactor(level)
                : wallTrapActive
                  ? 0.62
                  : 0.56) +
            maxSpeed * (edgeFactor * 0.08 + lowSpeedFactor * 0.08),
          maxSpeed * 0.34,
          attackingPlayer || pursuingPrey ? maxSpeed : maxSpeed * 0.78
        );
        blend = clamp(
          (attackingPlayer || pursuingPrey
            ? BOSS_COMMITTED_CHASE_BLEND
            : growthPriorityActive
              ? BOSS_UNDERSIZED_GROWTH_DRIVE_BLEND
              : 0.2) +
            edgeFactor * 0.12 +
            cornerFactor * 0.06 +
            lowSpeedFactor * 0.08 +
            (wallTrapActive ? 0.06 : 0),
          0.18,
          attackingPlayer || pursuingPrey ? 0.68 : growthPriorityActive ? 0.5 : 0.44
        );
        shouldForceDrive =
          absorbCommitmentActive ||
          growthPriorityActive ||
          wallTrapActive ||
          lowerBarrierTrapActive ||
          lowMobilityNearWall ||
          !!chaseTarget;
      }

      if (planetAvoidance?.active) {
        forceX += planetAvoidance.forceX;
        forceY += planetAvoidance.forceY;
        desiredSpeed = Math.max(desiredSpeed, maxSpeed * 0.66);
        blend = Math.max(blend, planetAvoidance.routeBlocked ? 0.36 : 0.3);
        shouldForceDrive = true;
      }

      if (levelFiveWallAvoidanceActive) {
        let tangentX = -wallContactVector.y;
        let tangentY = wallContactVector.x;
        const preferredX = threat
          ? sx - threat.getCenterXInScene()
          : growthTarget
            ? growthTarget.getCenterXInScene() - sx
            : tangentX * getStableBossTurnDirection(smartEnemy);
        const preferredY = threat
          ? sy - threat.getCenterYInScene()
          : growthTarget
            ? growthTarget.getCenterYInScene() - sy
            : tangentY * getStableBossTurnDirection(smartEnemy);
        const tangentAlignment = tangentX * preferredX + tangentY * preferredY;
        if (Math.abs(tangentAlignment) <= 0.001) {
          const turnDirection = getStableBossTurnDirection(smartEnemy);
          tangentX *= turnDirection;
          tangentY *= turnDirection;
        } else if (tangentAlignment < 0) {
          tangentX *= -1;
          tangentY *= -1;
        }

        const inwardWeight =
          LEVEL_FIVE_WALL_AVOIDANCE_INWARD_WEIGHT +
          wallContactState.edgeFactor * LEVEL_FIVE_WALL_AVOIDANCE_EDGE_WEIGHT;
        const tangentWeight =
          LEVEL_FIVE_WALL_AVOIDANCE_TANGENT_WEIGHT *
          (0.72 + wallContactState.edgeFactor * 0.38);
        forceX += wallContactVector.x * inwardWeight + tangentX * tangentWeight;
        forceY += wallContactVector.y * inwardWeight + tangentY * tangentWeight;
        desiredSpeed = Math.max(desiredSpeed, maxSpeed * LEVEL_FIVE_WALL_AVOIDANCE_SPEED_FACTOR);
        blend = Math.max(blend, 0.5 + wallContactState.edgeFactor * 0.12);
        shouldForceDrive = true;
      }

      if (levelSevenWallAvoidanceActive) {
        const inwardWeight =
          LEVEL_SEVEN_WALL_AVOIDANCE_BASE_WEIGHT +
          wallContactState.edgeFactor * LEVEL_SEVEN_WALL_AVOIDANCE_EDGE_WEIGHT +
          lowSpeedFactor * 0.32;
        forceX += wallContactVector.x * inwardWeight;
        forceY += wallContactVector.y * inwardWeight;
        desiredSpeed = Math.max(desiredSpeed, maxSpeed * (0.58 + wallContactState.edgeFactor * 0.18));
        blend = Math.max(blend, 0.34 + wallContactState.edgeFactor * 0.12);
        shouldForceDrive = true;
      }

      if (readyToHuntPlayer && !bossNeedsGrowth && player) {
        state.bossLockedTarget = null;
        state.bossLockedTargetUntilSeconds = -Infinity;
      }

      if (Math.hypot(forceX, forceY) <= 0.001) continue;
      if (isBossLevel(level)) {
        const baseSmoothBlend = emergencyLargeThreatActive
          ? BOSS_LARGE_ENEMY_EMERGENCY_TURN_BLEND
          : level === 4
            ? threat
              ? LEVEL_FOUR_NATIVE_BOSS_FORCE_THREAT_BLEND
              : LEVEL_FOUR_NATIVE_BOSS_FORCE_SMOOTH_BLEND
            : threat
              ? BOSS_NATIVE_FORCE_THREAT_BLEND
              : BOSS_NATIVE_FORCE_SMOOTH_BLEND;
        const smoothBlend = emergencyLargeThreatActive
          ? baseSmoothBlend
          : stableGrowthTargetActive
            ? Math.min(baseSmoothBlend, 0.14)
            : baseSmoothBlend;
        const smoothedForce = smoothNativeBossForce(
          state,
          forceX,
          forceY,
          elapsedSeconds,
          smoothBlend
        );
        forceX = smoothedForce.x;
        forceY = smoothedForce.y;
      }
      try {
        smartEnemy
          .getVariables()
          .get("MovementTargetAngle")
          .setNumber((Math.atan2(forceY, forceX) * 180) / Math.PI);
      } catch {
        // Ignore missing runtime variables.
      }
      applyBossVelocityDrive(physics, forceX, forceY, maxSpeed, velocity, {
        desiredSpeed,
        engageSpeed: desiredSpeed * 0.82,
        blend,
        force: shouldForceDrive,
      });
      capPhysicsSpeed(physics, maxSpeed);
    }
  }

  function applySmartEnemySteering(runtimeScene, state, level) {
    if (isBossLevel(level) && areLifelikeBossSettingsActive()) {
      applyLifelikeBossController(runtimeScene, state, level);
      return;
    }
    if (!state.smartEnemyActivated) return;
    if (isBossLevel(level) && areNativeBossSettingsActive()) return;
    if (isBossLevel(level)) {
      applyNativeBossMovementCorrection(runtimeScene, state, level);
      return;
    }

    const deltaSeconds = runtimeScene.getElapsedTime() / 1000;
    if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0) return;

    const smartEnemies = runtimeScene.getObjects("SmartEnemy");
    if (!smartEnemies.length) return;

    const enemies = runtimeScene.getObjects("Enemy");
    const players = runtimeScene.getObjects("Player");
    const player = players.length ? players[0] : null;
    const frameScale = Math.max(0.5, Math.min(2.2, deltaSeconds * 60));
    const elapsedSeconds = getElapsedSecondsForState(state);
    const tuning = getSmartEnemyTuning(level);
    const bossRampState = getBossRampState(level, state, elapsedSeconds);
    const playerHuntDelaySeconds = getBossPlayerHuntDelaySeconds(level);
    const bossAggroElapsedSeconds =
      state && Number.isFinite(state.bossAggroStartedAtSeconds)
        ? Math.max(0, elapsedSeconds - state.bossAggroStartedAtSeconds)
        : Infinity;
    const steerForceScale = bossRampState.forceFactor;
    const maxSpeed = tuning.maxSpeed * bossRampState.speedFactor;
    const evadeForceLimit = tuning.evadeForce * bossRampState.forceFactor;

    for (let i = 0; i < smartEnemies.length; i++) {
      const smartEnemy = smartEnemies[i];
      if (!smartEnemy.hasBehavior || !smartEnemy.hasBehavior("Physics2")) continue;

      const physics = smartEnemy.getBehavior("Physics2");
      const sx = smartEnemy.getCenterXInScene();
      const sy = smartEnemy.getCenterYInScene();
      const size = Math.max(1, smartEnemy.getWidth());
      const velocity = getObjectVelocity(smartEnemy);
      const levelFourCornerState =
        level === 4 ? getLevelFourBossCornerState(runtimeScene, smartEnemy, player || smartEnemy) : null;
      const levelFourHardPocketEscape = level === 4 && isLevelFourBossInTopRightPocket(levelFourCornerState);
      const levelFourUnstickActive =
        level === 4
          ? levelFourHardPocketEscape ||
            updateLevelFourBossUnstickState(state, levelFourCornerState, velocity, maxSpeed, deltaSeconds, elapsedSeconds)
          : false;
      const levelSixWallState = level === 6 ? getLevelSixBossWallState(runtimeScene, smartEnemy) : null;
      const levelSixWallTrapActive =
        level === 6 && shouldLevelSixBossEscapeWallTrap(levelSixWallState, velocity, maxSpeed);
      const levelSixWallUnstickActive =
        level === 6
          ? updateLevelSixBossUnstickState(state, levelSixWallState, velocity, maxSpeed, deltaSeconds, elapsedSeconds)
          : false;
      const readyToHuntPlayer =
        !!player &&
        bossAggroElapsedSeconds >= playerHuntDelaySeconds &&
        canBossHuntPlayer(player, size, tuning);

      const candidateChaseTarget = levelFourUnstickActive || levelSixWallUnstickActive || levelSixWallTrapActive
        ? null
        : chooseSmartEnemyChaseTarget(
            sx,
            sy,
            size,
            enemies,
            player,
            tuning,
            readyToHuntPlayer,
            level,
            runtimeScene,
            smartEnemy
          );
      const chaseTarget =
        isBossLevel(level) && !levelFourUnstickActive && !levelSixWallUnstickActive
          ? resolveBossChaseTarget(
              runtimeScene,
              state,
              candidateChaseTarget,
              player,
              size,
              tuning,
              elapsedSeconds,
              sx,
              sy,
              enemies,
              level,
              smartEnemy
            )
          : candidateChaseTarget;
      const playerSize = player ? Math.max(1, player.getWidth()) : 0;
      const bossGrowthPriorityActive = shouldBossPrioritizeGrowth(level, chaseTarget, player, size, tuning);
      const emergencyLargeThreat =
        isBossLevel(level) && !levelFourUnstickActive && !levelSixWallUnstickActive
          ? getBossLargeEnemyEmergencyThreat(sx, sy, velocity, enemies, size, tuning, maxSpeed)
          : null;
      const emergencyThreatActive = !!emergencyLargeThreat;
      if (emergencyThreatActive && state) {
        state.bossLockedTarget = null;
        state.bossLockedTargetUntilSeconds = -Infinity;
      }
      const chaseTargetSize =
        chaseTarget && chaseTarget !== player && isObjectInScene(runtimeScene, chaseTarget) ? Math.max(1, chaseTarget.getWidth()) : 0;
      const chaseTargetDistance =
        chaseTarget && chaseTarget !== player && isObjectInScene(runtimeScene, chaseTarget)
          ? Math.hypot(chaseTarget.getCenterXInScene() - sx, chaseTarget.getCenterYInScene() - sy)
          : Infinity;
      const absorbCommitmentActive =
        isBossLevel(level) &&
        !emergencyThreatActive &&
        chaseTarget &&
        chaseTarget !== player &&
        chaseTargetSize < size * tuning.absorbRatio &&
        chaseTargetDistance <= getBossAbsorbCommitDistance(size, chaseTargetSize);
      const strategicRouteGuidance =
        isBossLevel(level) && chaseTarget && !levelFourUnstickActive && !levelSixWallUnstickActive && !emergencyThreatActive
          ? getBossStrategicRouteGuidance(runtimeScene, sx, sy, chaseTarget, enemies, size, tuning, maxSpeed)
          : null;

      let fx = 0;
      let fy = 0;

      if (levelFourUnstickActive) {
        if (levelFourHardPocketEscape) {
          ejectLevelFourBossFromPocket(smartEnemy, levelFourCornerState, maxSpeed, deltaSeconds);
        }
        const unstickForce = getLevelFourBossUnstickForce(
          runtimeScene,
          smartEnemy,
          player,
          tuning,
          steerForceScale,
          elapsedSeconds
        );
        fx += unstickForce.x;
        fy += unstickForce.y;
        if (physics.getLinearVelocityX && physics.getLinearVelocityY) {
          const currentVx = physics.getLinearVelocityX();
          const currentVy = physics.getLinearVelocityY();
          const desiredVx = -maxSpeed * 0.5;
          const desiredVy = maxSpeed * 0.34;
          if (physics.setLinearVelocityX) {
            physics.setLinearVelocityX(currentVx + (desiredVx - currentVx) * 0.22);
          }
          if (physics.setLinearVelocityY) {
            physics.setLinearVelocityY(currentVy + (desiredVy - currentVy) * 0.22);
          }
        }
      } else if (levelSixWallUnstickActive) {
        ejectLevelSixBossFromWallTrap(smartEnemy, levelSixWallState, maxSpeed, deltaSeconds);
        const wallUnstickForce = getLevelSixBossUnstickForce(
          runtimeScene,
          smartEnemy,
          levelSixWallState,
          tuning,
          steerForceScale,
          elapsedSeconds
        );
        fx += wallUnstickForce.x;
        fy += wallUnstickForce.y;
      } else if (levelSixWallTrapActive) {
        const wallEscapeForce = getLevelSixBossEscapeForce(levelSixWallState, tuning, steerForceScale, velocity, maxSpeed);
        fx += wallEscapeForce.x;
        fy += wallEscapeForce.y;
      } else if (chaseTarget && !emergencyThreatActive) {
        const chasingPlayer = chaseTarget === player;
        const strategicChaseSuppressed =
          !!strategicRouteGuidance &&
          strategicRouteGuidance.shouldSuppressChase &&
          !absorbCommitmentActive &&
          !chasingPlayer;
        const aimPoint = strategicRouteGuidance?.aimPoint ?? getChaseAimPoint(sx, sy, chaseTarget, tuning);
        const dx = aimPoint.x - sx;
        const dy = aimPoint.y - sy;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const nx = dx / distance;
        const ny = dy / distance;
        const routeRiskFloor =
          chasingPlayer ? 0.42 : absorbCommitmentActive ? 0.52 : strategicChaseSuppressed ? 0.22 : 0.14;
        const approachStrength =
          tuning.steerForce *
          steerForceScale *
          clamp(1 - distance / (tuning.senseRadius * 1.1), 0.2, 1) *
          clamp(
            1 - (strategicRouteGuidance?.routeRisk ?? 0) * 0.38,
            routeRiskFloor,
            1
          ) *
          (bossGrowthPriorityActive ? 1.22 : 1) *
          (absorbCommitmentActive ? 1.16 : 1) *
          (isBossLevel(level) && chaseTarget !== player
            ? BOSS_GROWTH_PURSUIT_FORCE_SCALE * clamp(chaseTargetSize / Math.max(1, size), 0.86, 1.12)
            : chaseTarget === player
              ? BOSS_PLAYER_ATTACK_FORCE_SCALE
              : 1);
        fx += nx * approachStrength;
        fy += ny * approachStrength;

        try {
          smartEnemy.getVariables().get("MovementTargetAngle").setNumber((Math.atan2(dy, dx) * 180) / Math.PI);
        } catch {
          // Ignore missing runtime variables.
        }
      }

      if (strategicRouteGuidance) {
        fx += strategicRouteGuidance.forceX;
        fy += strategicRouteGuidance.forceY;
      }

      if (emergencyThreatActive) {
        const emergencyEscapeForce = getBossEmergencyEscapeForce(emergencyLargeThreat, tuning, steerForceScale);
        fx += emergencyEscapeForce.x;
        fy += emergencyEscapeForce.y;
      }

      if (!levelFourUnstickActive && !levelSixWallUnstickActive && player && (!chaseTarget || player !== chaseTarget)) {
        if (playerSize > size * tuning.threatRatio) {
          const dx = sx - player.getCenterXInScene();
          const dy = sy - player.getCenterYInScene();
          const distance = Math.max(1, Math.hypot(dx, dy));
          if (distance < tuning.senseRadius) {
            const falloff = clamp(1 - distance / tuning.senseRadius, 0, 1);
            const cornerEvadeScale =
              levelFourCornerState === null
                ? 1
                : clamp(1 - levelFourCornerState.edgeFactor * 0.55 - levelFourCornerState.cornerFactor * 0.8, 0.08, 1);
            let evadeScale = 1;
            if (bossGrowthPriorityActive) {
              const panicDistance = Math.max(140, (playerSize + size) * BOSS_GROWTH_PLAYER_PANIC_DISTANCE_RATIO);
              const panicFactor = clamp(1 - distance / panicDistance, 0, 1);
              evadeScale = clamp(0.28 + panicFactor * 0.72, 0.28, 1);
            }
            if (levelFourHardPocketEscape) {
              evadeScale = Math.min(evadeScale, 0.02);
            }
            if (evadeScale > 0.001) {
              fx += (dx / distance) * tuning.evadeForce * steerForceScale * falloff * cornerEvadeScale * evadeScale;
              fy += (dy / distance) * tuning.evadeForce * steerForceScale * falloff * cornerEvadeScale * evadeScale;
            }
          }
        }
      }

      for (let e = 0; !levelFourUnstickActive && !levelSixWallUnstickActive && e < enemies.length; e++) {
        const enemy = enemies[e];
        if (enemy === chaseTarget) continue;
        const enemySize = Math.max(1, enemy.getWidth());
        if (enemySize <= size * tuning.threatRatio) continue;

        const baseDx = sx - enemy.getCenterXInScene();
        const baseDy = sy - enemy.getCenterYInScene();
        const baseDistance = Math.max(1, Math.hypot(baseDx, baseDy));
        const threatSenseRadius = Math.max(150, tuning.senseRadius * tuning.largeEnemyAvoidanceSenseRadiusMultiplier);
        if (baseDistance > threatSenseRadius) continue;

        const enemyVelocity = getObjectVelocity(enemy);
        const predictiveSeconds = clamp(
          (baseDistance / Math.max(160, maxSpeed + enemyVelocity.speed)) * tuning.largeEnemyAvoidanceLeadScale,
          0,
          tuning.maxLeadSeconds
        );
        const predictedEnemyX = enemy.getCenterXInScene() + enemyVelocity.x * predictiveSeconds;
        const predictedEnemyY = enemy.getCenterYInScene() + enemyVelocity.y * predictiveSeconds;
        const dx = sx - predictedEnemyX;
        const dy = sy - predictedEnemyY;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const falloff = clamp(1 - distance / threatSenseRadius, 0, 1);
        const cornerEvadeScale =
          levelFourCornerState === null
            ? 1
            : clamp(1 - levelFourCornerState.edgeFactor * 0.4 - levelFourCornerState.cornerFactor * 0.65, 0.12, 1);
        const threatRatioDelta = clamp(enemySize / Math.max(1, size * tuning.threatRatio) - 1, 0, 1.8);
        const velocityPressure = clamp(enemyVelocity.speed / Math.max(1, tuning.maxSpeed), 0, 1);
        let avoidanceScale =
          tuning.largeEnemyAvoidanceScale * (1 + threatRatioDelta * 0.92 + velocityPressure * 0.28);
        if (bossGrowthPriorityActive) {
          avoidanceScale *= 1.12;
        }
        let sideStepScale =
          tuning.largeEnemyAvoidanceSideStepScale * clamp(0.45 + threatRatioDelta * 0.4 + falloff * 0.35, 0.3, 1.6);
        if (absorbCommitmentActive) {
          const panicDistance = Math.max(120, (enemySize + size) * BOSS_ABSORB_COMMIT_PANIC_DISTANCE_RATIO);
          const unsafeDistance = Math.max(
            panicDistance + 20,
            (enemySize + size) * (BOSS_LARGE_ENEMY_ABSORB_COMMIT_UNSAFE_DISTANCE_RATIO + threatRatioDelta * 0.08)
          );
          const panicFactor = clamp(1 - baseDistance / panicDistance, 0, 1);
          const unsafeFactor = clamp(1 - baseDistance / unsafeDistance, 0, 1);
          if (unsafeFactor > 0.001 || velocityPressure > 0.24) {
            avoidanceScale *= 1 + unsafeFactor * 1.5 + velocityPressure * 0.34;
            sideStepScale *= 1 + unsafeFactor * 0.85 + velocityPressure * 0.18;
          } else {
            if (panicFactor <= 0.001) continue;
            avoidanceScale *= BOSS_ABSORB_COMMIT_AVOIDANCE_SCALE + panicFactor * (1 - BOSS_ABSORB_COMMIT_AVOIDANCE_SCALE);
            sideStepScale *= BOSS_ABSORB_COMMIT_SIDESTEP_SCALE + panicFactor * (1 - BOSS_ABSORB_COMMIT_SIDESTEP_SCALE);
          }
        }
        const radialForce = tuning.evadeForce * steerForceScale * falloff * cornerEvadeScale * avoidanceScale;
        fx += (dx / distance) * radialForce;
        fy += (dy / distance) * radialForce;

        const tangentDirection = enemyVelocity.x * dy - enemyVelocity.y * dx >= 0 ? 1 : -1;
        const tangentX = (-dy / distance) * tangentDirection;
        const tangentY = (dx / distance) * tangentDirection;
        fx += tangentX * radialForce * sideStepScale;
        fy += tangentY * radialForce * sideStepScale;
      }

      if (level === 4) {
        const restlessForce = getLevelFourBossRestlessForce(
          runtimeScene,
          smartEnemy,
          player,
          tuning,
          steerForceScale,
          elapsedSeconds,
          velocity,
          maxSpeed
        );
        const restlessMultiplier = chaseTarget
          ? absorbCommitmentActive
            ? 0.08
            : 0.2
          : bossGrowthPriorityActive
            ? BOSS_GROWTH_SEARCH_FORCE_SCALE
            : 1;
        fx += restlessForce.x * restlessMultiplier;
        fy += restlessForce.y * restlessMultiplier;
      } else if (isBossLevel(level) && !emergencyThreatActive) {
        const restlessForce = getGeneralBossRestlessForce(
          runtimeScene,
          smartEnemy,
          player,
          tuning,
          steerForceScale,
          elapsedSeconds,
          velocity,
          maxSpeed,
          !!chaseTarget,
          bossGrowthPriorityActive
        );
        const restlessMultiplier = chaseTarget
          ? chaseTarget === player
            ? 0.08
            : absorbCommitmentActive
              ? 0.1
              : 0.24
          : bossGrowthPriorityActive
            ? BOSS_GROWTH_SEARCH_FORCE_SCALE
            : 1;
        fx += restlessForce.x * restlessMultiplier;
        fy += restlessForce.y * restlessMultiplier;
      }

      let magnitude = Math.hypot(fx, fy);
      const bossHovering =
        isBossLevel(level) && velocity.speed < maxSpeed * BOSS_HOVER_ESCAPE_SPEED_RATIO;
      if (isBossLevel(level) && (magnitude <= 0.01 || bossHovering)) {
        const hoverEscapeMotion = getBossHoverEscapeMotion(runtimeScene, smartEnemy, player, elapsedSeconds, maxSpeed);
        const fallbackForceScale =
          tuning.steerForce *
          steerForceScale *
          (magnitude <= 0.01 ? 0.9 : 0.48) *
          (bossHovering ? 1.2 : 1);
        fx += hoverEscapeMotion.x * fallbackForceScale;
        fy += hoverEscapeMotion.y * fallbackForceScale;
        magnitude = Math.hypot(fx, fy);

        if (physics.getLinearVelocityX && physics.getLinearVelocityY) {
          applyBossVelocityDrive(
            physics,
            hoverEscapeMotion.x,
            hoverEscapeMotion.y,
            maxSpeed,
            {
              x: physics.getLinearVelocityX(),
              y: physics.getLinearVelocityY(),
              speed: Math.hypot(physics.getLinearVelocityX(), physics.getLinearVelocityY()),
            },
            {
              desiredSpeed: hoverEscapeMotion.desiredSpeed,
              engageSpeed: hoverEscapeMotion.desiredSpeed * 0.92,
              blend: 0.34,
              force: true,
            }
          );
        }
      }

      if (magnitude <= 0.01) continue;

      const cappedForce = magnitude > evadeForceLimit ? evadeForceLimit / magnitude : 1;
      physics.applyForce(
        fx * cappedForce * frameScale,
        fy * cappedForce * frameScale,
        physics.getMassCenterX(),
        physics.getMassCenterY()
      );
      capPhysicsSpeed(physics, maxSpeed);

      if (isBossLevel(level)) {
        const velocityDriveSpeed = emergencyThreatActive
          ? maxSpeed * 0.86
          : levelSixWallUnstickActive
            ? maxSpeed * 0.82
          : levelSixWallTrapActive
            ? maxSpeed * 0.74
          : levelFourHardPocketEscape
            ? maxSpeed * LEVEL_FOUR_HARD_ESCAPE_SPEED_FACTOR
            : chaseTarget === player
              ? maxSpeed * 0.76
              : chaseTarget
                ? maxSpeed * (bossGrowthPriorityActive ? 0.72 : 0.68)
                : !chaseTarget && bossGrowthPriorityActive
                  ? maxSpeed * 0.5
                  : maxSpeed * 0.62;
        applyBossVelocityDrive(
          physics,
          fx,
          fy,
          maxSpeed,
          {
            x: physics.getLinearVelocityX ? physics.getLinearVelocityX() : velocity.x,
            y: physics.getLinearVelocityY ? physics.getLinearVelocityY() : velocity.y,
            speed: Math.hypot(
              physics.getLinearVelocityX ? physics.getLinearVelocityX() : velocity.x,
              physics.getLinearVelocityY ? physics.getLinearVelocityY() : velocity.y
            ),
          },
          {
            desiredSpeed: velocityDriveSpeed,
            engageSpeed: velocityDriveSpeed * 0.78,
            blend: emergencyThreatActive
              ? 0.42
              : levelSixWallUnstickActive
                ? 0.42
                : levelSixWallTrapActive
                  ? 0.34
                  : levelFourHardPocketEscape
                    ? LEVEL_FOUR_HARD_ESCAPE_BLEND
                    : chaseTarget === player
                      ? 0.34
                      : chaseTarget
                        ? 0.3
                        : 0.24,
            force: emergencyThreatActive || levelSixWallUnstickActive || levelSixWallTrapActive || levelFourHardPocketEscape,
          }
        );
      }
    }
  }

  function syncNativeBossBehavior(runtimeScene, level, state) {
    if (!isBossLevel(level)) return;

    if (areNativeBossSettingsActive()) {
      if (state) state.nativeSmartEnemyImpulseCleared = false;
      return;
    }

    try {
      runtimeScene.getScene().getVariables().get("SmartEnemySpeed").setNumber(40);
    } catch {
      // Ignore missing scene variables.
    }

    const smartEnemies = runtimeScene.getObjects("SmartEnemy");
    for (let i = 0; i < smartEnemies.length; i++) {
      const smartEnemy = smartEnemies[i];
      try {
        const vars = smartEnemy.getVariables();
        vars.get("AvoidLargerEnemies").setBoolean(false);
        vars.get("ChaseSmallerEnemies").setBoolean(false);
        vars.get("CanMove").setBoolean(false);
      } catch {
        // Ignore missing runtime variables.
      }
    }

    if (state) state.nativeSmartEnemyImpulseCleared = true;
  }

  function applyPlanetOrbitForces(runtimeScene) {
    const deltaSeconds = runtimeScene.getElapsedTime() / 1000;
    if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0) return;
    const level = getCurrentLevel(runtimeScene);

    const planets = [];
    for (const name of PLANET_NAMES) {
      const objects = runtimeScene.getObjects(name);
      for (let i = 0; i < objects.length; i++) planets.push(objects[i]);
    }
    if (planets.length === 0) return;

    const targets = [];
    for (const name of ORBIT_TARGET_NAMES) {
      const objects = runtimeScene.getObjects(name);
      for (let i = 0; i < objects.length; i++) targets.push(objects[i]);
    }
    if (targets.length === 0) return;

    const frameScale = Math.max(0.4, Math.min(2, deltaSeconds * 60));
    let levelSixEnemySlotByKey = null;
    let levelSixEnemySlotCount = 0;

    if (level === 6) {
      const levelSixEnemies = runtimeScene
        .getObjects("Enemy")
        .filter((enemy) => Math.max(enemy.getWidth ? enemy.getWidth() : 0, enemy.getHeight ? enemy.getHeight() : 0) > 0);
      levelSixEnemies.sort((a, b) => {
        const aId = typeof a.getUniqueId === "function" ? a.getUniqueId() : 0;
        const bId = typeof b.getUniqueId === "function" ? b.getUniqueId() : 0;
        return aId - bId;
      });

      levelSixEnemySlotByKey = new Map();
      for (let i = 0; i < levelSixEnemies.length; i++) {
        levelSixEnemySlotByKey.set(getAbsorbFlashObjectKey(levelSixEnemies[i]), i);
      }
      levelSixEnemySlotCount = levelSixEnemies.length;
    }

    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      if (!target.hasBehavior || !target.hasBehavior("Physics2")) continue;

      if (level === 6 && typeof target.getName === "function" && target.getName() === "SmartEnemy") {
        continue;
      }

      const physics = target.getBehavior("Physics2");
      if (physics.isStatic && physics.isStatic()) continue;

      if (level === 6 && levelSixEnemySlotByKey) {
        const slotIndex = levelSixEnemySlotByKey.get(getAbsorbFlashObjectKey(target));
        if (Number.isFinite(slotIndex)) {
          applyLevelSixEnemySpiralOrbit(runtimeScene, target, physics, slotIndex, levelSixEnemySlotCount, frameScale);
          continue;
        }
      }

      const tx = target.getCenterXInScene();
      const ty = target.getCenterYInScene();
      const velocity = getObjectVelocity(target);
      const targetRadius = getApproxObjectRadius(target, 10);
      let fx = 0;
      let fy = 0;

      for (let p = 0; p < planets.length; p++) {
        const planet = planets[p];
        const dx = planet.getCenterXInScene() - tx;
        const dy = planet.getCenterYInScene() - ty;
        const distanceSq = dx * dx + dy * dy;
        if (distanceSq < 1) continue;

        const distance = Math.sqrt(distanceSq);
        const planetRadius = getApproxObjectRadius(planet, 24);
        const safeRadius = planetRadius + targetRadius * 0.6 + 26;
        const preferredRadius = safeRadius + Math.max(96, planetRadius * 1.05);
        const influenceRadius = preferredRadius + Math.max(220, planetRadius * 2.6);
        if (distance > influenceRadius) continue;

        const invDistance = 1 / distance;
        const nx = dx * invDistance;
        const ny = dy * invDistance;
        const spinDirection = ((planet.getAngle ? planet.getAngle() : 0) % 360) >= 180 ? -1 : 1;
        const tangentX = -ny * spinDirection;
        const tangentY = nx * spinDirection;

        const radialError = distance - preferredRadius;
        const radialVelocity = velocity.x * nx + velocity.y * ny;
        const tangentialVelocity = velocity.x * tangentX + velocity.y * tangentY;
        const orbitBandSpan = Math.max(1, influenceRadius - safeRadius);
        const influenceFactor = clamp(1 - (distance - safeRadius) / orbitBandSpan, 0, 1);
        const influenceWeight = influenceFactor * influenceFactor;

        const springStrength = 9 + planetRadius * 0.11;
        const radialDamping = 2.5 + planetRadius * 0.045;
        const targetOrbitSpeed = clamp(34 + planetRadius * 0.42, 42, 126);
        const tangentialGain = 7 + planetRadius * 0.06;

        let localFx =
          nx * ((radialError * springStrength - radialVelocity * radialDamping) * influenceWeight) +
          tangentX * ((targetOrbitSpeed - tangentialVelocity) * tangentialGain * influenceFactor);
        let localFy =
          ny * ((radialError * springStrength - radialVelocity * radialDamping) * influenceWeight) +
          tangentY * ((targetOrbitSpeed - tangentialVelocity) * tangentialGain * influenceFactor);

        if (distance < safeRadius) {
          const overlapFactor = clamp(1 - distance / Math.max(1, safeRadius), 0, 1);
          const repel = (1200 + planetRadius * 18) * overlapFactor * overlapFactor;
          localFx -= nx * repel;
          localFy -= ny * repel;
        }

        fx += localFx;
        fy += localFy;
      }

      const magnitude = Math.hypot(fx, fy);
      if (magnitude < 0.001) continue;
      const maxForce = 5200;
      const forceScale = magnitude > maxForce ? maxForce / magnitude : 1;
      physics.applyForce(
        fx * forceScale * frameScale,
        fy * forceScale * frameScale,
        physics.getMassCenterX(),
        physics.getMassCenterY()
      );
    }
  }

  function applyEnemyWriggle(runtimeScene) {}

  function applyEnemyPhysicsTuning(runtimeScene, level) {
    const enemies = runtimeScene.getObjects("Enemy");
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (!enemy.hasBehavior || !enemy.hasBehavior("Physics2")) continue;
      const physics = enemy.getBehavior("Physics2");
      if (physics.setRestitution) physics.setRestitution(ENEMY_RESTITUTION);
      if (physics.setLinearDamping) physics.setLinearDamping(ENEMY_LINEAR_DAMPING);
    }

    const bossLevel = isBossLevel(level);
    const smartEnemyTuning = getSmartEnemyTuning(level);
    const smartEnemies = runtimeScene.getObjects("SmartEnemy");
    for (let i = 0; i < smartEnemies.length; i++) {
      const smartEnemy = smartEnemies[i];
      if (!smartEnemy.hasBehavior || !smartEnemy.hasBehavior("Physics2")) continue;
      const physics = smartEnemy.getBehavior("Physics2");
      if (physics.setRestitution) physics.setRestitution(ENEMY_RESTITUTION);
      if (physics.setLinearDamping) {
        physics.setLinearDamping(smartEnemyTuning.linearDamping);
      }
      if (physics.setFixedRotation) physics.setFixedRotation(bossLevel);
      if (physics.setAngularDamping) physics.setAngularDamping(bossLevel ? BOSS_ANGULAR_DAMPING : 0);
      if (bossLevel && physics.setAngularVelocity) physics.setAngularVelocity(0);
    }
  }

  function stabilizeBossRotation(runtimeScene, level) {
    if (!isBossLevel(level)) return;

    const smartEnemies = runtimeScene.getObjects("SmartEnemy");
    for (let i = 0; i < smartEnemies.length; i++) {
      const smartEnemy = smartEnemies[i];
      if (smartEnemy.hasBehavior && smartEnemy.hasBehavior("Physics2")) {
        const physics = smartEnemy.getBehavior("Physics2");
        if (physics.setFixedRotation) physics.setFixedRotation(true);
        if (physics.setAngularDamping) physics.setAngularDamping(BOSS_ANGULAR_DAMPING);
        if (physics.setAngularVelocity) physics.setAngularVelocity(0);
      }

      if (typeof smartEnemy.setAngle === "function" && Math.abs(smartEnemy.getAngle()) > 0.01) {
        smartEnemy.setAngle(0);
      }
    }

    const images = runtimeScene.getObjects("SmartEnemyImage");
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      if (typeof image.setAngle === "function" && Math.abs(image.getAngle()) > 0.01) {
        image.setAngle(0);
      }
    }
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function setObjectSizeAndShape(object, size) {
    if (!object || !Number.isFinite(size) || size <= 0) return;
    object.setSize(size, size);
    if (!object.hasBehavior || !object.hasBehavior("Physics2")) return;
    const physics = object.getBehavior("Physics2");
    if (physics.setShapeScale) physics.setShapeScale(object.getScaleX());
  }

  function ensureEnemySizeVariety(runtimeScene, state) {
    if (state.enemySizeInitialized) return;

    const enemies = runtimeScene
      .getObjects("Enemy")
      .filter((enemy) => enemy.getWidth() > 0 && !isLevelTwelveCosmicAlien(enemy));

    if (enemies.length <= 1) {
      state.enemySizeInitialized = true;
      return;
    }

    const sizes = enemies.map((enemy) => enemy.getWidth());
    const minSize = Math.min(...sizes);
    const maxSize = Math.max(...sizes);
    const alreadyVaried = maxSize - minSize >= 18;
    if (alreadyVaried) {
      state.enemySizeInitialized = true;
      return;
    }

    const players = runtimeScene.getObjects("Player");
    const playerWidth = players.length ? players[0].getWidth() : 140;
    const level = getCurrentLevel(runtimeScene);
    const baseRatios =
      level === 1
        ? [0.48, 0.56, 0.64, 0.72, 0.78, 0.69]
        : [0.7, 0.85, 1.0, 1.18, 1.33, 0.62, 1.45, 0.94];

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const ratioIndex = (i + level * 3) % baseRatios.length;
      const jitter = (((i * 17 + level * 11) % 7) - 3) * 0.03;
      const ratio = baseRatios[ratioIndex] + jitter;
      const levelOneMax = level === 1 ? playerWidth * 0.82 : 360;
      const targetSize = clamp(playerWidth * ratio, 58, levelOneMax);
      setObjectSizeAndShape(enemy, targetSize);
    }

    state.enemySizeInitialized = true;
  }

  function getLevelFiveEnemyLayoutPoint(bounds, enemyRadius, fraction) {
    const minX = bounds.minX + enemyRadius + BOSS_START_BOUNDARY_PADDING;
    const maxX = bounds.maxX - enemyRadius - BOSS_START_BOUNDARY_PADDING;
    const minY = bounds.minY + enemyRadius + BOSS_START_BOUNDARY_PADDING;
    const maxY = bounds.maxY - enemyRadius - BOSS_START_BOUNDARY_PADDING;
    return {
      x: minX + (maxX - minX) * fraction[0],
      y: minY + (maxY - minY) * fraction[1],
      minX,
      maxX,
      minY,
      maxY,
    };
  }

  function getLevelFiveCandidateClearance(candidate, enemyRadius, avoidCenters) {
    let nearestClearance = Infinity;
    let hardClearance = Infinity;
    for (let j = 0; j < avoidCenters.length; j++) {
      const avoid = avoidCenters[j];
      const clearance = Math.hypot(candidate.x - avoid.x, candidate.y - avoid.y) - avoid.radius - enemyRadius;
      nearestClearance = Math.min(nearestClearance, clearance);
      if (avoid.hard) hardClearance = Math.min(hardClearance, clearance);
    }

    if (!Number.isFinite(nearestClearance)) nearestClearance = Infinity;
    if (!Number.isFinite(hardClearance)) hardClearance = nearestClearance;
    return { nearestClearance, hardClearance };
  }

  function isLevelFiveCandidateUsable(candidate, enemyRadius, avoidCenters) {
    const clearance = getLevelFiveCandidateClearance(candidate, enemyRadius, avoidCenters);
    return clearance.hardClearance >= 0 && clearance.nearestClearance >= LEVEL_FIVE_SLOT_SOFT_CLEARANCE;
  }

  function chooseLevelFiveEnemyLayoutCenter(bounds, enemyRadius, avoidCenters, slotIndex) {
    const limits = getLevelFiveEnemyLayoutPoint(bounds, enemyRadius, [0.5, 0.5]);
    const candidates = [];
    const slotCount = LEVEL_FIVE_ENEMY_LAYOUT_FRACTIONS.length;

    for (let i = 0; i < slotCount; i++) {
      const fraction = LEVEL_FIVE_ENEMY_LAYOUT_FRACTIONS[(slotIndex + i) % slotCount];
      const candidate = getLevelFiveEnemyLayoutPoint(bounds, enemyRadius, fraction);
      candidates.push(candidate);
      if (isLevelFiveCandidateUsable(candidate, enemyRadius, avoidCenters)) return candidate;
    }

    const gridFractionsX = [0.1, 0.22, 0.34, 0.46, 0.58, 0.7, 0.82, 0.9];
    const gridFractionsY = [0.18, 0.32, 0.46, 0.6, 0.74, 0.86];
    for (let yIndex = 0; yIndex < gridFractionsY.length; yIndex++) {
      for (let xIndex = 0; xIndex < gridFractionsX.length; xIndex++) {
        const candidate = getLevelFiveEnemyLayoutPoint(bounds, enemyRadius, [
          gridFractionsX[xIndex],
          gridFractionsY[yIndex],
        ]);
        candidates.push(candidate);
        if (isLevelFiveCandidateUsable(candidate, enemyRadius, avoidCenters)) return candidate;
      }
    }

    let bestCandidate = candidates[0] || { x: (limits.minX + limits.maxX) * 0.5, y: (limits.minY + limits.maxY) * 0.5 };
    let bestScore = -Infinity;
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      const clearance = getLevelFiveCandidateClearance(candidate, enemyRadius, avoidCenters);
      const edgeClearance = Math.min(
        candidate.x - limits.minX,
        limits.maxX - candidate.x,
        candidate.y - limits.minY,
        limits.maxY - candidate.y
      );
      const hardPenalty = clearance.hardClearance < 0 ? Math.abs(clearance.hardClearance) * 8 : 0;
      const score =
        Math.min(clearance.nearestClearance, edgeClearance) +
        Math.max(0, clearance.hardClearance) * 0.5 +
        edgeClearance * 0.12 -
        hardPenalty -
        i * 0.12;
      if (score > bestScore) {
        bestScore = score;
        bestCandidate = candidate;
      }
    }

    return bestCandidate;
  }

  function selectLevelFivePlayerFeedEnemies(enemies, playerWidth) {
    const maxFeedSize = playerWidth * LEVEL_FIVE_PLAYER_FEED_MAX_RATIO;
    return enemies
      .slice()
      .sort((a, b) => {
        const aSize = Math.max(a.getWidth(), a.getHeight ? a.getHeight() : 0);
        const bSize = Math.max(b.getWidth(), b.getHeight ? b.getHeight() : 0);
        return aSize - bSize;
      })
      .filter((enemy) => Math.max(enemy.getWidth(), enemy.getHeight ? enemy.getHeight() : 0) <= maxFeedSize)
      .slice(0, LEVEL_FIVE_PLAYER_FEED_ENEMY_COUNT);
  }

  function chooseLevelFivePlayerFeedCenter(bounds, player, boss, enemyRadius, placedFeedCenters, feedIndex) {
    const playerRadius = getApproxObjectRadius(player, 30);
    const playerX = player.getCenterXInScene();
    const playerY = player.getCenterYInScene();
    const limits = getLevelFiveEnemyLayoutPoint(bounds, enemyRadius, [0.5, 0.5]);
    const desiredDistance = playerRadius + enemyRadius + LEVEL_FIVE_PLAYER_FEED_EDGE_GAP;
    const distances = [desiredDistance, desiredDistance * 1.16, desiredDistance * 0.9];
    let bestCandidate = null;
    let bestScore = -Infinity;

    for (let distanceIndex = 0; distanceIndex < distances.length; distanceIndex++) {
      for (let angleIndex = 0; angleIndex < LEVEL_FIVE_PLAYER_FEED_ANGLES.length; angleIndex++) {
        const angle =
          LEVEL_FIVE_PLAYER_FEED_ANGLES[(feedIndex + angleIndex) % LEVEL_FIVE_PLAYER_FEED_ANGLES.length] +
          distanceIndex * 0.24;
        const candidate = {
          x: clamp(playerX + Math.cos(angle) * distances[distanceIndex], limits.minX, limits.maxX),
          y: clamp(playerY + Math.sin(angle) * distances[distanceIndex], limits.minY, limits.maxY),
        };
        const playerGap = Math.hypot(candidate.x - playerX, candidate.y - playerY) - playerRadius - enemyRadius;
        if (playerGap < LEVEL_FIVE_PLAYER_FEED_MIN_EDGE_GAP) continue;

        const bossGap = boss
          ? Math.hypot(candidate.x - boss.getCenterXInScene(), candidate.y - boss.getCenterYInScene()) -
            getApproxObjectRadius(boss, 30) -
            enemyRadius
          : Infinity;
        let overlapPenalty = 0;
        for (let i = 0; i < placedFeedCenters.length; i++) {
          const placed = placedFeedCenters[i];
          const gap = Math.hypot(candidate.x - placed.x, candidate.y - placed.y) - placed.radius - enemyRadius;
          if (gap < LEVEL_FIVE_PLAYER_FEED_ENEMY_CLEARANCE) {
            overlapPenalty += (LEVEL_FIVE_PLAYER_FEED_ENEMY_CLEARANCE - gap) * 3.5;
          }
        }

        const edgeClearance = Math.min(
          candidate.x - limits.minX,
          limits.maxX - candidate.x,
          candidate.y - limits.minY,
          limits.maxY - candidate.y
        );
        const bossPenalty =
          bossGap < LEVEL_FIVE_PLAYER_FEED_BOSS_CLEARANCE
            ? (LEVEL_FIVE_PLAYER_FEED_BOSS_CLEARANCE - bossGap) * 5.5
            : 0;
        const score =
          edgeClearance * 0.18 -
          Math.abs(playerGap - LEVEL_FIVE_PLAYER_FEED_EDGE_GAP) * 1.6 -
          bossPenalty -
          overlapPenalty -
          angleIndex * 0.08 -
          distanceIndex * 0.2;
        if (score > bestScore) {
          bestScore = score;
          bestCandidate = candidate;
        }
      }
    }

    return bestCandidate || {
      x: clamp(playerX + desiredDistance, limits.minX, limits.maxX),
      y: clamp(playerY, limits.minY, limits.maxY),
    };
  }

  function layoutLevelFiveEnemies(runtimeScene, player, boss, enemies) {
    if (!player || !enemies.length) return;

    const bounds = getBossSpawnBounds(runtimeScene, player);
    const playerWidth = Math.max(1, player.getWidth());
    const feedEnemies = new Set(selectLevelFivePlayerFeedEnemies(enemies, playerWidth));
    const placedFeedCenters = [];
    const remainingEnemies = [];

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (feedEnemies.has(enemy)) {
        const enemyRadius = getApproxObjectRadius(enemy, 18);
        const center = chooseLevelFivePlayerFeedCenter(bounds, player, boss, enemyRadius, placedFeedCenters, i);
        moveObjectToCenter(enemy, center.x, center.y);
        clearObjectMotion(enemy);
        placedFeedCenters.push({
          x: center.x,
          y: center.y,
          radius: enemyRadius + LEVEL_FIVE_PLAYER_FEED_ENEMY_CLEARANCE,
        });
      } else {
        remainingEnemies.push(enemy);
      }
    }

    const avoidCenters = [
      {
        x: player.getCenterXInScene(),
        y: player.getCenterYInScene(),
        radius: getApproxObjectRadius(player, 30) + 112,
        hard: true,
      },
    ];
    if (boss) {
      avoidCenters.push({
        x: boss.getCenterXInScene(),
        y: boss.getCenterYInScene(),
        radius: getApproxObjectRadius(boss, 30) + LEVEL_FIVE_BOSS_ENEMY_CLEARANCE,
        hard: true,
      });
    }
    for (let i = 0; i < placedFeedCenters.length; i++) {
      avoidCenters.push({
        x: placedFeedCenters[i].x,
        y: placedFeedCenters[i].y,
        radius: placedFeedCenters[i].radius,
        hard: false,
      });
    }

    remainingEnemies.sort((a, b) => {
      const aSize = Math.max(a.getWidth(), a.getHeight ? a.getHeight() : 0);
      const bSize = Math.max(b.getWidth(), b.getHeight ? b.getHeight() : 0);
      return bSize - aSize;
    });

    for (let i = 0; i < remainingEnemies.length; i++) {
      const enemy = remainingEnemies[i];
      const enemyRadius = getApproxObjectRadius(enemy, 18);
      const center = chooseLevelFiveEnemyLayoutCenter(bounds, enemyRadius, avoidCenters, i);
      moveObjectToCenter(enemy, center.x, center.y);
      clearObjectMotion(enemy);
      avoidCenters.push({
        x: center.x,
        y: center.y,
        radius: enemyRadius + LEVEL_FIVE_ENEMY_ENEMY_CLEARANCE,
        hard: false,
      });
    }
  }

  function ensureLevelFiveLargestEnemiesReduced(runtimeScene, level, state) {
    if (level !== 5 || !state || state.levelFiveLargestEnemiesReduced) return;

    const players = runtimeScene.getObjects("Player");
    const player = players[0] || null;
    const boss = runtimeScene.getObjects("SmartEnemy")[0] || null;
    const layer = player && typeof player.getLayer === "function" ? player.getLayer() : "";
    const playerWidth = player && player.getWidth ? Math.max(1, player.getWidth()) : 140;
    let enemies = runtimeScene.getObjects("Enemy").filter((enemy) => enemy.getWidth() > 0);

    for (let i = 0; i < LEVEL_FIVE_EXTRA_SMALL_ENEMY_COUNT; i++) {
      const enemy = createSceneObject(runtimeScene, "Enemy", layer);
      if (!enemy) continue;
      const ratio = LEVEL_FIVE_EXTRA_SMALL_ENEMY_SIZE_RATIOS[i % LEVEL_FIVE_EXTRA_SMALL_ENEMY_SIZE_RATIOS.length];
      const targetSize = clamp(playerWidth * ratio, 44, 92);
      setObjectSizeAndShape(enemy, targetSize);
      if (player && typeof enemy.setZOrder === "function" && typeof player.getZOrder === "function") {
        enemy.setZOrder(player.getZOrder());
      }
      createImageCompanionForHost(runtimeScene, enemy, "Enemy", "EnemyImage");
    }

    enemies = runtimeScene.getObjects("Enemy").filter((enemy) => enemy.getWidth() > 0);
    if (!enemies.length) {
      state.levelFiveLargestEnemiesReduced = true;
      return;
    }

    enemies.sort((a, b) => {
      const aSize = Math.max(a.getWidth(), a.getHeight ? a.getHeight() : 0);
      const bSize = Math.max(b.getWidth(), b.getHeight ? b.getHeight() : 0);
      return bSize - aSize;
    });

    const targetCount = Math.min(LEVEL_FIVE_LARGE_ENEMY_REDUCTION_COUNT, enemies.length);
    for (let i = 0; i < targetCount; i++) {
      const enemy = enemies[i];
      const currentSize = Math.max(enemy.getWidth(), enemy.getHeight ? enemy.getHeight() : 0);
      if (!Number.isFinite(currentSize) || currentSize <= 0) continue;
      setObjectSizeAndShape(enemy, Math.max(1, currentSize * LEVEL_FIVE_LARGE_ENEMY_SCALE));
    }

    layoutLevelFiveEnemies(runtimeScene, player, boss, enemies);
    state.levelFiveLargestEnemiesReduced = true;
  }

  function findClosestHost(imageObject, hosts) {
    let closest = null;
    let closestDistSq = Infinity;
    const x = imageObject.getCenterXInScene();
    const y = imageObject.getCenterYInScene();
    for (let i = 0; i < hosts.length; i++) {
      const host = hosts[i];
      const dx = host.getCenterXInScene() - x;
      const dy = host.getCenterYInScene() - y;
      const distSq = dx * dx + dy * dy;
      if (distSq < closestDistSq) {
        closestDistSq = distSq;
        closest = host;
      }
    }
    return closest;
  }

  function getAbsorbFlashObjectKey(object) {
    if (!object) return "";

    const objectName = typeof object.getName === "function" ? object.getName() : "Object";
    const uniqueId =
      typeof object.getUniqueId === "function" ? object.getUniqueId() : object.id !== undefined ? object.id : "";
    return `${objectName}:${uniqueId}`;
  }

  function createAbsorbNegativeFlashFilter() {
    if (typeof PIXI === "undefined" || typeof PIXI.ColorMatrixFilter !== "function") return null;

    const filter = new PIXI.ColorMatrixFilter();
    if (typeof filter.negative === "function") {
      filter.negative(false);
      return filter;
    }

    filter.matrix = new Float32Array([
      -1, 0, 0, 0, 1,
      0, -1, 0, 0, 1,
      0, 0, -1, 0, 1,
      0, 0, 0, 1, 0,
    ]);
    return filter;
  }

  function setRendererAbsorbNegativeFlashEnabled(rendererObject, enabled) {
    if (!rendererObject) return;

    let filters = Array.isArray(rendererObject.filters) ? rendererObject.filters.filter(Boolean) : [];
    let negativeFilter = rendererObject[ABSORB_NEGATIVE_FLASH_FILTER_KEY] || null;

    if (enabled) {
      if (!negativeFilter) {
        negativeFilter = createAbsorbNegativeFlashFilter();
        if (!negativeFilter) return;
        rendererObject[ABSORB_NEGATIVE_FLASH_FILTER_KEY] = negativeFilter;
      }

      if (!filters.includes(negativeFilter)) {
        filters.push(negativeFilter);
        rendererObject.filters = filters;
      }
      return;
    }

    if (negativeFilter && filters.includes(negativeFilter)) {
      filters = filters.filter((filter) => filter !== negativeFilter);
      rendererObject.filters = filters.length ? filters : null;
    }
  }

  function setObjectAbsorbNegativeFlashEnabled(object, enabled) {
    if (!object || typeof object.getRendererObject !== "function") return;
    setRendererAbsorbNegativeFlashEnabled(object.getRendererObject(), enabled);
  }

  function setRendererPlayerPrelaunchNegativeEnabled(rendererObject, enabled) {
    if (!rendererObject) return;

    let filters = Array.isArray(rendererObject.filters) ? rendererObject.filters.filter(Boolean) : [];
    let negativeFilter = rendererObject[PLAYER_PRELAUNCH_NEGATIVE_FILTER_KEY] || null;

    if (enabled) {
      if (!negativeFilter) {
        negativeFilter = createAbsorbNegativeFlashFilter();
        if (!negativeFilter) return;
        rendererObject[PLAYER_PRELAUNCH_NEGATIVE_FILTER_KEY] = negativeFilter;
      }

      if (!filters.includes(negativeFilter)) {
        filters.push(negativeFilter);
        rendererObject.filters = filters;
      }
      return;
    }

    if (negativeFilter && filters.includes(negativeFilter)) {
      filters = filters.filter((filter) => filter !== negativeFilter);
      rendererObject.filters = filters.length ? filters : null;
    }
  }

  function syncPlayerPrelaunchNegativeVisual(runtimeScene, state, activePlay) {
    if (!runtimeScene || !state) return;

    if (!state.firstOrbFired && runtimeScene.getObjects("EmittedMaterial").length > 0) {
      state.firstOrbFired = true;
    }

    const enabled = !!activePlay && !state.firstOrbFired;
    for (const objectName of ["Player", "PlayerImage", "PlayerHelmet"]) {
      const objects = runtimeScene.getObjects(objectName);
      for (let i = 0; i < objects.length; i++) {
        const object = objects[i];
        if (!object || typeof object.getRendererObject !== "function") continue;
        setRendererPlayerPrelaunchNegativeEnabled(object.getRendererObject(), enabled);
      }
    }
  }

  function ensureAbsorbFlashStateMap(state) {
    if (!state) return new Map();
    if (!(state.absorbFlashByObjectKey instanceof Map)) {
      state.absorbFlashByObjectKey = new Map();
    }
    return state.absorbFlashByObjectKey;
  }

  function isObjectUnderAbsorptionPressure(runtimeScene, object) {
    if (!runtimeScene || !object) return false;

    const objectSize = Math.max(
      1,
      typeof object.getWidth === "function" ? object.getWidth() : 0,
      typeof object.getHeight === "function" ? object.getHeight() : 0
    );
    const objectRadius = getApproxObjectRadius(object, 1);
    const ox = typeof object.getCenterXInScene === "function" ? object.getCenterXInScene() : 0;
    const oy = typeof object.getCenterYInScene === "function" ? object.getCenterYInScene() : 0;
    const possibleAbsorbers = ["Player", "Enemy", "SmartEnemy"].flatMap((name) =>
      runtimeScene.getObjects(name)
    );

    for (let i = 0; i < possibleAbsorbers.length; i++) {
      const absorber = possibleAbsorbers[i];
      if (!absorber || absorber === object) continue;
      const absorberSize = Math.max(
        1,
        typeof absorber.getWidth === "function" ? absorber.getWidth() : 0,
        typeof absorber.getHeight === "function" ? absorber.getHeight() : 0
      );
      if (absorberSize <= objectSize + Math.max(2, objectSize * 0.02)) continue;

      const absorberRadius = getApproxObjectRadius(absorber, 1);
      const ax = typeof absorber.getCenterXInScene === "function" ? absorber.getCenterXInScene() : 0;
      const ay = typeof absorber.getCenterYInScene === "function" ? absorber.getCenterYInScene() : 0;
      const distance = Math.hypot(ax - ox, ay - oy);
      const absorbContactDistance =
        objectRadius + absorberRadius + Math.max(4, objectRadius * 0.08);
      if (distance <= absorbContactDistance) return true;
    }

    return false;
  }

  function computeAbsorbFlashState(runtimeScene, state, elapsedSeconds) {
    const trackedObjects = ["Player", "Enemy", "SmartEnemy"];
    const flashStateByObjectKey = new Map();
    const flashEntries = ensureAbsorbFlashStateMap(state);
    const seenKeys = new Set();

    for (let nameIndex = 0; nameIndex < trackedObjects.length; nameIndex++) {
      const objects = runtimeScene.getObjects(trackedObjects[nameIndex]);
      for (let i = 0; i < objects.length; i++) {
        const object = objects[i];
        const objectKey = getAbsorbFlashObjectKey(object);
        if (!objectKey) continue;

        seenKeys.add(objectKey);
        const size = Math.max(
          0,
          typeof object.getWidth === "function" ? object.getWidth() : 0,
          typeof object.getHeight === "function" ? object.getHeight() : 0
        );
        let flashEntry = flashEntries.get(objectKey);
        if (!flashEntry) {
          flashEntry = {
            lastSize: size,
            lastShrinkAtSeconds: -Infinity,
          };
          flashEntries.set(objectKey, flashEntry);
        } else {
          if (size < flashEntry.lastSize - ABSORB_NEGATIVE_FLASH_SHRINK_EPSILON) {
            flashEntry.lastShrinkAtSeconds = elapsedSeconds;
          }
          flashEntry.lastSize = size;
        }

        flashStateByObjectKey.set(
          objectKey,
          elapsedSeconds - flashEntry.lastShrinkAtSeconds <= ABSORB_NEGATIVE_FLASH_HOLD_SECONDS &&
            isObjectUnderAbsorptionPressure(runtimeScene, object)
        );
      }
    }

    for (const objectKey of flashEntries.keys()) {
      if (!seenKeys.has(objectKey)) {
        flashEntries.delete(objectKey);
      }
    }

    return flashStateByObjectKey;
  }

  function isAbsorbNegativeFlashEnabled(object, flashStateByObjectKey, elapsedSeconds) {
    if (!flashStateByObjectKey || !object) return false;

    const objectKey = getAbsorbFlashObjectKey(object);
    if (!objectKey || !flashStateByObjectKey.get(objectKey)) return false;
    return Math.sin(elapsedSeconds * ABSORB_NEGATIVE_FLASH_FREQUENCY_HZ * Math.PI * 2) >= 0;
  }

  function syncFollowerAbsorbFlash(runtimeScene, hostName, followerName, flashStateByObjectKey, elapsedSeconds) {
    if (!flashStateByObjectKey) return;

    const hosts = runtimeScene.getObjects(hostName);
    const followers = runtimeScene.getObjects(followerName);
    if (!followers.length) return;

    if (!hosts.length) {
      for (let i = 0; i < followers.length; i++) {
        setObjectAbsorbNegativeFlashEnabled(followers[i], false);
      }
      return;
    }

    for (let i = 0; i < followers.length; i++) {
      const follower = followers[i];
      const host = findClosestHost(follower, hosts);
      setObjectAbsorbNegativeFlashEnabled(
        follower,
        !!host && isAbsorbNegativeFlashEnabled(host, flashStateByObjectKey, elapsedSeconds)
      );
    }
  }

  function syncImageToHostScale(
    runtimeScene,
    hostName,
    imageName,
    playerWidth,
    wiggle = false,
    flashStateByObjectKey = null,
    elapsedSeconds = 0,
    allowWiggle = true
  ) {
    let hosts = runtimeScene.getObjects(hostName);
    if (hostName === "Enemy" && imageName === "EnemyImage") {
      hosts = hosts.filter((host) => !isLevelTwelveCosmicAlien(host));
    }
    let images = runtimeScene.getObjects(imageName);
    if (!hosts.length) {
      if (flashStateByObjectKey) {
        for (let i = 0; i < images.length; i++) {
          setObjectAbsorbNegativeFlashEnabled(images[i], false);
        }
      }
      return;
    }

    while (images.length < hosts.length) {
      const host = hosts[images.length] || hosts[0];
      const image = createImageCompanionForHost(runtimeScene, host, hostName, imageName);
      if (!image) break;
      images.push(image);
    }

    const availableImages = images.slice();
    const assignments = [];
    for (let hostIndex = 0; hostIndex < hosts.length; hostIndex++) {
      const host = hosts[hostIndex];
      let bestImageIndex = -1;
      let bestDistanceSq = Infinity;
      const boundImage = host.__headSpaceImageCompanion;
      if (
        boundImage &&
        boundImage.__headSpaceCompanionHost === host
      ) {
        bestImageIndex = availableImages.indexOf(boundImage);
      }
      if (bestImageIndex < 0) {
        bestImageIndex = availableImages.findIndex(
          (image) => image.__headSpaceCompanionHost === host
        );
      }
      if (bestImageIndex < 0) {
        for (let imageIndex = 0; imageIndex < availableImages.length; imageIndex++) {
          const image = availableImages[imageIndex];
          if (image.__headSpaceCompanionHost && hosts.includes(image.__headSpaceCompanionHost)) {
            continue;
          }
          const dx = image.getCenterXInScene() - host.getCenterXInScene();
          const dy = image.getCenterYInScene() - host.getCenterYInScene();
          const distanceSq = dx * dx + dy * dy;
          if (distanceSq < bestDistanceSq) {
            bestDistanceSq = distanceSq;
            bestImageIndex = imageIndex;
          }
        }
      }

      let image = bestImageIndex >= 0 ? availableImages.splice(bestImageIndex, 1)[0] : null;
      if (!image) image = createImageCompanionForHost(runtimeScene, host, hostName, imageName);
      if (image) {
        host.__headSpaceImageCompanion = image;
        image.__headSpaceCompanionHost = host;
        assignments.push({ host, image, index: hostIndex });
      }
    }

    if (imageName === "EnemyImage" || imageName === "SmartEnemyImage") {
      for (let i = 0; i < availableImages.length; i++) {
        if (availableImages[i].deleteFromScene) availableImages[i].deleteFromScene(runtimeScene);
      }
    }

    for (let i = 0; i < assignments.length; i++) {
      const { host, image, index } = assignments[i];
      const playerCompositeOwnsGeometry =
        hostName === "Player" && imageName === "PlayerImage";

      syncImageCompanionRenderState(host, image);
      attachImageCompanionToHost(runtimeScene, host, image, hostName, imageName);
      hideLevelTwelveEnemyCollisionHost(runtimeScene, host, hostName, image);
      hideLevelEightEnemyCollisionHost(runtimeScene, host, hostName, image);

      // Preserve binding, visibility, z-order, and effects here, but never
      // rewrite player geometry. applyGameplayHelmetCoverScale is the sole
      // game-wide size/position/rotation authority for both player layers.
      if (playerCompositeOwnsGeometry) {
        if (flashStateByObjectKey) {
          setObjectAbsorbNegativeFlashEnabled(
            image,
            isAbsorbNegativeFlashEnabled(host, flashStateByObjectKey, elapsedSeconds)
          );
        }
        continue;
      }

      const baseScale = clamp(host.getWidth() / 124, 0.08, 12);
      let scaleX = baseScale;
      let scaleY = baseScale;
      let offsetX = 0;
      let offsetY = 0;

      if (wiggle && allowWiggle) {
        const now = performance.now() / 1000;
        const phase = now * 3.4 + index * 0.67 + (host.getX() + host.getY()) * 0.004;
        scaleX = baseScale * (1 + Math.sin(phase) * 0.008);
        scaleY = baseScale * (1 + Math.cos(phase * 1.23) * 0.014);
        offsetX = Math.sin(phase * 1.1) * 0.8;
        offsetY = Math.cos(phase * 0.9) * 1.3;
      }

      syncImageCompanionRenderState(host, image);
      image.setScaleX(scaleX);
      image.setScaleY(scaleY);
      image.setCenterPositionInScene(host.getCenterXInScene() + offsetX, host.getCenterYInScene() + offsetY);
      syncImageCompanionRenderState(host, image);

      if (typeof playerWidth === "number" && image.enableEffect) {
        image.enableEffect("Effect", host.getWidth() < playerWidth);
      }
      if (flashStateByObjectKey) {
        setObjectAbsorbNegativeFlashEnabled(
          image,
          isAbsorbNegativeFlashEnabled(host, flashStateByObjectKey, elapsedSeconds)
        );
      }
    }

    if (typeof playerWidth === "number" || flashStateByObjectKey) {
      for (let i = 0; i < hosts.length; i++) {
        const host = hosts[i];
        if (typeof playerWidth === "number" && host.enableEffect) {
          host.enableEffect("Effect", host.getWidth() < playerWidth);
        }
        if (flashStateByObjectKey) {
          setObjectAbsorbNegativeFlashEnabled(
            host,
            isAbsorbNegativeFlashEnabled(host, flashStateByObjectKey, elapsedSeconds)
          );
        }
      }
    }
  }

  function syncAbsorbVisuals(runtimeScene, state, elapsedSeconds, allowWiggle = true) {
    const players = runtimeScene.getObjects("Player");
    const playerWidth = players.length ? players[0].getWidth() : null;
    const effectiveElapsedSeconds = Number.isFinite(elapsedSeconds) ? elapsedSeconds : performance.now() / 1000;
    const flashStateByObjectKey = state ? computeAbsorbFlashState(runtimeScene, state, effectiveElapsedSeconds) : null;

    if (players.length) {
      syncImageToHostScale(
        runtimeScene,
        "Player",
        "PlayerImage",
        undefined,
        false,
        flashStateByObjectKey,
        effectiveElapsedSeconds,
        allowWiggle
      );
      trimObjectsToCount(runtimeScene, "PlayerImage", players.length);
      trimObjectsToCount(runtimeScene, "PlayerHelmet", players.length);
    }
    syncImageToHostScale(
      runtimeScene,
      "Enemy",
      "EnemyImage",
      playerWidth,
      true,
      flashStateByObjectKey,
      effectiveElapsedSeconds,
      allowWiggle
    );
    syncImageToHostScale(
      runtimeScene,
      "SmartEnemy",
      "SmartEnemyImage",
      playerWidth,
      true,
      flashStateByObjectKey,
      effectiveElapsedSeconds,
      allowWiggle
    );
    syncFollowerAbsorbFlash(runtimeScene, "Player", "PlayerHelmet", flashStateByObjectKey, effectiveElapsedSeconds);

    const multiplayerLevelFourSystem =
      multiplayerLevelFourHoneycombState.get(runtimeScene);
    if (
      multiplayerLevelFourSystem &&
      Number(getCurrentLevel(runtimeScene)) === 4 &&
      isMultiplayerGame(runtimeScene, 4)
    ) {
      ensureMultiplayerParticipantOwnership(runtimeScene, 4);
      for (const player of runtimeScene.getObjects("Player")) {
        const image = player.__headSpaceImageCompanion;
        if (!image || !runtimeScene.getObjects("PlayerImage").includes(image)) continue;
        image.hide?.(false);
        image.setOpacity?.(255);
        player.hide?.(true);
        player.setOpacity?.(0);
      }
      for (const helmet of runtimeScene.getObjects("PlayerHelmet")) {
        helmet.hide?.(false);
        helmet.setOpacity?.(255);
      }
      syncMultiplayerLevelFourOrangeEnemyVisuals(
        runtimeScene,
        multiplayerLevelFourSystem
      );
    }
  }

  function enforceLevelTenBossVisibility(runtimeScene) {
    if (!usesLevelTenRuntime(runtimeScene)) return;

    const boss = runtimeScene.getObjects("SmartEnemy")[0] || null;
    const images = runtimeScene.getObjects("SmartEnemyImage");
    let visibleImage = null;
    let bestDistance = Infinity;
    for (const image of images) {
      const distance = boss
        ? Math.hypot(
            image.getCenterXInScene() - boss.getCenterXInScene(),
            image.getCenterYInScene() - boss.getCenterYInScene()
          )
        : Infinity;
      if (distance < bestDistance) {
        bestDistance = distance;
        visibleImage = image;
      }
    }

    for (const image of images) {
      if (image !== visibleImage) {
        if (image.hide) image.hide(true);
        if (image.setOpacity) image.setOpacity(0);
        if (image.deleteFromScene) image.deleteFromScene(runtimeScene);
        continue;
      }
      if (image.setLayer) image.setLayer("Texture");
      if (image.hide) image.hide(false);
      if (image.setOpacity) image.setOpacity(255);
      if (image.enableEffect) image.enableEffect("Effect2", true);
      const rendererObject = image.getRendererObject?.();
      if (!rendererObject) continue;
      rendererObject.alpha = 1;
      rendererObject.tint = 0xffffff;
      if (typeof PIXI !== "undefined" && PIXI.BLEND_MODES) {
        rendererObject.blendMode = PIXI.BLEND_MODES.NORMAL;
      }
    }
  }

  function computeFittedTextSize(textObject, buttonObject, preferredSize = BUTTON_TEXT_DEFAULT_SIZE) {
    if (!textObject || !buttonObject || !textObject.setCharacterSize) return BUTTON_TEXT_DEFAULT_SIZE;
    const maxWidth = Math.max(24, buttonObject.getWidth() * (1 - BUTTON_TEXT_PADDING_X_RATIO * 2));
    const maxHeight = Math.max(18, buttonObject.getHeight() * (1 - BUTTON_TEXT_PADDING_Y_RATIO * 2));
    let size = Math.min(OVERLAY_BUTTON_TEXT_MAX_SIZE, preferredSize, Math.floor(maxHeight));
    if (size < OVERLAY_BUTTON_TEXT_MIN_SIZE) size = OVERLAY_BUTTON_TEXT_MIN_SIZE;
    textObject.setCharacterSize(size);
    while (
      size > OVERLAY_BUTTON_TEXT_MIN_SIZE &&
      (textObject.getWidth() > maxWidth || textObject.getHeight() > maxHeight)
    ) {
      size -= 1;
      textObject.setCharacterSize(size);
    }
    return size;
  }

  function fitTextScaleInsideButton(textObject, buttonObject) {
    if (!textObject || !buttonObject) return;
    if (textObject.setScale) textObject.setScale(1);

    const maxWidth = Math.max(24, buttonObject.getWidth() * (1 - BUTTON_TEXT_PADDING_X_RATIO * 2));
    const maxHeight = Math.max(18, buttonObject.getHeight() * (1 - BUTTON_TEXT_PADDING_Y_RATIO * 2));
    const textWidth = textObject.getWidth();
    const textHeight = textObject.getHeight();
    if (textWidth <= maxWidth && textHeight <= maxHeight) return;

    const scaleX = maxWidth / Math.max(1, textWidth);
    const scaleY = maxHeight / Math.max(1, textHeight);
    const scale = Math.max(0.6, Math.min(1, scaleX, scaleY));
    if (textObject.setScale) textObject.setScale(scale);
  }

  function placeTextInsideButton(textObject, buttonObject) {
    const centerX = buttonObject.getCenterXInScene();
    const centerY = buttonObject.getCenterYInScene();
    const textWidth = textObject.getWidth();
    const textHeight = textObject.getHeight();
    const visualOffsetY = getButtonTextVisualOffsetY(buttonObject);
    if (textObject.setCenterPositionInScene) {
      textObject.setCenterPositionInScene(
        Math.round(centerX + BUTTON_TEXT_VISUAL_OFFSET_X),
        Math.round(centerY + visualOffsetY)
      );
      return;
    }
    if (textObject.setPosition) {
      // Fallback for objects without center-position API.
      textObject.setPosition(
        Math.round(centerX - textWidth / 2 + BUTTON_TEXT_VISUAL_OFFSET_X),
        Math.round(centerY - textHeight / 2 + visualOffsetY)
      );
      return;
    }
  }

  function getButtonTextVisualOffsetY(buttonObject) {
    if (!buttonObject || typeof buttonObject.getName !== "function") return BUTTON_TEXT_VISUAL_OFFSET_Y;

    switch (buttonObject.getName()) {
      case "LevelSelectScreen":
        return MAIN_MENU_BUTTON_TEXT_VISUAL_OFFSET_Y;
      case "Button":
      case "HomeButton":
        return LEVEL_OVER_BUTTON_TEXT_VISUAL_OFFSET_Y;
      default:
        return BUTTON_TEXT_VISUAL_OFFSET_Y;
    }
  }

  function createButtonGlowEffectData() {
    return {
      effectType: "Outline",
      name: BUTTON_GLOW_EFFECT_NAME,
      doubleParameters: {
        padding: BUTTON_GLOW_PADDING,
        thickness: BUTTON_GLOW_THICKNESS,
        alpha: BUTTON_GLOW_ALPHA,
      },
      stringParameters: {
        color: BUTTON_GLOW_COLOR,
      },
      booleanParameters: {},
    };
  }

  function ensureButtonGlow(buttonObject) {
    if (!buttonObject || typeof buttonObject.addEffect !== "function") return;

    const hasGlow = typeof buttonObject.hasEffect === "function" && buttonObject.hasEffect(BUTTON_GLOW_EFFECT_NAME);
    if (!hasGlow) {
      buttonObject.addEffect(createButtonGlowEffectData());
    }
  }

  function hasDefaultButtonGlow(buttonObject) {
    if (!buttonObject || typeof buttonObject.getName !== "function") return false;

    switch (buttonObject.getName()) {
      case "LevelSelectScreen":
      case "Button":
      case "HomeButton":
      case "ButtonMulti":
        return true;
      default:
        return false;
    }
  }

  function isHoverGlowButtonName(objectName) {
    if (!objectName) return false;
    if (
      objectName === "LevelSelectScreen" ||
      objectName === "Button" ||
      objectName === "HomeButton" ||
      objectName === "ButtonMulti" ||
      objectName === "CharLeft" ||
      objectName === "CharRight" ||
      objectName === "HelmLeft" ||
      objectName === "HelmRight"
    ) {
      return true;
    }

    return /^Level(?:[1-9]|1[0-2])$/.test(objectName);
  }

  function setButtonGlowState(buttonObject, hovered) {
    if (!buttonObject) return;
    ensureButtonGlow(buttonObject);

    const keepBaseGlow = hasDefaultButtonGlow(buttonObject);
    const enabled = hovered || keepBaseGlow;
    const color = hovered ? BUTTON_HOVER_GLOW_COLOR : BUTTON_GLOW_COLOR;
    const thickness = hovered ? BUTTON_HOVER_GLOW_THICKNESS : BUTTON_GLOW_THICKNESS;
    const padding = hovered ? BUTTON_HOVER_GLOW_PADDING : BUTTON_GLOW_PADDING;
    const alpha = hovered ? BUTTON_HOVER_GLOW_ALPHA : BUTTON_GLOW_ALPHA;

    if (typeof buttonObject.setEffectDoubleParameter === "function") {
      buttonObject.setEffectDoubleParameter(BUTTON_GLOW_EFFECT_NAME, "padding", padding);
      buttonObject.setEffectDoubleParameter(BUTTON_GLOW_EFFECT_NAME, "thickness", thickness);
      buttonObject.setEffectDoubleParameter(BUTTON_GLOW_EFFECT_NAME, "alpha", alpha);
    }
    if (typeof buttonObject.setEffectStringParameter === "function") {
      buttonObject.setEffectStringParameter(BUTTON_GLOW_EFFECT_NAME, "color", color);
    }
    if (typeof buttonObject.enableEffect === "function") {
      buttonObject.enableEffect(BUTTON_GLOW_EFFECT_NAME, enabled);
    }
  }

  function syncHoverGlowForObjectName(runtimeScene, objectName) {
    if (!isHoverGlowButtonName(objectName)) return;

    const objects = runtimeScene.getObjects(objectName);
    for (let i = 0; i < objects.length; i++) {
      const object = objects[i];
      const isVisible = typeof object.isVisible !== "function" || object.isVisible();
      const hovered =
        isVisible && typeof object.cursorOnObject === "function" && object.cursorOnObject(runtimeScene);
      setButtonGlowState(object, hovered);
    }
  }

  function syncInteractiveButtonGlow(runtimeScene) {
    const interactiveNames = [
      "LevelSelectScreen",
      "Button",
      "HomeButton",
      "ButtonMulti",
      "CharLeft",
      "CharRight",
      "HelmLeft",
      "HelmRight",
      "Level1",
      "Level2",
      "Level3",
      "Level4",
      "Level5",
      "Level6",
      "Level7",
      "Level8",
      "Level9",
      "Level10",
      "Level11",
      "Level12",
    ];

    for (let i = 0; i < interactiveNames.length; i++) {
      syncHoverGlowForObjectName(runtimeScene, interactiveNames[i]);
    }
  }

  function resizeButtonPreservingCenter(buttonObject, width, height, centerXOverride = null) {
    if (!buttonObject || !buttonObject.setSize) return;
    const centerX =
      typeof centerXOverride === "number"
        ? centerXOverride
        : typeof buttonObject.getCenterXInScene === "function"
          ? buttonObject.getCenterXInScene()
          : buttonObject.getX() + buttonObject.getWidth() / 2;
    const centerY =
      typeof buttonObject.getCenterYInScene === "function"
        ? buttonObject.getCenterYInScene()
        : buttonObject.getY() + buttonObject.getHeight() / 2;

    buttonObject.setSize(width, height);
    if (buttonObject.setCenterPositionInScene) {
      buttonObject.setCenterPositionInScene(Math.round(centerX), Math.round(centerY));
      return;
    }
    if (buttonObject.setPosition) {
      buttonObject.setPosition(Math.round(centerX - width / 2), Math.round(centerY - height / 2));
    }
  }

  function getCameraFrame(runtimeScene, layerName = "") {
    return {
      x: gdjs.evtTools.camera.getCameraX(runtimeScene, layerName, 0),
      y: gdjs.evtTools.camera.getCameraY(runtimeScene, layerName, 0),
      width: gdjs.evtTools.camera.getCameraWidth(runtimeScene, layerName, 0),
      height: gdjs.evtTools.camera.getCameraHeight(runtimeScene, layerName, 0),
    };
  }

  function getCameraZoom(runtimeScene, layerName = "") {
    if (!gdjs?.evtTools?.camera?.getCameraZoom) return 1;
    const zoom = gdjs.evtTools.camera.getCameraZoom(runtimeScene, layerName, 0);
    return Number.isFinite(zoom) && zoom > 0 ? zoom : 1;
  }

  function getUnzoomedViewportFrame(runtimeScene, layerName = "") {
    const frame = getCameraFrame(runtimeScene, layerName);
    const zoom = getCameraZoom(runtimeScene, layerName);
    return {
      x: frame.x,
      y: frame.y,
      width: frame.width * zoom,
      height: frame.height * zoom,
      zoom,
    };
  }

  function setObjectCenter(object, centerX, centerY) {
    if (!object) return;
    const roundedX = Math.round(centerX);
    const roundedY = Math.round(centerY);
    if (object.setCenterPositionInScene) {
      object.setCenterPositionInScene(roundedX, roundedY);
      return;
    }
    if (object.setPosition && object.getWidth && object.getHeight) {
      object.setPosition(Math.round(roundedX - object.getWidth() / 2), Math.round(roundedY - object.getHeight() / 2));
    }
  }

  function setObjectSizePreservingCenter(object, width, height) {
    if (!object || !object.setSize) return;
    const centerX =
      typeof object.getCenterXInScene === "function" ? object.getCenterXInScene() : object.getX() + object.getWidth() / 2;
    const centerY =
      typeof object.getCenterYInScene === "function" ? object.getCenterYInScene() : object.getY() + object.getHeight() / 2;
    object.setSize(Math.round(width), Math.round(height));
    setObjectCenter(object, centerX, centerY);
  }

  function normalizeHomeMenuTextObject(textObject, centerX, centerY, characterSize, forcedText = null) {
    if (!textObject) return;
    if (forcedText !== null && textObject.getString && textObject.setString && textObject.getString() !== forcedText) {
      textObject.setString(forcedText);
    }
    if (textObject.setWrapping) textObject.setWrapping(false);
    if (textObject.setPadding) textObject.setPadding(0);
    if (textObject.setScale) textObject.setScale(1);
    if (textObject.setTextAlignment) textObject.setTextAlignment("center");
    if (textObject.setVerticalTextAlignment) textObject.setVerticalTextAlignment("center");
    if (textObject.setCharacterSize) textObject.setCharacterSize(characterSize);
    if (textObject.setBold) textObject.setBold(true);
    setObjectCenter(textObject, centerX, centerY);
  }

  function normalizeHomeMenuObjectGroup(runtimeScene, objectName, centerX, centerY, width = null, height = null) {
    const objects = runtimeScene.getObjects(objectName);
    for (let i = 0; i < objects.length; i++) {
      const object = objects[i];
      if (width !== null && height !== null) setObjectSizePreservingCenter(object, width, height);
      setObjectCenter(object, centerX, centerY);
    }
  }

  function getCoverSizeForFrame(frame, aspect, overscan) {
    let width = frame.width;
    let height = width / aspect;
    if (height < frame.height) {
      height = frame.height;
      width = height * aspect;
    }
    return {
      width: width * overscan,
      height: height * overscan,
    };
  }

  function normalizeHomeMenuLayer(runtimeScene, layerName) {
    if (!runtimeScene.hasLayer || !runtimeScene.hasLayer(layerName)) return;
    const layer = runtimeScene.getLayer(layerName);
    if (!layer) return;
    if (layer.show) layer.show(true);
    if (layer.setClearColor) layer.setClearColor(0, 0, 0);
  }

  function normalizeHomeMenuStarLayer(runtimeScene, objectName, layerName, opacity) {
    normalizeHomeMenuLayer(runtimeScene, layerName);

    const frame = getCameraFrame(runtimeScene, layerName);
    const stars = runtimeScene.getObjects(objectName);
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      if (star.hide) star.hide(false);
      if (star.setOpacity) star.setOpacity(opacity);
      if (star.setLayer && star.getLayer && star.getLayer() !== layerName) star.setLayer(layerName);
      if (star.setZOrder) star.setZOrder(i);
      if (star.setPosition) star.setPosition(0, 0);
      if (star.setSize) star.setSize(Math.ceil(frame.width), Math.ceil(frame.height));
    }
  }

  function ensureParallaxStarLayer(runtimeScene, objectName, layerName, opacity, zOrder) {
    normalizeHomeMenuLayer(runtimeScene, layerName);

    let stars = runtimeScene.getObjects(objectName);
    if (!stars.length) {
      const createdStar = createSceneObject(runtimeScene, objectName, layerName);
      if (createdStar) stars = [createdStar];
    }

    const frame = getCameraFrame(runtimeScene, layerName);
    const width = Math.ceil(frame.width * 1.18);
    const height = Math.ceil(frame.height * 1.18);
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      if (star.hide) star.hide(false);
      if (star.setOpacity) star.setOpacity(opacity);
      if (star.setLayer && star.getLayer && star.getLayer() !== layerName) star.setLayer(layerName);
      if (star.setZOrder) star.setZOrder(zOrder + i);
      setObjectSizePreservingCenter(star, width, height);
      setObjectCenter(star, frame.x, frame.y);
    }
  }

  function normalizeParallaxStarLayers(runtimeScene, level) {
    if (Number(level) === 0) return;
    normalizeHomeMenuLayer(runtimeScene, "Background Stars");
    ensureParallaxStarLayer(runtimeScene, "BACKstars3", "Stars1", HOME_MENU_STAR_OPACITY_FAR, -10020);
    ensureParallaxStarLayer(runtimeScene, "BACKstars2", "Star2", HOME_MENU_STAR_OPACITY_NEAR, -10010);
    const elapsedSeconds = performance.now() / 1000;
    const cameraX = gdjs.evtTools.camera.getCameraX(runtimeScene, "", 0);
    const cameraY = gdjs.evtTools.camera.getCameraY(runtimeScene, "", 0);
    for (const star of runtimeScene.getObjects("BACKstars3")) {
      if (star.setXOffset) star.setXOffset(cameraX * 0.42 + elapsedSeconds * 4);
      if (star.setYOffset) star.setYOffset(cameraY * 0.42 + elapsedSeconds * 2);
    }
    for (const star of runtimeScene.getObjects("BACKstars2")) {
      if (star.setXOffset) star.setXOffset(cameraX * 0.78 - elapsedSeconds * 9);
      if (star.setYOffset) star.setYOffset(cameraY * 0.78 + elapsedSeconds * 5);
    }
  }

  function normalizeHomeMenuBackground(runtimeScene) {
    if (runtimeScene.setBackgroundColor) runtimeScene.setBackgroundColor(0, 0, 0);
    normalizeHomeMenuLayer(runtimeScene, "");
    normalizeHomeMenuLayer(runtimeScene, "Background");

    const backgroundFrame = getCameraFrame(runtimeScene, "Background");
    const backgroundSize = getCoverSizeForFrame(
      backgroundFrame,
      HOME_MENU_BACKGROUND_ASPECT,
      HOME_MENU_BACKGROUND_OVERSCAN
    );

    const backgrounds = runtimeScene.getObjects("Background_UNTILED_1");
    for (let i = 0; i < backgrounds.length; i++) {
      const background = backgrounds[i];
      if (background.hide) background.hide(false);
      if (background.setOpacity) background.setOpacity(255);
      if (background.setLayer && background.getLayer && background.getLayer() !== "Background") background.setLayer("Background");
      if (background.setZOrder) background.setZOrder(-10000);
      setObjectSizePreservingCenter(background, backgroundSize.width, backgroundSize.height);
      setObjectCenter(background, backgroundFrame.x, backgroundFrame.y);
    }

    ensureParallaxStarLayer(runtimeScene, "BACKstars3", "", HOME_MENU_STAR_OPACITY_FAR, -10990);
    ensureParallaxStarLayer(runtimeScene, "BACKstars2", "", HOME_MENU_STAR_OPACITY_NEAR, -10980);
    const starElapsedSeconds = performance.now() / 1000;
    const baseCameraX = gdjs.evtTools.camera.getCameraX(runtimeScene, "", 0);
    const baseCameraY = gdjs.evtTools.camera.getCameraY(runtimeScene, "", 0);
    for (const star of runtimeScene.getObjects("BACKstars3")) {
      if (star.setXOffset) star.setXOffset(baseCameraX * 0.5 + starElapsedSeconds * 5);
      if (star.setYOffset) star.setYOffset(baseCameraY * 0.5 + starElapsedSeconds * 2.5);
    }
    for (const star of runtimeScene.getObjects("BACKstars2")) {
      if (star.setXOffset) star.setXOffset(baseCameraX * 0.9 - starElapsedSeconds * 11);
      if (star.setYOffset) star.setYOffset(baseCameraY * 0.9 + starElapsedSeconds * 6);
    }
    updateHomeHighResBackground(runtimeScene);
  }

  function normalizeHomeMenuLayout(runtimeScene, level) {
    if (Number(level) !== 0) {
      syncHomeMenuActionButtons(runtimeScene, false);
      return;
    }

    normalizeHomeMenuBackground(runtimeScene);

    const menuCamera = getUnzoomedViewportFrame(runtimeScene, "");
    const layoutKey = `${Math.round(menuCamera.width)}x${Math.round(menuCamera.height)}`;
    const cachedLayout = homeMenuLayoutState.get(runtimeScene);
    if (cachedLayout?.key !== layoutKey) homeMenuLayoutState.set(runtimeScene, { key: layoutKey });

    const centerX = menuCamera.x;
    const titleY = menuCamera.y - menuCamera.height * 0.25;
    const characterLabelY = menuCamera.y - menuCamera.height * 0.075;
    const previewY = menuCamera.y + menuCamera.height * 0.05;
    const helmetLabelY = menuCamera.y + menuCamera.height * 0.19;
    const playY = menuCamera.y + menuCamera.height * HOME_MENU_PLAY_Y_RATIO;

    const titles = runtimeScene.getObjects("Title_Text");
    for (let i = 0; i < titles.length; i++) {
      normalizeHomeMenuTextObject(titles[i], centerX, titleY, HOME_MENU_TITLE_SIZE, "HEADNAUT");
    }

    const characterLabels = runtimeScene.getObjects("CHARACTER_Label");
    for (let i = 0; i < characterLabels.length; i++) {
      normalizeHomeMenuTextObject(characterLabels[i], centerX, characterLabelY, HOME_MENU_LABEL_SIZE);
    }

    const helmetLabels = runtimeScene.getObjects("HELMET_Label");
    for (let i = 0; i < helmetLabels.length; i++) {
      normalizeHomeMenuTextObject(helmetLabels[i], centerX, helmetLabelY, HOME_MENU_LABEL_SIZE);
    }

    normalizeHomeMenuObjectGroup(
      runtimeScene,
      "CharLeft",
      centerX - HOME_MENU_ARROW_OFFSET_X,
      characterLabelY,
      HOME_MENU_ARROW_SIZE,
      HOME_MENU_ARROW_SIZE
    );
    normalizeHomeMenuObjectGroup(
      runtimeScene,
      "CharRight",
      centerX + HOME_MENU_ARROW_OFFSET_X,
      characterLabelY,
      HOME_MENU_ARROW_SIZE,
      HOME_MENU_ARROW_SIZE
    );
    normalizeHomeMenuObjectGroup(
      runtimeScene,
      "HelmLeft",
      centerX - HOME_MENU_ARROW_OFFSET_X,
      helmetLabelY,
      HOME_MENU_ARROW_SIZE,
      HOME_MENU_ARROW_SIZE
    );
    normalizeHomeMenuObjectGroup(
      runtimeScene,
      "HelmRight",
      centerX + HOME_MENU_ARROW_OFFSET_X,
      helmetLabelY,
      HOME_MENU_ARROW_SIZE,
      HOME_MENU_ARROW_SIZE
    );
    normalizeHomeMenuObjectGroup(
      runtimeScene,
      "PreviewCharacter",
      centerX,
      previewY,
      HOME_MENU_PREVIEW_SIZE / NATIVE_HELMET_COVER_SCALE,
      HOME_MENU_PREVIEW_SIZE / NATIVE_HELMET_COVER_SCALE
    );
    normalizeHomeMenuObjectGroup(
      runtimeScene,
      "PreviewHelmet",
      centerX,
      previewY,
      HOME_MENU_PREVIEW_SIZE,
      HOME_MENU_PREVIEW_SIZE
    );

    const playButtons = runtimeScene.getObjects("LevelSelectScreen");
    const playLabels = runtimeScene.getObjects("Button_Text");
    for (let i = 0; i < playButtons.length; i++) {
      resizeButtonPreservingCenter(playButtons[i], OVERLAY_BUTTON_WIDTH, OVERLAY_BUTTON_HEIGHT, centerX);
      setObjectCenter(playButtons[i], centerX, playY);
      ensureButtonGlow(playButtons[i]);
    }
    for (let i = 0; i < playLabels.length; i++) {
      normalizeButtonLabel(playButtons[Math.min(i, playButtons.length - 1)], playLabels[i], true);
    }
    syncHomeMenuActionButtons(runtimeScene, !globalThis.HeadSpaceMultiplayerSetup?.isOpen?.());
  }

  const legacyCustomPlayerDataUrl = (() => {
    try {
      return localStorage.getItem(CUSTOM_PLAYER_KEY) || "";
    } catch {
      return "";
    }
  })();
  let customPlayerLibrary = (() => {
    try {
      const stored = JSON.parse(localStorage.getItem(CUSTOM_PLAYER_LIBRARY_KEY) || "[]");
      if (Array.isArray(stored)) return stored.slice(0, 5);
    } catch {}
    return [];
  })();
  if (!customPlayerLibrary.length && legacyCustomPlayerDataUrl) {
    customPlayerLibrary.push({ id: `custom-${Date.now()}`, name: "Custom Player 1", dataUrl: legacyCustomPlayerDataUrl });
  }
  let activeCustomPlayerId = (() => {
    try { return localStorage.getItem(CUSTOM_PLAYER_ACTIVE_KEY) || customPlayerLibrary[0]?.id || ""; }
    catch { return customPlayerLibrary[0]?.id || ""; }
  })();
  let customPlayerDataUrl = customPlayerLibrary.find((entry) => entry.id === activeCustomPlayerId)?.dataUrl || "";
  let customPlayerActive = !!customPlayerDataUrl;
  let customPlayerTexture = null;
  const NATIVE_CHARACTER_COUNT = 11;
  const HELMET_COUNT = 18;
  let characterCarouselIndex = customPlayerActive
    ? NATIVE_CHARACTER_COUNT + Math.max(0, customPlayerLibrary.findIndex((entry) => entry.id === activeCustomPlayerId))
    : 0;

  function saveCustomPlayerLibrary() {
    try {
      localStorage.setItem(CUSTOM_PLAYER_LIBRARY_KEY, JSON.stringify(customPlayerLibrary.slice(0, 5)));
      localStorage.setItem(CUSTOM_PLAYER_ACTIVE_KEY, activeCustomPlayerId || "");
    } catch {}
  }

  function getCustomPlayerTexture() {
    if (!customPlayerDataUrl || typeof PIXI === "undefined") return null;
    if (!customPlayerTexture) customPlayerTexture = PIXI.Texture.from(customPlayerDataUrl);
    return customPlayerTexture;
  }

  function applyCustomPlayerTexture(runtimeScene) {
    if (!customPlayerActive) return;
    const texture = getCustomPlayerTexture();
    if (!texture) return;
    for (const objectName of ["PreviewCharacter", "PlayerImage"]) {
      for (const object of runtimeScene.getObjects(objectName)) {
        if (
          objectName === "PlayerImage" &&
          isMultiplayerGame(runtimeScene, getCurrentLevel(runtimeScene)) &&
          object.__headSpaceParticipantId &&
          object.__headSpaceParticipantId !== "local-player"
        ) {
          continue;
        }
        const rendererObject = object.getRendererObject?.();
        if (!rendererObject) continue;
        if (rendererObject.texture !== texture) rendererObject.texture = texture;
        object.__headSpaceUsesCustomPlayerTexture = true;
        const helmetName = objectName === "PreviewCharacter" ? "PreviewHelmet" : "PlayerHelmet";
        const helmets = runtimeScene.getObjects(helmetName);
        const participantId = object.__headSpaceParticipantId || "";
        const helmet =
          helmets.find((candidate) => participantId && candidate.__headSpaceParticipantId === participantId) ||
          findNearestObject(object.getCenterXInScene?.() || 0, object.getCenterYInScene?.() || 0, helmets);
        const helmetRenderer = helmet?.getRendererObject?.();
        if (helmetRenderer) {
          rendererObject.anchor?.set?.(0.5, 0.5);
          rendererObject.pivot?.set?.(0, 0);
          rendererObject.position.copyFrom(helmetRenderer.position);
          rendererObject.width = helmetRenderer.width * CUSTOM_PLAYER_HELMET_FILL_SCALE;
          rendererObject.height = helmetRenderer.height * CUSTOM_PLAYER_HELMET_FILL_SCALE;
          // setSize marks GDevelop's sprite renderer dirty. Its pre-render update
          // would then rebuild the anchor from the original animation frame
          // dimensions against this 512px custom texture, shifting it down-right.
          // The PIXI transform above is authoritative for custom-player rendering.
          if (object._renderer && "_spriteDirty" in object._renderer) {
            object._renderer._spriteDirty = false;
          }
          if ("_animationFrameDirty" in object) object._animationFrameDirty = false;
        }
      }
    }
  }

  function clearNativeCharacterFaceMask(image, imageRenderer) {
    if (!imageRenderer) return;
    const previousMask = image.__headSpaceNativeFaceMask;
    if (imageRenderer.mask === previousMask) imageRenderer.mask = null;
    if (previousMask) {
      previousMask.parent?.removeChild?.(previousMask);
      previousMask.destroy?.();
    }
    image.__headSpaceNativeFaceMask = null;
  }

  function applyGameplayHelmetCoverScale(runtimeScene) {
    if (!runtimeScene) return;
    const players = runtimeScene.getObjects("Player");
    const playerImages = runtimeScene.getObjects("PlayerImage");
    const playerHelmets = runtimeScene.getObjects("PlayerHelmet");
    for (const player of players) {
      if (!player || player.getWidth() <= 0) continue;
      const centerX = player.getCenterXInScene();
      const centerY = player.getCenterYInScene();
      const participantId = player.__headSpaceParticipantId || "";
      const image =
        player.__headSpaceImageCompanion ||
        playerImages.find((candidate) => participantId && candidate.__headSpaceParticipantId === participantId) ||
        findNearestObject(centerX, centerY, playerImages);
      const helmet =
        player.__headSpaceHelmetCompanion ||
        playerHelmets.find((candidate) => participantId && candidate.__headSpaceParticipantId === participantId) ||
        findNearestObject(centerX, centerY, playerHelmets);
      // Establish permanent ownership in single-player as well as multiplayer.
      // Proximity is only a one-time recovery mechanism for legacy scene
      // instances; every later system must follow these explicit bindings.
      if (image) bindOwnedCompanion(player, image, "image");
      if (helmet) bindOwnedCompanion(player, helmet, "helmet");
      const imageRenderer = image?.getRendererObject?.();
      const helmetRenderer = helmet?.getRendererObject?.();
      if (!imageRenderer && !helmetRenderer) continue;

      // Registration invariant: both layers share a center and rotation, while
      // the selected helmet keeps its authored cover margin over the grey shell
      // baked into the character frame. Size GDevelop objects, never PIXI children.
      const bodyDiameter = Math.max(1, player.getWidth(), player.getHeight());
      // Collision/visual invariant: the outer selected helmet is the visible
      // gameplay silhouette, so its diameter must equal the hidden Player
      // physics host. The character is inset beneath it by the authored cover
      // ratio instead of enlarging the whole composite beyond collision.
      const helmetDiameter = bodyDiameter;
      const nativeImageDiameter = helmetDiameter / NATIVE_HELMET_COVER_SCALE;
      const boostActive = player.__headSpaceCosmeticBoostActive === true;
      const stretchX = boostActive
        ? clamp(Number(player.__headSpaceCosmeticBoostStretchX) || 1, 0.35, 2.25)
        : 1;
      const stretchY = boostActive
        ? clamp(Number(player.__headSpaceCosmeticBoostStretchY) || 1, 0.35, 2.25)
        : 1;
      const boostRotationDegrees = boostActive
        ? (Number(player.__headSpaceCosmeticBoostRotationRadians) || 0) * 180 / Math.PI
        : 0;
      const compositeAngle = (Number(player.getAngle?.()) || 0) + boostRotationDegrees;
      // Decide from this companion's actual renderer, not the global carousel
      // state. Scene changes can briefly leave customPlayerActive stale while a
      // native animation frame is already installed (observed on multiplayer
      // M6), which enlarged the native baked-in grey helmet by 1.18.
      const usesCustomTexture = Boolean(
        image?.__headSpaceParticipantCustomTexture || (
          image?.__headSpaceUsesCustomPlayerTexture &&
          customPlayerTexture &&
          imageRenderer?.texture === customPlayerTexture
        )
      );
      const imageDiameter = usesCustomTexture
        ? nativeImageDiameter * CUSTOM_PLAYER_HELMET_FILL_SCALE
        : nativeImageDiameter;
      if (image?.setSize) image.setSize(imageDiameter * stretchX, imageDiameter * stretchY);
      if (helmet?.setSize) {
        helmet.setSize(helmetDiameter * stretchX, helmetDiameter * stretchY);
      }
      if (image?.setCenterPositionInScene) image.setCenterPositionInScene(centerX, centerY);
      if (helmet?.setCenterPositionInScene) helmet.setCenterPositionInScene(centerX, centerY);
      image?.setAngle?.(compositeAngle);
      helmet?.setAngle?.(compositeAngle);
      // Preserve the authored composite order on every level. Absorption,
      // portals, multiplayer spawning, and scene reconstruction can recreate
      // either companion, so relying on creation order alone is not stable.
      const playerZOrder = Number(player.getZOrder?.());
      if (Number.isFinite(playerZOrder)) {
        image?.setZOrder?.(playerZOrder + 1);
        helmet?.setZOrder?.(playerZOrder + 2);
      }

      const referencePosition = imageRenderer?.position || helmetRenderer?.position;
      if (imageRenderer && referencePosition) {
        imageRenderer.position.copyFrom(referencePosition);
        if (!player.__headSpaceLevelNinePortalTransit && !player.__headSpaceBlackHoleTransit) {
          imageRenderer.rotation = (compositeAngle * Math.PI) / 180;
        }
      }
      if (helmetRenderer && referencePosition) {
        helmetRenderer.position.copyFrom(referencePosition);
        if (!player.__headSpaceLevelNinePortalTransit && !player.__headSpaceBlackHoleTransit) {
          helmetRenderer.rotation = (compositeAngle * Math.PI) / 180;
        }
      }
      // Use the same authored character/helmet overlay as the home preview.
      // A generated ellipse changes the silhouette and exposes a pale ring from
      // the old shell baked into native character frames.
      clearNativeCharacterFaceMask(image, imageRenderer);
    }
  }

  function synchronizePlayerCollisionWithVisibleDiameter(runtimeScene) {
    if (!runtimeScene) return;
    for (const player of runtimeScene.getObjects("Player")) {
      if (!player || player.getWidth?.() <= 0 || !player.hasBehavior?.("Physics2")) continue;
      const physics = player.getBehavior("Physics2");
      // Player is authored as an automatic Physics2 circle
      // (shapeDimensionA === 0). GDevelop already rebuilds that circle from
      // owner width/height, so applying the sprite scale again is incorrect.
      // The project also authored a 1px local X offset; remove it so the
      // fixture center is exactly the visible composite center at every size.
      let recreate = false;
      if (physics.shape === "Circle" && Number(physics.shapeDimensionA) <= 0) {
        if (Number(physics.getShapeScale?.()) !== 1 && physics.setShapeScale) {
          physics.setShapeScale(1);
        }
        if (Number(physics.shapeOffsetX) !== 0) {
          physics.shapeOffsetX = 0;
          recreate = true;
        }
        if (Number(physics.shapeOffsetY) !== 0) {
          physics.shapeOffsetY = 0;
          recreate = true;
        }
        if (recreate) physics.recreateShape?.();
      }
    }
  }

  function lockGameplayPlayerCosmeticComposites(runtimeScene) {
    if (!runtimeScene) return;
    const playerImages = runtimeScene.getObjects("PlayerImage");
    const playerHelmets = runtimeScene.getObjects("PlayerHelmet");
    for (const player of runtimeScene.getObjects("Player")) {
      if (!player || player.getWidth?.() <= 0) continue;
      const participantId = player.__headSpaceParticipantId || "";
      const centerX = player.getCenterXInScene?.() || 0;
      const centerY = player.getCenterYInScene?.() || 0;
      const image =
        player.__headSpaceImageCompanion ||
        playerImages.find((candidate) => participantId && candidate.__headSpaceParticipantId === participantId) ||
        findNearestObject(centerX, centerY, playerImages);
      const helmet =
        player.__headSpaceHelmetCompanion ||
        playerHelmets.find((candidate) => participantId && candidate.__headSpaceParticipantId === participantId) ||
        findNearestObject(centerX, centerY, playerHelmets);
      if (!image || !helmet) continue;

      // The hidden Player body is the sole gameplay-size authority. Never
      // derive a companion size from PlayerImage's PIXI renderer: replacing
      // the native 140px texture with a 512px custom face otherwise feeds the
      // rendered width back into the helmet every frame while Physics2 stays
      // body-sized.
      image.setCenterPositionInScene?.(centerX, centerY);
      helmet.setCenterPositionInScene?.(centerX, centerY);
      const imageRenderer = image.getRendererObject?.();
      const helmetRenderer = helmet.getRendererObject?.();
      if (!imageRenderer || !helmetRenderer) continue;
      // The helmet is the visible collision silhouette. The custom face is a
      // visual fill within it and cannot resize or reposition that silhouette.
      imageRenderer.position?.copyFrom?.(helmetRenderer.position);
      imageRenderer.rotation = helmetRenderer.rotation;
    }
  }

  function enforceGameplayHelmetOcclusion(runtimeScene) {
    if (!runtimeScene) return;
    const playerImages = runtimeScene.getObjects("PlayerImage");
    const playerHelmets = runtimeScene.getObjects("PlayerHelmet");
    for (const player of runtimeScene.getObjects("Player")) {
      if (!player || player.getWidth?.() <= 0) continue;
      const participantId = player.__headSpaceParticipantId || "";
      const centerX = player.getCenterXInScene?.() || 0;
      const centerY = player.getCenterYInScene?.() || 0;
      const image =
        player.__headSpaceImageCompanion ||
        playerImages.find((candidate) => participantId && candidate.__headSpaceParticipantId === participantId) ||
        findNearestObject(centerX, centerY, playerImages);
      const helmet =
        player.__headSpaceHelmetCompanion ||
        playerHelmets.find((candidate) => participantId && candidate.__headSpaceParticipantId === participantId) ||
        findNearestObject(centerX, centerY, playerHelmets);
      if (!image && !helmet) continue;

      // Player is the physics host and its authored frame contains the grey
      // fallback helmet. Rendering it beneath a selected cosmetic allows that
      // fallback to show through transparent frame padding. Keep the host fully
      // invisible whenever the face/helmet companion stack is available.
      player.hide?.(true);
      player.setOpacity?.(0);
      const playerRenderer = player.getRendererObject?.();
      if (playerRenderer) {
        playerRenderer.visible = false;
        playerRenderer.renderable = false;
        playerRenderer.alpha = 0;
      }

      for (const companion of [image, helmet]) {
        if (!companion) continue;
        companion.hide?.(false);
        companion.setOpacity?.(255);
        const renderer = companion.getRendererObject?.();
        if (renderer) {
          renderer.visible = true;
          renderer.renderable = true;
          renderer.alpha = 1;
        }
      }
    }
  }

  function randomizeHomeHelmet(runtimeScene) {
    if (getCurrentLevel(runtimeScene) !== 0) return;
    const randomIndex = Math.floor(Math.random() * HELMET_COUNT);
    runtimeScene.getGame().getVariables().getFromIndex(1).setNumber(randomIndex);
    for (const helmet of runtimeScene.getObjects("PreviewHelmet")) {
      helmet.getBehavior("Animation")?.setAnimationIndex(randomIndex);
    }
  }

  function capturePlayerSelectionSnapshot(runtimeScene) {
    if (!runtimeScene) return null;
    const game = runtimeScene.getGame?.();
    if (!game) return null;
    const selectedAnimationIndex = (objectName, fallback) => {
      const objects = runtimeScene.getObjects(objectName);
      const local = objects.find((object) => object.__headSpaceParticipantId === "local-player") || objects[0];
      const animation = local?.getBehavior?.("Animation");
      const index = Number(animation?.getAnimationIndex?.());
      return Number.isFinite(index) ? Math.max(0, Math.round(index)) : fallback;
    };
    const variableCharacterIndex = Math.max(
      0,
      Math.round(game.getVariables().getFromIndex(0).getAsNumber())
    );
    const variableHelmetIndex = Math.max(
      0,
      Math.round(game.getVariables().getFromIndex(1).getAsNumber())
    );
    const characterIndex = selectedAnimationIndex(
      runtimeScene.getObjects("PlayerImage").length ? "PlayerImage" : "PreviewCharacter",
      variableCharacterIndex
    );
    const helmetIndex = selectedAnimationIndex(
      runtimeScene.getObjects("PlayerHelmet").length ? "PlayerHelmet" : "PreviewHelmet",
      variableHelmetIndex
    );
    return {
      characterIndex,
      helmetIndex,
      carouselIndex: characterCarouselIndex,
      customPlayerActive,
      activeCustomPlayerId,
      customPlayerDataUrl,
    };
  }

  function restorePlayerSelectionSnapshot(runtimeScene, snapshot) {
    if (!runtimeScene || !snapshot) return;
    const game = runtimeScene.getGame?.();
    if (!game) return;
    game.getVariables().getFromIndex(0).setNumber(snapshot.characterIndex);
    game.getVariables().getFromIndex(1).setNumber(snapshot.helmetIndex);
    characterCarouselIndex = snapshot.carouselIndex;
    customPlayerActive = snapshot.customPlayerActive;
    activeCustomPlayerId = snapshot.activeCustomPlayerId;
    customPlayerDataUrl = snapshot.customPlayerDataUrl;
    lastAllowedHelmetSelectionByGame.set(game, snapshot.helmetIndex);
    for (const preview of runtimeScene.getObjects("PreviewCharacter")) {
      preview.getBehavior("Animation")?.setAnimationIndex(snapshot.characterIndex);
      preview._animationFrameDirty = true;
      preview._updateAnimationFrame?.();
      preview._renderer?.update?.();
    }
    for (const helmet of runtimeScene.getObjects("PreviewHelmet")) {
      helmet.getBehavior("Animation")?.setAnimationIndex(snapshot.helmetIndex);
      helmet._animationFrameDirty = true;
      helmet._updateAnimationFrame?.();
      helmet._renderer?.update?.();
    }
    try {
      localStorage.setItem("headspace-selected-character-index", String(snapshot.characterIndex));
      localStorage.setItem("headspace-selected-helmet-index", String(snapshot.helmetIndex));
    } catch {}
    applyCustomPlayerTexture(runtimeScene);
  }

  function captureCharacterCarouselSelection(runtimeScene) {
    if (getCurrentLevel(runtimeScene) !== 0 || customPlayerActive) return;
    const nativeIndex = runtimeScene.getGame().getVariables().getFromIndex(0).getAsNumber();
    characterCarouselIndex = clamp(Math.round(nativeIndex), 0, NATIVE_CHARACTER_COUNT - 1);
  }

  function persistHomePlayerSelection(runtimeScene) {
    if (!runtimeScene || Number(getCurrentLevel(runtimeScene)) !== 0) return;
    try {
      const gameVariables = runtimeScene.getGame().getVariables();
      localStorage.setItem(
        "headspace-selected-character-index",
        String(clamp(Math.round(gameVariables.getFromIndex(0).getAsNumber()), 0, NATIVE_CHARACTER_COUNT - 1))
      );
      localStorage.setItem(
        "headspace-selected-helmet-index",
        String(clamp(Math.round(gameVariables.getFromIndex(1).getAsNumber()), 0, HELMET_COUNT - 1))
      );
    } catch {}
  }

  function selectNativeCarouselCharacter(runtimeScene, nativeIndex) {
    customPlayerActive = false;
    activeCustomPlayerId = "";
    customPlayerDataUrl = "";
    if (customPlayerTexture) customPlayerTexture.destroy(true);
    customPlayerTexture = null;
    runtimeScene.getGame().getVariables().getFromIndex(0).setNumber(nativeIndex);
    for (const preview of runtimeScene.getObjects("PreviewCharacter")) {
      preview.getBehavior("Animation")?.setAnimationIndex(nativeIndex);
      preview._animationFrameDirty = true;
      preview._updateAnimationFrame?.();
      preview._renderer?.update?.();
    }
    saveCustomPlayerLibrary();
  }

  function selectCustomCarouselCharacter(runtimeScene, entry) {
    if (!entry) return;
    activeCustomPlayerId = entry.id;
    customPlayerDataUrl = entry.dataUrl;
    customPlayerActive = true;
    if (customPlayerTexture) customPlayerTexture.destroy(true);
    customPlayerTexture = PIXI.Texture.from(customPlayerDataUrl);
    saveCustomPlayerLibrary();
    applyCustomPlayerTexture(runtimeScene);
  }

  function navigateCharacterCarousel(runtimeScene) {
    if (getCurrentLevel(runtimeScene) !== 0) return;
    if (!gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left")) return;
    const right = runtimeScene.getObjects("CharRight").some((arrow) => arrow.isVisible() && arrow.cursorOnObject(runtimeScene));
    const left = runtimeScene.getObjects("CharLeft").some((arrow) => arrow.isVisible() && arrow.cursorOnObject(runtimeScene));
    if (!right && !left) return;

    const total = NATIVE_CHARACTER_COUNT + customPlayerLibrary.length;
    if (!total) return;
    characterCarouselIndex = ((characterCarouselIndex + (right ? 1 : -1)) % total + total) % total;
    if (characterCarouselIndex < NATIVE_CHARACTER_COUNT) {
      selectNativeCarouselCharacter(runtimeScene, characterCarouselIndex);
      return;
    }
    selectCustomCarouselCharacter(runtimeScene, customPlayerLibrary[characterCarouselIndex - NATIVE_CHARACTER_COUNT]);
  }

  function getSelectedHelmetUrl(runtimeScene) {
    const helmet = runtimeScene.getObjects("PreviewHelmet")[0];
    const texture = helmet?.getRendererObject?.()?.texture;
    return (
      texture?.baseTexture?.resource?.url ||
      texture?.baseTexture?.resource?.source?.currentSrc ||
      texture?.baseTexture?.resource?.source?.src ||
      ""
    );
  }

  function getSelectedCharacterUrl(runtimeScene) {
    const character = runtimeScene.getObjects("PreviewCharacter")[0];
    const texture = character?.getRendererObject?.()?.texture;
    return (
      texture?.baseTexture?.resource?.url ||
      texture?.baseTexture?.resource?.source?.currentSrc ||
      texture?.baseTexture?.resource?.source?.src ||
      ""
    );
  }

  function closeCustomPlayerCreator() {
    const creator = document.getElementById(CUSTOM_PLAYER_CREATOR_ID);
    const stream = creator?.__headSpaceCameraStream;
    if (stream) for (const track of stream.getTracks()) track.stop();
    creator?.remove();
  }

  function openCustomPlayerCreator(runtimeScene) {
    closeCustomPlayerCreator();

    const creator = document.createElement("section");
    creator.id = CUSTOM_PLAYER_CREATOR_ID;
    creator.setAttribute("role", "dialog");
    creator.setAttribute("aria-modal", "true");
    creator.setAttribute("aria-label", "Custom player creator");
    creator.style.cssText = [
      "position:fixed", "inset:0", "z-index:1000000", "overflow:auto",
      "display:flex", "align-items:center", "justify-content:center", "padding:24px",
      "box-sizing:border-box", "color:#fff", "font-family:Achron,Segoe UI,sans-serif",
      "background:radial-gradient(circle at 50% 35%,rgba(10,54,100,.96),rgba(1,5,18,.99) 62%)"
    ].join(";");
    creator.innerHTML = `
      <div style="width:min(980px,100%);min-height:min(650px,calc(100vh - 48px));box-sizing:border-box;border:2px solid #58d9ff;border-radius:24px;background:rgba(2,9,24,.94);box-shadow:0 0 42px rgba(31,185,255,.42),inset 0 0 40px rgba(21,111,190,.18);padding:clamp(20px,4vw,42px);display:grid;grid-template-columns:minmax(280px,1fr) minmax(280px,1fr);gap:clamp(24px,5vw,64px);align-items:center">
        <div style="text-align:center">
          <div style="font-size:clamp(34px,5vw,58px);letter-spacing:3px;text-shadow:3px 0 #00ffc8,-3px 0 #ff2ab8">CUSTOM PLAYER</div>
          <p style="margin:12px auto 24px;max-width:540px;color:#bceeff;font:18px/1.5 Segoe UI,sans-serif">Upload a photo or use your camera, then position your face inside the helmet.</p>
          <div id="headSpaceCustomPreview" style="position:relative;width:min(340px,72vw);aspect-ratio:1;margin:auto;border-radius:50%;overflow:hidden;background:radial-gradient(circle,#17395a,#020817 72%);box-shadow:0 0 0 3px #55dfff,0 0 32px #148bd8">
            <canvas width="512" height="512" style="position:absolute;inset:0;width:100%;height:100%"></canvas>
            <img alt="Selected helmet" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;pointer-events:none;image-rendering:auto" />
            <div data-empty style="position:absolute;inset:0;display:grid;place-items:center;padding:44px;color:#94cae5;font:17px/1.4 Segoe UI,sans-serif">Choose a photo to begin</div>
          </div>
          <div style="display:grid;grid-template-columns:64px 1fr 64px;align-items:center;gap:12px;width:min(340px,72vw);margin:16px auto 0">
            <button data-helmet-left type="button" class="headspace-creator-button" aria-label="Previous helmet" style="min-height:46px;font-size:28px">◀</button>
            <div style="color:#bceeff;font:16px Segoe UI,sans-serif;letter-spacing:1px">CHOOSE HELMET</div>
            <button data-helmet-right type="button" class="headspace-creator-button" aria-label="Next helmet" style="min-height:46px;font-size:28px">▶</button>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:16px">
          <input data-file type="file" accept="image/*" hidden />
          <button data-upload type="button" class="headspace-creator-button">UPLOAD PHOTO</button>
          <button data-camera type="button" class="headspace-creator-button">USE CAMERA</button>
          <div data-camera-panel hidden style="border:1px solid #2ebde9;border-radius:14px;padding:12px;background:#010713">
            <video playsinline autoplay muted style="display:block;width:100%;max-height:230px;object-fit:cover;border-radius:10px"></video>
            <button data-capture type="button" class="headspace-creator-button" style="margin-top:10px;width:100%">TAKE PICTURE</button>
          </div>
          <label style="font:15px Segoe UI,sans-serif;color:#bceeff">ZOOM <input data-zoom type="range" min="1" max="3" value="1" step="0.01" style="width:100%"></label>
          <label style="font:15px Segoe UI,sans-serif;color:#bceeff">MOVE LEFT / RIGHT <input data-x type="range" min="-100" max="100" value="0" step="1" style="width:100%"></label>
          <label style="font:15px Segoe UI,sans-serif;color:#bceeff">MOVE UP / DOWN <input data-y type="range" min="-100" max="100" value="0" step="1" style="width:100%"></label>
          <label style="font:15px Segoe UI,sans-serif;color:#bceeff">ROTATE IMAGE <input data-rotate type="range" min="-180" max="180" value="0" step="1" style="width:100%"></label>
          <label style="font:15px Segoe UI,sans-serif;color:#bceeff">CHARACTER NAME <input data-name type="text" maxlength="24" placeholder="My Headnaut" style="display:block;width:100%;box-sizing:border-box;margin-top:6px;padding:10px 12px;border:1px solid #43d6ff;border-radius:8px;background:#010713;color:#fff;font:17px Segoe UI,sans-serif"></label>
          <div data-status aria-live="polite" style="min-height:24px;color:#81e8ff;font:15px Segoe UI,sans-serif"></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:4px">
            <button data-home type="button" class="headspace-creator-button" style="border-color:#8092a8">HOME</button>
            <button data-save type="button" class="headspace-creator-button" style="border-color:#ffe34d;color:#fff2a0">USE PLAYER</button>
          </div>
        </div>
        <div style="grid-column:1/-1;border-top:1px solid rgba(83,213,255,.35);padding-top:20px">
          <div style="display:flex;align-items:end;justify-content:space-between;gap:12px;margin-bottom:12px">
            <div><div style="font-size:24px;color:#d9f7ff">SAVED CHARACTERS</div><div style="font:14px Segoe UI,sans-serif;color:#83cfe8">Save and manage up to five custom players.</div></div>
            <div data-slot-count style="font:15px Segoe UI,sans-serif;color:#ffe87b"></div>
          </div>
          <div data-slots style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px"></div>
        </div>
      </div>`;
    const style = document.createElement("style");
    style.textContent = `
      #${CUSTOM_PLAYER_CREATOR_ID} .headspace-creator-button{min-height:54px;border:2px solid #43d6ff;border-radius:11px;background:#020b1b;color:#fff;font:22px Achron,Segoe UI,sans-serif;letter-spacing:1px;cursor:pointer;box-shadow:inset 0 0 14px rgba(38,183,255,.16),0 0 12px rgba(38,183,255,.14)}
      #${CUSTOM_PLAYER_CREATOR_ID} .headspace-creator-button:hover{filter:brightness(1.3);box-shadow:0 0 18px rgba(74,216,255,.5)}
      #${CUSTOM_PLAYER_CREATOR_ID} input[type=range]{accent-color:#43d6ff}
      @media(max-width:760px){#${CUSTOM_PLAYER_CREATOR_ID}>div{grid-template-columns:1fr!important}}
      @media(max-width:760px){#${CUSTOM_PLAYER_CREATOR_ID} [data-slots]{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
    `;
    creator.appendChild(style);
    document.body.appendChild(creator);

    const creatorPanel = creator.firstElementChild;
    const browserZoomCompensation = Math.min(
      5,
      Math.max(1, 1 / Math.max(0.2, window.devicePixelRatio || 1))
    );
    creatorPanel.style.transform = `scale(${browserZoomCompensation})`;
    creatorPanel.style.transformOrigin = "center center";

    const previewCanvas = creator.querySelector("canvas");
    const previewContext = previewCanvas.getContext("2d");
    const helmetImage = creator.querySelector("img");
    const emptyMessage = creator.querySelector("[data-empty]");
    const status = creator.querySelector("[data-status]");
    const fileInput = creator.querySelector("[data-file]");
    const zoomInput = creator.querySelector("[data-zoom]");
    const xInput = creator.querySelector("[data-x]");
    const yInput = creator.querySelector("[data-y]");
    const rotateInput = creator.querySelector("[data-rotate]");
    const nameInput = creator.querySelector("[data-name]");
    const slotsContainer = creator.querySelector("[data-slots]");
    const slotCount = creator.querySelector("[data-slot-count]");
    const video = creator.querySelector("video");
    const cameraPanel = creator.querySelector("[data-camera-panel]");
    const helmetUrl = getSelectedHelmetUrl(runtimeScene);
    if (helmetUrl) helmetImage.src = helmetUrl;
    let sourceImage = null;
    let editingCustomPlayerId = activeCustomPlayerId;

    function activateLibraryEntry(entry, closeAfter = true) {
      activeCustomPlayerId = entry.id;
      customPlayerDataUrl = entry.dataUrl;
      customPlayerActive = true;
      if (customPlayerTexture) customPlayerTexture.destroy(true);
      customPlayerTexture = PIXI.Texture.from(customPlayerDataUrl);
      characterCarouselIndex = NATIVE_CHARACTER_COUNT + customPlayerLibrary.findIndex((item) => item.id === entry.id);
      saveCustomPlayerLibrary();
      applyCustomPlayerTexture(runtimeScene);
      if (closeAfter) closeCustomPlayerCreator();
    }

    function renderLibrary() {
      slotsContainer.replaceChildren();
      slotCount.textContent = `${customPlayerLibrary.length} / 5`;
      for (let index = 0; index < 5; index++) {
        const entry = customPlayerLibrary[index];
        const slot = document.createElement("div");
        slot.style.cssText = "min-height:138px;border:1px solid rgba(77,205,255,.55);border-radius:10px;background:rgba(1,8,22,.85);padding:9px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;text-align:center";
        if (!entry) {
          slot.innerHTML = `<div style="font:28px Segoe UI,sans-serif;color:#38647b">+</div><div style="font:13px Segoe UI,sans-serif;color:#648ba0">EMPTY SLOT</div>`;
          slotsContainer.appendChild(slot);
          continue;
        }
        const selected = customPlayerActive && entry.id === activeCustomPlayerId;
        const safeName = String(entry.name).replace(/[&<>"']/g, (character) => ({
          "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
        })[character]);
        slot.style.borderColor = selected ? "#ffe34d" : "rgba(77,205,255,.55)";
        slot.innerHTML = `
          <img alt="" src="${entry.dataUrl}" style="width:58px;height:58px;border-radius:50%;object-fit:contain;background:#06162a">
          <div title="${safeName}" style="width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:14px Segoe UI,sans-serif;color:${selected ? "#fff1a0" : "#e3f8ff"}">${safeName}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;width:100%">
            <button data-use type="button" style="border:1px solid #45d7ff;border-radius:5px;background:#071427;color:#fff;font:11px Segoe UI,sans-serif;cursor:pointer;padding:5px">USE</button>
            <button data-edit type="button" style="border:1px solid #ffe34d;border-radius:5px;background:#171506;color:#fff1a0;font:11px Segoe UI,sans-serif;cursor:pointer;padding:5px">EDIT</button>
            <button data-remove type="button" style="border:1px solid #ff6378;border-radius:5px;background:#190912;color:#ffb6c0;font:11px Segoe UI,sans-serif;cursor:pointer;padding:5px">REMOVE</button>
          </div>`;
        slot.querySelector("[data-use]").addEventListener("click", () => activateLibraryEntry(entry));
        slot.querySelector("[data-edit]").addEventListener("click", () => {
          editingCustomPlayerId = entry.id;
          nameInput.value = entry.name;
          loadImageUrl(
            entry.dataUrl,
            "Editing saved character. Adjust it, then choose Use Player to save changes."
          );
          creatorPanel.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        slot.querySelector("[data-remove]").addEventListener("click", () => {
          customPlayerLibrary = customPlayerLibrary.filter((item) => item.id !== entry.id);
          if (activeCustomPlayerId === entry.id) {
            const nativeIndex = clamp(
              runtimeScene.getGame().getVariables().getFromIndex(0).getAsNumber(),
              0,
              NATIVE_CHARACTER_COUNT - 1
            );
            characterCarouselIndex = nativeIndex;
            selectNativeCarouselCharacter(runtimeScene, nativeIndex);
          }
          if (editingCustomPlayerId === entry.id) editingCustomPlayerId = "";
          saveCustomPlayerLibrary();
          renderLibrary();
        });
        slotsContainer.appendChild(slot);
      }
    }

    function drawFace(targetContext, size) {
      targetContext.clearRect(0, 0, size, size);
      if (!sourceImage) return;
      const zoom = Number(zoomInput.value);
      const baseScale = Math.max(size / sourceImage.naturalWidth, size / sourceImage.naturalHeight);
      const drawWidth = sourceImage.naturalWidth * baseScale * zoom;
      const drawHeight = sourceImage.naturalHeight * baseScale * zoom;
      const offsetX = Number(xInput.value) / 100 * size * 0.36;
      const offsetY = Number(yInput.value) / 100 * size * 0.36;
      targetContext.save();
      targetContext.imageSmoothingEnabled = true;
      targetContext.imageSmoothingQuality = "high";
      targetContext.beginPath();
      targetContext.ellipse(size / 2, size * 0.515, size * 0.285, size * 0.355, 0, 0, Math.PI * 2);
      targetContext.clip();
      targetContext.translate(size / 2 + offsetX, size / 2 + offsetY);
      targetContext.rotate(Number(rotateInput.value) * Math.PI / 180);
      targetContext.drawImage(sourceImage, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      targetContext.restore();
    }

    function refreshPreview() {
      drawFace(previewContext, 512);
      emptyMessage.style.display = sourceImage ? "none" : "grid";
    }

    function loadImageUrl(url, readyMessage = "Position your face, then choose Use Player.") {
      const image = new Image();
      image.onload = () => {
        sourceImage = image;
        zoomInput.value = "1";
        xInput.value = "0";
        yInput.value = "0";
        rotateInput.value = "0";
        status.textContent = readyMessage;
        refreshPreview();
      };
      image.onerror = () => { status.textContent = "That image could not be opened. Please try another."; };
      image.src = url;
    }

    const activeEntry = customPlayerLibrary.find((entry) => entry.id === activeCustomPlayerId);
    if (activeEntry) {
      nameInput.value = activeEntry.name;
      loadImageUrl(activeEntry.dataUrl);
    }
    renderLibrary();
    function changeCreatorHelmet(direction) {
      const helmetVariable = runtimeScene.getGame().getVariables().getFromIndex(1);
      const currentIndex = Math.round(helmetVariable.getAsNumber());
      const nextIndex = ((currentIndex + direction) % HELMET_COUNT + HELMET_COUNT) % HELMET_COUNT;
      helmetVariable.setNumber(nextIndex);
      for (const helmet of runtimeScene.getObjects("PreviewHelmet")) {
        helmet.getBehavior("Animation")?.setAnimationIndex(nextIndex);
        helmet._animationFrameDirty = true;
        helmet._updateAnimationFrame?.();
      }
      requestAnimationFrame(() => {
        const nextHelmetUrl = getSelectedHelmetUrl(runtimeScene);
        if (nextHelmetUrl) helmetImage.src = nextHelmetUrl;
      });
    }
    creator.querySelector("[data-helmet-left]").addEventListener("click", () => changeCreatorHelmet(-1));
    creator.querySelector("[data-helmet-right]").addEventListener("click", () => changeCreatorHelmet(1));
    creator.querySelector("[data-upload]").addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", () => {
      const file = fileInput.files?.[0];
      if (file) {
        editingCustomPlayerId = "";
        nameInput.value = `Custom Player ${Math.min(5, customPlayerLibrary.length + 1)}`;
        loadImageUrl(URL.createObjectURL(file));
      }
    });
    for (const input of [zoomInput, xInput, yInput, rotateInput]) input.addEventListener("input", refreshPreview);

    creator.querySelector("[data-camera]").addEventListener("click", async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        status.textContent = "Camera access is not available in this browser.";
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
        creator.__headSpaceCameraStream = stream;
        video.srcObject = stream;
        cameraPanel.hidden = false;
        status.textContent = "Center your face and take the picture.";
      } catch {
        status.textContent = "Camera permission was not granted. You can upload a photo instead.";
      }
    });
    creator.querySelector("[data-capture]").addEventListener("click", () => {
      if (!video.videoWidth) return;
      const capture = document.createElement("canvas");
      capture.width = video.videoWidth;
      capture.height = video.videoHeight;
      const captureContext = capture.getContext("2d");
      captureContext.translate(capture.width, 0);
      captureContext.scale(-1, 1);
      captureContext.drawImage(video, 0, 0);
      editingCustomPlayerId = "";
      nameInput.value = `Custom Player ${Math.min(5, customPlayerLibrary.length + 1)}`;
      loadImageUrl(capture.toDataURL("image/jpeg", 0.92));
      for (const track of creator.__headSpaceCameraStream?.getTracks?.() || []) track.stop();
      creator.__headSpaceCameraStream = null;
      cameraPanel.hidden = true;
    });

    creator.querySelector("[data-home]").addEventListener("click", () => {
      closeCustomPlayerCreator();
      if (getCurrentLevel(runtimeScene) !== 0) navigateToLevel(runtimeScene, 0);
    });
    creator.querySelector("[data-save]").addEventListener("click", () => {
      if (!sourceImage) {
        status.textContent = "Choose or take a photo first.";
        return;
      }
      const output = document.createElement("canvas");
      output.width = 512;
      output.height = 512;
      drawFace(output.getContext("2d"), 512);
      const dataUrl = output.toDataURL("image/png");
      const name = nameInput.value.trim() || `Custom Player ${Math.min(5, customPlayerLibrary.length + 1)}`;
      let entry = customPlayerLibrary.find((item) => item.id === editingCustomPlayerId);
      if (entry) {
        entry.name = name;
        entry.dataUrl = dataUrl;
      } else {
        if (customPlayerLibrary.length >= 5) {
          status.textContent = "All five slots are full. Remove a saved character before adding another.";
          return;
        }
        entry = { id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name, dataUrl };
        customPlayerLibrary.push(entry);
      }
      editingCustomPlayerId = entry.id;
      activateLibraryEntry(entry);
    });
  }

  function createNativeHomeMenuActionButton(runtimeScene, layerRenderer, spec) {
    const width = 250;
    const height = OVERLAY_BUTTON_HEIGHT;
    const cut = 13;
    const points = [
      -width / 2 + cut, -height / 2,
      width / 2 - cut, -height / 2,
      width / 2, -height / 2 + cut,
      width / 2, height / 2 - cut,
      width / 2 - cut, height / 2,
      -width / 2 + cut, height / 2,
      -width / 2, height / 2 - cut,
      -width / 2, -height / 2 + cut,
    ];
    const container = new PIXI.Container();
    const frame = new PIXI.Graphics();
    frame.lineStyle(4, spec.color, 1);
    frame.beginFill(0x01060e, 0.98);
    frame.drawPolygon(points);
    frame.endFill();
    const nativeGlow = PIXI.filters?.GlowFilter
      ? new PIXI.filters.GlowFilter({
          distance: BUTTON_HOVER_GLOW_PADDING,
          outerStrength: BUTTON_GLOW_THICKNESS,
          innerStrength: 0,
          color: spec.color,
          quality: 0.1,
          alpha: BUTTON_GLOW_ALPHA,
        })
      : null;
    frame.filters = null;
    const setGlowHovered = (hovered) => {
      if (!nativeGlow) return;
      nativeGlow.outerStrength = BUTTON_HOVER_GLOW_THICKNESS;
      nativeGlow.alpha = BUTTON_HOVER_GLOW_ALPHA;
      nativeGlow.padding = BUTTON_HOVER_GLOW_PADDING;
      frame.filters = hovered ? [nativeGlow] : null;
    };
    setGlowHovered(false);

    const stars = new PIXI.Graphics();
    for (let i = 0; i < 74; i++) {
      const x = -width * 0.43 + ((i * 83) % 217) / 217 * width * 0.86;
      const y = -height * 0.34 + ((i * 47) % 131) / 131 * height * 0.68;
      const radius = i % 11 === 0 ? 1.15 : i % 4 === 0 ? 0.78 : 0.48;
      stars.beginFill(i % 5 === 0 ? 0x67dfff : 0xffffff, i % 3 === 0 ? 0.72 : 0.46);
      stars.drawCircle(x, y, radius);
      stars.endFill();
    }

    const playLabelRenderer = runtimeScene.getObjects("Button_Text")[0]?.getRendererObject?.();
    const playFontFamily = playLabelRenderer?.style?.fontFamily || "Achron.otf";

    const makeText = (color, x) => {
      const textObject = new PIXI.Text(spec.label, {
        fontFamily: playFontFamily,
        fontSize: spec.label === "CUSTOM PLAYER" ? 27 : 30,
        fontWeight: "normal",
        fill: color,
        align: "center",
      });
      if (textObject.anchor?.set) textObject.anchor.set(0.5);
      textObject.position.set(x, 1);
      return textObject;
    };
    const cyanText = makeText(0x00ffc8, 2.5);
    const magentaText = makeText(0xff2ab8, -2.5);
    const mainText = makeText(0xffffff, 0);
    container.addChild(frame, stars, cyanText, magentaText, mainText);
    container.eventMode = "static";
    container.cursor = "pointer";
    container.hitArea = new PIXI.Polygon(points);
    container.on("pointerover", () => setGlowHovered(true));
    container.on("pointerout", () => {
      container.scale.set(1);
      setGlowHovered(false);
    });
    container.on("pointerdown", () => container.scale.set(0.97));
    container.on("pointerup", () => {
      container.scale.set(1);
      setGlowHovered(true);
    });
    layerRenderer.addRendererObject(container, 10000);
    return { container, side: spec.side, width, height, action: spec.action, setGlowHovered };
  }

  function syncNativeHomeMenuActionButtons(runtimeScene, visible) {
    let system = homeMenuActionButtonState.get(runtimeScene);
    if (!system && visible && typeof PIXI !== "undefined") {
      const layerRenderer = runtimeScene.getLayer("")?.getRenderer?.();
      if (layerRenderer) {
        const buttons = [
          createNativeHomeMenuActionButton(runtimeScene, layerRenderer, {
            label: "MULTIPLAYER", side: -1, color: 0xff3b4f, action: "multiplayer",
          }),
          createNativeHomeMenuActionButton(runtimeScene, layerRenderer, {
            label: "CUSTOM PLAYER", side: 1, color: 0xffe34d, action: "custom-player",
          }),
        ];
        system = { buttons };
        homeMenuActionButtonState.set(runtimeScene, system);
      }
    }
    if (!system) return;
    const menuCamera = getUnzoomedViewportFrame(runtimeScene, "");
    const y = menuCamera.y + menuCamera.height * HOME_MENU_PLAY_Y_RATIO;
    const cursorX = gdjs.evtTools.input.getCursorX(runtimeScene, "", 0);
    const cursorY = gdjs.evtTools.input.getCursorY(runtimeScene, "", 0);
    const mouseReleased = gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left");
    for (const button of system.buttons) {
      button.container.visible = !!visible;
      const x = menuCamera.x + button.side * menuCamera.width * HOME_MENU_ACTION_BUTTON_OFFSET_RATIO;
      button.container.position.set(x, y);
      const hovered =
        !!visible &&
        Math.abs(cursorX - x) <= button.width * 0.5 &&
        Math.abs(cursorY - y) <= button.height * 0.5;
      button.setGlowHovered(hovered);
      if (hovered && mouseReleased) {
        if (button.action === "multiplayer") openMultiplayerSetup(runtimeScene);
        if (
          button.action === "custom-player" &&
          !document.getElementById(CUSTOM_PLAYER_CREATOR_ID)
        ) {
          openCustomPlayerCreator(runtimeScene);
        }
      }
    }
  }

  function openMultiplayerSetup(runtimeScene) {
    const setup = globalThis.HeadSpaceMultiplayerSetup;
    if (!setup?.open || Number(getCurrentLevel(runtimeScene)) !== 0) return;
    try {
      // The setup is an HTML overlay above the GDevelop home scene. Freeze the
      // scene while it is open so clicks on level cards cannot also activate
      // the native PLAY control underneath the overlay.
      setSceneBoolean(runtimeScene, "Paused", true);
      setRuntimeTimeScale(runtimeScene, 0);
      setHudVisible(false);
      setPauseOverlayVisible(false);
      const launchMultiplayerMatch = (room) => {
        const level = Number(room?.level);
        if (!isPlayableLevel(level)) return;
        const gameVariables = runtimeScene.getGame().getVariables();
        const playerCount = Array.isArray(room?.players)
          ? room.players.length
          : Number(room?.playerCount) || 1;
        gameVariables.get("MultiplayerMode").setBoolean(true);
        gameVariables.get("MultiplayerLevel").setNumber(level);
        gameVariables.get("MultiplayerGameMode").setString(
          room?.mode === "hunt-the-boss" ? "hunt-the-boss" : "head-to-head"
        );
        gameVariables.get("MultiplayerRoomCode").setString(String(room.code || ""));
        gameVariables.get("MultiplayerPlayerCount").setNumber(
          Math.min(4, Math.max(1, playerCount))
        );
        multiplayerInputSuppressedUntil = performance.now() + 500;
        setup.close();
        setSceneBoolean(runtimeScene, "Paused", false);
        setRuntimeTimeScale(runtimeScene, 1);
        clearPauseBeforeSceneChange(runtimeScene, sceneState.get(runtimeScene));
        setSceneBoolean(runtimeScene, "LevelLost", false);
        setSceneBoolean(runtimeScene, "LevelWon", false);
        gameVariables.get("CurrentLevel").setNumber(level);
        setHudVisible(false);
        setPauseOverlayVisible(false);
        // Queue replacement until GDevelop finishes this event frame. The
        // pointer shield prevents click-through and the deferred request keeps
        // the new scene renderer attached to the canvas.
        queuePauseMenuNavigation(runtimeScene, level);
      };
      setup.open({
        avatar: {
          characterUrl: getSelectedCharacterUrl(runtimeScene),
          helmetUrl: getSelectedHelmetUrl(runtimeScene),
          characterIndex: characterCarouselIndex,
          helmetIndex: Math.round(runtimeScene.getGame().getVariables().getFromIndex(1).getAsNumber()),
        },
        availableLevels: Array.from(
          { length: PLAYABLE_LEVEL_MAX - PLAYABLE_LEVEL_MIN + 1 },
          (_, index) => PLAYABLE_LEVEL_MIN + index
        ),
        onBack: () => {
          globalThis.HeadSpaceMultiplayerService?.cancel?.(runtimeScene);
          setSceneBoolean(runtimeScene, "Paused", false);
          setRuntimeTimeScale(runtimeScene, 1);
          syncHomeMenuActionButtons(runtimeScene, true);
        },
        onCreateRoom: async () => {
          const service = globalThis.HeadSpaceMultiplayerService;
          if (!service?.createRoom) throw new Error("Multiplayer service adapter is unavailable.");
          return service.createRoom(runtimeScene, {
            name: gdjs.playerAuthentication?.getUsername?.() || "YOU",
            characterUrl: getSelectedCharacterUrl(runtimeScene),
            helmetUrl: getSelectedHelmetUrl(runtimeScene),
            characterIndex: characterCarouselIndex,
            helmetIndex: Math.round(runtimeScene.getGame().getVariables().getFromIndex(1).getAsNumber()),
          }, {
            onRoomUpdate: room => setup.updateRoom(room),
            onStart: launchMultiplayerMatch,
          });
        },
        onJoinRoom: async code => {
          const service = globalThis.HeadSpaceMultiplayerService;
          if (!service?.joinRoom) throw new Error("Multiplayer service adapter is unavailable.");
          return service.joinRoom(runtimeScene, code, {
            name: gdjs.playerAuthentication?.getUsername?.() || "YOU",
            characterUrl: getSelectedCharacterUrl(runtimeScene),
            helmetUrl: getSelectedHelmetUrl(runtimeScene),
            characterIndex: characterCarouselIndex,
            helmetIndex: Math.round(runtimeScene.getGame().getVariables().getFromIndex(1).getAsNumber()),
          }, {
            onRoomUpdate: room => setup.updateRoom(room),
            onStart: launchMultiplayerMatch,
          });
        },
        onSettingsChange: match => {
          globalThis.HeadSpaceMultiplayerService?.updateSettings?.(match.level, match.mode);
        },
        onStartRoom: () => globalThis.HeadSpaceMultiplayerService?.startRoom?.(),
      });
      const setupRoot = document.getElementById("headspace-multiplayer-setup");
      if (setupRoot && !setupRoot.__headSpaceInputGuardInstalled) {
        setupRoot.__headSpaceInputGuardInstalled = true;
        const suppressGameInput = () => {
          multiplayerInputSuppressedUntil = performance.now() + 350;
        };
        setupRoot.addEventListener("pointerdown", suppressGameInput, true);
        setupRoot.addEventListener("pointerup", suppressGameInput, true);
        setupRoot.addEventListener("click", suppressGameInput, true);
      }
      syncHomeMenuActionButtons(runtimeScene, !setup.isOpen?.());
    } catch (error) {
      console.error("Unable to open the multiplayer setup screen.", error);
      setSceneBoolean(runtimeScene, "Paused", false);
      setRuntimeTimeScale(runtimeScene, 1);
      syncHomeMenuActionButtons(runtimeScene, true);
    }
  }

  globalThis.__headSpaceOpenMultiplayerSetupForTest = () => {
    if (activeRuntimeScene) openMultiplayerSetup(activeRuntimeScene);
  };

  function syncHomeMenuActionButtons(runtimeScene, visible) {
    for (const id of ["headspace-home-multiplayer", "headspace-home-custom-player"]) {
      document.getElementById(id)?.remove();
    }
    syncNativeHomeMenuActionButtons(runtimeScene, visible);
    return;
    const specs = [
      { id: "headspace-home-multiplayer", label: "MULTIPLAYER", side: -1, color: "#ff3b4f" },
      { id: "headspace-home-custom-player", label: "CUSTOM PLAYER", side: 1, color: "#ffe34d" },
    ];
    const canvas = document.querySelector("canvas");
    const rect = canvas?.getBoundingClientRect?.();
    for (const spec of specs) {
      let button = document.getElementById(spec.id);
      if (!button) {
        button = document.createElement("button");
        button.id = spec.id;
        button.type = "button";
        button.textContent = spec.label;
        button.style.position = "fixed";
        button.style.zIndex = "999995";
        button.style.setProperty("height", "64px", "important");
        button.style.setProperty("min-height", "64px", "important");
        button.style.setProperty("padding", "0 18px", "important");
        button.style.setProperty("border-radius", "13px", "important");
        button.style.setProperty("background", "rgba(1, 6, 14, 0.96)", "important");
        button.style.color = "#ffffff";
        button.style.fontFamily = "Achron, sans-serif";
        button.style.setProperty("font-size", "20px", "important");
        button.style.fontWeight = "800";
        button.style.letterSpacing = "1px";
        button.style.cursor = "pointer";
        button.style.boxSizing = "border-box";
        button.style.setProperty("transform", "translate(-50%, -50%) scale(5)", "important");
        button.style.textShadow =
          "3px 0 #00ffc8, -3px 0 #ff2ab8, 0 4px 0 rgba(0,0,0,.8), 0 0 10px #fff";
        button.style.setProperty("border", `4px solid ${spec.color}`, "important");
        button.style.setProperty(
          "box-shadow",
          `0 0 0 4px rgba(89,214,255,.28), 0 0 18px ${spec.color}, inset 0 0 14px ${spec.color}55`,
          "important"
        );
        button.addEventListener("mouseenter", () => {
          button.style.filter = "brightness(1.3)";
          button.style.setProperty("transform", "translate(-50%, -50%) scale(5.25)", "important");
        });
        button.addEventListener("mouseleave", () => {
          button.style.filter = "none";
          button.style.setProperty("transform", "translate(-50%, -50%) scale(5)", "important");
        });
        button.addEventListener("pointerdown", () => {
          button.style.setProperty("transform", "translate(-50%, -50%) scale(4.85)", "important");
        });
        button.addEventListener("pointerup", () => {
          button.style.setProperty("transform", "translate(-50%, -50%) scale(5.25)", "important");
        });
        document.body.appendChild(button);
      }
      button.__headSpaceRuntimeScene = runtimeScene;
      if (!button.__headSpaceClickInstalled) {
        button.__headSpaceClickInstalled = true;
        button.addEventListener("click", () => {
          const scene = button.__headSpaceRuntimeScene;
          if (button.id === "headspace-home-multiplayer") {
            openMultiplayerSetup(scene);
            return;
          }
          for (const name of ["CHARACTER_Label", "HELMET_Label"]) {
            for (const label of scene?.getObjects?.(name) || []) {
              label.__headSpaceCustomPlayerPulseUntil = performance.now() + 450;
            }
          }
        });
      }
      button.style.display = visible && rect ? "block" : "none";
      if (!visible || !rect) continue;
      const buttonWidth = Math.max(220, Math.min(260, rect.width * 0.19));
      const buttonHeight = Math.max(58, Math.min(68, rect.height * 0.09));
      button.style.setProperty("width", `${buttonWidth}px`, "important");
      button.style.setProperty("min-width", `${buttonWidth}px`, "important");
      button.style.setProperty("height", `${buttonHeight}px`, "important");
      button.style.setProperty("min-height", `${buttonHeight}px`, "important");
      button.style.left = `${rect.left + rect.width * (0.5 + spec.side * HOME_MENU_ACTION_BUTTON_OFFSET_RATIO)}px`;
      button.style.top = `${rect.top + rect.height * (0.5 + HOME_MENU_PLAY_Y_RATIO)}px`;
    }
  }

  function getMainMenuPreviewCenterX(runtimeScene) {
    const previewHelmet = runtimeScene.getObjects("PreviewHelmet")[0];
    if (previewHelmet?.getCenterXInScene) return previewHelmet.getCenterXInScene();

    const previewCharacter = runtimeScene.getObjects("PreviewCharacter")[0];
    if (previewCharacter?.getCenterXInScene) return previewCharacter.getCenterXInScene();

    const charLeft = runtimeScene.getObjects("CharLeft")[0];
    const charRight = runtimeScene.getObjects("CharRight")[0];
    if (charLeft?.getCenterXInScene && charRight?.getCenterXInScene) {
      return (charLeft.getCenterXInScene() + charRight.getCenterXInScene()) / 2;
    }

    return null;
  }

  function normalizeButtonLabel(buttonObject, textObject, forceUppercase = true, sharedSize = null) {
    if (!buttonObject || !textObject) return;
    if (textObject.hide) textObject.hide(false);
    if (textObject.setWrapping) textObject.setWrapping(false);
    if (textObject.setPadding) textObject.setPadding(0);
    if (textObject.setScale) textObject.setScale(1);
    if (textObject.setTextAlignment) textObject.setTextAlignment("center");
    if (textObject.setVerticalTextAlignment) textObject.setVerticalTextAlignment("center");
    if (textObject.getString && textObject.setString) {
      const raw = textObject.getString();
      const trimmed = raw.replace(/\s+/g, " ").trim();
      const normalized = forceUppercase ? trimmed.toUpperCase() : trimmed;
      if (raw !== normalized) textObject.setString(normalized);
    }
    if (textObject.setBold) textObject.setBold(true);

    const fittedSize = computeFittedTextSize(textObject, buttonObject, BUTTON_TEXT_DEFAULT_SIZE);
    const finalSize =
      sharedSize === null
        ? fittedSize
        : Math.max(OVERLAY_BUTTON_TEXT_MIN_SIZE, Math.min(fittedSize, sharedSize));
    textObject.setCharacterSize(finalSize);
    fitTextScaleInsideButton(textObject, buttonObject);
    placeTextInsideButton(textObject, buttonObject);
  }

  function createLevelOverTextEffects() {
    return [
      {
        effectType: "Outline",
        name: "Effect",
        doubleParameters: { padding: 3, thickness: 3 },
        stringParameters: { color: "0;0;0" },
        booleanParameters: {},
      },
      {
        effectType: "Bevel",
        name: "Effect2",
        doubleParameters: {
          distance: 15,
          lightAlpha: 1,
          rotation: 1,
          shadowAlpha: 1,
          thickness: 2,
        },
        stringParameters: { lightColor: "0;9;163", shadowColor: "0;0;0" },
        booleanParameters: {},
      },
      {
        effectType: "Glitch",
        name: "Effect3",
        doubleParameters: {
          animationFrequency: 10,
          blueX: 1,
          blueY: -1,
          direction: 0,
          fillMode: 1,
          greenX: 2,
          greenY: -2,
          minSize: 8,
          offset: 2,
          redX: 1,
          redY: 1,
          sampleSize: 200,
          slices: 0,
        },
        stringParameters: {},
        booleanParameters: { average: true },
      },
    ];
  }

  function normalizeLevelOverTextStyle(textObject) {
    if (!textObject) return;
    if (textObject.setFontName) textObject.setFontName(LEVEL_OVER_BUTTON_FONT);
    if (textObject.setColor) textObject.setColor("255;255;255");
    if (textObject.setBold) textObject.setBold(true);
    if (textObject.setItalic) textObject.setItalic(false);
    if (textObject.setOutline) textObject.setOutline("255;255;255", 0);
    if (textObject.setOutlineEnabled) textObject.setOutlineEnabled(false);

    if (textObject.__headSpaceLevelOverTextStyleApplied) return;
    textObject.__headSpaceLevelOverTextStyleApplied = true;
    if (typeof textObject.clearEffects !== "function" || typeof textObject.addEffect !== "function") return;

    textObject.clearEffects();
    const effects = createLevelOverTextEffects();
    for (let i = 0; i < effects.length; i++) textObject.addEffect(effects[i]);
  }

  function normalizeSharedButtonText(runtimeScene) {
    const pairs = [
      { button: "LevelSelectScreen", text: "Button_Text", uppercase: true },
      { button: "Button", text: "Button_Text", uppercase: true },
      { button: "HomeButton", text: "HomeButtonText", uppercase: true },
      { button: "ButtonMulti", text: "Button_Multi_Text", uppercase: true },
    ];

    for (let p = 0; p < pairs.length; p++) {
      const pair = pairs[p];
      const buttons = runtimeScene.getObjects(pair.button);
      const labels = runtimeScene.getObjects(pair.text);
      if (!buttons.length || !labels.length) continue;
      const mainMenuCenterX = pair.button === "LevelSelectScreen" ? getMainMenuPreviewCenterX(runtimeScene) : null;

      for (let i = 0; i < buttons.length; i++) {
        resizeButtonPreservingCenter(
          buttons[i],
          OVERLAY_BUTTON_WIDTH,
          OVERLAY_BUTTON_HEIGHT,
          pair.button === "LevelSelectScreen" ? mainMenuCenterX : null
        );
        ensureButtonGlow(buttons[i]);
      }

      const assignments = [];
      const count = Math.min(buttons.length, labels.length);
      for (let i = 0; i < count; i++) {
        const label = labels[i];
        if (pair.uppercase && label.getString) {
          const upper = label.getString().toUpperCase();
          if (label.getString() !== upper) label.setString(upper);
        }
        assignments.push({ button: buttons[i], label, uppercase: pair.uppercase });
      }

      if (!assignments.length) continue;

      // Keep each button type internally consistent without letting long labels
      // (e.g. LEVEL SELECT) shrink unrelated short labels (e.g. PLAY).
      let sharedSize = OVERLAY_BUTTON_TEXT_MAX_SIZE;
      for (let i = 0; i < assignments.length; i++) {
        const entry = assignments[i];
        const fitted = computeFittedTextSize(entry.label, entry.button, BUTTON_TEXT_DEFAULT_SIZE);
        if (fitted < sharedSize) sharedSize = fitted;
      }
      if (sharedSize < OVERLAY_BUTTON_TEXT_MIN_SIZE) sharedSize = OVERLAY_BUTTON_TEXT_MIN_SIZE;

      for (let i = 0; i < assignments.length; i++) {
        const entry = assignments[i];
        normalizeButtonLabel(entry.button, entry.label, entry.uppercase, sharedSize);
      }
    }
  }

  function normalizeLevelOverButtons(runtimeScene, levelWon, levelLost) {
    const nextButtons = runtimeScene.getObjects("Button");
    const retryButtons = runtimeScene.getObjects("ButtonMulti");
    const homeButtons = runtimeScene.getObjects("HomeButton");
    const message1 = runtimeScene.getObjects("Message1");
    const multiplayer = isMultiplayerGame(runtimeScene, getCurrentLevel(runtimeScene));
    const multiplayerMode = multiplayer ? getMultiplayerGameMode(runtimeScene) : "";
    if (levelWon) {
      const winMessage = multiplayer
        ? multiplayerMode === "hunt-the-boss"
          ? "BOSS DEFEATED"
          : "HEAD TO HEAD WIN"
        : "LEVEL COMPLETE";
      for (let i = 0; i < message1.length; i++) {
        if (message1[i].getString && message1[i].getString() !== winMessage) {
          message1[i].setString(winMessage);
        }
      }
      const winPrimaryText = runtimeScene.getObjects("Button_Text");
      const primaryLabel = multiplayer ? "MULTIPLAYER" : "NEXT";
      for (let i = 0; i < winPrimaryText.length; i++) {
        if (winPrimaryText[i].hide) winPrimaryText[i].hide(false);
        if (winPrimaryText[i].getString && winPrimaryText[i].getString() !== primaryLabel) {
          winPrimaryText[i].setString(primaryLabel);
        }
      }
    }
    if (levelLost) {
      for (let i = 0; i < message1.length; i++) {
        if (message1[i].getString && message1[i].getString() !== "HEADNAUT DOWN!") {
          message1[i].setString("HEADNAUT DOWN!");
        }
      }
      const lossPrimaryText = runtimeScene.getObjects("Button_Text");
      const lossPrimaryLabel = multiplayer ? "MULTIPLAYER" : "RETRY";
      for (let i = 0; i < lossPrimaryText.length; i++) {
        if (lossPrimaryText[i].hide) lossPrimaryText[i].hide(false);
        if (
          lossPrimaryText[i].getString &&
          lossPrimaryText[i].getString() !== lossPrimaryLabel
        ) {
          lossPrimaryText[i].setString(lossPrimaryLabel);
        }
      }
    }
    if (!nextButtons.length && !retryButtons.length && !homeButtons.length) return;

    const uiCamX = gdjs.evtTools.camera.getCameraX(runtimeScene, "UI", 0);
    const uiCamY = gdjs.evtTools.camera.getCameraY(runtimeScene, "UI", 0);
    const uiCamH = gdjs.evtTools.camera.getCameraHeight(runtimeScene, "UI", 0);
    const minGap = OVERLAY_BUTTON_HEIGHT + 18;
    const showingRetry =
      (levelWon || (levelLost && multiplayer)) && retryButtons.length > 0;
    const uiBottom = uiCamY + uiCamH * 0.5;
    const bottomPadding = Math.max(LEVEL_OVER_BOTTOM_PADDING_MIN, uiCamH * LEVEL_OVER_BOTTOM_PADDING_RATIO);
    const maxHomeCenterY = uiBottom - OVERLAY_BUTTON_HEIGHT * 0.5 - bottomPadding;
    let nextCenterY = uiCamY + uiCamH * (showingRetry ? LEVEL_OVER_WIN_STACK_CENTER_Y_RATIO : 0.30);
    if (showingRetry && nextCenterY + minGap * 2 > maxHomeCenterY) {
      nextCenterY = maxHomeCenterY - minGap * 2;
    }
    const retryCenterY = nextCenterY + minGap;
    let homeCenterY = showingRetry ? retryCenterY + minGap : uiCamY + uiCamH * 0.43;
    if (!showingRetry && homeCenterY - nextCenterY < minGap) homeCenterY = nextCenterY + minGap;

    for (let i = 0; i < nextButtons.length; i++) {
      nextButtons[i].setSize(OVERLAY_BUTTON_WIDTH, OVERLAY_BUTTON_HEIGHT);
      nextButtons[i].setCenterPositionInScene(uiCamX, nextCenterY);
      ensureButtonGlow(nextButtons[i]);
    }
    for (let i = 0; i < retryButtons.length; i++) {
      retryButtons[i].setSize(OVERLAY_BUTTON_WIDTH, OVERLAY_BUTTON_HEIGHT);
      retryButtons[i].setCenterPositionInScene(uiCamX, retryCenterY);
      retryButtons[i].hide(!showingRetry);
      ensureButtonGlow(retryButtons[i]);
    }
    for (let i = 0; i < homeButtons.length; i++) {
      homeButtons[i].setSize(OVERLAY_BUTTON_WIDTH, OVERLAY_BUTTON_HEIGHT);
      homeButtons[i].setCenterPositionInScene(uiCamX, homeCenterY);
      ensureButtonGlow(homeButtons[i]);
    }

    const nextText = runtimeScene.getObjects("Button_Text");
    const retryText = runtimeScene.getObjects("Button_Multi_Text");
    const homeText = runtimeScene.getObjects("HomeButtonText");
    const nextButton = nextButtons[0] || null;
    const retryButton = showingRetry ? retryButtons[0] || null : null;
    const homeButton = homeButtons[0] || null;

    const assignments = [];
    for (let i = 0; i < nextText.length; i++) {
      if (!nextButton) break;
      assignments.push({ button: nextButton, label: nextText[i], uppercase: true });
    }
    for (let i = 0; i < retryText.length; i++) {
      retryText[i].hide(!showingRetry);
      if (!retryButton) continue;
      const retryLabel = multiplayer ? "PLAY AGAIN" : "RETRY";
      if (retryText[i].getString() !== retryLabel) retryText[i].setString(retryLabel);
      assignments.push({ button: retryButton, label: retryText[i], uppercase: true });
    }
    for (let i = 0; i < homeText.length; i++) {
      if (!homeButton) break;
      if (homeText[i].getString() !== "HOME") homeText[i].setString("HOME");
      assignments.push({ button: homeButton, label: homeText[i], uppercase: true });
    }

    let sharedSize = OVERLAY_BUTTON_TEXT_MAX_SIZE;
    for (let i = 0; i < assignments.length; i++) {
      const entry = assignments[i];
      const fitted = computeFittedTextSize(entry.label, entry.button, BUTTON_TEXT_DEFAULT_SIZE);
      if (fitted < sharedSize) sharedSize = fitted;
    }
    if (sharedSize < OVERLAY_BUTTON_TEXT_MIN_SIZE) sharedSize = OVERLAY_BUTTON_TEXT_MIN_SIZE;

    for (let i = 0; i < assignments.length; i++) {
      const entry = assignments[i];
      normalizeLevelOverTextStyle(entry.label);
      normalizeButtonLabel(entry.button, entry.label, entry.uppercase, sharedSize);
    }
  }

  function navigateToLevel(runtimeScene, targetLevel) {
    if (Number(targetLevel) === 0) closeCustomPlayerCreator();
    clearPauseBeforeSceneChange(runtimeScene, sceneState.get(runtimeScene));
    try {
      setSceneBoolean(runtimeScene, "LevelLost", false);
      setSceneBoolean(runtimeScene, "LevelWon", false);
      setSceneBoolean(runtimeScene, "ChangingScenes", true);
      runtimeScene.getGame().getVariables().get("CurrentLevel").setNumber(targetLevel);
      gdjs.evtTools.runtimeScene.replaceScene(
        runtimeScene,
        gdjs.evtTools.runtimeScene.getSceneName(runtimeScene),
        false
      );
      return true;
    } catch {
      return false;
    }
  }

  function queuePauseMenuNavigation(runtimeScene, targetLevel) {
    if (!runtimeScene) return false;
    pendingPauseMenuNavigation = { runtimeScene, targetLevel };
    // Navigation must not depend on a paused GDevelop frame being processed.
    // Resume the runtime clock and also schedule an out-of-band flush so the
    // Multiplayer button always leaves the paused match immediately.
    setSceneBoolean(runtimeScene, "Paused", false);
    setRuntimeTimeScale(runtimeScene, 1);
    setPauseOverlayVisible(false);
    requestAnimationFrame(() => {
      if (
        pendingPauseMenuNavigation?.runtimeScene === runtimeScene &&
        activeRuntimeScene === runtimeScene
      ) {
        flushQueuedPauseMenuNavigation(runtimeScene);
      }
    });
    return true;
  }

  function flushQueuedPauseMenuNavigation(runtimeScene) {
    if (!pendingPauseMenuNavigation) return false;
    if (pendingPauseMenuNavigation.runtimeScene !== runtimeScene) return false;

    const { targetLevel } = pendingPauseMenuNavigation;
    pendingPauseMenuNavigation = null;
    return navigateToLevel(runtimeScene, targetLevel);
  }

  function handlePauseMenuAction(action) {
    const runtimeScene = activeRuntimeScene;
    if (!runtimeScene) return;

    if (action === "resume") {
      const state = ensureSceneState(runtimeScene, getCurrentLevel(runtimeScene));
      setSceneBoolean(runtimeScene, "Paused", false);
      syncPauseState(runtimeScene, state, true);
      return;
    }

    if (action === "home") {
      queuePauseMenuNavigation(runtimeScene, 0);
      return;
    }

    if (action === "level-select") {
      queuePauseMenuNavigation(runtimeScene, 0.5);
      return;
    }

    if (action === "multiplayer") {
      multiplayerSelectionSnapshotAfterNavigation = capturePlayerSelectionSnapshot(runtimeScene);
      openMultiplayerSetupAfterNavigation = true;
      // CurrentLevel changes before replaceScene finishes. Keep the outgoing
      // paused scene from consuming the request meant for the fresh menu scene.
      multiplayerSetupNavigationSourceScene = runtimeScene;
      // The GDevelop project hosts menus and gameplay in the same Game scene.
      // Level 0 is therefore the multiplayer lobby host; loading it and opening
      // HeadSpaceMultiplayerSetup is the direct Multiplayer-scene route.
      queuePauseMenuNavigation(runtimeScene, 0);
      return;
    }

    if (action === "retry") {
      queuePauseMenuNavigation(runtimeScene, getCurrentLevel(runtimeScene));
    }
  }

  function handleLevelOverHomeButton(runtimeScene, levelWon, levelLost) {
    if (!levelWon && !levelLost) return false;
    if (!gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left")) return false;

    const homeButtons = runtimeScene.getObjects("HomeButton").filter((button) => button.isVisible());
    if (!homeButtons.length) return false;

    const isHovering = homeButtons.some((button) => button.cursorOnObject(runtimeScene));
    if (!isHovering) return false;

    return navigateToLevel(runtimeScene, 0);
  }

  function handleLevelOverRetryButton(runtimeScene, levelWon, levelLost = false) {
    if (
      !levelWon &&
      !(levelLost && isMultiplayerGame(runtimeScene, getCurrentLevel(runtimeScene)))
    ) return false;
    if (!gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left")) return false;

    const retryButtons = runtimeScene.getObjects("ButtonMulti").filter((button) => button.isVisible());
    const retryText = runtimeScene.getObjects("Button_Multi_Text").filter((label) => label.isVisible());
    if (!retryButtons.length && !retryText.length) return false;

    const hoveringButton = retryButtons.some((button) => button.cursorOnObject(runtimeScene));
    const hoveringLabel = retryText.some(
      (label) => typeof label.cursorOnObject === "function" && label.cursorOnObject(runtimeScene)
    );
    if (!hoveringButton && !hoveringLabel) return false;

    return navigateToLevel(runtimeScene, getCurrentLevel(runtimeScene));
  }

  function handleLevelOverPrimaryButton(runtimeScene, levelWon, levelLost) {
    if (!levelWon && !levelLost) return false;
    if (!gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left")) return false;

    const primaryButtons = runtimeScene.getObjects("Button").filter((button) => button.isVisible());
    const primaryText = runtimeScene.getObjects("Button_Text").filter((label) => label.isVisible());
    if (!primaryButtons.length && !primaryText.length) return false;

    const hoveringButton = primaryButtons.some((button) => button.cursorOnObject(runtimeScene));
    const hoveringLabel = primaryText.some(
      (label) => typeof label.cursorOnObject === "function" && label.cursorOnObject(runtimeScene)
    );
    if (!hoveringButton && !hoveringLabel) return false;

    if (
      (levelWon || levelLost) &&
      isMultiplayerGame(runtimeScene, getCurrentLevel(runtimeScene))
    ) {
      multiplayerSelectionSnapshotAfterNavigation = capturePlayerSelectionSnapshot(runtimeScene);
      openMultiplayerSetupAfterNavigation = true;
      return navigateToLevel(runtimeScene, 0);
    }
    if (levelLost) return navigateToLevel(runtimeScene, getCurrentLevel(runtimeScene));

    const level = getCurrentLevel(runtimeScene);
    const nextLevel = level >= PLAYABLE_LEVEL_MAX ? LEVEL_SELECT_MAP_LEVEL : level + 1;
    return navigateToLevel(runtimeScene, nextLevel);
  }

  function rescueNativeLevelCompleteNavigation(runtimeScene, state, level, levelWon, levelLost) {
    if (levelWon || levelLost) return false;
    if (!state || !state.winCommitted) return false;
    if (!getSceneBoolean(runtimeScene, "ChangingScenes")) return false;
    if (!gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left")) return false;

    const primaryButtons = runtimeScene.getObjects("Button").filter((button) => button.isVisible());
    const primaryText = runtimeScene.getObjects("Button_Text").filter((label) => label.isVisible());
    const hoveringButton = primaryButtons.some((button) => button.cursorOnObject(runtimeScene));
    const hoveringLabel = primaryText.some(
      (label) => typeof label.cursorOnObject === "function" && label.cursorOnObject(runtimeScene)
    );
    if (!hoveringButton && !hoveringLabel) return false;

    const nextLevel = level >= PLAYABLE_LEVEL_MAX ? LEVEL_SELECT_MAP_LEVEL : level + 1;
    return navigateToLevel(runtimeScene, nextLevel);
  }

  function handleLevelSelectHomeButton(runtimeScene, level) {
    if (!isLevelSelectMap(level)) return false;
    if (getSceneBoolean(runtimeScene, "ChangingScenes")) return false;
    if (!gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left")) return false;

    const homeButtons = runtimeScene.getObjects("HomeButton").filter((button) => button.isVisible());
    const homeText = runtimeScene.getObjects("HomeButtonText").filter((label) => label.isVisible());
    if (!homeButtons.length && !homeText.length) return false;

    const hoveringButton = homeButtons.some((button) => button.cursorOnObject(runtimeScene));
    const hoveringLabel = homeText.some(
      (label) => typeof label.cursorOnObject === "function" && label.cursorOnObject(runtimeScene)
    );
    if (!hoveringButton && !hoveringLabel) return false;

    return navigateToLevel(runtimeScene, 0);
  }

  function cleanupOrbObjects(runtimeScene, elapsedSeconds) {
    let emitted = runtimeScene.getObjects("EmittedMaterial");
    for (let i = 0; i < emitted.length; i++) {
      const orb = emitted[i];
      const spawnVar = orb.getVariables().get("SpawnTime");
      if (spawnVar.getAsNumber() <= 0) spawnVar.setNumber(elapsedSeconds);

      const age = elapsedSeconds - spawnVar.getAsNumber();
      if (age > EMITTED_MAX_AGE_SECONDS || orb.getWidth() < MIN_EMITTED_WIDTH) {
        orb.deleteFromScene(runtimeScene);
      }
    }

    emitted = runtimeScene.getObjects("EmittedMaterial");
    if (emitted.length > MAX_EMITTED_MATERIAL) {
      const sorted = emitted
        .slice()
        .sort(
          (a, b) =>
            a.getVariables().get("SpawnTime").getAsNumber() - b.getVariables().get("SpawnTime").getAsNumber()
        );
      const toRemove = sorted.length - MAX_EMITTED_MATERIAL;
      for (let i = 0; i < toRemove; i++) sorted[i].deleteFromScene(runtimeScene);
    }

    let trails = runtimeScene.getObjects("InternalFloatiesORB");
    if (trails.length > MAX_ORB_PARTICLES) {
      const removeCount = trails.length - MAX_ORB_PARTICLES;
      for (let i = 0; i < removeCount; i++) trails[i].deleteFromScene(runtimeScene);
    }

    trails = runtimeScene.getObjects("InternalFloatiesORB");
    emitted = runtimeScene.getObjects("EmittedMaterial");
    const hardMaxByParentCount = Math.max(60, emitted.length + 40);
    if (trails.length > hardMaxByParentCount) {
      const removeCount = trails.length - hardMaxByParentCount;
      for (let i = 0; i < removeCount; i++) trails[i].deleteFromScene(runtimeScene);
    }
  }

  function stripGameplayEntitiesForMenuScreens(runtimeScene) {
    for (const objectName of LEVEL_SELECT_STRIP_OBJECTS) {
      const objects = runtimeScene.getObjects(objectName);
      for (let i = 0; i < objects.length; i++) {
        objects[i].deleteFromScene(runtimeScene);
      }
    }
  }

  function stripHomeMenuObjectsFromMultiplayerGameplay(runtimeScene, level) {
    if (!isPlayableLevel(level) || !isMultiplayerGame(runtimeScene, level)) return;
    for (const objectName of HOME_MENU_ONLY_OBJECT_NAMES) {
      for (const object of runtimeScene.getObjects(objectName).slice()) {
        object.hide?.(true);
        const rendererObject = object.getRendererObject?.();
        if (rendererObject) rendererObject.visible = false;
        object.deleteFromScene(runtimeScene);
      }
    }
    syncHomeMenuActionButtons(runtimeScene, false);
  }

  function onSceneLoaded(runtimeScene) {
    activeRuntimeScene = runtimeScene;
    installScreenWakeLockHandlers();
    ensureBrandBadge();
    ensureHud();
    ensurePauseOverlay();
    syncBackgroundMusic(runtimeScene);
    if (runtimeScene.getName() === "Game") {
      syncBestTimesIntoGameVariables(runtimeScene);
      const level = getCurrentLevel(runtimeScene);
      if (Number(level) !== 0) globalThis.HeadSpaceMultiplayerSetup?.close?.();
      if (Number(level) === 0 || isLevelSelectMap(level)) {
        const gameVariables = runtimeScene.getGame().getVariables();
        gameVariables.get("MultiplayerMode").setBoolean(false);
        gameVariables.get("MultiplayerLevel").setNumber(0);
        gameVariables.get("MultiplayerGameMode").setString("");
        gameVariables.get("MultiplayerRoomCode").setString("");
        gameVariables.get("MultiplayerPlayerCount").setNumber(0);
      }
      if (isPlayableLevel(level)) {
        setSceneNumber(runtimeScene, "PlayerSpeedDelta", PLAYER_PROPULSION_SPEED_DELTA);
      }
      stabilizeBossLevelStartup(runtimeScene, level);
      syncScreenWakeLock(runtimeScene);
    }
  }

  function onScenePreEvents(runtimeScene) {
    activeRuntimeScene = runtimeScene;

    if (runtimeScene.getName() !== "Game") return;
    if (
      isMultiplayerDomInputOwned()
    ) {
      // The multiplayer UI is a DOM overlay, while GDevelop listens for mouse
      // releases on the window. Consume that frame's release/touch state before
      // authored Game events can activate the PLAY button underneath the UI.
      const inputManager = runtimeScene.getGame().getInputManager?.();
      inputManager?.onFrameEnded?.();
      if (inputManager?._pressedMouseButtons) inputManager._pressedMouseButtons.length = 0;
      if (inputManager?._releasedMouseButtons) inputManager._releasedMouseButtons.length = 0;
    }
    if (flushQueuedPauseMenuNavigation(runtimeScene)) return;

    const level = getCurrentLevel(runtimeScene);
    if (Number(level) === 0) captureCharacterCarouselSelection(runtimeScene);
    if (isLevelSelectMap(level)) {
      captureLevelSelectZoomSnapshot(runtimeScene, level);
      return;
    }
    if (!isPlayableLevel(level)) return;
    setSceneNumber(runtimeScene, "PlayerSpeedDelta", PLAYER_PROPULSION_SPEED_DELTA);
    enforceLevelFiveBoostVelocity(runtimeScene);

    const state = ensureSceneState(runtimeScene, level);
    // Multiplayer levels never use the authored single-player completion
    // timer. Clear a native outcome before the shared-level framework runs;
    // otherwise its celestial delta is zeroed for that frame and all orbiting
    // visuals freeze after the five-second native win condition fires.
    if (isMultiplayerGame(runtimeScene, level) && !state.multiplayerOutcomeAuthorized) {
      suppressMultiplayerLevelTwoNativeCompletion(runtimeScene);
    }
    applySharedLateLevelOutcomeConditions(runtimeScene, level, state);
    ensureBossEnemy(runtimeScene, level, state);
    ensureLevelFourExtraEnemies(runtimeScene, level, state);
    ensureLevelFourBaitEnemiesRelocated(runtimeScene, level, state);
    alignLevelEightPlanetCollisionMasks(runtimeScene);
    suppressErroneousBossWin(runtimeScene, level, state);
    const levelWon = getSceneBoolean(runtimeScene, "LevelWon");
    const levelLost = getSceneBoolean(runtimeScene, "LevelLost");
    if (levelWon || levelLost) return;

    const toggledPaused = handlePauseHotkey(runtimeScene, true);
    if (toggledPaused !== false || getSceneBoolean(runtimeScene, "Paused")) {
      setRuntimeTimeScale(runtimeScene, getSceneBoolean(runtimeScene, "Paused") ? 0 : 1);
    }
  }

  function onScenePostEvents(runtimeScene) {
    activeRuntimeScene = runtimeScene;
    syncScreenWakeLock(runtimeScene);
    ensureBrandBadge();
    updateBrandBadgePosition();
    ensurePauseOverlay();
    normalizeSharedButtonText(runtimeScene);
    syncInteractiveButtonGlow(runtimeScene);
    syncBackgroundMusic(runtimeScene);
    navigateCharacterCarousel(runtimeScene);
    persistHomePlayerSelection(runtimeScene);
    applyCustomPlayerTexture(runtimeScene);

    if (runtimeScene.getName() !== "Game") {
      ensureMultiplayerOutcomeOverlay().style.display = "none";
      clearLevelSevenPlanetSystem(runtimeScene);
      clearLevelEightSpaceStationSystem(runtimeScene);
      clearLevelNineBlackHoleSystem(runtimeScene);
      clearLevelTenSolarSystem(runtimeScene);
      clearLevelElevenCelestialSystem(runtimeScene);
      clearLevelFiveCosmicAlienSystem(runtimeScene);
      clearLevelEightCosmicAlienSystem(runtimeScene);
      clearLevelNineCosmicAlienSystem(runtimeScene);
      clearLevelFiveBoostSystem(runtimeScene);
      clearLevelSelectCelestialSystem(runtimeScene);
      clearHomeHighResBackground(runtimeScene);
      clearLevelHighResBackground(runtimeScene);
      clearPlayerCollisionRipples(runtimeScene);
      setHudVisible(false);
      setPauseOverlayVisible(false);
      return;
    }

    const level = getCurrentLevel(runtimeScene);
    stripHomeMenuObjectsFromMultiplayerGameplay(runtimeScene, level);
    enforceMultiplayerParticipantInstanceLimit(runtimeScene, level);
    ensureMultiplayerParticipantOwnership(runtimeScene, level);
    updateLevelHighResBackground(runtimeScene, level);
    ensureMultiplayerLevelThreeUsesLevelTenLayout(runtimeScene, level);
    ensureMultiplayerLevelOneMaze(runtimeScene, level);
    ensureMultiplayerLevelOneFeatures(runtimeScene, level);
    ensureMultiplayerLevelTwoPong(runtimeScene, level);
    ensureMultiplayerLevelFourHoneycomb(runtimeScene, level);
    ensureMultiplayerModeObjective(runtimeScene, level);
    updateMultiplayerBlueWallFeedback(runtimeScene, level);
    if (isLevelSelectMap(level)) updateLevelSelectCelestialSystem(runtimeScene);
    else clearLevelSelectCelestialSystem(runtimeScene);
    if (Number(level) !== 0) clearHomeHighResBackground(runtimeScene);
    if (Number(level) !== 0) homeMenuLayoutState.delete(runtimeScene);
    normalizeParallaxStarLayers(runtimeScene, level);
    if (!isPlayableLevel(level)) {
      ensureMultiplayerOutcomeOverlay().style.display = "none";
      clearLevelSevenPlanetSystem(runtimeScene);
      clearLevelEightSpaceStationSystem(runtimeScene);
      clearLevelNineBlackHoleSystem(runtimeScene);
      clearLevelTenSolarSystem(runtimeScene);
      clearLevelElevenCelestialSystem(runtimeScene);
      clearLevelFiveCosmicAlienSystem(runtimeScene);
      clearLevelEightCosmicAlienSystem(runtimeScene);
      clearLevelFiveBoostSystem(runtimeScene);
      clearPlayerCollisionRipples(runtimeScene);
      setHudVisible(false);
      setPauseOverlayVisible(false);
      setSceneBoolean(runtimeScene, "Paused", false);
      setRuntimeTimeScale(runtimeScene, 1);
      setSceneNumber(runtimeScene, "LevelTime", 0);
      applyLevelSelectMouseAnchoredZoom(runtimeScene, level);
      normalizeHomeMenuLayout(runtimeScene, level);
      syncInteractiveButtonGlow(runtimeScene);
      if (handleLevelSelectHomeButton(runtimeScene, level)) return;
      stripGameplayEntitiesForMenuScreens(runtimeScene);
      if (
        Number(level) === 0 &&
        openMultiplayerSetupAfterNavigation &&
        runtimeScene !== multiplayerSetupNavigationSourceScene
      ) {
        openMultiplayerSetupAfterNavigation = false;
        multiplayerSetupNavigationSourceScene = null;
        const selectionSnapshot = multiplayerSelectionSnapshotAfterNavigation;
        multiplayerSelectionSnapshotAfterNavigation = null;
        restorePlayerSelectionSnapshot(runtimeScene, selectionSnapshot);
        // GDevelop applies a newly selected animation texture during its next
        // renderer update. Wait for that update before the multiplayer dialog
        // reads the avatar URLs, then reassert the same selection once more.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (activeRuntimeScene !== runtimeScene || Number(getCurrentLevel(runtimeScene)) !== 0) return;
            restorePlayerSelectionSnapshot(runtimeScene, selectionSnapshot);
            openMultiplayerSetup(runtimeScene);
          });
        });
      }
      return;
    }

    setHudVisible(true);
    const levelLabel = String(level);

    const state = ensureSceneState(runtimeScene, level);
    applySharedLateLevelOutcomeConditions(runtimeScene, level, state);
    suppressLegacyTutorialMessages(runtimeScene, level, state);
    if (isTouchLandscapeViewport()) removeMobileIntroMessages(runtimeScene);
    ensureBossEnemy(runtimeScene, level, state);
    ensureLevelFourExtraEnemies(runtimeScene, level, state);
    ensureLevelFourBaitEnemiesRelocated(runtimeScene, level, state);
    syncNativeBossBehavior(runtimeScene, level, state);
    suppressErroneousBossWin(runtimeScene, level, state);
    applyMultiplayerModeWinCondition(runtimeScene, level, state);
    if (
      isMultiplayerGame(runtimeScene, level) &&
      !state.multiplayerOutcomeAuthorized
    ) {
      suppressMultiplayerLevelTwoNativeCompletion(runtimeScene);
    }
    let levelWon = getSceneBoolean(runtimeScene, "LevelWon");
    let levelLost = getSceneBoolean(runtimeScene, "LevelLost");
    if (!levelWon && !levelLost) ensureMultiplayerOutcomeOverlay().style.display = "none";
    setHudPauseButtonVisible(!levelWon && !levelLost);
    cleanupLingeringBossLevelOverUi(runtimeScene, level, levelWon, levelLost);
    if (rescueNativeLevelCompleteNavigation(runtimeScene, state, level, levelWon, levelLost)) return;
    if (!levelWon && !levelLost && state.completionVisualMode) {
      clearCompletionVisuals(runtimeScene, state);
      state.completionFrozen = false;
    }
    const paused = syncPauseState(runtimeScene, state, !levelWon && !levelLost);
    if (!paused && state.justResumedFromPause) {
      enforcePauseSnapshot(runtimeScene, state);
      ensureMultiplayerParticipantOwnership(runtimeScene, level);
      if (state.introDismissed) hideIntroMessages(runtimeScene);
      ensureBossEnemy(runtimeScene, level, state);
      suppressErroneousBossWin(runtimeScene, level, state);
      levelWon = getSceneBoolean(runtimeScene, "LevelWon");
      levelLost = getSceneBoolean(runtimeScene, "LevelLost");
      cleanupLingeringBossLevelOverUi(runtimeScene, level, levelWon, levelLost);
      state.justResumedFromPause = false;
    }

    ensureRunTimerStarted(runtimeScene, state);
    const sharedDeclarativeMultiplayer =
      isSharedDeclarativeMultiplayerLevel(runtimeScene, level);
    if (sharedDeclarativeMultiplayer) {
      clearLevelSevenPlanetSystem(runtimeScene);
      clearLevelEightSpaceStationSystem(runtimeScene);
      clearLevelNineBlackHoleSystem(runtimeScene);
      clearLevelTenSolarSystem(runtimeScene);
      clearLevelElevenCelestialSystem(runtimeScene);
    } else {
      updateLevelSixPlanet(runtimeScene);
      updateLevelSevenPlanetSystem(runtimeScene);
      alignLevelEightPlanetCollisionMasks(runtimeScene);
      updateLevelEightSpaceStation(runtimeScene);
      updateLevelTenSolarSystem(runtimeScene);
      updateLevelNineBlackHoleSystem(runtimeScene);
      updateLevelElevenCelestialSystem(runtimeScene);
      ensureLevelSixStartLayout(runtimeScene, level, state);
    }
    updatePlayerCollisionRippleEffect(runtimeScene);

    const elapsedSeconds =
      state.frozenTimeSeconds !== null
        ? state.frozenTimeSeconds
        : getElapsedSecondsForState(state);
    if (sharedDeclarativeMultiplayer) {
      clearLevelFiveCosmicAlienSystem(runtimeScene);
      clearLevelEightCosmicAlienSystem(runtimeScene);
      clearLevelNineCosmicAlienSystem(runtimeScene);
      clearLevelFiveBoostSystem(runtimeScene);
    } else {
      updateLevelFiveCosmicAlienSystem(
        runtimeScene,
        elapsedSeconds,
        !paused && !levelWon && !levelLost
      );
      updateLevelEightCosmicAlienSystem(
        runtimeScene,
        elapsedSeconds,
        !paused && !levelWon && !levelLost
      );
      updateLevelNineCosmicAlienSystem(
        runtimeScene,
        elapsedSeconds,
        !paused && !levelWon && !levelLost
      );
      ensureLevelFiveBoostSystem(runtimeScene);
    }

    if ((levelWon || levelLost) && state.frozenTimeSeconds === null) {
      state.frozenTimeSeconds = elapsedSeconds;
    }

    setSceneNumber(runtimeScene, "LevelTime", state.frozenTimeSeconds ?? elapsedSeconds);

    if (levelWon && !state.winCommitted) {
      const key = String(level);
      const currentBest = Number(bestTimes[key]) || getBestTimeFromGameVar(runtimeScene, level) || 0;
      const candidate = state.frozenTimeSeconds ?? elapsedSeconds;
      if (candidate > 0.0005 && (currentBest <= 0 || candidate < currentBest)) {
        bestTimes[key] = candidate;
        setBestTimeToGameVar(runtimeScene, level, candidate);
        saveBestTimes();
      }
      state.winCommitted = true;
    }

    const bestForLevel =
      Number(bestTimes[String(level)]) || getBestTimeFromGameVar(runtimeScene, level) || 0;
    updateHud(runtimeScene, levelLabel, state.frozenTimeSeconds ?? elapsedSeconds, bestForLevel);
    updateHudPosition(runtimeScene);

    if (paused) {
      restoreLevelFiveBoostWarpVisuals(levelFiveBoostSystemState.get(runtimeScene));
      syncAbsorbVisuals(runtimeScene, state, elapsedSeconds, false);
      cleanupOrphanedGameplayCompanions(runtimeScene);
      applyBlackHolePortalPlayerVisual(runtimeScene);
      stabilizeBossRotation(runtimeScene, level);
      return;
    }

    const gameplayStarted = hasGameplayStarted(runtimeScene);
    applyPlayerOrbRecoilBonus(runtimeScene, state);
    syncPlayerPrelaunchNegativeVisual(runtimeScene, state, !levelWon && !levelLost);
    if (!state.introDismissed && !levelWon && !levelLost) {
      applyIntroMessages(runtimeScene, level);
      positionIntroMessages(runtimeScene);
    }
    if (!levelWon && !levelLost) {
      const wasSmartEnemyActivated = state.smartEnemyActivated;
      if (!state.smartEnemyActivated) {
        const bossActivationDelaySeconds = getBossActivationDelaySeconds(level);
        const hasOrbInScene = runtimeScene.getObjects("EmittedMaterial").length > 0;
        const shouldStartBossHeadStart = hasOrbInScene || gameplayStarted;
        if (isBossLevel(level) && bossActivationDelaySeconds > 0) {
          if (!Number.isFinite(state.bossHeadStartStartedAtSeconds) && shouldStartBossHeadStart) {
            state.bossHeadStartStartedAtSeconds = elapsedSeconds;
          }
          if (
            Number.isFinite(state.bossHeadStartStartedAtSeconds) &&
            elapsedSeconds - state.bossHeadStartStartedAtSeconds >= bossActivationDelaySeconds
          ) {
            state.smartEnemyActivated = true;
          }
        } else if (hasOrbInScene) {
          state.smartEnemyActivated = true;
        }
      }
      if (!wasSmartEnemyActivated && state.smartEnemyActivated && isBossLevel(level)) {
        state.bossAggroStartedAtSeconds = elapsedSeconds;
      }

      if (!state.introDismissed && gameplayStarted) {
        hideIntroMessages(runtimeScene);
        state.introDismissed = true;
        if (level === 6) {
          state.levelSixPlayerProtectionUntilSeconds =
            elapsedSeconds + LEVEL_SIX_PLAYER_CONTROL_GRACE_SECONDS;
        }
      }

      ensureEnemySizeVariety(runtimeScene, state);
      if (!sharedDeclarativeMultiplayer) {
        maintainLevelTenExtraSmallEnemySizes(runtimeScene);
        ensureLevelFourBossNeighborBalance(runtimeScene, level, state);
        ensureLevelFiveLargestEnemiesReduced(runtimeScene, level, state);
        ensureLevelSixExtraEnemies(runtimeScene, level, state);
      }
      updateRegularEnemyRespawns(runtimeScene, level, state, elapsedSeconds);
      if (!sharedDeclarativeMultiplayer) {
        ensurePlanetSpawnClearance(runtimeScene, level, state);
        applyPlanetOrbitForces(runtimeScene);
      }
      applyEnemyPhysicsTuning(runtimeScene, level);
      const bossHeadStartAvoidanceApplied = applyBossHeadStartAvoidance(
        runtimeScene,
        state,
        level,
        elapsedSeconds,
        gameplayStarted
      );
      if (!bossHeadStartAvoidanceApplied) {
        applySmartEnemySteering(runtimeScene, state, level);
      }
      enforceBossLargeEnemySafety(runtimeScene, state, level);
      enforceBossAggressivePursuit(runtimeScene, state, level, elapsedSeconds);
      syncAbsorbVisuals(runtimeScene, state, elapsedSeconds);
      cleanupOrphanedGameplayCompanions(runtimeScene);
      applyBlackHolePortalPlayerVisual(runtimeScene);
      stabilizeBossRotation(runtimeScene, level);
      cleanupOrbObjects(runtimeScene, state.frozenTimeSeconds ?? elapsedSeconds);
      if (
        !state.smartEnemyActivated &&
        !bossHeadStartAvoidanceApplied &&
        (!isBossLevel(level) || areCustomBossSettingsActive())
      ) {
        freezeSmartEnemies(runtimeScene);
      }
      if (!sharedDeclarativeMultiplayer) {
        applyLevelFiveBoostEffects(runtimeScene, elapsedSeconds);
      }
    } else {
      restoreLevelFiveBoostWarpVisuals(levelFiveBoostSystemState.get(runtimeScene));
      setPauseOverlayVisible(false);
      if (syncMultiplayerOutcomeOverlay(runtimeScene, levelWon, levelLost)) {
        applyLevelCompletionFreeze(runtimeScene, state, levelWon ? "win" : "loss");
        syncAbsorbVisuals(runtimeScene, state, elapsedSeconds, false);
        return;
      }
      ensureLevelOverUiInstances(runtimeScene, levelWon);
      applyLevelCompletionFreeze(runtimeScene, state, levelWon ? "win" : "loss");
      normalizeLevelOverButtons(runtimeScene, levelWon, levelLost);
      forceLevelOverUiReadable(runtimeScene, levelWon);
      raiseLevelTenCompletionUiAboveSun(runtimeScene);
      syncInteractiveButtonGlow(runtimeScene);
      syncAbsorbVisuals(runtimeScene, state, elapsedSeconds, false);
      stabilizeBossRotation(runtimeScene, level);
      if (handleLevelOverPrimaryButton(runtimeScene, levelWon, levelLost)) return;
      if (handleLevelOverRetryButton(runtimeScene, levelWon, levelLost)) return;
      if (handleLevelOverHomeButton(runtimeScene, levelWon, levelLost)) return;
      return;
    }

    applyEnemyWriggle(runtimeScene);
  }

  function installSharedMultiplayerLevelFactories() {
    const framework = globalThis.headSpaceMultiplayerFramework;
    if (!framework || globalThis.__headSpaceSharedMultiplayerFactoriesInstalled) return false;
    globalThis.__headSpaceSharedMultiplayerFactoriesInstalled = true;

    const layerZOrder = Object.freeze({
      underlay: 1,
      obstacles: 2,
      walls: 3,
      enemyActors: 3.5,
      actors: 4,
      effects: 5,
    });

    function getSystem(context) {
      if (context.shared.system) return context.shared.system;
      const bounds = context.manifest.arena?.bounds || {
        minX: 0,
        minY: 0,
        maxX: runtimeSceneViewportWidth(context.runtimeScene),
        maxY: runtimeSceneViewportHeight(context.runtimeScene),
      };
      const centerX = (Number(bounds.minX) + Number(bounds.maxX)) * 0.5;
      const centerY = (Number(bounds.minY) + Number(bounds.maxY)) * 0.5;
      const system = {
        frameworkOwned: true,
        manifestId: context.manifest.id,
        layerName: "",
        layerRenderer: null,
        centerX,
        centerY,
        elapsedSeconds: 0,
        walls: [],
        destructibleWalls: [],
        planets: [],
        blackHoles: [],
        stations: [],
        triexos: [],
        boosts: [],
        warpRecords: [],
        visualRecords: [],
        lightningGraphic: null,
        lights: [],
        projectiles: [],
        visualSprites: [],
        orangeEnemies: [],
        enemyVisualByHost: new Map(),
        shotIndex: 0,
        portalCooldownSeconds: 0,
        transit: null,
        stationFireIntervalSeconds: 7.2,
        visibleWallBoundaryOnly: true,
        triexoArenaRadius: Math.max(
          120,
          Math.min(Number(bounds.maxX) - Number(bounds.minX), Number(bounds.maxY) - Number(bounds.minY)) * 0.45
        ),
      };
      const defaultLayer = context.runtimeScene.getLayer?.("");
      system.layerRenderer = defaultLayer?.getRenderer?.() || null;
      context.shared.system = system;
      return system;
    }

    function runtimeSceneViewportWidth(runtimeScene) {
      return typeof runtimeScene.getViewportWidth === "function"
        ? Math.max(1, runtimeScene.getViewportWidth())
        : 1280;
    }

    function runtimeSceneViewportHeight(runtimeScene) {
      return typeof runtimeScene.getViewportHeight === "function"
        ? Math.max(1, runtimeScene.getViewportHeight())
        : 720;
    }

    function setPhysicsStatic(object, isStatic) {
      if (!object?.hasBehavior?.("Physics2")) return;
      const physics = object.getBehavior("Physics2");
      if (isStatic) physics.setStatic?.();
      physics.setLinearVelocityX?.(0);
      physics.setLinearVelocityY?.(0);
      physics.setAngularVelocity?.(0);
    }

    function configureObject(object, definition, defaults = {}) {
      if (!object) return null;
      const width = Number(
        definition.width ?? definition.size ?? defaults.width ?? defaults.size ?? object.getWidth?.() ?? 64
      );
      const height = Number(
        definition.height ?? definition.size ?? defaults.height ?? defaults.size ?? object.getHeight?.() ?? width
      );
      if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
        object.setSize?.(width, height);
      }
      object.setAngle?.(Number(definition.angle ?? defaults.angle ?? 0));
      object.setZOrder?.(Number(definition.zOrder ?? defaults.zOrder ?? 3));
      object.setOpacity?.(Number(definition.opacity ?? defaults.opacity ?? 255));
      object.hide?.(false);
      moveObjectToCenter(object, Number(definition.x), Number(definition.y));
      object.__headSpaceSharedMultiplayerComponent = definition.id;
      object.__headSpaceSharedMultiplayerType = definition.type;
      return object;
    }

    function deleteOwnedObject(runtimeScene, object) {
      if (!object) return;
      deleteRuntimeObjectTree(runtimeScene, object);
    }

    function createOwnedObject(context, definition, objectName, defaults = {}) {
      const object = createSceneObject(context.runtimeScene, objectName, definition.layer || defaults.layer || "");
      if (!object) throw new Error(`Could not create ${objectName} for ${definition.id}.`);
      object.__headSpaceFrameworkCreated = true;
      configureObject(object, definition, defaults);
      return object;
    }

    function validateLiveObject(runtimeScene, object, id) {
      return () => {
        if (!object || object.isDeleted?.() || object.getWidth?.() <= 0 || object.getHeight?.() <= 0) {
          return `Shared component ${id} is missing or has no visible size.`;
        }
        const allObjects = runtimeScene.getObjects?.(object.getName?.() || "") || [];
        if (allObjects.length && !allObjects.includes(object)) return `Shared component ${id} left the scene unexpectedly.`;
        return true;
      };
    }

    framework.registerFactory("player", (context, definition) => {
      const players = context.runtimeScene.getObjects("Player");
      const participantIndex = Number(definition.participantIndex) || 0;
      let configuredPlayerCount = 1;
      try {
        configuredPlayerCount = Math.min(
          4,
          Math.max(
            1,
            Math.round(
              context.runtimeScene
                .getGame()
                .getVariables()
                .get("MultiplayerPlayerCount")
                .getAsNumber()
            )
          )
        );
      } catch {}
      if (participantIndex >= configuredPlayerCount) {
        return {
          value: { inactive: true, participantIndex },
          validate: () => true,
        };
      }
      let player = players[participantIndex] || null;
      const created = !player;
      if (!player) player = createOwnedObject(context, definition, "Player", { zOrder: layerZOrder.actors });
      else configureObject(player, definition, { zOrder: layerZOrder.actors });
      if (Number(definition.size) > 0) setObjectSizeAndShape(player, Number(definition.size));
      clearObjectMotion(player);
      player.__headSpaceParticipantId = player.__headSpaceParticipantId || `player-${participantIndex + 1}`;
      player.__headSpaceSharedSpawn = { x: Number(definition.x), y: Number(definition.y) };
      ensureMultiplayerParticipantOwnership(context.runtimeScene, context.manifest.id);
      return {
        object: player,
        dispose: created ? () => deleteOwnedObject(context.runtimeScene, player) : null,
        validate: validateLiveObject(context.runtimeScene, player, definition.id),
      };
    });

    framework.registerFactory("enemy", (context, definition) => {
      const enemy = createOwnedObject(context, definition, definition.objectName || "Enemy", {
        size: 80,
        // A player has two registered visual layers (face and helmet). Keep
        // enemy visuals below both layers so an overlap can never bisect the
        // player composite. They remain above walls and obstacles.
        zOrder: layerZOrder.enemyActors,
      });
      const size = Number(definition.size) || Math.max(48, enemy.getWidth?.() || 80);
      setObjectSizeAndShape(enemy, size);
      clearObjectMotion(enemy);
      enemy.__headSpaceSharedOrangeEnemy = definition.variant !== "native";
      const system = getSystem(context);
      system.orangeEnemies.push(enemy);
      return {
        object: enemy,
        dispose: () => deleteOwnedObject(context.runtimeScene, enemy),
        validate: validateLiveObject(context.runtimeScene, enemy, definition.id),
      };
    });

    framework.registerFactory("wall", (context, definition) => {
      let x = Number(definition.x);
      let y = Number(definition.y);
      let angle = Number(definition.angle) || 0;
      let length = Number(definition.length) || 0;
      if (definition.a && definition.b) {
        const dx = Number(definition.b.x) - Number(definition.a.x);
        const dy = Number(definition.b.y) - Number(definition.a.y);
        x = (Number(definition.a.x) + Number(definition.b.x)) * 0.5;
        y = (Number(definition.a.y) + Number(definition.b.y)) * 0.5;
        length = Math.hypot(dx, dy);
        angle = Math.atan2(dy, dx) * 180 / Math.PI;
      }
      const wallDefinition = { ...definition, x, y };
      const wall = createOwnedObject(context, wallDefinition, definition.objectName || "Walls", {
        zOrder: layerZOrder.walls,
      });
      configureMultiplayerMazeWall(
        wall,
        x,
        y,
        length,
        Number(definition.thickness) || 28,
        angle,
        Number(definition.zOrder) || layerZOrder.walls
      );
      // Border walls outline the playable arena, but the space backdrop is
      // intentionally visible beyond them. Letting these walls participate in
      // the lighting mesh projects enormous shadow wedges into that exterior
      // backdrop. They remain fully physical and visible; only their lighting
      // obstacle behavior is disabled.
      disableHiddenHostLighting(wall);
      wall.__headSpaceSharedBorderWall = true;
      wall.setOpacity?.(Number(definition.opacity ?? 150));
      getSystem(context).walls.push(wall);
      return {
        object: wall,
        dispose: () => deleteOwnedObject(context.runtimeScene, wall),
        validate: validateLiveObject(context.runtimeScene, wall, definition.id),
      };
    });

    framework.registerFactory("disappearingWall", (context, definition) => {
      const wallComponent = framework.createComponent("wall", context, {
        ...definition,
        type: "wall",
        opacity: 0,
      });
      const wall = wallComponent.objects[0];
      wall.__headSpaceDestructibleWall = true;
      wall.__headSpaceSharedBorderWall = false;
      const system = getSystem(context);
      const layerName = definition.layer || "";
      const layerRenderer = context.runtimeScene.getLayer(layerName)?.getRenderer?.();
      if (!layerRenderer || typeof PIXI?.Graphics !== "function") {
        throw new Error(`Disappearing wall ${definition.id} requires a PIXI renderer.`);
      }
      const graphic = new PIXI.Graphics();
      graphic.eventMode = "none";
      graphic.position.set(wall.getCenterXInScene(), wall.getCenterYInScene());
      graphic.rotation = (Number(wall.getAngle?.()) || 0) * Math.PI / 180;
      layerRenderer.addRendererObject(graphic, Number(definition.zOrder) || layerZOrder.walls + 0.08);
      const record = {
        wall,
        graphic,
        hits: 0,
        initialColor: Number(definition.color) || 0xff3fae,
        touchingPlayers: new Set(),
        lastHitAtSecondsByPlayer: new Map(),
        fadeStartedAtSeconds: null,
        disableCollisionAtSeconds: null,
      };
      system.destructibleWalls.push(record);
      system.layerName = layerName;
      system.layerRenderer = layerRenderer;
      context.runtimeScene.__headSpaceMultiplayerDestructibleWalls = system.destructibleWalls;
      redrawMultiplayerDestructibleWall(record);
      return {
        objects: wallComponent.objects,
        value: record,
        dispose: () => {
          removeLevelSevenRendererObject(context.runtimeScene, layerName, graphic, false);
          wallComponent.dispose?.();
        },
        validate: wallComponent.validate,
      };
    });

    framework.registerFactory("planet", (context, definition) => {
      if (definition.resource) {
        const component = createPixiBody(context, definition, {
          resource: definition.resource,
          size: Number(definition.size) || 240,
          radiusScale: Number(definition.radiusScale) || 0.44,
          zOrder: layerZOrder.obstacles,
        });
        const body = component.body;
        body.orbitCenterX = Number(definition.orbitCenterX ?? definition.x);
        body.orbitCenterY = Number(definition.orbitCenterY ?? definition.y);
        body.orbitRadius = Math.max(0, Number(definition.orbitRadius) || 0);
        body.orbitRadiusX = Math.max(0, Number(definition.orbitRadiusX) || body.orbitRadius);
        body.orbitRadiusY = Math.max(0, Number(definition.orbitRadiusY) || body.orbitRadius);
        body.orbitSpeed = Number(definition.orbitSpeed) || 0;
        body.orbitPhase = Number(definition.orbitPhase) || 0;
        body.verticalAmplitude = Math.max(0, Number(definition.verticalAmplitude) || 0);
        body.verticalSpeed = Number(definition.verticalSpeed) || 0;
        body.verticalPhase = Number(definition.verticalPhase) || 0;
        getSystem(context).planets.push(body);
        return {
          ...component,
          update: () => {
            const elapsedSeconds = getSystem(context).elapsedSeconds;
            if (body.verticalAmplitude > 0) {
              const phase = body.verticalPhase + elapsedSeconds * body.verticalSpeed;
              body.x = body.orbitCenterX;
              body.y = body.orbitCenterY + Math.sin(phase) * body.verticalAmplitude;
              body.velocityX = 0;
              body.velocityY = Math.cos(phase) * body.verticalAmplitude * body.verticalSpeed;
            } else {
              const angle = body.orbitPhase + elapsedSeconds * body.orbitSpeed;
              const cosine = Math.cos(angle);
              const sine = Math.sin(angle);
              body.x = body.orbitCenterX + cosine * body.orbitRadiusX;
              body.y = body.orbitCenterY + sine * body.orbitRadiusY;
              body.velocityX = -sine * body.orbitRadiusX * body.orbitSpeed;
              body.velocityY = cosine * body.orbitRadiusY * body.orbitSpeed;
            }
            body.sprite.position.set(body.x, body.y);
            body.sprite.rotation = elapsedSeconds * body.angularVelocity;
            body.sprite.width = body.size;
            body.sprite.height = body.size;
            body.sprite.visible = true;
            body.sprite.renderable = true;
            body.sprite.alpha = 1;
            updateLevelSixMoonLightObstacle(
              body.lightObstacle,
              body.x,
              body.y,
              body.lightObstacleRadius,
              context.runtimeScene
            );
            updateLevelSevenSteadyPlanetLight(
              body.steadyLight,
              body.x,
              body.y,
              Number(definition.lightRadius) || body.radius * 3.6
            );
          },
        };
      }
      if (!definition.objectName) throw new Error(`Planet ${definition.id} requires objectName.`);
      const planet = createOwnedObject(context, definition, definition.objectName, {
        zOrder: layerZOrder.obstacles,
      });
      setPhysicsStatic(planet, true);
      const body = {
        key: definition.id,
        object: planet,
        x: Number(definition.x),
        y: Number(definition.y),
        radius: Number(definition.collisionRadius) || Math.min(planet.getWidth(), planet.getHeight()) * 0.43,
        velocityX: 0,
        velocityY: 0,
        lightObstacle: createLevelSixMoonLightObstacle(context.runtimeScene),
      };
      getSystem(context).planets.push(body);
      return {
        object: planet,
        value: body,
        update: () => {
          body.x = planet.getCenterXInScene();
          body.y = planet.getCenterYInScene();
          updateLevelSixMoonLightObstacle(body.lightObstacle, body.x, body.y, body.radius, context.runtimeScene);
        },
        dispose: () => {
          body.lightObstacle?.behavior?.onDestroy?.();
          deleteOwnedObject(context.runtimeScene, planet);
        },
        validate: validateLiveObject(context.runtimeScene, planet, definition.id),
      };
    });

    framework.registerFactory("blackHole", (context, definition) => {
      if (typeof PIXI === "undefined") throw new Error(`Black hole ${definition.id} requires PIXI.`);
      const system = getSystem(context);
      const layerName = definition.layer || "";
      const layerRenderer = context.runtimeScene.getLayer(layerName)?.getRenderer?.();
      if (!layerRenderer) throw new Error(`Black hole ${definition.id} has no renderer for layer ${layerName}.`);
      const size = Number(definition.size) || LEVEL_ELEVEN_BLACK_HOLE_SIZE;
      const sprite = createLevelNineBlackHoleGraphic(
        PIXI.Texture.from(definition.resource || "blackhole.png?v=shared-multiplayer-portals-20260812-1"),
        system.blackHoles.length,
        size
      );
      if (!sprite) throw new Error(`Black hole ${definition.id} could not create its renderer.`);
      layerRenderer.addRendererObject(sprite, Number(definition.zOrder) || layerZOrder.obstacles + 0.15);
      const blackHole = {
        key: definition.id,
        sprite,
        x: Number(definition.x),
        y: Number(definition.y),
        baseY: Number(definition.y),
        size,
        triggerRadius: Number(definition.triggerRadius) || LEVEL_ELEVEN_PORTAL_TRIGGER_RADIUS,
        radius: Number(definition.triggerRadius) || LEVEL_ELEVEN_PORTAL_TRIGGER_RADIUS,
        direction: Number(definition.direction) || (system.blackHoles.length % 2 ? -1 : 1),
        fixed: true,
        velocityX: 0,
        velocityY: 0,
        orbitCenterX: Number(definition.orbitCenterX ?? definition.x),
        orbitCenterY: Number(definition.orbitCenterY ?? definition.y),
        orbitRadiusX: Math.max(0, Number(definition.orbitRadiusX) || Number(definition.orbitRadius) || 0),
        orbitRadiusY: Math.max(0, Number(definition.orbitRadiusY) || Number(definition.orbitRadius) || 0),
        orbitSpeed: Number(definition.orbitSpeed) || 0,
        orbitPhase: Number(definition.orbitPhase) || 0,
      };
      blackHole.collisionProxy = createLevelElevenCollisionProxy(blackHole, definition.id);
      system.blackHoles.push(blackHole);
      system.visualSprites.push(sprite);
      system.layerName = layerName;
      system.layerRenderer = layerRenderer;
      return {
        value: blackHole,
        update: () => {
          if (blackHole.orbitRadiusX > 0 || blackHole.orbitRadiusY > 0) {
            const angle = blackHole.orbitPhase + system.elapsedSeconds * blackHole.orbitSpeed;
            const cosine = Math.cos(angle);
            const sine = Math.sin(angle);
            blackHole.x = blackHole.orbitCenterX + cosine * blackHole.orbitRadiusX;
            blackHole.y = blackHole.orbitCenterY + sine * blackHole.orbitRadiusY;
            blackHole.velocityX = -sine * blackHole.orbitRadiusX * blackHole.orbitSpeed;
            blackHole.velocityY = cosine * blackHole.orbitRadiusY * blackHole.orbitSpeed;
          }
        },
        dispose: () => removeLevelSevenRendererObject(context.runtimeScene, layerName, sprite, false),
        validate: () => sprite.destroyed ? `Shared component ${definition.id} lost its renderer sprite.` : true,
      };
    });

    function updateSharedCelestialVisuals(system) {
      const tintCount = LEVEL_NINE_BLACK_HOLE_TINTS.length;
      for (let i = 0; i < system.blackHoles.length; i++) {
        const blackHole = system.blackHoles[i];
        const pulsePhase = system.elapsedSeconds * 1.85 + i * Math.PI;
        const pulse = 1 + Math.sin(pulsePhase) * 0.055 + Math.sin(pulsePhase * 0.47) * 0.018;
        const coreSprite = blackHole.sprite.__headSpaceSprite || blackHole.sprite;
        blackHole.sprite.position.set(blackHole.x, blackHole.y);
        blackHole.sprite.rotation = 0;
        blackHole.sprite.visible = true;
        blackHole.sprite.renderable = true;
        blackHole.sprite.alpha = 1;
        coreSprite.width = blackHole.size * pulse;
        coreSprite.height = blackHole.size * pulse;
        coreSprite.rotation = system.elapsedSeconds * LEVEL_NINE_BLACK_HOLE_ROTATION_SPEED * blackHole.direction;
        const tintPhase = (system.elapsedSeconds * 0.22 + i * 0.5) % tintCount;
        const tintIndex = Math.floor(tintPhase);
        coreSprite.tint = interpolateLevelNineBlackHoleTint(
          LEVEL_NINE_BLACK_HOLE_TINTS[tintIndex],
          LEVEL_NINE_BLACK_HOLE_TINTS[(tintIndex + 1) % tintCount],
          tintPhase - tintIndex
        );
        const halo = blackHole.sprite.__headSpaceHalo;
        if (halo) {
          halo.scale.set(0.94 + pulse * 0.07);
          halo.alpha = 0.68 + Math.sin(pulsePhase * 1.3) * 0.18;
        }
        const sparkles = blackHole.sprite.__headSpaceSparkles || [];
        for (let sparkleIndex = 0; sparkleIndex < sparkles.length; sparkleIndex++) {
          const sparkle = sparkles[sparkleIndex];
          const phase = sparkle.__headSpacePhase +
            system.elapsedSeconds * (0.7 + (sparkleIndex % 5) * 0.075) * blackHole.direction;
          const orbit = blackHole.size * sparkle.__headSpaceOrbit;
          sparkle.position.set(Math.cos(phase) * orbit, Math.sin(phase) * orbit * 0.82);
          sparkle.alpha = 0.18 +
            (Math.sin(phase * 3.4 + system.elapsedSeconds * 2.6) * 0.5 + 0.5) * 0.82;
          sparkle.scale.set(0.55 + (Math.sin(phase * 2.1) * 0.5 + 0.5) * 0.9);
        }
      }
    }

    function createPixiBody(context, definition, defaults) {
      if (typeof PIXI === "undefined") throw new Error(`${definition.type} ${definition.id} requires PIXI.`);
      const system = getSystem(context);
      const layerName = definition.layer || "";
      const layerRenderer = context.runtimeScene.getLayer(layerName)?.getRenderer?.();
      if (!layerRenderer) throw new Error(`${definition.type} ${definition.id} has no renderer for layer ${layerName}.`);
      const size = Number(definition.size) || defaults.size;
      const sprite = new PIXI.Sprite(PIXI.Texture.from(definition.resource || defaults.resource));
      sprite.anchor?.set?.(0.5);
      sprite.position.set(Number(definition.x), Number(definition.y));
      sprite.width = size;
      sprite.height = size;
      sprite.rotation = Number(definition.rotation) || 0;
      sprite.eventMode = "none";
      sprite.__headSpaceEmitsLight = definition.emitsLight === true;
      const rendererZOrder = Number(definition.zOrder) || defaults.zOrder;
      layerRenderer.addRendererObject(sprite, rendererZOrder);
      system.layerName = layerName;
      system.layerRenderer = layerRenderer;
      system.visualSprites.push(sprite);
      const body = {
        key: definition.id,
        sprite,
        size,
        x: Number(definition.x),
        y: Number(definition.y),
        baseY: Number(definition.y),
        radius: Number(definition.collisionRadius) || size * defaults.radiusScale,
        lightObstacleRadius: Number(definition.lightObstacleRadiusRatio) > 0
          ? size * Number(definition.lightObstacleRadiusRatio)
          : Number(definition.collisionRadius) || size * defaults.radiusScale,
        velocityX: 0,
        velocityY: 0,
        rotation: sprite.rotation,
        angularVelocity: Number(definition.angularVelocity) || 0,
        bobAmplitude: Number(definition.bobAmplitude) || 0,
        bobSpeed: Number(definition.bobSpeed) || 0.72,
        bobPhase: Number(definition.bobPhase) || 0,
        nextShotAt: Number(definition.firstShotSeconds) || 2.4,
        fireIntervalSeconds: Math.max(0.4, Number(definition.fireIntervalSeconds) || 0),
        firesProjectiles: definition.firesProjectiles === true,
        targetNearestPlayer: definition.targetNearestPlayer === true,
        // A light centered inside its own obstacle is fully occluded by the
        // lighting mesh. Luminous bodies therefore emit without registering a
        // colocated obstacle; non-luminous bodies still cast planet shadows.
        lightObstacle: definition.emitsLight === true
          ? null
          : createLevelSixMoonLightObstacle(context.runtimeScene),
        steadyLight: definition.emitsLight === true
          ? createLevelSevenSteadyPlanetLight(
              layerRenderer,
              rendererZOrder - 0.08,
              definition.lightColor || "75;175;255"
            )
          : null,
      };
      body.collisionProxy = createLevelElevenCollisionProxy(body, definition.id);
      return {
        body,
        sprite,
        dispose: () => {
          body.lightObstacle?.behavior?.onDestroy?.();
          if (body.steadyLight) {
            removeLevelSevenRendererObject(
              context.runtimeScene,
              layerName,
              body.steadyLight,
              false
            );
          }
          removeLevelSevenRendererObject(context.runtimeScene, layerName, sprite, false);
        },
        validate: () => sprite.destroyed ? `Shared component ${definition.id} lost its renderer sprite.` : true,
      };
    }

    framework.registerFactory("station", (context, definition) => {
      const component = createPixiBody(context, definition, {
        resource: LEVEL_EIGHT_STATION_RESOURCE,
        size: 180,
        radiusScale: LEVEL_ELEVEN_STATION_RADIUS / LEVEL_ELEVEN_STATION_SIZE,
        zOrder: layerZOrder.obstacles,
      });
      const body = component.body;
      body.orbitCenterX = Number(definition.orbitCenterX ?? definition.x);
      body.orbitCenterY = Number(definition.orbitCenterY ?? definition.y);
      body.orbitRadiusX = Math.max(0, Number(definition.orbitRadiusX) || Number(definition.orbitRadius) || 0);
      body.orbitRadiusY = Math.max(0, Number(definition.orbitRadiusY) || Number(definition.orbitRadius) || 0);
      body.orbitSpeed = Number(definition.orbitSpeed) || 0;
      body.orbitPhase = Number(definition.orbitPhase) || 0;
      getSystem(context).stations.push(component.body);
      return {
        ...component,
        update: () => {
          if (body.orbitRadiusX > 0 || body.orbitRadiusY > 0) {
            const elapsedSeconds = getSystem(context).elapsedSeconds;
            const angle = body.orbitPhase + elapsedSeconds * body.orbitSpeed;
            const cosine = Math.cos(angle);
            const sine = Math.sin(angle);
            body.x = body.orbitCenterX + cosine * body.orbitRadiusX;
            body.y = body.orbitCenterY + sine * body.orbitRadiusY;
            body.velocityX = -sine * body.orbitRadiusX * body.orbitSpeed;
            body.velocityY = cosine * body.orbitRadiusY * body.orbitSpeed;
          }
          body.sprite.position.set(body.x, body.y);
          body.sprite.rotation = getSystem(context).elapsedSeconds * body.angularVelocity;
          updateLevelSixMoonLightObstacle(
            body.lightObstacle,
            body.x,
            body.y,
            body.lightObstacleRadius,
            context.runtimeScene
          );
        },
      };
    });

    framework.registerFactory("triexo", (context, definition) => {
      const component = createPixiBody(context, definition, {
        resource: LEVEL_ELEVEN_TRIEXO_RESOURCE,
        size: LEVEL_ELEVEN_TRIEXO_SIZE,
        radiusScale: LEVEL_ELEVEN_TRIEXO_RADIUS / LEVEL_ELEVEN_TRIEXO_SIZE,
        zOrder: layerZOrder.obstacles,
      });
      getSystem(context).triexos.push(component.body);
      return component;
    });

    framework.registerFactory("boost", (context, definition) => {
      const system = getSystem(context);
      const layerName = definition.layer || "";
      const layerRenderer = context.runtimeScene.getLayer(layerName)?.getRenderer?.();
      if (!layerRenderer || typeof PIXI?.Graphics !== "function") {
        throw new Error(`Boost ${definition.id} requires a PIXI renderer.`);
      }
      const width = Number(definition.width) || 190;
      const height = Number(definition.height) || 75;
      const directionAngle = Number(definition.angle) || 0;
      const directionRadians = directionAngle * Math.PI / 180;
      const anchoredAtBase = definition.anchorAtBase === true;
      const graphic = new PIXI.Graphics();
      graphic.eventMode = "none";
      graphic.alpha = clamp(Number(definition.opacity ?? 178) / 255, 0, 1);
      graphic.position.set(Number(definition.x), Number(definition.y));
      graphic.rotation = directionRadians;
      const strokeWidth = Math.max(3, height * 0.055);
      const chevronSpan = width * 0.2;
      const startX = anchoredAtBase ? width * 0.08 : -width * 0.47;
      graphic.lineStyle(strokeWidth, Number(definition.color) || 0x46ff7b, 0.96);
      for (let index = 0; index < 5; index++) {
        const x = startX + index * width * 0.185;
        graphic.moveTo(x, -height * 0.34);
        graphic.lineTo(x + chevronSpan, 0);
        graphic.lineTo(x, height * 0.34);
      }
      if (anchoredAtBase) {
        graphic.beginFill(Number(definition.anchorColor) || 0x7b149e, 0.96);
        graphic.drawCircle(0, 0, Math.max(12, height * 0.22));
        graphic.endFill();
      }
      layerRenderer.addRendererObject(graphic, Number(definition.zOrder) || layerZOrder.effects);
      const boost = {
        id: definition.id,
        graphic,
        x: Number(definition.x),
        y: Number(definition.y),
        width,
        height,
        anchoredAtBase,
        baseAngle: directionRadians,
        sweepRadians: Math.abs(Number(definition.sweepDegrees) || 0) * Math.PI / 180,
        sweepSpeed: Number(definition.sweepSpeed) || 0.32,
        sweepPhase: Number(definition.sweepPhase) || 0,
        currentAngle: directionRadians,
        directionX: Number.isFinite(Number(definition.directionX))
          ? Number(definition.directionX)
          : Math.cos(directionRadians),
        directionY: Number.isFinite(Number(definition.directionY))
          ? Number(definition.directionY)
          : Math.sin(directionRadians),
        speed: Number(definition.speed) || 760,
      };
      // Shared multiplayer boosts use the same visual path as the authored
      // levels. Keep the scene so a boost can construct its helmet-scaled
      // particle emitter on the correct live renderer layer.
      system.runtimeScene = context.runtimeScene;
      system.layerName = layerName;
      system.layerRenderer = layerRenderer;
      system.boosts.push(boost);
      if (!system.lightningGraphic) {
        system.lightningGraphic = new PIXI.Graphics();
        system.lightningGraphic.eventMode = "none";
        system.lightningGraphic.blendMode = PIXI.BLEND_MODES.ADD;
        layerRenderer.addRendererObject(system.lightningGraphic, layerZOrder.effects + 0.2);
      }
      if (!system.lightningOverlayGraphic) {
        system.lightningOverlayGraphic = new PIXI.Graphics();
        system.lightningOverlayGraphic.eventMode = "none";
        system.lightningOverlayGraphic.blendMode = PIXI.BLEND_MODES.ADD;
        try {
          const BlurFilter = PIXI.filters?.BlurFilter || PIXI.BlurFilter;
          if (typeof BlurFilter === "function") {
            const blur = new BlurFilter(2.5, 2);
            blur.padding = 18;
            system.lightningOverlayGraphic.filters = [blur];
          }
        } catch {}
        // `drawLevelFiveBoostLightning` raises this glow and the particle
        // container above the player each active frame. Shared multiplayer
        // previously omitted this object, so that render attachment block was
        // skipped even though the emitter itself was simulating correctly.
        layerRenderer.addRendererObject(system.lightningOverlayGraphic, layerZOrder.effects + 0.22);
      }
      return {
        value: boost,
        dispose: () => removeLevelSevenRendererObject(context.runtimeScene, layerName, graphic, false),
        validate: () => graphic.destroyed ? `Shared boost ${definition.id} lost its renderer graphic.` : true,
      };
    });

    framework.registerFactory("light", (context, definition) => {
      const light = createOwnedObject(context, definition, definition.objectName || "Light1", {
        layer: definition.layer || "Lighting",
        zOrder: layerZOrder.underlay,
      });
      light.setColor?.(definition.color || "255;255;255");
      light.setRadius?.(Number(definition.radius) || 600);
      light.setZOrder?.(Number(definition.zOrder) || layerZOrder.underlay);
      const value = {
        object: light,
        x: Number(definition.x),
        y: Number(definition.y),
        color: definition.color || "255;255;255",
        radius: Number(definition.radius) || 600,
        followComponent: definition.followComponent || null,
      };
      getSystem(context).lights.push(value);
      return {
        object: light,
        value,
        update: () => {
          if (value.followComponent) {
            const body = getSystem(context).planets.find((planet) => planet.key === value.followComponent);
            if (body) {
              value.x = body.x;
              value.y = body.y;
            }
          }
          moveObjectToCenter(light, value.x, value.y);
          light.setColor?.(value.color);
          light.setRadius?.(value.radius);
          light.hide?.(false);
        },
        dispose: () => deleteOwnedObject(context.runtimeScene, light),
        validate: () => light?.isDeleted?.()
          ? `Shared light ${definition.id} left the scene unexpectedly.`
          : true,
      };
    });

    framework.installRuntimeAdapter({
      beforeBuild(context) {
        if (context.manifest.status !== "ready" || context.manifest.implementation !== "declarative") return;
        const keepPlayers = new Set(context.runtimeScene.getObjects("Player").slice(0, context.manifest.playerSpawns.length));
        const namesToClear = [
          "Enemy", "EnemyImage", "SmartEnemy", "SmartEnemyImage", "Walls", "Boost",
          // Clear every authored scene light before declarative planet-following
          // lights are built. Leaving Light3/Light4 alive produced shadows whose
          // direction pointed toward an unrelated legacy source offscreen.
          "Light1", "Light2", "Light3", "Light4",
          ...PLANET_NAMES,
        ];
        for (const name of namesToClear) {
          for (const object of context.runtimeScene.getObjects(name).slice()) {
            if (!keepPlayers.has(object)) deleteRuntimeObjectTree(context.runtimeScene, object);
          }
        }
        for (const player of context.runtimeScene.getObjects("Player").slice(context.manifest.playerSpawns.length)) {
          deleteRuntimeObjectTree(context.runtimeScene, player);
        }
      },
      afterBuild(context) {
        if (context.manifest.status !== "ready" || context.manifest.implementation !== "declarative") return;
        const system = getSystem(context);
        context.runtimeScene.__headSpaceSharedDeclarativeMultiplayerSystem = system;
        context.runtimeScene.__headSpaceMultiplayerDestructibleWalls = system.destructibleWalls;
        ensureMultiplayerParticipantOwnership(context.runtimeScene, context.manifest.id);
        for (const record of system.destructibleWalls) redrawMultiplayerDestructibleWall(record);
      },
      afterUpdate(context) {
        if (context.manifest.status !== "ready" || context.manifest.implementation !== "declarative") return;
        const system = getSystem(context);
        // Portal animation transforms are temporary renderer-only effects.
        // Restore the authored composite before calculating the next frame so
        // M6 uses the same non-accumulating intake/exit animation as the
        // established single-player black holes.
        restoreLevelNinePortalVisuals(system);
        const paused = getSceneBoolean(context.runtimeScene, "Paused");
        const sceneStateForMultiplayer = sceneState.get(context.runtimeScene);
        const finished =
          sceneStateForMultiplayer?.multiplayerOutcomeAuthorized === true &&
          (getSceneBoolean(context.runtimeScene, "LevelWon") ||
            getSceneBoolean(context.runtimeScene, "LevelLost"));
        const rawDeltaSeconds = context.runtimeScene.getElapsedTime() / 1000;
        const deltaSeconds = !paused && !finished && Number.isFinite(rawDeltaSeconds)
          ? clamp(rawDeltaSeconds, 0, 0.05)
          : 0;
        system.elapsedSeconds += deltaSeconds;
        for (const boost of system.boosts) {
          boost.currentAngle = boost.baseAngle +
            Math.sin(system.elapsedSeconds * boost.sweepSpeed + boost.sweepPhase) * boost.sweepRadians;
          boost.directionX = Math.cos(boost.currentAngle);
          boost.directionY = Math.sin(boost.currentAngle);
          boost.graphic.rotation = boost.currentAngle;
          boost.graphic.position.set(boost.x, boost.y);
        }
        for (const station of system.stations) {
          // Orbiting stations are positioned by their component update. The
          // legacy station bob pass must not overwrite the orbital Y position
          // on the final frame.
          if (station.orbitRadiusX > 0 || station.orbitRadiusY > 0) {
            updateLevelSixMoonLightObstacle(
              station.lightObstacle,
              station.x,
              station.y,
              station.radius,
              context.runtimeScene
            );
            continue;
          }
          const phase = system.elapsedSeconds * station.bobSpeed + station.bobPhase;
          station.y = station.baseY + Math.sin(phase) * station.bobAmplitude;
          station.velocityY = Math.cos(phase) * station.bobAmplitude * station.bobSpeed;
          station.sprite.position.set(station.x, station.y);
          station.sprite.rotation = Math.sin(phase * 0.63) * 0.035;
          updateLevelSixMoonLightObstacle(station.lightObstacle, station.x, station.y, station.radius, context.runtimeScene);
        }
        updateLevelElevenTriexos(context.runtimeScene, system, deltaSeconds);
        updateSharedCelestialVisuals(system);
        updateLevelElevenPortalTeleport(context.runtimeScene, system, deltaSeconds);
        if (system.stations.some((station) => station.firesProjectiles)) {
          const passiveStations = system.stations.filter((station) => !station.firesProjectiles);
          system.stations = system.stations.filter((station) => station.firesProjectiles);
          updateLevelElevenStationProjectiles(context.runtimeScene, system, deltaSeconds);
          system.stations.push(...passiveStations);
        }
        applyLevelElevenBodyCollisions(context.runtimeScene, system);
        const boostActors = ["Player", "Enemy", "SmartEnemy"]
          .flatMap((name) => context.runtimeScene.getObjects(name));
        for (const actor of boostActors) {
          // Every registered boost is owned by the canonical Level 5 lifecycle
          // in applySharedMultiplayerBoostEffects. Do not let this old
          // velocity-only path bypass its launch, animation, and cleanup.
          if (system.boosts.length) break;
          if (!actor?.hasBehavior?.("Physics2")) continue;
          for (const boost of system.boosts) {
            const triggerCenterX = boost.x +
              (boost.anchoredAtBase ? boost.directionX * boost.width * 0.5 : 0);
            const triggerCenterY = boost.y +
              (boost.anchoredAtBase ? boost.directionY * boost.width * 0.5 : 0);
            const relativeX = actor.getCenterXInScene() - triggerCenterX;
            const relativeY = actor.getCenterYInScene() - triggerCenterY;
            const localX = relativeX * boost.directionX + relativeY * boost.directionY;
            const localY = -relativeX * boost.directionY + relativeY * boost.directionX;
            if (
              Math.abs(localX) > boost.width * 0.5 ||
              Math.abs(localY) > boost.height * 0.65
            ) continue;
            const physics = actor.getBehavior("Physics2");
            const speed = Math.max(boost.speed, getObjectVelocity(actor).speed);
            physics.setLinearVelocityX?.(boost.directionX * speed);
            physics.setLinearVelocityY?.(boost.directionY * speed);
          }
        }
        syncMultiplayerLevelFourOrangeEnemyVisuals(context.runtimeScene, system);
        updateMultiplayerDestructibleWalls(context.runtimeScene, system);
        updateMultiplayerBlueWallFeedback(context.runtimeScene, context.manifest.id);
        ensureMultiplayerParticipantOwnership(context.runtimeScene, context.manifest.id);
      },
      beforeLeave(context) {
        const system = context.shared.system;
        if (!system?.frameworkOwned) return;
        for (const projectile of (system.projectiles || []).slice()) {
          removeLevelEightStationProjectile(context.runtimeScene, system, projectile);
        }
        context.runtimeScene.__headSpaceSharedDeclarativeMultiplayerSystem = null;
        context.runtimeScene.__headSpaceMultiplayerDestructibleWalls = null;
        if (context.runtimeScene.__headSpaceBoostRegistry?.system === system) {
          context.runtimeScene.__headSpaceBoostRegistry = null;
        }
      },
      validate(context) {
        if (context.manifest.status !== "ready" || context.manifest.implementation !== "declarative") return null;
        const errors = [];
        const system = context.shared.system;
        if (!system?.frameworkOwned) errors.push(`M${context.manifest.id} did not create its shared runtime system.`);
        const declaredWalls = context.manifest.components.filter((item) => item.type === "wall" || item.type === "disappearingWall").length;
        if ((system?.walls.length || 0) !== declaredWalls) errors.push(`M${context.manifest.id} wall inventory does not match its manifest.`);
        return { errors };
      },
    });
    return true;
  }

  installPlayerCompositePlaceImageGuard();
  installSharedMultiplayerLevelFactories();
  installMultiplayerDomInputShield();
  installSfxVolumeCaps();
  installLevelOverRetryLobbyGuard();
  installBossExternalLayoutBootstrap();
  installBossSceneInstanceCountBootstrapRescue();
  installAuthoredLevelFiveBossWinHotfix();
  installProtectedAbsorbFiltering();
  gdjs.registerRuntimeScenePreEventsCallback(onScenePreEvents);
  gdjs.registerRuntimeSceneLoadedCallback(onSceneLoaded);
  gdjs.registerRuntimeScenePostEventsCallback(onScenePostEvents);
  // Native events and the main patch pass can resize/move the player companions.
  // Reapply the custom texture last so the face uses the helmet's final transform
  // on the very first gameplay frame as well as every frame after it.
  gdjs.registerRuntimeScenePostEventsCallback((runtimeScene) => {
    removeNonFrameworkDeclarativeActors(runtimeScene, getCurrentLevel(runtimeScene));
    ensureMultiplayerParticipantOwnership(runtimeScene, getCurrentLevel(runtimeScene));
    removeKnightHelmetFromSelection(runtimeScene);
    const multiplayerLevelFourSystem =
      multiplayerLevelFourHoneycombState.get(runtimeScene);
    if (
      multiplayerLevelFourSystem &&
      Number(getCurrentLevel(runtimeScene)) === 4 &&
      isMultiplayerGame(runtimeScene, 4)
    ) {
      applyLevelElevenBodyCollisions(runtimeScene, multiplayerLevelFourSystem);
      syncMultiplayerLevelFourOrangeEnemyVisuals(
        runtimeScene,
        multiplayerLevelFourSystem
      );
    }
    const sharedMultiplayerSystem =
      runtimeScene.__headSpaceSharedDeclarativeMultiplayerSystem;
    if (sharedMultiplayerSystem) {
      // syncAbsorbVisuals intentionally shows and wiggles EnemyImage companions.
      // Shared multiplayer enemies use a dedicated PIXI sprite instead, so hide
      // those companions again in the final render pass to prevent a second,
      // deforming enemy from appearing behind the authoritative visual.
      syncMultiplayerLevelFourOrangeEnemyVisuals(
        runtimeScene,
        sharedMultiplayerSystem
      );
    }
    applySharedMultiplayerBoostEffects(runtimeScene, sharedMultiplayerSystem);
    if (sharedMultiplayerSystem?.blackHoles?.length >= 2) {
      updateLevelElevenPortalTeleport(
        runtimeScene,
        sharedMultiplayerSystem,
        clamp(runtimeScene.getElapsedTime?.() / 1000 || 0, 0, 0.05)
      );
    }
    if (
      isMultiplayerGame(runtimeScene, getCurrentLevel(runtimeScene)) &&
      sharedMultiplayerSystem?.planets?.length
    ) {
      // Resolve moving-planet contact after native movement and physics events,
      // so the player cannot be placed back inside a planet later in the frame.
      applyLevelElevenBodyCollisions(runtimeScene, sharedMultiplayerSystem);
    }
    // This must be the last actor-position correction of the frame. Running it
    // before boosts or moving-body collision resolution allowed those later
    // systems to put hostile actors back on top of one another.
    resolveMultiplayerEnemyOverlaps(runtimeScene);
    enforceGameplayHelmetOcclusion(runtimeScene);
    // Size and center the GDevelop companions before installing the custom
    // 512px face texture. Calling setSize after the texture transform marks the
    // renderer dirty and makes GDevelop rebuild the face anchor down-right.
    applyGameplayHelmetCoverScale(runtimeScene);
    synchronizePlayerCollisionWithVisibleDiameter(runtimeScene);
    applyCustomPlayerTexture(runtimeScene);
    reapplyBlackHolePortalCompanionVisual(runtimeScene);
    lockGameplayPlayerCosmeticComposites(runtimeScene);
    // The composite lock establishes the final shared position and rotation;
    // reapply only the intentional boost scale deformation afterward.
    reapplyLevelFiveBoostCompanionWarpAfterLayout(runtimeScene);
    reapplyBoostCompanionWarpAfterLayout(sharedMultiplayerSystem);
    syncMultiplayerActorLightObstacles(runtimeScene);
  });
})();
