(function (root) {
  "use strict";

  const framework = root.headSpaceMultiplayerFramework;
  if (!framework) throw new Error("HEADNAUT multiplayer framework must load before level manifests.");

  // M5-M12 are layout-only levels. Their camera, HUD, player selection,
  // collisions, absorption, enemy glow, pause navigation, and cleanup all come
  // from the shared multiplayer framework and runtime component factories.
  const WORLD_WIDTH = 4000;
  const WORLD_HEIGHT = 2600;
  const VIEWBOX_WIDTH = 100;
  const VIEWBOX_HEIGHT = 64;
  const WALL_THICKNESS = 36;
  const ARENA_BOUNDS = Object.freeze({ minX: 0, minY: 0, maxX: WORLD_WIDTH, maxY: WORLD_HEIGHT });
  // Equal arc-length points for M10's 1660 x 1040 ellipse. Equal angle steps
  // bunch objects near the flatter top/bottom portions of a non-circular path.
  const M10_EVEN_ORBIT_PHASES = Object.freeze([
    0,
    0.893814526,
    Math.PI / 2,
    Math.PI - 0.893814526,
    Math.PI,
    Math.PI + 0.893814526,
    Math.PI * 1.5,
    Math.PI * 2 - 0.893814526,
  ]);

  function point(x, y) {
    return Object.freeze({ x: Number(x), y: Number(y) });
  }

  function ellipsePoints(centerX, centerY, radiusX, radiusY, segments = 32) {
    return Array.from({ length: segments }, (_, index) => {
      const angle = -Math.PI * 0.5 + index * Math.PI * 2 / segments;
      return point(centerX + Math.cos(angle) * radiusX, centerY + Math.sin(angle) * radiusY);
    });
  }

  function disappearingPolyline(id, points, thickness = 44) {
    return points.slice(0, -1).map((a, index) => {
      const b = points[index + 1];
      return {
        id: `${id}-${String(index + 1).padStart(2, "0")}`,
        type: "disappearingWall",
        x: (a[0] + b[0]) * 0.5,
        y: (a[1] + b[1]) * 0.5,
        a: point(a[0], a[1]),
        b: point(b[0], b[1]),
        thickness,
        color: 0xff3fae,
        zOrder: 2.65,
      };
    });
  }

  function subdividedLine(start, end, segmentCount) {
    return Array.from({ length: segmentCount + 1 }, (_, index) => {
      const ratio = index / segmentCount;
      return [
        start[0] + (end[0] - start[0]) * ratio,
        start[1] + (end[1] - start[1]) * ratio,
      ];
    });
  }

  function toWorld(source) {
    return point(
      source.x / VIEWBOX_WIDTH * WORLD_WIDTH,
      source.y / VIEWBOX_HEIGHT * WORLD_HEIGHT
    );
  }

  function createBorderWalls(level, previewPoints) {
    const worldPoints = previewPoints.map(toWorld);
    return worldPoints.map((a, index) => {
      const b = worldPoints[(index + 1) % worldPoints.length];
      return {
        id: `m${level}-border-${String(index + 1).padStart(2, "0")}`,
        type: "wall",
        x: (a.x + b.x) * 0.5,
        y: (a.y + b.y) * 0.5,
        a,
        b,
        thickness: WALL_THICKNESS,
        opacity: 150,
      };
    });
  }

  function createWorldBorderWalls(level, worldPoints) {
    return worldPoints.map((a, index) => {
      const b = worldPoints[(index + 1) % worldPoints.length];
      return {
        id: `m${level}-border-${String(index + 1).padStart(2, "0")}`,
        type: "wall",
        x: (a.x + b.x) * 0.5,
        y: (a.y + b.y) * 0.5,
        a,
        b,
        thickness: WALL_THICKNESS,
        opacity: 150,
      };
    });
  }

  const ENEMY_LAYOUT = Object.freeze([
    point(1350, 650), point(2000, 580), point(2650, 650),
    point(1500, 1030), point(2000, 900), point(2500, 1030),
    point(1500, 1570), point(2000, 1700), point(2500, 1570),
    point(1350, 1950), point(2000, 2020), point(2650, 1950),
  ]);
  const ENEMY_SIZES = Object.freeze([58, 68, 78, 88, 64, 74, 84, 60, 70, 80, 66, 76]);

  function createEnemies(level, positions = ENEMY_LAYOUT) {
    return positions.map((position, index) => ({
      id: `m${level}-enemy-${String(index + 1).padStart(2, "0")}`,
      type: "enemy",
      x: position.x,
      y: position.y,
      size: ENEMY_SIZES[index],
      variant: "orange",
    }));
  }

  function createReadyLevel(level, definition) {
    const previewPoints = definition.previewPoints;
    const worldPoints = definition.arenaPoints || previewPoints.map(toWorld);
    const borderWalls = definition.arenaPoints
      ? createWorldBorderWalls(level, worldPoints)
      : createBorderWalls(level, previewPoints);
    return framework.createLevelTemplate(level, {
      name: `Multiplayer ${level}`,
      status: "ready",
      implementation: "declarative",
      inheritSharedRules: true,
      componentRequirements: ["player", "enemy", "wall", ...(definition.componentRequirements || [])],
      borderPreview: {
        viewBox: "0 0 100 64",
        paths: [definition.previewPath],
      },
      arena: {
        bounds: { ...ARENA_BOUNDS },
        spawnPadding: 120,
        borderPoints: worldPoints,
      },
      playerSpawns: [
        { id: `m${level}-player-1`, x: 1120, y: 1300, radius: 62 },
        { id: `m${level}-player-2`, x: 2880, y: 1300, radius: 62 },
      ],
      components: [
        ...borderWalls,
        ...createEnemies(level, definition.enemyLayout || ENEMY_LAYOUT),
        ...(definition.components || []),
      ],
    });
  }

  const levelDefinitions = Object.freeze({
    5: {
      previewPath: "M15 7H85L94 16V48L85 57H15L6 48V16Z",
      previewPoints: [
        point(15, 7), point(85, 7), point(94, 16), point(94, 48),
        point(85, 57), point(15, 57), point(6, 48), point(6, 16),
      ],
      componentRequirements: ["planet", "boost"],
      components: [
        {
          id: "m5-planet4-left",
          type: "planet",
          resource: "Planet4.png?v=multiplayer-m5-moving-planets-20260806-1",
          x: 700,
          y: 1300,
          size: 1320,
          // Planet4's opaque disc occupies about 91% of its square texture.
          // Keep contact on the visible surface instead of the outer image box.
          collisionRadius: 600,
          verticalAmplitude: 850,
          verticalSpeed: 0.12,
          verticalPhase: -1.5707963267948966,
          angularVelocity: 0.035,
        },
        {
          id: "m5-planet2-right",
          type: "planet",
          resource: "Planet2.png?v=multiplayer-m5-moving-planets-20260806-1",
          x: 3300,
          y: 1300,
          size: 1320,
          // Planet2 has substantially more transparent padding than Planet4.
          collisionRadius: 556,
          verticalAmplitude: 850,
          verticalSpeed: 0.12,
          verticalPhase: 1.5707963267948966,
          angularVelocity: -0.035,
        },
        {
          id: "m5-boost-top-right",
          type: "boost",
          x: 1700,
          y: 430,
          width: 360,
          height: 110,
          angle: 0,
          speed: 760,
        },
        {
          id: "m5-boost-bottom-left",
          type: "boost",
          x: 2300,
          y: 2170,
          width: 360,
          height: 110,
          angle: 180,
          speed: 760,
        },
      ],
    },
    6: {
      previewPath: "M22 7H78L94 32L78 57H22L6 32Z",
      previewPoints: [
        point(22, 7), point(78, 7), point(94, 32),
        point(78, 57), point(22, 57), point(6, 32),
      ],
      componentRequirements: ["planet", "blackHole", "light"],
      components: [
        {
          id: "m6-sun",
          type: "planet",
          resource: "thesun.png?v=multiplayer-m6-solar-system-20260812-1",
          x: 2000,
          y: 1300,
          size: 500,
          collisionRadius: 218,
          angularVelocity: 0.025,
          emitsLight: true,
          lightColor: "255;205;95",
          lightRadius: 1500,
        },
        {
          id: "m6-planet5",
          type: "planet",
          resource: "Planet5.png?v=multiplayer-m6-solar-system-20260812-1",
          x: 2520,
          y: 1300,
          size: 270,
          collisionRadius: 118,
          orbitCenterX: 2000,
          orbitCenterY: 1300,
          orbitRadius: 520,
          orbitSpeed: 0.5,
          orbitPhase: 0,
          angularVelocity: 0.04,
        },
        {
          id: "m6-planet6",
          type: "planet",
          resource: "Planet6.png?v=multiplayer-m6-solar-system-20260812-1",
          x: 1480,
          y: 1300,
          size: 250,
          collisionRadius: 108,
          orbitCenterX: 2000,
          orbitCenterY: 1300,
          orbitRadius: 520,
          orbitSpeed: 0.36,
          orbitPhase: 3.141592653589793,
          angularVelocity: -0.035,
        },
        {
          id: "m6-black-hole-left",
          type: "blackHole",
          x: 600,
          y: 1300,
          size: 300,
          triggerRadius: 130,
          direction: 1,
        },
        {
          id: "m6-black-hole-right",
          type: "blackHole",
          x: 3400,
          y: 1300,
          size: 300,
          triggerRadius: 130,
          direction: -1,
        },
        {
          id: "m6-sun-light",
          type: "light",
          objectName: "Light1",
          x: 2000,
          y: 1300,
          color: "255;205;95",
          radius: 1750,
        },
      ],
    },
    7: {
      previewPath: "M20 5H80V59H20Z",
      previewPoints: [point(20, 5), point(80, 5), point(80, 59), point(20, 59)],
      // A true world-space square: using the preview coordinates directly
      // would be distorted by the 4000x2600 camera world.
      arenaPoints: [point(850, 150), point(3150, 150), point(3150, 2450), point(850, 2450)],
      componentRequirements: ["triexo", "station"],
      enemyLayout: [
        point(1230, 520), point(1600, 440), point(2000, 430), point(2400, 440), point(2580, 690),
        point(1230, 2080), point(1600, 2160), point(2000, 2170), point(2400, 2160), point(2770, 2080),
        point(1080, 980), point(2920, 980),
      ],
      components: [
        // Interlocking triangular cells form the central pinwheel/tessellated
        // array from the supplied reference.
        { id: "m7-triexo-01", type: "triexo", x: 1830, y: 940, size: 176, rotation: 0 },
        { id: "m7-triexo-02", type: "triexo", x: 2000, y: 940, size: 176, rotation: 120 },
        { id: "m7-triexo-03", type: "triexo", x: 2170, y: 940, size: 176, rotation: 240 },
        { id: "m7-triexo-04", type: "triexo", x: 1745, y: 1090, size: 176, rotation: 240 },
        { id: "m7-triexo-05", type: "triexo", x: 1915, y: 1090, size: 176, rotation: 0 },
        { id: "m7-triexo-06", type: "triexo", x: 2085, y: 1090, size: 176, rotation: 120 },
        { id: "m7-triexo-07", type: "triexo", x: 2255, y: 1090, size: 176, rotation: 240 },
        { id: "m7-triexo-08", type: "triexo", x: 1660, y: 1240, size: 176, rotation: 120 },
        { id: "m7-triexo-09", type: "triexo", x: 1830, y: 1240, size: 176, rotation: 240 },
        { id: "m7-triexo-10", type: "triexo", x: 2000, y: 1240, size: 176, rotation: 0 },
        { id: "m7-triexo-11", type: "triexo", x: 2170, y: 1240, size: 176, rotation: 120 },
        { id: "m7-triexo-12", type: "triexo", x: 2340, y: 1240, size: 176, rotation: 240 },
        { id: "m7-triexo-13", type: "triexo", x: 1745, y: 1390, size: 176, rotation: 0 },
        { id: "m7-triexo-14", type: "triexo", x: 1915, y: 1390, size: 176, rotation: 120 },
        { id: "m7-triexo-15", type: "triexo", x: 2085, y: 1390, size: 176, rotation: 240 },
        { id: "m7-triexo-16", type: "triexo", x: 2255, y: 1390, size: 176, rotation: 0 },
        { id: "m7-triexo-17", type: "triexo", x: 1830, y: 1540, size: 176, rotation: 120 },
        { id: "m7-triexo-18", type: "triexo", x: 2000, y: 1540, size: 176, rotation: 240 },
        { id: "m7-triexo-19", type: "triexo", x: 2170, y: 1540, size: 176, rotation: 0 },
        {
          id: "m7-station-top-right", type: "station", x: 2860, y: 440, size: 245,
          firesProjectiles: true, targetNearestPlayer: true, firstShotSeconds: 1.5, fireIntervalSeconds: 6,
        },
        {
          id: "m7-station-bottom-left", type: "station", x: 1140, y: 2160, size: 245,
          firesProjectiles: true, targetNearestPlayer: true, firstShotSeconds: 3.3, fireIntervalSeconds: 6,
        },
      ],
    },
    8: {
      previewPath: "M50 5C73 5 92 17 92 32S73 59 50 59 8 47 8 32 27 5 50 5Z",
      previewPoints: ellipsePoints(50, 32, 42, 27, 32),
      componentRequirements: ["planet", "boost"],
      components: [
        {
          id: "m8-planet2",
          type: "planet",
          resource: "Planet2.png?v=multiplayer-m8-planets-20260805-1",
          x: 920,
          y: 1660,
          size: 430,
          collisionRadius: 188,
          angularVelocity: 0.045,
        },
        {
          id: "m8-planet9",
          type: "planet",
          resource: "Planet9.png?v=multiplayer-m8-planets-20260805-1",
          x: 3070,
          y: 1600,
          size: 470,
          collisionRadius: 205,
          angularVelocity: -0.038,
        },
        {
          id: "m8-planet7",
          type: "planet",
          resource: "Planet7.png?v=multiplayer-m8-planets-20260805-1",
          x: 2000,
          y: 650,
          size: 440,
          collisionRadius: 192,
          angularVelocity: 0.052,
        },
        {
          id: "m8-boost-left",
          type: "boost",
          x: 360,
          y: 1300,
          width: 310,
          height: 90,
          angle: 0,
          anchorAtBase: true,
          sweepDegrees: 60,
          sweepSpeed: 0.32,
          sweepPhase: 0,
          speed: 760,
        },
        {
          id: "m8-boost-right",
          type: "boost",
          x: 3640,
          y: 1300,
          width: 310,
          height: 90,
          angle: 180,
          anchorAtBase: true,
          sweepDegrees: 60,
          sweepSpeed: 0.32,
          sweepPhase: 2.0943951023931953,
          speed: 760,
        },
        {
          id: "m8-boost-bottom",
          type: "boost",
          x: 2000,
          y: 2320,
          width: 310,
          height: 90,
          angle: -90,
          anchorAtBase: true,
          sweepDegrees: 60,
          sweepSpeed: 0.32,
          sweepPhase: 4.1887902047863905,
          speed: 760,
        },
      ],
    },
    9: {
      previewPath: "M8 12H35V6H65V12H92V52H65V58H35V52H8Z",
      previewPoints: [
        point(8, 12), point(35, 12), point(35, 6), point(65, 6),
        point(65, 12), point(92, 12), point(92, 52), point(65, 52),
        point(65, 58), point(35, 58), point(35, 52), point(8, 52),
      ],
      componentRequirements: ["planet", "light"],
      components: [
        {
          id: "m9-planet4-center",
          type: "planet",
          resource: "Planet4.png?v=multiplayer-m9-center-20260815-1",
          x: 2000,
          y: 1300,
          size: 650,
          collisionRadius: 290,
          // Pink core: a calm, short vertical drift through the middle lane.
          verticalAmplitude: 280,
          verticalSpeed: 0.23,
          verticalPhase: 0,
          angularVelocity: -0.032,
          emitsLight: true,
          lightColor: "255;92;185",
          lightRadius: 1120,
        },
        {
          id: "m9-planet6-right",
          type: "planet",
          resource: "Planet6.png?v=multiplayer-m9-sides-20260815-1",
          x: 3300,
          y: 1300,
          size: 500,
          collisionRadius: 220,
          // Pale-green right planet: the quickest, widest vertical pass.
          verticalAmplitude: 410,
          verticalSpeed: 0.41,
          verticalPhase: 2.0943951023931953,
          angularVelocity: 0.042,
          emitsLight: true,
          lightColor: "166;255;180",
          lightRadius: 920,
        },
        {
          id: "m9-planet8-left",
          type: "planet",
          resource: "Planet8.png?v=multiplayer-m9-sides-20260815-1",
          x: 700,
          y: 1300,
          size: 520,
          collisionRadius: 230,
          // Blue left planet: an independent medium-speed vertical pass.
          verticalAmplitude: 360,
          verticalSpeed: 0.32,
          verticalPhase: 4.1887902047863905,
          angularVelocity: -0.038,
          emitsLight: true,
          lightColor: "75;170;255",
          lightRadius: 980,
        },
        // Real Lighting-layer sources follow the moving bodies.  Their
        // matching planet light-obstacle proxies create the cast shadows.
        {
          id: "m9-planet4-pink-light",
          type: "light",
          objectName: "Light1",
          x: 2000,
          y: 1300,
          followComponent: "m9-planet4-center",
          color: "255;92;185",
          radius: 1120,
        },
        {
          id: "m9-planet6-green-light",
          type: "light",
          objectName: "Light2",
          x: 3300,
          y: 1300,
          followComponent: "m9-planet6-right",
          color: "166;255;180",
          radius: 920,
        },
        {
          id: "m9-planet8-blue-light",
          type: "light",
          objectName: "Light3",
          x: 700,
          y: 1300,
          followComponent: "m9-planet8-left",
          color: "75;170;255",
          radius: 980,
        },
      ],
    },
    10: {
      previewPath: "M50 4C75 4 94 16 94 32S75 60 50 60 6 48 6 32 25 4 50 4Z",
      previewPoints: ellipsePoints(50, 32, 44, 28, 36),
      componentRequirements: ["planet", "blackHole"],
      components: [
        ["m10-planet14", "Planet14.png", 1],
        ["m10-planet1", "Planet1.png", 2],
        ["m10-planet5", "Planet5.png", 3],
        ["m10-planet6", "Planet6.png", 5],
        ["m10-planet7", "Planets\\Planet7.png", 6],
        ["m10-planet3", "Planet3.png", 7],
      ].map(([id, resource, orbitSlot], index) => ({
        id,
        type: "planet",
        resource,
        x: 2000,
        y: 1300,
        size: 220,
        collisionRadius: 94,
        lightObstacleRadiusRatio: 0.39,
        orbitCenterX: 2000,
        orbitCenterY: 1300,
        // Follow one shared clockwise ellipse just inside the arena wall.
        orbitRadiusX: 1660,
        orbitRadiusY: 1040,
        orbitSpeed: 0.105,
        orbitPhase: M10_EVEN_ORBIT_PHASES[orbitSlot],
        angularVelocity: index % 2 === 0 ? 0.055 : -0.055,
      })).concat([
        {
          id: "m10-black-hole-a",
          type: "blackHole",
          resource: "blackhole.png?v=m10-moving-pair-20260817-1",
          x: 2000,
          y: 1300,
          size: 250,
          triggerRadius: 112,
          direction: 1,
          orbitCenterX: 2000,
          orbitCenterY: 1300,
          orbitRadiusX: 1660,
          orbitRadiusY: 1040,
          orbitSpeed: 0.105,
          orbitPhase: 0,
        },
        {
          id: "m10-black-hole-b",
          type: "blackHole",
          resource: "blackhole.png?v=m10-moving-pair-20260817-1",
          x: 2000,
          y: 1300,
          size: 250,
          triggerRadius: 112,
          direction: -1,
          orbitCenterX: 2000,
          orbitCenterY: 1300,
          orbitRadiusX: 1660,
          orbitRadiusY: 1040,
          orbitSpeed: 0.105,
          orbitPhase: Math.PI,
        },
      ]),
    },
    11: {
      previewPath: "M50 4L82 14 96 43 69 59H31L4 43 18 14Z",
      previewPoints: [
        point(50, 4), point(82, 14), point(96, 43), point(69, 59),
        point(31, 59), point(4, 43), point(18, 14),
      ],
      componentRequirements: ["disappearingWall", "planet", "station"],
      components: [
        ...disappearingPolyline(
          "m11-divider-top",
          subdividedLine([2000, 1300], [2000, 162], 4)
        ),
        ...disappearingPolyline(
          "m11-divider-left",
          subdividedLine([2000, 1300], [160, 1747], 6)
        ),
        ...disappearingPolyline(
          "m11-divider-right",
          subdividedLine([2000, 1300], [3840, 1747], 6)
        ),
        {
          id: "m11-planet13-left",
          type: "planet",
          resource: "Planet13.png?v=m11-three-chambers-20260818-1",
          x: 1030,
          y: 900,
          size: 430,
          collisionRadius: 185,
          angularVelocity: -0.035,
        },
        {
          id: "m11-planet4-right",
          type: "planet",
          resource: "Planet4.png",
          x: 2970,
          y: 900,
          size: 430,
          collisionRadius: 185,
          angularVelocity: 0.04,
        },
        {
          id: "m11-planet7-bottom",
          type: "planet",
          resource: "Planets\\Planet7.png",
          x: 2000,
          y: 2075,
          size: 430,
          collisionRadius: 185,
          angularVelocity: -0.038,
        },
        {
          id: "m11-planet11-moon",
          type: "planet",
          resource: "Planet11.png",
          x: 3290,
          y: 900,
          size: 145,
          collisionRadius: 62,
          orbitCenterX: 2970,
          orbitCenterY: 900,
          orbitRadius: 320,
          orbitSpeed: 0.19,
          orbitPhase: 0,
          angularVelocity: -0.11,
        },
        {
          id: "m11-planet3-moon",
          type: "planet",
          resource: "Planet3.png",
          x: 1685,
          y: 2075,
          size: 140,
          collisionRadius: 60,
          orbitCenterX: 2000,
          orbitCenterY: 2075,
          orbitRadius: 315,
          orbitSpeed: -0.205,
          orbitPhase: Math.PI,
          angularVelocity: 0.12,
        },
        {
          id: "m11-station-moon",
          type: "station",
          x: 1030,
          y: 1225,
          size: 180,
          collisionRadius: 76,
          orbitCenterX: 1030,
          orbitCenterY: 900,
          orbitRadius: 325,
          orbitSpeed: -0.28,
          orbitPhase: Math.PI / 2,
          angularVelocity: 0.055,
          firesProjectiles: true,
          targetNearestPlayer: true,
          firstShotSeconds: 1.4,
          fireIntervalSeconds: 4.2,
        },
      ],
    },
    12: {
      previewPath: "M38 4H62L77 10 90 21 96 32 90 43 77 54 62 60H38L23 54 10 43 4 32 10 21 23 10Z",
      previewPoints: [
        point(38, 4), point(62, 4), point(77, 10), point(90, 21),
        point(96, 32), point(90, 43), point(77, 54), point(62, 60),
        point(38, 60), point(23, 54), point(10, 43), point(4, 32),
        point(10, 21), point(23, 10),
      ],
      componentRequirements: ["planet", "light"],
      components: [
        {
          id: "m12-eye-planet8",
          type: "planet",
          resource: "Planet8.png?v=multiplayer-m12-eye-20260805-1",
          x: 2000,
          y: 1300,
          size: 760,
          collisionRadius: 330,
          angularVelocity: 0.035,
          emitsLight: true,
          lightColor: "55;155;255",
          lightRadius: 1650,
        },
        {
          id: "m12-eye-moon-planet11",
          type: "planet",
          layer: "Texture",
          resource: "Planet11.png?v=multiplayer-m12-eye-20260805-1",
          x: 2540,
          y: 1300,
          size: 190,
          collisionRadius: 82,
          lightObstacleRadiusRatio: 0.32,
          orbitCenterX: 2000,
          orbitCenterY: 1300,
          orbitRadius: 540,
          orbitSpeed: 0.2,
          angularVelocity: -0.12,
        },
        {
          id: "m12-eye-moon-planet3",
          type: "planet",
          layer: "Texture",
          resource: "Planet3.png?v=multiplayer-m12-eye-20260805-1",
          x: 1525,
          y: 1300,
          size: 170,
          collisionRadius: 74,
          lightObstacleRadiusRatio: 0.32,
          orbitCenterX: 2000,
          orbitCenterY: 1300,
          orbitRadius: 475,
          orbitSpeed: -0.235,
          orbitPhase: 3.141592653589793,
          angularVelocity: 0.14,
        },
        {
          id: "m12-eye-planet8-light",
          type: "light",
          objectName: "Light1",
          layer: "Lighting",
          x: 2000,
          y: 1300,
          color: "55;155;255",
          radius: 1650,
          zOrder: 1,
        },
      ],
    },
  });

  const layouts = {};
  for (let level = 5; level <= 12; level++) {
    const manifest = createReadyLevel(level, levelDefinitions[level]);
    layouts[level] = manifest;
    framework.registerLevel(level, manifest);
  }

  root.headSpaceMultiplayerLayouts = Object.freeze(layouts);
})(typeof window !== "undefined" ? window : globalThis);
