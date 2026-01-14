-- Magic Missile (Arcane)
INSERT INTO spell (
    name, school_id, sphere_id, casting_time, range, area_of_effect,
    saving_throw, reversible, is_priest_spell, is_arcane_spell, description
)
VALUES (
    'Magic Missile',
    (SELECT id FROM school WHERE name = 'Invocation / Evocation'),
    NULL,
    1,
    '60 yards + 10 yards/level',
    'One or more creatures',
    'None',
    FALSE,
    FALSE,
    TRUE,
    'Creates one or more magical missiles that automatically hit and deal 1d4+1 damage each.'
);

-- Cure Light Wounds (Priest)
INSERT INTO spell (
    name, school_id, sphere_id, casting_time, range, area_of_effect,
    saving_throw, reversible, is_priest_spell, is_arcane_spell, description
)
VALUES (
    'Cure Light Wounds',
    NULL,
    (SELECT id FROM sphere WHERE name = 'Healing'),
    5,
    'Touch',
    'Creature touched',
    'None',
    TRUE,
    TRUE,
    FALSE,
    'Heals 1d8 points of damage. The reverse, Cause Light Wounds, inflicts 1d8 points of damage.'
);

-- Bless (Priest)
INSERT INTO spell (
    name, school_id, sphere_id, casting_time, range, area_of_effect,
    saving_throw, reversible, is_priest_spell, is_arcane_spell, description
)
VALUES (
    'Bless',
    NULL,
    (SELECT id FROM sphere WHERE name = 'All'),
    1,
    '60 feet',
    '50-foot cube',
    'None',
    TRUE,
    TRUE,
    FALSE,
    'Grants +1 to attack rolls and saving throws against fear. The reverse, Bane, penalizes enemies.'
);

-- Fireball (Arcane)
INSERT INTO spell (
    name, school_id, sphere_id, casting_time, range, area_of_effect,
    saving_throw, reversible, is_priest_spell, is_arcane_spell, description
)
VALUES (
    'Fireball',
    (SELECT id FROM school WHERE name = 'Invocation / Evocation'),
    NULL,
    3,
    '10 yards/level',
    '20-foot radius sphere',
    '½',
    FALSE,
    FALSE,
    TRUE,
    'A burst of fire inflicts 1d6 damage per caster level (max 10d6) within the area.'
);
