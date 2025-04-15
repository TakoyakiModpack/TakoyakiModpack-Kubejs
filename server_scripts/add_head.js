const HEADS = {
  AM_107ryu: "advancedperipherals:overpowered_husbandry_automata_core",
};
ServerEvents.recipes((event) => {
  for (const mcid in HEADS) {
    const itemId = HEADS[mcid];
    event.shapeless(
      Item.withNBT("minecraft:player_head", { SkullOwner: mcid }),
      ["#forge:heads", itemId]
    );
  }
});
