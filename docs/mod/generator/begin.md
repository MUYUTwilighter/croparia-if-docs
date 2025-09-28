

### Minecraft Lifecycle

To understand how the generator works, you need to understand the Minecraft lifecycle (A simplified one).

**Client**:
1. **mod init** - If you are using fabric/forge/neoforge (probably), the mod loader will initialize before the game starts.
2. **init** - The client is starting up, **the resource pack is being loaded, and something related to world-gen is also loaded from the datapack.**
3. **launched** - The client is fully started. This is when you see the main menu.
4. **starting** - Joining a world by starting an integrated server, **all datapack & resource pack are reloaded.**
5. **started** - The world is loaded and the server is started, and the game is ready to play.

**Server**:
1. **mod init** - Similar to the client, the mod loader initializes before the server starts.
2. **init** - The server is starting up, no resource pack will be loaded, **but the datapack is loaded for the world-gen features.**
3. **launched** - Basic server data like registries are prepared, but the world is not loaded yet.
4. **starting** - The server is starting the world, **all datapack are reloaded.**
5. **started** - The world is loaded, and the server is ready to play.

As you can see, the resource pack will be fully loaded at least twice before the world is loaded,
while the datapack is only fully loaded once when the world is starting.

### Generator Lifecycle

The Generator API listens all the resource pack & datapack loading, injects file packs into the loading process, and
triggers data generation.

As we mentioned above, the datapack is only fully loaded when the world is starting, that means we do not have
access to the tag system until the world is started. However, something has to access the tag system to generate
recipes, loot tables, etc. (e.g. the crops). So, Croparia IF will launch an extra reload for datapack when the world is
started.
