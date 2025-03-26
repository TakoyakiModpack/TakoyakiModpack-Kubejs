ServerEvents.recipes(event => {
    console.log('Removing recipe: create:crafting/iron_sheet');
    event.remove({ id: 'create:iron_sheet' });
})