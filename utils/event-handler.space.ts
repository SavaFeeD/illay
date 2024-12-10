interface Action {
  name: string;
  handler: Function;
};

export default class SpaceEvents {
  private static actionList: Action[] = [];

  public static on(name: string, handler: Function) {
    SpaceEvents.actionList.push({ name, handler });
    SpaceEvents.addGlobalSubscriber({ name, handler });
  }

  private static addGlobalSubscriber(action: Action) {
    document.addEventListener('keyup', (event) => {
      if (event.code === 'Space') {
        action.handler();
      }
    });
  }
}