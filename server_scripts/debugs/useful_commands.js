/** @param {Internal.CommandContext<Internal.CommandSourceStack>} ctx*/
function runCommand(ctx, command) {
  return ctx.source.player.runCommand(command);
}
/**
 * @param {Internal.CommandContext<Internal.CommandSourceStack>} ctx
 * @param {"creative"|"survival"|"adventure"|"spectator"} name
 */
function gamemode(ctx, name) {
  return runCommand(ctx, `gamemode ${name} @s`);
}
const commands = {
  gc: (ctx) => gamemode(ctx, "creative"),
  gs: (ctx) => gamemode(ctx, "survival"),
  ga: (ctx) => gamemode(ctx, "adventure"),
  gsp: (ctx) => gamemode(ctx, "spectator"),
  /*g: {
    1: (ctx) => gamemode(ctx, "creative"),
    2: (ctx) => gamemode(ctx, "survival"),
    3: (ctx) => gamemode(ctx, "adventure"),
    4: (ctx) => gamemode(ctx, "spectator"),
  },
  /** @param {Internal.CommandContext<Internal.CommandSourceStack>} ctx*/
  r: (ctx) => {
    return ctx.source.player.runCommand("reload");
  },
  /** @param {Internal.CommandContext<Internal.CommandSourceStack>} ctx*/
  cl: (ctx) => {
    return ctx.source.player.runCommand("clear @s");
  },
  /** @param {Internal.CommandContext<Internal.CommandSourceStack>} ctx*/
  hand: (ctx) => {
    return ctx.source.player.runCommand("kubejs hand");
  },
  /** @param {Internal.CommandContext<Internal.CommandSourceStack>} ctx*/
  h: (ctx) => {
    const player = ctx.source.player;
    const id = player.mainHandItem.id;
    //ctx.source.sendSuccessも、player.sendChatMessageも失敗したため苦肉の策
    player.runCommand(
      `tellraw @s ${Component.string(id)
        .hover("Click to copy")
        .clickCopy(id)
        .toJson()
        .toString()}`
    );
    return 1;
  },
};

/**
 * @template T
 * @param {T[]} arr
 * @returns {T}
 */
function head(arr) {
  return arr[arr.length - 1];
}

/**
 * @param {(arg0: string)=> Internal.LiteralArgumentBuilder<Internal.CommandSourceStack>} literal
 * @param {function|object} sections
 * @param {(Internal.LiteralArgumentBuilder_<Internal.CommandSourceStack>)[]?} registerLitrals
 * @return {Internal.LiteralArgumentBuilder<Internal.CommandSourceStack>[]}
 */
function readCommandsSection(literal, sections, registerLitrals, retList) {
  retList = [];
  if (typeof sections === "function") {
    console.log(registerLitrals.length);
    return [head(registerLitrals).executes(sections)];
  } else {
    for (const section in sections) {
      //kubejsはクソ古いJavaScriptなので最新のモダンな文法が使えない
      //また、なぜか再帰処理する関数内で変数を定義すると再定義で死ぬので(本来のJSは死なない)関数を使用すう
      //pushを使わないのは、元の配列に変更を加えたくないため
      ((newRegistLit) => {
        //コマンドの最初か、引数か
        if (!!registerLitrals) {
          //引数
          newRegistLit.push(
            head(registerLitrals).then(literal(section.toString()))
          );
        } else {
          newRegistLit.push(literal(section.toString())); //最初
          console.log(`Registing Command /${section}`);
        }
        readCommandsSection(literal, sections[section], newRegistLit).forEach(
          (e) => retList.push(e)
        );
      })((registerLitrals ?? []).map((e) => e));
    }
    return retList;
  }
}
ServerEvents.commandRegistry((event) => {
  readCommandsSection(event.commands.literal, commands).forEach((literal) => {
    event.register(literal);
  });
  //HACK:commandsのオブジェクトでは動作しなかったためここに個別で筆記している
  //[HACK]のコメントは「一時的な回避策や、理想的ではない実装を示す。より良い解決策の検討が必要」ということを意味します
  const { commands: Commands, arguments: Arguments } = event;
  event.register(
    Commands.literal("g") // The name of the command
      .requires((s) => s.hasPermission(2)) // Check if the player has operator privileges
      .then(
        Commands.argument("gamemode", Arguments.INTEGER.create(event)).executes(
          (c) => {
            const gnum = Arguments.INTEGER.getResult(c, "gamemode");
            const ACTIONS = {
              1: (ctx) => gamemode(ctx, "creative"),
              2: (ctx) => gamemode(ctx, "survival"),
              3: (ctx) => gamemode(ctx, "adventure"),
              4: (ctx) => gamemode(ctx, "spectator"),
            };
            ACTIONS[gnum](c);
            return 1;
          }
        )
      )
  );
});
