ServerEvents.recipes(event => {
    const roundShaped = (output, base, around) => event.shaped(
      output,
      [
        'AAA',
        'ABA',
        'AAA',
      ],
      {
        A: around,
        B: base,
      },
    );
  
    roundShaped('64x kubejs:raw_ore_base', 'ae2:singularity', '#forge:raw_materials');
  
    Ingredient.of('#forge:raw_materials').stacks.forEach((rawMaterial) => {
      const [namespace, path] = rawMaterial.id.split(':');
      const materialName = path.replace('raw_', '');
      const essenceId = `mysticalagriculture:${materialName}_essence`;
  
      if (!Item.exists(essenceId)) {
        console.warn(`Missing Essence: ${essenceId}`);
        return;
      }
  
      roundShaped(rawMaterial, 'kubejs:raw_ore_base', essenceId);
    });
  });