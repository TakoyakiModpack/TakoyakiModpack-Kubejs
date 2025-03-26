ServerEvents.recipes(event => {
    event.remove({ id: 'create:iron_sheet' });
    event.shapeless('create:iron_sheet', [
        'minecraft:iron_ingot'
    ])
})