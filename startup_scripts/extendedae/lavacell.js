StartupEvents.modifyCreativeTab('extendedae:tab_main', event => {
    const lavaCell = Item.of(
      'extendedae:infinity_cell',
      '{record:{"#c":"ae2:f",id:"minecraft:lava"}}'
    );
    event.add(lavaCell);
  });