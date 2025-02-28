CREATE TABLE "campaign" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar NOT NULL,
  "description" varchar,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "area" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar NOT NULL,
  "campaign_id" UUID NOT NULL,
  "type_id" UUID NOT NULL
);

CREATE TABLE "area_type" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar NOT NULL
);

CREATE TABLE "map" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "area_id" UUID NOT NULL,
  "title" varchar NOT NULL,
  "size_grid" integer,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "riddle" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "map_id" UUID NOT NULL,
  "title" varchar NOT NULL,
  "description" varchar,
  "image" BYTEA,
  "notes" varchar
);

CREATE TABLE "enemy" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "map_id" UUID NOT NULL,
  "name" varchar NOT NULL
);

CREATE TABLE "character" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "campaign_id" UUID NOT NULL,
  "first_name" varchar NOT NULL,
  "last_name" varchar,
  "race_id" UUID NOT NULL,
  "alignment_id" UUID NOT NULL,
  "hit_points_total" integer,
  "hit_points_current" integer,
  "hit_points_temporary" integer,
  "armor_class" integer,
  "isNPC" boolean
);

CREATE TABLE "race" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar NOT NULL
);

CREATE TABLE "class" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar NOT NULL
);

CREATE TABLE "alignment" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar NOT NULL
);

CREATE TABLE "character_class" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "character_id" UUID NOT NULL,
  "class_id" UUID NOT NULL,
  "level" integer NOT NULL,
  FOREIGN KEY ("character_id") REFERENCES "character" ("id"),
  FOREIGN KEY ("class_id") REFERENCES "class" ("id")
);

CREATE TABLE "ability_score" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "character_id" UUID NOT NULL,
  "strength" integer,
  "dexterity" integer,
  "constitution" integer,
  "intelligence" integer,
  "wisdom" integer,
  "charisma" integer
);

CREATE TABLE "saving_throw" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "character_id" UUID NOT NULL,
  "paralyzation" integer,
  "poison" integer,
  "death" integer,
  "petrification" integer,
  "polymorph" integer,
  "breath_weapon" integer,
  "spell" integer
);

CREATE TABLE "character_spell" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "character_id" UUID NOT NULL,
  "spell_id" UUID NOT NULL,
  "hasLearned" boolean
);

CREATE TABLE "spell" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar,
  "school_id" UUID NOT NULL,
  "level" integer,
  "description" varchar
);

CREATE TABLE "school" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar
);

CREATE TABLE "item" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar,
  "character_inventory_id" UUID
);

CREATE TABLE "item_property" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "item_id" UUID NOT NULL,
  "ac" integer,
  "ac_magical" integer,
  "save_adjustment" integer,
  "immunity_disease" boolean,
  "immunity_poison" boolean,
  "immunity_charm" boolean,
  "weight" float
);

CREATE TABLE "character_inventory" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "character_id" UUID NOT NULL
);


ALTER TABLE "area" ADD FOREIGN KEY ("campaign_id") REFERENCES "campaign" ("id") ON DELETE CASCADE;
ALTER TABLE "area" ADD FOREIGN KEY ("type_id") REFERENCES "area_type" ("id") ON DELETE CASCADE;
ALTER TABLE "map" ADD FOREIGN KEY ("area_id") REFERENCES "area" ("id") ON DELETE CASCADE;
ALTER TABLE "riddle" ADD FOREIGN KEY ("map_id") REFERENCES "map" ("id") ON DELETE CASCADE;
ALTER TABLE "enemy" ADD FOREIGN KEY ("map_id") REFERENCES "map" ("id") ON DELETE CASCADE;
ALTER TABLE "character" ADD FOREIGN KEY ("campaign_id") REFERENCES "campaign" ("id") ON DELETE CASCADE;
ALTER TABLE "character" ADD FOREIGN KEY ("race_id") REFERENCES "race" ("id") ON DELETE CASCADE;
ALTER TABLE "character" ADD FOREIGN KEY ("alignment_id") REFERENCES "alignment" ("id") ON DELETE CASCADE;
ALTER TABLE "character_class" ADD FOREIGN KEY ("character_id") REFERENCES "character" ("id") ON DELETE CASCADE;
ALTER TABLE "character_class" ADD FOREIGN KEY ("class_id") REFERENCES "class" ("id") ON DELETE CASCADE;
ALTER TABLE "ability_score" ADD FOREIGN KEY ("character_id") REFERENCES "character" ("id") ON DELETE CASCADE;
ALTER TABLE "saving_throw" ADD FOREIGN KEY ("character_id") REFERENCES "character" ("id") ON DELETE CASCADE;
ALTER TABLE "character_spell" ADD FOREIGN KEY ("character_id") REFERENCES "character" ("id") ON DELETE CASCADE;
ALTER TABLE "character_spell" ADD FOREIGN KEY ("spell_id") REFERENCES "spell" ("id") ON DELETE CASCADE;
ALTER TABLE "spell" ADD FOREIGN KEY ("school_id") REFERENCES "school" ("id") ON DELETE CASCADE;
ALTER TABLE "item" ADD FOREIGN KEY ("character_inventory_id") REFERENCES "character_inventory" ("id") ON DELETE CASCADE;
ALTER TABLE "item_property" ADD FOREIGN KEY ("item_id") REFERENCES "item" ("id") ON DELETE CASCADE;
ALTER TABLE "character_inventory" ADD FOREIGN KEY ("character_id") REFERENCES "character" ("id") ON DELETE CASCADE;


