// prettier-ignore
export const appUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_URL_PROD
    : process.env.NEXT_URL_DEV;

// prettier-ignore
export const characterImages = new Map([
  ["BOWSER", { portrait: "portrait_bowser.png", icon: "bowser.png" }],
  ["CAPTAIN_FALCON", { portrait: "portrait_captain_falcon.png", icon: "falcon.png" }],
  ["DR_MARIO", { portrait: "portrait_doctor_mario.png", icon: "doc.png" }],
  ["DONKEY_KONG", { portrait: "portrait_donkey_kong.png", icon: "dk.png" }],
  ["FALCO", { portrait: "portrait_falco.png", icon: "falco.png" }],
  ["FOX", { portrait: "portrait_fox.png", icon: "fox.png" }],
  ["GAME_AND_WATCH", { portrait: "portrait_game_and_watch.png", icon: "gnw.png" }],
  ["GANONDORF", { portrait: "portrait_ganondorf.png", icon: "ganon.png" }],
  ["ICE_CLIMBERS", { portrait: "portrait_ice_climbers.png", icon: "cancer.png" }],
  ["JIGGLYPUFF", { portrait: "portrait_jigglypuff.png", icon: "puff.png" }],
  ["KIRBY", { portrait: "portrait_kirby.png", icon: "kirby.png" }],
  ["LINK", { portrait: "portrait_link.png", icon: "link.png" }],
  ["LUIGI", { portrait: "portrait_luigi.png", icon: "luigi.png" }],
  ["MARIO", { portrait: "portrait_mario.png", icon: "mario.png" }],
  ["MARTH", { portrait: "portrait_marth.png", icon: "marth.png" }],
  ["MEWTWO", { portrait: "portrait_mewtwo.png", icon: "mewtwo.png" }],
  ["NESS", { portrait: "portrait_ness.png", icon: "ness.png" }],
  ["PEACH", { portrait: "portrait_peach.png", icon: "peach.png" }],
  ["PICHU", { portrait: "portrait_pichu.png", icon: "pichu.png" }],
  ["PIKACHU", { portrait: "portrait_pikachu.png", icon: "pika.png" }],
  ["ROY", { portrait: "portrait_roy.png", icon: "roy.png" }],
  ["SAMUS", { portrait: "portrait_samus.png", icon: "samus.png" }],
  ["SHEIK", { portrait: "portrait_sheik.png", icon: "sheik.png" }],
  ["YOSHI", { portrait: "portrait_yoshi.png", icon: "yoshi.png" }],
  ["YOUNG_LINK", { portrait: "portrait_young_link.png", icon: "ylink.png" }],
  ["ZELDA", { portrait: "portrait_zelda.png", icon: "zelda.png" }],
]);
